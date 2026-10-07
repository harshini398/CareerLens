from evidence.verification.scoring import calculate_evidence_strength

def verify_single_claim(claim: dict, skill_evidence: dict, raw_github: dict) -> dict:
    """
    Verifies a single claim against computed skill evidence and repository signals.
    """
    skill = claim.get("skill")
    claimed_level = claim.get("claimed_level", "Intermediate")
    
    evidence = skill_evidence.get(skill)
    
    # If no evidence was detected for this skill at all
    if not evidence or evidence.get("evidence_score", 0) < 40:
        score = evidence.get("evidence_score", 0) if evidence else 0
        return {
            "claim_id": claim.get("id"),
            "claim_text": claim.get("text"),
            "skill": skill,
            "claimed_level": claimed_level,
            "evidence_score": score,
            "status": "UNSUPPORTED",
            "reason": f"No observable evidence (0 config files or repositories) found for {skill}.",
            "repositories": [],
            "impact_on_readiness": -4
        }

    score = evidence.get("evidence_score", 0)
    repos = evidence.get("repos", [])

    # Check for proficiency mismatch (e.g., claimed Expert but evidence is only moderate)
    if claimed_level.lower() == "expert" and score < 75:
        status = "PARTIAL"
        reason = f"Evidence exists ({len(repos)} repos), but activity volume does not support expert-level proficiency."
        impact = -2
    elif score >= 75:
        status = "VERIFIED"
        reason = f"Strong evidence across {len(repos)} repositories with active development and engineering practices."
        impact = +5
    else:
        status = "PARTIAL"
        reason = f"Moderate observable evidence found across {len(repos)} repositories."
        impact = 0

    return {
        "claim_id": claim.get("id"),
        "claim_text": claim.get("text"),
        "skill": skill,
        "claimed_level": claimed_level,
        "evidence_score": score,
        "status": status,
        "reason": reason,
        "repositories": repos,
        "impact_on_readiness": impact
    }

def verify_all_claims(claims: list, skill_evidence: dict, raw_github: dict) -> list:
    """Matches and verifies a list of candidate claims against GitHub evidence."""
    return [verify_single_claim(c, skill_evidence, raw_github) for c in claims]