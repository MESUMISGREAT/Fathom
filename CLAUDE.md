# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Fathom is a study site for Cambridge International AS & A Level: 9709 Maths, 9618 Computer
Science, 9702 Physics and 9701 Chemistry. It has short lessons, instantly marked recall
questions, spaced review and XP/badges.

It is live at https://fathom-steel-ten.vercel.app, and **every push to `main` deploys to
production.**

**Continuing earlier work?** Read `docs/HANDOFF.md` first. It holds the user's specs, the
lesson-writing pipeline (`scripts/lessons/`), the current state and the next steps.

**Working token-efficiently:** follow `.claude/skills/token-efficient-workflow/SKILL.md`.
- Use dynamic concurrency for genuinely independent tasks; follow `docs/AGENT_COORDINATION.md` when multiple local agents share a checkout. Resource limits and contention, not a fixed count, determine the safe number.
- Read docs by section with its `md_section.py`.
- Never skip correctness checks.
- **Teaching quality before brevity:** follow the full "Teaching philosophy: understanding before brevity" section in `docs/CONTENT_GUIDE.md`. Readability rules control formatting, never teaching depth; longer lessons are fine when needed.
- **Finish the whole lesson queue:** follow `docs/HANDOFF.md` and keep cycling through writing, independent review, fixes/revalidation, publishing and deployment verification until every in-scope unit is `published`. Recheck `node scripts/lessons/status.mjs` after each batch; never stop or claim completion after one batch. If blocked, report the remaining states.

## Commands

```bash
npm run dev            # localhost:3000; embedded Postgres (PGlite) in ./data, migrates and imports /content on first request
npm run typecheck      # tsc --noEmit
npm test               # vitest (tests/**/*.test.ts, node env, runs server code directly)
npx vitest run tests/answers.test.ts -t "counts significant"   # one file / one test
npm run test:e2e       # Playwright: builds and serves on :3210 with tests/fixtures/content and a throwaway DB
npx playwright test e2e/points.spec.ts --project=desktop       # one spec (@phone-tagged tests run in the "phone" project)
npm run content:check  # validate /content; must report 0 errors. Flags: -- --quiet | --subject 9709 | --only lessons/circular-measure-
npm run diagrams:gen   # regenerate src/components/diagrams/<code>/index.ts after adding/removing a diagram file
npm run diagram:render -- <diagramKey> --out <dir>   # render one diagram to an image to look at it
npm run db:generate    # drizzle-kit: new migration in drizzle/ after editing src/server/db/schema.ts
npm run user:role -- you@example.com editor          # grant access to /reports
```

- If the app was run with fixture content, delete `./data` so the real content is imported.
- Production uses `DATABASE_URL` or `POSTGRES_URL` (Neon on Vercel).
- `npm run vercel-build` (`scripts/vercel-build.ts`) runs migrations and the content import
  before `next build`, but **only when `VERCEL_ENV=production`**.

## Architecture

The app is a single Next.js 16 App Router app. Its APIs differ from older Next.js; see the
AGENTS.md note above.

- **Reads** go through server components that call `src/server/queries/*`.
- **Writes** are server actions in `src/server/actions/*`. Each is zod-validated and
  rate-limited (`src/server/rate-limit.ts`, which honours `TRUST_PROXY=1`).
- **`src/proxy.ts`** sets a per-request nonce CSP with `strict-dynamic`, so inline scripts
  need the nonce.
- **Route groups:** `src/app/(app)` holds the signed-in pages and `src/app/(auth)` the login
  and signup pages.
- **`src/app/api/e2e`** holds test-only hooks. They return 404 unless `E2E_HOOKS=1`.

### Content pipeline

The flow is: YAML in git → validator → database.

1. **Source files.** `content/subjects/<code>/syllabus.yaml` holds the official syllabus
   tree. `content/subjects/<code>/lessons/*.yaml` holds one concept per file: blocks plus
   questions.
2. **The contract** is `src/content/schema.ts` (zod). `src/content/validate.ts` adds the
   cross-file rules:
   - syllabus objective references;
   - KaTeX rendering;
   - diagram keys that exist;
   - an answer-key self-test, in which each question's model answer must mark as correct.
