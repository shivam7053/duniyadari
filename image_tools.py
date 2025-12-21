from io import BytesIO
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response
from PIL import Image

router = APIRouter()

@router.post("/compress-img")
async def compress_img(quality: int = Form(...), files: List[UploadFile] = File(...)):
    try:
        file = files[0]
        content = await file.read()
        img = Image.open(BytesIO(content))
        
        output = BytesIO()
        # Convert to RGB if saving as JPEG to avoid errors with transparency
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
        
        # Resize using high-quality resampling
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
        
        # Crop box is defined as (left, top, right, bottom)
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
        
        # Handle transparency for JPEG
        if format.upper() == "JPEG" and img.mode == "RGBA":
            img = img.convert("RGB")
            
        output = BytesIO()
        img.save(output, format=format.upper())
        
        return Response(content=output.getvalue(), media_type=f"image/{format.lower()}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")