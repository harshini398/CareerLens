import os
import shutil
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

from ai.resume_parser.service import analyze_resume_pipeline
from ai.resume_parser.rewriter import rewrite_weak_bullets
from ai.resume_parser.linkedin_parser import parse_linkedin_profile
from ai.resume_parser.interview_bot import evaluate_interview_response
from ai.resume_parser.portfolio_feedback import analyze_portfolio_quality

router = APIRouter(prefix="/api/resume", tags=["Resume Intelligence"])

# --- Request Models ---
class RewriteRequest(BaseModel):
    bullets: List[str]

class LinkedInRequest(BaseModel):
    profile_text: str

class InterviewEvalRequest(BaseModel):
    question: str
    candidate_answer: str
    claim_context: str = ""

class PortfolioRequest(BaseModel):
    links: List[str]
    summary: str = ""


# --- 1. Resume Upload & Extraction ---
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


# --- 2. Resume Rewriter ---
@router.post("/rewrite")
async def rewrite_resume_bullets(req: RewriteRequest):
    """Rewrites weak bullet points into high-impact statements."""
    return {"rewrites": rewrite_weak_bullets(req.bullets)}


# --- 3. LinkedIn Profile Parser ---
@router.post("/linkedin")
async def parse_linkedin_endpoint(req: LinkedInRequest):
    """Parses user-provided LinkedIn profile text export."""
    return parse_linkedin_profile(req.profile_text)


# --- 4. Interactive Mock Interview Bot ---
@router.post("/interview/evaluate")
async def evaluate_interview_endpoint(req: InterviewEvalRequest):
    """Evaluates student's answer in the interactive mock interview."""
    return evaluate_interview_response(req.question, req.candidate_answer, req.claim_context)


# --- 5. Portfolio & Design Feedback ---
@router.post("/portfolio/feedback")
async def portfolio_feedback_endpoint(req: PortfolioRequest):
    """Generates actionable feedback for Figma, Behance, or GitHub portfolios."""
    return analyze_portfolio_quality(req.links, req.summary)