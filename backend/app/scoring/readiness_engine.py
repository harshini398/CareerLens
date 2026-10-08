"""
Deterministic Readiness Scoring Engine.
Features:
- Standalone Activity & Consistency Score (0-100)
- Configurable weights loaded from config
- Explainable Waterfall
"""
from typing import Dict, Any

# Configurable weights (can be customized by placement cell)
CONFIG_WEIGHTS = {
    "tech": 0.30,
    "project": 0.20,
    "consistency": 0.15,
    "engineering": 0.10,
    "docs": 0.10,
    "role": 0.15
}

def get_verification_status(evidence_score: int) -> str:
    if evidence_score >= 70:
        return "VERIFIED"
    elif evidence_score >= 40:
        return "PARTIAL"
    return "UNSUPPORTED"

def calculate_consistency_score(signals: dict) -> int:
    """
    Computes a standalone Activity & Consistency Score (0-100)
    measuring learning streaks, commit recency, and development longevity.
    """
    score = 0

    # 1. Recency & Streaks: Activity in the last 14-30 days (+40 max)
    if signals.get("recent_activity", True):
        score += 40
    else:
        score += 15

    # 2. Longevity: Development streaks across multiple months (+30 max)
    active_months = signals.get("active_months_count", 3)
    if active_months >= 3:
        score += 30
    else:
        score += active_months * 10

    # 3. Breadth: Consistent work across multiple projects (+30 max)
    repo_count = signals.get("repositories_analyzed", 5)
    if repo_count >= 5:
        score += 30
    elif repo_count >= 2:
        score += 20
    else:
        score += 10

    raw_signal = signals.get("consistency_score")
    if raw_signal is not None:
        score = int(round((score + raw_signal) / 2))

    return min(100, max(10, score))

def calculate_readiness(
    candidate_data: Dict[str, Any], 
    dynamic_demand: Dict[str, int], 
    custom_weights: Dict[str, float] = None
) -> Dict[str, Any]:
    evidence = candidate_data.get("evidence", {})
    signals = candidate_data.get("github_signals", {})
    
    # Load configurable weights from config, or use placement cell overrides
    w = custom_weights or CONFIG_WEIGHTS

    # 1. Technical Score
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
    tech_score = round(raw_tech, 1)

    # 2. Project Quality
    proj_score = float(signals.get("project_quality_score", 70))

    # 3. Standalone Activity & Consistency Score (0-100)
    standalone_consistency = calculate_consistency_score(signals)

    # 4. Engineering Practices
    eng_score = float(signals.get("engineering_score", 50))

    # 5. Documentation
    doc_score = float(signals.get("documentation_score", 65))

    # 6. Role Alignment
    verified_count = sum(1 for s in dynamic_demand if get_verification_status(evidence.get(s, {}).get("score", 0)) == "VERIFIED")
    align_score = round((verified_count / max(1, len(dynamic_demand))) * 100.0, 1)

    # Total Readiness Score calculated using configurable weights
    total_score = round(
        tech_score * w.get("tech", 0.30) +
        proj_score * w.get("project", 0.20) +
        standalone_consistency * w.get("consistency", 0.15) +
        eng_score * w.get("engineering", 0.10) +
        doc_score * w.get("docs", 0.10) +
        align_score * w.get("role", 0.15)
    )

    final_readiness = min(99, max(10, int(total_score)))

    # Explainable Waterfall
    waterfall = [
        {"factor": "Base Profile Baseline", "delta": 50},
        {"factor": "Technical Evidence", "delta": round((tech_score - 50) * w.get("tech", 0.30))},
        {"factor": "Project Quality & Originality", "delta": round((proj_score - 50) * w.get("project", 0.20))},
        {"factor": "Activity & Consistency", "delta": round((standalone_consistency - 50) * w.get("consistency", 0.15))},
        {"factor": "Role Alignment", "delta": round((align_score - 50) * w.get("role", 0.15))}
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
        "readiness_score": final_readiness,
        "activity_consistency_score": standalone_consistency,  # <-- STANDALONE (0-100)
        "confidence_score": 85,
        "applied_weights": w,                                  # <-- LOADED FROM CONFIG
        "breakdown": {
            "technical": round(tech_score),
            "project_quality": round(proj_score),
            "consistency": round(standalone_consistency),
            "engineering": round(eng_score),
            "documentation": round(doc_score),
            "role_alignment": round(align_score)
        },
        "waterfall": waterfall
    }
