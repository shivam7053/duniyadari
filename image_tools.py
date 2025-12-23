# from io import BytesIO
# from typing import List
# from fastapi import APIRouter, UploadFile, File, HTTPException, Form
# from fastapi.responses import Response
# from PIL import Image
# import logging

# logger = logging.getLogger(__name__)

# router = APIRouter()


# @router.post("/compress-img")
# async def compress_img(
#     quality: int = Form(...),
#     files: List[UploadFile] = File(...)
# ):
#     try:
#         file = files[0]
#         content = await file.read()

#         img = Image.open(BytesIO(content))

#         output = BytesIO()
#         format_to_save = img.format if img.format else "JPEG"

#         if format_to_save == "JPEG" and img.mode != "RGB":
#             img = img.convert("RGB")

#         img.save(output, format=format_to_save, quality=quality, optimize=True)

#         return Response(
#             content=output.getvalue(),
#             media_type=f"image/{format_to_save.lower()}"
#         )
#     except Exception as e:
#         logger.error(f"Compression failed: {e}")
#         raise HTTPException(status_code=500, detail="Compression failed")


# @router.post("/resize-img")
# async def resize_img(
#     width: int = Form(...),
#     height: int = Form(...),
#     files: List[UploadFile] = File(...)
# ):
#     try:
#         file = files[0]
#         content = await file.read()

#         img = Image.open(BytesIO(content))
#         img = img.resize((width, height), Image.Resampling.LANCZOS)

#         output = BytesIO()
#         format_to_save = img.format if img.format else "PNG"
#         img.save(output, format=format_to_save)

#         return Response(
#             content=output.getvalue(),
#             media_type=f"image/{format_to_save.lower()}"
#         )
#     except Exception as e:
#         logger.error(f"Resize failed: {e}")
#         raise HTTPException(status_code=500, detail="Resize failed")


# @router.post("/crop-img")
# async def crop_img(
#     left: int = Form(...),
#     top: int = Form(...),
#     width: int = Form(...),
#     height: int = Form(...),
#     files: List[UploadFile] = File(...)
# ):
#     try:
#         file = files[0]
#         content = await file.read()

#         img = Image.open(BytesIO(content))
#         box = (left, top, left + width, top + height)
#         img = img.crop(box)

#         output = BytesIO()
#         format_to_save = img.format if img.format else "PNG"
#         img.save(output, format=format_to_save)

#         return Response(
#             content=output.getvalue(),
#             media_type=f"image/{format_to_save.lower()}"
#         )
#     except Exception as e:
#         logger.error(f"Crop failed: {e}")
#         raise HTTPException(status_code=500, detail="Crop failed")


# @router.post("/convert-img")
# async def convert_img(
#     format: str = Form(...),
#     files: List[UploadFile] = File(...)
# ):
#     try:
#         file = files[0]
#         content = await file.read()

#         img = Image.open(BytesIO(content))

#         if format.upper() == "JPEG" and img.mode == "RGBA":
#             img = img.convert("RGB")

#         output = BytesIO()
#         img.save(output, format=format.upper())

#         return Response(
#             content=output.getvalue(),
#             media_type=f"image/{format.lower()}"
#         )
#     except Exception as e:
#         logger.error(f"Conversion failed: {e}")
#         raise HTTPException(status_code=500, detail="Conversion failed")


from io import BytesIO
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageFont
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/compress-img")
async def compress_img(
    quality: int = Form(...),
    files: List[UploadFile] = File(...)
):
    """Compress image with specified quality"""
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
    """Resize image to specified dimensions"""
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
    """Crop image to specified region"""
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
    """Convert image to different format"""
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


@router.post("/rotate-img")
async def rotate_img(
    angle: int = Form(...),
    files: List[UploadFile] = File(...)
):
    """Rotate image by specified angle"""
    try:
        file = files[0]
        content = await file.read()
        img = Image.open(BytesIO(content))
        
        # Rotate image (negative for clockwise)
        img = img.rotate(-angle, expand=True)

        output = BytesIO()
        format_to_save = img.format if img.format else "PNG"
        img.save(output, format=format_to_save)

        return Response(
            content=output.getvalue(),
            media_type=f"image/{format_to_save.lower()}"
        )
    except Exception as e:
        logger.error(f"Rotation failed: {e}")
        raise HTTPException(status_code=500, detail="Rotation failed")


