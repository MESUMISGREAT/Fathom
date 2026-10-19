# Fathom: platform plan

The plan for an AI-assisted Cambridge International AS & A Level study platform, and the status of what is built. Detailed design studies for the hard parts are in [`docs/design/`](design/):

| Study | What it covers |
| --- | --- |
| [`ai-marking.md`](design/ai-marking.md) | Photo upload, transcription, AI-assisted marking against mark schemes, tutor behaviour, evaluation, cost |
| [`question-generation.md`](design/question-generation.md) | Exam question bank, structured mark schemes, AI-assisted generation, copyright safeguards, paper assembly |
| [`grade-prediction.md`](design/grade-prediction.md) | Grade estimation methodology (Bayesian IRT, thresholds, uncertainty, validation) |
| [`risks.md`](design/risks.md) | Risk register: copyright, privacy and safeguarding, cost, educational accuracy, wellbeing, security |

> These studies were written by AI agents and their final cross-document consistency review did not run. Their cost figures use Claude prices cached on 2026-10-06, and their legal points are flagged "confirm with counsel". Treat them as well-researched drafts, not as decisions or legal advice.

---

## 1. Architecture

```
Browser ──► Next.js 16 (App Router)
             ├─ Server components: pages read through src/server/queries
             ├─ Server actions: every write (validated with zod, rate-limited)
             ├─ proxy.ts: per-request nonce Content-Security-Policy
             └─ src/domain: pure, tested logic (answer checking, mastery, scheduling, recommendations)
                    │
             Drizzle ORM ──► PostgreSQL  (PGlite embedded locally; managed Postgres in production)
                    ▲
             Content importer ◄── /content (YAML in git: syllabus trees, lessons, questions)
                                      ▲
                               npm run content:check (schema + cross-file rules + KaTeX + answer-key self-test)

Later phases add separate server modules, each replaceable on its own:
  src/server/ai/*      (Phase 3: transcription, marking, tutor; keys server-side only)
  src/domain/grades/*  (Phase 4: deterministic statistics, no LLM)
  workers/             (offline question generation via the Batches API; stats fits)
```

### Key decisions

| Decision | Why |
| --- | --- |
| **One TypeScript codebase on Next.js** (server components and server actions) | One deployable for UI and API. Server actions give built-in CSRF protection and keep answer keys and secrets on the server by construction. |
| **PostgreSQL via Drizzle; PGlite for local development** | Real Postgres semantics everywhere: the same schema and migrations run embedded (zero setup, `npm run dev`) and on a hosted database (set `DATABASE_URL`). |
| **Content as YAML in git, imported into the database** | Content changes get code review, history and rollback, which is the review workflow. A zod schema plus a validator enforce structure, syllabus references, maths rendering and self-consistent answer keys before anything can be imported. The importer is idempotent, keyed on a content hash, and archives (never deletes) removed content so student history survives edits. |
| **Answer checking is deterministic code, not AI** | Same answer, same mark, every time; explainable; free to run. AI marking (Phase 3) is a separate module for free-form work that code cannot judge. |
| **Mastery and scheduling are pure functions** | They can be unit-tested, explained to students on `/about`, and changed without touching the UI or database. |
| **Public question view vs. private reveal** | The browser receives a question without its answer; the answer and explanation are sent only after a submission. |
| **Security defaults** | scrypt password hashes; only SHA-256 hashes of session tokens are stored; HttpOnly SameSite=Lax cookies; per-request nonce CSP with `strict-dynamic`; frame-ancestors none; rate limits on sign-up, log-in, answers, reports and exports; minimal personal data (email and optional first name). |
| **Accessibility and wellbeing by design** | WCAG 2.1 AA checked with axe in automated tests (light and dark); keyboard-operable questions; reduced-motion, reduced-transparency and high-contrast respected; no streaks, points or notifications. |

---

## 2. Data model

### 2.1 Built in Phase 1 (`src/server/db/schema.ts`)

| Table | Holds |
| --- | --- |
| `subjects` | Subject code, slug, name |
| `syllabus_versions` | One row per syllabus edition (e.g. 9709 2026–2027): source URL, version line, date checked, wording policy, current flag |
| `syllabus_sections` | Top-level sections (e.g. Pure Mathematics 1; "1 Physical quantities and units") with level (AS / A Level), papers, strand |
| `topics` | Topics (1.1, 1.2 …) within a section |
| `objectives` | Learning objectives (1.1.1 …), paraphrased text and guidance |
| `lessons` | One concept, 2–5 min: rendered blocks (JSON), minutes, kind (core / enrichment), prerequisites, **provenance and review status**, content hash, archived flag |
| `lesson_objectives` | Lesson ↔ objective mapping (many-to-many) |
| `questions` | Recall questions: `spec` (full, with answer key, server only), `view` (public), `reveal` (sent after answering), format, difficulty |
| `question_objectives` | Question ↔ objective mapping |
| `users` | Email, password hash, optional first name, role (student / editor / admin), theme, lesson mode, age confirmation time |
| `sessions` | Hashed session tokens with expiry |
| `enrollments` | Student ↔ subject, syllabus version, target level (AS / A Level) |
| `lesson_progress` | Furthest step, opened / last viewed / completed times |
| `attempts` | Every recorded answer: response, outcome, score, self-assessed flag, context (lesson / review) |
| `review_items` | Spaced-repetition state per question (Leitner box, due date, lapses) |
| `bookmarks` | Saved lessons and questions |
| `content_reports` | Problems reported by students, triaged by editors |
| `app_meta` | Content hash and import time |

