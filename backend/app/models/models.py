from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from app.models.database import Base

class CandidateModel(Base):
    __tablename__ = "candidates"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    target_role = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ReadinessScoreModel(Base):
    __tablename__ = "readiness_scores"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    candidate_id = Column(String, ForeignKey("candidates.id"), nullable=False)
    score = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AnalysisRunModel(Base):
    __tablename__ = "analysis_runs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    candidate_id = Column(String, ForeignKey("candidates.id"), nullable=False)
    status = Column(String, default="PENDING")  # PENDING, PARSING, ANALYZING_GITHUB, VERIFYING, SCORING, COMPLETED, FAILED
    current_step = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)