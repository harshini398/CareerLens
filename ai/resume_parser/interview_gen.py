import os
import json
import requests
from typing import List, Dict, Any
from dotenv import load_dotenv

from ai.resume_parser.schemas import CandidateProfile

load_dotenv()

MODEL_NAME = "gemini-3.5-flash-lite"

def generate_interview_questions(profile: CandidateProfile) -> List[Dict[str, Any]]:
    """Generates deep technical interview questions based on candidate's claims and projects."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return []

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={api_key}"

    # Format claims for the prompt
    claims_text = "\n".join([f"- [{c.type}] {c.text} (Skill: {c.skill})" for c in profile.claims[:6]])

    prompt = f"""You are an elite technical interviewer hiring for a {profile.candidate.target_role or 'Software Engineer'} role.
Generate 4-5 rigorous, deep-dive interview questions directly targeting these specific claims from the candidate's profile:

CLAIMS:
{claims_text}

INSTRUCTIONS:
1. Don't ask generic questions like "Tell me about Python".
2. Ask specific technical probing questions about architecture, trade-offs, edge cases, and metrics claimed.
3. If they claimed a metric (e.g., 35% latency reduction, 10,000 users), question how they measured and achieved it.

Respond strictly with a JSON list matching this format:
[
  {{
    "claim_targeted": "exact claim text",
    "question": "technical question text",
    "difficulty": "Medium" | "Hard",
    "what_to_look_for": "what a strong answer should demonstrate"
  }}
]
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json", "temperature": 0.2}
    }

    try:
        response = requests.post(url, json=payload, timeout=15)
        if response.status_code == 200:
            result = response.json()
            raw_json = result["candidates"][0]["content"]["parts"][0]["text"].strip()
            return json.loads(raw_json)
    except Exception as e:
        print(f"[WARNING] Interview question generation failed: {e}")
    
    return []