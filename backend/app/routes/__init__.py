from app.routes.auth import router as auth_router
from app.routes.projects import router as projects_router
from app.routes.experiences import router as experiences_router
from app.routes.achievements import router as achievements_router
from app.routes.upload import router as upload_router

__all__ = [
    "auth_router",
    "projects_router",
    "experiences_router",
    "achievements_router",
    "upload_router",
]
