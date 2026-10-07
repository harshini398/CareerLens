"""
What-If Simulator Engine.
"""
import copy
from typing import Dict, Any, List
from .readiness_engine import calculate_readiness

SIMULATION_ACTIONS = {
    "learn_docker": {
        "label": "Dockerize a project",
        "skill_updates": {"Docker": 75},
        "signal_updates": {"engineering_score": 15}
    },
    "add_tests": {
        "label": "Write automated unit tests (pytest)",
        "skill_updates": {"Testing": 75},
        "signal_updates": {"engineering_score": 10, "project_quality_score": 5}
    },
    "deploy_project": {
        "label": "Deploy project to cloud",
        "skill_updates": {"Cloud": 65},
        "signal_updates": {"project_quality_score": 10}
    }
}

def simulate_what_if(candidate_data: Dict[str, Any], dynamic_demand: Dict[str, int], selected_actions: List[str]) -> Dict[str, Any]:
    # Ensure keys exist safely
    candidate_data = copy.deepcopy(candidate_data or {})
    candidate_data.setdefault("evidence", {})
    candidate_data.setdefault("github_signals", {})

    base_result = calculate_readiness(candidate_data, dynamic_demand)
    current_score = base_result["readiness_score"]

    simulated_data = copy.deepcopy(candidate_data)
    impact_breakdown = []

    for action_key in selected_actions:
        action = SIMULATION_ACTIONS.get(action_key)
        if not action:
            continue

        for skill, new_score in action["skill_updates"].items():
            if skill not in simulated_data["evidence"]:
                simulated_data["evidence"][skill] = {"score": new_score, "repos": 1}
            else:
                simulated_data["evidence"][skill]["score"] = max(
                    simulated_data["evidence"][skill].get("score", 0), new_score
                )

        for sig_key, delta in action["signal_updates"].items():
            current_sig = simulated_data["github_signals"].get(sig_key, 50)
            simulated_data["github_signals"][sig_key] = min(100, current_sig + delta)

    projected_result = calculate_readiness(simulated_data, dynamic_demand)
    projected_score = projected_result["readiness_score"]
    total_delta = max(0, projected_score - current_score)

    for action_key in selected_actions:
        action = SIMULATION_ACTIONS.get(action_key)
        if action:
            impact_breakdown.append({
                "action": action["label"],
                "impact": max(2, round(total_delta / max(1, len(selected_actions))))
            })

    return {
        "current_score": current_score,
        "projected_score": projected_score,
        "delta": total_delta,
        "impact_breakdown": impact_breakdown
    }
