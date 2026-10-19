# Fathom: Cambridge AS & A Level study platform (Phase 1)

```bash
npm install
npm run dev          # http://localhost:3000. Embedded Postgres (PGlite) in ./data, no DB server needed
npm test             # unit + integration tests (vitest)
npm run test:e2e     # Playwright against a production build, using fixture content
npm run content:check   # validate /content (syllabus, lessons, questions)
```
Set `DATABASE_URL` to use a real PostgreSQL server in production.

## Status
| Area | State |
|---|---|
| Accounts (scrypt passwords, hashed session tokens, rate limits), data export, account deletion | Working, tested |
| Syllabus trees for 9709, 9618, 9702, 9701, transcribed from the official PDFs | Present. The independent verification pass was **interrupted**, so treat them as unverified |
| Lessons: block renderer, step-by-step player, 7 question formats, deterministic checker (units, s.f., algebraic equivalence) | Working, tested on fixture content |
| Real lessons in `/content` | **Incomplete**: drafting was stopped mid-way. Run `npm run content:check` and fix or remove broken files before importing |
| Progress/mastery, Leitner review, dashboard, search, saved, history, coverage | Working, tested |
| Exam practice, AI tutor, grade prediction | Not built. Pages are labelled "Not built yet" |
| Design docs in `docs/design/` | May be partial (stopped) |

Known test status: 15/16 e2e tests pass. The remaining one is an accessibility check on some public page whose violation details were not yet read.

Layout: `src/content` (schema, validation, rendering), `src/domain` (pure logic: answer checking, mastery, scheduling, recommendations), `src/server` (db, auth, actions, queries), `src/app` (pages), `docs/CONTENT_GUIDE.md` (authoring rules).
