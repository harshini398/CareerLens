import os
from typing import Dict, Any
from ai.resume_parser.extractor import extract_resume_text
from ai.resume_parser.parser import parse_resume_text
from ai.resume_parser.ats_checker import analyze_ats_readability
from ai.resume_parser.interview_gen import generate_interview_questions

def analyze_resume_pipeline(file_path: str) -> Dict[str, Any]:
    """
    Complete Person 1 Pipeline:
    1. Extracts text from PDF / DOCX / TXT
    2. Parses candidate profile & extracts verifiable claims via LLM
    3. Calculates ATS score and formatting warnings
    4. Generates targeted technical interview questions
    """
    raw_text = extract_resume_text(file_path)
    profile = parse_resume_text(raw_text)
    ats_result = analyze_ats_readability(raw_text, profile)
    interview_questions = generate_interview_questions(profile)

    return {
        "profile": profile.model_dump(),
        "ats": ats_result,
        "interview_questions": interview_questions,
    }

# Alias in case someone calls the old name
def process_resume_file(file_path: str):
    return analyze_resume_pipeline(file_path)