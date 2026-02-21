from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.routes import (
    auth_router,
    projects_router,
    experiences_router,
    achievements_router,
    upload_router,
)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown events."""
    # Startup
    import os
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    print("✅ Portfolio Backend API started")
    yield
    # Shutdown
    print("🔴 Portfolio Backend API shutting down")


app = FastAPI(
    title="Portfolio CMS API",
    description=(
        "Backend API untuk Portfolio CMS. "
        "Endpoint GET bersifat publik, endpoint POST/PUT/DELETE membutuhkan JWT authentication."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
origins = [
    origin.strip()
    for origin in settings.BACKEND_CORS_ORIGINS.split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files — serve uploaded images
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(experiences_router)
app.include_router(achievements_router)
app.include_router(upload_router)


@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint for Docker and monitoring."""
    return {"status": "ok", "service": "portfolio-backend"}
