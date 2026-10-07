COMMON_TUTORIAL_PATTERNS = [
    "todo", "weather", "calculator", "counter", "notes-app", "blog-app", "portfolio-template"
]

def calculate_originality_confidence(repo: dict, signals: dict) -> dict:
    """
    Computes Originality Confidence (0-100) for a repository with explainable factors.
    """
    score = 70  # Baseline neutral score
    positives = []
    cautions = []

    repo_name_lower = repo["name"].lower()
    commits = repo.get("commits", [])

    # Check for tutorial name patterns
    if any(pat in repo_name_lower for pat in COMMON_TUTORIAL_PATTERNS):
        score -= 15
        cautions.append("Repository resembles a common tutorial/starter category")
    
    # Check commit volume & continuity
    if len(commits) >= 10:
        score += 15
        positives.append(f"{len(commits)}+ meaningful development commits")
    elif len(commits) <= 1:
        score -= 20
        cautions.append("Single initial commit with bulk codebase")

    # Tests signal engineering maturity
    if signals.get("has_tests"):
        score += 10
        positives.append("Automated test suite configured")

    # Documentation signal
    if signals.get("has_readme"):
        score += 5
        positives.append("Custom README documentation found")
    else:
        score -= 10
        cautions.append("Missing README or architecture explanation")

    # CI/CD integration
    if signals.get("has_ci"):
        score += 5
        positives.append("CI/CD automation workflows detected")

    # Clamping between 10 and 99
    final_score = max(10, min(99, score))

    return {
        "repo_name": repo["name"],
        "originality_confidence": final_score,
        "positive_signals": positives,
        "caution_signals": cautions
    }

def evaluate_profile_originality(raw_data: dict, profile_signals: dict) -> dict:
    """Evaluates originality confidence across all candidate repositories."""
    repo_results = []
    signals_by_repo = {s["repo_name"]: s for s in profile_signals["repo_signals"]}

    for repo in raw_data.get("repositories", []):
        s = signals_by_repo.get(repo["name"], {})
        result = calculate_originality_confidence(repo, s)
        repo_results.append(result)

    avg_score = round(sum(r["originality_confidence"] for r in repo_results) / max(len(repo_results), 1))

    return {
        "overall_originality_confidence": avg_score,
        "repository_evaluations": repo_results
    }