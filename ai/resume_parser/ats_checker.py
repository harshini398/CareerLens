from typing import Dict, List, Any
from ai.resume_parser.schemas import CandidateProfile

def analyze_ats_readability(raw_text: str, profile: CandidateProfile) -> Dict[str, Any]:
    """Evaluates resume structure, formatting risks, and ATS score."""
    score = 100
    suggestions: List[str] = []
    strengths: List[str] = []

    # 1. Contact Information Check
    if not profile.candidate.email:
        score -= 10
        suggestions.append("Missing email address.")
    else:
        strengths.append("Clear contact email found.")

    if not profile.candidate.phone:
        score -= 5
        suggestions.append("Missing phone number.")

    # 2. Section Completeness Check
    if not profile.skills:
        score -= 15
        suggestions.append("No explicit skills section identified.")
    else:
        strengths.append(f"{len(profile.skills)} technical skills detected.")

    if not profile.projects:
        score -= 15
        suggestions.append("No projects found. Add 2-3 production-grade projects.")
    else:
        strengths.append(f"{len(profile.projects)} projects detailed.")

    if not profile.experience:
        score -= 10
        suggestions.append("No professional or internship experience listed.")

    # 3. Measurable Impact / Metrics Check (Claims with metrics)
    claims_with_metrics = [c for c in profile.claims if c.metric]
    if len(claims_with_metrics) < 2:
        score -= 10
        suggestions.append("Few quantifiable metrics (%, users, latency). Use numbers to show impact.")
    else:
        strengths.append(f"{len(claims_with_metrics)} quantifiable achievements identified.")

    # 4. Length Sanity Check
    word_count = len(raw_text.split())
    if word_count < 150:
        score -= 15
        suggestions.append("Resume is too brief (< 150 words). Provide more technical detail.")
    elif word_count > 1000:
        score -= 5
        suggestions.append("Resume is overly long (> 1000 words). Aim for a concise 1-2 pages.")
    else:
        strengths.append("Optimal resume length.")

    # Clamp score between 0 and 100
    final_score = max(0, min(100, score))

    return {
        "ats_score": final_score,
        "rating": "Excellent" if final_score >= 85 else "Good" if final_score >= 70 else "Needs Improvement",
        "strengths": strengths,
        "suggestions": suggestions,
    }