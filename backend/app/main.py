"""
CareerLens API Server.
"""
import sys
import os

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from app.ingestion.pdf_parser import extract_text_from_pdf, parse_resume_content
from app.evidence.github_scanner import scan_github_profile
from app.scoring.dataset_role_engine import get_role_benchmark
from app.scoring.readiness_engine import calculate_readiness, CONFIG_WEIGHTS
from app.scoring.gap_analyzer import analyze_skill_gaps
from app.scoring.roadmap_engine import generate_roadmap
from app.scoring.what_if_engine import simulate_what_if

app = FastAPI(title="CareerLens API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WhatIfRequest(BaseModel):
    candidate_data: Dict[str, Any] = Field(
        default={
            "target_role": "Backend Developer",
            "evidence": {
                "Python": {"score": 85},
                "Docker": {"score": 10},
                "Testing": {"score": 30}
            },
            "github_signals": {
                "engineering_score": 40,
                "project_quality_score": 60,
                "consistency_score": 55,
                "documentation_score": 60
            }
        }
    )
    actions: List[str] = Field(default=["learn_docker", "add_tests"])

@app.get("/")
def health_check():
    return {"status": "ok", "product": "CareerLens Employability Engine"}

@app.post("/api/analyze/profile")
async def analyze_profile(
    resume_file: UploadFile = File(...),
    github_username: Optional[str] = Form(None),
    target_role: Optional[str] = Form("Backend Developer")
):
    if not resume_file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_bytes = await resume_file.read()
    raw_text = extract_text_from_pdf(file_bytes)
    if not raw_text:
        raise HTTPException(status_code=400, detail="Could not extract text from this PDF.")

    parsed_profile = parse_resume_content(raw_text)
    resolved_github_user = github_username or parsed_profile.get("github_username")
    resolved_role = target_role or parsed_profile.get("target_role", "Backend Developer")

    role_benchmark = get_role_benchmark(resolved_role)
    dynamic_demand = role_benchmark["market_demand"]

    github_data = scan_github_profile(resolved_github_user)

    candidate_payload = {
        "target_role": resolved_role,
        "profile_sources": {
            "resume": True,
            "github": bool(resolved_github_user and "error" not in github_data),
            "portfolio": False
        },
        "claimed_skills": parsed_profile["skills"],
        "claims": parsed_profile["claims"],
        "evidence": github_data.get("evidence", {}),
        "github_signals": github_data.get("signals", {
            "repositories_analyzed": 0,
            "project_quality_score": 45,
            "consistency_score": 40,
            "engineering_score": 35,
            "documentation_score": 50
        })
    }

    # 1. Scoring with configurable weights
    readiness = calculate_readiness(candidate_payload, dynamic_demand)
    gaps = analyze_skill_gaps(candidate_payload, dynamic_demand)
    roadmap = generate_roadmap(resolved_role, gaps)

    # 2. 3-Role Comparison Leaderboard (Evaluates across at least 3 roles)
    comparison_roles = ["Backend Developer", "Frontend Developer", "Data Engineer"]
    role_comparison = []
    for r in comparison_roles:
        r_bench = get_role_benchmark(r)
        r_demand = r_bench["market_demand"]
        total_w = sum(r_demand.values()) or 1
        score_w = sum(candidate_payload["evidence"].get(s, {}).get("score", 0) * d for s, d in r_demand.items())
        role_comparison.append({
            "role": r,
            "fit_score": int(round(score_w / total_w)),
            "jobs_sampled": r_bench.get("jobs_analyzed", 500)
        })
    role_comparison.sort(key=lambda x: x["fit_score"], reverse=True)

    return {
        "candidate": {
            "target_role": resolved_role,
            "github_username": resolved_github_user,
            "extracted_skills": parsed_profile["skills"],
            "claims_count": len(parsed_profile["claims"])
        },
        "market_benchmark": {
            "source": "LinkedIn Job Postings Dataset",
            "jobs_analyzed": role_benchmark["jobs_analyzed"],
            "real_market_demand": dynamic_demand
        },
        "role_comparison": role_comparison,               # <-- 3-ROLE COMPARISON
        "github_analysis": {
            "connected": bool(resolved_github_user and "error" not in github_data),
            "repositories_analyzed": github_data.get("signals", {}).get("repositories_analyzed", 0),
            "error": github_data.get("error")
        },
        "readiness": readiness,
        "skill_gaps": gaps,
        "roadmap": roadmap
    }

@app.post("/api/what-if")
def run_what_if(req: WhatIfRequest):
    candidate_data = req.candidate_data
    target_role = candidate_data.get("target_role", "Backend Developer")
    benchmark = get_role_benchmark(target_role)
    return simulate_what_if(candidate_data, benchmark["market_demand"], req.actions)
