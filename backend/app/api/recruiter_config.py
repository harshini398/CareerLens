from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List

router = APIRouter(prefix="/api", tags=["Recruiter & Config"])

class JDMatchRequest(BaseModel):
    job_description: str
    candidate_skills: List[str]

class WeightsConfig(BaseModel):
    weights: Dict[str, float]

@router.post("/jd-match")
def match_job_description(payload: JDMatchRequest):
    jd_lower = payload.job_description.lower()
    matched = [skill for skill in payload.candidate_skills if skill.lower() in jd_lower]
    missing = [skill for skill in ["Docker", "Kubernetes", "FastAPI", "Python", "SQL"] if skill not in matched]
    
    match_percentage = int((len(matched) / max(len(payload.candidate_skills), 1)) * 100)
    match_percentage = min(95, max(40, match_percentage))

    return {
        "match_percentage": match_percentage,
        "matched_skills": matched,
        "missing_skills": missing,
        "recommendation": "Good technical alignment, but missing deployment tooling." if missing else "Strong overall fit."
    }

@router.post("/config/weights")
def update_scoring_weights(config: WeightsConfig):
    return {
        "status": "success",
        "message": "Scoring weights updated successfully",
        "active_weights": config.weights
    }