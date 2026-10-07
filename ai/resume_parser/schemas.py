from typing import List, Optional
from pydantic import BaseModel, Field

class CandidateInfo(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    target_role: str = ""
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class SkillItem(BaseModel):
    name: str
    claimed_level: str = "Intermediate"  # Beginner, Intermediate, Advanced, Expert
    years: Optional[float] = None
    source: str = "resume"

class ProjectItem(BaseModel):
    name: str
    description: str
    technologies: List[str] = []
    github_url: Optional[str] = None
    deployment_url: Optional[str] = None

class ExperienceItem(BaseModel):
    company: str
    role: str
    duration: str = ""
    technologies: List[str] = []
    description: Optional[str] = None

class ClaimItem(BaseModel):
    id: str  # e.g., CL001, CL002
    text: str
    type: str  # TECHNICAL, SCALE, PERFORMANCE, PROJECT, LEADERSHIP
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