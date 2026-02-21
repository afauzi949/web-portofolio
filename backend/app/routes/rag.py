"""
Admin RAG endpoints: manual indexing trigger and search verification.
All endpoints require JWT authentication.
"""
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.auth import get_current_user
from app.services import qdrant_service, embedding_client
from app.services.rag_indexer import full_reindex

logger = logging.getLogger(__name__)

router = APIRouter(tags=["RAG Admin"])


# ============================================
# Schemas
# ============================================

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000, description="Search query text")
    doc_type: str | None = Field(None, description="Filter: project, experience, achievement")
    category: str | None = Field(None, description="Filter by project category")
    top_k: int = Field(5, ge=1, le=20, description="Number of results to return")


class SearchResult(BaseModel):
    id: str
    score: float
    title: str
    doc_type: str
    slug: str | None = None
    text: str | None = None


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]
    total: int


# ============================================
# Endpoints
# ============================================

@router.post("/admin/index/qdrant")
async def trigger_reindex(
    db: AsyncSession = Depends(get_db),
    _current_user: dict = Depends(get_current_user),
):
    """
    Trigger full reindex: PostgreSQL → VPS embedding → Qdrant upsert.
    Requires JWT authentication (admin only).
    """
    try:
        result = await full_reindex(db)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.exception("Reindex failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Indexing gagal: {str(e)}",
        )


@router.post("/admin/qdrant/search", response_model=SearchResponse)
async def search_qdrant(
    req: SearchRequest,
    _current_user: dict = Depends(get_current_user),
):
    """
    Search Qdrant for similar documents. For testing/verification.
    Requires JWT authentication.
    """
    try:
        # Embed the query
        query_vector = await embedding_client.embed_single(req.query)

        # Search Qdrant
        results = qdrant_service.search(
            query_vector=query_vector,
            limit=req.top_k,
            doc_type=req.doc_type,
            category=req.category,
        )

        search_results = []
        for r in results:
            payload = r.get("payload", {})
            search_results.append(SearchResult(
                id=r["id"],
                score=r["score"],
                title=payload.get("title", ""),
                doc_type=payload.get("doc_type", ""),
                slug=payload.get("slug"),
                text=payload.get("text", "")[:500],  # Truncate for response
            ))

        return SearchResponse(
            query=req.query,
            results=search_results,
            total=len(search_results),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.exception("Search failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search gagal: {str(e)}",
        )


@router.get("/admin/qdrant/status")
async def qdrant_status(
    _current_user: dict = Depends(get_current_user),
):
    """Get Qdrant collection status. Requires JWT authentication."""
    try:
        info = qdrant_service.get_collection_info()
        return info
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal mendapatkan status Qdrant: {str(e)}",
        )
