import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { demoAnalysis } from './data/demo'
import { CareerLensContext, type AnalysisState } from './context'
import {
  AnalysisPage, DashboardPage, EvidencePage, GapsPage, IntakePage,
  LandingPage, PlacementPage, RoadmapPage, RolesPage, WhatIfPage,
} from './pages'
import { analyzeProfile } from './services/api'
import type { AnalysisResult } from './types'
import './design.css'

function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult>(demoAnalysis)
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle')
  const [analysisError, setAnalysisError] = useState('')

  const runAnalysis = async (input: Parameters<typeof analyzeProfile>[0]) => {
    setAnalysisState('running')
    setAnalysisError('')
    try {
      setAnalysis(await analyzeProfile(input))
      setAnalysisState('complete')
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'The analysis service is unavailable.')
      setAnalysisState('failed')
    }
  }

  return (
    <CareerLensContext.Provider value={{ analysis, setAnalysis, analysisState, analysisError, runAnalysis }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/analyze" element={<Layout />}><Route index element={<IntakePage />} /></Route>
          <Route path="/analysis" element={<Layout />}><Route index element={<AnalysisPage />} /></Route>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/evidence" element={<EvidencePage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/gaps" element={<GapsPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/what-if" element={<WhatIfPage />} />
            <Route path="/placement" element={<PlacementPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CareerLensContext.Provider>
  )
}

export default App
