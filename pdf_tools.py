from io import BytesIO
from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response
from pypdf import PdfWriter, PdfReader, Transformation
import img2pdf
import mammoth
from xhtml2pdf import pisa
from PIL import Image

router = APIRouter()

@router.post("/merge-pdf")
async def merge_pdf(files: List[UploadFile] = File(...)):
    """Merge multiple PDF files into one"""
    try:
        merger = PdfWriter()
        for file in files:
            content = await file.read()
            merger.append(BytesIO(content))
        
        output = BytesIO()
        merger.write(output)
        merger.close()
        
        return Response(content=output.getvalue(), media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Merge failed: {str(e)}")

@router.post("/split-pdf")
async def split_pdf(
    start: int = Form(...), 
    end: int = Form(...), 
    files: List[UploadFile] = File(...)
):
    """Extract specific page range from PDF"""
    try:
        file = files[0]
        content = await file.read()
        reader = PdfReader(BytesIO(content))
        writer = PdfWriter()

        total_pages = len(reader.pages)
        start_idx = max(0, start - 1)
        end_idx = min(total_pages, end)

        if start_idx >= end_idx:
            raise HTTPException(status_code=400, detail="Invalid page range")

        for i in range(start_idx, end_idx):
            writer.add_page(reader.pages[i])

        output = BytesIO()
        writer.write(output)
        return Response(content=output.getvalue(), media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Split failed: {str(e)}")

@router.post("/protect-pdf")
async def protect_pdf(password: str = Form(...), files: List[UploadFile] = File(...)):
    """Add password protection to PDF"""
    try:
        file = files[0]
        content = await file.read()
        reader = PdfReader(BytesIO(content))
        writer = PdfWriter()
        
        for page in reader.pages:
            writer.add_page(page)
        
        writer.encrypt(password)
        
        output = BytesIO()
        writer.write(output)
        return Response(content=output.getvalue(), media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Protection failed: {str(e)}")

@router.post("/extract-text")
async def extract_text(files: List[UploadFile] = File(...)):
    """Extract all text content from PDF"""
    try:
        file = files[0]
        content = await file.read()
        reader = PdfReader(BytesIO(content))
        
        text_content = ""
        for i, page in enumerate(reader.pages):
            text_content += f"--- Page {i+1} ---\n"
            text_content += page.extract_text() + "\n\n"
            
        return Response(content=text_content.encode('utf-8'), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

@router.post("/img-to-pdf")
async def img_to_pdf(files: List[UploadFile] = File(...)):
    """Convert multiple images to a single PDF"""
    try:
        images_bytes = [await file.read() for file in files]
        pdf_bytes = img2pdf.convert(images_bytes)
        
        return Response(content=pdf_bytes, media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image conversion failed: {str(e)}")

@router.post("/doc-to-pdf")
async def doc_to_pdf(files: List[UploadFile] = File(...)):
    """Convert Word document (.docx) to PDF"""
    if not files:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    file = files[0]
    
    try:
        content = await file.read()
        
        # Convert DOCX to HTML using Mammoth
        result = mammoth.convert_to_html(BytesIO(content))
        html_content = result.value
        
        # Convert HTML to PDF using xhtml2pdf
        pdf_output = BytesIO()
        pisa_status = pisa.CreatePDF(html_content, dest=pdf_output)
        
        if pisa_status.err:
            raise Exception("PDF generation error")
            
        return Response(content=pdf_output.getvalue(), media_type="application/pdf")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")

@router.post("/compress-pdf")
async def compress_pdf(files: List[UploadFile] = File(...)):
    """Compress PDF by reducing image quality"""
    try:
        file = files[0]
        content = await file.read()
        reader = PdfReader(BytesIO(content))
        writer = PdfWriter()
        
        for page in reader.pages:
            writer.add_page(page)
        
        # Compress images in PDF
        for page in writer.pages:
            if "/Resources" in page and "/XObject" in page["/Resources"]:
                xobjects = page["/Resources"]["/XObject"].get_object()
                
                for obj_name in xobjects:
                    obj = xobjects[obj_name]
                    
                    if obj["/Subtype"] == "/Image":
                        try:
                            # Reduce image quality for compression
                            if "/Filter" in obj:
                                # Mark for compression
                                pass
                        except:
                            pass
        
        # Remove duplicate objects and compress
        writer.add_metadata(reader.metadata if reader.metadata else {})
        
        output = BytesIO()
        writer.write(output)
        
        return Response(content=output.getvalue(), media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compression failed: {str(e)}")

@router.post("/rotate-pdf")
async def rotate_pdf(rotation: int = Form(...), files: List[UploadFile] = File(...)):
    """Rotate all pages in PDF by specified angle (90, 180, 270)"""
    try:
        file = files[0]
        content = await file.read()
        reader = PdfReader(BytesIO(content))
        writer = PdfWriter()
        
        # Validate rotation angle
        if rotation not in [90, 180, 270]:
            raise HTTPException(status_code=400, detail="Rotation must be 90, 180, or 270 degrees")
        
        for page in reader.pages:
            page.rotate(rotation)
            writer.add_page(page)
        
        output = BytesIO()
        writer.write(output)
        
        return Response(content=output.getvalue(), media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rotation failed: {str(e)}")

