import { useState } from 'react'
import {
  Bot, Code2, CornerDownLeft, Mic, MicOff, Send,
  ShieldCheck, Sparkles, Target, User,
} from 'lucide-react'
import { PageTitle } from '../components/Layout'
import { useCareerLens } from '../context'

interface ChatMessage {
  id: string
  sender: 'ai' | 'candidate'
  senderName: string
  text: string
  timestamp: string
  codeSnippet?: string
}

export function InterviewChatPage() {
  const { analysis } = useCareerLens()
  const candidateName = analysis?.candidate?.name || 'Pooja Sriram'
  const targetRole = analysis?.candidate?.targetRole || 'Backend Developer'

  const [inputVal, setInputVal] = useState('')
  const [isAudioActive, setIsAudioActive] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      senderName: 'CareerLens AI Interviewer',
      timestamp: '10:14 AM',
      text: `Hello ${candidateName}! Welcome to your technical evidence evaluation for the ${targetRole} role. We will focus on containerization and backend resilience.`,
    },
    {
      id: 'm2',
      sender: 'ai',
      senderName: 'CareerLens AI Interviewer',
      timestamp: '10:15 AM',
      text: 'To begin: In your fastapi-job-board repository, how did you structure the Dockerfile multi-stage build to keep production images lean while including pytest dependencies during testing?',
    },
    {
      id: 'm3',
      sender: 'candidate',
      senderName: candidateName,
      timestamp: '10:16 AM',
      text: 'I used a 2-stage Docker build starting from python:3.11-slim as builder, installing poetry requirements in a virtualenv, and then copying only the clean virtualenv and app code into the final runtime stage.',
      codeSnippet: `FROM python:3.11-slim AS builder
WORKDIR /app
RUN pip install poetry
COPY pyproject.toml poetry.lock ./
RUN poetry export -f requirements.txt --output requirements.txt

FROM python:3.11-slim AS runner
WORKDIR /app
COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`,
    },
    {
      id: 'm4',
      sender: 'ai',
      senderName: 'CareerLens AI Interviewer',
      timestamp: '10:17 AM',
      text: 'Excellent use of multi-stage caching! Next, how do you handle database migration readiness and container health checks in your Compose configuration before binding the API service?',
    },
  ])

  const handleSend = () => {
    if (!inputVal.trim()) return
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'candidate',
      senderName: candidateName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputVal,
    }
    setMessages((prev) => [...prev, newMsg])
    setInputVal('')

    // Simulated AI response
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        senderName: 'CareerLens AI Interviewer',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'That directly aligns with robust production standards! I have logged this verified response under Docker & Microservices Architecture.',
      }
      setMessages((prev) => [...prev, aiReply])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  const handleUploadCode = () => {
    setInputVal((prev) => prev + '\n```python\n# Add your code snippet here\ndef health_check():\n    return {"status": "ok"}\n```')
  }

  return (
    <div className="page-stack interview-chat-page">
      <PageTitle
        label="AI TECHNICAL INTERVIEW EVALUATOR"
        title="Interactive evidence chat."
        detail="Engage in dynamic, scenario-based technical evaluations to verify hands-on execution and architectural depth."
      />

      {/* Main 3-Column / Layout Structure */}
      <section className="interview-layout-container">
        {/* Left Context Sidebar */}
        <aside className="panel interview-sidebar">
          <div className="sidebar-section">
            <span className="panel-kicker">CANDIDATE PROFILE</span>
            <div className="candidate-info-card">
              <div className="c-avatar">{candidateName.slice(0, 2)}</div>
              <div>
                <strong>{candidateName}</strong>
                <span>{targetRole}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-section">
            <span className="panel-kicker">CURRENT EVALUATION TOPIC</span>
            <div className="topic-card">
              <Sparkles size={16} className="text-yellow" />
              <div>
                <strong>Docker & Microservices Architecture</strong>
                <small>Container orchestration & health checks</small>
              </div>
            </div>
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-section">
            <span className="panel-kicker">TARGET SKILL UNDER EVALUATION</span>
            <div className="skill-card">
              <Target size={16} className="text-green" />
              <div>
                <strong>Containerizing REST APIs</strong>
                <span className="skill-tag-pill">Docker · High Priority Gap</span>
              </div>
            </div>
          </div>

          <div className="sidebar-spacer" />

          <div className="fairness-note">
            <ShieldCheck size={15} />
            <p>
              <strong>Live Verification</strong> Responses are cross-referenced with your GitHub project evidence.
            </p>
          </div>
        </aside>

        {/* Middle Chat Feed & Bottom Bar */}
        <main className="panel interview-chat-feed-panel">
          {/* Chat Header */}
          <div className="chat-feed-header">
            <div className="header-left">
              <Bot size={18} className="text-yellow" />
              <div>
                <strong>AI Technical Assessor</strong>
                <span>Evaluating Docker & API Resilience</span>
              </div>
            </div>
            <div className="header-status">
              <span className="online-dot" /> LIVE SESSION
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="chat-messages-container">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${msg.sender === 'ai' ? 'ai-bubble-row' : 'candidate-bubble-row'}`}
              >
                <div className="bubble-avatar">
                  {msg.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="bubble-content-wrap">
                  <div className="bubble-top-meta">
                    <strong>{msg.senderName}</strong>
                    <span className="timestamp">{msg.timestamp}</span>
                  </div>
                  <div className="bubble-text">
                    <p>{msg.text}</p>
                    {msg.codeSnippet && (
                      <pre className="code-snippet-box">
                        <code>{msg.codeSnippet}</code>
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fixed Bottom Input Bar */}
          <div className="chat-bottom-input-bar">
            <div className="input-toolbar">
              <button
                type="button"
                className={`toolbar-btn ${isAudioActive ? 'audio-active' : ''}`}
                onClick={() => setIsAudioActive(!isAudioActive)}
                title={isAudioActive ? 'Mute Microphone' : 'Enable Audio Input'}
              >
                {isAudioActive ? <Mic size={16} className="text-coral" /> : <MicOff size={16} />}
                <span>{isAudioActive ? 'Listening...' : 'Audio Toggle'}</span>
              </button>

              <button
                type="button"
                className="toolbar-btn"
                onClick={handleUploadCode}
                title="Attach Code Snippet"
              >
                <Code2 size={16} />
                <span>Add Code</span>
              </button>
            </div>

            <div className="textarea-send-row">
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your technical response or explanation..."
                rows={2}
                className="chat-textarea"
              />
              <div className="send-actions">
                <span className="shortcut-label">
                  <CornerDownLeft size={11} /> Cmd + Enter
                </span>
                <button
                  type="button"
                  className="button button-dark button-small"
                  onClick={handleSend}
                >
                  <Send size={14} />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  )
}
