from fastapi import FastAPI, HTTPException

from .adk_client import AdkCoachService
from .schemas import ChatRequest, ChatResponse
from .settings import settings

app = FastAPI(title="Aevio ADK API")
coach_service = AdkCoachService()


@app.get("/")
async def root():
    return {"service": "adk-api", "status": "ok"}


@app.get("/health")
async def health():
    return {"ok": True, "model": settings.adk_model}


@app.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    try:
        answer = await coach_service.chat(
            user_id=payload.userId,
            message=payload.message,
            history_summary=payload.historySummary,
            context=payload.context,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"ADK chat failed: {exc}") from exc

    return ChatResponse(answer=answer, model=settings.adk_model)

