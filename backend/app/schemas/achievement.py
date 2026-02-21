from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class AchievementCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    description: str = Field(..., min_length=1)
    publisher: Optional[str] = Field(None, max_length=300)
    date: Optional[str] = Field(None, max_length=100)
    color: Optional[str] = Field(None, max_length=50)
    sort_order: int = 0


class AchievementUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    publisher: Optional[str] = Field(None, max_length=300)
    date: Optional[str] = Field(None, max_length=100)
    color: Optional[str] = Field(None, max_length=50)
    sort_order: Optional[int] = None


class AchievementResponse(BaseModel):
    id: UUID
    title: str
    description: str
    publisher: Optional[str]
    date: Optional[str]
    color: Optional[str]
    sort_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
