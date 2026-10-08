import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from ai.resume_parser.parser import _load_mock_fallback
from ai.resume_parser.interview_gen import generate_interview_questions

# Simulate Person 2's evidence output
mock_p2_unsupported = [
    {"skill": "Docker", "status": "UNSUPPORTED", "evidence_score": 0}
]

profile = _load_mock_fallback()
questions = generate_interview_questions(profile, unsupported_claims=mock_p2_unsupported)

print("\n--- GENERATED INTERVIEW QUESTIONS (P1 + P2 INTEGRATION) ---")
for q in questions:
    flag = "🚨 [EVIDENCE GAP]" if q.get("is_evidence_gap_question") else "✓ [VERIFIED CLAIM]"
    print(f"{flag} Target: {q['claim_targeted']}")
    print(f"  Q: {q['question']}\n")