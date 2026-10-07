export type EvidenceStatus = 'verified' | 'partial' | 'unsupported' | 'unavailable'

export type SkillEvidence = {
  id: string
  skill: string
  claimedLevel: string
  evidenceSummary: string
  strength: number | null
  status: EvidenceStatus
  readinessImpact: number | null
  explanation: string
  action: string
  signals: string[]
  repositories: { name: string; url: string; description: string }[]
}

export type ReadinessBreakdown = {
  technical: number
  projects: number
  consistency: number
  engineering: number
  documentation: number
  roleAlignment: number
}

export type RoleFit = {
  role: string
  score: number
  summary: string
}

export type SkillGap = {
  skill: string
  current: number
  required: number
  gap: number
  priority: 'high' | 'medium' | 'low'
  weight: number
  evidenceNote: string
}

export type RoadmapWeek = {
  week: number
  goal: string
  deliverable: string
  tasks: { id: string; label: string; resource: string; done: boolean }[]
}

export type AnalysisResult = {
  candidate: { id: string; name: string; targetRole: string; githubUsername: string }
  readiness: { score: number; confidence: number; breakdown: ReadinessBreakdown }
  claims: SkillEvidence[]
  roles: RoleFit[]
  gaps: SkillGap[]
  roadmap: RoadmapWeek[]
  explanation: { positives: string[]; improvements: string[]; recommendation: string }
  metrics: { repositories: number; signals: number; verifiedSkills: number; majorGaps: number }
}

export type WhatIfResult = {
  currentScore: number
  projectedScore: number
  delta: number
  reasons: { factor: string; impact: number }[]
}