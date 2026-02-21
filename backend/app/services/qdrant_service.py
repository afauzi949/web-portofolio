"""
Qdrant vector database service.
Handles collection management, point upsert, and vector search.
"""
import uuid
import logging

from qdrant_client import QdrantClient, models
from app.config import get_settings

logger = logging.getLogger(__name__)

VECTOR_SIZE = 768
DISTANCE = models.Distance.COSINE


def _get_client() -> QdrantClient:
    settings = get_settings()
    return QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)


def _collection_name() -> str:
    return get_settings().QDRANT_COLLECTION


def deterministic_point_id(source_table: str, source_id: str, chunk_index: int) -> str:
    """Generate a deterministic UUID5 from table:id:chunk for idempotent upsert."""
    raw = f"{source_table}:{source_id}:{chunk_index}"
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, raw))


def ensure_collection() -> None:
    """Create collection if it does not exist."""
    client = _get_client()
    name = _collection_name()

    collections = [c.name for c in client.get_collections().collections]
    if name in collections:
        logger.info(f"Collection '{name}' already exists")
        return

    client.create_collection(
        collection_name=name,
        vectors_config=models.VectorParams(
            size=VECTOR_SIZE,
            distance=DISTANCE,
        ),
    )
    logger.info(f"Created collection '{name}' (size={VECTOR_SIZE}, distance=cosine)")

    # Create payload indexes for fast filtering
    for field, schema in [
        ("doc_type", models.PayloadSchemaType.KEYWORD),
        ("category", models.PayloadSchemaType.KEYWORD),
        ("slug", models.PayloadSchemaType.KEYWORD),
        ("tech_stack", models.PayloadSchemaType.KEYWORD),
    ]:
        client.create_payload_index(
            collection_name=name,
            field_name=field,
            field_schema=schema,
        )
    logger.info("Created payload indexes: doc_type, category, slug, tech_stack")


def upsert_points(
    points: list[dict],
) -> int:
    """
    Upsert points to Qdrant.
    Each point dict: { "id": str(uuid), "vector": list[float], "payload": dict }
    """
    client = _get_client()
    name = _collection_name()

    qdrant_points = [
        models.PointStruct(
            id=p["id"],
            vector=p["vector"],
            payload=p["payload"],
        )
        for p in points
    ]

    # Batch upsert (max 100 per request to stay safe)
    batch_size = 100
    total = 0
    for i in range(0, len(qdrant_points), batch_size):
        batch = qdrant_points[i : i + batch_size]
        client.upsert(collection_name=name, points=batch)
        total += len(batch)

    return total


def delete_all_points() -> None:
    """Delete all points in the collection (for full reindex)."""
    client = _get_client()
    name = _collection_name()

    collections = [c.name for c in client.get_collections().collections]
    if name in collections:
        client.delete_collection(collection_name=name)
        logger.info(f"Deleted collection '{name}' for full reindex")

    # Recreate
    ensure_collection()


def search(
    query_vector: list[float],
    limit: int = 5,
    doc_type: str | None = None,
    category: str | None = None,
) -> list[dict]:
    """Search for similar vectors with optional payload filters."""
    client = _get_client()
    name = _collection_name()

    # Build filter conditions
    conditions = []
    if doc_type:
        conditions.append(
            models.FieldCondition(
                key="doc_type",
                match=models.MatchValue(value=doc_type),
            )
        )
    if category:
        conditions.append(
            models.FieldCondition(
                key="category",
                match=models.MatchValue(value=category),
            )
        )

    query_filter = models.Filter(must=conditions) if conditions else None

    results = client.query_points(
        collection_name=name,
        query=query_vector,
        query_filter=query_filter,
        limit=limit,
        with_payload=True,
    )

    return [
        {
            "id": str(hit.id),
            "score": hit.score,
            "payload": hit.payload,
        }
        for hit in results.points
    ]


def get_collection_info() -> dict:
    """Get collection stats."""
    client = _get_client()
    name = _collection_name()
    try:
        info = client.get_collection(collection_name=name)
        return {
            "name": name,
            "points_count": info.points_count,
            "vectors_count": info.vectors_count,
            "status": str(info.status),
        }
    except Exception:
        return {"name": name, "points_count": 0, "status": "not_found"}
