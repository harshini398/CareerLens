import type { AnalysisResult, WhatIfResult } from '../types'

export const demoAnalysis: AnalysisResult = {
  candidate: {
    id: 'C001',
    name: 'Alex Morgan',
    targetRole: 'Backend Developer',
    githubUsername: 'alexmorgan-dev',
  },
  readiness: {
    score: 68,
    confidence: 81,
    breakdown: {
      technical: 23,
      projects: 15,
      consistency: 10,
      engineering: 7,
      documentation: 6,
      roleAlignment: 7,
    },
  },
  claims: [
    {
      id: 'CL001', skill: 'Python', claimedLevel: 'Expert', evidenceSummary: '7 repositories', strength: 91,
      status: 'verified', readinessImpact: 8,
      explanation: 'Python appears across seven repositories, including recent backend and data projects. Tests and dependency files were found in multiple repositories.',
      action: 'Keep building on your API and data tooling work.',
      signals: ['7 repositories use Python', '4 active in the last 6 months', 'Tests detected in 3 repositories', 'requirements.txt and pyproject.toml found'],
      repositories: [
        { name: 'fastapi-job-board', url: 'https://github.com/alexmorgan-dev/fastapi-job-board', description: 'Role discovery API with PostgreSQL and JWT authentication.' },
        { name: 'sales-insights', url: 'https://github.com/alexmorgan-dev/sales-insights', description: 'Data analysis pipeline for monthly sales reporting.' },
        { name: 'study-group-api', url: 'https://github.com/alexmorgan-dev/study-group-api', description: 'REST API for coordinating peer study sessions.' },
      ],
    },
    {
      id: 'CL002', skill: 'FastAPI', claimedLevel: 'Advanced', evidenceSummary: '3 repositories', strength: 84,
      status: 'verified', readinessImpact: 6,
      explanation: 'Three public projects use FastAPI, including a documented API with authentication and request validation.',
      action: 'Add integration tests and document API decisions in your README.',
      signals: ['3 repositories use FastAPI', 'JWT authentication found', 'OpenAPI routes present', 'Recent commits in 2 repositories'],
      repositories: [{ name: 'fastapi-job-board', url: 'https://github.com/alexmorgan-dev/fastapi-job-board', description: 'FastAPI service with authentication and PostgreSQL.' }],
    },
    {
      id: 'CL003', skill: 'SQL', claimedLevel: 'Intermediate', evidenceSummary: '2 projects + dependencies', strength: 68,
      status: 'partial', readinessImpact: 3,
      explanation: 'SQL is used in two project repositories, but there is limited evidence of more advanced querying or database design.',
      action: 'Add documented migrations and a query-heavy feature to an existing project.',
      signals: ['PostgreSQL dependency in 2 projects', 'SQLAlchemy models found', 'Few examples of complex queries'],
      repositories: [{ name: 'fastapi-job-board', url: 'https://github.com/alexmorgan-dev/fastapi-job-board', description: 'PostgreSQL-backed job and application models.' }],
    },
    {
      id: 'CL004', skill: 'Docker', claimedLevel: 'Advanced', evidenceSummary: 'No Docker configuration found', strength: 8,
      status: 'unsupported', readinessImpact: -4,
      explanation: 'Your resume claims advanced Docker experience, but no Dockerfile or compose configuration was found in the analyzed repositories.',
      action: 'Dockerize fastapi-job-board, add a compose file, and document the local setup.',
      signals: ['0 Dockerfiles detected', '0 docker-compose files detected', 'No Docker workflow referenced in project READMEs'],
      repositories: [],
    },
    {
      id: 'CL005', skill: 'AWS', claimedLevel: 'Intermediate', evidenceSummary: 'No public project evidence', strength: 0,
      status: 'unsupported', readinessImpact: -3,
      explanation: 'No AWS configuration or deployment references were found in the repositories available for analysis.',
      action: 'Deploy one existing service and link the deployment and infrastructure configuration.',
      signals: ['No AWS SDK dependencies detected', 'No deployment configuration found'],
      repositories: [],
    },
    {
      id: 'CL006', skill: 'Testing', claimedLevel: 'Intermediate', evidenceSummary: 'Tests in 2 repositories', strength: 42,
      status: 'partial', readinessImpact: 1,
      explanation: 'Automated tests are present, but coverage appears narrow and integration tests were not identified.',
      action: 'Add API integration tests and run them in continuous integration.',
      signals: ['pytest found in 2 repositories', 'No coverage report detected', 'No API integration test suite found'],
      repositories: [{ name: 'study-group-api', url: 'https://github.com/alexmorgan-dev/study-group-api', description: 'Includes a small pytest suite for core routes.' }],
    },
  ],
  roles: [
    { role: 'Backend Developer', score: 82, summary: 'Strong Python and API evidence; testing and deployment are the main gaps.' },
    { role: 'Full Stack Developer', score: 74, summary: 'Backend work is supported; add more frontend project evidence.' },
    { role: 'Data Engineer', score: 67, summary: 'Good Python foundation with room to demonstrate pipeline and cloud skills.' },
    { role: 'Machine Learning Engineer', score: 51, summary: 'Some data work is visible; model deployment evidence is limited.' },
  ],
  gaps: [
    { skill: 'Docker', current: 15, required: 60, gap: -45, priority: 'high', weight: 10, evidenceNote: 'No Docker configuration found in analyzed repositories.' },
    { skill: 'Testing', current: 42, required: 70, gap: -28, priority: 'high', weight: 10, evidenceNote: 'A few unit tests exist; integration and coverage evidence are limited.' },
    { skill: 'Cloud deployment', current: 30, required: 50, gap: -20, priority: 'medium', weight: 5, evidenceNote: 'No deployment workflow or cloud configuration found.' },
    { skill: 'REST APIs', current: 76, required: 80, gap: -4, priority: 'low', weight: 20, evidenceNote: 'Multiple API projects are visible; add integration tests and API docs.' },
    { skill: 'SQL', current: 82, required: 75, gap: 7, priority: 'low', weight: 20, evidenceNote: 'Two projects use PostgreSQL and SQLAlchemy.' },
    { skill: 'Python', current: 91, required: 80, gap: 11, priority: 'low', weight: 25, evidenceNote: 'Consistent use across several recent repositories.' },
  ],
  roadmap: [
    { week: 1, goal: 'Make API behavior testable', deliverable: 'A tested FastAPI service with repeatable checks', tasks: [
      { id: 't1', label: 'Add pytest fixtures for database and API clients', resource: 'pytest documentation', done: true },
      { id: 't2', label: 'Write 10 unit tests for validation and business rules', resource: 'FastAPI testing guide', done: false },
      { id: 't3', label: 'Add API integration tests for core routes', resource: 'TestClient reference', done: false },
    ] },
    { week: 2, goal: 'Package the backend with Docker', deliverable: 'A local multi-service setup using Docker Compose', tasks: [
      { id: 't4', label: 'Create a production-minded Dockerfile', resource: 'Docker getting started', done: false },
      { id: 't5', label: 'Add PostgreSQL and API services to compose', resource: 'Compose documentation', done: false },
      { id: 't6', label: 'Document setup and environment variables', resource: 'README checklist', done: false },
    ] },
    { week: 3, goal: 'Automate checks and deployment', deliverable: 'A deployed API with CI checks', tasks: [
      { id: 't7', label: 'Run tests through GitHub Actions', resource: 'GitHub Actions Python guide', done: false },
      { id: 't8', label: 'Deploy the API and publish the endpoint', resource: 'Render deployment guide', done: false },
    ] },
    { week: 4, goal: 'Showcase the project clearly', deliverable: 'A portfolio-ready backend project', tasks: [
      { id: 't9', label: 'Add architecture notes and a request flow diagram', resource: 'FastAPI docs', done: false },
      { id: 't10', label: 'Add example requests and a short demo recording', resource: 'Project README', done: false },
    ] },
  ],
  explanation: {
    positives: ['Strong, recent Python work across seven repositories', 'Three API projects show practical backend experience', 'Project history includes useful documentation and dependencies'],
    improvements: ['Docker claim has no configuration evidence', 'Automated tests are present but limited', 'No public cloud deployment evidence was found'],
    recommendation: 'Dockerize and test fastapi-job-board, then deploy it with a small CI workflow.',
  },
  metrics: { repositories: 12, signals: 47, verifiedSkills: 2, majorGaps: 3 },
}

