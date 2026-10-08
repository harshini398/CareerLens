"""
tests/test_p3_scoring.py
Automated Golden Persona and Property Tests for Person 3.
"""
import sys
import os

# Ensure project root is in python path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import pytest
from backend.app.scoring.readiness_engine import calculate_readiness
from backend.app.scoring.what_if_engine import simulate_what_if

DEMAND_BENCHMARK = {"Python": 80, "SQL": 70, "Docker": 60, "Testing": 60}

# ==============================================================================
# 1. GOLDEN PERSONA TESTS
# ==============================================================================

def test_persona_a_strong_fullstack():
    """Persona A: 6+ repos, Docker, tests, steady commits -> Score must be 80+"""
    persona_a = {
        "claimed_skills": [{"name": "Python", "claimed_level": "Expert"}],
        "evidence": {
            "Python": {"score": 90},
            "SQL": {"score": 85},
            "Docker": {"score": 80},
            "Testing": {"score": 85}
        },
        "github_signals": {
            "project_quality_score": 85,
            "consistency_score": 90,
            "engineering_score": 85,
            "documentation_score": 80,
            "repositories_analyzed": 7,
            "recent_activity": True
        },
        "profile_sources": {"resume": True, "github": True}
    }
    result = calculate_readiness(persona_a, DEMAND_BENCHMARK)
    assert result["readiness_score"] >= 80, f"Expected strong candidate score >= 80, got {result['readiness_score']}"

def test_persona_b_resume_inflated():
    """Persona B: Claims expert in everything, but 0 evidence -> Score must drop < 45"""
    persona_b = {
        "claimed_skills": [
            {"name": "Python", "claimed_level": "Expert"},
            {"name": "Docker", "claimed_level": "Expert"},
            {"name": "Kubernetes", "claimed_level": "Advanced"}
        ],
        "evidence": {
            "Python": {"score": 25},
            "SQL": {"score": 10},
            "Docker": {"score": 5},
            "Testing": {"score": 10}
        },
        "github_signals": {
            "project_quality_score": 30,
            "consistency_score": 25,
            "engineering_score": 20,
            "documentation_score": 30,
            "repositories_analyzed": 1,
            "recent_activity": False
        },
        "profile_sources": {"resume": True, "github": True}
    }
    result = calculate_readiness(persona_b, DEMAND_BENCHMARK)
    assert result["readiness_score"] <= 45, f"Expected inflated resume score <= 45, got {result['readiness_score']}"
    penalties = [w for w in result["waterfall"] if "Unsupported Claim" in w["factor"]]
    assert len(penalties) >= 1, "Failed to penalize unsupported claims in waterfall"

# ==============================================================================
# 2. MATHEMATICAL PROPERTY TESTS (P3's Signature Strength)
# ==============================================================================

def test_property_determinism():
    """Determinism: Running the same candidate 5 times gives the exact identical score."""
    candidate = {
        "claimed_skills": [{"name": "Python", "claimed_level": "Intermediate"}],
        "evidence": {"Python": {"score": 75}, "SQL": {"score": 60}},
        "github_signals": {"project_quality_score": 60, "consistency_score": 60, "engineering_score": 50, "documentation_score": 60},
        "profile_sources": {"resume": True, "github": True}
    }
    first_run = calculate_readiness(candidate, DEMAND_BENCHMARK)["readiness_score"]
    for _ in range(4):
        subsequent_run = calculate_readiness(candidate, DEMAND_BENCHMARK)["readiness_score"]
        assert first_run == subsequent_run, "Scoring is not deterministic!"

