from typing import Any

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    userId: str = Field(min_length=1)
    message: str = Field(min_length=1, max_length=4000)
    sessionId: str | None = Field(default=None)
    historySummary: str = ""
    context: dict[str, Any] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    answer: str
    model: str
    sessionId: str
    advisor: str = "aevio-coach"


class EstimateCaloriesRequest(BaseModel):
    userId: str = Field(min_length=1)
    profile: dict[str, Any] = Field(default_factory=dict)


class EstimateCaloriesResponse(BaseModel):
    calories: int
    model: str
    advisor: str = "estimate-calories"


class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: Any = None
    author: str | None = None


class ChatHistoryResponse(BaseModel):
    sessionId: str
    messages: list[ChatMessage]


class ChatListItem(BaseModel):
    sessionId: str = Field(alias="session_id")
    preview: str
    lastUpdate: Any = Field(default=None, alias="last_update")

    model_config = {"populate_by_name": True}
