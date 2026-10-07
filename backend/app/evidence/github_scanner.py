"""
Live GitHub Evidence Scanner.
"""
import requests
from typing import Dict, Any

GITHUB_API_URL = "https://api.github.com"

def scan_github_profile(username: str) -> Dict[str, Any]:
    if not username:
        return {"error": "No GitHub username detected", "evidence": {}, "signals": {}}

    url = f"{GITHUB_API_URL}/users/{username}/repos?per_page=30&sort=updated"
    try:
        res = requests.get(url, timeout=8)
        if res.status_code != 200:
            return {
                "error": f"GitHub user '{username}' returned status {res.status_code}",
                "evidence": {},
                "signals": {"repositories_analyzed": 0}
            }
        repos = res.json()
    except Exception as e:
        return {"error": f"Connection error: {str(e)}", "evidence": {}, "signals": {}}

    language_counts = {}
    has_docker = False
    has_tests = False
    total_stars = 0

    for r in repos:
        lang = r.get("language")
        if lang:
            language_counts[lang] = language_counts.get(lang, 0) + 1
        
        total_stars += r.get("stargazers_count", 0)
        repo_name = r.get("name", "").lower()
        repo_desc = (r.get("description") or "").lower()

        if any(k in repo_name or k in repo_desc for k in ["docker", "container"]):
            has_docker = True
        if any(k in repo_name or k in repo_desc for k in ["test", "pytest", "spec", "jest"]):
            has_tests = True

    def calculate_score(count: int) -> int:
        if count == 0:
            return 8
        return min(95, 30 + count * 20)

    evidence = {
        "Python": {"score": calculate_score(language_counts.get("Python", 0)), "repos": language_counts.get("Python", 0)},
        "JavaScript": {"score": calculate_score(language_counts.get("JavaScript", 0)), "repos": language_counts.get("JavaScript", 0)},
        "TypeScript": {"score": calculate_score(language_counts.get("TypeScript", 0)), "repos": language_counts.get("TypeScript", 0)},
        "SQL": {"score": 65 if "sql" in str(repos).lower() else 10, "repos": 1 if "sql" in str(repos).lower() else 0},
        "REST APIs": {"score": 75 if any("api" in r.get("name", "").lower() for r in repos) else 20, "repos": 1},
        "Git": {"score": 85 if len(repos) > 0 else 0, "repos": len(repos)},
        "Docker": {"score": 75 if has_docker else 8, "repos": 1 if has_docker else 0},
        "Testing": {"score": 70 if has_tests else 20, "repos": 1 if has_tests else 0},
        "Cloud": {"score": 40 if any("deploy" in str(r).lower() for r in repos) else 15, "repos": 0}
    }

    repo_count = len(repos)
    signals = {
        "repositories_analyzed": repo_count,
        "project_quality_score": min(95, 50 + (repo_count * 4) + (total_stars * 2)),
        "consistency_score": 75 if repo_count >= 3 else 45,
        "engineering_score": (35 + (25 if has_docker else 0) + (25 if has_tests else 0)),
        "documentation_score": 70
    }

    return {
        "github_username": username,
        "evidence": evidence,
        "signals": signals
    }
