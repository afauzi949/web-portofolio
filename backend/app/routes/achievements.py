from uuid import UUID
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.auth import get_current_user
from app.models.achievement import Achievement
from app.schemas.achievement import AchievementCreate, AchievementUpdate, AchievementResponse

router = APIRouter(prefix="/api/achievements", tags=["Achievements"])


# ============================================
# Public Endpoints
# ============================================

@router.get("", response_model=list[AchievementResponse])
async def list_achievements(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List all achievements (public), ordered by sort_order."""
    result = await db.execute(
        select(Achievement)
        .order_by(Achievement.sort_order, Achievement.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.get("/{achievement_id}", response_model=AchievementResponse)
async def get_achievement(achievement_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get achievement detail by ID (public)."""
    result = await db.execute(select(Achievement).where(Achievement.id == achievement_id))
    achievement = result.scalar_one_or_none()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement tidak ditemukan")
    return achievement


# ============================================
# Protected Endpoints (JWT Required)
# ============================================

@router.post("", response_model=AchievementResponse, status_code=status.HTTP_201_CREATED)
async def create_achievement(
    data: AchievementCreate,
    db: AsyncSession = Depends(get_db),
    _current_user: dict = Depends(get_current_user),
):
    """Create a new achievement. Requires JWT authentication."""
    achievement = Achievement(**data.model_dump())
    db.add(achievement)
    await db.commit()
    await db.refresh(achievement)
    return achievement


@router.put("/{achievement_id}", response_model=AchievementResponse)
async def update_achievement(
    achievement_id: UUID,
    data: AchievementUpdate,
    db: AsyncSession = Depends(get_db),
    _current_user: dict = Depends(get_current_user),
):
    """Update an existing achievement. Requires JWT authentication."""
    result = await db.execute(select(Achievement).where(Achievement.id == achievement_id))
    achievement = result.scalar_one_or_none()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement tidak ditemukan")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(achievement, field, value)

    achievement.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(achievement)
    return achievement


@router.delete("/{achievement_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_achievement(
    achievement_id: UUID,
    db: AsyncSession = Depends(get_db),
    _current_user: dict = Depends(get_current_user),
):
    """Delete an achievement. Requires JWT authentication."""
    result = await db.execute(select(Achievement).where(Achievement.id == achievement_id))
    achievement = result.scalar_one_or_none()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement tidak ditemukan")

    await db.delete(achievement)
    await db.commit()
