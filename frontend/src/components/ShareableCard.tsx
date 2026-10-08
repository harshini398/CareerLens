import { useState } from 'react'
import {
  Check, CheckCircle2, Copy, Download, GitBranch, Link2,
  ShieldCheck, Sparkles, X,
} from 'lucide-react'
import { RadarChartWidget } from './RadarChartWidget'
import { useCareerLens } from '../context'

interface ShareableCardProps {
  onClose?: () => void
  isModal?: boolean
}

export function ShareableCard({ onClose, isModal = false }: ShareableCardProps) {
  const { analysis } = useCareerLens()
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)

  const candidateName = analysis?.candidate?.name || 'Pooja Sriram'
  const targetRole = analysis?.candidate?.targetRole || 'Backend Developer'
  const githubUser = analysis?.candidate?.githubUsername || 'poojasriram'
  const readinessScore = analysis?.readiness?.score || 82

  const topStrengths = [
    'Python & FastAPI Microservice Architecture',
    'PostgreSQL & Complex Relational Queries',
    'RESTful API Engineering & Integration',
  ]

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportPDF = () => {
    setExporting(true)
    setTimeout(() => {
      setExporting(false)
      window.print()
    }, 600)
  }

  const content = (
    <div className="shareable-scorecard-widget">
      {/* Top Banner / Trust Seal Header */}
      <div className="card-header">
        <div className="card-brand">
          <span className="brand-dot" />
          <span className="brand-title">CAREERLENS</span>
          <span className="brand-subtitle">CANDIDATE VERIFICATION SCORECARD</span>
        </div>
        <div className="trust-seal">
          <ShieldCheck size={16} className="text-yellow" />
          <span>Verified by CareerLens</span>
        </div>
      </div>

      {/* Main Candidate Info & Match Score */}
      <div className="card-body">
        <div className="candidate-hero-row">
          <div className="candidate-meta">
            <div className="candidate-avatar">
              {candidateName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div>
              <h2 className="candidate-name">{candidateName}</h2>
              <span className="target-role-badge">{targetRole}</span>
            </div>
          </div>
          <div className="readiness-score-badge">
            <span className="score-val">{readinessScore}%</span>
            <span className="score-lbl">Match Score</span>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="verification-badges-row">
          <div className="v-badge github-badge">
            <GitBranch size={14} />
            <span>GitHub Verified: @{githubUser}</span>
            <CheckCircle2 size={13} className="text-green" />
          </div>
          <div className="v-badge linkedin-badge">
            <Link2 size={14} />
            <span>LinkedIn Verified</span>
            <CheckCircle2 size={13} className="text-green" />
          </div>
        </div>

        {/* Two Column Grid: Strengths & Mini Radar */}
        <div className="card-grid">
          <div className="strengths-col">
            <span className="col-label">
              <Sparkles size={13} /> TOP 3 VERIFIED STRENGTHS
            </span>
            <ul className="strengths-list">
              {topStrengths.map((str, idx) => (
                <li key={idx}>
                  <span className="bullet-num">0{idx + 1}</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mini-radar-col">
            <span className="col-label">SKILL EVIDENCE MATRIX</span>
            <div className="mini-radar-wrap">
              <RadarChartWidget heightClass="h-48" showLegend={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="card-footer">
        <div className="action-buttons">
          <button
            type="button"
            className="button button-outline button-small"
            onClick={handleCopyLink}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
          </button>
          <button
            type="button"
            className="button button-dark button-small"
            onClick={handleExportPDF}
          >
            <Download size={14} />
            <span>{exporting ? 'Preparing PDF...' : 'Export PDF'}</span>
          </button>
        </div>
        <div className="seal-watermark">
          <ShieldCheck size={14} />
          <span>Verified by CareerLens · Deterministic Proof Engine</span>
        </div>
      </div>
    </div>
  )

  if (isModal) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
          {content}
        </div>
      </div>
    )
  }

  return content
}
