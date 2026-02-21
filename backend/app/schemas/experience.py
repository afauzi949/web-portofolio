from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class ExperienceCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    company: str = Field(..., min_length=1, max_length=300)
    period: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1)
    icon: Optional[str] = None
    sort_order: int = 0


class ExperienceUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    company: Optional[str] = Field(None, min_length=1, max_length=300)
    period: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None
    sort_order: Optional[int] = None


class ExperienceResponse(BaseModel):
    id: UUID
    title: str
    company: str
    period: str
    description: str
    icon: Optional[str]
    sort_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
