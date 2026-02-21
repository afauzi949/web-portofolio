from uuid import UUID
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.auth import get_current_user
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.services.rag_indexer import sync_single_record, delete_record_from_qdrant

router = APIRouter(prefix="/api/projects", tags=["Projects"])


# ============================================
# Public Endpoints
# ============================================

@router.get("", response_model=list[ProjectResponse])
async def list_projects(
    category: str | None = Query(None, description="Filter by category"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List all projects (public). Supports filtering by category and pagination."""
    query = select(Project).order_by(Project.sort_order, Project.created_at.desc())
    if category:
        query = query.where(Project.category == category)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/categories", response_model=list[str])
async def list_categories(db: AsyncSession = Depends(get_db)):
    """List all unique project categories (public)."""
    result = await db.execute(
        select(Project.category).distinct().order_by(Project.category)
    )
    return result.scalars().all()


@router.get("/{slug}", response_model=ProjectResponse)
async def get_project(slug: str, db: AsyncSession = Depends(get_db)):
    """Get project detail by slug (public)."""
    result = await db.execute(select(Project).where(Project.slug == slug))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project tidak ditemukan")
    return project


# ============================================
# Protected Endpoints (JWT Required)
# ============================================

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _current_user: dict = Depends(get_current_user),
):
    """Create a new project. Requires JWT authentication."""
    # Check slug uniqueness
    existing = await db.execute(select(Project).where(Project.slug == data.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Slug '{data.slug}' sudah digunakan",
        )

    project = Project(**data.model_dump())
    db.add(project)
    await db.commit()
    await db.refresh(project)
    background_tasks.add_task(sync_single_record, project, "projects")
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    data: ProjectUpdate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _current_user: dict = Depends(get_current_user),
):
    """Update an existing project. Requires JWT authentication."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project tidak ditemukan")

    # Check slug uniqueness if updating slug
    if data.slug and data.slug != project.slug:
        existing = await db.execute(select(Project).where(Project.slug == data.slug))
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Slug '{data.slug}' sudah digunakan",
            )

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    project.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(project)
    background_tasks.add_task(sync_single_record, project, "projects")
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _current_user: dict = Depends(get_current_user),
):
    """Delete a project. Requires JWT authentication."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project tidak ditemukan")

    await db.delete(project)
    await db.commit()
    background_tasks.add_task(delete_record_from_qdrant, "projects", str(project_id))
