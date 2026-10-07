from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.models import CandidateModel
from app.schemas.schemas import CandidateCreate, CandidateResponse

router = APIRouter(prefix="/api/candidates", tags=["Candidates"])

@router.post("/", response_model=CandidateResponse)
def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    # Check if candidate already exists
    existing = db.query(CandidateModel).filter(CandidateModel.id == candidate.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Candidate ID already exists")
    
    db_candidate = CandidateModel(
        id=candidate.id,
        name=candidate.name,
        email=candidate.email,
        target_role=candidate.target_role
    )
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate(candidate_id: str, db: Session = Depends(get_db)):
    db_candidate = db.query(CandidateModel).filter(CandidateModel.id == candidate_id).first()
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db_candidate