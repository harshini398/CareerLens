from fastapi import FastAPI
from app.api.mock_analysis import router as mock_router
from app.api.candidates import router as candidates_router
from app.api.integration import router as integration_router
from app.models.database import engine, Base
from app.models.models import CandidateModel, ReadinessScoreModel, AnalysisRunModel

# Create database tables including the new analysis run table
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CareerLens API", version="1.0.0")

app.include_router(mock_router)
app.include_router(candidates_router)
app.include_router(integration_router)

@app.get("/")
def read_root():
    return {"status": "CareerLens Backend with Status Tracking is operational", "owner": "Person 4"}