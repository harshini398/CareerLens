import { createContext, useContext } from 'react'
import type { AnalysisResult } from './types'
import type { ProfileInput } from './services/api'

export type AnalysisState = 'idle' | 'running' | 'complete' | 'failed'

export type CareerLensContextValue = {
  analysis: AnalysisResult
  setAnalysis: (analysis: AnalysisResult) => void
  analysisState: AnalysisState
  analysisError: string
  runAnalysis: (input: ProfileInput) => Promise<void>
}

export const CareerLensContext = createContext<CareerLensContextValue | null>(null)

export function useCareerLens() {
  const value = useContext(CareerLensContext)
  if (!value) throw new Error('CareerLens context is missing.')
  return value
}