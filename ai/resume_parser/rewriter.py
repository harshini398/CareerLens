import os
import json
import requests
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = "gemini-3.5-flash-lite"

def rewrite_weak_bullets(bullets: List[str]) -> List[Dict[str, str]]:
    """Rewrites weak resume bullets into high-impact statements without fabricating metrics."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not bullets:
        return []

    if api_key:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={api_key}"
        bullets_text = "\n".join([f"- {b}" for b in bullets])

        prompt = f"""You are a professional technical resume writer.
Rewrite these weak resume bullet points to be punchy, active, and industry-standard.

CRITICAL RULE - NEVER INVENT METRICS:
Do NOT fabricate numbers or percentages. Focus on technical architecture, tools used, and clarity.

INPUT BULLETS:
{bullets_text}

Respond strictly with a JSON list:
[
  {{
    "original": "original bullet text",
    "improved": "rewritten high-impact bullet",
    "reason": "why this rewrite is stronger"
  }}
]
"""
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json", "temperature": 0.2}
        }

        try:
            # 25 second timeout
            response = requests.post(url, json=payload, timeout=25)
            if response.status_code == 200:
                result = response.json()
                raw_json = result["candidates"][0]["content"]["parts"][0]["text"].strip()
                return json.loads(raw_json)
        except Exception as e:
            print(f"[WARNING] Live LLM rewrite timed out or failed: {e}. Using smart fallback.")

    # Smart Rule-Based Fallback (guarantees the demo never shows blank text)
    fallback_results = []
    for b in bullets:
        cleaned = b.strip().rstrip(".")
        if "react" in cleaned.lower():
            improved = f"Architected dynamic user interfaces leveraging React, modular component hierarchy, and modern state management."
        elif "backend" in cleaned.lower() or "database" in cleaned.lower():
            improved = f"Engineered scalable backend service layers and streamlined database operations for robust data persistence."
        else:
            improved = f"Spearheaded implementation and optimization of {cleaned.lower()}, enhancing code modularity and maintainability."
        
        fallback_results.append({
            "original": b,
            "improved": improved,
            "reason": "Replaced passive phrasing with strong technical action verbs and engineering focus."
        })
    return fallback_results