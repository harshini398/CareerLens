import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Activity, ArrowUpRight, BookOpenCheck, BriefcaseBusiness, ChartNoAxesCombined,
  CircleHelp, ClipboardCheck, FileText, Gauge, Layers3, Menu,
  Sparkles, Target, X,
} from 'lucide-react'
import { useState } from 'react'
import { useCareerLens } from '../context'

const candidateLinks = [
  { to: '/dashboard', label: 'Overview', icon: Gauge },
  { to: '/gaps', label: 'Skill Gaps', icon: Layers3 },
  { to: '/progress', label: 'Progress', icon: ChartNoAxesCombined },
  { to: '/interview', label: 'AI Interview', icon: Sparkles },
]

const recruiterLinks = [
  { to: '/recruiter/jd', label: 'JD Matcher', icon: BriefcaseBusiness },
]

const adminLinks = [
  { to: '/admin/weights', label: 'Scoring Weights', icon: Target },
]

const titleByPath: Record<string, { title: string; eyebrow: string }> = {
  '/': { title: 'Profile intake', eyebrow: 'START HERE' },
  '/analysis': { title: 'Profile analysis', eyebrow: 'CLAIM → PROOF → ACTION' },
  '/dashboard': { title: 'Readiness overview', eyebrow: 'CANDIDATE PROFILE' },
  '/evidence': { title: 'Claim evidence', eyebrow: 'CLAIM → PROOF' },
  '/roles': { title: 'Role fit', eyebrow: 'FIND YOUR NEXT ROLE' },
  '/gaps': { title: 'Skill gaps', eyebrow: 'PRIORITIZE WHAT MATTERS' },
  '/roadmap': { title: '30-day roadmap', eyebrow: 'TURN GAPS INTO PROOF' },
  '/what-if': { title: 'What-if simulator', eyebrow: 'MODEL YOUR NEXT MOVES' },
  '/placement': { title: 'Placement insights', eyebrow: 'INSTITUTION VIEW' },
}

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { analysis } = useCareerLens()
  const current = titleByPath[location.pathname] ?? titleByPath['/dashboard']

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><Activity size={19} strokeWidth={2.3} /></span>
          <span>career<span>lens</span><small>PROOF-FIRST READINESS</small></span>
        </NavLink>
        <div className="sidebar-label">CANDIDATE WORKSPACE</div>
        <nav className="main-nav" aria-label="Candidate navigation">
          {candidateLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              <Icon size={17} strokeWidth={1.8} /> <span>{label}</span>
              {to === '/dashboard' && <span className="nav-count">{analysis.claims.length}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-divider" />
        <div className="sidebar-label">RECRUITER PORTAL</div>
        <nav className="main-nav" aria-label="Recruiter navigation">
          {recruiterLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              <Icon size={17} strokeWidth={1.8} /> <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-divider" />
        <div className="sidebar-label">SYSTEM ADMIN</div>
        <nav className="main-nav" aria-label="System administration navigation">
          {adminLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              <Icon size={17} strokeWidth={1.8} /> <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="fairness-note">
          <span className="fairness-icon"><ClipboardCheck size={15} /></span>
          <p><strong>Fairness by design</strong><br />We evaluate observable work, not identity or institutional prestige.</p>
        </div>
        <div className="sidebar-profile">
          <div className="avatar">{analysis.candidate.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
          <div><strong>{analysis.candidate.name}</strong><span>Candidate workspace</span></div>
          <button className="icon-button sidebar-help" aria-label="Help"><CircleHelp size={17} /></button>
        </div>
      </aside>

      {menuOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <div className="workspace">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="page-heading"><span>{current.eyebrow}</span><h1>{current.title}</h1></div>
          <div className="topbar-right">
            <div className="analysis-version"><span className="online-dot" /> Analysis v1 <span className="topbar-separator">/</span> {analysis.candidate.targetRole}</div>
            <NavLink to="/" className="topbar-action"><FileText size={15} /> New analysis</NavLink>
          </div>
        </header>
        <main className="page-content"><Outlet /></main>
        <footer className="page-footer"><span>CAREERLENS · EVIDENCE BEFORE ASSERTION</span><span>Analysis confidence is not a measure of ability.</span></footer>
      </div>
    </div>
  )
}

export function PageTitle({ label, title, detail, action }: { label?: string; title: string; detail?: string; action?: React.ReactNode }) {
  return <div className="section-heading"><div>{label && <span className="section-eyebrow">{label}</span>}<h2>{title}</h2>{detail && <p>{detail}</p>}</div>{action}</div>
}

export function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = { verified: 'Verified', partial: 'Partial', unsupported: 'Unsupported', unavailable: 'Unavailable' }
  return <span className={`status-badge status-${status}`}><span className="status-dot" />{labels[status] ?? status}</span>
}

export function ScoreBar({ label, score, max, color = 'green' }: { label: string; score: number; max: number; color?: string }) {
  return <div className="score-bar-row"><div className="score-bar-label"><span>{label}</span><strong>{score}<small>/{max}</small></strong></div><div className="score-track"><span className={`score-fill fill-${color}`} style={{ width: `${Math.max(0, Math.min(100, score / max * 100))}%` }} /></div></div>
}

export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="external-link" href={href} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={14} /></a>
}

export function SmallMetric({ label, value, note, icon: Icon }: { label: string; value: string | number; note: string; icon: typeof BriefcaseBusiness }) {
  return <div className="small-metric"><span className="metric-icon"><Icon size={17} /></span><div><span className="metric-label">{label}</span><strong>{value}</strong><small>{note}</small></div></div>
}

export function StagePill({ children }: { children: React.ReactNode }) {
  return <span className="stage-pill"><BookOpenCheck size={13} />{children}</span>
}