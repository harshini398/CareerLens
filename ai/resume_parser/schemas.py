from typing import List, Optional
from pydantic import BaseModel, Field

class CandidateInfo(BaseModel):
    name: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    target_role: Optional[str] = ""
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class SkillItem(BaseModel):
    name: str
    claimed_level: Optional[str] = "Intermediate"  # Allows null from LLM
    years: Optional[float] = None
    source: str = "resume"

class ProjectItem(BaseModel):
    name: str
    description: Optional[str] = ""
    technologies: List[str] = []
    github_url: Optional[str] = None
    deployment_url: Optional[str] = None

class ExperienceItem(BaseModel):
    company: str
    role: str
    duration: Optional[str] = ""
    technologies: List[str] = []
    description: Optional[str] = None

class ClaimItem(BaseModel):
    id: str
    text: str
    type: str
    skill: str
    claimed_level: Optional[str] = None
    metric: Optional[str] = None
    verifiable: bool = True
    source: str = "resume"

class CandidateProfile(BaseModel):
    candidate: CandidateInfo
    skills: List[SkillItem] = []
    projects: List[ProjectItem] = []
    experience: List[ExperienceItem] = []
    claims: List[ClaimItem] = []