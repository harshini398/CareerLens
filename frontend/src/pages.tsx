import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, BarChart3,
  Check, CheckCircle2, ChevronDown, ChevronRight, CircleAlert,
  Clock3, Cloud, Code2, FileCheck2, FileText, GitBranch, GitBranch as Github, HardDriveUpload, Info,
  Layers3, LockKeyhole, Play, Plus, Rocket, Search, ShieldCheck, Sparkles,
  Target, TrendingUp, WandSparkles, X,
} from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { useCareerLens } from './context'
import { availableRoles, demoAnalysis, placementData } from './data/demo'
import { getWhatIf, normalizeGithub } from './services/api'
import type { SkillEvidence, WhatIfResult } from './types'
import { ExternalLink, PageTitle, ScoreBar, SmallMetric, StagePill, StatusBadge } from './components/Layout'
import { RadarChartWidget } from './components/RadarChartWidget'
import { ShareableCard } from './components/ShareableCard'

const acceptedResumeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']

export function LandingPage() {
  const navigate = useNavigate()
  return <div className="landing-page">
    <header className="landing-nav"><Link className="brand" to="/"><span className="brand-mark"><Activity size={19} /></span><span>career<span>lens</span><small>PROOF-FIRST READINESS</small></span></Link><div><Link to="/dashboard" className="quiet-link">Explore the demo <ArrowUpRight size={15} /></Link><button className="button button-dark" onClick={() => navigate('/analyze')}>Analyze my profile <ArrowRight size={16} /></button></div></header>
    <section className="landing-hero">
      <div className="landing-copy"><span className="eyebrow"><span className="eyebrow-dot" /> DATAQUEST 3.0 · CAREER READINESS</span><h1>Your resume says.<br /><em>Your work proves.</em></h1><p>CareerLens connects what you claim to what you build, then shows exactly what to do next.</p><div className="landing-actions"><button className="button button-dark button-large" onClick={() => navigate('/analyze')}>Analyze my profile <ArrowRight size={17} /></button><button className="text-button" onClick={() => navigate('/dashboard')}><Play size={15} /> Explore Pooja's demo</button></div><div className="landing-trust"><span><ShieldCheck size={15} /> Evidence-linked results</span><span><LockKeyhole size={14} /> Fairness by design</span></div></div>
      <div className="hero-visual" aria-label="CareerLens analysis pipeline preview">
        <div className="visual-topline"><span>PROFILE SIGNALS</span><span className="visual-status"><span className="online-dot" /> ANALYSIS READY</span></div>
        <div className="signal-stack"><div className="signal-card signal-resume"><span className="signal-icon icon-coral"><FileText size={18} /></span><div><small>CLAIM</small><strong>Advanced Docker</strong><span>Resume · Skills section</span></div><span className="signal-tag">RESUME</span></div><div className="signal-connector"><span /></div><div className="signal-card signal-proof"><span className="signal-icon icon-sage"><Github size={18} /></span><div><small>OBSERVABLE PROOF</small><strong>0 Dockerfiles found</strong><span>12 repositories analyzed</span></div><span className="signal-tag">GITHUB</span></div><div className="signal-connector"><span /></div><div className="signal-verdict"><div className="verdict-head"><span><CircleAlert size={16} /> VERDICT</span><span className="status-badge status-unsupported"><span className="status-dot" />Unsupported</span></div><p>Evidence is limited for this claim.</p><div className="verdict-action"><span>Next best action</span><strong>Dockerize your FastAPI project</strong><ArrowUpRight size={16} /></div></div></div>
        <div className="visual-bottom"><span>CLAIM</span><ArrowRight size={13} /><span>PROOF</span><ArrowRight size={13} /><span>DECISION</span><ArrowRight size={13} /><span>ACTION</span></div>
      </div>
    </section>
    <section className="landing-band"><div><span>01 / EVIDENCE, NOT KEYWORDS</span><strong>Show what your work can support.</strong></div><div><span>02 / TRACEABLE READINESS</span><strong>See where every score comes from.</strong></div><div><span>03 / A PRACTICAL NEXT STEP</span><strong>Leave knowing what to build next.</strong></div></section>
    <section className="landing-bottom"><span>THE CAREERLENS LOOP</span><div><strong>Claim</strong><ArrowRight size={17} /><strong>Proof</strong><ArrowRight size={17} /><strong>Decision</strong><ArrowRight size={17} /><strong>Action</strong></div><button className="button button-outline" onClick={() => navigate('/analyze')}>Start your analysis <ArrowRight size={16} /></button></section>
    <footer className="landing-footer"><span>CAREERLENS · DATAQUEST 3.0</span><span>Observable evidence, interpreted with care.</span></footer>
  </div>
}

