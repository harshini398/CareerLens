from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.mock_analysis import router as mock_router
from app.api.candidates import router as candidates_router
from app.api.integration import router as integration_router
from app.api.what_if import router as what_if_router
from app.api.recruiter_config import router as recruiter_config_router

from app.models.database import engine, Base
from app.models.models import CandidateModel, ReadinessScoreModel, AnalysisRunModel

# Initialize FastAPI app
app = FastAPI(title="CareerLens API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include all routers
app.include_router(mock_router)
app.include_router(candidates_router)
app.include_router(integration_router)
app.include_router(what_if_router)
app.include_router(recruiter_config_router)

@app.get("/")
def read_root():
    return {"status": "CareerLens Backend with Status Tracking is operational", "owner": "Person 4"}