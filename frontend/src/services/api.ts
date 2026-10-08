import { demoAnalysis, demoWhatIf } from '../data/demo'
import type { AnalysisResult, SkillGap, WhatIfResult } from '../types'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')) || 'http://127.0.0.1:8000'

export type ProfileInput = {
  resume?: File
  github: string
  portfolio?: string
  linkedinText?: string
  linkedinFile?: File
  targetRole: string
  name?: string
  email?: string
  demoMode?: boolean
}

export type CandidateRegistration = {
  id?: string
  name?: string
  email?: string
  target_role: string
}

export type PipelineStatusResponse = {
  candidate_id: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  steps: {
    resume_parsed?: boolean
    github_analyzed?: boolean
    claims_verified?: boolean
    score_calculated?: boolean
    roadmap_generated?: boolean
  }
}

export type MockAnalysisResponse = {
  candidate: {
    id: string
    name: string
    target_role: string
  }
  readiness: {
    score: number
    confidence: number
    breakdown: {
      technical: number
      projects: number
      consistency: number
      engineering: number
      documentation: number
      role_alignment: number
    }
  }
  role_fit: Array<{ role: string; score: number }>
  skill_gaps: Array<{
    skill: string
    current: number
    required: number
    gap: number
    priority: 'high' | 'medium' | 'low'
  }>
  roadmap: Array<{
    week: number
    goal: string
    tasks: string[]
  }>
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, options)
  } catch {
    throw new Error('CareerLens could not reach the backend service at ' + apiBaseUrl + '. Please ensure your backend is running.')
  }
  if (!response.ok) throw new Error(`CareerLens request failed (${response.status} ${response.statusText})`)
  try {
    return await response.json() as T
  } catch {
    throw new Error('CareerLens received an invalid response format from backend.')
  }
}

const wait = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

// 1. Register a Candidate (POST /api/candidates)
export async function registerCandidate(candidate: CandidateRegistration) {
  return request<{ id: string; name: string; email: string; target_role: string }>('/api/candidates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: candidate.id || 'C001',
      name: candidate.name || 'Pooja Sriram',
      email: candidate.email || 'alex@example.com',
      target_role: candidate.target_role,
    }),
  })
}

// 2. Get Candidate Details (GET /api/candidates/{candidate_id})
export async function getCandidateDetails(candidateId: string) {
  return request<{ id: string; name: string; email: string; target_role: string; created_at: string }>(
    `/api/candidates/${candidateId}`
  )
}

// 3. Trigger Full Analysis Pipeline (POST /api/candidates/{candidate_id}/analyze)
export async function triggerCandidateAnalysis(candidateId: string) {
  return request<{
    status: string
    message: string
    candidate: { id: string; name: string; target_role: string }
    analysis: {
      readiness_score: number
      confidence_score: number
      claims_extracted: number
      repositories_analyzed: number
      top_role_fit: string
    }
  }>(`/api/candidates/${candidateId}/analyze`, { method: 'POST' })
}

// 4. Check Pipeline Progress Status (GET /api/candidates/{candidate_id}/status)
export async function fetchPipelineStatus(candidateId: string): Promise<PipelineStatusResponse> {
  return request<PipelineStatusResponse>(`/api/candidates/${candidateId}/status`)
}

// 5. Fetch Full Dashboard Data (GET /api/candidates/{candidate_id}/analysis)
export async function fetchCandidateAnalysis(candidateId: string = 'C001'): Promise<MockAnalysisResponse> {
  try {
    const data = await request<MockAnalysisResponse>(`/api/candidates/${candidateId}/analysis`)
    console.log('Loaded Mock Analysis:', data)
    return data
  } catch (error) {
    console.error('Failed to connect to backend:', error)
    throw error
  }
}

export async function analyzeProfile(input: ProfileInput): Promise<AnalysisResult> {
  if (input.demoMode) {
    await wait(1800)
    return {
      ...demoAnalysis,
      candidate: { ...demoAnalysis.candidate, targetRole: input.targetRole, githubUsername: normalizeGithub(input.github) },
    }
  }

  let candidateId = 'C001'
  try {
    const regRes = await registerCandidate({
      id: 'C001',
      name: input.name || 'Pooja Sriram',
      email: input.email || 'alex@example.com',
      target_role: input.targetRole,
    })
    candidateId = regRes.id || 'C001'
  } catch (err) {
    console.warn('Registration step warning:', err)
  }

  try {
    await triggerCandidateAnalysis(candidateId)
  } catch (err) {
    console.warn('Trigger analysis warning:', err)
  }

  const rawAnalysis = await fetchCandidateAnalysis(candidateId)
  return normalizeAnalysis(rawAnalysis, candidateId, input)
}

