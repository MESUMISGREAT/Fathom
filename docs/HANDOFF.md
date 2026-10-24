# Handoff: how to carry on Fathom in a new chat

Start a new Claude Code chat **with the `MESUMISGREAT/Fathom` repository selected**. Pick it in
the repository picker before sending the first message, then say:

> Read docs/HANDOFF.md and carry on from where the last chat stopped.

If the chat can't find this file, the repository isn't attached. Attach it (`add_repo`,
owner `MESUMISGREAT`, repo `Fathom`), clone it, then read this file from the clone. Every
command below runs from the repo root, wherever it was cloned to. In the agent prompts,
replace `<repo root>` with that absolute path.

This file gives a new chat what it needs to continue without asking the user again. The
user's full specs live in the docs it links to. Read those docs **by section** (see
"Token rules"), not whole.

## 1. What Fathom is

A free learning site for Cambridge International AS & A Level: 9709 Maths, 9618 Computer
Science, 9702 Physics and 9701 Chemistry. Each lesson is one short concept (2–5 min) with
recall questions, worked examples and SVG diagrams. Spaced review, XP, levels and badges are
included. It is built for students with ADHD: short chunks, instant feedback, no shame.

- Live: https://fathom-steel-ten.vercel.app. Every push to `main` deploys to production.
- Repo: https://github.com/MESUMISGREAT/Fathom (branch `main`).
- Vercel: team `team_B3kW8x8OsulpVUvH5QfGjWc6`, project `prj_jXj1Ie1VEFG9NLnTp2KQ5Vj4r8rQ`
  ("fathom").
  - The database is Neon Postgres, connected through the Vercel Storage tab (`DATABASE_URL`/`POSTGRES_URL`).
  - Preview deployments are **disabled** on purpose (see section 7).
- Stack: Next.js 16 App Router (read `node_modules/next/dist/docs/` before Next-specific
  code; see AGENTS.md), Drizzle ORM, PGlite locally in `./data`, Postgres in production.

## 2. The user's specifications (all still apply)

| Topic | Where it is written down |
|---|---|
| Lesson format, writing style, questions, diagrams, provenance, copyright | `docs/CONTENT_GUIDE.md` |
| Points, levels, daily goal, badges, visual redesign (palette, states, feedback, home, lessons) | `docs/design/fun-and-points.md` |
| Architecture, data model, pages, risks, phase status | `docs/PLAN.md` |

Rules the user stressed:

- **Accurate and original.** Write all lessons and questions fresh; never copy a past paper.
- **Label honestly.** Clearly label placeholders and AI-drafted content. Never claim a
  teacher has reviewed anything. Provenance status is `draft` → `ai-checked` (independent
  AI review) → `human-reviewed` (a teacher only, never set by an agent). Don't make up
  features or results.
- **Fun but polished and human.**
  - Colourful, with pressable buttons and full hover, press, focus, disabled and loading states.
  - No generic SaaS look, no purple gradients, no glassmorphism, no emoji icons.
  - The lesson reading area stays calm.
- **Rewards come from real activity.**
  - They can't be farmed, there are no shame-based streaks, they can be switched off
    (`showPoints`), and they are stored on the server.
- **Write lessons for every syllabus topic.** This is the main remaining job (section 4).
  Keep the queue order: all AS units first, then A2 (the user confirmed this on 23 Oct).
- **Easy to read for ADHD (user, 23 Oct).** Paragraphs of at most 2 sentences, bullets wherever
  possible, white space, one idea per block. Start with an easy example the student can check
  another way. This is in `docs/CONTENT_GUIDE.md` ("Writing style") and in the writer and
  reviewer prompts.
- **Keep the teaching simple (user, 23 Oct).** Don't add notation a first-timer doesn't need.
  The chain rule is taught as "power down, box stays the same, then multiply by the derivative
  of the box"; dy/du × du/dx appears only in an optional block. Not every diagram has to be a
  graph: a rule table (x² → 2x) or numbered steps are often clearer.
- **Proper maths typesetting (user, 23 Oct).** Real fraction bars and root signs that cover the
  whole expression, never slash fractions like 1 ⁄ (2√u). Diagrams use `MathLabel` / `FracLabel`
  (see "Diagrams" in `docs/CONTENT_GUIDE.md`); `tests/diagram-notation.test.ts` enforces it.
