from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Mock Analysis"])

@router.get("/candidates/{candidate_id}/analysis")
def get_mock_analysis(candidate_id: str):
    return {
        "candidate": {
            "id": candidate_id,
            "name": "Alex",
            "target_role": "Backend Developer"
        },
        "readiness": {
            "score": 72,
            "confidence": 81,
            "breakdown": {
                "technical": 24,
                "projects": 15,
                "consistency": 10,
                "engineering": 8,
                "documentation": 6,
                "role_alignment": 9
            }
        },
        "role_fit": [
            {"role": "Backend Developer", "score": 82},
            {"role": "Full Stack Developer", "score": 74},
            {"role": "Data Engineer", "score": 67}
        ],
        "skill_gaps": [
            {"skill": "Docker", "current": 15, "required": 60, "gap": -45, "priority": "high"},
            {"skill": "Testing", "current": 42, "required": 70, "gap": -28, "priority": "high"},
            {"skill": "Cloud", "current": 30, "required": 50, "gap": -20, "priority": "medium"}
        ],
        "roadmap": [
            {"week": 1, "goal": "Testing (pytest)", "tasks": ["Learn pytest", "Add 10 unit tests"]},
            {"week": 2, "goal": "Dockerization", "tasks": ["Dockerize backend API", "Add docker-compose"]}
        ]
    }