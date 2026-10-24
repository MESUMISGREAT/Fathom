# Fathom: Cambridge AS & A Level study platform (Phase 1)

Short, step-by-step lessons and instantly marked recall questions for Cambridge International AS & A Level Mathematics (9709), Computer Science (9618), Physics (9702) and Chemistry (9701).

**Live:** https://fathom-steel-ten.vercel.app (Vercel, Neon Postgres). Every push to `main` deploys automatically.

```bash
npm install
npm run dev          # http://localhost:3000, loads the real content in /content. Embedded Postgres (PGlite) in ./data, no DB server needed
npm test             # unit + integration tests (vitest)
npm run test:e2e     # Playwright against a production build, using small fixture content (not the real lessons)
npm run content:check   # validate /content (syllabus, lessons, questions, answer keys)
npm run user:role -- you@example.com editor   # let an account see /reports (student problem reports)
```

If you previously ran the app with fixture content, delete the `data` folder and restart so the real content is imported.

Production: set `DATABASE_URL` to a PostgreSQL server. On Vercel, connect a Neon database (Storage tab); the `vercel-build` script runs migrations and the content import before `next build`. Behind a reverse proxy, set `TRUST_PROXY=1` so rate limits use the client's address from `X-Forwarded-For`.

## Status
| Area | State |
|---|---|
| Accounts (scrypt passwords, hashed session tokens, rate limits), settings, data export, account deletion | Working, tested |
| Syllabus trees for 9709, 9618, 9702, 9701 (2025–2027), transcribed from the official PDFs | Present and checked against the PDFs in a second, independent AI pass. Not checked by a teacher |
| Lessons: block renderer, step-by-step player, 7 question formats, deterministic checker (units, s.f., algebraic equivalence) | Working, tested |
| Real lessons in `/content` | 190 lessons, 1145 questions, all pass `content:check` (9709: 68, 9618: 42, 9702: 42, 9701: 38; the rest are being written, see `docs/HANDOFF.md`). Marked **AI-checked**: AI-written, re-checked line by line in a separate AI review, not yet reviewed by a teacher. Each lesson shows this label |
| Progress/mastery, Leitner review, dashboard, search, saved, history, coverage | Working, tested |
| Report a problem (on every question and lesson) and an editor triage page at `/reports` | Working, tested |
| Points: XP for real progress (no farming), levels, daily goal (optional), badges, `/achievements`, "Show points and badges" switch | Working, tested. Rules: `docs/design/fun-and-points.md` |
| Redesign: warm palette with subject colours, new logo, self-hosted fonts, interaction states, lesson-complete celebration | Done; axe WCAG 2.1 AA clean in light and dark |
| Exam practice, AI tutor, grade prediction | Not built. Pages say "Not built yet"; the designs are in `docs/design/` |

Tests: 162 vitest tests and 25 Playwright tests (including axe WCAG 2.1 AA scans in light and dark mode and a phone-width overflow check).

## Docs
- `docs/PLAN.md`: architecture, data model, pages and journeys, the hard problems, deterministic vs AI split, risks and the phased plan.
- `docs/design/`: designs for AI marking of handwritten work, question generation, grade prediction, and the risk register.
- `docs/CONTENT_GUIDE.md`: how to write lessons and questions.

Layout: `src/content` (schema, validation, rendering), `src/domain` (pure logic: answer checking, mastery, scheduling, recommendations), `src/server` (db, auth, actions, queries), `src/app` (pages), `content/subjects` (syllabus and lessons as YAML).