3. **The import.** `src/server/db/content-sync.ts` imports the content from `getDb()` in
   `src/server/db/index.ts`. The import is:
   - idempotent, keyed on a hash of every content file;
   - safe with broken files: `withoutInvalidLessons` drops them and their dependents rather
     than failing the whole import;
   - non-destructive: removed lessons and questions are archived, not deleted, so attempt
     history survives.
4. **Switches.** `CONTENT_SYNC=0` disables the sync, and `CONTENT_DIR` points it at other
   content (tests use `tests/fixtures/content`).
5. **The preview guard.** `isVercelPreview()` skips the migration and sync on Vercel preview
   deployments, because previews share the production database. Keep this guard. Preview
   deployments are also turned off in the Vercel project.
6. **Diagrams.** These are React SVG components in `src/components/diagrams/<code>/*.tsx`.
   - Each one declares `export const diagramKey = '…'` and has a default export.
   - The per-subject `index.ts` registries are generated from the files on disk by
     `scripts/diagram-scan.ts` and `scripts/gen-diagrams.ts`. Don't edit them by hand.

### Answers are marked by deterministic code, not AI

- **The browser never receives an answer key.** `src/content/rendered.ts` splits each
  question into a public `QuestionView` and a private `QuestionReveal`. The reveal (answer
  and explanation) is sent only after a submission.
- **`src/domain/answers/`** marks the answers:
  - numbers in student notation, including significant figures;
  - units, checked by dimension and converted;
  - algebraic equivalence by numeric sampling (`expression.ts`);
  - normalised text.
- `checkAnswer` returns an outcome: `correct`, `partial`, `incorrect`, `invalid` (unreadable)
  or `self-check`.
- Any change to marking needs a test in `tests/answers.test.ts`.

### Pure domain logic vs server

`src/domain/*` contains pure functions with no database access and no clock reads:
- `mastery.ts`
- `schedule.ts` (Leitner review)
- `recommend.ts`
- `points.ts`

Points work the same way:
- **The rules** for XP, levels, the daily goal and badges are in `src/domain/points.ts`.
  They implement `docs/design/fun-and-points.md`, and client components can import them.
- **The awarding** is in `src/server/points.ts`. It runs inside the transaction of the
  action that earned the points. A per-user advisory lock plus
  `INSERT … ON CONFLICT DO NOTHING` on `(user_id, kind, source_id)` make double awards
  impossible.
- **The browser** only displays what the server returns.

### Database

- Drizzle schema: `src/server/db/schema.ts`.
- Migrations: `drizzle/`. They apply automatically on connect unless `AUTO_MIGRATE=0`.
- PGlite runs locally (`PGLITE_DIR`), and `pg` runs in production (pool of 3 on Vercel).
- Sessions store only SHA-256 hashes of their tokens, and passwords are hashed with scrypt.
- `INSECURE_COOKIES=1` lets e2e tests run over plain http.

## Lesson-writing style: fun and easy to read

Lessons must be genuinely fun, engaging, conversational and easy to read. Use accessible explanations, short paragraphs, clear structure, useful examples, relatable analogies and appropriate humour. Avoid dry textbook-style exposition and dense walls of text. Keep the writing accessible without removing necessary reasoning, examples or syllabus content. Fun should support learning, not distract from it. Follow `docs/CONTENT_GUIDE.md` and `scripts/lessons/templates.mjs` for the full writing requirements.

## Lesson-writing philosophy: understanding before brevity

**Teach for understanding, not for the shortest lesson or lowest token count.** Fathom is for students who may be encountering a concept for the first time. A longer lesson that enables a beginner to solve questions independently is better than a short lesson that leaves them confused. Never remove necessary teaching to hit a word count, duration, or token target.

