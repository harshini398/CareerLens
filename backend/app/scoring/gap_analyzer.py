"""
Dynamic Skill Gap Analyzer.
"""
from typing import Dict, Any, List

def get_verification_status(evidence_score: int) -> str:
    if evidence_score >= 70:
        return "VERIFIED"
    elif evidence_score >= 40:
        return "PARTIAL"
    return "UNSUPPORTED"

def analyze_skill_gaps(candidate_data: Dict[str, Any], dynamic_demand: Dict[str, int]) -> List[Dict[str, Any]]:
    evidence = candidate_data.get("evidence", {})
    gaps = []

    for skill, demand_pct in dynamic_demand.items():
        candidate_score = evidence.get(skill, {}).get("score", 0)
        status = get_verification_status(candidate_score)
        benchmark = 70

        gap = candidate_score - benchmark
        is_gap = status != "VERIFIED"
        deficiency = max(0, -gap)
        priority_score = round((demand_pct / 100.0) * deficiency, 1)

        gaps.append({
            "skill": skill,
            "market_demand": f"{demand_pct}%",
            "candidate_score": candidate_score,
            "verification_status": status,
            "is_gap": is_gap,
            "gap": gap,
            "priority_score": priority_score,
            "reason": (
                "Verified proof found." if status == "VERIFIED"
                else "Weak/partial evidence detected." if status == "PARTIAL"
                else "No proof found across repositories (unsupported claim)."
            )
        })

    gaps.sort(key=lambda x: x["priority_score"], reverse=True)
    return gaps
