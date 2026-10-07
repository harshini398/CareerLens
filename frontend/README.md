# CareerLens

CareerLens is an evidence-first employability dashboard. It connects resume claims to observable project evidence, explains role readiness, prioritizes gaps, and turns them into a project-based roadmap.

## Run locally

```sh
npm install
npm run dev
```

Use **Explore Alex’s demo** from the landing page to follow the complete sample flow. The profile intake accepts PDF, DOCX, and TXT resumes; a real submission requires the backend API. Without it, the UI reports that analysis is unavailable and does not substitute Alex’s sample evidence.

## Frontend structure

- `src/pages.tsx` contains the P5 screens and user interactions.
- `src/components/Layout.tsx` contains shared navigation and display primitives.
- `src/data/demo.ts` holds isolated, clearly labeled sample data.
- `src/services/api.ts` is the only frontend-to-backend integration layer.
- `src/types.ts` defines the UI analysis contract.

Set `VITE_API_BASE_URL` to the FastAPI origin. `.env.example` shows the local default.

## API handoff

The adapter currently uses P4’s candidate flow:

- `POST /api/candidates` with `target_role`, `github_url`, optional `portfolio_url`, and optional `linkedin_text`; response contains `id` or `candidate_id`.
- `POST /api/candidates/{id}/resume` as multipart form data (`file`).
- `POST /api/candidates/{id}/github` with `{ "username": "..." }`.
- `POST /api/candidates/{id}/analyze` returns the shared analysis result.
- `POST /api/what-if` with `candidate_id` and action IDs (`learn_docker`, `add_tests`, `deploy_project`).

The analysis response should follow the shared master contract (`candidate`, `claims`, `evidence`, `verification`, `readiness`, `role_fit`, `skill_gaps`, `roadmap`). The adapter accepts the documented snake_case fields and maps them to the UI types. Keep unavailable evidence distinct from `unsupported` so it cannot be scored as a lack of skill.

Two API details need agreement with P4 before connecting real LinkedIn PDF uploads: the work split does not list a LinkedIn upload endpoint, while this UI supports that optional input; and the flowchart also lists alternate `/api/analyze/*` endpoints. Either freeze the candidate endpoints above or update `src/services/api.ts` to the team’s final contract.

## Checks

```sh
npm run build
npm run lint
```
