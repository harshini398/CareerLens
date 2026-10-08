import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { week: 'W1', readiness: 58, target: 65 },
  { week: 'W2', readiness: 63, target: 68 },
  { week: 'W3', readiness: 68, target: 72 },
  { week: 'W4', readiness: 75, target: 76 },
  { week: 'W5', readiness: 81, target: 80 },
  { week: 'W6', readiness: 86, target: 84 },
]

export default function ProgressChart({ mode = '30d' }) {
  return (
    <div className="career-progress-chart h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 18, right: 14, bottom: 4, left: -18 }}>
          <defs>
            <linearGradient id="readinessGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#334155" strokeDasharray="3 4" vertical={false} />
          <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
          <YAxis domain={[40, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
          <Area type="monotone" dataKey="target" name="Target" stroke="#f43f5e" strokeWidth={1.5} fill="transparent" dasharray="5 5" />
          <Area type="monotone" dataKey="readiness" name="Readiness" stroke="#10b981" strokeWidth={2.5} fill="url(#readinessGradient)" />
        </AreaChart>
      </ResponsiveContainer>
      <span className="sr-only">{mode} readiness progression chart</span>
    </div>
  )
}
