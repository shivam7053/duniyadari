from io import BytesIO
import os
import tempfile
from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response
from pdf2docx import Converter
from docx import Document
from docx.shared import Inches
from docxcompose.composer import Composer
import mammoth
from xhtml2pdf import pisa
from pypdf import PdfReader, PdfWriter

router = APIRouter()

@router.post("/pdf-to-doc")
async def pdf_to_doc(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    file = files[0]
    
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_pdf_path = os.path.join(temp_dir, file.filename)
            temp_docx_path = os.path.join(temp_dir, os.path.splitext(file.filename)[0] + ".docx")
            
            with open(temp_pdf_path, "wb") as f:
                f.write(await file.read())
            
            cv = Converter(temp_pdf_path)
            cv.convert(temp_docx_path)
            cv.close()
            
            with open(temp_docx_path, "rb") as f:
                docx_content = f.read()
            
            return Response(content=docx_content, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    except Exception as e:
        print(f"PDF to Doc Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")

@router.post("/img-to-doc")
async def img_to_doc(files: List[UploadFile] = File(...)):
    try:
        doc = Document()
        for file in files:
            content = await file.read()
            image_stream = BytesIO(content)
            # Add image, fitting to page width (approx 6 inches for A4 with margins)
            doc.add_picture(image_stream, width=Inches(6))
            doc.add_paragraph() # Add spacing between images
            
        output = BytesIO()
        doc.save(output)
        return Response(content=output.getvalue(), media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image to Doc failed: {str(e)}")

@router.post("/text-to-doc")
async def text_to_doc(files: List[UploadFile] = File(...)):
    try:
        file = files[0]
        content = await file.read()
        # Try decoding as UTF-8
        text = content.decode("utf-8")
        
        doc = Document()
        for line in text.split('\n'):
            doc.add_paragraph(line)
            
        output = BytesIO()
        doc.save(output)
        return Response(content=output.getvalue(), media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text to Doc failed: {str(e)}")

@router.post("/merge-doc")
async def merge_doc(files: List[UploadFile] = File(...)):
    try:
        if not files:
            raise HTTPException(status_code=400, detail="No files uploaded")

        # Load the first file as the master document
        master_content = await files[0].read()
        master_doc = Document(BytesIO(master_content))
        composer = Composer(master_doc)

        # Append subsequent files
        for file in files[1:]:
            content = await file.read()
            doc = Document(BytesIO(content))
            composer.append(doc)

        output = BytesIO()
        composer.save(output)
        return Response(content=output.getvalue(), media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Merge Doc failed: {str(e)}")

@router.post("/extract-text-doc")
async def extract_text_doc(files: List[UploadFile] = File(...)):
    try:
        file = files[0]
        content = await file.read()
        doc = Document(BytesIO(content))
        
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
            
        return Response(content="\n".join(full_text).encode('utf-8'), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

@router.post("/split-doc")
async def split_doc(
    start: int = Form(...), 
    end: int = Form(...), 
    files: List[UploadFile] = File(...)
):
    # Strategy: Docx -> PDF -> Split PDF -> Docx
    try:
        file = files[0]
        content = await file.read()
        
        # 1. Convert Docx to PDF (in memory)
        result = mammoth.convert_to_html(BytesIO(content))
        pdf_output = BytesIO()
        pisa_status = pisa.CreatePDF(result.value, dest=pdf_output)
        if pisa_status.err: raise Exception("Intermediate PDF generation failed")
        
        # 2. Split PDF
        reader = PdfReader(pdf_output)
        writer = PdfWriter()
        # Adjust 1-based index to 0-based
        for i in range(max(0, start - 1), min(len(reader.pages), end)):
            writer.add_page(reader.pages[i])
        
        split_pdf_output = BytesIO()
        writer.write(split_pdf_output)
        
        # 3. Convert Split PDF back to Docx
        # We need to write to a temp file because pdf2docx requires a file path
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_pdf_path = os.path.join(temp_dir, "split_temp.pdf")
            temp_docx_path = os.path.join(temp_dir, "split_output.docx")
            
            with open(temp_pdf_path, "wb") as f:
                f.write(split_pdf_output.getvalue())
            
            cv = Converter(temp_pdf_path)
            cv.convert(temp_docx_path)
            cv.close()
            
            with open(temp_docx_path, "rb") as f:
                docx_content = f.read()
                
            return Response(content=docx_content, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Split Doc failed: {str(e)}")