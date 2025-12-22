from io import BytesIO
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response
from PIL import Image
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/compress-img")
async def compress_img(
    quality: int = Form(...),
    files: List[UploadFile] = File(...)
):
    try:
        file = files[0]
        content = await file.read()

        img = Image.open(BytesIO(content))

        output = BytesIO()
        format_to_save = img.format if img.format else "JPEG"

        if format_to_save == "JPEG" and img.mode != "RGB":
            img = img.convert("RGB")

        img.save(output, format=format_to_save, quality=quality, optimize=True)

        return Response(
            content=output.getvalue(),
            media_type=f"image/{format_to_save.lower()}"
        )
    except Exception as e:
        logger.error(f"Compression failed: {e}")
        raise HTTPException(status_code=500, detail="Compression failed")


@router.post("/resize-img")
async def resize_img(
    width: int = Form(...),
    height: int = Form(...),
    files: List[UploadFile] = File(...)
):
    try:
        file = files[0]
        content = await file.read()

        img = Image.open(BytesIO(content))
        img = img.resize((width, height), Image.Resampling.LANCZOS)

        output = BytesIO()
        format_to_save = img.format if img.format else "PNG"
        img.save(output, format=format_to_save)

        return Response(
            content=output.getvalue(),
            media_type=f"image/{format_to_save.lower()}"
        )
    except Exception as e:
        logger.error(f"Resize failed: {e}")
        raise HTTPException(status_code=500, detail="Resize failed")


@router.post("/crop-img")
async def crop_img(
    left: int = Form(...),
    top: int = Form(...),
    width: int = Form(...),
    height: int = Form(...),
    files: List[UploadFile] = File(...)
):
    try:
        file = files[0]
        content = await file.read()

        img = Image.open(BytesIO(content))
        box = (left, top, left + width, top + height)
        img = img.crop(box)

        output = BytesIO()
        format_to_save = img.format if img.format else "PNG"
        img.save(output, format=format_to_save)

        return Response(
            content=output.getvalue(),
            media_type=f"image/{format_to_save.lower()}"
        )
    except Exception as e:
        logger.error(f"Crop failed: {e}")
        raise HTTPException(status_code=500, detail="Crop failed")


@router.post("/convert-img")
async def convert_img(
    format: str = Form(...),
    files: List[UploadFile] = File(...)
):
    try:
        file = files[0]
        content = await file.read()

        img = Image.open(BytesIO(content))

        if format.upper() == "JPEG" and img.mode == "RGBA":
            img = img.convert("RGB")

        output = BytesIO()
        img.save(output, format=format.upper())

        return Response(
            content=output.getvalue(),
            media_type=f"image/{format.lower()}"
        )
    except Exception as e:
        logger.error(f"Conversion failed: {e}")
        raise HTTPException(status_code=500, detail="Conversion failed")
