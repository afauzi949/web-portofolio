"""
RAG Indexing pipeline: PostgreSQL → canonical text → VPS embedding → Qdrant upsert.
"""
import logging
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project
from app.models.experience import Experience
from app.models.achievement import Achievement
from app.services import qdrant_service, embedding_client

logger = logging.getLogger(__name__)


# ============================================
# Document builders — one canonical text per row
# ============================================

def build_project_document(p: Project) -> dict:
    """Build canonical text and payload for a project row."""
    parts = [f"Title: {p.title}", f"Category: {p.category}"]

    if p.tech_stack:
        parts.append(f"Technologies: {', '.join(p.tech_stack)}")

    parts.append(f"Description: {p.description}")

    if p.full_description:
        parts.append(f"Full Description: {p.full_description}")

    if p.key_features:
        features = "\n".join(f"- {f}" for f in p.key_features)
        parts.append(f"Key Features:\n{features}")

    if p.system_architecture:
        arch = "\n".join(f"- {a}" for a in p.system_architecture)
        parts.append(f"System Architecture:\n{arch}")

    if p.system_flow:
        flow = "\n".join(f"- {s}" for s in p.system_flow)
        parts.append(f"System Flow:\n{flow}")

    if p.highlight:
        parts.append(f"Outcome: {p.highlight}")

    if p.external_link:
        parts.append(f"Link: {p.external_link}")

    text = "\n\n".join(parts)

    payload = {
        "doc_type": "project",
        "source_table": "projects",
        "source_id": str(p.id),
        "slug": p.slug,
        "title": p.title,
        "category": p.category,
        "tech_stack": p.tech_stack or [],
        "chunk_index": 0,
        "text": text,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
    }

    return {"text": text, "payload": payload}


def build_experience_document(e: Experience) -> dict:
    """Build canonical text and payload for an experience row."""
    parts = [
        f"Title: {e.title}",
        f"Company: {e.company}",
        f"Period: {e.period}",
        f"Description: {e.description}",
    ]
    text = "\n\n".join(parts)

    payload = {
        "doc_type": "experience",
        "source_table": "experiences",
        "source_id": str(e.id),
        "title": e.title,
        "company": e.company,
        "chunk_index": 0,
        "text": text,
        "updated_at": e.updated_at.isoformat() if e.updated_at else None,
    }

    return {"text": text, "payload": payload}


def build_achievement_document(a: Achievement) -> dict:
    """Build canonical text and payload for an achievement row."""
    parts = [f"Title: {a.title}"]
    if a.publisher:
        parts.append(f"Publisher: {a.publisher}")
    if a.date:
        parts.append(f"Date: {a.date}")
    parts.append(f"Description: {a.description}")
    text = "\n\n".join(parts)

    payload = {
        "doc_type": "achievement",
        "source_table": "achievements",
        "source_id": str(a.id),
        "title": a.title,
        "chunk_index": 0,
        "text": text,
        "updated_at": a.updated_at.isoformat() if a.updated_at else None,
    }

    return {"text": text, "payload": payload}


# ============================================
# Full Reindex pipeline
# ============================================

