"""
Deterministic Readiness Scoring Engine using Dynamic Requirements.
"""
from typing import Dict, Any

def get_verification_status(evidence_score: int) -> str:
    if evidence_score >= 70:
        return "VERIFIED"
    elif evidence_score >= 40:
        return "PARTIAL"
    return "UNSUPPORTED"

def calculate_readiness(candidate_data: Dict[str, Any], dynamic_demand: Dict[str, int]) -> Dict[str, Any]:
    evidence = candidate_data.get("evidence", {})
    signals = candidate_data.get("github_signals", {})

    total_demand_weight = sum(dynamic_demand.values()) or 1
    weighted_verified_sum = 0.0

    for skill, demand_pct in dynamic_demand.items():
        ev_score = evidence.get(skill, {}).get("score", 0)
        status = get_verification_status(ev_score)
        
        if status == "VERIFIED":
            weighted_verified_sum += ev_score * demand_pct
        elif status == "PARTIAL":
            weighted_verified_sum += (ev_score * 0.5) * demand_pct

    raw_tech = (weighted_verified_sum / total_demand_weight)
    tech_score = round((raw_tech / 100.0) * 30.0, 1)

    proj_score = round((signals.get("project_quality_score", 50) / 100.0) * 20.0, 1)
    const_score = round((signals.get("consistency_score", 50) / 100.0) * 15.0, 1)
    eng_score = round((signals.get("engineering_score", 50) / 100.0) * 10.0, 1)
    doc_score = round((signals.get("documentation_score", 50) / 100.0) * 10.0, 1)

    verified_count = sum(1 for s in dynamic_demand if get_verification_status(evidence.get(s, {}).get("score", 0)) == "VERIFIED")
    align_score = round((verified_count / max(1, len(dynamic_demand))) * 15.0, 1)

    total_score = int(round(tech_score + proj_score + const_score + eng_score + doc_score + align_score))

    sources = candidate_data.get("profile_sources", {})
    confidence = 0
    if sources.get("resume"): confidence += 35
    if sources.get("github"): confidence += 40
    if signals.get("repositories_analyzed", 0) >= 3: confidence += 25

    waterfall = [
        {"factor": "Base Profile Baseline", "delta": 50},
        {"factor": "Technical Evidence", "delta": round(tech_score - 15, 1)},
        {"factor": "Project Quality", "delta": round(proj_score - 10, 1)},
        {"factor": "Activity Consistency", "delta": round(const_score - 7.5, 1)},
        {"factor": "Engineering Practices", "delta": round(eng_score - 5, 1)},
        {"factor": "Documentation Quality", "delta": round(doc_score - 5, 1)}
    ]

    for claim in candidate_data.get("claimed_skills", []):
        s_name = claim.get("name")
        ev = evidence.get(s_name, {}).get("score", 0)
        if claim.get("claimed_level") in ["Advanced", "Expert"] and ev < 40:
            waterfall.append({
                "factor": f"Unsupported Claim: {s_name} ({claim.get('claimed_level')})",
                "delta": -4
            })

    return {
        "readiness_score": total_score,
        "confidence_score": confidence,
        "breakdown": {
            "technical": tech_score,
            "projects": proj_score,
            "consistency": const_score,
            "engineering": eng_score,
            "documentation": doc_score,
            "role_alignment": align_score
        },
        "waterfall": waterfall
    }