def test_property_monotonicity():
    """Monotonicity: Adding tests or a Dockerfile NEVER lowers the readiness score."""
    base_candidate = {
        "claimed_skills": [{"name": "Python", "claimed_level": "Intermediate"}],
        "evidence": {"Python": {"score": 70}, "Docker": {"score": 10}, "Testing": {"score": 20}},
        "github_signals": {"project_quality_score": 60, "engineering_score": 30, "consistency_score": 50, "documentation_score": 50},
        "profile_sources": {"resume": True, "github": True}
    }
    base_score = calculate_readiness(base_candidate, DEMAND_BENCHMARK)["readiness_score"]

    improved_candidate = dict(base_candidate)
    improved_candidate["evidence"] = {"Python": {"score": 70}, "Docker": {"score": 75}, "Testing": {"score": 20}}
    improved_candidate["github_signals"] = {"project_quality_score": 60, "engineering_score": 50, "consistency_score": 50, "documentation_score": 50}
    score_with_docker = calculate_readiness(improved_candidate, DEMAND_BENCHMARK)["readiness_score"]

    assert score_with_docker >= base_score, "Monotonicity violated: adding Docker lowered score!"

    improved_candidate["evidence"]["Testing"] = {"score": 80}
    score_with_docker_and_tests = calculate_readiness(improved_candidate, DEMAND_BENCHMARK)["readiness_score"]

    assert score_with_docker_and_tests >= score_with_docker, "Monotonicity violated: adding tests lowered score!"

def test_property_fairness_invariance():
    """Fairness Invariance: Demographics, name, or institutional prestige CANNOT change the score."""
    candidate_profile_1 = {
        "candidate": {"name": "Alex Smith", "gender": "Male", "college": "Top Tier University"},
        "claimed_skills": [{"name": "Python", "claimed_level": "Intermediate"}],
        "evidence": {"Python": {"score": 75}, "SQL": {"score": 65}},
        "github_signals": {"project_quality_score": 65, "consistency_score": 60, "engineering_score": 50, "documentation_score": 60},
        "profile_sources": {"resume": True, "github": True}
    }

    candidate_profile_2 = {
        "candidate": {"name": "Priya Sharma", "gender": "Female", "college": "Rural Tier-3 College"},
        "claimed_skills": [{"name": "Python", "claimed_level": "Intermediate"}],
        "evidence": {"Python": {"score": 75}, "SQL": {"score": 65}},
        "github_signals": {"project_quality_score": 65, "consistency_score": 60, "engineering_score": 50, "documentation_score": 60},
        "profile_sources": {"resume": True, "github": True}
    }

    score_1 = calculate_readiness(candidate_profile_1, DEMAND_BENCHMARK)["readiness_score"]
    score_2 = calculate_readiness(candidate_profile_2, DEMAND_BENCHMARK)["readiness_score"]

    assert score_1 == score_2, f"Fairness violation! Scores differed based on demographic attributes: {score_1} vs {score_2}"

def test_property_configurable_weights():
    """Configurable Weights: Setting a component to 100% isolates that factor completely."""
    candidate = {
        "claimed_skills": [],
        "evidence": {"Python": {"score": 90}},
        "github_signals": {"project_quality_score": 80, "consistency_score": 40, "engineering_score": 30, "documentation_score": 30},
        "profile_sources": {"resume": True, "github": True}
    }

    weights_consistency_only = {"tech": 0.0, "project": 0.0, "consistency": 1.0, "engineering": 0.0, "docs": 0.0, "role": 0.0}
    score_c = calculate_readiness(candidate, DEMAND_BENCHMARK, custom_weights=weights_consistency_only)["readiness_score"]

    weights_project_only = {"tech": 0.0, "project": 1.0, "consistency": 0.0, "engineering": 0.0, "docs": 0.0, "role": 0.0}
    score_p = calculate_readiness(candidate, DEMAND_BENCHMARK, custom_weights=weights_project_only)["readiness_score"]

    assert score_p > score_c, "Weight configuration failed to isolate project quality over consistency"

def test_property_what_if_consistency():
    """What-If Consistency: Projected score delta accurately reflects the impact of simulated actions."""
    candidate = {
        "claimed_skills": [],
        "evidence": {"Python": {"score": 70}, "Docker": {"score": 10}, "Testing": {"score": 20}},
        "github_signals": {"project_quality_score": 60, "consistency_score": 50, "engineering_score": 30, "documentation_score": 50},
        "profile_sources": {"resume": True, "github": True}
    }
    what_if = simulate_what_if(candidate, DEMAND_BENCHMARK, ["learn_docker", "add_tests"])
    assert what_if["delta"] > 0, "What-If did not project positive gain for adding Docker and Tests"
    assert what_if["projected_score"] == what_if["current_score"] + what_if["delta"], "What-If math delta mismatch!"
