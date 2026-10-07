from datetime import datetime, timezone

class CrossSourceContradictionDetector:
    """
    Cross-checks Resume Claims against GitHub & Portfolio evidence to flag inconsistencies.
    Never accuses of fraud; frames as 'Evidence Inconsistencies'.
    """

    def detect_contradictions(self, candidate_claims: list, github_raw: dict, skills_evidence: dict) -> list:
        contradictions = []
        repos = github_raw.get("repositories", [])
        profile = github_raw.get("profile", {})
        account_created = profile.get("created_at")

        # Check 1: Account Longevity vs Claimed Experience
        if account_created:
            try:
                created_dt = datetime.fromisoformat(account_created.replace("Z", "+00:00"))
                account_age_years = (datetime.now(timezone.utc) - created_dt).days / 365.25
                for claim in candidate_claims:
                    if claim.get("claimed_level", "").lower() == "expert" and account_age_years < 1.0:
                        contradictions.append({
                            "type": "EXPERIENCE_LONGEVITY_MISMATCH",
                            "severity": "MEDIUM",
                            "skill": claim.get("skill"),
                            "claim_text": claim.get("text"),
                            "observation": f"Resume claims Expert proficiency, but GitHub account was created only {round(account_age_years, 1)} years ago.",
                            "penalty": -3
                        })
            except Exception:
                pass

        # Check 2: Skill Phantom (High claimed proficiency with zero evidence)
        for claim in candidate_claims:
            skill = claim.get("skill")
            level = claim.get("claimed_level", "Intermediate")
            ev = skills_evidence.get(skill)
            
            if (not ev or ev.get("evidence_score", 0) == 0) and level in ["Expert", "Advanced"]:
                contradictions.append({
                    "type": "UNSUPPORTED_PROFICIENCY_CLAIM",
                    "severity": "HIGH",
                    "skill": skill,
                    "claim_text": claim.get("text"),
                    "observation": f"Candidate claims '{level} in {skill}', but 0 repositories or manifests reference this technology.",
                    "penalty": -5
                })

        # Check 3: Stale / Dormant Skill (Claiming current skill with no recent activity)
        for claim in candidate_claims:
            skill = claim.get("skill")
            ev = skills_evidence.get(skill)
            if ev and ev.get("evidence_score", 0) > 0 and ev.get("repos"):
                matching_repos = [r for r in repos if r["name"] in ev.get("repos", [])]
                if matching_repos:
                    min_days = min(
                        (datetime.now(timezone.utc) - datetime.fromisoformat(r["updated_at"].replace("Z", "+00:00"))).days
                        for r in matching_repos if r.get("updated_at")
                    )
                    if min_days > 450:  # Older than ~15 months
                        contradictions.append({
                            "type": "STALE_SKILL_TIMELINE",
                            "severity": "LOW",
                            "skill": skill,
                            "claim_text": claim.get("text"),
                            "observation": f"Last observable activity for {skill} was over {round(min_days/30)} months ago.",
                            "penalty": -2
                        })

        return contradictions