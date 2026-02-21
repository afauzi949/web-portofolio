from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    slug: str = Field(..., min_length=1, max_length=255)
    title: str = Field(..., min_length=1, max_length=500)
    category: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1)
    tech_stack: list[str] = Field(default_factory=list)
    highlight: Optional[str] = None
    image_path: Optional[str] = None
    external_link: Optional[str] = None
    bg_color: Optional[str] = None
    full_description: Optional[str] = None
    key_features: Optional[list[str]] = None
    system_architecture: Optional[list[str]] = None
    system_flow: Optional[list[str]] = None
    sort_order: int = 0


class ProjectUpdate(BaseModel):
    slug: Optional[str] = Field(None, min_length=1, max_length=255)
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    tech_stack: Optional[list[str]] = None
    highlight: Optional[str] = None
    image_path: Optional[str] = None
    external_link: Optional[str] = None
    bg_color: Optional[str] = None
    full_description: Optional[str] = None
    key_features: Optional[list[str]] = None
    system_architecture: Optional[list[str]] = None
    system_flow: Optional[list[str]] = None
    sort_order: Optional[int] = None


class ProjectResponse(BaseModel):
    id: UUID
    slug: str
    title: str
    category: str
    description: str
    tech_stack: list[str]
    highlight: Optional[str]
    image_path: Optional[str]
    external_link: Optional[str]
    bg_color: Optional[str]
    full_description: Optional[str]
    key_features: Optional[list[str]]
    system_architecture: Optional[list[str]]
    system_flow: Optional[list[str]]
    sort_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