Mastery is computed on read from `attempts` and the mapping tables (it is never stored), so changing the rules needs no migration.

### 2.2 Added in later phases (designed in `docs/design/`)

| Phase | Tables | Defined in |
| --- | --- | --- |
| 2: exam practice | `questions` (exam items) with `question_versions`, `question_parts`, `mark_points` (M/A/B marks, dependencies, follow-through, alternatives), `blueprints`, `paper_specs`, `paper_instances`, `exam_attempts`, `exposures`, `item_stats`, `reviews`, `item_reports`; licensing: `licences`, `licensed_items`, `takedown_requests`; generation: `qgen_runs`, `qgen_candidates`, `qgen_checks`, `originality_results` | `question-generation.md` §2 |
| 3: AI marking and tutor | `consents`, `submissions`, `submission_images`, `transcripts`, `point_decisions`, `ai_runs` (model, prompt version, tokens, cost), `derived_solutions`, `disputes`, `displayed_results`, `audit_events` | `ai-marking.md` §1–3 |
| 4: grade estimates | `grade_thresholds` and `threshold_sources`, `reference_forms`, `grade_model_params`, `leaf_params`, `grade_estimates`, `grade_jobs`, `external_results`, `outcome_reports` | `grade-prediction.md` §9, §12.2 |

The Phase 1 tables need no rewrite for these: attempts, objectives and the content-provenance model are shared foundations.

---

## 3. Pages and user journeys

### 3.1 Pages (Phase 1, all functional)

| Route | Purpose |
| --- | --- |
| `/` | Guests: landing page with "Try a lesson". Students: dashboard (next step, last 7 days, subjects with syllabus coverage and mastery, things worth revisiting, coming up, recent results, honest "grade estimates not available yet" card) |
| `/signup`, `/login` | Accounts |
| `/subjects` | All subjects; add with an AS or A Level target |
| `/subjects/[subject]` | Full syllabus tree with version and source, AS / A Level filter, topic status |
| `/subjects/[subject]/coverage` | Which objectives have lessons and questions, measured against the whole official syllabus |
| `/subjects/[subject]/[topic]` | Lessons in order, every objective with its status and which lesson teaches it |
| `/subjects/[subject]/[topic]/[lesson]` | Lesson player: step by step or whole lesson, worked examples revealed step by step, diagrams, inline checks with feedback, bookmarks, report a problem |
| `/review` | Due spaced-repetition questions, one at a time |
| `/progress` | Objectives studied, practised, secure and needing revision, per subject and topic |
| `/search` | Syllabus, topics, lessons and questions; exact codes rank first; filters for subject, level, type, difficulty, question format |
| `/saved`, `/history` | Bookmarks; study timeline |
| `/settings` | Name, theme, lesson mode, password, data export, account deletion |
| `/about`, `/privacy` | How content is made and checked, how marking and progress work, the roadmap; plain-English privacy summary |
| `/practice`, `/tutor` | Clearly labelled "Not built yet" pages for Phases 2 and 3 |
| `/reports` | Editors only: triage content reports |

### 3.2 Main journeys

1. **First visit → first lesson in two clicks.** Landing → "Try a lesson" → answer a question as a guest, with full feedback. Nothing is saved until an account exists.
2. **Sign up → study path.** Sign up → pick subjects and target level → dashboard shows "Up next" → lesson.
3. **A lesson.** Objective → explanation → definition → quick check (must be answered or skipped to continue) → worked example → common mistakes → check → takeaways → finish → summary and next lesson.
4. **Coming back.** Dashboard recommends, in order: a pile of due reviews (5+), resuming an unfinished lesson, revisiting an objective whose answers are slipping, the next lesson in syllabus order (prerequisites first).
5. **Finding something.** Search "1.1.2" or "discriminant" → objective, topic, lesson or question → straight to it.
6. **Spotting an error.** "Report a problem" on any lesson or question → editor triages on `/reports` → fix in `/content` → re-import.