export const demoWhatIf: WhatIfResult = {
  currentScore: 68,
  projectedScore: 77,
  delta: 9,
  reasons: [
    { factor: 'Docker evidence', impact: 3 },
    { factor: 'Automated testing', impact: 2 },
    { factor: 'Cloud deployment', impact: 4 },
  ],
}

export const placementData = {
  studentsAnalyzed: 1248,
  averageReadiness: 64,
  placementReady: 37,
  needsIntervention: 45,
  readinessDistribution: [
    { label: 'Highly ready', value: 18, color: '#2f7b5b' },
    { label: 'Placement ready', value: 37, color: '#a8c95b' },
    { label: 'Needs improvement', value: 45, color: '#e27c64' },
  ],
  skills: [
    { skill: 'Python', demand: 80, coverage: 72 },
    { skill: 'SQL', demand: 75, coverage: 58 },
    { skill: 'Docker', demand: 65, coverage: 21 },
    { skill: 'Cloud', demand: 60, coverage: 19 },
    { skill: 'React', demand: 55, coverage: 46 },
    { skill: 'Testing', demand: 50, coverage: 24 },
  ],
  recommendations: [
    { title: 'Docker + CI/CD workshop', note: '79% of students lack strong evidence for containerization.', priority: 'High' },
    { title: 'Testing fundamentals', note: '68% need stronger automated testing evidence.', priority: 'High' },
    { title: 'SQL for backend and data roles', note: '42% fall below the current role threshold.', priority: 'Medium' },
  ],
  atRisk: [
    { name: 'Candidate C-104', role: 'Backend Developer', score: 41, gap: 'SQL, APIs, Testing', activity: 'Low' },
    { name: 'Candidate C-227', role: 'Data Engineer', score: 46, gap: 'Cloud, SQL', activity: 'Low' },
    { name: 'Candidate C-391', role: 'Full Stack Developer', score: 48, gap: 'Testing, React', activity: 'Moderate' },
  ],
}

export const availableRoles = [
  'Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'Software Engineer', 'Data Analyst',
  'Data Engineer', 'Machine Learning Engineer', 'AI Engineer', 'DevOps Engineer', 'Cloud Engineer',
  'UI/UX Designer', 'Mobile Developer', 'QA / Test Engineer', 'Cybersecurity Analyst',
]