import { useState } from 'react'
import { Check, Copy, Download, GitBranch, Link2, ShieldCheck } from 'lucide-react'
import Badge from './Badge'
import RadarChart from './RadarChart'

const strengths = ['Python backend engineering', 'API design & authentication', 'Automated testing']

export default function CandidateCard({ candidate = { name: 'Aarav Mehta', role: 'Senior Backend Engineer', score: 82 } }) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/candidate/${candidate.name.toLowerCase().replace(/\s+/g, '-')}`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section className="career-candidate-card" id="candidate-card">
      <div className="career-card-topline">
        <div className="career-card-brand"><span>CL</span><strong>CareerLens</strong></div>
        <Badge tone="verified"><ShieldCheck size={12} /> Verified by CareerLens</Badge>
      </div>

      <div className="career-card-profile">
        <div className="career-card-avatar">{candidate.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
        <div>
          <h2>{candidate.name}</h2>
          <p>{candidate.role}</p>
          <div className="career-card-verifications">
            <span><GitBranch size={13} /> GitHub verified</span>
            <span><Link2 size={13} /> LinkedIn verified</span>
          </div>
        </div>
        <div className="career-card-score"><strong>{candidate.score}%</strong><span>Match</span></div>
      </div>

      <div className="career-card-grid">
        <div className="career-card-strengths">
          <span className="career-card-label">Top verified strengths</span>
          <ul>
            {strengths.map((strength) => <li key={strength}><Check size={13} />{strength}</li>)}
          </ul>
        </div>
        <div className="career-card-chart">
          <span className="career-card-label">Evidence profile</span>
          <RadarChart data={[
            { name: 'Docker', value: 76 },
            { name: 'Testing', value: 82 },
            { name: 'Python', value: 90 },
            { name: 'SQL', value: 68 },
            { name: 'REST APIs', value: 84 },
            { name: 'Cloud', value: 70 },
          ]} />
        </div>
      </div>

      <footer className="career-card-actions">
        <button type="button" onClick={copyLink}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Link copied' : 'Copy Share Link'}</button>
        <button type="button" onClick={() => window.print()}><Download size={15} />Export PDF</button>
      </footer>
    </section>
  )
}
