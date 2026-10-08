# 🔍 CareerLens

> **"Your resume tells us what you claim. Your work tells us what you can prove."**

An AI-powered, evidence-based employability and career readiness analyzer built for **DataQuest 3.0**.

---

## 📌 Links & Assets
- **📊 Presentation Pitch Deck:** [`docs/CareerLens_Presentation.pptx`](docs/CareerLens_Presentation.pptx) *(PDF Version: [`docs/CareerLens_Presentation.pdf`](docs/CareerLens_Presentation.pdf))*
- **🌿 Working Branches:** `main` | `feature/person4-integration` | `feature/person2-evidence`

---

## 🎯 Problem Statement & Core Differentiator

### The Problem
Conventional ATS and resume scanners rely exclusively on **keyword matching and formatting checks**. Candidates inflate resumes with buzzwords (*"Expert in Docker, React, and Machine Learning"*), while recruiters and placement cells suffer from blind applications and lack insight into actual proof of work.

### The CareerLens Solution
CareerLens connects what candidates claim to observable proof of work across **GitHub, LeetCode, Figma, LinkedIn, and personal portfolios**:

$$\text{Resume Claims} \longrightarrow \text{Proof of Work} \longrightarrow \text{Claim Verification} \longrightarrow \text{Explainable Score} \longrightarrow \text{Personalized Action}$$

```text
Resume Claims:
"Expert in Python, React, and Docker"
                 ↓
Searches Observable Evidence
                 ↓
GitHub / Portfolios:
Python  → 8 repositories, unit tests, recent commits
React   → 2 repositories, moderate activity
Docker  → 0 Dockerfiles or compose configurations detected
                 ↓
Claim-Evidence Matrix:
Python  ✅ VERIFIED (91/100)
React   🟡 PARTIAL  (66/100)
Docker  ❌ UNSUPPORTED (0/100)
                 ↓
Explainable Job Readiness Score: 72/100 ("Why 72?" Waterfall Breakdown)
                 ↓
Interactive What-If Simulator & Personalized 30-Day Action Roadmap
```

---

## 🚀 Key Features

### 1. Multi-Source Ingestion Engine
- **Resume Ingestion:** Extracts skills, projects, and verifiable claims from PDF and DOCX formats without losing context.
- **GitHub Crawler:** Collects commit frequency, language byte distributions, root file manifests, test suites, and CI/CD pipelines.
- **Design & Coding Portfolios:** Supports Figma, Behance, and LeetCode profile evaluation for UI/UX and software roles.

### 2. Proof-of-Work & Originality Engine (Person 2)
- **Originality Confidence:** Distinguishes genuine multi-month development from forked copies and single-commit tutorial clones (*never accuses; frames as confidence percentage*).
- **Multi-Factor Evidence Formula:** Deterministic scoring ($0–100$) based on technology usage ($25\%$), recency ($20\%$), code volume ($15\%$), complexity ($15\%$), documentation ($10\%$), and engineering practices ($10\%$).
- **Clickable Proof Traceability:** Every matrix claim provides direct repository URLs and detected file proof chips (`Dockerfile`, `package.json`, `pytest.ini`).

### 3. Explainable Job Readiness & Role Matching (Person 3)
- **Deterministic 0–100 Readiness Score:** Combines technical proof ($30\%$), project quality ($20\%$), consistency ($15\%$), engineering practices ($10\%$), documentation ($10\%$), and role alignment ($15\%$).
- **Score Waterfall ("Why is my score X?"):** Explains exact point additions and deductions.
- **Role Taxonomy Matching:** Evaluates fit against multiple target roles (**Backend Developer**, **Frontend Developer**, **Data Analyst**).

### 4. Interactive "What-If" Simulator
- Candidates can toggle potential improvements (*"What if I add Docker?"*, *"What if I write 10 unit tests?"*, *"What if I deploy to the cloud?"*).
- Real-time animated score counter demonstrates projected score jumps ($68 \rightarrow 79$).

