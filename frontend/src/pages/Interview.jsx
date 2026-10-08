import { useState } from 'react'
import { AudioLines, Bot, Check, Code2, Mic, MicOff, Paperclip, Send, Sparkles, UserRound, Volume2 } from 'lucide-react'
import ChatMessage from '../components/ChatMessage'

const initialMessages = [
  { role: 'ai', content: 'Welcome, Maya. Let’s review the backend architecture you shipped and how you verified it.', timestamp: '10:22' },
  { role: 'candidate', content: 'I designed the API around JWT authentication, request validation, and asynchronous PostgreSQL queries.', timestamp: '10:23' },
  { role: 'ai', content: 'Can you walk me through the trade-offs behind your database indexing strategy?', timestamp: '10:24' },
]

export default function Interview() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)

  const send = (event) => {
    event.preventDefault()
    if (!input.trim()) return
    setMessages([...messages, { role: 'candidate', content: input, timestamp: 'Now' }])
    setInput('')
  }

  return (
    <div className="career-page career-interview-page">
      <header className="career-page-header career-interview-header">
        <div><span className="career-eyebrow">Live evaluation</span><h1>Structured interview</h1><p>Target skill: Cloud Deployment · 08:42 elapsed</p></div>
        <div className="career-interview-status"><span className="career-live-dot" /> Interview in progress</div>
      </header>

      <section className="career-interview-layout">
        <aside className="career-panel career-interview-context">
          <div className="career-context-title"><span><Sparkles size={15} /></span><div><small>Interview context</small><strong>Candidate profile</strong></div></div>
          <div className="career-context-candidate"><div className="career-context-avatar">MC</div><div><strong>Maya Chen</strong><span>Senior Backend Engineer</span></div></div>
          <dl>
            <div><dt>Current topic</dt><dd>Cloud deployment</dd></div>
            <div><dt>Target skill</dt><dd>Docker & ECS</dd></div>
            <div><dt>Resume match</dt><dd>84% verified</dd></div>
            <div><dt>Evidence quality</dt><dd>High</dd></div>
          </dl>
          <div className="career-context-scores"><span>Communication</span><b>88</b><i><em style={{ width: '88%' }} /></i><span>Technical depth</span><b>81</b><i><em style={{ width: '81%' }} /></i></div>
        </aside>

        <article className="career-panel career-interview-feed">
          <div className="career-chat-feed">
            <div className="career-chat-date"><span>Interview round · Question 4 of 8</span></div>
            {messages.map((message, index) => <ChatMessage key={`${message.role}-${index}`} {...message} />)}
            <div className="career-chat-typing"><span /><span /><span /></div>
          </div>
          <form className="career-chat-composer" onSubmit={send}>
            <div className="career-chat-input-wrap">
              <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') send(event) }} placeholder="Respond to the interviewer..." rows="1" />
              <div className="career-chat-controls"><button type="button" aria-label="Audio input" className={listening ? 'is-active' : ''} onClick={() => setListening(!listening)}>{listening ? <MicOff size={17} /> : <Mic size={17} />}</button><button type="button" aria-label="Attach code"><Paperclip size={17} /></button><button type="button" aria-label="Code upload"><Code2 size={17} /></button><span><AudioLines size={14} /> Cmd + Enter</span><button type="submit" className="career-send-button" aria-label="Send message"><Send size={16} /></button></div>
            </div>
          </form>
        </article>
      </section>
    </div>
  )
}
