export default function Button({ children, variant = 'primary', size = 'medium', loading = false, ...props }) {
  return (
    <button className={`career-button career-button-${variant} career-button-${size}`} disabled={loading || props.disabled} {...props}>
      {loading && <span className="career-button-spinner" aria-hidden="true" />}
      {children}
    </button>
  )
}
