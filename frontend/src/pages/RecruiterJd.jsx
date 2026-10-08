import { useState } from 'react'
import { ArrowRight, Bot, BriefcaseBusiness, CheckCircle2, FileText, Layers3, Sparkles } from 'lucide-react'
import Badge from '../components/Badge'
import SkillBadge from '../components/SkillBadge'

const extracted = [
  { role: 'Senior Backend Engineer', level: '5+ years', source: 'Job description' },
  { role: 'Python Engineer', level: '3+ years', source: 'Technical requirements' },
  { role: 'Cloud Engineer', level: '2+ years', source: 'Preferred experience' },
]

const skills = [
  { skill: 'Python', priority: 'High', score: 94 },
  { skill: 'REST APIs', priority: 'High', score: 90 },
  { skill: 'PostgreSQL', priority: 'Medium', score: 76 },
  { skill: 'Docker', priority: 'Medium', score: 63 },
  { skill: 'AWS', priority: 'Low', score: 48 },
]

export default function RecruiterJd() {
  const [jd, setJd] = useState('')
  const [extractedRequirements, setExtractedRequirements] = useState(extracted)

  const extract = () => setExtractedRequirements(extracted.map((item, index) => ({ ...item, level: index === 0 ? '5+ years' : item.level })))

  return (
    <div className="career-page career-jd-page">
      <header className="career-page-header">
        <div><span className="career-eyebrow">Recruiter intelligence</span><h1>JD-to-candidate matching</h1><p>Extract requirements, prioritize skills, and compare the candidate pool.</p></div>
        <Badge tone="green"><Sparkles size={12} /> AI-assisted extraction</Badge>
      </header>

      <section className="career-jd-grid">
        <article className="career-panel career-jd-input-panel">
          <div className="career-panel-heading"><div><span className="career-panel-kicker">Job description</span><h2>Paste or upload a role</h2></div><span className="career-file-hint"><FileText size={13} /> PDF / DOCX supported</span></div>
          <textarea value={jd} onChange={(event) => setJd(event.target.value)} placeholder="Paste the complete job description here..." />
          <div className="career-jd-input-footer"><span>{jd.length} characters</span><button type="button" className="career-button career-button-primary" onClick={extract}><Bot size={15} /> Extract Requirements</button></div>
        </article>

        <article className="career-panel career-jd-results-panel">
          <div className="career-panel-heading"><div><span className="career-panel-kicker">Extracted intelligence</span><h2>Role requirements</h2></div><Badge tone="verified"><CheckCircle2 size={12} /> 6 signals detected</Badge></div>
          <div className="career-role-list">
            {extractedRequirements.map((item) => <div className="career-role-row" key={item.role}><span><BriefcaseBusiness size={15} /></span><div><strong>{item.role}</strong><small>{item.source}</small></div><b>{item.level}</b></div>)}
          </div>
          <div className="career-skill-priorities"><div className="career-priority-heading"><strong>Prioritized skills</strong><span>Evidence confidence</span></div>{skills.map((item) => <SkillBadge key={item.skill} {...item} />)}</div>
        </article>
      </section>

      <section className="career-jd-bottom">
        <div><span><Layers3 size={17} /></span><div><strong>Candidate pool is ready</strong><p>18 candidates matched against the extracted role requirements.</p></div></div>
        <button type="button" className="career-button career-button-primary">Match Candidate Pool <ArrowRight size={16} /></button>
      </section>
    </div>
  )
}
