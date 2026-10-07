import sys
import os

# Add root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from ai.resume_parser.extractor import extract_resume_text
from ai.resume_parser.parser import parse_resume_text

def run_test():
    # Test with sample text if no file passed
    sample_text = """
    Alex Johnson
    alex@example.com | +1-555-0199 | github.com/alex-dev
    Target Role: Backend Developer

    SKILLS:
    Python (Expert, 3 yrs), SQL (Advanced), FastAPI (Advanced), Docker (Advanced), AWS

    EXPERIENCE:
    Backend Intern at Tech Labs (6 months)
    - Developed high-performance REST APIs in Python and FastAPI.
    - Optimized database queries in PostgreSQL, reducing query latency by 35%.
    - Containerized backend services using Docker and docker-compose.

    PROJECTS:
    E-Commerce Microservice API
    - Built a REST API with FastAPI serving 10,000 active users.
    - Integrated JWT authentication and automated pytest unit tests.
    """

    print("Parsing resume text with LLM...")
    profile = parse_resume_text(sample_text)

    print("\n--- PARSED CANDIDATE ---")
    print(f"Name: {profile.candidate.name}")
    print(f"Target Role: {profile.candidate.target_role}")
    print(f"Skills Extracted: {[s.name for s in profile.skills]}")

    print("\n--- EXTRACTED CLAIMS (HERO FEATURE) ---")
    for claim in profile.claims:
        print(f"[{claim.type}] {claim.text}")
        print(f"  → Skill: {claim.skill} | Metric: {claim.metric} | Verifiable: {claim.verifiable}")

if __name__ == "__main__":
    run_test()