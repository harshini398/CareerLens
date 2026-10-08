import os
import json
import requests
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = "gemini-3.5-flash-lite"

def analyze_portfolio_quality(portfolio_links: List[str], portfolio_summary: str = "") -> Dict[str, Any]:
    """Generates structured feedback for design portfolios (Behance, Figma) and code portfolios."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return _fallback_portfolio()

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={api_key}"

    links_text = "\n".join([f"- {l}" for l in portfolio_links])

    prompt = f"""You are a design and technical portfolio reviewer.
Evaluate this student's portfolio assets and links:

LINKS PROVIDED:
{links_text}

PORTFOLIO CONTEXT/DESCRIPTIONS:
{portfolio_summary or 'General development and design projects'}

Generate structured portfolio feedback. Respond strictly with JSON:
{{
  "portfolio_score": 82,
  "strengths": [
    "Clear project showcase",
    "Good diversity of technologies"
  ],
  "areas_for_improvement": [
    "Add live demo links for deployed applications",
    "Include case studies detailing design decisions and architecture diagrams"
  ],
  "actionable_recommendations": [
    "For Figma/Behance: Include user personas and wireframe iterations, not just final mockups",
    "For GitHub: Pin your top 3 original repositories with rich READMEs containing GIF demos"
  ]
}}
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json", "temperature": 0.2}
    }

    try:
        response = requests.post(url, json=payload, timeout=20)
        if response.status_code == 200:
            result = response.json()
            raw_json = result["candidates"][0]["content"]["parts"][0]["text"].strip()
            return json.loads(raw_json)
    except Exception as e:
        print(f"[WARNING] Portfolio feedback failed: {e}")

    return _fallback_portfolio()

def _fallback_portfolio() -> Dict[str, Any]:
    return {
        "portfolio_score": 80,
        "strengths": ["Clean project categorization", "Clear technology badges"],
        "areas_for_improvement": ["Missing architecture diagrams in project overviews", "Add interactive live deployment URLs"],
        "actionable_recommendations": [
            "Add GIFs/screenshots directly in README files",
            "Include user problem statements and measurable impact metrics"
        ]
    }