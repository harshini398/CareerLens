import json
import pytest
from evidence.github.client import GitHubClient
from evidence.github.parser import extract_profile_signals
from evidence.github.originality import calculate_originality_confidence
from evidence.verification.scoring import analyze_all_skills_evidence
from evidence.verification.matcher import verify_all_claims
from evidence.verification.contradictions import CrossSourceContradictionDetector

# Helper to load personas
def load_persona(name: str) -> dict:
    with open(f"tests/golden/{name}.json", "r") as f:
        return json.load(f)

# --- 1. EDGE CASES & INPUT CLEANING ---
def test_username_cleaning():
    client = GitHubClient()
    assert client.clean_username("https://github.com/torvalds") == "torvalds"
    assert client.clean_username("https://github.com/torvalds/") == "torvalds"
    assert client.clean_username("@torvalds") == "torvalds"
    assert client.clean_username(" torvalds ") == "torvalds"

# --- 2. ORIGINALITY SCORER TESTS ---
def test_persona_d_tutorial_copier_penalized():
    data = load_persona("persona_d_tutorial")
    repo = data["repositories"][0]
    result = calculate_originality_confidence(repo, {"has_tests": False, "has_readme": False, "has_ci": False})
    
    # Tutorial name + single commit dump should drastically drop originality
    assert result["originality_confidence"] < 60
    assert any("tutorial" in c.lower() for c in result["caution_signals"])

def test_persona_a_strong_originality():
    data = load_persona("persona_a_strong")
    repo = data["repositories"][0]
    result = calculate_originality_confidence(repo, {"has_tests": True, "has_readme": True, "has_ci": True})
    assert result["originality_confidence"] >= 80

# --- 3. CONTRADICTION DETECTOR TESTS ---
def test_persona_b_contradictions_flagged():
    data = load_persona("persona_b_inflated")
    claims = [
        {"id": "c1", "text": "Expert in Docker & Kubernetes", "skill": "Docker", "claimed_level": "Expert"},
        {"id": "c2", "text": "5 years experience in Python", "skill": "Python", "claimed_level": "Expert"}
    ]
    skills_evidence = analyze_all_skills_evidence(data)
    detector = CrossSourceContradictionDetector()
    contradictions = detector.detect_contradictions(claims, data, skills_evidence)
    
    # Must flag phantom Docker claim and account age mismatch
    flagged_skills = [item["skill"] for item in contradictions]
    assert "Docker" in flagged_skills
    assert len(contradictions) >= 1

# --- 4. DORMANT EXPERT RECENCY CHECK ---
def test_persona_e_dormant_recency_penalty():
    data = load_persona("persona_e_dormant")
    skills_evidence = analyze_all_skills_evidence(data)
    python_evidence = skills_evidence.get("Python", {})
    
    # Has code, but last commit was over 18 months ago -> recency penalty applies
    assert python_evidence["evidence_score"] < 80

# --- 5. CLAIM VERIFICATION ACCURACY ---
def test_strong_skills_verified_and_unsupported():
    data = load_persona("persona_a_strong")
    claims = [
        {"id": "c1", "text": "FastAPI backend", "skill": "FastAPI", "claimed_level": "Advanced"},
        {"id": "c2", "text": "React frontend", "skill": "React", "claimed_level": "Intermediate"},
        {"id": "c3", "text": "Kubernetes orchestration", "skill": "Kubernetes", "claimed_level": "Expert"}
    ]
    skills_evidence = analyze_all_skills_evidence(data)
    verified = verify_all_claims(claims, skills_evidence, data)
    
    status_map = {v["skill"]: v["status"] for v in verified}
    assert status_map["FastAPI"] == "VERIFIED"
    assert status_map["React"] == "PARTIAL" or status_map["React"] == "VERIFIED"
    assert status_map["Kubernetes"] == "UNSUPPORTED"