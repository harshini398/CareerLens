import { Activity, ArrowUpRight, Award, BadgeCheck, CalendarDays, CheckCircle2, Clock3, GitCommit, TrendingUp } from 'lucide-react'
import ProgressChart from '../components/ProgressChart'
import Timeline from '../components/Timeline'
import Badge from '../components/Badge'

const metrics = [
  { label: 'Initial readiness', value: '58%', change: '-2%', icon: Activity, tone: 'slate' },
  { label: 'Current readiness', value: '86%', change: '+28%', icon: TrendingUp, tone: 'green' },
  { label: 'Verified skills', value: '24', change: '+6', icon: BadgeCheck, tone: 'blue' },
  { label: 'Weekly velocity', value: '+12%', change: 'vs last week', icon: ArrowUpRight, tone: 'amber' },
]

export default function Progress() {
  return (
    <div className="career-page career-progress-page">
      <header className="career-page-header">
        <div><span className="career-eyebrow">Candidate progress</span><h1>Readiness over time</h1><p>Evidence-backed development measured against the target role.</p></div>
        <div className="career-header-actions"><Badge tone="green"><CalendarDays size={12} /> 90-day window</Badge><button className="career-filter-button">All activity</button></div>
      </header>

      <section className="career-metric-grid">
        {metrics.map(({ label, value, change, icon: Icon, tone }) => (
          <article className="career-metric-card" key={label}>
            <div className={`career-metric-icon career-metric-${tone}`}><Icon size={17} /></div>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{change}</small>
          </article>
        ))}
      </section>

      <section className="career-progress-layout">
        <article className="career-panel career-chart-panel">
          <div className="career-panel-heading"><div><span className="career-panel-kicker">30 / 60 / 90 days</span><h2>Readiness trajectory</h2></div><div className="career-chart-legend"><span><i className="legend-green" /> Readiness</span><span><i className="legend-red" /> Target</span></div></div>
          <ProgressChart />
          <div className="career-chart-summary"><span><strong>+28 pts</strong> in 6 weeks</span><span><strong>+12%</strong> weekly velocity</span><span><strong>82%</strong> role confidence</span></div>
        </article>

        <aside className="career-panel career-progress-side">
          <div className="career-panel-heading"><div><span className="career-panel-kicker">Target status</span><h2>Role alignment</h2></div></div>
          <div className="career-ring-wrap">
            <div className="career-score-ring"><span>86</span><small>/100</small></div>
            <div><strong>Strong fit</strong><p>Candidate is ahead of the role threshold for the current evaluation window.</p></div>
          </div>
          <div className="career-progress-breakdown">
            <div><span>Technical skills</span><strong>92%</strong><i><b style={{ width: '92%' }} /></i></div>
            <div><span>Project depth</span><strong>84%</strong><i><b style={{ width: '84%' }} /></i></div>
            <div><span>Engineering rigor</span><strong>79%</strong><i><b style={{ width: '79%' }} /></i></div>
            <div><span>Role alignment</span><strong>91%</strong><i><b style={{ width: '91%' }} /></i></div>
          </div>
          <div className="career-progress-note"><CheckCircle2 size={15} /> Evidence confidence remains high.</div>
        </aside>
      </section>

      <section className="career-panel career-timeline-panel">
        <div className="career-panel-heading"><div><span className="career-panel-kicker">Verification log</span><h2>Achievements & completed work</h2></div><Badge tone="neutral">6 verified events</Badge></div>
        <Timeline />
      </section>
    </div>
  )
}