- **Talking to the user:** short plain-language replies, no jargon dumps. The user is a
  student with exams and college essays.
  - "pause" means stop all agents and disable scheduled tasks.
  - "resume" means pick the queue back up.
  - Ask before starting big new work they didn't request.
  - **Budget:** when the session limit reaches about 80%, stop and **ask the user** whether
    to continue (their rule, 23 Oct). You can't see the meter: check `get_session` between
    rounds, and after about an hour of 3 agents assume you're close and ask. `get_session`
    shows `rate_limit_info` when a limit is near (on 23 Oct the weekly limit was at
    "warning", resetting 30 Oct).

## 3. Token rules (the user asked for these, and quality must not drop)

Follow the project skill `.claude/skills/token-efficient-workflow/SKILL.md`, including its
"Agent budget and token control" section. In short:

- **Agents:** at most **3 agents at once**.
  - Use exactly one independent reviewer per batch of lessons.
  - Never spawn agents to review your own work.
  - Hand each agent only the files and sections it needs.
- **Reading:** search before reading.
  - Print only the Markdown section you need with
    `python3 .claude/skills/token-efficient-workflow/scripts/md_section.py FILE "Heading"`
    (or `--headings`).
  - Don't reread files you just edited.
- **Never skip correctness checks:** validator, tsc, tests and the review pass.
- **Open promise to the user:** measure tokens per published lesson for the next few
  batches, compared with earlier batches, and report the savings. Numbers so far (from the
  agents' usage reports, 23 Oct): reviewing ≈ 15k tokens per lesson (9618 2.1: 223k for 15;
  9709 1.6+1.7: 271k for 17); writing ≈ 33k per lesson (9702 3.2+3.3: 265k for 8 new lessons).
  Earlier batches weren't recorded, so there's no baseline yet: keep logging and compare.

## 4. The lesson pipeline (exactly as used so far)

All tooling is in `scripts/lessons/`. `units.json` is the queue: 154 units, round-robin
across subjects in syllabus order. One unit is one or more syllabus topics written by one
agent.

### Start of a new chat

```bash
npm ci
export COMMIT_TRAILER="<the attribution lines your session's instructions give for commits>"
bash scripts/lessons/restore-drafts.sh     # brings back unpublished drafts from the wip-snapshot branch
node scripts/lessons/status.mjs            # where every unit stands
```

`restore-drafts.sh` fetches `wip-snapshot` itself, so it works on a fresh shallow clone.
`snapshot.sh` builds on the remote branch and says "NOT PUSHED" (exit 1) if a push fails.
The diagram renderer and Playwright fall back to `/opt/pw-browsers/chromium` when the pinned
browser is missing.

`status.mjs` reports one of five states for each unit:

| State | Meaning | Next step |
|---|---|---|
| `published` | On `main` | None |
| `reviewed` | Ai-checked, not yet published | Run `publish.sh` |
| `drafted` | Every objective covered, not reviewed | Run a reviewer |
| `partial` | Some objectives missing | Rerun the writer: it finishes existing files instead of duplicating them |
| `todo` | Nothing written yet | Run a writer |

### Running agents

Priority order:

1. Reviewers for `drafted` units.
2. Writers for `partial` units.
3. The next `todo` writers, in queue order.

Never run more than 3 agents at once. A writer and the reviewer for that same unit never
run at the same time. For each agent:

```bash
node scripts/lessons/prompts.mjs write "9701 3.1+3.2"     # or: review "9709 1.6+1.7"
# prints data/lesson-prompts/<kind>-<unit>.txt
```

Launch it as a **background general-purpose Agent**. The Workflow tool may not exist, and
it isn't needed. Use this prompt, word for word:

- **Writer:** `Read your complete instructions from <path> and follow them exactly. Work in <repo root>. End your reply with a short summary: each lesson (id, objectives, number of questions, diagrams), any objectives not covered, and whether the validator is clean for your files.`
- **Reviewer:** `Read your complete instructions from <path> and follow them exactly. Work in <repo root>. <one or two sentences passing on the writer's summary: lesson count, file prefix, and any judgement calls it flagged>. End your reply with a short summary: lessons reviewed, problems found and fixed, lessons marked ai-checked, lessons left as draft (and why), and whether the validator is clean for your files.`

The prompt files already contain everything else:

- the syllabus one-liner and exemplar lessons;
- the diagram rules;
- the reviewer's line-by-line check of facts, worked examples and every answer key;
- the provenance note. Reviewers must not repeat "Not yet reviewed by a teacher."

