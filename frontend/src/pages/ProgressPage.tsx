import { useState } from 'react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import {
  Activity, Award, BadgeCheck, CheckCircle2, ShieldCheck, TrendingUp, Zap,
} from 'lucide-react'
import { PageTitle, SmallMetric } from '../components/Layout'
import { useCareerLens } from '../context'

interface ProgressDataPoint {
  day: string
  readiness: number
  target: number
}

const data30Days: ProgressDataPoint[] = [
  { day: 'W1', readiness: 52, target: 70 },
  { day: 'W2', readiness: 58, target: 70 },
  { day: 'W3', readiness: 64, target: 72 },
  { day: 'W4', readiness: 71, target: 75 },
  { day: 'W5', readiness: 78, target: 78 },
  { day: 'W6', readiness: 82, target: 80 },
]

const data60Days: ProgressDataPoint[] = [
  { day: 'W1', readiness: 45, target: 65 },
  { day: 'W3', readiness: 52, target: 68 },
  { day: 'W5', readiness: 61, target: 72 },
  { day: 'W7', readiness: 70, target: 75 },
  { day: 'W9', readiness: 78, target: 78 },
  { day: 'W11', readiness: 84, target: 80 },
]

const data90Days: ProgressDataPoint[] = [
  { day: 'M1', readiness: 38, target: 60 },
  { day: 'M1.5', readiness: 48, target: 65 },
  { day: 'M2', readiness: 62, target: 72 },
  { day: 'M2.5', readiness: 74, target: 76 },
  { day: 'M3', readiness: 86, target: 80 },
]

interface TimelineItem {
  id: string
  week: string
  date: string
  title: string
  detail: string
  points: number
  verifiedSkill: string
  category: 'code' | 'infra' | 'testing' | 'db'
}

const timelineLog: TimelineItem[] = [
  {
    id: 't1',
    week: 'Week 6',
    date: 'Yesterday',
    title: 'Deployed Dockerized FastAPI Service to AWS ECS',
    detail: 'Configured GitHub Actions CI/CD workflow with automatic container registry pushes and zero-downtime rolling updates.',
    points: 8,
    verifiedSkill: 'Cloud Deployment',
    category: 'infra',
  },
  {
    id: 't2',
    week: 'Week 5',
    date: '3 days ago',
    title: 'Achieved 92% Test Coverage with Pytest Integration Suite',
    detail: 'Added async HTTP test client, fixture mocks, and database transactional test rollbacks for job application endpoints.',
    points: 6,
    verifiedSkill: 'Testing',
    category: 'testing',
  },
  {
    id: 't3',
    week: 'Week 4',
    date: '1 week ago',
    title: 'Optimized PostgreSQL Indexing & Connection Pooling',
    detail: 'Refactored slow N+1 query patterns using SQLAlchemy async session joins and added composite indexes on applicant IDs.',
    points: 7,
    verifiedSkill: 'SQL & Database',
    category: 'db',
  },
  {
    id: 't4',
    week: 'Week 2',
    date: '2 weeks ago',
    title: 'Architected RESTful OpenAPI Specification & Auth Middleware',
    detail: 'Implemented JWT bearer token authentication, request validation schemas, and rate-limiting headers.',
    points: 9,
    verifiedSkill: 'REST APIs',
    category: 'code',
  },
  {
    id: 't5',
    week: 'Week 1',
    date: '3 weeks ago',
    title: 'Connected GitHub Repository & Initial Profile Ingestion',
    detail: 'Scanned 14 public repos to parse commit frequency, language distribution, and repository documentation standards.',
    points: 52,
    verifiedSkill: 'Initial Baseline',
    category: 'code',
  },
]

