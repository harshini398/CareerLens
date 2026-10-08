"""
PDF Resume Parser & Ingestion.
"""
import io
import re
from typing import Dict, Any
from pypdf import PdfReader

KNOWN_SKILLS = [
    "Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", 
    "FastAPI", "Flask", "Django", "SQL", "PostgreSQL", "MySQL", "MongoDB", 
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Git", "Testing", "pytest", 
    "CI/CD", "Machine Learning", "Data Pipelines", "REST APIs"
]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts raw text from uploaded PDF bytes."""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def extract_github_username(text: str) -> str:
    """Finds github.com/<username> or @username in resume text."""
    match = re.search(r"github\.com/([a-zA-Z0-9_-]+)", text, re.IGNORECASE)
    if match:
        return match.group(1)
    match_handle = re.search(r"github:\s*@?([a-zA-Z0-9_-]+)", text, re.IGNORECASE)
    if match_handle:
        return match_handle.group(1)
    return ""

def parse_resume_content(raw_text: str) -> Dict[str, Any]:
    """Parses resume text into structured skills, claims, and role preference."""
    github_user = extract_github_username(raw_text)

    # Detect skills mentioned in resume
    found_skills = []
    for skill in KNOWN_SKILLS:
        if re.search(rf"\b{re.escape(skill)}\b", raw_text, re.IGNORECASE):
            level = "Intermediate"
            if re.search(rf"(expert|advanced|proficient|lead)\s+in\s+{re.escape(skill)}", raw_text, re.IGNORECASE):
                level = "Expert"
            elif re.search(rf"(familiar|basic|beginner)\s+with\s+{re.escape(skill)}", raw_text, re.IGNORECASE):
                level = "Beginner"

            found_skills.append({
                "name": skill,
                "claimed_level": level,
                "source": "resume"
            })

    # Extract measurable action sentences as claims
    sentences = re.split(r"[.\n•]", raw_text)
    claims = []
    for s in sentences:
        s = s.strip()
        if len(s) > 20 and any(kw in s.lower() for kw in ["built", "developed", "reduced", "improved", "implemented", "deployed"]):
            claims.append({
                "claim": s,
                "has_metrics": bool(re.search(r"(\d+%|\d+\+?\s*(users|requests|ms))", s))
            })

    # Infer target role
    target_role = "Backend Developer"
    if "data" in raw_text.lower() and "machine learning" in raw_text.lower():
        target_role = "Data Engineer"
    elif "react" in raw_text.lower() or "frontend" in raw_text.lower():
        target_role = "Frontend Developer"

    return {
        "github_username": github_user,
        "target_role": target_role,
        "skills": found_skills,
        "claims": claims[:10]
    }
