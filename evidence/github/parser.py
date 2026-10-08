from datetime import datetime, timezone

def analyze_languages(repositories: list) -> dict:
    """Calculates overall language percentage across all user repositories."""
    totals = {}
    for repo in repositories:
        for lang, bytes_count in repo.get("languages", {}).items():
            totals[lang] = totals.get(lang, 0) + bytes_count
    
    total_bytes = sum(totals.values())
    if total_bytes == 0:
        return {}
    
    # Return percentage breakdown rounded to 1 decimal
    return {lang: round((b / total_bytes) * 100, 1) for lang, b in sorted(totals.items(), key=lambda x: x[1], reverse=True)}

def parse_repo_signals(repo: dict) -> dict:
    """Extracts engineering signals for a single repository."""
    root_files = [f.lower() for f in repo.get("root_files", [])]
    manifests = repo.get("manifests", {})
    commits = repo.get("commits", [])
    
    # 1. Docker Signal
    has_docker = any("dockerfile" in f or "docker-compose" in f for f in root_files)
    
    # 2. Testing Signal
    has_tests = any("test" in f or "tests" in f for f in root_files)
    # Also check inside requirements.txt or package.json for test runners
    reqs = manifests.get("requirements.txt", "").lower()
    pkg = manifests.get("package.json", "").lower()
    if "pytest" in reqs or "unittest" in reqs or "jest" in pkg or "mocha" in pkg:
        has_tests = True

    # 3. CI/CD Signal
    has_ci = ".github" in root_files or any("ci" in f for f in root_files)

    # 4. Documentation Quality
    has_readme = any("readme" in f for f in root_files)

    # 5. Recency calculation (days since last commit or update)
    updated_str = repo.get("updated_at")
    days_since_update = 999
    if updated_str:
        try:
            updated_dt = datetime.fromisoformat(updated_str.replace("Z", "+00:00"))
            days_since_update = (datetime.now(timezone.utc) - updated_dt).days
        except Exception:
            pass

    return {
        "repo_name": repo["name"],
        "has_docker": has_docker,
        "has_tests": has_tests,
        "has_ci": has_ci,
        "has_readme": has_readme,
        "commit_sample_count": len(commits),
        "days_since_update": days_since_update,
        "stars": repo.get("stars", 0),
        "forks": repo.get("forks", 0)
    }

def extract_profile_signals(raw_data: dict) -> dict:
    """Aggregates signals across all repositories for a candidate."""
    repos = raw_data.get("repositories", [])
    repo_signals = [parse_repo_signals(r) for r in repos]
    
    languages = analyze_languages(repos)
    
    total_docker_repos = sum(1 for s in repo_signals if s["has_docker"])
    total_tested_repos = sum(1 for s in repo_signals if s["has_tests"])
    total_ci_repos = sum(1 for s in repo_signals if s["has_ci"])
    
    return {
        "username": raw_data.get("username"),
        "languages": languages,
        "repo_signals": repo_signals,
        "summary": {
            "total_analyzed_repos": len(repos),
            "docker_repos_count": total_docker_repos,
            "tested_repos_count": total_tested_repos,
            "ci_cd_repos_count": total_ci_repos,
            "most_used_language": list(languages.keys())[0] if languages else "None"
        }
    }