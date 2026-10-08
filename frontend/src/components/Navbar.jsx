import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar({ brand = 'CareerLens', links = [] }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="career-nav">
      <a className="career-brand" href="#top" aria-label={`${brand} home`}>
        <span className="career-brand-mark">CL</span>
        <span>{brand}</span>
      </a>
      <button
        className="career-nav-toggle"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
      <nav className={menuOpen ? 'career-nav-links is-open' : 'career-nav-links'}>
        {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        <a className="career-nav-cta" href="#analyze">Get started</a>
      </nav>
    </header>
  )
}
