from pydantic import BaseModel
from typing import Optional

class CandidateCreate(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    target_role: Optional[str] = None

class CandidateResponse(CandidateCreate):
    class Config:
        from_attributes = True