import os
import json
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types

from ai.resume_parser.schemas import CandidateProfile
from ai.prompts.parser_prompt import RESUME_PARSER_SYSTEM_PROMPT

load_dotenv()

# Use flash-lite for lightning-fast sub-second responses
MODEL_NAME = "gemini-3.5-flash-lite"

def parse_resume_text(resume_text: str) -> CandidateProfile:
    """Sends resume text to LLM with real-time logging."""
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("[WARNING] No GEMINI_API_KEY found in .env. Returning demo mock candidate.")
        return _load_mock_fallback()

    client = genai.Client(api_key=api_key)
    
    for attempt in range(1, 4):
        try:
            print(f"[AI] Calling {MODEL_NAME} (Attempt {attempt})...", flush=True)
            
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=f"Extract structured profile and claims from this resume:\n\n{resume_text}",
                config=types.GenerateContentConfig(
                    system_instruction=RESUME_PARSER_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    temperature=0.1,
                ),
            )

            print("[AI] Response received from Gemini! Parsing JSON...", flush=True)
            response_text = response.text.strip()
            data = json.loads(response_text)
            
            profile = CandidateProfile(**data)
            print("[AI] Successfully validated into CandidateProfile!", flush=True)
            return profile

        except Exception as e:
            print(f"[WARNING] Attempt {attempt} failed: {e}", flush=True)
            if attempt < 3:
                time.sleep(2)

    print("[ERROR] Live API failed. Falling back to demo mock candidate.", flush=True)
    return _load_mock_fallback()

def _load_mock_fallback() -> CandidateProfile:
    mock_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "demo", "alex_profile.json")
    if os.path.exists(mock_path):
        with open(mock_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return CandidateProfile(**data)
    raise FileNotFoundError("Mock candidate data not found.")