### After a reviewer finishes

1. Sanity-check any risky fix it reports, such as a widened tolerance or a changed answer
   key. Do it yourself, quickly, without spawning an agent.
2. Run `bash scripts/lessons/publish.sh`. It does the following:
   - commits only `ai-checked` lessons, plus the diagrams they use;
   - verifies them in a clean worktree: content-check (failures are dropped), tsc, and the diagram tests;
   - pushes to `main`, which deploys to production.
3. Confirm the deploy is live. Check it with the Vercel MCP (it may need
   `authorize_team_access` first), or curl a published lesson and look for its title.
4. Run `bash scripts/lessons/snapshot.sh`. This backs up all drafts to the `wip-snapshot`
   branch, which never touches `main`.

### Changing a published lesson (or code plus lessons)

`publish.sh` only handles new lessons. To ship edits to a lesson already on `main`, or code
changes alongside lessons:
1. Set the lesson back to `status: draft` with a note saying what changed, then run one
   independent reviewer on it.
2. Build a clean worktree from `origin/main`, copy in only the files you mean to ship, and
   regenerate the diagram index there. The local index lists draft diagrams, so never commit it.
3. Run `tsc`, `vitest` and `content-check` there, then commit and push from it.
4. Run `npx playwright test` in the main checkout. Turbopack refuses a worktree whose
   `node_modules` is a symlink.

### When things stop

- **Usage limits:**
  - The session limit hits after about 1 hour of 3 or 4 agents, and there is also a weekly limit.
  - Agents stopped by a limit can be resumed with SendMessage, but only in the same chat.
  - If the chat or its worker was lost, just rerun the writer or reviewer: it picks up existing files.
  - Before stopping, schedule a check just after the reset with `send_later`.
- **Stop-hook nags about uncommitted files:** run `snapshot.sh`. **Never** commit drafts to `main`.
- **Leftover files:** the regenerated `src/components/diagrams/*/index.ts` files (they
  include draft diagrams) and untracked draft lessons are expected in `git status`.
  `publish.sh` handles both.

## 5. Current state (24 Oct 2026, third chat)

- On `main`: **181 reviewed lessons, 1097 questions** (9709: 59, 9618: 42, 9702: 42, 9701: 38).
  All are live. Tests: 166 vitest and 25 Playwright e2e.
- Done in the second and third chats:
  - published 9618 2.1 (networks), 9709 1.6+1.7 (series, differentiation), 9702 3.2+3.3
    (non-uniform motion, linear momentum) and 9701 3.1+3.2 (electronegativity, ionic bonding;
    "a difference above about 1.8 means ionic" is taught as a rule of thumb, books use 1.7–2.0);
  - every 9709 diagram now has proper fractions and roots;
  - the chain rule was rewritten the box way;
  - **all eight other 1.7 differentiation lessons were rewritten in the "one question type,
    one method" style** the user asked for (modelled on how Sir Zain of Zainematics teaches,
    nothing copied): "What they ask", a numbered "The method" with the forgotten step in
    bold, an easy example, a check, an exam-style example, a check. The brief is
    `data/lesson-prompts/rewrite-differentiation.txt` (gitignored; regenerate it from this
    description if needed). Use this structure for new Maths lessons too;
  - the "Expected" line after a wrong numeric answer now typesets maths labels;
  - the snapshot, restore and browser tooling was fixed.
