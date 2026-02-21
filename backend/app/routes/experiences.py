from uuid import UUID
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.auth import get_current_user
from app.models.experience import Experience
from app.schemas.experience import ExperienceCreate, ExperienceUpdate, ExperienceResponse
from app.services.rag_indexer import sync_single_record, delete_record_from_qdrant

router = APIRouter(prefix="/api/experiences", tags=["Experiences"])


# ============================================
# Public Endpoints
# ============================================

@router.get("", response_model=list[ExperienceResponse])
async def list_experiences(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List all experiences (public), ordered by sort_order."""
    result = await db.execute(
        select(Experience)
        .order_by(Experience.sort_order, Experience.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.get("/{experience_id}", response_model=ExperienceResponse)
async def get_experience(experience_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get experience detail by ID (public)."""
    result = await db.execute(select(Experience).where(Experience.id == experience_id))
    experience = result.scalar_one_or_none()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience tidak ditemukan")
    return experience


# ============================================
# Protected Endpoints (JWT Required)
# ============================================

@router.post("", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
async def create_experience(
    data: ExperienceCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _current_user: dict = Depends(get_current_user),
):
    """Create a new experience. Requires JWT authentication."""
    experience = Experience(**data.model_dump())
    db.add(experience)
    await db.commit()
    await db.refresh(experience)
    background_tasks.add_task(sync_single_record, experience, "experiences")
    return experience


@router.put("/{experience_id}", response_model=ExperienceResponse)
async def update_experience(
    experience_id: UUID,
    data: ExperienceUpdate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _current_user: dict = Depends(get_current_user),
):
    """Update an existing experience. Requires JWT authentication."""
    result = await db.execute(select(Experience).where(Experience.id == experience_id))
    experience = result.scalar_one_or_none()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience tidak ditemukan")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(experience, field, value)

    experience.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(experience)
    background_tasks.add_task(sync_single_record, experience, "experiences")
    return experience


@router.delete("/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experience(
    experience_id: UUID,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _current_user: dict = Depends(get_current_user),
):
    """Delete an experience. Requires JWT authentication."""
    result = await db.execute(select(Experience).where(Experience.id == experience_id))
    experience = result.scalar_one_or_none()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience tidak ditemukan")

    await db.delete(experience)
    await db.commit()
    background_tasks.add_task(delete_record_from_qdrant, "experiences", str(experience_id))
