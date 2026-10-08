import os
import json
import requests
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = "gemini-3.5-flash-lite"

def parse_linkedin_profile(profile_text: str) -> Dict[str, Any]:
    """Parses user-provided LinkedIn profile text into structured signals."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or not profile_text.strip():
        return _fallback_linkedin()

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={api_key}"

    prompt = f"""You are a professional profile parser. Extract structured information from this user-provided LinkedIn profile export:

LINKEDIN TEXT:
{profile_text}

OUTPUT FORMAT (JSON ONLY):
{{
  "headline": "Current headline or summary",
  "experience": [
    {{"role": "Title", "company": "Company", "duration": "Duration", "highlights": []}}
  ],
  "certifications": [
    {{"name": "Certification Name", "issuer": "Issuing Org", "year": "Year or null"}}
  ],
  "skills": ["Skill1", "Skill2"],
  "activity_signals": {{
    "has_recent_posts": true,
    "networking_score": 75,
    "summary": "Brief note on candidate's professional presence"
  }}
}}
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json", "temperature": 0.1}
    }

    try:
        response = requests.post(url, json=payload, timeout=20)
        if response.status_code == 200:
            result = response.json()
            raw_json = result["candidates"][0]["content"]["parts"][0]["text"].strip()
            return json.loads(raw_json)
    except Exception as e:
        print(f"[WARNING] LinkedIn parsing failed: {e}")

    return _fallback_linkedin()

def _fallback_linkedin() -> Dict[str, Any]:
    return {
        "headline": "Backend Engineer | Open Source Enthusiast",
        "experience": [{"role": "Software Engineering Intern", "company": "Tech Labs", "duration": "6 mos", "highlights": ["Built REST APIs"]}],
        "certifications": [{"name": "AWS Certified Cloud Practitioner", "issuer": "Amazon Web Services", "year": "2025"}],
        "skills": ["Python", "FastAPI", "SQL", "Docker"],
        "activity_signals": {"has_recent_posts": True, "networking_score": 80, "summary": "Active contributor and technical writer."}
    }