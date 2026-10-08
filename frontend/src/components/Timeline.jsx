import { CheckCircle2, CircleDot, GitCommit, Server, TestTube2 } from 'lucide-react'

const items = [
  { title: 'Dockerized FastAPI service', detail: 'Added production container and deployment workflow.', icon: Server, time: 'Yesterday', tone: 'green' },
  { title: '92% pytest coverage', detail: 'Integrated API, database, and pagination tests.', icon: TestTube2, time: '3 days ago', tone: 'green' },
  { title: 'PostgreSQL performance update', detail: 'Applied composite indexes and query optimization.', icon: GitCommit, time: '1 week ago', tone: 'blue' },
  { title: 'REST API verification', detail: 'Validated authentication and request schemas.', icon: CircleDot, time: '2 weeks ago', tone: 'amber' },
]

export default function Timeline({ compact = false }) {
  return (
    <div className={compact ? 'career-timeline career-timeline-compact' : 'career-timeline'}>
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <article className="career-timeline-item" key={item.title}>
            <div className={`career-timeline-marker career-timeline-${item.tone}`}><Icon size={14} /></div>
            <div className="career-timeline-content">
              <div className="career-timeline-heading"><strong>{item.title}</strong><span>{item.time}</span></div>
              <p>{item.detail}</p>
              {index === 0 && <span className="career-timeline-verified"><CheckCircle2 size={13} /> Verified achievement</span>}
            </div>
          </article>
        )
      })}
    </div>
  )
}
