"""
Dynamic Roadmap & Multi-Gap Project Recommender.
"""
from typing import Dict, Any, List

def generate_roadmap(target_role: str, gaps: List[Dict[str, Any]]) -> Dict[str, Any]:
    critical_deficits = [g["skill"] for g in gaps if g["is_gap"]]

    milestones = [
        {
            "week": 1,
            "title": "Automated Testing & Reliability",
            "goal": "Write automated test coverage",
            "tasks": [
                "Install pytest or appropriate test runner",
                "Write 10+ unit tests covering edge cases and auth",
                "Verify test pass rate and coverage reports"
            ],
            "deliverable": "Repository with passing automated test suite"
        },
        {
            "week": 2,
            "title": "Containerization with Docker",
            "goal": "Package application in reproducible containers",
            "tasks": [
                "Write a multi-stage Dockerfile",
                "Create docker-compose.yml linking app and database",
                "Verify container builds and runs locally"
            ],
            "deliverable": "Working Dockerfile and docker-compose.yml committed to GitHub"
        },
        {
            "week": 3,
            "title": "CI/CD & Cloud Deployment",
            "goal": "Automate tests on commit and deploy live",
            "tasks": [
                "Configure GitHub Actions for CI test runs",
                "Deploy the Docker container to a live cloud host",
                "Add live deployment link to README"
            ],
            "deliverable": "Live deployment URL + passing CI badge"
        },
        {
            "week": 4,
            "title": "Architecture & Documentation Polish",
            "goal": "Demonstrate professional proof-of-work",
            "tasks": [
                "Add system architecture diagrams to README",
                "Document REST API endpoints or Swagger specs",
                "Record a 2-minute demo video"
            ],
            "deliverable": "Production-grade portfolio project ready for review"
        }
    ]

    recommended_project = {
        "title": f"Production-Ready {target_role} Architecture Project",
        "description": "A single focused project tailored to simultaneously close your critical deficits.",
        "features": [
            "Modular architecture and database integration",
            "Full unit test suite (>80% coverage)",
            "Docker and docker-compose orchestration",
            "GitHub Actions CI pipeline"
        ],
        "closes_gaps": critical_deficits[:4]
    }

    return {
        "target_role": target_role,
        "critical_deficits": critical_deficits,
        "milestones": milestones,
        "recommended_project": recommended_project
    }
