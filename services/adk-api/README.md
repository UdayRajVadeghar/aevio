# ADK API

Minimal FastAPI service that hosts your ADK coach for chat-style guidance.

## Do You Need FastAPI?

No, ADK itself does not require FastAPI.  
For this repo, FastAPI is the cleanest way to expose ADK as a stable HTTP service that your Next.js app can call.

## Quick Start

```bash
cd services/adk-api
uv sync
cp .env.example .env
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8010
```

## Endpoints

- `GET /health` - health check
- `POST /chat` - v1 coach chat endpoint

## Request Shape

`POST /chat`

```json
{
  "userId": "user_123",
  "message": "What should I focus on this week?",
  "historySummary": "Last 7 days: average calories 1950...",
  "context": {
    "timezone": "Asia/Kolkata"
  }
}
```

## Notes

- v1 uses root-agent style orchestration (`app/agent.py`) with lightweight sub-agents.
- No tool calls yet; this keeps behavior predictable while matching ADK multi-agent structure.
- Keep the chat contract stable so frontend code does not couple to ADK internals.

