from __future__ import annotations

import uuid

from google.genai import types


async def web_search(query: str) -> str:
    """Search the web for general information and return a concise summary."""
    from google.adk.agents import Agent
    from google.adk.runners import Runner
    from google.adk.sessions import InMemorySessionService
    from google.adk.tools import google_search

    search_agent = Agent(
        name="web_search_internal",
        model="gemini-2.5-flash",
        instruction=(
            "You are a web research specialist. "
            "Use google search to find concise, reliable information for the given query. "
            "Return a short, factual summary with sources where possible."
        ),
        tools=[google_search],
    )

    session_service = InMemorySessionService()
    runner = Runner(
        app_name="aevio_web_search",
        agent=search_agent,
        session_service=session_service,
    )

    session_id = f"ws-{uuid.uuid4().hex[:8]}"
    user_id = "tool"

    await session_service.create_session(
        app_name="aevio_web_search",
        user_id=user_id,
        session_id=session_id,
    )

    content = types.Content(
        role="user",
        parts=[types.Part.from_text(text=query)],
    )

    result = ""
    async for event in runner.run_async(
        user_id=user_id,
        session_id=session_id,
        new_message=content,
    ):
        if not event.is_final_response() or not event.content:
            continue
        parts = event.content.parts or []
        result = "\n".join(p.text for p in parts if p.text).strip()
        if result:
            break

    return result or "No results found."
