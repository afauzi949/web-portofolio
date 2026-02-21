import os
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from pydantic import BaseModel

from app.auth import get_current_user
from app.config import get_settings

router = APIRouter(prefix="/api/upload", tags=["Upload"])
settings = get_settings()


class UploadResponse(BaseModel):
    filename: str
    url: str
    size: int


@router.post("", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile = File(...),
    _current_user: dict = Depends(get_current_user),
):
    """
    Upload an image file. Requires JWT authentication.

    - Max file size: 5MB
    - Allowed extensions: jpg, jpeg, png, webp, gif
    - File disimpan di Docker volume (/app/uploads)
    - Return path yang bisa digunakan sebagai image_path di project/experience
    """
    # Validate file extension
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename tidak boleh kosong")

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Extension '{ext}' tidak diizinkan. Gunakan: {', '.join(settings.ALLOWED_EXTENSIONS)}",
        )

    # Read file and validate size
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File terlalu besar. Maksimum {settings.MAX_UPLOAD_SIZE // (1024 * 1024)}MB",
        )

    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, unique_filename)

    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # Save file
    with open(filepath, "wb") as f:
        f.write(content)

    return UploadResponse(
        filename=unique_filename,
        url=f"/uploads/{unique_filename}",
        size=len(content),
    )
