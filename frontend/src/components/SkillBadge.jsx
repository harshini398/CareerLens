import Badge from './Badge'

export default function SkillBadge({ skill, priority = 'Medium', score = 82 }) {
  return (
    <div className="career-skill-badge">
      <span>{skill}</span>
      <Badge tone={priority.toLowerCase()}>{priority} priority</Badge>
      <small>{score}% evidence</small>
    </div>
  )
}