async def full_reindex(db: AsyncSession) -> dict:
    """
    Full reindex: fetch all data from PostgreSQL, embed via Gemini, upsert to Qdrant.
    Returns stats dict.
    """
    logger.info("Starting full reindex...")

    # 1. Fetch all data
    projects = (await db.execute(select(Project).order_by(Project.sort_order))).scalars().all()
    experiences = (await db.execute(select(Experience).order_by(Experience.sort_order))).scalars().all()
    achievements = (await db.execute(select(Achievement).order_by(Achievement.sort_order))).scalars().all()

    logger.info(
        f"Fetched {len(projects)} projects, "
        f"{len(experiences)} experiences, "
        f"{len(achievements)} achievements"
    )

    # 2. Build documents
    documents = []

    for p in projects:
        doc = build_project_document(p)
        doc["source_table"] = "projects"
        doc["source_id"] = str(p.id)
        doc["chunk_index"] = 0
        documents.append(doc)

    for e in experiences:
        doc = build_experience_document(e)
        doc["source_table"] = "experiences"
        doc["source_id"] = str(e.id)
        doc["chunk_index"] = 0
        documents.append(doc)

    for a in achievements:
        doc = build_achievement_document(a)
        doc["source_table"] = "achievements"
        doc["source_id"] = str(a.id)
        doc["chunk_index"] = 0
        documents.append(doc)

    if not documents:
        return {"status": "empty", "total_indexed": 0}

    # 3. Generate embeddings
    texts = [d["text"] for d in documents]
    logger.info(f"Generating embeddings for {len(texts)} documents...")
    embeddings = await embedding_client.embed_batch(texts)

    # 4. Delete old collection and recreate (full reindex)
    qdrant_service.delete_all_points()

    # 5. Build points and upsert
    points = []
    for doc, vector in zip(documents, embeddings):
        point_id = qdrant_service.deterministic_point_id(
            doc["source_table"], doc["source_id"], doc["chunk_index"]
        )
        points.append({
            "id": point_id,
            "vector": vector,
            "payload": doc["payload"],
        })

    total_upserted = qdrant_service.upsert_points(points)
    logger.info(f"Upserted {total_upserted} points to Qdrant")

    # 6. Get collection info
    info = qdrant_service.get_collection_info()

    return {
        "status": "success",
        "total_indexed": total_upserted,
        "breakdown": {
            "projects": len(projects),
            "experiences": len(experiences),
            "achievements": len(achievements),
        },
        "collection": info,
        "indexed_at": datetime.now(timezone.utc).isoformat(),
    }


# ============================================
# Single-record sync (for CMS auto-sync)
# ============================================

async def sync_single_record(record, source_table: str) -> None:
    """
    Embed and upsert a single record to Qdrant.
    Used as a background task after CMS create/update.
    Errors are logged but never raised (fire-and-forget).
    """
    try:
        # Build document based on table type
        if source_table == "projects":
            doc = build_project_document(record)
        elif source_table == "experiences":
            doc = build_experience_document(record)
        elif source_table == "achievements":
            doc = build_achievement_document(record)
        else:
            logger.error(f"Unknown source_table: {source_table}")
            return

        # Generate embedding
        embedding = await embedding_client.embed_single(doc["text"])

        # Build point with deterministic ID
        point_id = qdrant_service.deterministic_point_id(
            source_table, str(record.id), 0
        )

        # Ensure collection exists
        qdrant_service.ensure_collection()

        # Upsert single point
        qdrant_service.upsert_points([{
            "id": point_id,
            "vector": embedding,
            "payload": doc["payload"],
        }])

        logger.info(
            f"Synced {source_table} record '{record.id}' to Qdrant "
            f"(point_id={point_id[:8]}...)"
        )
    except Exception as e:
        logger.error(f"Failed to sync {source_table} record '{record.id}' to Qdrant: {e}")


def delete_record_from_qdrant(source_table: str, record_id: str) -> None:
    """
    Delete a record's point(s) from Qdrant.
    Used as a background task after CMS delete.
    Errors are logged but never raised (fire-and-forget).
    """
    try:
        from qdrant_client import models

        client = qdrant_service._get_client()
        collection = qdrant_service._collection_name()

        # Delete by matching source_table + source_id in payload
        client.delete(
            collection_name=collection,
            points_selector=models.FilterSelector(
                filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="source_table",
                            match=models.MatchValue(value=source_table),
                        ),
                        models.FieldCondition(
                            key="source_id",
                            match=models.MatchValue(value=record_id),
                        ),
                    ]
                )
            ),
        )
        logger.info(f"Deleted {source_table} record '{record_id}' from Qdrant")
    except Exception as e:
        logger.error(f"Failed to delete {source_table} record '{record_id}' from Qdrant: {e}")
