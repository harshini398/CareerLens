export default function Badge({ children, tone = 'neutral', dot = false, className = '' }) {
  return (
    <span className={`career-badge career-badge-${tone} ${className}`}>
      {dot && <span className="career-badge-dot" aria-hidden="true" />}
      {children}
    </span>
  )
}
