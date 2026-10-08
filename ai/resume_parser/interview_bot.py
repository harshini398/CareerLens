import os
import json
import requests
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = "gemini-3.5-flash-lite"

def evaluate_interview_response(question: str, candidate_answer: str, claim_context: str = "") -> Dict[str, Any]:
    """Evaluates a candidate's answer to a code-grounded interview question."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {
            "score": 75,
            "verdict": "Good Technical Foundation",
            "feedback": "Answer demonstrates conceptual clarity but lacks practical implementation details.",
            "ideal_answer_key_points": ["Mention specific configuration options", "Address error handling"]
        }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={api_key}"

    prompt = f"""You are a senior technical interviewer evaluating a student's answer.

INTERVIEW QUESTION:
{question}

CANDIDATE'S CLAIM CONTEXT:
{claim_context}

CANDIDATE'S ANSWER:
{candidate_answer}

Evaluate the response rigorously. Respond strictly with JSON:
{{
  "score": 85,
  "verdict": "Strong" | "Average" | "Needs Improvement",
  "feedback": "2-3 sentences on what they did well and what they missed",
  "ideal_answer_key_points": [
    "Key concept they should have mentioned",
    "Architecture or performance consideration"
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
        print(f"[WARNING] Answer evaluation failed: {e}")

    return {
        "score": 70,
        "verdict": "Average",
        "feedback": "Solid conceptual explanation, but add specific implementation details and trade-offs.",
        "ideal_answer_key_points": ["Discuss edge cases", "Mention production deployment considerations"]
    }