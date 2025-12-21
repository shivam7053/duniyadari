from io import BytesIO
from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response
from pypdf import PdfWriter, PdfReader
import img2pdf
import mammoth
from xhtml2pdf import pisa

router = APIRouter()

@router.post("/merge-pdf")
async def merge_pdf(files: List[UploadFile] = File(...)):
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
    try:
        file = files[0] # Process first file
        content = await file.read()
        reader = PdfReader(BytesIO(content))
        writer = PdfWriter()

        # Validate range
        total_pages = len(reader.pages)
        # Adjust for 0-based index, ensure bounds
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
    try:
        file = files[0]
        content = await file.read()
        reader = PdfReader(BytesIO(content))
        writer = PdfWriter()
        writer.append_pages_from_reader(reader)
        writer.encrypt(password)
        
        output = BytesIO()
        writer.write(output)
        return Response(content=output.getvalue(), media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Protection failed: {str(e)}")

@router.post("/extract-text")
async def extract_text(files: List[UploadFile] = File(...)):
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
    try:
        # Read all images into bytes
        images_bytes = [await file.read() for file in files]
        
        # Convert to PDF
        pdf_bytes = img2pdf.convert(images_bytes)
        
        return Response(content=pdf_bytes, media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image conversion failed: {str(e)}")

@router.post("/doc-to-pdf")
async def doc_to_pdf(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    file = files[0] # Process one file at a time for safety
    
    try:
        # Read file content
        content = await file.read()
        
        # 1. Convert DOCX to HTML using Mammoth
        result = mammoth.convert_to_html(BytesIO(content))
        html_content = result.value
        
        # 2. Convert HTML to PDF using xhtml2pdf
        pdf_output = BytesIO()
        pisa_status = pisa.CreatePDF(html_content, dest=pdf_output)
        
        if pisa_status.err:
            raise Exception("PDF generation error")
            
        return Response(content=pdf_output.getvalue(), media_type="application/pdf")
        
    except Exception as e:
        print(f"Conversion Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")