- **Start from the student's level.** Define unfamiliar terms, symbols, variables, notation and prerequisites before relying on them. Do not assume students know what an expert considers obvious.
- **Show the reasoning.** Explain both what to do and why. Include necessary intermediate steps, explain why a formula or method applies, and state important conditions, limits and exceptions. Never skip a step merely to make the lesson look concise.
- **Build understanding progressively.** Where useful, move from a concrete example to plain-language intuition, an analogy (including where it stops being accurate), a visual or diagram, a fully explained worked example, and then the general rule. Add another example when it addresses a genuinely different difficulty.
- **Format for readability, not omission.** Use short paragraphs, headings, bullets, numbered steps, tables, diagrams and well-separated blocks. Short paragraphs must not mean missing explanations. Longer lessons are acceptable when the topic needs them; split a large topic into a clear sequence only when that preserves all required learning.
- **Keep academic precision.** Use Cambridge syllabus terminology and definitions accurately. Distinguish formal definitions from intuitive explanations; include units, conditions and required notation. Keep content aligned to the applicable syllabus version and objectives. Label enrichment that is beyond the syllabus. Write original material; never copy past-paper questions or source text.
- **Optimise effort, not teaching.** Save tokens by avoiding repeated instructions, redundant examples, unnecessary research, duplicate explanations and needless rewrites. Do not save tokens by omitting intermediate reasoning, making language more advanced, assuming prior knowledge, reducing syllabus coverage or weakening accuracy/review checks.
- **Before accepting a lesson, check:** Could a beginner follow every step? Are all new terms and symbols explained before use? Does each worked solution explain why its steps work? Is any reasoning skipped as “obvious”? Can the student apply the idea independently? Remove repetition, but restore any explanation needed for understanding.

The usual 2–5 minute lesson target is a guideline, not a hard limit. Understanding and syllabus coverage take priority. Follow `docs/CONTENT_GUIDE.md` and the lesson templates for the detailed content contract; run the required validation and independent review. Never mark content `human-reviewed` unless a teacher actually reviewed it.

## Rules for this repo

- **Lessons:** only lessons with `provenance.status: ai-checked` (independently AI-reviewed)
  go on `main`. Drafts stay untracked and are backed up with
  `bash scripts/lessons/snapshot.sh` to the `wip-snapshot` branch.
  - Never set `human-reviewed`; that status is for a teacher.
  - Never claim a teacher reviewed anything.
- **Content:** write all content fresh. Never copy past papers. How to write it is in
  `docs/CONTENT_GUIDE.md`.
- **UI:** follow §5 of `docs/design/fun-and-points.md`:
  - a playful but polished look, using the palette and subject colours;
  - full interaction states;
  - no purple gradients, glassmorphism or emoji icons;
  - a calm lesson reading area;
  - axe WCAG 2.1 AA in light and dark, which the e2e tests check.
- **Docs:** architecture, data model and the designs for unbuilt phases (AI marking, question
  generation, grade prediction) are in `docs/PLAN.md` and `docs/design/`.

## Multiple local AI agents

When multiple agents work in the same checkout, follow `docs/AGENT_COORDINATION.md` before selecting work. Use the shared runtime mailbox, announce roles, atomically claim distinct lesson units, heartbeat ownership, and avoid simultaneous edits to shared files. Coordination state is local runtime data and must never be committed. If the mailbox is not genuinely shared, say so and work safely solo or use messaging actually provided by the runtime; do not pretend files are real-time push messaging.

Agent count is dynamic rather than a fixed requirement: use parallel agents only for independent tasks, within available machine/provider capacity. Solo mode must always work. Keep one owner for shared handoff/publication state and one publisher at a time. The coordination protocol never overrides syllabus quality, independent review, validation, provenance, or production safety gates.


## Heartbeat-driven collaboration

Follow the heartbeat and stall-response rules in `docs/AGENT_COORDINATION.md`. The coordination helper emits a shared mailbox message for every explicit heartbeat. Read other agents' heartbeats during collaboration, acknowledge assignments and blocker/handoff messages, and respond with concrete help when a task is blocked or may be stalled. During active coordination, check messages at task boundaries and poll every 2–5 seconds while waiting; heartbeat about every 30–60 seconds during long tasks when practical. A heartbeat older than 2 minutes is a prompt to check in, not permission to steal a claim. Avoid replying to every routine heartbeat, which creates useless message storms.