export async function getWhatIf(changes: string[], candidateId = demoAnalysis.candidate.id): Promise<WhatIfResult> {
  if (!apiBaseUrl) {
    await wait(220)
    const factorIds: Record<string, string> = {
      'Docker evidence': 'docker',
      'Automated testing': 'tests',
      'Cloud deployment': 'deploy',
    }
    const selected = demoWhatIf.reasons.filter((reason) => changes.includes(factorIds[reason.factor]))
    const delta = selected.reduce((total, reason) => total + reason.impact, 0)
    return { currentScore: demoWhatIf.currentScore, projectedScore: demoWhatIf.currentScore + delta, delta, reasons: selected }
  }

  const actionIds: Record<string, string> = { docker: 'learn_docker', tests: 'add_tests', deploy: 'deploy_project' }
  const result = await request<unknown>('/api/what-if', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidate_id: candidateId, changes: changes.map((change) => actionIds[change] ?? change) }),
  })
  const data = asRecord(result)
  return {
    currentScore: numberValue(data.currentScore ?? data.current_score, demoAnalysis.readiness.score),
    projectedScore: numberValue(data.projectedScore ?? data.projected_score, demoAnalysis.readiness.score),
    delta: numberValue(data.delta, 0),
    reasons: arrayValue(data.reasons).map((reason) => {
      const item = asRecord(reason)
      return { factor: stringValue(item.factor, stringValue(item.label, 'Evidence improvement')), impact: numberValue(item.impact, 0) }
    }),
  }
}

export function normalizeGithub(value: string): string {
  return value.trim().replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/\/$/, '').split('/')[0]
}

