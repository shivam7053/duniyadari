from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pdf_tools import router as pdf_router
from doc_tools import router as doc_router
from image_tools import router as img_router

app = FastAPI()

# Allow your React app to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your Netlify URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(pdf_router)
app.include_router(doc_router)
app.include_router(img_router)

if __name__ == "__main__":
    import uvicorn
    # reload=True allows the server to update automatically when you save code
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
