import { Bot, UserRound } from 'lucide-react'

export default function ChatMessage({ role = 'ai', content, timestamp }) {
  const isAi = role === 'ai'
  return (
    <div className={`career-chat-message career-chat-${isAi ? 'ai' : 'candidate'}`}>
      <div className="career-chat-avatar">{isAi ? <Bot size={15} /> : <UserRound size={15} />}</div>
      <div className="career-chat-bubble">
        <div className="career-chat-meta"><strong>{isAi ? 'Interviewer AI' : 'Candidate'}</strong><span>{timestamp}</span></div>
        <p>{content}</p>
      </div>
    </div>
  )
}