export function IntakePage() {
  const navigate = useNavigate()
  const { runAnalysis } = useCareerLens()
  const [resume, setResume] = useState<File | null>(null)
  const [linkedinFile, setLinkedinFile] = useState<File | null>(null)
  const [github, setGithub] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [linkedinText, setLinkedinText] = useState('')
  const [targetRole, setTargetRole] = useState('Backend Developer')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const acceptResume = (file?: File) => {
    if (!file) return
    if (!acceptedResumeTypes.includes(file.type) && !/\.(pdf|docx|txt)$/i.test(file.name)) {
      setError('Choose a PDF, DOCX, or TXT resume.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('The resume must be smaller than 10 MB.')
      return
    }
    setError('')
    setResume(file)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!resume) return setError('Add a resume to continue. PDF, DOCX, and TXT are supported.')
    const username = normalizeGithub(github)
    if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)) return setError('Enter a GitHub username or a github.com profile URL.')
    if (portfolio && !/^https?:\/\//i.test(portfolio)) return setError('Add http:// or https:// to your portfolio URL.')
    navigate('/analysis')
    await runAnalysis({ resume, github: username, portfolio, linkedinText, linkedinFile: linkedinFile ?? undefined, targetRole })
  }

  const launchDemo = async () => {
    navigate('/analysis')
    const demoResume = new File(['Pooja Sriram | Backend Developer\nPython, FastAPI, SQL, Docker, AWS'], 'pooja-sriram-resume.txt', { type: 'text/plain' })
    await runAnalysis({ resume: demoResume, github: demoAnalysis.candidate.githubUsername, targetRole: demoAnalysis.candidate.targetRole, demoMode: true })
  }

  return <div className="intake-page">
    <div className="intake-intro"><span className="section-eyebrow">PROFILE INGESTION · ABOUT 2 MINUTES</span><h2>Start with what you claim.<br /><em>We’ll look for what you can prove.</em></h2><p>Connect your resume and public project work. Your analysis will show evidence, not just keywords.</p><div className="intake-steps"><span className="step-current"><i>1</i> Your profile</span><span><i>2</i> Evidence analysis</span><span><i>3</i> Your next steps</span></div></div>
    <div className="intake-grid">
      <form className="intake-form" onSubmit={handleSubmit}>
        <div className="form-section"><div className="form-section-title"><span className="form-index">01</span><div><h3>Resume</h3><p>PDF, DOCX, or TXT · Maximum 10 MB</p></div><span className="required-label">REQUIRED</span></div>
          <label className={`upload-zone ${isDragging ? 'dragging' : ''} ${resume ? 'has-file' : ''}`} onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); acceptResume(event.dataTransfer.files[0]) }}>
            <input type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={(event) => acceptResume(event.target.files?.[0])} />
            <span className="upload-icon">{resume ? <FileCheck2 size={22} /> : <HardDriveUpload size={22} />}</span><span className="upload-copy"><strong>{resume ? resume.name : 'Drop your resume here'}</strong><span>{resume ? `${(resume.size / 1024 / 1024).toFixed(2)} MB · Ready to analyze` : 'or choose a file from your device'}</span></span><span className="button button-small button-outline">{resume ? 'Replace' : 'Browse files'}</span>
          </label>
        </div>
        <div className="form-section"><div className="form-section-title"><span className="form-index">02</span><div><h3>Proof of work</h3><p>Public evidence helps verify the skills on your resume.</p></div></div>
          <label className="field-label" htmlFor="github">GitHub profile <span>Required for this analysis</span></label><div className="input-with-icon"><GitBranch size={17} /><input id="github" value={github} onChange={(event) => setGithub(event.target.value)} placeholder="username or github.com/username" autoComplete="url" /></div>
          <label className="field-label field-spaced" htmlFor="portfolio">Portfolio or project website <span>Optional</span></label><div className="input-with-icon"><ArrowUpRight size={17} /><input id="portfolio" value={portfolio} onChange={(event) => setPortfolio(event.target.value)} placeholder="https://yourportfolio.dev" autoComplete="url" /></div>
        </div>
        <details className="linkedin-disclosure"><summary><span><Plus size={15} /> Add LinkedIn profile content</span><span>OPTIONAL <ChevronDown size={14} /></span></summary><div className="linkedin-info"><Info size={15} /><p>Paste your profile text or upload your LinkedIn PDF export. CareerLens uses user-provided content and does not scrape LinkedIn.</p></div><label className="field-label" htmlFor="linkedin-text">Profile text</label><textarea id="linkedin-text" rows={3} value={linkedinText} onChange={(event) => setLinkedinText(event.target.value)} placeholder="Paste profile text here" /><label className="field-label field-spaced" htmlFor="linkedin-file">PDF export <span>Optional</span></label><input className="file-input-compact" id="linkedin-file" type="file" accept="application/pdf,.pdf" onChange={(event) => setLinkedinFile(event.target.files?.[0] ?? null)} /></details>
        <div className="form-section role-section"><div className="form-section-title"><span className="form-index">03</span><div><h3>Target role</h3><p>Role fit and gaps use this as the reference point.</p></div></div><div className="select-wrap"><Target size={16} /><select value={targetRole} onChange={(event) => setTargetRole(event.target.value)}>{availableRoles.map((role) => <option key={role}>{role}</option>)}</select><ChevronDown size={15} /></div></div>
        {error && <div className="form-error" role="alert"><CircleAlert size={16} />{error}</div>}
        <div className="form-submit"><button className="button button-dark button-large" type="submit">Analyze my profile <ArrowRight size={17} /></button><span><LockKeyhole size={13} /> Your profile is used only for this analysis.</span></div>
      </form>
      <aside className="intake-aside"><div className="aside-demo"><div className="aside-demo-head"><span className="demo-kicker"><Sparkles size={13} /> QUICK DEMO</span><span className="demo-time">60 SEC</span></div><h3>See the whole story.</h3><p>Explore Pooja’s profile: strong Python proof, an unsupported Docker claim, and a roadmap that closes the gap.</p><button className="button button-outline" type="button" onClick={launchDemo}>Load Pooja’s demo <ArrowRight size={15} /></button><div className="demo-preview"><div><span>READINESS</span><strong>68<small>/100</small></strong></div><div className="preview-skills"><span className="mini-skill mini-verified"><Check size={12} /> Python</span><span className="mini-skill mini-partial">~ SQL</span><span className="mini-skill mini-unsupported"><X size={12} /> Docker</span></div></div></div><div className="pipeline-note"><span className="section-eyebrow">THE CAREERLENS PIPELINE</span>{[['01', 'Resume claims', 'Skills, projects, measurable work'], ['02', 'Observable evidence', 'Repositories, activity, engineering signals'], ['03', 'Readiness & action', 'Role fit, gaps, a practical roadmap']].map(([number, title, detail]) => <div className="pipeline-row" key={number}><span>{number}</span><div><strong>{title}</strong><small>{detail}</small></div></div>)}</div></aside>
    </div>
  </div>
}