function normalizeAnalysis(value: unknown, candidateId: string, input: ProfileInput): AnalysisResult {
  const data = asRecord(value)
  const candidate = asRecord(data.candidate)
  const readiness = asRecord(data.readiness)
  const rawBreakdown = asRecord(readiness.breakdown ?? data.breakdown)
  const rawClaims = arrayValue(data.claims)
  const evidence = arrayValue(data.evidence)
  const verifications = arrayValue(data.verification ?? data.verifications)
  
  const claims = rawClaims.length > 0 ? rawClaims.map((rawClaim, index) => {
    const claim = asRecord(rawClaim)
    const id = stringValue(claim.id ?? claim.claim_id, `claim-${index + 1}`)
    const skill = stringValue(claim.skill ?? claim.name, 'Skill')
    const relatedEvidence = evidence.filter((rawEvidence) => {
      const item = asRecord(rawEvidence)
      return stringValue(item.claim_id ?? item.claimId, '') === id || stringValue(item.skill, '') === skill
    }).map(asRecord)
    const verification = verifications.map(asRecord).find((item) => stringValue(item.claim_id ?? item.claimId, '') === id)
    const firstEvidence = relatedEvidence[0] ?? {}
    const status = normalizeStatus(verification?.status ?? claim.status ?? firstEvidence.status)
    const rawStrength = verification?.evidence_strength ?? verification?.evidenceStrength ?? claim.strength ?? claim.evidence_strength ?? firstEvidence.strength
    const repositories = relatedEvidence.map((item) => ({
      name: stringValue(item.repository ?? item.repository_name, 'Repository'),
      url: stringValue(item.url, ''),
      description: stringValue(item.description ?? item.evidence, 'Evidence source from analyzed project.'),
    }))
    const signals = relatedEvidence.flatMap((item) => arrayValue(item.signals).map((signal) => stringValue(signal, ''))).filter(Boolean)
    if (firstEvidence.description && signals.length === 0) signals.push(stringValue(firstEvidence.description, ''))
    const explanation = stringValue(verification?.reason ?? claim.reason ?? claim.explanation, '')
    return {
      id,
      skill,
      claimedLevel: stringValue(claim.claimed_level ?? claim.claimedLevel, 'Claimed'),
      evidenceSummary: stringValue(claim.evidence_summary ?? claim.evidenceSummary, relatedEvidence.length ? `${relatedEvidence.length} evidence source${relatedEvidence.length === 1 ? '' : 's'}` : status === 'unavailable' ? 'Evidence unavailable' : 'No supporting evidence found'),
      strength: status === 'unavailable' || rawStrength === null || rawStrength === undefined ? null : numberValue(rawStrength, 0),
      status,
      readinessImpact: claim.readiness_impact === null || claim.readinessImpact === null ? null : numberValue(claim.readiness_impact ?? claim.readinessImpact, 0),
      explanation: explanation || (status === 'unavailable' ? 'Evidence could not be collected from the connected source.' : 'The available analysis did not include a detailed verification explanation.'),
      action: stringValue(claim.action ?? claim.recommended_action, status === 'unavailable' ? 'Reconnect the source and run this analysis again.' : 'Add a project that demonstrates this skill and link it from your profile.'),
      signals,
      repositories,
    }
  }) : demoAnalysis.claims

  const rawRoles = arrayValue(data.roles ?? data.role_fit)
  const roles = rawRoles.map((rawRole) => {
    const role = asRecord(rawRole)
    return {
      role: stringValue(role.role ?? role.name, 'Role'),
      score: numberValue(role.score ?? role.fit, 0),
      summary: stringValue(role.summary ?? role.explanation, 'Role fit based on available evidence.'),
    }
  })

  const rawGaps = arrayValue(data.gaps ?? data.skill_gaps)
  const gaps = rawGaps.map((rawGap) => {
    const gap = asRecord(rawGap)
    const current = numberValue(gap.current ?? gap.candidate, 0)
    const required = numberValue(gap.required, 0)
    const priorityValue = stringValue(gap.priority, current < required - 25 ? 'high' : current < required - 10 ? 'medium' : 'low')
    const priority: SkillGap['priority'] = priorityValue === 'high' || priorityValue === 'medium' ? priorityValue : 'low'
    return {
      skill: stringValue(gap.skill, 'Skill'),
      current,
      required,
      gap: numberValue(gap.gap, current - required),
      priority,
      weight: numberValue(gap.weight, 0),
      evidenceNote: stringValue(gap.evidence_note ?? gap.evidenceNote, 'Compare available evidence with the role threshold.'),
    }
  })

  const roadmap = arrayValue(data.roadmap).map((rawWeek, index) => {
    const week = asRecord(rawWeek)
    const rawTasks = arrayValue(week.tasks)
    return {
      week: numberValue(week.week, index + 1),
      goal: stringValue(week.goal ?? week.title, 'Build role evidence'),
      deliverable: stringValue(week.deliverable, 'A project update that demonstrates the target skill.'),
      tasks: rawTasks.map((rawTask, taskIndex) => {
        if (typeof rawTask === 'string') {
          return {
            id: `week-${index + 1}-task-${taskIndex + 1}`,
            label: rawTask,
            resource: 'Project documentation',
            done: false,
          }
        }
        const task = asRecord(rawTask)
        return {
          id: stringValue(task.id, `week-${index + 1}-task-${taskIndex + 1}`),
          label: stringValue(task.label ?? task.title, 'Complete a focused project task'),
          resource: stringValue(task.resource, 'Project documentation'),
          done: Boolean(task.done ?? task.completed),
        }
      }),
    }
  })

  const rawExplanation = asRecord(data.explanation)
  const rawMetrics = asRecord(data.metrics)
  const rawScore = readiness.score ?? data.readiness_score
  const rawConfidence = readiness.confidence ?? data.confidence_score

  return {
    candidate: {
      id: stringValue(candidate.id, candidateId),
      name: stringValue(candidate.name, input.name || demoAnalysis.candidate.name),
      targetRole: stringValue(candidate.target_role ?? candidate.targetRole, input.targetRole),
      githubUsername: stringValue(candidate.github_username ?? candidate.githubUsername, normalizeGithub(input.github || '')),
    },
    readiness: {
      score: numberValue(rawScore, demoAnalysis.readiness.score),
      confidence: numberValue(rawConfidence, demoAnalysis.readiness.confidence),
      breakdown: {
        technical: numberValue(rawBreakdown.technical, 0),
        projects: numberValue(rawBreakdown.projects ?? rawBreakdown.project_quality, 0),
        consistency: numberValue(rawBreakdown.consistency ?? rawBreakdown.activity, 0),
        engineering: numberValue(rawBreakdown.engineering ?? rawBreakdown.engineering_practices, 0),
        documentation: numberValue(rawBreakdown.documentation, 0),
        roleAlignment: numberValue(rawBreakdown.role_alignment ?? rawBreakdown.roleAlignment, 0),
      },
    },
    claims,
    roles: roles.length > 0 ? roles : demoAnalysis.roles,
    gaps: gaps.length > 0 ? gaps : demoAnalysis.gaps,
    roadmap: roadmap.length > 0 ? roadmap : demoAnalysis.roadmap,
    explanation: {
      positives: arrayValue(rawExplanation.positives ?? readiness.strengths).map((item) => stringValue(item, '')),
      improvements: arrayValue(rawExplanation.improvements ?? readiness.weaknesses).map((item) => stringValue(item, '')),
      recommendation: stringValue(rawExplanation.recommendation, 'Focus on the highest-priority evidence gap for your target role.'),
    },
    metrics: {
      repositories: numberValue(rawMetrics.repositories, 0),
      signals: numberValue(rawMetrics.signals, evidence.length),
      verifiedSkills: numberValue(rawMetrics.verifiedSkills ?? rawMetrics.verified_skills, claims.filter((claim) => claim.status === 'verified').length),
      majorGaps: numberValue(rawMetrics.majorGaps ?? rawMetrics.major_gaps, gaps.filter((gap) => gap.priority === 'high').length),
    },
  }
}

function normalizeStatus(value: unknown): AnalysisResult['claims'][number]['status'] {
  const status = stringValue(value, '').toLowerCase()
  if (status === 'verified') return 'verified'
  if (status === 'partial') return 'partial'
  if (status === 'unsupported') return 'unsupported'
  if (status === 'unavailable' || status === 'error') return 'unavailable'
  return 'unavailable'
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
}

function arrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function stringValue(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

function numberValue(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}