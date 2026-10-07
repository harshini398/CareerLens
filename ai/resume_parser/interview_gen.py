import os
import json
import requests
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

from ai.resume_parser.schemas import CandidateProfile

load_dotenv()

MODEL_NAME = "gemini-3.5-flash-lite"

def generate_interview_questions(
    profile: CandidateProfile, 
    unsupported_claims: Optional[List[Dict[str, Any]]] = None
) -> List[Dict[str, Any]]:
    """Generates technical interview questions, specifically drilling into unsupported claims."""
    api_key = os.getenv("GEMINI_API_KEY")
    
    # 1. Format claims
    claims_text = "\n".join([f"- [{c.type}] {c.text} (Skill: {c.skill})" for c in profile.claims[:5]])
    
    # 2. Format unsupported claims from Person 2 (The killer feature!)
    unsupported_context = ""
    if unsupported_claims:
        unsupported_items = [f"- Claim on {u.get('skill', 'Technology')}: No GitHub repositories/evidence found." for u in unsupported_claims if u.get("status") == "UNSUPPORTED"]
        if unsupported_items:
            unsupported_context = "\nEVIDENCE BLIND SPOTS (No code found on GitHub):\n" + "\n".join(unsupported_items)

    prompt = f"""You are a senior technical interviewer hiring for a {profile.candidate.target_role or 'Software Engineer'}.
Generate 4-5 rigorous interview questions.

CANDIDATE CLAIMS:
{claims_text}
{unsupported_context}

CRITICAL INSTRUCTION:
If there are 'EVIDENCE BLIND SPOTS', ask at least 2 questions specifically testing if they actually know the technology despite having no GitHub evidence (e.g. 'You listed Docker, but have no Dockerfiles on GitHub. Explain how you would configure a multi-stage Docker build').

Respond strictly with a JSON list:
[
  {{
    "claim_targeted": "skill or claim text",
    "question": "technical question text",
    "is_evidence_gap_question": true | false,
    "what_to_look_for": "what a strong answer demonstrates"
  }}
]
"""

    if api_key:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json", "temperature": 0.2}
        }
        try:
            response = requests.post(url, json=payload, timeout=25)
            if response.status_code == 200:
                result = response.json()
                raw_json = result["candidates"][0]["content"]["parts"][0]["text"].strip()
                return json.loads(raw_json)
        except Exception as e:
            print(f"[WARNING] Interview question generation failed: {e}")

    # Fallback if offline
    fallback_questions = [
        {
            "claim_targeted": "Docker",
            "question": "You listed Docker on your resume, but we found no Dockerfiles across your repositories. How would you write a multi-stage Dockerfile for a FastAPI backend?",
            "is_evidence_gap_question": True,
            "what_to_look_for": "Knowledge of base images, layer caching, and minimizing image size."
        },
        {
            "claim_targeted": "FastAPI",
            "question": "Explain how you structured your FastAPI app to serve 10,000 active users. How did you handle async DB connections?",
            "is_evidence_gap_question": False,
            "what_to_look_for": "Async SQLAlchemy, connection pooling, and Gunicorn/Uvicorn workers."
        }
    ]
    return fallback_questions