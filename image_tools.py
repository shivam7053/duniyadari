from io import BytesIO
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response
from PIL import Image
from rembg import remove, new_session  # Add new_session to imports
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize at startup with lightweight model
try:
    bg_removal_session = new_session("u2netp")
    logger.info("Background removal model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load background removal model: {e}")
    bg_removal_session = None

@router.post("/compress-img")
async def compress_img(quality: int = Form(...), files: List[UploadFile] = File(...)):
    try:
        file = files[0]
        content = await file.read()
        img = Image.open(BytesIO(content))
        
        output = BytesIO()
        format_to_save = img.format if img.format else 'JPEG'
        
        if format_to_save == 'JPEG' and img.mode != 'RGB':
             img = img.convert("RGB")
            
        img.save(output, format=format_to_save, quality=quality, optimize=True)
        
        return Response(content=output.getvalue(), media_type=f"image/{format_to_save.lower()}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compression failed: {str(e)}")

@router.post("/resize-img")
async def resize_img(width: int = Form(...), height: int = Form(...), files: List[UploadFile] = File(...)):
    try:
        file = files[0]
        content = await file.read()
        img = Image.open(BytesIO(content))
        
        img = img.resize((width, height), Image.Resampling.LANCZOS)
        
        output = BytesIO()
        format_to_save = img.format if img.format else 'PNG'
        img.save(output, format=format_to_save)
        
        return Response(content=output.getvalue(), media_type=f"image/{format_to_save.lower()}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resize failed: {str(e)}")

@router.post("/crop-img")
async def crop_img(
    left: int = Form(...), top: int = Form(...), 
    width: int = Form(...), height: int = Form(...), 
    files: List[UploadFile] = File(...)
):
    try:
        file = files[0]
        content = await file.read()
        img = Image.open(BytesIO(content))
        
        box = (left, top, left + width, top + height)
        img = img.crop(box)
        
        output = BytesIO()
        format_to_save = img.format if img.format else 'PNG'
        img.save(output, format=format_to_save)
        
        return Response(content=output.getvalue(), media_type=f"image/{format_to_save.lower()}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crop failed: {str(e)}")

@router.post("/convert-img")
async def convert_img(format: str = Form(...), files: List[UploadFile] = File(...)):
    try:
        file = files[0]
        content = await file.read()
        img = Image.open(BytesIO(content))
        
        if format.upper() == "JPEG" and img.mode == "RGBA":
            img = img.convert("RGB")
            
        output = BytesIO()
        img.save(output, format=format.upper())
        
        return Response(content=output.getvalue(), media_type=f"image/{format.lower()}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")

@router.post("/remove-bg")
async def remove_background(files: List[UploadFile] = File(...)):
    if bg_removal_session is None:
        raise HTTPException(
            status_code=503, 
            detail="Background removal service is currently unavailable"
        )
    
    try:
        file = files[0]
        content = await file.read()
        
        # Limit file size to prevent memory issues (10MB limit)
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image too large. Maximum 10MB.")
        
        # Use the lightweight model session
        output_content = remove(content, session=bg_removal_session)
        
        img = Image.open(BytesIO(output_content))
        output = BytesIO()
        img.save(output, format='PNG')
        
        return Response(content=output.getvalue(), media_type="image/png")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Background removal failed: {e}")
        raise HTTPException(status_code=500, detail=f"Background removal failed: {str(e)}")