export function AnalysisPage() {
  const { analysisState, analysisError } = useCareerLens()
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const steps = [
    { label: 'Resume parsed', detail: 'Profile sections and claims extracted' },
    { label: 'GitHub connected', detail: 'Public repositories are being reviewed' },
    { label: 'Evidence signals collected', detail: 'Languages, activity, and project structure' },
    { label: 'Claims being verified', detail: 'Matching claims with observable proof' },
    { label: 'Readiness and role fit', detail: 'Scoring gaps and building your next steps' },
  ]
  useEffect(() => {
    if (analysisState !== 'running') return
    const timer = window.setInterval(() => setActiveStep((step) => Math.min(step + 1, 4)), 340)
    return () => window.clearInterval(timer)
  }, [analysisState])
  useEffect(() => {
    if (analysisState === 'complete') {
      const timer = window.setTimeout(() => navigate('/dashboard'), 750)
      return () => window.clearTimeout(timer)
    }
  }, [analysisState, navigate])

  if (analysisState === 'failed') return <div className="analysis-state-page"><div className="processing-panel state-failed"><span className="processing-symbol"><CircleAlert size={26} /></span><span className="section-eyebrow">ANALYSIS PAUSED</span><h2>We couldn’t finish this analysis.</h2><p>{analysisError || 'The analysis service is unavailable. Your missing evidence has not been treated as a zero.'}</p><div className="processing-actions"><Link className="button button-dark" to="/analyze">Review profile <ArrowRight size={15} /></Link><Link className="quiet-link" to="/dashboard">Explore Pooja’s demo</Link></div></div></div>
  if (analysisState === 'complete') return <div className="analysis-state-page"><div className="processing-panel state-complete"><span className="processing-symbol"><CheckCircle2 size={26} /></span><span className="section-eyebrow">ANALYSIS COMPLETE</span><h2>Your evidence map is ready.</h2><p>Opening your readiness overview…</p><div className="complete-meter"><span /></div></div></div>
  if (analysisState === 'idle') return <div className="analysis-state-page"><div className="processing-panel"><span className="processing-symbol"><FileText size={24} /></span><span className="section-eyebrow">NO ANALYSIS IN PROGRESS</span><h2>Ready when you are.</h2><p>Upload a resume and connect a GitHub profile to start the claim-to-evidence pipeline.</p><Link to="/analyze" className="button button-dark">Start profile analysis <ArrowRight size={16} /></Link></div></div>

  return <div className="analysis-state-page"><div className="processing-panel"><div className="processing-header"><span className="processing-spinner" /><span className="section-eyebrow">ANALYZING PROFILE</span></div><h2>Following your work<br /><em>from claim to proof.</em></h2><p>This can take a moment. We’re checking observable evidence, not grading the resume’s wording.</p><div className="processing-list">{steps.map((step, index) => <div className={`processing-step ${index < activeStep ? 'step-done' : index === activeStep ? 'step-active' : ''}`} key={step.label}><span className="processing-step-icon">{index < activeStep ? <Check size={14} /> : index === activeStep ? <span /> : <i />}</span><div><strong>{step.label}</strong><small>{step.detail}</small></div>{index < activeStep && <span className="step-check">COMPLETE</span>}{index === activeStep && <span className="step-live">IN PROGRESS</span>}</div>)}</div><div className="processing-foot"><ShieldCheck size={15} /> Unavailable sources lower analysis confidence; they do not count as negative skill evidence.</div></div></div>
}

function ScoreRing({ score, label = 'READINESS' }: { score: number; label?: string }) {
  return <div className="score-ring-wrap"><svg className="score-ring" viewBox="0 0 172 172" role="img" aria-label={`${label}: ${score} out of 100`}><circle className="ring-track" cx="86" cy="86" r="72" /><circle className="ring-value" cx="86" cy="86" r="72" style={{ strokeDasharray: `${score * 4.52} 452` }} /></svg><div className="ring-center"><span>{label}</span><strong>{score}<small>/100</small></strong><em>JOB READINESS</em></div></div>
}