Later: exam practice (Phase 2), photo feedback and tutor (Phase 3), opt-in grade estimates (Phase 4).

---

## 4. The hardest technical problems

### 4.1 Image-based marking (`ai-marking.md`)

- **Handwriting is ambiguous.** Transcription and marking are separate steps, and the student confirms or corrects the transcript in between. Unreadable regions are flagged and the student is asked; nothing is invented.
- **Marks must come from criteria, not vibes.** Mark schemes are structured data (M/A/B points, dependencies, follow-through). The model decides each mark point and cites the transcript line; deterministic code applies the rules and adds up the total, and verifies every citation.
- **Confidence must be measured, not self-reported.** Two independent marking passes (a third on disagreement), deterministic re-checks of final answers with the existing checker, and the evidence type combine into a label: "Estimate", "Uncertain – check with a teacher" or "Feedback only". Never "official".
- **No mark scheme?** Only a "validated expected answer" (independent solves that agree plus CAS, unit or code checks) may produce a rough estimate; otherwise feedback only.
- **Launch is gated per subject and question type** on a double-marked set of real scripts.
- **Cost:** about $0.38 per bank-anchored submission and $0.81 per free upload (Opus 5.5, caching on), dominated by output tokens (study §9).

### 4.2 Question generation (`question-generation.md`)

- **Wrong answer keys do real harm.** Every computable claim is checked by a deterministic verifier (CAS, units, equation balance, executing pseudocode); an independent AI solve and an ambiguity check are a second layer; a teacher reviews before students see it.
- **Copyright.** Past-paper text never goes into a prompt without a licence that allows it; every candidate passes lexical, semantic and structural originality checks. Changing numbers is not originality.
- **Scale cheaply.** Human-authored parametric templates generate variants deterministically, with no AI call per variant. Generation runs offline on the Batches API.
- **Diagrams** are generated from typed parameter specs by deterministic renderers and checked against the question's givens.
- **Difficulty** starts as an estimate and is replaced by IRT calibration from real first attempts.

### 4.3 Grade prediction (`grade-prediction.md`)

- **Not an average.** A latent ability per Cambridge component on a partial-credit IRT scale, with priors and shrinkage. Evidence is weighted by reliability (full timed papers 1.0, timed sets 0.8, untimed exam questions 0.5; recall questions only indirectly) and decays with age.
- **Timed and untimed are separate;** the headline is always exam conditions.
- **Uncertainty is propagated** by seeded Monte Carlo over ability, sitting-to-sitting variation, paper mismatch and a distribution of historical thresholds. The output is the probability of each grade, the most likely grade and an 80% range, never a bare letter.
- **Hard evidence gates** before anything is shown; **opt-in**; **forecast off at launch** until it passes its own backtest; kill criteria if calibration fails.
- **Entirely deterministic statistics**: no LLM in this pipeline.

---

## 5. Deterministic code vs. AI

| Feature | Deterministic (works reliably now or will) | Needs AI |
| --- | --- | --- |
| Syllabus navigation, coverage, search | ✅ All | – |
| Lesson delivery, progressive disclosure | ✅ All | – |
| Marking MCQ, numeric (tolerance, s.f., units by dimensional analysis), algebraic equivalence, cloze, spot-the-error, normalised short text | ✅ All (built) | – |
| Free-text definitions and explanations | Self-assessment against key points (built) | Phase 3: AI feedback on wording |
| Mastery, spaced repetition, recommendations | ✅ All (built) | – |
| Exam mark schemes: applying M/A/B rules, follow-through, totals | ✅ Rules engine | Deciding each mark point from free-form working |
| Reading photos of handwriting and diagrams | Image checks, redaction, transcript validation | Transcription |
| Tutor conversations, hints | Hint-level policy, link allow-list, leak checks | Wording, explanations |
| Question generation | Templates, verifiers (CAS, units, code), originality checks, paper assembly | Drafting new items and specs (offline, then human review) |
| Grade estimates | ✅ All statistics | – (AI only supplies weighted mark evidence upstream) |
| Content accuracy | Validator, answer-key self-tests, provenance labels, reports | Drafting and independent fact-checking, then teacher review |

---

## 6. Risks (summary of `risks.md`)

