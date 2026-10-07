import os
import base64
import requests
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

class GitHubClient:
    BASE_URL = "https://api.github.com"

    def __init__(self, token: str = None):
        self.token = token or os.getenv("GITHUB_TOKEN")
        self.headers = {"Accept": "application/vnd.github.v3+json"}
        if self.token:
            self.headers["Authorization"] = f"token {self.token}"

    def clean_username(self, profile_input: str) -> str:
        clean = profile_input.strip().rstrip("/")
        if "github.com/" in clean:
            clean = clean.split("github.com/")[-1]
        return clean.replace("@", "")

    def get_user_profile(self, username: str) -> dict:
        username = self.clean_username(username)
        url = f"{self.BASE_URL}/users/{username}"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            raise ValueError(f"GitHub user '{username}' not found.")
        elif response.status_code == 403:
            raise PermissionError("Rate limit exceeded. Ensure GITHUB_TOKEN is set in .env.")
        response.raise_for_status()

    def get_repositories(self, username: str, max_repos: int = 15) -> list:
        username = self.clean_username(username)
        url = f"{self.BASE_URL}/users/{username}/repos?sort=updated&per_page={max_repos}"
        response = requests.get(url, headers=self.headers)
        if response.status_code != 200:
            return []
        repos = response.json()
        return [r for r in repos if not r.get("fork")]

    def get_repo_languages(self, owner: str, repo_name: str) -> dict:
        url = f"{self.BASE_URL}/repos/{owner}/{repo_name}/languages"
        response = requests.get(url, headers=self.headers)
        return response.json() if response.status_code == 200 else {}

    def get_repo_root_files(self, owner: str, repo_name: str) -> list:
        url = f"{self.BASE_URL}/repos/{owner}/{repo_name}/contents"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200 and isinstance(response.json(), list):
            return [item.get("name") for item in response.json()]
        return []

    def get_repo_commits(self, owner: str, repo_name: str, max_commits: int = 20) -> list:
        """Fetches recent commits to evaluate development recency and history."""
        url = f"{self.BASE_URL}/repos/{owner}/{repo_name}/commits?per_page={max_commits}"
        response = requests.get(url, headers=self.headers)
        if response.status_code != 200:
            return []
        
        commits = []
        for c in response.json():
            commit_data = c.get("commit", {})
            author_data = commit_data.get("author", {})
            commits.append({
                "sha": c.get("sha", "")[:7],
                "message": commit_data.get("message", "").split("\n")[0],
                "date": author_data.get("date")
            })
        return commits

    def get_file_content(self, owner: str, repo_name: str, file_path: str) -> str:
        """Fetches and decodes text content of a file (e.g., requirements.txt, Dockerfile)."""
        url = f"{self.BASE_URL}/repos/{owner}/{repo_name}/contents/{file_path}"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            data = response.json()
            if data.get("encoding") == "base64" and data.get("content"):
                try:
                    return base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
                except Exception:
                    return ""
        return ""

if __name__ == "__main__":
    import sys
    client = GitHubClient()
    test_user = sys.argv[1] if len(sys.argv) > 1 else "torvalds"
    
    print(f"--- Fetching profile for: {test_user} ---")
    profile = client.get_user_profile(test_user)
    print(f"Public Repos: {profile.get('public_repos')}")
    
    repos = client.get_repositories(test_user, max_repos=3)
    print(f"Found {len(repos)} non-fork repositories:")
    for r in repos:
        name = r['name']
        files = client.get_repo_root_files(test_user, name)
        langs = client.get_repo_languages(test_user, name)
        print(f" - {name} | Languages: {list(langs.keys())} | Files: {files[:5]}")