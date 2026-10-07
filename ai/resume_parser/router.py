import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from ai.resume_parser.service import analyze_resume_pipeline
from ai.resume_parser.rewriter import rewrite_weak_bullets
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api/resume", tags=["Resume Intelligence"])

class RewriteRequest(BaseModel):
    bullets: List[str]

@router.post("/upload")
async def upload_and_analyze_resume(file: UploadFile = File(...)):
    """Uploads a resume file (PDF/DOCX/TXT) and runs full claim extraction & ATS analysis."""
    allowed_extensions = [".pdf", ".docx", ".doc", ".txt"]
    ext = os.path.splitext(file.filename)[1].lower()
    
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Unsupported file format: {ext}")

    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = analyze_resume_pipeline(temp_path)
        return result
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/rewrite")
async def rewrite_resume_bullets(req: RewriteRequest):
    """Rewrites weak bullet points into high-impact statements."""
    return {"rewrites": rewrite_weak_bullets(req.bullets)}