| # | Risk | Main mitigations |
| --- | --- | --- |
| 1 | **Children's consent and age assurance.** Many users are minors in many jurisdictions (UK GDPR / AADC, EU GDPR, COPPA, India's DPDP Act and others). **The Phase 1 age checkbox is not adequate for AI features.** | Neutral age and country screen, guardian-consent flow, consent gate before every AI call, under-13s declined, DPIA |
| 2 | **Safeguarding** in tutor chat and uploads | Named safeguarding lead, escalation policy, helplines, red-team gates |
| 3 | **AI provider data terms** (minors' data to a third party) | DPA, retention and no-training terms, zero-data-retention where available, inference geography |
| 4 | **Profiling and AI marking classification** under privacy and AI law | Counsel opinions per market; predictions off by default |
| 5 | **Cambridge copyright** (syllabus text, past papers, mark schemes, thresholds, AI reproduction) | Paraphrased objectives (done), original questions only (done), IP counsel, licences from Cambridge, originality checks, takedown process |
| 6 | **AI marking and tutor errors** | Per-slice launch gates on teacher double-marked scripts, labels, disputes |
| 7 | **Wrong content and answer keys** (drilled by spaced repetition) | Validator and answer-key self-tests (done), provenance labels (done), Report a problem (done), teacher review before public launch |
| 8 | **Personal data in photos** | Redaction pipeline with tested recall |
| 9 | **Cost abuse** | Email verification, shared rate limiter, credit ledger, spend guard |
| 10 | **Overconfident predictions and anxiety** | Opt-in, evidence gates, ranges, calibration, wellbeing checks |

**Cost (from the studies):** marking ≈ $0.38–0.81 per submission on Opus 5.5; ≈ $50k a month at 5,000 students × 20 submissions. Lower thinking effort and fewer passes save the most; cheaper models are owner decisions with documented trade-offs. Phase 1 has **no AI running costs**.

The full owner-decision list (markets, under-13 policy, retention periods, model configuration, free-tier scope, content visibility at launch, …) is in `risks.md` §10.

---

## 7. Phased plan

| Phase | Scope | Status | Gate before moving on |
| --- | --- | --- | --- |
| **1. Core learning** | Accounts, syllabus navigation, lessons, recall questions, progress, review, search | **Built** (see §8) | Teacher review of lessons; content coverage of at least one full AS component per subject; age/consent design agreed |
| **2. Exam practice** | Question bank with structured mark schemes, multi-part questions, deterministic diagram renderers, timed practice, topic analytics | Designed | IP counsel sign-off; teacher review pipeline staffed; IRT calibration data collecting |
| **3. AI tutor and marking** | Uploads, transcription, marking estimates, hints, recommendations | Designed | Consent and safeguarding (risks #1–3) in place; per-slice evaluation gates passed |
| **4. Grade estimates** | Full-paper tracking, thresholds, ranges, confidence | Designed | Backtests and calibration targets met; threshold licensing settled |
| **5. Expansion** | More subjects and syllabus versions, teacher content tools, analytics | Partly supported (adding a subject is a syllabus file plus lessons) | — |

Suggested next steps, in order: teacher review of the 38 lessons; write lessons for the rest of the first AS component in each subject (e.g. all of 9709 Pure Mathematics 1); then Phase 2's mark-scheme engine, which Phases 3 and 4 both depend on.

---

## 8. Phase 1 status: what is real

| Area | Status |
| --- | --- |
| Accounts: sign-up, log-in, log-out, password change, data export, account deletion | **Functional**, tested |
| Syllabus trees for 9709 (2026–2027), 9618 (2027–2029), 9702 (2025–2027), 9701 (2025–2027): 1,004 objectives | **Functional.** Transcribed from the official PDFs and independently verified against them by a second AI pass. Objectives are paraphrased. Not yet checked by a teacher |
| Lessons: 38 lessons, 216 questions (9709 topic 1.1; 9618 topic 1.1; 9702 section 1; 9701 section 1) | **Functional content, AI-written.** Validator passes; independently fact-checked line by line; labelled "AI-drafted, independently checked · not yet teacher-reviewed" |
| Coverage | About 3–8% of each syllabus's objectives have lessons. The coverage page shows exactly what is missing |
| Lesson player, seven question formats, deterministic checker | **Functional**, tested |
| Mastery states, spaced review, recommendations, dashboard | **Functional**, tested |
| Search, saved, history, progress, coverage | **Functional** |
| Report a problem, editor triage | **Functional** (`npm run user:role -- email editor` to make an editor) |
| Light/dark mode, responsive layout, accessibility | **Functional**; axe scans pass on all main pages |
| Exam practice, AI tutor, photo marking, grade estimates | **Not built.** Placeholder pages say so plainly |
| Reminders and notifications | **Not built** (deliberately: off unless a student opts in, when built) |
| Email verification and password reset | **Not built** (needed before a public launch) |

### Known limitations

- The rate limiter is in memory (per instance). Use a shared store (e.g. Redis) for more than one instance, and set `TRUST_PROXY=1` behind a trusted proxy so per-IP limits work.
- With the embedded database (PGlite), only one process may open the data directory at a time: stop the dev server before running `npm run content:import`, or just restart it (content syncs on start-up).
- Mastery is computed on each read; fine for now, to be cached once attempt volume grows.
- History shows times in UTC.
