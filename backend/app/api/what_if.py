from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["What-If Simulator"])

class WhatIfRequest(BaseModel):
    current_score: int
    toggles: dict

@router.post("/what-if")
def simulate_what_if(payload: WhatIfRequest):
    delta = 0
    reasons = []
    toggles = payload.toggles
    
    if toggles.get("learn_docker"):
        delta += 5
        reasons.append({"action": "Add Dockerfile & docker-compose", "gain": "+5"})
    if toggles.get("add_tests"):
        delta += 4
        reasons.append({"action": "Add 10 unit tests", "gain": "+4"})
    if toggles.get("deploy_project"):
        delta += 3
        reasons.append({"action": "Deploy project to cloud", "gain": "+3"})

    return {
        "current_score": payload.current_score,
        "projected_score": min(99, payload.current_score + delta),
        "delta": delta,
        "breakdown": reasons
    }