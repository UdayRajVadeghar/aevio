from __future__ import annotations

import os
from typing import Any

from .agent import root_agent
from .settings import settings


class AdkCoachService:
    """
    Thin ADK wrapper for v1 using root-agent style orchestration.
    - Root agent + sub-agents
    - No tool calls
    - Stateless request/response chat
    """

    def __init__(self) -> None:
        os.environ["GOOGLE_API_KEY"] = settings.google_api_key

    async def chat(
        self,
        *,
        user_id: str,
        message: str,
        history_summary: str,
        context: dict[str, Any],
    ) -> str:
        """
        Calls ADK if available. We import ADK at runtime so startup does not fail
        before dependencies are installed in local/dev environments.
        """
        prompt = self._build_prompt(
            user_id=user_id,
            message=message,
            history_summary=history_summary,
            context=context,
        )

        try:
            from google.adk.runners import Runner
            from google.adk.sessions import InMemorySessionService
        except Exception as exc:  # pragma: no cover - dependency/runtime guard
            raise RuntimeError(
                "google-adk is unavailable. Install deps with `uv sync` in services/adk-api."
            ) from exc

        session_service = InMemorySessionService()
        runner = Runner(agent=root_agent, session_service=session_service)

        result = await runner.run_async(
            user_id=user_id,
            session_id=f"{user_id}-aevio-coach",
            new_message=prompt,
        )

        # ADK event payloads can vary by version; this is a defensive extract.
        text = getattr(result, "output_text", None)
        if isinstance(text, str) and text.strip():
            return text.strip()

        fallback_text = str(result).strip()
        if fallback_text:
            return fallback_text

        raise RuntimeError("ADK returned an empty response.")

    def _build_prompt(
        self,
        *,
        user_id: str,
        message: str,
        history_summary: str,
        context: dict[str, Any],
    ) -> str:
        return (
            "User request:\n"
            f"{message}\n\n"
            "User profile context (trusted app data):\n"
            f"userId: {user_id}\n"
            f"context: {context}\n\n"
            "Historical summary (trusted app data):\n"
            f"{history_summary or 'No history summary provided.'}\n\n"
            "Response format:\n"
            "- One short paragraph of advice\n"
            "- Then 2-3 bullet next actions"
        )