export function DashboardPage() {
  const { analysis } = useCareerLens()
  const navigate = useNavigate()
  const [shareOpen, setShareOpen] = useState(false)
  const breakdown = [
    { label: 'Technical evidence', score: analysis.readiness.breakdown.technical, max: 30, color: 'green' },
    { label: 'Project quality', score: analysis.readiness.breakdown.projects, max: 20, color: 'green' },
    { label: 'Consistency & activity', score: analysis.readiness.breakdown.consistency, max: 15, color: 'lime' },
    { label: 'Engineering practice', score: analysis.readiness.breakdown.engineering, max: 10, color: 'coral' },
    { label: 'Documentation', score: analysis.readiness.breakdown.documentation, max: 10, color: 'coral' },
    { label: 'Role alignment', score: analysis.readiness.breakdown.roleAlignment, max: 15, color: 'green' },
  ]
  const chartData = breakdown.map((part) => ({ name: part.label.replace(' & ', ' + '), score: part.score, remaining: part.max - part.score }))
  const strongest = analysis.claims.filter((claim) => claim.status === 'verified').slice(0, 3)
  const gaps = analysis.gaps.filter((gap) => gap.gap < 0).sort((a, b) => a.gap - b.gap).slice(0, 3)

  return <div className="page-stack dashboard-page">
    <div className="dashboard-welcome"><div><span className="section-eyebrow">PROFILE SNAPSHOT · {analysis.candidate.id}</span><h2>Good work leaves a trail.</h2><p>Here’s what your public work supports for <strong>{analysis.candidate.targetRole}</strong>.</p></div><StagePill>{analysis.metrics.repositories} repositories reviewed</StagePill></div>
    <section className="overview-grid">
      <div className="readiness-panel panel"><div className="panel-topline"><span className="panel-kicker">CAREERLENS READINESS</span><button className="icon-button" aria-label="Readiness score information" title="A deterministic score based on evidence signals and role alignment."><Info size={16} /></button></div><div className="readiness-main"><ScoreRing score={analysis.readiness.score} /><div className="readiness-copy"><span className="confidence-label">ANALYSIS CONFIDENCE <Info size={13} /></span><strong>{analysis.readiness.confidence}<small>%</small></strong><p>Confidence reflects profile coverage, not your ability. We found enough public signals to make a useful assessment.</p><button className="text-button text-button-green" onClick={() => document.getElementById('score-explanation')?.scrollIntoView({ behavior: 'smooth' })}>Why this score? <ArrowDownRight size={15} /></button></div></div><div className="readiness-footer"><span><FileText size={14} /> {analysis.claims.length} claims analyzed</span><span><Activity size={14} /> {analysis.metrics.signals} evidence signals</span><span><BadgeCheck size={14} /> {analysis.metrics.verifiedSkills} verified skills</span></div></div>
      <div className="role-summary panel"><div className="panel-topline"><span className="panel-kicker">BEST-FIT ROLES</span><Link className="quiet-link" to="/roles">View all <ArrowRight size={13} /></Link></div><div className="role-summary-list">{analysis.roles.slice(0, 3).map((role, index) => <button className={`role-summary-row ${index === 0 ? 'role-summary-best' : ''}`} key={role.role} onClick={() => navigate('/roles')}><span className="role-rank">0{index + 1}</span><span className="role-summary-name">{role.role}<small>{index === 0 ? 'Strongest alignment' : 'Adjacent opportunity'}</small></span><strong>{role.score}<small>%</small></strong><ChevronRight size={15} /></button>)}</div><div className="role-summary-note"><TrendingUp size={15} /><span>Your strongest fit is supported by consistent backend project evidence.</span></div></div>
    </section>
    <section className="dashboard-grid-two">
      <div className="panel evidence-preview-panel"><div className="panel-heading-row"><div><span className="panel-kicker">CLAIM → EVIDENCE</span><h3>Your claims, checked.</h3></div><Link to="/evidence" className="quiet-link">Open evidence <ArrowRight size={13} /></Link></div><div className="preview-matrix">{analysis.claims.slice(0, 5).map((claim) => <button className="preview-row" key={claim.id} onClick={() => navigate('/evidence', { state: { selectedSkill: claim.skill } })}><span className={`skill-symbol status-symbol-${claim.status}`}>{claim.status === 'verified' ? <Check size={14} /> : claim.status === 'partial' ? '~' : claim.status === 'unavailable' ? '?' : <X size={13} />}</span><span className="preview-skill-name">{claim.skill}<small>{claim.claimedLevel} claim</small></span><span className="preview-evidence">{claim.evidenceSummary}</span><span className="preview-strength">{claim.strength ?? '—'}<small>{claim.strength === null ? '' : '/100'}</small></span><StatusBadge status={claim.status} /><ChevronRight size={14} className="preview-chevron" /></button>)}</div><Link className="matrix-mobile-link" to="/evidence">Open full claim-evidence matrix <ArrowRight size={13} /></Link></div>
      <div className="panel breakdown-panel" id="score-explanation"><div className="panel-heading-row"><div><span className="panel-kicker">WHY {analysis.readiness.score}?</span><h3>Score breakdown</h3></div><button className="icon-button" aria-label="Scoring methodology" title="Component weights: technical evidence 30%, projects 20%, consistency 15%, engineering 10%, documentation 10%, role alignment 15%."><Info size={16} /></button></div><div className="breakdown-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} layout="vertical" margin={{ top: 2, right: 4, left: 5, bottom: 0 }} barSize={8}><CartesianGrid horizontal={false} stroke="#e9e8e1" /><XAxis type="number" domain={[0, 30]} hide /><YAxis type="category" dataKey="name" width={118} axisLine={false} tickLine={false} tick={{ fill: '#66716a', fontSize: 11 }} /><Tooltip cursor={{ fill: 'transparent' }} formatter={(value, name) => [value, name === 'score' ? 'Earned' : 'Available']} /><Bar dataKey="score" stackId="a" fill="#347b5b" radius={[5, 0, 0, 5]} /><Bar dataKey="remaining" stackId="a" fill="#eaece5" radius={[0, 5, 5, 0]} /></BarChart></ResponsiveContainer></div><div className="breakdown-list">{breakdown.map((part) => <ScoreBar key={part.label} label={part.label} score={part.score} max={part.max} color={part.color} />)}</div></div>
    </section>
    <section className="score-reasons-grid" aria-label="Readiness score reasons"><div><span className="reason-heading reason-positive"><CheckCircle2 size={14} /> WHAT SUPPORTS THIS SCORE</span>{analysis.explanation.positives.slice(0, 2).map((reason) => <p key={reason}><Check size={13} />{reason}</p>)}</div><div><span className="reason-heading reason-negative"><ArrowDownRight size={14} /> WHAT WOULD IMPROVE IT</span>{analysis.explanation.improvements.slice(0, 2).map((reason) => <p key={reason}><ArrowDownRight size={13} />{reason}</p>)}</div></section>
    <section className="dashboard-grid-three"><div className="panel strength-panel"><div className="panel-heading-row"><div><span className="panel-kicker">WELL-SUPPORTED</span><h3>Strongest evidence</h3></div><Code2 size={17} /></div>{strongest.map((claim) => <button className="strength-row" key={claim.id} onClick={() => navigate('/evidence', { state: { selectedSkill: claim.skill } })}><span className="strength-icon"><Check size={15} /></span><span><strong>{claim.skill}</strong><small>{claim.evidenceSummary}</small></span><strong className="strength-score">{claim.strength}</strong></button>)}<Link className="quiet-link strength-link" to="/evidence">Explore evidence <ArrowRight size={13} /></Link></div>
      <div className="panel gap-preview-panel"><div className="panel-heading-row"><div><span className="panel-kicker">HIGHEST-PRIORITY GAPS</span><h3>What needs more proof?</h3></div><Link to="/gaps" className="quiet-link">See all <ArrowRight size={13} /></Link></div>{gaps.map((gap) => <div className="gap-preview-row" key={gap.skill}><span className="gap-priority-dot" /><span>{gap.skill}</span><div className="gap-mini-track"><span style={{ width: `${gap.current}%` }} /></div><strong>{gap.gap}</strong></div>)}<Link className="gap-action" to="/roadmap"><span><Rocket size={15} /> Close the Docker gap first</span><ArrowRight size={14} /></Link></div>
      <div className="next-action-panel"><span className="next-action-icon"><WandSparkles size={17} /></span><span className="panel-kicker">HIGHEST-IMPACT NEXT STEP</span><h3>{analysis.explanation.recommendation}</h3><p>One focused project can improve testing, Docker, and deployment evidence together.</p><Link className="button button-light" to="/roadmap">See your roadmap <ArrowRight size={14} /></Link><span className="action-decoration">NEXT</span></div>
    </section>
    <section className="dashboard-share-row">
      <div><span className="section-eyebrow">SHAREABLE SCORECARD</span><h3>Export a verified candidate snapshot.</h3><p>Share evidence-backed readiness with recruiters while keeping the trust seal visible.</p></div>
      <button className="button button-dark" onClick={() => setShareOpen(true)}>Share scorecard <ArrowRight size={14} /></button>
    </section>
    <div className="fairness-inline"><ShieldCheck size={16} /><span><strong>Fairness by design.</strong> CareerLens evaluates observable evidence of skills and work, not identity, age, or institutional prestige.</span></div>
    {shareOpen && <ShareableCard isModal onClose={() => setShareOpen(false)} />}
  </div>
}

