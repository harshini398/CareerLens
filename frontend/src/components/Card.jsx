export default function Card({ children, className = '', title, subtitle, action, elevated = false }) {
  return (
    <section className={`career-card ${elevated ? 'career-card-elevated' : ''} ${className}`}>
      {(title || subtitle || action) && (
        <header className="career-card-header">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="career-card-body">{children}</div>
    </section>
  )
}
