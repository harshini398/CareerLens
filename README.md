# 🔍 CareerLens

> **"Your resume tells us what you claim. Your work tells us what you can prove."**

AI-Powered Employability & Career Readiness Analyzer for **DataQuest 3.0**.

---

## 🎯 Project Overview
Conventional ATS tools match keywords. **CareerLens** verifies proof-of-work:
$$\text{Resume} \longrightarrow \text{Claims} \longrightarrow \text{GitHub Proof} \longrightarrow \text{Verification Matrix} \longrightarrow \text{Readiness Score} \longrightarrow \text{Roadmap}$$

---

## 👥 5-Person Team Ownership

| Role | Owner | Focus Area | Deliverable |
| :--- | :--- | :--- | :--- |
| **P1** | AI / Resume | Resume Parsing & Claim Extraction | Structured `CandidateProfile` & extracted claims |
| **P2** | GitHub / Evidence | GitHub Ingestion & Verification Engine | Proof-of-work signals & Claim-Evidence Matrix |
| **P3** | Scoring & Roadmap | Readiness Scoring & Gap Analysis | Explainable score, Role fit %, 30-day Roadmap |
| **P4** | Backend & DB | FastAPI, Orchestration, Database | End-to-end APIs & Integration |
| **P5** | Frontend & UX | React / Vite Dashboard & Demo Flow | Interactive UI, What-If Simulator & Placement view |

---

## 📋 Master JSON Contract (Shared Schema)

All modules communicate using this standardized schema:

```json
{
  "candidate": {
    "id": "C001",
    "name": "Alex",
    "target_role": "Backend Developer"
  },
  "claims": [
    {
      "id": "CL001",
      "text": "Expert in Python",
      "skill": "Python",
      "claimed_level": "Expert",
      "source": "resume"
    }
  ],
  "evidence": [
    {
      "id": "EV001",
      "claim_id": "CL001",
      "skill": "Python",
      "source": "github",
      "repository": "backend-api",
      "strength": 91,
      "description": "Python used extensively across backend modules",
      "url": "https://github.com/alex/backend-api"
    }
  ],
  "verification": [
    {
      "claim_id": "CL001",
      "status": "VERIFIED",
      "evidence_strength": 91,
      "reason": "7 repositories, active commits in last 30 days, unit tests detected"
    }
  ],
  "readiness": {
    "score": 72,
    "confidence": 81,
    "breakdown": {
      "technical": 24,
      "projects": 15,
      "consistency": 10,
      "engineering": 8,
      "documentation": 6,
      "role_alignment": 9
    }
  },
  "role_fit": [
    {
      "role": "Backend Developer",
      "score": 82
    }
  ],
  "skill_gaps": [
    {
      "skill": "Docker",
      "current": 15,
      "required": 60,
      "gap": -45,
      "priority": "high"
    }
  ],
  "roadmap": [
    {
      "week": 1,
      "goal": "Testing & Quality Assurance",
      "tasks": ["Add pytest test suites", "Configure CI/CD"]
    }
  ]
}