### 5. Institutional Placement Cell Dashboard
- **Batch Readiness Overview:** Tracks cohort averages, readiness distribution, and at-risk students.
- **Skill Demand Heatmap:** Exposes systemic institutional gaps (e.g. *"60% of students lack observable Docker evidence"*).
- **1-Click Training Recommender:** Automatically generates targeted 2-week remedial workshops.
- **Configurable Scoring Weights:** Placement cells can adjust weightings based on institutional hiring policy.

### 6. AI Value-Add Modules (Person 1)
- **Targeted Mock Interview Generator:** Dynamically drafts interview questions testing the candidate's `UNSUPPORTED` claim areas.
- **Evidence-Backed Resume Rewriter:** Rewrites weak bullet points using only verified skills without fabricating metrics.
- **🛡️ Fairness by Design:** The scoring engine explicitly excludes demographic attributes, photo, gender, and college prestige.

---

## 🛠️ System Architecture & Tech Stack

```text
                     FRONTEND (React + Vite + TypeScript)
                                      │
                                      ▼
                        FASTAPI BACKEND ORCHESTRATOR
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
   PERSON 1                      PERSON 2                      PERSON 3
AI / Resume Engine            Evidence Engine               Scoring Engine
(PDF Parser, Claims,          (GitHub Crawler,              (Readiness, Roles,
Interview & Rewriter)         Signals & Matrix)             Roadmap & What-If)
        │                             │                             │
        └─────────────────────────────┼─────────────────────────────┘
                                      ▼
                           SQLITE / POSTGRESQL DB
```

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React |
| **Backend API** | FastAPI, Uvicorn, Pydantic, Python-Multipart |
| **Evidence & Crawling**| GitHub REST API, Requests, Python-Dotenv, Pytest |
| **AI & Ingestion** | PyMuPDF / pdfplumber, Groq / OpenAI LLM APIs |
| **Database** | SQLite / SQLAlchemy |

---

## 👥 5-Person Team Ownership Matrix

| Member | Role | Core Deliverables |
| :--- | :--- | :--- |
| **Person 1** | AI & Resume Intelligence | Resume PDF parsing, claim extraction, ATS checker, mock interview generator, evidence-backed rewriter. |
| **Person 2** | GitHub & Evidence Engine | GitHub API ingestion, commit signals, originality scorer, evidence formula, Claim-Evidence Matrix, clickable proof files. |
| **Person 3** | Scoring, Roles & Roadmap | 0-100 Job Readiness engine, score waterfall, role taxonomy (3+ roles), skill gap prioritizer, What-If simulator engine. |
| **Person 4** | Backend & Integration | FastAPI endpoints (`/api/analyze`, `/api/what-if`, `/api/placement`), database models, cross-branch orchestration. |
| **Person 5** | Frontend & UI/UX | Dashboard layout, Claim-Evidence table, interactive What-If toggles, radar charts, placement heatmap. |

---

## ⚡ Quickstart: Running Locally

### 1. Clone & Set Up Environment
```bash
git clone https://github.com/harshini398/CareerLens.git
cd CareerLens

# Set up Python virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment Variables
Create a `.env` file in the root folder:
```env
GITHUB_TOKEN=your_github_personal_access_token_here
OPENAI_API_KEY=your_llm_api_key_here
```

### 3. Run the Backend Server
```bash
uvicorn backend.app.main:app --reload --port 8000
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

### 4. Run the Frontend Client
```bash
cd frontend
npm install
npm run dev
```
Open your browser at: `http://localhost:5173`

### 5. Run the Automated Test Suite
```bash
python -m pytest tests/test_evidence.py -v
```

---

## 🧪 Test Personas & Verification Benchmarks
The platform is tested against deterministic golden candidate fixtures located in `tests/golden/`:
- **Persona A (Strong Full-Stack):** Multiple repositories, tests, Dockerfiles $\rightarrow$ **Score 80+, Verified**
- **Persona B (Resume-Inflated):** High claims, 1 small repository $\rightarrow$ **Contradictions flagged, Unsupported**
- **Persona D (Tutorial Copier):** Single commit dumps, `todo-app` $\rightarrow$ **Low Originality Confidence**
- **Persona E (Dormant Developer):** Inactive for >12 months $\rightarrow$ **Recency penalty applied**

---

## 📄 License
Built for the **DataQuest 3.0 Hackathon**.
