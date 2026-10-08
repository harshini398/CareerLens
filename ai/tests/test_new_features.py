import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from ai.resume_parser.interview_bot import evaluate_interview_response
from ai.resume_parser.portfolio_feedback import analyze_portfolio_quality

print("1. Testing Interview Bot Evaluation...")
eval_res = evaluate_interview_response(
    question="How do you write a multi-stage Docker build for Python?",
    candidate_answer="I use a builder stage with python:3.11-slim, install packages into /install, then copy only site-packages into a final scratch image to keep it small."
)
print(f"Score: {eval_res['score']}/100 | Verdict: {eval_res['verdict']}")
print(f"Feedback: {eval_res['feedback']}\n")

print("2. Testing Portfolio Feedback...")
port_res = analyze_portfolio_quality(["https://behance.net/alex", "https://github.com/alex-dev"])
print(f"Portfolio Score: {port_res['portfolio_score']}/100")
print(f"Recommendations: {port_res['actionable_recommendations'][0]}")