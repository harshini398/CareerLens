import { useState } from 'react'
import { ArrowRight, Link2, Plus, Sparkles, Trash2 } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import Navbar from '../components/Navbar'

const defaultLinks = [{ platform: 'Blog', url: '' }, { platform: 'Kaggle', url: '' }]

export default function Onboarding() {
  const [candidate, setCandidate] = useState({ name: '', role: '', linkedin: '', github: '' })
  const [links, setLinks] = useState(defaultLinks)
  const [submitted, setSubmitted] = useState(false)

  const updateLink = (index, platform, url) => {
    setLinks((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [platform]: url } : item))
  }

  const submit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="career-page career-onboarding-page" id="top">
      <Navbar links={[{ href: '#how-it-works', label: 'How it works' }, { href: '#analyze', label: 'Analyze' }]} />
      <main className="career-onboarding-main">
        <section className="career-onboarding-copy">
          <span className="career-eyebrow"><Sparkles size={13} /> Candidate intelligence, made transparent</span>
          <h1>Turn experience into<br /><em>evidence.</em></h1>
          <p>Connect candidate profiles, verify public work, and build a role-fit decision with observable proof.</p>
          <div className="career-onboarding-points">
            <span><i>01</i> Link candidate inputs</span>
            <span><i>02</i> Verify skills against evidence</span>
            <span><i>03</i> Deliver an actionable match</span>
          </div>
        </section>

        <Card className="career-onboarding-form-card" title="Analyze a candidate" subtitle="Add the public evidence that matters. Every field is optional except the candidate and target role.">
          <form id="analyze" onSubmit={submit}>
            <div className="career-form-grid">
              <label><span>Candidate name</span><input required value={candidate.name} onChange={(event) => setCandidate({ ...candidate, name: event.target.value })} placeholder="e.g. Maya Chen" /></label>
              <label><span>Target role</span><input required value={candidate.role} onChange={(event) => setCandidate({ ...candidate, role: event.target.value })} placeholder="e.g. Senior Backend Engineer" /></label>
              <label className="career-form-wide"><span>LinkedIn profile URL</span><div className="career-input-with-icon"><Link2 size={15} /><input type="url" value={candidate.linkedin} onChange={(event) => setCandidate({ ...candidate, linkedin: event.target.value })} placeholder="https://linkedin.com/in/username" /></div></label>
              <label className="career-form-wide"><span>GitHub or portfolio URL</span><div className="career-input-with-icon"><Link2 size={15} /><input type="url" value={candidate.github} onChange={(event) => setCandidate({ ...candidate, github: event.target.value })} placeholder="https://github.com/username or portfolio URL" /></div></label>
            </div>

            <div className="career-links-heading"><div><strong>Additional public links</strong><span>Optional proof sources</span></div><Button type="button" variant="secondary" size="small" onClick={() => setLinks([...links, { platform: 'LeetCode', url: '' }])}><Plus size={14} /> Add Link</Button></div>
            <div className="career-links-list">
              {links.map((link, index) => (
                <div className="career-link-row" key={`${link.platform}-${index}`}>
                  <select value={link.platform} onChange={(event) => updateLink(index, 'platform', event.target.value)}>
                    <option>Blog</option><option>Kaggle</option><option>LeetCode</option><option>Portfolio</option>
                  </select>
                  <input type="url" value={link.url} onChange={(event) => updateLink(index, 'url', event.target.value)} placeholder={`https://${link.platform.toLowerCase()}.com/...`} />
                  <button type="button" aria-label="Remove link" onClick={() => setLinks(links.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>

            <div className="career-form-footer">
              <span>Analysis uses public links and candidate-provided evidence.</span>
              <Button type="submit" size="large">Analyze Candidate <ArrowRight size={16} /></Button>
            </div>
          </form>
          {submitted && <div className="career-toast" role="status">Candidate queued for evidence analysis.</div>}
        </Card>
      </main>
    </div>
  )
}
