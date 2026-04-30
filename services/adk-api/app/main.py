from fastapi import FastAPI, HTTPException

from .adk_client import AdkCoachService
from .schemas import (
    ChatHistoryResponse,
    ChatListItem,
    ChatMessage,
    ChatRequest,
    ChatResponse,
    EstimateCaloriesRequest,
    EstimateCaloriesResponse,
)
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
        result = await coach_service.chat(
            user_id=payload.userId,
            session_id=payload.sessionId,
            message=payload.message,
            history_summary=payload.historySummary,
            context=payload.context,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"ADK chat failed: {exc}") from exc

    return ChatResponse(
        answer=result["answer"],
        model=result["model"],
        sessionId=result["session_id"],
    )


@app.post("/estimate-calories", response_model=EstimateCaloriesResponse)
async def estimate_calories(payload: EstimateCaloriesRequest):
    try:
        result = await coach_service.estimate_calories(
            user_id=payload.userId,
            profile=payload.profile,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"ADK calorie estimate failed: {exc}"
        ) from exc

    return EstimateCaloriesResponse(
        calories=result["calories"],
        model=result["model"],
    )


@app.get("/chats/{user_id}", response_model=list[ChatListItem])
async def list_chats(user_id: str):
    try:
        return await coach_service.list_chats(user_id)
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Failed to list chats: {exc}"
        ) from exc


@app.delete("/chats/{user_id}/{session_id}")
async def delete_chat(user_id: str, session_id: str):
    try:
        await coach_service.delete_chat(user_id, session_id)
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Failed to delete chat: {exc}"
        ) from exc
    return {"ok": True}


@app.get("/chats/{user_id}/{session_id}", response_model=ChatHistoryResponse)
async def get_chat_history(user_id: str, session_id: str):
    try:
        messages = await coach_service.get_chat_history(user_id, session_id)
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Failed to load chat: {exc}"
        ) from exc

    if not messages:
        raise HTTPException(status_code=404, detail="Chat not found")

    return ChatHistoryResponse(
        sessionId=session_id,
        messages=[ChatMessage(**m) for m in messages],
    )
