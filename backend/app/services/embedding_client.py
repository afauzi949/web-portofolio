"""
Remote Embedding API client for BAAI/bge-base-en-v1.5 hosted on VPS.
Calls /embed_batch with fallback to /embed, with timeout + retry.
"""
import logging
from typing import Optional

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)

OUTPUT_DIMENSIONALITY = 768
MAX_RETRIES = 3
TIMEOUT_SECONDS = 30.0


def _build_headers() -> dict[str, str]:
    """Build request headers with optional API key."""
    settings = get_settings()
    headers = {"Content-Type": "application/json"}
    if settings.EMBEDDING_API_KEY:
        headers["x-api-key"] = settings.EMBEDDING_API_KEY
    return headers


async def embed_single(text: str) -> list[float]:
    """Embed a single text string via POST /embed. Returns 768-dim vector."""
    settings = get_settings()
    url = f"{settings.EMBEDDING_URL.rstrip('/')}/embed"
    headers = _build_headers()

    last_error: Optional[Exception] = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
                resp = await client.post(url, headers=headers, json={"text": text})
                resp.raise_for_status()
                data = resp.json()
                embedding = data["embedding"]
                logger.debug(f"Embedded 1 text → dim={len(embedding)}")
                return embedding
        except (httpx.HTTPError, httpx.TimeoutException, KeyError) as e:
            last_error = e
            logger.warning(f"embed_single attempt {attempt}/{MAX_RETRIES} failed: {e}")

    raise RuntimeError(f"embed_single failed after {MAX_RETRIES} retries: {last_error}")


async def embed_batch(texts: list[str]) -> list[list[float]]:
    """
    Embed multiple texts. Tries POST /embed_batch first,
    falls back to individual /embed calls if batch endpoint unavailable.
    """
    if not texts:
        return []

    settings = get_settings()
    batch_url = f"{settings.EMBEDDING_URL.rstrip('/')}/embed_batch"
    headers = _build_headers()

    # Try batch endpoint first
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS * 2) as client:
            resp = await client.post(
                batch_url, headers=headers, json={"texts": texts}
            )
            resp.raise_for_status()
            data = resp.json()
            embeddings = data["embeddings"]
            logger.info(f"Batch embedded {len(texts)} texts → {len(embeddings)} vectors (768-dim)")
            return embeddings
    except (httpx.HTTPStatusError, httpx.TimeoutException, KeyError) as e:
        logger.warning(f"Batch endpoint failed ({e}), falling back to individual calls")

    # Fallback: embed one by one
    embeddings = []
    for i, text in enumerate(texts):
        vec = await embed_single(text)
        embeddings.append(vec)
        if (i + 1) % 5 == 0:
            logger.info(f"Embedded {i + 1}/{len(texts)} texts (fallback mode)")

    logger.info(f"Fallback embedded {len(texts)} texts total")
    return embeddings
