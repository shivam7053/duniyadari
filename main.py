from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pdf_tools import router as pdf_router
from doc_tools import router as doc_router
from image_tools import router as img_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://duniyadari.netlify.app",
        "https://dailytoolsss.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdf_router)
app.include_router(doc_router)
app.include_router(img_router)
