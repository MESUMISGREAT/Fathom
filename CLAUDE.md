# CLAUDE.md

Instructions for Claude Code working in Fathom. This file is the primary operating guide.
Read only the relevant sections of linked documents; do not load the whole repository by default.

## Project

Fathom is a learning site for Cambridge International AS & A Level:
- 9709 Mathematics
- 9618 Computer Science
- 9702 Physics
- 9701 Chemistry

Live site: https://fathom-steel-ten.vercel.app
Repository: https://github.com/MESUMISGREAT/Fathom
**Every push to `main` deploys to production.** Never push, merge, deploy, or change production configuration unless the user explicitly authorizes it.

For the current state, the lesson workflow and the publishing recipe, read `docs/HANDOFF.md` (it is short).

## First steps

1. Run `git status --short` and inspect the current branch before changing anything.
2. Preserve all existing user changes, untracked files, and drafts. Never use `git reset --hard`, `git clean`, broad restore commands, or `git add .`.
3. Read this file and `AGENTS.md`. Then inspect only the relevant documentation, source files, and tests for the task.
4. For a continuing project task, check the relevant parts of `docs/HANDOFF.md` and `node scripts/lessons/status.mjs` if lesson-queue state matters.
5. State assumptions only when they affect the work. Do not ask the user to repeat information already recorded here or in the handoff.

## Working style and efficiency

- Work as one agent by default. Do not spawn workers, create agent mailboxes, poll heartbeats, or use the old coordination protocol. The one exception: `ai-checked` needs an independent review, so use one reviewer subagent per lesson batch, told to report findings without editing.
- Search before reading. Find headings, symbols, callers, and relevant tests, then read the smallest sufficient range.
- Prefer diffs and targeted commands over dumping entire files or directories.
- Batch independent read-only operations. Do not repeat successful searches without a reason.
- Keep explanations and status updates concise. Do not narrate routine tool use.
- Token efficiency means removing redundant work, not removing necessary reasoning, content, or verification.
- Follow `.claude/skills/token-efficient-workflow/SKILL.md` for detailed repository-work habits.

## Educational content: highest priority

The authoritative content contract is `docs/CONTENT_GUIDE.md`; the working method (write, independent review, publish) is `docs/HANDOFF.md` §3–4. Read the relevant sections before creating or substantially editing lessons.

### Teaching standard

A 15-year-old meeting the idea for the first time must be able to learn it from the lesson alone, without looking anything up. Long is fine; hard to read is not.

- Follow "Teaching standard" and "Layout for easy reading" in `docs/CONTENT_GUIDE.md` §2. They are the rules; this is the summary.
- Define every term, symbol and unit before using it. Explain what to do and why it works, with every step a beginner needs.
- Layout: one idea per short paragraph, blank lines between, bullets for lists, numbered steps for methods, each formula on its own line with its symbols explained.
- Cambridge terminology and syllabus scope. Original content only. Label enrichment.
- 2–5 minutes is a guide, not a cap. Cut repetition, never teaching.

### Content audits requested by the user

When asked to audit published lessons:
- Give a brief overview of the site's subjects, syllabus organization, and lesson presentation.
- Audit the actual published educational content systematically, not just a sample. Maintain a register so no lesson is silently skipped.
- Focus on syllabus coverage, factual and mathematical accuracy, explanations, equations and notation, rendered diagrams, worked examples, and question wording/model answers.
- Inspect actual rendered diagrams where practical, not just their source code.
- Score each lesson out of 10 using the rubric in `docs/CONTENT_GUIDE.md` if present; otherwise use: teaching depth 25%, clarity 20%, syllabus accuracy/completeness 20%, worked examples/application 15%, structure 10%, diagrams/visual explanations 10%.
- Treat 8/10 as the minimum acceptable score. Substantially rebuild lessons below 8; do not merely polish wording. Preserve accurate, useful material.
- Do not perform broad UI or product QA unless requested. Do not test MCQ controls, hover states, points/badges interactions, every navigation path, or responsive breakpoints as part of a content audit.
- Investigate technical behavior only when it blocks access to, rendering of, or understanding the educational content. Review question text and answer correctness, not widget interactivity.
- Keep validation narrow and relevant to the content changes. Report what was actually inspected; never imply complete coverage if anything was skipped.

### Content safety and provenance

- `src/content/schema.ts` defines the content schema; `src/content/validate.ts` adds cross-file checks.
- Run `npm run content:check` after content changes. Before any authorized content commit, run it against the whole tree with zero errors.
- Lesson provenance is `draft` → `ai-checked` → `human-reviewed`. Only an independent AI review can justify `ai-checked`; only an actual teacher can justify `human-reviewed`. Never invent a review or set teacher provenance.
- The importer reads YAML under `content/subjects/<code>/lessons/`. Keep working drafts outside that published directory if they are not ready for import.
- Lesson filenames must match their IDs. `provenance` is a strict schema object. Lesson `order` values must be unique within each topic.
- Diagram components live in `src/components/diagrams/<code>/`; registries are generated with `npm run diagrams:gen`. Do not edit generated registries by hand.
- Preserve published lesson history and references. Check dependencies before moving, replacing, or deleting content.

## Architecture

Fathom is a Next.js 16 App Router application with Drizzle ORM, PGlite locally, and PostgreSQL in production.

- Reads: server components call `src/server/queries/*`.
- Writes: validated, rate-limited server actions in `src/server/actions/*`.
- Domain logic without database access: `src/domain/*`.
- Content source: `content/subjects/<code>/syllabus.yaml` and `content/subjects/<code>/lessons/*.yaml`.
- Content schema and validation: `src/content/schema.ts`, `src/content/validate.ts`.
- Content import: `src/server/db/content-sync.ts`.
- Diagram source and generated registries: `src/components/diagrams/<code>/`.
- Next.js version-specific guidance: read relevant docs under `node_modules/next/dist/docs/` before changing Next.js code. See `AGENTS.md`.

Do not change architecture just to make a task feel more comprehensive. Make the smallest justified change.

## Useful commands

```bash
npm run dev
npm run typecheck
npm test
npm run test:e2e
npm run content:check
npm run diagrams:gen
npm run diagram:render -- <diagramKey> --out <dir>
node scripts/lessons/status.mjs
```

Run only the checks relevant to the change, then broaden them when the risk warrants it. Never claim a check passed unless it was actually run.

## Git and production safety

- Inspect `git status --short` and the diff before staging or committing.
- Stage exact paths only. Never use `git add .` or indiscriminate staging.
- Do not overwrite, discard, or clean up user work, even if it appears unrelated or unfinished.
- Do not commit drafts as publishable lessons.
- Do not push to `main`, merge a pull request, deploy, or modify production settings without explicit user authorization.
- If the task can be completed locally or on a separate branch, prefer that.
- At completion, report changed files, important decisions, checks actually run, and any remaining limitations.
