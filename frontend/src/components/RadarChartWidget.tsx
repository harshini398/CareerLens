import {
  Legend, PolarAngleAxis, PolarGrid,
  Radar, RadarChart, ResponsiveContainer, Tooltip,
} from 'recharts'

export interface RadarDataPoint {
  skill: string
  evidence: number
  required: number
}

export const defaultRadarSkills: RadarDataPoint[] = [
  { skill: 'Docker', evidence: 35, required: 70 },
  { skill: 'Testing', evidence: 45, required: 80 },
  { skill: 'Python', evidence: 90, required: 85 },
  { skill: 'SQL', evidence: 75, required: 75 },
  { skill: 'REST APIs', evidence: 85, required: 80 },
  { skill: 'Cloud Deployment', evidence: 40, required: 65 },
]

interface RadarChartWidgetProps {
  data?: RadarDataPoint[]
  heightClass?: string
  showLegend?: boolean
}

export function RadarChartWidget({
  data = defaultRadarSkills,
  heightClass = 'h-80',
  showLegend = true,
}: RadarChartWidgetProps) {
  return (
    <div className={`radar-chart-container ${heightClass}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }}
          />
          <Radar
            name="Your Evidence"
            dataKey="evidence"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Role Threshold"
            dataKey="required"
            stroke="#f43f5e"
            fill="#f43f5e"
            fillOpacity={0.15}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
          {showLegend && (
            <Legend
              align="right"
              verticalAlign="top"
              wrapperStyle={{ fontSize: '11px', color: '#cbd5e1', paddingTop: '0px' }}
            />
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            }}
            itemStyle={{ color: '#f8fafc' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
