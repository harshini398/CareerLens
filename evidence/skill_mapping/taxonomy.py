# Mapping of skill names to keywords, dependencies, and files
SKILL_PATTERNS = {
    "Python": {
        "languages": ["Python"],
        "files": ["requirements.txt", "pyproject.toml", "setup.py", "Pipfile"],
        "extensions": [".py"],
        "keywords": ["python"]
    },
    "FastAPI": {
        "manifest_packages": ["fastapi", "uvicorn"],
        "keywords": ["fastapi"]
    },
    "Flask": {
        "manifest_packages": ["flask"],
        "keywords": ["flask"]
    },
    "Django": {
        "manifest_packages": ["django"],
        "keywords": ["django"]
    },
    "React": {
        "languages": ["JavaScript", "TypeScript"],
        "manifest_packages": ["react", "react-dom"],
        "files": ["package.json"],
        "keywords": ["react"]
    },
    "Docker": {
        "files": ["dockerfile", "docker-compose.yml", "docker-compose.yaml", ".dockerignore"],
        "keywords": ["docker", "container"]
    },
    "SQL": {
        "manifest_packages": ["psycopg2", "sqlalchemy", "mysql-connector", "pg", "sqlite3"],
        "keywords": ["sql", "postgresql", "mysql", "database", "sqlite"]
    },
    "REST APIs": {
        "manifest_packages": ["requests", "axios", "fastapi", "express"],
        "keywords": ["api", "rest", "endpoint", "crud"]
    },
    "Testing": {
        "manifest_packages": ["pytest", "unittest", "jest", "mocha", "chai"],
        "files": ["pytest.ini"],
        "keywords": ["test", "tests"]
    },
    "Git": {
        "files": [".gitignore"],
        "keywords": ["git"]
    }
}

def detect_skills_in_repo(repo: dict) -> set:
    """Detects all skills present in a given repository based on files, languages, and manifests."""
    detected = set()
    repo_name = repo["name"].lower()
    root_files = [f.lower() for f in repo.get("root_files", [])]
    languages = repo.get("languages", {})
    manifests = " ".join(repo.get("manifests", {}).values()).lower()

    for skill, patterns in SKILL_PATTERNS.items():
        # Check language match
        for lang in patterns.get("languages", []):
            if lang in languages:
                detected.add(skill)

        # Check file match
        for file_pat in patterns.get("files", []):
            if any(file_pat in f for f in root_files):
                detected.add(skill)

        # Check manifest package match
        for pkg in patterns.get("manifest_packages", []):
            if pkg in manifests:
                detected.add(skill)

        # Check keywords in repo name/description
        for kw in patterns.get("keywords", []):
            if kw in repo_name or kw in repo.get("description", "").lower():
                detected.add(skill)

    return detected