export function ProgressPage() {
  const { analysis } = useCareerLens()
  const [range, setRange] = useState<'30' | '60' | '90'>('30')

  const chartData = range === '30' ? data30Days : range === '60' ? data60Days : data90Days
  const candidateName = analysis?.candidate?.name || 'Pooja Sriram'

  return (
    <div className="page-stack progress-page">
      <PageTitle
        label="LONGITUDINAL READINESS ANALYTICS"
        title="Progress over time."
        detail={`Track how ${candidateName}'s verified skills and repository evidence advance against role thresholds.`}
        action={
          <div className="range-toggle-group">
            <button
              className={`toggle-btn ${range === '30' ? 'active' : ''}`}
              onClick={() => setRange('30')}
            >
              30 Days
            </button>
            <button
              className={`toggle-btn ${range === '60' ? 'active' : ''}`}
              onClick={() => setRange('60')}
            >
              60 Days
            </button>
            <button
              className={`toggle-btn ${range === '90' ? 'active' : ''}`}
              onClick={() => setRange('90')}
            >
              90 Days
            </button>
          </div>
        }
      />

      {/* Top Metrics Row */}
      <section className="metrics-grid-4">
        <SmallMetric
          label="Initial Readiness"
          value="52%"
          note="Day 1 Baseline"
          icon={Activity}
        />
        <SmallMetric
          label="Current Readiness"
          value="82%"
          note="Verified Baseline (+30 pts)"
          icon={TrendingUp}
        />
        <SmallMetric
          label="Total Verified Skills"
          value="14"
          note="Supported by repo evidence"
          icon={BadgeCheck}
        />
        <div className="small-metric velocity-card">
          <span className="metric-icon">
            <Zap size={17} className="text-yellow" />
          </span>
          <div>
            <span className="metric-label">Weekly Velocity</span>
            <div className="velocity-val-row">
              <strong>+4.2%/wk</strong>
              <span className="velocity-badge">+4.2%/week</span>
            </div>
            <small>Optimal progress trajectory</small>
          </div>
        </div>
      </section>

      {/* Main Area Chart Container */}
      <section className="panel progress-chart-panel">
        <div className="panel-heading-row">
          <div>
            <span className="panel-kicker">READINESS TRAJECTORY ({range}-DAY HORIZON)</span>
            <h3>Week-by-week evidence progression</h3>
          </div>
          <div className="chart-legend-row">
            <span className="legend-item">
              <span className="dot dot-green" /> Candidate Readiness
            </span>
            <span className="legend-item">
              <span className="dot dot-coral" /> Role Threshold Target
            </span>
          </div>
        </div>

        <div className="main-chart-wrapper h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                }}
              />
              <Area
                type="monotone"
                dataKey="readiness"
                name="Candidate Readiness"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorReadiness)"
              />
              <Area
                type="monotone"
                dataKey="target"
                name="Target Threshold"
                stroke="#f43f5e"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorTarget)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Vertical Timeline Log */}
      <section className="panel timeline-panel">
        <div className="panel-heading-row">
          <div>
            <span className="panel-kicker">VERIFIED ACHIEVEMENTS & COMMIT LOG</span>
            <h3>Timeline of completed proof milestones</h3>
          </div>
          <span className="timeline-count">{timelineLog.length} milestones verified</span>
        </div>

        <div className="vertical-timeline">
          {timelineLog.map((item, index) => (
            <div className="timeline-node-item" key={item.id}>
              <div className="timeline-left">
                <span className="timeline-badge-date">{item.week}</span>
                <span className="timeline-subdate">{item.date}</span>
              </div>
              <div className="timeline-marker">
                <span className="marker-circle">
                  <CheckCircle2 size={16} className="text-green" />
                </span>
                {index < timelineLog.length - 1 && <span className="marker-line" />}
              </div>
              <div className="timeline-content-card">
                <div className="card-top">
                  <h4>{item.title}</h4>
                  <span className="pts-pill">+{item.points} pts</span>
                </div>
                <p>{item.detail}</p>
                <div className="card-footer-tags">
                  <span className="skill-tag">
                    <Award size={12} /> Verified Skill: {item.verifiedSkill}
                  </span>
                  <span className="proven-tag">
                    <ShieldCheck size={12} /> Checked by GitHub Pipeline
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
