from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.auth import create_access_token, hash_password, verify_password
from app.config import get_settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
settings = get_settings()

# Hash admin password at startup for comparison
_admin_password_hash = hash_password(settings.ADMIN_PASSWORD)


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Authenticate admin and return JWT token.

    Saat ini menggunakan single-admin yang dikonfigurasi
    via environment variable (ADMIN_USERNAME, ADMIN_PASSWORD).
    """
    if request.username != settings.ADMIN_USERNAME:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username atau password salah",
        )

    if not verify_password(request.password, _admin_password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username atau password salah",
        )

    access_token = create_access_token(data={"sub": request.username})
    return LoginResponse(access_token=access_token)
