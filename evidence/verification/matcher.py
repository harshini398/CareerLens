def verify_single_claim(claim: dict, skill_evidence: dict, raw_github: dict) -> dict:
    """
    Verifies a single claim against computed skill evidence and repository signals.
    Provides clickable URLs and file proofs for P5's frontend dashboard.
    """
    skill = claim.get("skill")
    claimed_level = claim.get("claimed_level", "Intermediate")
    
    evidence = skill_evidence.get(skill)
    repos_raw = raw_github.get("repositories", [])
    
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
            "evidence_sources": [],
            "impact_on_readiness": -4
        }

    score = evidence.get("evidence_score", 0)
    matching_repo_names = evidence.get("repos", [])

    # Collect clickable URLs and specific file proofs for frontend
    evidence_sources = []
    for r in repos_raw:
        if r["name"] in matching_repo_names:
            proof_files = [f for f in r.get("root_files", []) if any(kw in f.lower() for kw in ["docker", "req", "test", "pkg", "py", "js"])]
            evidence_sources.append({
                "repo_name": r["name"],
                "url": r.get("html_url", f"https://github.com/{raw_github.get('username')}/{r['name']}"),
                "proof_files": proof_files[:5]
            })

    # Evaluate proficiency level alignment
    if claimed_level.lower() == "expert" and score < 75:
        status = "PARTIAL"
        reason = f"Evidence exists ({len(matching_repo_names)} repos), but activity volume does not support expert-level proficiency."
        impact = -2
    elif score >= 75:
        status = "VERIFIED"
        reason = f"Strong evidence across {len(matching_repo_names)} repositories with active development and tests."
        impact = +5
    else:
        status = "PARTIAL"
        reason = f"Moderate observable evidence found across {len(matching_repo_names)} repositories."
        impact = 0

    return {
        "claim_id": claim.get("id"),
        "claim_text": claim.get("text"),
        "skill": skill,
        "claimed_level": claimed_level,
        "evidence_score": score,
        "status": status,
        "reason": reason,
        "repositories": matching_repo_names,
        "evidence_sources": evidence_sources,
        "impact_on_readiness": impact
    }

def verify_all_claims(claims: list, skill_evidence: dict, raw_github: dict) -> list:
    """Matches and verifies a list of candidate claims against GitHub evidence."""
    return [verify_single_claim(c, skill_evidence, raw_github) for c in claims]