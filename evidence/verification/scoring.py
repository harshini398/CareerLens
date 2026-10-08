from evidence.skill_mapping.taxonomy import detect_skills_in_repo, SKILL_PATTERNS
from evidence.github.parser import parse_repo_signals

def calculate_evidence_strength(skill: str, matching_repos: list, all_repos_count: int) -> dict:
    """
    Computes Evidence Strength (0-100) for a given skill across matching repositories.
    """
    if not matching_repos:
        return {
            "skill": skill,
            "evidence_score": 0,
            "level": "Weak",
            "repo_count": 0,
            "repos": []
        }

    # 1. Technology Usage (0-100): Proportion of candidate repos containing this skill
    usage = min(100, (len(matching_repos) / max(all_repos_count, 1)) * 120)

    # 2. Recency (0-100): How recently was code in this skill updated?
    min_days = min(r["signals"]["days_since_update"] for r in matching_repos)
    if min_days <= 30:
        recency = 100
    elif min_days <= 90:
        recency = 80
    elif min_days <= 180:
        recency = 60
    elif min_days <= 365:
        recency = 40
    else:
        recency = 20

    # 3. Code Volume (0-100): Based on repository size and commit count
    total_commits = sum(r["signals"]["commit_sample_count"] for r in matching_repos)
    volume = min(100, total_commits * 6)

    # 4. Project Complexity (0-100): Dependencies, stars, forks
    has_manifests = any(bool(r["repo"].get("manifests")) for r in matching_repos)
    complexity = 80 if has_manifests else 40

    # 5. Documentation (0-100): README presence
    doc_count = sum(1 for r in matching_repos if r["signals"]["has_readme"])
    documentation = min(100, int((doc_count / len(matching_repos)) * 100))

    # 6. Engineering Practices (0-100): Tests, Docker, CI/CD
    tested = any(r["signals"]["has_tests"] for r in matching_repos)
    has_docker = any(r["signals"]["has_docker"] for r in matching_repos)
    has_ci = any(r["signals"]["has_ci"] for r in matching_repos)
    engineering = (40 if tested else 0) + (30 if has_docker else 0) + (30 if has_ci else 0)

    # 7. Multi-source confirmation: Bonus points
    multi_source = 70 if len(matching_repos) >= 2 else 40

    # Final Weighted Formula
    score = (
        0.25 * usage +
        0.20 * recency +
        0.15 * volume +
        0.15 * complexity +
        0.10 * documentation +
        0.10 * engineering +
        0.05 * multi_source
    )
    final_score = round(min(100, max(0, score)))

    # Classification labels per problem statement
    if final_score >= 90:
        level = "Very Strong"
    elif final_score >= 75:
        level = "Strong"
    elif final_score >= 60:
        level = "Moderate"
    elif final_score >= 40:
        level = "Limited"
    else:
        level = "Weak"

    return {
        "skill": skill,
        "evidence_score": final_score,
        "level": level,
        "repo_count": len(matching_repos),
        "repos": [r["repo"]["name"] for r in matching_repos]
    }

def analyze_all_skills_evidence(raw_data: dict) -> dict:
    """Analyzes evidence strength for all detected skills in candidate's repositories."""
    repos = raw_data.get("repositories", [])
    all_count = len(repos)

    enriched_repos = []
    for r in repos:
        signals = parse_repo_signals(r)
        skills = detect_skills_in_repo(r)
        enriched_repos.append({
            "repo": r,
            "signals": signals,
            "skills": skills
        })

    all_found_skills = set()
    for er in enriched_repos:
        all_found_skills.update(er["skills"])

    skill_evidence = {}
    for skill in all_found_skills:
        matching = [er for er in enriched_repos if skill in er["skills"]]
        skill_evidence[skill] = calculate_evidence_strength(skill, matching, all_count)

    return skill_evidence
