from typing import Any

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    userId: str = Field(min_length=1)
    message: str = Field(min_length=1, max_length=4000)
    historySummary: str = Field(default="", max_length=12000)
    context: dict[str, Any] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    answer: str
    model: str
    advisor: str = "aevio-coach"

