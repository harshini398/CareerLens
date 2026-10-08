from sqlalchemy import Column, String, Float, JSON, DateTime
from datetime import datetime
from app.models.database import Base

class CandidateModel(Base):
    __tablename__ = "candidates"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    target_role = Column(String)

class ReadinessScoreModel(Base):
    __tablename__ = "readiness_scores"

    id = Column(String, primary_key=True, index=True)
    candidate_id = Column(String, index=True)
    score = Column(Float)
    breakdown = Column(JSON)

class AnalysisRunModel(Base):
    __tablename__ = "analysis_runs"

    id = Column(String, primary_key=True, index=True)
    candidate_id = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    result_summary = Column(JSON)