- Queue: 12 published, 142 todo.
- **START HERE.** The user halted all work on 24 Oct at about 13:15 UTC. No agents are
  running and `main` is clean (17ac1b2). Drafts are only on `wip-snapshot`.
  1. In a fresh container, run `bash scripts/lessons/restore-drafts.sh` to bring the drafts
     back, then `npm run diagrams:gen`.
  2. **9709 1.8 Integration: written, not reviewed.**
     - 9 draft lessons `p1-integration-*`: powers-of-x, brackets, finding-the-curve,
       definite-integrals, improper-integrals, area-under-a-curve, area-between-graphs,
       volume-of-revolution, volume-with-a-hole.
     - 48 questions, 9 diagrams, plus the helper `p1-integration-kit.tsx` (no diagramKey).
     - Written in the one-method style. The writer checked every key with sympy, and
       content-check reports 0 errors.
     - A reviewer was started, then halted before it changed anything.
     - Next:
       - run `node scripts/lessons/prompts.mjs review "9709 1.8" <today>`;
       - append the Maths checks below to the brief;
       - run one reviewer, then `publish.sh`.
  3. **9618 3.1 Computers and their components: the writer was halted part-way through.**
     - 12 draft lessons `computer-components-*` with 70 questions. Together they tag
       objectives 3.1.1–3.1.5; nothing teaches 3.1.6–3.1.8 yet.
     - 16 diagrams, 4 of them not used by any lesson yet: `cs-computer-components-dram-refresh`,
       `-memory-pyramid`, `-monitor-vs-control` and `-thermostat-graph`.
     - The writer had **not** yet recomputed its answer keys.
     - Next:
       - regenerate `prompts.mjs write "9618 3.1" <today>` and give it to one writer;
       - tell the writer the drafts exist and must be finished, not restarted;
       - the writer covers 3.1.6–3.1.8, uses or deletes the unused diagrams, and checks
         every key with python3;
       - then one reviewer, then `publish.sh`.
  4. Then the next `todo` units in order: 9702 4.1+4.2, 9701 3.3+3.4+3.5, 9709 2.1+2.2,
     9618 3.2, …
  5. **Ask the user before starting each new round of agents.** They are watching their
     session limit and want to be asked at about 80%.
- **Maths review checks.** Append these to every 9709 review brief; the briefs are
  gitignored.
  - Every lesson has "What they ask", then a numbered "The method" with the forgotten step
    in bold, then an easy example, a check, an exam-style example and another check. Each
    question appears in exactly one check.
  - Plain words, and no notation a first-timer doesn't need. Paragraphs are at most
    2 sentences, with bullets wherever possible.
  - Fractions use `\dfrac` and roots cover the whole expression, everywhere, including
    diagram and field labels. No slash fractions.
  - Not every diagram is a graph, and each diagram must actually help.
  - `expression` answers containing + c: test the marker with a short `npx tsx` script.
    The right answer and a capital C must be accepted. A missing + c and a wrong
    coefficient must be rejected.
  - Exact answers with `rel: 0.005`: a 3 s.f. decimal must be accepted, and a value 1% off
    must be rejected.
  - Nothing is copied from any teacher's material or past paper.
- Answered 24 Oct: the user wants the 9701 electronegativity "1.7–2.0" note kept as it is.
  The lessons teach "about 1.8" as a rule of thumb.
- **Open question for the user (asked 23 Oct, no answer yet):** restyle the existing
  lessons (165 at the time) to the new short-chunk style? It's a big job (a writer and a reviewer per batch).
  Ask before starting it, and ask whether it goes before or after the new topics.
- The user asked to "recheck all the Maths lessons first". Done so far: the notation in every
  Maths diagram, and the whole of 1.7 (differentiation). A full restyle of the other
  Maths lessons is part of the open question above.
- The old scheduled task `trig_01NiVSUy5PGKorMtJZ6y9aSt` stays disabled.

## 6. Other follow-ups (small, do when convenient)

- Keep the README status line (lesson and question counts) current after each publish.
- `docs/PLAN.md` section 2.2 should list the points tables now built: `xp_events`,
  `user_badges`, `topic_recoveries`, and the new `users` columns. Check
  `src/server/db/schema.ts`.
- Ask the user to delete the old preview deployment `dpl_G8kApT5Smrx2uaqMZ5ZoRKx9FUpi` in
  the Vercel dashboard.
- Final integration pass once every unit is published:
  - full `npm run content:check`, `npm run typecheck`, `npm test` and e2e;
  - a browser check of each subject page.

## 7. Don't break these

- **Previews stay off.** A preview build of `wip-snapshot` once imported drafts into the
  shared production database. `src/server/db/index.ts` (`isVercelPreview()`) and
  `scripts/vercel-build.ts` now skip migrations and imports outside production. Keep both
  guards.
- **Only `ai-checked` lessons go on `main`.** Drafts live in the working tree and on `wip-snapshot`.
- **Code changes** need `npm run typecheck`, `npm test` and `npx playwright test` to pass,
  plus a browser check for UI work. Don't commit with failing checks.
- **Answer checking** (`src/domain/answers/`) is covered by `tests/answers.test.ts`. Add a
  test with any change to marking.
- **Content sync** drops invalid lesson files instead of failing the whole import
  (`withoutInvalidLessons`, `tests/content-sync.test.ts`).
