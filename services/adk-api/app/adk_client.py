from __future__ import annotations

import os
import time
import uuid
from datetime import datetime
from typing import Any

from google.adk.events import Event, EventActions
from google.adk.memory import InMemoryMemoryService
from google.adk.runners import Runner
from google.adk.sessions import VertexAiSessionService
from google.genai import types

from .agent import root_agent
from .settings import settings
from .sub_agents.estimate_calories_agent.agent import estimate_calories_agent

APP_NAME = "aevio"
MAX_CHAT_TITLE_LENGTH = 64


def _clean_chat_title(text: str) -> str:
    title = " ".join(text.split())
    if len(title) <= MAX_CHAT_TITLE_LENGTH:
        return title
    return f"{title[: MAX_CHAT_TITLE_LENGTH - 1].rstrip()}..."


def _session_fallback_title(session_id: str, last_update_time: Any) -> str:
    if isinstance(last_update_time, int | float):
        date = datetime.fromtimestamp(last_update_time).strftime("%b %-d")
        return f"Chat from {date}"
    return f"Chat {session_id.removeprefix('chat-')[:8]}"


def _build_user_profile_state(
    context: dict[str, Any] | None,
    history_summary: str,
) -> dict[str, Any]:
    profile = dict(context or {})
    profile["historySummary"] = history_summary
    return profile


class AdkCoachService:
    """
    ADK wrapper with persistent Vertex AI sessions and memory.

    - VertexAiSessionService persists all chat history and agent events
      across requests and server restarts.
    - InMemoryMemoryService provides cross-session recall (swap to
      VertexAiMemoryBankService later for production persistence).
    - Runner is created once; every run_async call with the same
      session_id automatically feeds the agent full conversation history.
    """

    def __init__(self) -> None:
        os.environ["GOOGLE_API_KEY"] = settings.google_api_key

        self._session_service = VertexAiSessionService(
            project=settings.google_cloud_project,
            location=settings.google_cloud_location,
            agent_engine_id=settings.vertex_agent_engine_id or None,
        )

        self._memory_service = InMemoryMemoryService()

        self._runner = Runner(
            app_name=APP_NAME,
            agent=root_agent,
            session_service=self._session_service,
            memory_service=self._memory_service,
        )
        self._estimate_calories_runner = Runner(
            app_name=APP_NAME,
            agent=estimate_calories_agent,
            session_service=self._session_service,
            memory_service=self._memory_service,
        )

    async def chat(
        self,
        *,
        user_id: str,
        session_id: str | None = None,
        message: str,
        history_summary: str = "",
        context: dict[str, Any] | None = None,
    ) -> dict[str, str]:
        if not session_id:
            session_id = f"chat-{uuid.uuid4().hex[:12]}"

        state_delta = {
            "user:profile": _build_user_profile_state(context, history_summary),
            "user:user_id": user_id,
        }

        existing = await self._session_service.get_session(
            app_name=APP_NAME,
            user_id=user_id,
            session_id=session_id,
        )
        if existing is None:
            await self._session_service.create_session(
                app_name=APP_NAME,
                user_id=user_id,
                session_id=session_id,
                state={
                    **state_delta,
                    "chat_title": _clean_chat_title(message),
                },
            )
        else:
            await self._session_service.append_event(
                existing,
                Event(
                    invocation_id=f"context-refresh-{uuid.uuid4().hex[:12]}",
                    author="system",
                    actions=EventActions(state_delta=state_delta),
                    timestamp=time.time(),
                ),
            )

        content = types.Content(
            role="user",
            parts=[types.Part.from_text(text=message)],
        )

        final_text = ""
        async for event in self._runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=content,
        ):
            if not event.is_final_response() or not event.content:
                continue
            parts = event.content.parts or []
            final_text = "\n".join(
                part.text for part in parts if part.text
            ).strip()
            if final_text:
                break

        if not final_text:
            raise RuntimeError("ADK returned an empty response.")

        return {
            "answer": final_text,
            "session_id": session_id,
            "model": settings.adk_model,
        }

    async def estimate_calories(
        self,
        *,
        user_id: str,
        profile: dict[str, Any],
    ) -> dict[str, Any]:
        session_id = f"estimate-calories-{uuid.uuid4().hex[:12]}"
        await self._session_service.create_session(
            app_name=APP_NAME,
            user_id=user_id,
            session_id=session_id,
            state={
                "user:profile": profile,
                "user:user_id": user_id,
            },
        )

        content = types.Content(
            role="user",
            parts=[
                types.Part.from_text(
                    text=(
                        "Estimate this user's daily calorie intake target. "
                        "Respond with only one whole number."
                    )
                )
            ],
        )

        final_text = ""
        async for event in self._estimate_calories_runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=content,
        ):
            if not event.is_final_response() or not event.content:
                continue
            parts = event.content.parts or []
            final_text = "\n".join(
                part.text for part in parts if part.text
            ).strip()
            if final_text:
                break

        digits = "".join(char for char in final_text if char.isdigit())
        if not digits:
            raise RuntimeError("ADK returned an invalid calorie estimate.")

        calories = int(digits)
        if calories < 500 or calories > 10000:
            raise RuntimeError("ADK calorie estimate was outside the valid range.")

        return {
            "calories": calories,
            "model": settings.adk_model,
        }

    async def list_chats(self, user_id: str) -> list[dict[str, Any]]:
        result = await self._session_service.list_sessions(
            app_name=APP_NAME,
            user_id=user_id,
        )

        chats: list[dict[str, Any]] = []
        for session in result.sessions:
            state = getattr(session, "state", None) or {}
            title = state.get("chat_title", "")

            if not title:
                for ev in session.events or []:
                    if ev.content and ev.content.role == "user" and ev.content.parts:
                        title = _clean_chat_title(ev.content.parts[0].text or "")
                        break

            chats.append({
                "session_id": session.id,
                "preview": title
                or _session_fallback_title(session.id, session.last_update_time),
                "last_update": session.last_update_time,
            })

        return chats

    async def delete_chat(self, user_id: str, session_id: str) -> bool:
        await self._session_service.delete_session(
            app_name=APP_NAME,
            user_id=user_id,
            session_id=session_id,
        )
        return True

    async def get_chat_history(
        self, user_id: str, session_id: str
    ) -> list[dict[str, Any]]:
        session = await self._session_service.get_session(
            app_name=APP_NAME,
            user_id=user_id,
            session_id=session_id,
        )
        if session is None:
            return []

        messages: list[dict[str, Any]] = []
        for ev in session.events:
            if not ev.content or not ev.content.parts:
                continue
            text = "\n".join(
                part.text for part in ev.content.parts if part.text
            ).strip()
            if not text or ev.content.role not in ("user", "model"):
                continue
            messages.append({
                "role": "user" if ev.content.role == "user" else "assistant",
                "content": text,
                "timestamp": ev.timestamp,
                "author": ev.author,
            })

        return messages