export function EvidencePage() {
  const { analysis } = useCareerLens()
  const location = useLocation()
  const [selectedSkill, setSelectedSkill] = useState<string>(location.state?.selectedSkill ?? 'Docker')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const selected = analysis.claims.find((claim) => claim.skill === selectedSkill) ?? analysis.claims[0]
  const visible = analysis.claims.filter((claim) => claim.skill.toLowerCase().includes(query.toLowerCase()) && (filter === 'all' || claim.status === filter))
  const evidenceColor = selected?.status === 'verified' ? 'green' : selected?.status === 'partial' ? 'amber' : 'coral'

  return <div className="page-stack"><PageTitle label="THE CORE OF CAREERLENS" title="What you claim. What we can see." detail="Select a skill to trace the claim to its supporting evidence and next action." action={<span className="evidence-count"><GitBranch size={14} />{analysis.metrics.repositories} repositories scanned</span>} />
    <div className="evidence-context-strip"><span><FileText size={15} /> RESUME CLAIMS</span><ArrowRight size={15} /><span><Github size={15} /> PUBLIC PROJECT EVIDENCE</span><ArrowRight size={15} /><span><ShieldCheck size={15} /> VERIFICATION</span><small>Evidence strength describes visible signals, not a person’s ability.</small></div>
    <section className="evidence-layout"><div className="panel evidence-table-panel"><div className="table-toolbar"><div><span className="panel-kicker">CLAIM-EVIDENCE MATRIX</span><h3>{analysis.claims.length} skills reviewed</h3></div><div className="table-filters"><label className="table-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a skill" /></label><select aria-label="Filter evidence status" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All statuses</option><option value="verified">Verified</option><option value="partial">Partial</option><option value="unsupported">Unsupported</option><option value="unavailable">Unavailable</option></select></div></div>
      <div className="evidence-table-scroll"><table className="data-table evidence-table"><thead><tr><th>SKILL / CLAIM</th><th>OBSERVABLE EVIDENCE</th><th>STRENGTH</th><th>STATUS</th></tr></thead><tbody>{visible.map((claim) => <tr key={claim.id} className={selected?.id === claim.id ? 'selected-row' : ''} onClick={() => setSelectedSkill(claim.skill)} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') setSelectedSkill(claim.skill) }}><td><span className="table-skill">{claim.skill}</span><small className="table-claim-level">{claim.claimedLevel} claim</small></td><td>{claim.evidenceSummary}</td><td><span className={`strength-value strength-${claim.status}`}>{claim.strength === null ? '—' : `${claim.strength}`}<small>{claim.strength === null ? '' : '/100'}</small></span></td><td><StatusBadge status={claim.status} /></td></tr>)}</tbody></table>{visible.length === 0 && <div className="empty-state"><Search size={20} /><strong>No claims match this view.</strong><span>Change the filter or search term to see more results.</span></div>}</div>
      <div className="table-footer"><span>Showing {visible.length} of {analysis.claims.length} claims</span><span><Info size={13} /> Scores are based on available evidence sources</span></div></div>
      {selected && <EvidenceDetail claim={selected} color={evidenceColor} />}
    </section>
  </div>
}

function EvidenceDetail({ claim, color }: { claim: SkillEvidence; color: string }) {
  const navigate = useNavigate()
  const impact = claim.readinessImpact
  return <aside className={`evidence-detail panel evidence-detail-${color}`}><div className="detail-topline"><span className="panel-kicker">EVIDENCE DETAIL</span><button className="icon-button" aria-label="Evidence scoring information" title="Evidence strength is a signal score based on public project evidence."><Info size={15} /></button></div><div className="detail-skill-head"><span className={`detail-symbol status-symbol-${claim.status}`}>{claim.status === 'verified' ? <Check size={17} /> : claim.status === 'partial' ? '~' : claim.status === 'unavailable' ? '?' : <X size={16} />}</span><div><h3>{claim.skill}</h3><span>{claim.claimedLevel} · claimed on resume</span></div></div><div className="detail-status-line"><StatusBadge status={claim.status} /><div className="detail-score"><strong>{claim.strength ?? '—'}</strong><span>/100<br />EVIDENCE</span></div></div><p className="detail-explanation">{claim.explanation}</p><div className="detail-subhead"><strong>Signals reviewed</strong><span>{claim.signals.length} signals</span></div><ul className="signal-list">{claim.signals.map((signal) => <li key={signal}><span className={claim.status === 'unsupported' ? 'signal-negative' : 'signal-positive'}>{claim.status === 'unsupported' ? <X size={13} /> : <Check size={13} />}</span>{signal}</li>)}</ul>
    {claim.repositories.length > 0 && <div className="detail-repos"><div className="detail-subhead"><strong>Evidence sources</strong><span>{claim.repositories.length} repositories</span></div>{claim.repositories.map((repo) => <div className="repo-evidence" key={repo.name}><span className="repo-icon"><Github size={15} /></span><div><strong>{repo.name}</strong><small>{repo.description}</small></div><ExternalLink href={repo.url}>View</ExternalLink></div>)}</div>}
    <div className={`detail-impact ${impact !== null && impact < 0 ? 'impact-negative' : ''}`}><span>{impact === null ? 'Score impact' : 'READINESS IMPACT'}</span><strong>{impact === null ? 'Not scored' : `${impact > 0 ? '+' : ''}${impact} pts`}</strong></div><div className="detail-action"><span className="section-eyebrow">RECOMMENDED NEXT ACTION</span><p>{claim.action}</p><button className="text-button text-button-green" onClick={() => navigate('/roadmap')}>Open your roadmap <ArrowRight size={14} /></button></div>
  </aside>
}

export function RolesPage() {
  const { analysis } = useCareerLens()
  const [activeRole, setActiveRole] = useState(analysis.roles[0]?.role ?? '')
  const selectedRole = analysis.roles.find((role) => role.role === activeRole) ?? analysis.roles[0]
  const skills = analysis.gaps.filter((gap) => gap.weight > 0).slice(0, 7).map((gap) => ({ skill: gap.skill, evidence: gap.current, required: gap.required }))
  return <div className="page-stack"><PageTitle label="ROLE INTELLIGENCE" title="A fit is a starting point." detail="Role alignment combines your evidence with the skills typically required for each path. Use the gaps to decide what to demonstrate next." />
    <div className="role-fit-banner"><div><span className="section-eyebrow">CURRENT TARGET ROLE</span><h3>{analysis.candidate.targetRole}</h3><p>Best-fit roles are ranked using role-weighted evidence strength.</p></div><div className="fit-banner-score"><strong>{selectedRole?.score ?? 0}<small>%</small></strong><span>ROLE FIT</span></div><div className="fit-banner-meta"><span><BadgeCheck size={15} /> Evidence-backed score</span><span><Clock3 size={15} /> Snapshot: today</span></div></div>
    <section className="role-content-grid"><div className="panel role-list-panel"><div className="panel-heading-row"><div><span className="panel-kicker">ROLE MATCHES</span><h3>Where your evidence fits</h3></div><span className="role-match-count">{analysis.roles.length} roles</span></div><div className="role-list">{analysis.roles.map((role, index) => <button key={role.role} className={`role-fit-row ${role.role === activeRole ? 'role-fit-active' : ''}`} onClick={() => setActiveRole(role.role)}><span className="role-rank">0{index + 1}</span><span className="role-fit-label"><strong>{role.role}</strong><small>{role.summary}</small><span className="role-progress"><i style={{ width: `${role.score}%` }} /></span></span><strong className="role-fit-score">{role.score}<small>%</small></strong><ChevronRight size={15} /></button>)}</div><div className="role-method-note"><Info size={15} /><span>Role fit is not a hiring prediction. It compares evidence signals with the selected role’s requirements.</span></div></div>
      <div className="panel role-requirements-panel"><div className="panel-heading-row"><div><span className="panel-kicker">ROLE REQUIREMENTS</span><h3>{selectedRole?.role ?? 'Target role'}</h3></div><Target size={17} /></div><div className="role-radar"><RadarChartWidget data={skills} heightClass="h-full" /></div><div className="role-skill-list">{skills.slice(0, 5).map((skill) => <div className="role-skill-item" key={skill.skill}><span className="role-skill-name">{skill.skill}</span><div className="role-skill-track"><span className="skill-track-bar" style={{ width: `${Math.min(100, (skill.evidence / skill.required) * 100)}%` }} /></div><span className="role-skill-score"><strong>{skill.evidence}</strong><small> / {skill.required}</small></span></div>)}</div></div></section>
    <div className="role-bridge"><span className="bridge-icon"><Layers3 size={17} /></span><div><span className="section-eyebrow">ADJACENT OPPORTUNITY</span><strong>Data Engineer · {analysis.roles.find((role) => role.role === 'Data Engineer')?.score ?? 67}% fit</strong><p>Build on your Python and SQL evidence; a documented pipeline project could bridge the gap.</p></div><Link className="text-button text-button-green" to="/gaps">See bridge skills <ArrowRight size={14} /></Link></div>
  </div>
}

export function GapsPage() {
  const { analysis } = useCareerLens()
  const navigate = useNavigate()
  const chartData = analysis.gaps.filter((gap) => gap.weight > 0).map((gap) => ({ skill: gap.skill, evidence: gap.current, required: gap.required }))
  const priorities = analysis.gaps.filter((gap) => gap.gap < 0).sort((a, b) => a.gap - b.gap)
  return <div className="page-stack"><PageTitle label={`TARGET: ${analysis.candidate.targetRole.toUpperCase()}`} title="Make the next gap count." detail="Priorities reflect the role threshold and evidence currently available. A gap is a direction for action, not a judgment." action={<Link className="button button-outline" to="/roadmap">Open roadmap <ArrowRight size={14} /></Link>} />
    <section className="gap-overview-row"><div className="panel gap-chart-panel"><div className="panel-heading-row"><div><span className="panel-kicker">YOUR EVIDENCE VS ROLE THRESHOLD</span><h3>Skill coverage</h3></div><div className="chart-legend"><span><i className="legend-green" /> Your evidence</span><span><i className="legend-coral" /> Role threshold</span></div></div><div className="gap-radar"><RadarChartWidget data={chartData} heightClass="h-full" /></div><div className="chart-caption"><Info size={14} />The chart compares visible evidence against a typical role threshold.</div></div>
      <div className="gap-priority-panel"><div className="panel-heading-row"><div><span className="panel-kicker">PRIORITIZED GAPS</span><h3>Start here</h3></div><span className="gap-priority-count">{priorities.length} areas</span></div><div className="gap-priority-list">{priorities.slice(0, 4).map((gap, index) => <button className="gap-priority-item" key={gap.skill} onClick={() => navigate('/evidence', { state: { selectedSkill: gap.skill } })}><span className="priority-index">0{index + 1}</span><div><strong>{gap.skill}<span className={`priority-label priority-${gap.priority}`}>{gap.priority} priority</span></strong><small>{gap.evidenceNote}</small></div><span className="gap-number">{gap.gap}</span></button>)}</div><Link to="/roadmap" className="button button-dark gap-plan-button">Build evidence for these gaps <ArrowRight size={15} /></Link></div></section>
    <div className="panel gaps-table-panel"><div className="panel-heading-row"><div><span className="panel-kicker">ROLE REQUIREMENT COMPARISON</span><h3>What the role asks for</h3></div><span className="gap-table-note">Positive means evidence exceeds threshold</span></div><div className="gaps-table-scroll"><table className="data-table gaps-table"><thead><tr><th>SKILL</th><th>YOUR EVIDENCE</th><th>ROLE THRESHOLD</th><th>DIFFERENCE</th><th>PRIORITY</th><th></th></tr></thead><tbody>{analysis.gaps.map((gap) => <tr key={gap.skill}><td><strong>{gap.skill}</strong></td><td><div className="table-bar"><span style={{ width: `${gap.current}%` }} /></div><span>{gap.current}/100</span></td><td>{gap.required}/100</td><td className={gap.gap < 0 ? 'gap-negative' : 'gap-positive'}>{gap.gap > 0 ? '+' : ''}{gap.gap}</td><td><span className={`priority-label priority-${gap.priority}`}>{gap.gap < 0 ? gap.priority : 'covered'}</span></td><td><button className="table-arrow" onClick={() => navigate('/evidence', { state: { selectedSkill: gap.skill } })} aria-label={`See ${gap.skill} evidence`}><ArrowUpRight size={15} /></button></td></tr>)}</tbody></table></div></div>
  </div>
}

export function RoadmapPage() {
  const { analysis } = useCareerLens()
  const [checked, setChecked] = useState<Record<string, boolean>>(() => Object.fromEntries(analysis.roadmap.flatMap((week) => week.tasks.map((task) => [task.id, task.done]))))
  const tasks = analysis.roadmap.flatMap((week) => week.tasks)
  const completed = tasks.filter((task) => checked[task.id]).length
  const toggle = (id: string) => setChecked((state) => ({ ...state, [id]: !state[id] }))
  return <div className="page-stack"><PageTitle label="PERSONALIZED ACTION PLAN" title="A month of proof-building." detail="Built around your profile and the gaps that matter for Backend Developer. Each milestone creates evidence you can point to." action={<span className="roadmap-progress-pill"><CheckCircle2 size={15} />{completed}/{tasks.length} tasks checked</span>} />
    <div className="roadmap-overview"><div><span className="section-eyebrow">RECOMMENDED PROJECT</span><h3>Production-ready Job Application API</h3><p>Extend fastapi-job-board with tests, Docker, and a public deployment. One coherent project can close several gaps.</p><div className="roadmap-tags"><span><Code2 size={13} /> FastAPI</span><span><CheckCircle2 size={13} /> pytest</span><span><Layers3 size={13} /> PostgreSQL</span><span><Cloud size={13} /> Docker + deploy</span></div></div><div className="roadmap-project-mark"><Rocket size={25} /><span>PROJECT<br />BRIEF</span></div></div>
    <div className="roadmap-timeline">{analysis.roadmap.map((week, index) => { const weekDone = week.tasks.filter((task) => checked[task.id]).length; const weekPercent = Math.round(weekDone / week.tasks.length * 100); return <section className={`roadmap-week ${index === 0 ? 'roadmap-week-current' : ''}`} key={week.week}><div className="week-rail"><span className="week-node">{weekPercent === 100 ? <Check size={15} /> : `0${week.week}`}</span>{index < analysis.roadmap.length - 1 && <span className="week-line" />}</div><div className="week-content"><div className="week-heading"><div><span className="section-eyebrow">WEEK {week.week} · {weekPercent}% COMPLETE</span><h3>{week.goal}</h3></div><span className={`week-status ${weekPercent === 100 ? 'week-done' : index === 0 ? 'week-now' : ''}`}>{weekPercent === 100 ? 'DONE' : index === 0 ? 'UP NEXT' : 'UPCOMING'}</span></div><div className="week-tasks">{week.tasks.map((task) => <label className={`roadmap-task ${checked[task.id] ? 'task-checked' : ''}`} key={task.id}><input type="checkbox" checked={Boolean(checked[task.id])} onChange={() => toggle(task.id)} /><span className="task-check"><Check size={12} /></span><span className="task-label">{task.label}<small>{task.resource}</small></span><ArrowUpRight size={14} className="task-resource-icon" /></label>)}</div><div className="week-deliverable"><span><BadgeCheck size={14} /> DELIVERABLE</span><strong>{week.deliverable}</strong><span className="week-progress-track"><i style={{ width: `${weekPercent}%` }} /></span></div></div></section> })}</div>
    <div className="roadmap-bottom-cta"><div><span className="section-eyebrow">MAKE YOUR NEXT MOVES COUNT</span><strong>See how these improvements could change your readiness.</strong></div><Link className="button button-dark" to="/what-if">Open what-if simulator <ArrowRight size={15} /></Link></div>
  </div>
}

const whatIfActions = [
  { id: 'docker', label: 'Add Docker to one project', detail: 'Dockerfile + Compose setup', impact: 3, icon: Layers3 },
  { id: 'tests', label: 'Add automated tests', detail: 'Unit and API integration tests', impact: 2, icon: CheckCircle2 },
  { id: 'deploy', label: 'Deploy a backend project', detail: 'Public endpoint + deployment config', impact: 4, icon: Cloud },
]

export function WhatIfPage() {
  const { analysis } = useCareerLens()
  const [selected, setSelected] = useState<string[]>(['docker', 'tests', 'deploy'])
  const [projection, setProjection] = useState<WhatIfResult>(() => ({
    currentScore: analysis.readiness.score,
    projectedScore: Math.min(100, analysis.readiness.score + 9),
    delta: 9,
    reasons: whatIfActions.map((action) => ({ factor: action.label, impact: action.impact })),
  }))
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')
  const toggle = async (id: string) => {
    const next = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]
    setSelected(next)
    setIsUpdating(true)
    setError('')
    try {
      const result = await getWhatIf(next, analysis.candidate.id)
      setProjection(result)
    } catch {
      setError('The simulator could not refresh. Your current scenario is still visible.')
    } finally {
      setIsUpdating(false)
    }
  }
  const reasons = projection.reasons
  const delta = projection.delta
  const projectedScore = projection.projectedScore
  return <div className="page-stack"><PageTitle label="DETERMINISTIC SCENARIO MODEL" title="What if you close the gap?" detail="Select evidence-building actions to see a transparent score projection. A projection is not a guarantee or an assessment of ability." action={<span className="scenario-note"><Info size={14} />Model estimate</span>} />
    <section className="whatif-layout"><div className="panel whatif-controls"><div className="panel-heading-row"><div><span className="panel-kicker">CHOOSE YOUR NEXT ACTIONS</span><h3>What will you build?</h3></div><Sparkles size={18} /></div><div className="whatif-options">{whatIfActions.map(({ id, label, detail, impact, icon: Icon }) => <label className={`whatif-option ${selected.includes(id) ? 'option-selected' : ''}`} key={id}><input type="checkbox" checked={selected.includes(id)} onChange={() => toggle(id)} /><span className="whatif-checkbox"><Check size={13} /></span><span className="whatif-option-icon"><Icon size={17} /></span><span className="whatif-option-copy"><strong>{label}</strong><small>{detail}</small></span><span className="option-points">+{impact}<small>pts</small></span></label>)}</div><div className="whatif-guardrail"><ShieldCheck size={16} /><span>Only evidence that can be observed in a future analysis should change a real readiness score.</span></div></div>
      <div className="whatif-result"><div className="whatif-result-top"><span className="section-eyebrow">PROJECTED READINESS</span><span className="projection-label"><span className="online-dot" /> SCENARIO</span></div><div className="score-transition"><div><span>CURRENT</span><strong>{projection.currentScore}</strong><small>/100</small></div><ArrowRight size={21} /><div className="projected-score"><span>PROJECTED</span><strong>{projectedScore}</strong><small>/100</small></div></div><div className="projection-track"><i style={{ width: `${projection.currentScore}%` }} /><b style={{ left: `${projectedScore}%` }} /></div><div className="projection-delta"><span>ESTIMATED CHANGE</span><strong><TrendingUp size={16} /> +{delta} points</strong></div><div className="projection-breakdown"><div className="panel-kicker">WHY THE SCORE MOVES</div>{reasons.length ? reasons.map((reason) => <div key={reason.factor}><span>{reason.factor}</span><strong>+{reason.impact}</strong></div>) : <div className="scenario-empty">Select an action to see the projected contribution.</div>}</div><div className="projection-foot"><Info size={14} />Projection uses fixed, explainable demo weights. P3’s deterministic service can replace them at integration.</div>{isUpdating && <span className="projection-updating">Updating estimate…</span>}</div></section>
    {error && <div className="form-error"><CircleAlert size={15} />{error}</div>}
    <div className="whatif-explain"><span className="explain-icon"><BarChart3 size={17} /></span><div><span className="section-eyebrow">WHAT THIS DOES NOT MEAN</span><p>This estimate models the impact of new evidence signals. Learning a tool alone does not add points; a future analysis must find the work in your project.</p></div></div>
  </div>
}

export function PlacementPage() {
  const [roleFilter, setRoleFilter] = useState('All roles')
  const data = placementData
  const visibleAtRisk = data.atRisk.filter((student) => roleFilter === 'All roles' || student.role === roleFilter)
  return <div className="page-stack placement-page"><div className="placement-privacy"><LockKeyhole size={15} /><span><strong>Aggregate view.</strong> Individual profiles require appropriate access and candidate consent.</span><span className="aggregate-tag">COHORT DATA</span></div><PageTitle label="PLACEMENT CELL · BATCH 2026" title="See where the cohort needs proof." detail="Aggregate readiness signals show which skills need focused institutional support." action={<span className="panel-period">SNAPSHOT · 2026</span>} />
    <section className="placement-metrics"><SmallMetric label="Students analyzed" value={data.studentsAnalyzed.toLocaleString()} note="Across the current cohort" icon={FileCheck2} /><SmallMetric label="Average readiness" value={`${data.averageReadiness}/100`} note="Batch-wide average" icon={BarChart3} /><SmallMetric label="Placement ready" value={`${data.placementReady}%`} note="Meeting initial thresholds" icon={BadgeCheck} /><SmallMetric label="Needs intervention" value={`${data.needsIntervention}%`} note="Below target role readiness" icon={CircleAlert} /></section>
    <section className="placement-charts"><div className="panel distribution-panel"><div className="panel-heading-row"><div><span className="panel-kicker">READINESS DISTRIBUTION</span><h3>Where students are today</h3></div><span className="panel-period">CURRENT COHORT</span></div><div className="distribution-visual"><div className="distribution-bar"><span style={{ width: '18%', background: '#347b5b' }} /><span style={{ width: '37%', background: '#a6c75a' }} /><span style={{ width: '45%', background: '#e27c64' }} /></div><div className="distribution-key">{data.readinessDistribution.map((segment) => <div key={segment.label}><span className="distribution-dot" style={{ background: segment.color }} /><span>{segment.label}</span><strong>{segment.value}%</strong></div>)}</div></div><div className="distribution-note"><Info size={14} />Readiness thresholds are a prototype aid, not a hiring decision.</div></div>
      <div className="panel heatmap-panel"><div className="panel-heading-row"><div><span className="panel-kicker">MARKET DEMAND VS BATCH COVERAGE</span><h3>Skill evidence heatmap</h3></div><span className="market-date">CURATED DEMO DATA</span></div><div className="heatmap-table-wrap"><table className="data-table heatmap-table"><thead><tr><th>SKILL</th><th>DEMAND</th><th>BATCH COVERAGE</th><th>GAP</th></tr></thead><tbody>{data.skills.map((skill) => <tr key={skill.skill}><td><strong>{skill.skill}</strong></td><td><span className="heatmap-number">{skill.demand}%</span><div className="heat-cell heat-demand"><i style={{ width: `${skill.demand}%` }} /></div></td><td><span className="heatmap-number">{skill.coverage}%</span><div className={`heat-cell ${skill.coverage < 30 ? 'heat-low' : 'heat-coverage'}`}><i style={{ width: `${skill.coverage}%` }} /></div></td><td><span className={`heatmap-gap ${skill.demand - skill.coverage > 35 ? 'heatmap-gap-high' : ''}`}>{skill.demand - skill.coverage} pts</span></td></tr>)}</tbody></table></div><div className="market-caveat"><Info size={14} />Market demand is a small curated sample, not a representation of the full job market.</div></div></section>
    <section className="placement-bottom-grid"><div className="panel training-panel"><div className="panel-heading-row"><div><span className="panel-kicker">RECOMMENDED INSTITUTIONAL TRAINING</span><h3>Turn common gaps into workshops</h3></div><WandSparkles size={17} /></div><div className="training-list">{data.recommendations.map((item, index) => <div className="training-item" key={item.title}><span className="training-rank">0{index + 1}</span><div><strong>{item.title}</strong><p>{item.note}</p></div><span className={`training-priority priority-${item.priority.toLowerCase()}`}>{item.priority}</span></div>)}</div></div>
      <div className="panel at-risk-panel"><div className="panel-heading-row"><div><span className="panel-kicker">INTERVENTION REVIEW</span><h3>Profiles to support</h3></div><div className="at-risk-controls"><label className="privacy-small"><LockKeyhole size={12} /> Restricted</label><div className="select-wrap compact-select"><Target size={13} /><select aria-label="Filter intervention profiles by role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}><option>All roles</option><option>Backend Developer</option><option>Data Engineer</option><option>Full Stack Developer</option></select><ChevronDown size={13} /></div></div></div><div className="at-risk-note">Pseudonymous demo profiles. Individual access depends on student consent.</div><div className="at-risk-list">{visibleAtRisk.map((student) => <div className="at-risk-row" key={student.name}><div className="at-risk-avatar">{student.name.slice(-3)}</div><div className="at-risk-info"><strong>{student.name}</strong><small>{student.role} · {student.activity.toLowerCase()} activity</small><span>Major gap: {student.gap}</span></div><strong className="at-risk-score">{student.score}<small>/100</small></strong></div>)}{visibleAtRisk.length === 0 && <div className="empty-state"><CircleAlert size={18} /><strong>No demo profiles in this role filter.</strong><span>The current cohort sample has no matching pseudonymous rows.</span></div>}</div></div></section>
    <div className="placement-insight"><span><Sparkles size={16} /></span><p><strong>Training insight</strong> Docker has a 44-point demand-to-evidence gap, while only 21% of this cohort shows meaningful Docker evidence.</p><span className="insight-source">AGGREGATE SIGNAL</span></div>
  </div>
}
