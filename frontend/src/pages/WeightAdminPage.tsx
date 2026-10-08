import { useState } from 'react'
import {
  AlertTriangle, Check, CheckCircle2, RefreshCw, Save,
  Sliders, ShieldAlert,
} from 'lucide-react'
import { PageTitle } from '../components/Layout'

interface WeightCategory {
  id: string
  label: string
  description: string
  defaultVal: number
}

const weightCategories: WeightCategory[] = [
  {
    id: 'technical',
    label: 'Technical Skills',
    description: 'Weight assigned to parsed code evidence, languages, frameworks, and syntax mastery.',
    defaultVal: 30,
  },
  {
    id: 'projects',
    label: 'Project Depth',
    description: 'Weight allocated to multi-file architecture, documentation quality, and repository complexity.',
    defaultVal: 20,
  },
  {
    id: 'consistency',
    label: 'Commit Consistency',
    description: 'Weight assigned to git history frequency, active coding streaks, and maintenance history.',
    defaultVal: 15,
  },
  {
    id: 'engineering',
    label: 'Engineering Rigor',
    description: 'Weight for automated test suites, CI/CD pipelines, containerization, and static analysis.',
    defaultVal: 15,
  },
  {
    id: 'alignment',
    label: 'Role Alignment',
    description: 'Weight evaluating direct overlap between candidate skills and target job description requirements.',
    defaultVal: 20,
  },
]

export function WeightAdminPage() {
  const [weights, setWeights] = useState<Record<string, number>>(() =>
    Object.fromEntries(weightCategories.map((c) => [c.id, c.defaultVal]))
  )
  const [saved, setSaved] = useState(false)

  const totalWeight = Object.values(weights).reduce((acc, curr) => acc + curr, 0)
  const isValid = totalWeight === 100

  const handleSliderChange = (id: string, val: number) => {
    setWeights((prev) => ({ ...prev, [id]: val }))
    setSaved(false)
  }

  const handleReset = () => {
    setWeights(Object.fromEntries(weightCategories.map((c) => [c.id, c.defaultVal])))
    setSaved(false)
  }

  const handleSave = () => {
    if (!isValid) return
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="page-stack weight-admin-page">
      <PageTitle
        label="ADMINISTRATION & DETERMINISTIC MODEL TUNING"
        title="Scoring weight configuration."
        detail="Adjust the relative importance of evidence categories in the CareerLens scoring engine. Weights must sum exactly to 100%."
      />

      {/* Real-time Indicator Banner */}
      <section className={`panel total-weight-indicator-panel ${isValid ? 'indicator-valid' : 'indicator-invalid'}`}>
        <div className="indicator-content">
          <div className="indicator-icon">
            {isValid ? (
              <CheckCircle2 size={24} className="text-green" />
            ) : (
              <AlertTriangle size={24} className="text-coral" />
            )}
          </div>
          <div>
            <div className="indicator-title-row">
              <h3>
                Total Weight: <span className="weight-num">{totalWeight}%</span>
              </h3>
              <span className={`status-pill ${isValid ? 'pill-green' : 'pill-coral'}`}>
                {isValid ? 'PERFECT ALLOCATION (100%)' : totalWeight > 100 ? 'OVER ALLOCATED' : 'UNDER ALLOCATED'}
              </span>
            </div>
            <p>
              {isValid
                ? 'Your weight allocation meets the 100% model validation constraint.'
                : `Current total is ${totalWeight}%. Adjust sliders by ${
                    100 - totalWeight > 0 ? `+${100 - totalWeight}` : 100 - totalWeight
                  }% to balance the model.`}
            </p>
          </div>
        </div>

        <div className="indicator-actions">
          <button
            type="button"
            className="button button-light button-small"
            onClick={handleReset}
          >
            <RefreshCw size={14} />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            className={`button button-small ${isValid ? 'button-dark' : 'button-disabled'}`}
            onClick={handleSave}
            disabled={!isValid}
          >
            {saved ? <Check size={14} /> : <Save size={14} />}
            <span>{saved ? 'Configuration Saved' : 'Save Configuration'}</span>
          </button>
        </div>
      </section>

      {/* Interactive Sliders Form */}
      <section className="panel sliders-form-panel">
        <div className="panel-heading-row">
          <div>
            <span className="panel-kicker">EVIDENCE CATEGORY WEIGHTS</span>
            <h3>Adjust weight distribution (0% – 100%)</h3>
          </div>
          <Sliders size={18} className="text-yellow" />
        </div>

        <div className="sliders-list">
          {weightCategories.map((cat) => {
            const currentVal = weights[cat.id] ?? cat.defaultVal
            return (
              <div className="slider-item" key={cat.id}>
                <div className="slider-header">
                  <div>
                    <strong>{cat.label}</strong>
                    <p>{cat.description}</p>
                  </div>
                  <div className="slider-value-badge">
                    <span>{currentVal}%</span>
                  </div>
                </div>

                <div className="slider-control-row">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={currentVal}
                    onChange={(e) => handleSliderChange(cat.id, Number(e.target.value))}
                    className="weight-range-slider"
                  />
                  <div className="slider-quick-buttons">
                    <button
                      type="button"
                      className="quick-step"
                      onClick={() => handleSliderChange(cat.id, Math.max(0, currentVal - 5))}
                    >
                      -5%
                    </button>
                    <button
                      type="button"
                      className="quick-step"
                      onClick={() => handleSliderChange(cat.id, Math.min(100, currentVal + 5))}
                    >
                      +5%
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Methodology Guardrail */}
      <div className="fairness-inline">
        <ShieldAlert size={16} />
        <span>
          <strong>Fairness & Transparency Guardrail.</strong> Altering weights recalculates candidate readiness scores deterministically without bias or hidden parameters.
        </span>
      </div>
    </div>
  )
}