@router.post("/flip-img")
async def flip_img(
    direction: str = Form(...),
    files: List[UploadFile] = File(...)
):
    """Flip image horizontally or vertically"""
    try:
        file = files[0]
        content = await file.read()
        img = Image.open(BytesIO(content))
        
        if direction.lower() == "horizontal":
            img = img.transpose(Image.FLIP_LEFT_RIGHT)
        elif direction.lower() == "vertical":
            img = img.transpose(Image.FLIP_TOP_BOTTOM)
        else:
            raise ValueError("Direction must be 'horizontal' or 'vertical'")

        output = BytesIO()
        format_to_save = img.format if img.format else "PNG"
        img.save(output, format=format_to_save)

        return Response(
            content=output.getvalue(),
            media_type=f"image/{format_to_save.lower()}"
        )
    except Exception as e:
        logger.error(f"Flip failed: {e}")
        raise HTTPException(status_code=500, detail="Flip failed")


@router.post("/adjust-img")
async def adjust_img(
    brightness: float = Form(...),
    contrast: float = Form(...),
    files: List[UploadFile] = File(...)
):
    """Adjust image brightness and contrast"""
    try:
        file = files[0]
        content = await file.read()
        img = Image.open(BytesIO(content))
        
        # Adjust brightness
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(brightness)
        
        # Adjust contrast
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(contrast)

        output = BytesIO()
        format_to_save = img.format if img.format else "PNG"
        img.save(output, format=format_to_save)

        return Response(
            content=output.getvalue(),
            media_type=f"image/{format_to_save.lower()}"
        )
    except Exception as e:
        logger.error(f"Adjustment failed: {e}")
        raise HTTPException(status_code=500, detail="Adjustment failed")


@router.post("/blur-img")
async def blur_img(
    radius: int = Form(...),
    files: List[UploadFile] = File(...)
):
    """Apply blur effect to image"""
    try:
        file = files[0]
        content = await file.read()
        img = Image.open(BytesIO(content))
        
        # Apply Gaussian blur
        img = img.filter(ImageFilter.GaussianBlur(radius=radius))

        output = BytesIO()
        format_to_save = img.format if img.format else "PNG"
        img.save(output, format=format_to_save)

        return Response(
            content=output.getvalue(),
            media_type=f"image/{format_to_save.lower()}"
        )
    except Exception as e:
        logger.error(f"Blur failed: {e}")
        raise HTTPException(status_code=500, detail="Blur failed")


@router.post("/watermark-img")
async def watermark_img(
    text: str = Form(...),
    files: List[UploadFile] = File(...)
):
    """Add text watermark to image"""
    try:
        file = files[0]
        content = await file.read()
        img = Image.open(BytesIO(content))
        
        # Create a drawing context
        draw = ImageDraw.Draw(img)
        
        # Calculate text size and position (bottom-right)
        width, height = img.size
        font_size = max(20, min(width, height) // 20)
        
        try:
            # Try to use a default font
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            # Fall back to default font
            font = ImageFont.load_default()
        
        # Get text bounding box
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Position text in bottom-right corner with padding
        padding = 20
        x = width - text_width - padding
        y = height - text_height - padding
        
        # Draw text with semi-transparent background
        draw.text((x, y), text, fill=(255, 255, 255, 128), font=font)

        output = BytesIO()
        format_to_save = img.format if img.format else "PNG"
        img.save(output, format=format_to_save)

        return Response(
            content=output.getvalue(),
            media_type=f"image/{format_to_save.lower()}"
        )
    except Exception as e:
        logger.error(f"Watermark failed: {e}")
        raise HTTPException(status_code=500, detail="Watermark failed")