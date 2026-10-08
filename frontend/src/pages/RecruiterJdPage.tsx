import { useState } from 'react'
import {
  FileSearch, Layers, Sparkles, Target, Users, Zap,
} from 'lucide-react'
import { PageTitle } from '../components/Layout'

const sampleJdText = `Senior Backend Engineer (Python & Cloud Infrastructure)

We are seeking an experienced Senior Backend Engineer to join our core API platform team.

Key Responsibilities:
- Design, build, and maintain high-throughput RESTful APIs using Python (FastAPI / Django).
- Containerize services with Docker and manage deployment pipelines on AWS (ECS / EKS).
- Write robust, automated test suites (pytest) with 80%+ code coverage.
- Optimize PostgreSQL database schemas, indexing strategies, and complex SQL query performance.
- Collaborate with frontend engineers to integrate GraphQL and WebSocket endpoints.

Requirements & Tech Stack:
- 3+ years of professional backend development experience with Python.
- High Priority: Python, Docker, PostgreSQL, REST APIs.
- Medium Priority: Redis caching, CI/CD pipelines, Pytest.
- Low Priority: GraphQL, Kubernetes, Terraform.`

interface SkillPriorityBadge {
  name: string
  category: 'High' | 'Medium' | 'Low'
}

export function RecruiterJdPage() {
  const [rawJd, setRawJd] = useState(sampleJdText)
  const [isExtracted, setIsExtracted] = useState(true)
  const [extracting, setExtracting] = useState(false)
  const [matched, setMatched] = useState(false)

  const handleExtract = () => {
    setExtracting(true)
    setTimeout(() => {
      setExtracting(false)
      setIsExtracted(true)
    }, 600)
  }

  const handleLoadSample = () => {
    setRawJd(sampleJdText)
    setIsExtracted(true)
  }

  const extractedSkills: SkillPriorityBadge[] = [
    { name: 'Python (FastAPI / Django)', category: 'High' },
    { name: 'Docker & Containerization', category: 'High' },
    { name: 'PostgreSQL & Database Design', category: 'High' },
    { name: 'REST APIs & OpenAPI Specs', category: 'High' },
    { name: 'Redis Caching & In-Memory Stores', category: 'Medium' },
    { name: 'CI/CD Automated Pipelines', category: 'Medium' },
    { name: 'Testing (pytest & Integration)', category: 'Medium' },
    { name: 'GraphQL & WebSockets', category: 'Low' },
    { name: 'Terraform Infrastructure', category: 'Low' },
  ]

  const matchedCandidates = [
    { name: 'Pooja Sriram', role: 'Backend Developer', score: 82, matchTag: 'Top Match' },
    { name: 'Alex Rivera', role: 'Full Stack Engineer', score: 76, matchTag: 'Strong Fit' },
    { name: 'David Chen', role: 'Data Engineer', score: 68, matchTag: 'Adjacent' },
  ]

  return (
    <div className="page-stack recruiter-jd-page">
      <PageTitle
        label="RECRUITER ENGINE & JOB DESCRIPTION EXTRACTION"
        title="JD requirement extractor."
        detail="Paste any raw Job Description to automatically extract technical requirements, required experience levels, and prioritized skill vectors."
      />

      {/* Split View Container */}
      <section className="jd-split-container">
        {/* Left Column: Raw Textarea Input */}
        <div className="panel jd-input-column">
          <div className="panel-heading-row">
            <div>
              <span className="panel-kicker">01 / RAW JOB DESCRIPTION</span>
              <h3>Paste job requirements</h3>
            </div>
            <button
              type="button"
              className="button button-outline button-small"
              onClick={handleLoadSample}
            >
              <Sparkles size={13} />
              <span>Load Sample JD</span>
            </button>
          </div>

          <div className="textarea-wrapper">
            <textarea
              value={rawJd}
              onChange={(e) => setRawJd(e.target.value)}
              placeholder="Paste raw job description, requirements, or hiring post text here..."
              rows={16}
              className="jd-textarea"
            />
          </div>

          <div className="input-action-bar">
            <button
              type="button"
              className="button button-dark button-large w-full"
              onClick={handleExtract}
            >
              <FileSearch size={18} />
              <span>{extracting ? 'Parsing Requirements...' : 'Extract Requirements'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Extracted Requirements */}
        <div className="panel jd-output-column">
          <div className="panel-heading-row">
            <div>
              <span className="panel-kicker">02 / EXTRACTED REQUIREMENT MAP</span>
              <h3>Structured skill vector</h3>
            </div>
            <span className="status-badge status-verified">
              <span className="status-dot" /> Ready
            </span>
          </div>

          {isExtracted ? (
            <div className="extracted-results-wrapper">
              {/* Role & Experience Info Header */}
              <div className="extracted-meta-card">
                <div className="meta-item">
                  <span className="meta-lbl">Extracted Role Target</span>
                  <strong className="meta-val">Senior Backend Engineer</strong>
                </div>
                <div className="meta-item">
                  <span className="meta-lbl">Target Experience Level</span>
                  <strong className="meta-val">3 – 5 Years (Mid-Senior)</strong>
                </div>
              </div>

              {/* Skill Priority Badges */}
              <div className="skill-priority-section">
                <span className="section-label">PRIORITIZED SKILL BADGES</span>

                <div className="priority-group">
                  <div className="group-head group-high">
                    <Zap size={14} />
                    <span>HIGH PRIORITY (CRITICAL)</span>
                  </div>
                  <div className="badges-flex">
                    {extractedSkills
                      .filter((s) => s.category === 'High')
                      .map((s) => (
                        <span key={s.name} className="badge badge-high">
                          {s.name}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="priority-group">
                  <div className="group-head group-medium">
                    <Target size={14} />
                    <span>MEDIUM PRIORITY (IMPORTANT)</span>
                  </div>
                  <div className="badges-flex">
                    {extractedSkills
                      .filter((s) => s.category === 'Medium')
                      .map((s) => (
                        <span key={s.name} className="badge badge-medium">
                          {s.name}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="priority-group">
                  <div className="group-head group-low">
                    <Layers size={14} />
                    <span>LOW PRIORITY (NICE TO HAVE)</span>
                  </div>
                  <div className="badges-flex">
                    {extractedSkills
                      .filter((s) => s.category === 'Low')
                      .map((s) => (
                        <span key={s.name} className="badge badge-low">
                          {s.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              {/* Bottom CTA to Match Candidate Pool */}
              <div className="match-pool-cta-wrap">
                <button
                  type="button"
                  className="button button-dark button-large w-full"
                  onClick={() => setMatched(true)}
                >
                  <Users size={18} />
                  <span>Match Candidate Pool</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <FileSearch size={28} />
              <strong>No requirements extracted yet.</strong>
              <span>Paste a job description on the left and click "Extract Requirements".</span>
            </div>
          )}
        </div>
      </section>

      {/* Matched Candidates Pool Results Modal / Drawer */}
      {matched && (
        <section className="panel matched-pool-panel">
          <div className="panel-heading-row">
            <div>
              <span className="panel-kicker">CANDIDATE POOL MATCH RESULTS</span>
              <h3>Top matching evidence profiles</h3>
            </div>
            <button
              type="button"
              className="text-button"
              onClick={() => setMatched(false)}
            >
              Close Results
            </button>
          </div>

          <div className="candidates-matched-list">
            {matchedCandidates.map((c) => (
              <div className="candidate-match-card" key={c.name}>
                <div className="c-info">
                  <div className="c-avatar">{c.name.slice(0, 2)}</div>
                  <div>
                    <strong>{c.name}</strong>
                    <span>{c.role}</span>
                  </div>
                </div>
                <div className="c-score-wrap">
                  <span className="c-tag">{c.matchTag}</span>
                  <strong className="c-score">{c.score}% Match</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
