import { Radar, RadarChart as RechartsRadarChart, PolarAngleAxis, PolarGrid, ResponsiveContainer, Tooltip } from 'recharts'

const skills = [
  { name: 'Docker', value: 76 },
  { name: 'Testing', value: 82 },
  { name: 'Python', value: 90 },
  { name: 'SQL', value: 68 },
  { name: 'REST APIs', value: 84 },
  { name: 'Cloud Deployment', value: 70 },
]

const threshold = [
  { name: 'Docker', value: 70 },
  { name: 'Testing', value: 75 },
  { name: 'Python', value: 80 },
  { name: 'SQL', value: 72 },
  { name: 'REST APIs', value: 80 },
  { name: 'Cloud Deployment', value: 65 },
]

export default function RadarChart({ data = skills, thresholdData = threshold, className = '' }) {
  const chartData = data.map((item, index) => ({
    ...item,
    threshold: thresholdData[index]?.value ?? 0,
  }))

  return (
    <div className={`career-radar h-80 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={chartData} margin={{ top: 28, right: 38, bottom: 8, left: 8 }}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Radar
            name="Your Evidence"
            dataKey="value"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Role Threshold"
            dataKey="threshold"
            stroke="#f43f5e"
            fill="#f43f5e"
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
          <Tooltip
            cursor={false}
            contentStyle={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: 8,
              color: '#e2e8f0',
              fontSize: 12,
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
