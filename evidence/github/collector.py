import json
import os
from datetime import datetime, timezone
from evidence.github.client import GitHubClient

def collect_github_profile(username: str, save_cache: bool = True) -> dict:
    """
    Orchestrates full raw GitHub data collection for a user profile.
    Returns a unified data dictionary.
    """
    client = GitHubClient()
    username = client.clean_username(username)
    
    print(f"[*] Fetching profile for @{username}...")
    profile = client.get_user_profile(username)
    
    print(f"[*] Fetching repositories...")
    raw_repos = client.get_repositories(username, max_repos=10)
    
    analyzed_repos = []
    manifest_targets = ["requirements.txt", "package.json", "Dockerfile", "docker-compose.yml", "pyproject.toml"]

    for repo in raw_repos:
        repo_name = repo["name"]
        print(f"    -> Analyzing {repo_name}...")

        languages = client.get_repo_languages(username, repo_name)
        root_files = client.get_repo_root_files(username, repo_name)
        commits = client.get_repo_commits(username, repo_name, max_commits=15)
        
        # Download key dependency manifests if present
        manifests = {}
        for target in manifest_targets:
            if target in root_files:
                content = client.get_file_content(username, repo_name, target)
                if content:
                    manifests[target] = content[:2000] # Cap size for efficiency

        analyzed_repos.append({
            "name": repo_name,
            "description": repo.get("description") or "",
            "html_url": repo.get("html_url"),
            "created_at": repo.get("created_at"),
            "updated_at": repo.get("updated_at"),
            "stars": repo.get("stargazers_count", 0),
            "forks": repo.get("forks_count", 0),
            "size_kb": repo.get("size", 0),
            "languages": languages,
            "root_files": root_files,
            "commits": commits,
            "commit_count_sample": len(commits),
            "manifests": manifests
        })

    snapshot = {
        "username": username,
        "collected_at": datetime.now(timezone.utc).isoformat(),
        "profile": {
            "name": profile.get("name"),
            "bio": profile.get("bio"),
            "public_repos": profile.get("public_repos", 0),
            "followers": profile.get("followers", 0),
            "created_at": profile.get("created_at")
        },
        "repositories": analyzed_repos
    }

    if save_cache:
        os.makedirs("evidence/mock_data", exist_ok=True)
        cache_path = f"evidence/mock_data/cached_{username}.json"
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(snapshot, f, indent=2)
        print(f"[✓] Saved local cache to {cache_path}")

    return snapshot

if __name__ == "__main__":
    import sys
    user = sys.argv[1] if len(sys.argv) > 1 else "sreya12-code"
    data = collect_github_profile(user)
    print(f"\nCompleted! Analyzed {len(data['repositories'])} repositories for @{user}.")