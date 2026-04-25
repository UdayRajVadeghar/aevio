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

## Deploy to Google Cloud Run

Cloud Run is a good fit for this service because ADK sessions are already backed by Vertex AI.

### 1) Build and deploy

Run from the repo root:

```bash
# Build container and push it to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/adk-api services/adk-api/

# Deploy to Cloud Run
gcloud run deploy adk-api \
  --image gcr.io/PROJECT_ID/adk-api \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars "GOOGLE_API_KEY=...,GOOGLE_CLOUD_PROJECT=...,GOOGLE_CLOUD_LOCATION=asia-southeast1,ADK_MODEL=gemini-2.5-flash,SUPABASE_URL=...,SUPABASE_SERVICE_ROLE_KEY=..."
```

### 2) Required environment variables

- `GOOGLE_API_KEY`
- `GOOGLE_CLOUD_PROJECT`
- `GOOGLE_CLOUD_LOCATION` (defaults to `asia-southeast1` if omitted)

### 3) Optional environment variables

- `VERTEX_AGENT_ENGINE_ID`
- `ADK_MODEL`
- `ADK_SYSTEM_PROMPT`
- `ADK_MAX_TOKENS`
- `ADK_TEMPERATURE`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_CONTEXT_TABLE`
- `SUPABASE_USER_ID_COLUMN`
- `SUPABASE_HISTORY_SUMMARY_COLUMN`
- `SUPABASE_CONTEXT_COLUMN`
- `SUPABASE_UPDATED_AT_COLUMN`

For production, prefer Secret Manager for sensitive values instead of inline `--set-env-vars`.

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
