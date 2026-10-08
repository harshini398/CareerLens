import { useState } from 'react'
import { AlertTriangle, Check, RotateCcw, Save, ShieldCheck } from 'lucide-react'
import Badge from '../components/Badge'
import WeightSlider from '../components/WeightSlider'

const defaults = {
  TechnicalSkills: 30,
  ProjectDepth: 20,
  CommitConsistency: 15,
  EngineeringRigor: 15,
  RoleAlignment: 20,
}

export default function AdminWeights() {
  const [weights, setWeights] = useState(defaults)
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0)
  const status = total === 100 ? 'balanced' : total > 100 ? 'over' : 'under'

  const update = (key, value) => setWeights((current) => ({ ...current, [key]: value }))
  const save = () => window.alert('Configuration saved successfully.')

  return (
    <div className="career-page career-admin-page">
      <header className="career-page-header">
        <div><span className="career-eyebrow">Evaluation control center</span><h1>Weight configuration</h1><p> tune how candidate evidence contributes to readiness and role-fit decisions.</p></div>
        <Badge tone={status === 'balanced' ? 'verified' : 'warning'}>{status === 'balanced' ? <Check size={12} /> : <AlertTriangle size={12} />}{total}% total weight</Badge>
      </header>

      <section className="career-admin-grid">
        <article className="career-panel career-weight-panel">
          <div className="career-panel-heading"><div><span className="career-panel-kicker">Scoring model</span><h2>Evaluation weights</h2></div><span className="career-weight-total"><b>{total}%</b> total</span></div>
          <div className="career-weight-list">
            {Object.entries(defaults).map(([label, value]) => <WeightSlider key={label} label={label} value={value} onChange={(next) => update(label, next)} />)}
          </div>
          <div className="career-admin-actions"><button type="button" className="career-button career-button-secondary" onClick={() => setWeights(defaults)}><RotateCcw size={15} /> Reset Defaults</button><button type="button" className="career-button career-button-primary" onClick={save}><Save size={15} /> Save Configuration</button></div>
        </article>

        <aside className="career-panel career-weight-summary">
          <span className="career-panel-kicker">Live model status</span>
          <h2>{status === 'balanced' ? 'Weights are balanced' : status === 'under' ? 'Add weight to reach 100%' : 'Weights exceed 100%'}</h2>
          <p>Changes are evaluated against evidence quality, role requirements, and the candidate’s verified work.</p>
          <div className={`career-weight-status career-weight-${status}`}><div>{total}<small>%</small></div><span>{status === 'balanced' ? 'Within target range' : 'Configuration needs review'}</span></div>
          <div className="career-weight-safety"><ShieldCheck size={17} /><div><strong>Safe to modify</strong><p>Updates apply to the next analysis and can be reverted at any time.</p></div></div>
        </aside>
      </section>
    </div>
  )
}
