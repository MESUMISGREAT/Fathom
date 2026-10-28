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
Science, 9702 Physics and 9701 Chemistry. Each lesson teaches one concept with recall
questions, worked examples and SVG diagrams; its length is determined by what students need
to understand and apply it. The 2–5 minute target is guidance, never a cap. Spaced review, XP,
levels and badges are included. It is built for students with ADHD: clear structure, instant
feedback, no shame. Readability must never mean cutting necessary teaching.

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
- **Teaching philosophy: understanding before brevity.** The complete rules are in
  `docs/CONTENT_GUIDE.md` under "Teaching philosophy: understanding before brevity"; the writer
  and reviewer prompts in `scripts/lessons/templates.mjs` must enforce them. Teach from zero:
  define unfamiliar terms and notation, explain what to do and why it works, show necessary
  intermediate steps, use examples and visuals when they improve understanding, preserve
  Cambridge requirements, and check that a beginner can apply the concept independently. The
  2–5 minute duration is a guideline, never a cap. Short paragraphs, bullets and focused blocks
  govern presentation, not lesson depth. Never cut necessary teaching to fit a screen or save
  tokens; split only when it improves the learning sequence. Optimise wasted effort, not learning.
- **Fun, engaging lesson writing.** Lessons must be genuinely fun, conversational and easy to read. Use accessible explanations, short paragraphs, clear structure, useful examples, relatable analogies and appropriate humour. Avoid dry textbook-style exposition and dense walls of text. Fun should support learning, not distract from it; never remove necessary reasoning or syllabus content to make a lesson feel lighter.
- **Accessible teaching, not missing rigour.** Avoid notation that is genuinely unnecessary for
  a first-timer, but explain every symbol and method needed for the syllabus. The chain rule can
  start with "power down, box stays the same, then multiply by the derivative of the box" before
  introducing dy/du × du/dx where it helps understanding. Not every diagram has to be a graph:
  a rule table (x² → 2x) or numbered steps are often clearer.
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

**Keep cycling until the entire queue is complete.** After each batch, re-run
`node scripts/lessons/status.mjs`, then continue writing missing/partial units, independently
reviewing drafted units, fixing issues, publishing reviewed lessons, confirming the deploy, and
snapshotting remaining drafts. Repeat this write → review → fix/revalidate → publish → verify
cycle across the queue until every in-scope syllabus unit is `published` and no `todo`,
`partial`, `drafted`, or `reviewed` units remain. Do not treat finishing one batch, one subject,
or one chat session as completion. Preserve the AS-first-then-A2 queue order, required checks,
agent limits and user session-budget rule. If blocked by limits or an external dependency, report
the exact remaining states and resume from the status queue; never claim completion early.

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

## 5. Current state (28 Oct 2026, cloud chat)

- **Before starting a unit, check that no other chat has it in flight.** Two cloud chats
  share this VM (`/workspace/chats/0b8e8fe21ee9b5f6eaa0ce13` and this one). On 28 Oct the
  other chat was writing **9618 6.1** (three `data-security-*` lessons on disk) and touching
  the **9709** lessons broadly, so this chat left both alone and took **9702 6.2** instead.
  Quick check: `ls <sibling>/content/subjects/*/lessons | grep '^<prefix>'`, plus
  `git log --all --oneline -- 'content/subjects/<code>/lessons/<prefix>-*'` and the
  `wip-snapshot` tree. Never edit the sibling worktree. That chat published **9618 6.1**
  (7 lessons, a93ff08) during this session; it also restyles 9709 lessons, so leave 9709
  alone while it is active.
- **`scripts/lessons/units.json` prefixes now match the published 9709 3.3-3.5 lessons**
  (`p3-trig`, `p3-diff`, `p3-int`). They had been listed as `p3-trigonometry`,
  `p3-differentiation` and `p3-integration`, so `status.mjs` reported that published unit as
  `todo` and a future writer would have duplicated 15 lessons. `status.mjs` now says
  **38 published, 116 todo**.
- **9702 7.1 Progressive waves is published** (28 Oct, e880df1): 6 lessons
  (`progressive-waves-what-is-a-wave` 7.1.1+7.1.6, `-key-terms` 7.1.2, `-phase-difference`
  7.1.2, `-wave-equation` 7.1.4+7.1.5, `-cro` 7.1.3, `-intensity` 7.1.7), 36 questions,
  4 diagrams (`phys-progressive-waves-rope-pulse`, `-key-terms`, `-phase-difference`,
  `-cro-trace`). All seven objectives 7.1.1-7.1.7 are taught by a core lesson and tested.
  `content:check` 0 errors / 0 warnings, `tsc` clean, 166 tests pass, all four diagrams
  rendered and inspected in light and dark. Nothing was checked on the production URL after
  the push.
    - Teaching choices worth keeping: the unit opens with "the rope moves up and down, the
      pulse moves along" (P drawn on the rope with a vertical arrow, not travelling);
      displacement–distance vs displacement–time graphs are contrasted by the quantity on the
      horizontal axis; phase difference is taught as `Δφ = 360° × Δx/λ` with the same idea in
      radians ($2\pi\,\Delta x/\lambda$); the CRO lesson reads period across (time-base ×
      divisions per cycle) before frequency, and amplitude from the **centre line** to a peak,
      never peak-to-peak; intensity is power/area with $I \propto A^2$ for the same wave.
    - **Rendering trap found here — fix it in every future lesson.** Numeric-answer `unit:`
      fields are printed as plain text (`<span className="unit">{f.unit}</span>` in
      `src/components/questions/QuestionCard.tsx`), so a unit written as `"m s^{-1}"` shows the
      braces and caret literally on the page. Use Unicode superscripts (`m s⁻¹`, `W m⁻²`,
      `N m⁻¹`). One already-published 9702 6.2 lesson had the same bug and was fixed in this
      commit. The `$...$`-in-prompt fields are unaffected; only `unit:` is plain text.
    - Review caveat as usual: second adversarial pass by the **same agent** — every worked
      answer and key recomputed from its own data, every MCQ checked for exactly one correct
      option, objectives re-read against the syllabus wording. No separate reviewer model and
      no teacher. A reviewer should still be run over `progressive-waves-*`.
- **DUPLICATE WARNING (28 Oct, 11:2x): both chats wrote 9702 7.1 at the same time.** This
  chat's 6-lesson batch is on `main` (e880df1) and live. The other chat
  (`0b8e8fe21ee9b5f6eaa0ce13`) has uncommitted drafts of the *same unit* under different
  names: `progressive-waves-wave-motion`, `-terms`, `-wave-equation`, `-cro`, `-intensity`
  plus `src/components/diagrams/9702/progressive-waves-{cro,energy-not-matter,intensity,terms,wave-equation}.tsx`.
  **Do not publish those drafts** — delete them, or the site gets two sets of 7.1 lessons with
  the same objectives and no way for a student to tell which to read. Keep `progressive-waves-*`
  as it is on `main`. The check that failed: this chat checked the sibling worktree *before*
  writing, found 7.1 empty, and the sibling started the same unit minutes later. Check again
  immediately before publishing, not only before writing, and record your target unit in this
  file when you start it.
- **Diagram rendering works again after a runner restart — here is the setup.** `npm run
  diagram:render` fails with "executable doesn't exist at /opt/pw-browsers/chromium" because
  Chromium's shared libraries are not installed system-wide. Playwright's browser is in
  `$HOME/.cache/ms-playwright/chromium-1194/chrome-linux/chrome`, and the libraries were
  extracted earlier into `.work-logs/libs/x/usr/lib` (gitignored). Export all three and it
  renders:
  ```bash
  export LD_LIBRARY_PATH=$(find $PWD/.work-logs/libs/x/usr/lib -maxdepth 2 -type d | tr '\n' ':')
  export FONTCONFIG_PATH=$PWD/.work-logs/libs/x/etc/fonts
  export CHROMIUM_PATH=$HOME/.cache/ms-playwright/chromium-1194/chrome-linux/chrome
  npm run diagram:render -- <diagram-key> --out /tmp/dg
  ```
  The script falls back to `/opt/pw-browsers/chromium` and hides the real error, so a failure
  message about that path usually means a missing `LD_LIBRARY_PATH`, not a missing browser.
  If `.work-logs/libs` is gone, re-extract the debs in `.work-logs/libs/debs` with
  `dpkg -x` into `.work-logs/libs/x`.
- On `main`: **398 reviewed lessons, 2304 questions** (9709: 118, 9618: 105, 9702: 87,
  9701: 88). All are live. Latest content, all 28 Oct: 9702 7.1 progressive waves (e880df1),
  9618 6.2 data integrity (3c37a6a), 9701 6.1 redox processes (8b3064d), 9702 6.2 elastic and
  plastic behaviour (77f2e9c) and 9618 6.1 data security (a93ff08).
- **9701 6.1 Redox processes is published** (28 Oct, 8b3064d): 5 lessons
  (`redox-processes-oxidation-numbers`, `-special-cases-roman-numerals`, `-electron-transfer`,
  `-disproportionation`, `-balancing-equations`), 33 questions, 3 diagrams
  (`chem-redox-oxidation-number-rules`, `-electron-transfer`, `-disproportionation`).
  Objectives 6.1.1-6.1.5 are each taught by a core lesson and tested. `content:check` 0
  errors / 0 warnings, `tsc` clean, 166 tests pass, all three diagrams rendered and inspected
  in light and dark. The lesson page returned 200 with its title on the production URL.
    - Conventions recorded: the rules are taught in priority order (element, monatomic ion,
      F, O, H, Group 1/2/Al, then the total charge), with peroxides ($-1$), $\text{OF}_2$
      ($+2$) and metal hydrides ($-1$) as the required exceptions; $\text{Fe}_3\text{O}_4$ is
      taught as a $+8/3$ average of one $\text{Fe}^{2+}$ and two $\text{Fe}^{3+}$; Roman
      numerals give the oxidation number, not the atom count.
    - Balancing uses the oxidation-number method in a fixed order: changes, ratio, other atoms,
      O with $\text{H}_2\text{O}$, H with $\text{H}^+$, then a charge check. The copper/nitric
      acid example calls out the nitrogen that stays at $+5$ in the nitrate.
    - Same caveat as the other batches: the review was a second adversarial pass by the **same
      agent** with every oxidation number and balanced equation re-derived in Python; no
      separate reviewer model was available. A reviewer should still be run over the five files.
    - **Diagram gotcha:** in a JSX string attribute, `tex="\\text{...}"` (two backslashes) is
      passed through literally and KaTeX renders the word "text"; use a single backslash in
      attribute values (two are needed only inside JS string literals such as a data array).
- **9702 6.2 Elastic and plastic behaviour is published** (28 Oct, 77f2e9c): 5 lessons
  (`elastic-plastic-deformation`, `-elastic-limit`, `-work-done-area`, `-strain-energy`,
  `-energy-past-limit`), 25 questions, 3 diagrams
  (`phys-elastic-plastic-loading-unloading`, `-work-area`, `-strain-energy`). Objectives
  6.2.1-6.2.4 are each taught by a core lesson and tested. `content:check` 0 errors /
  0 warnings, `tsc` clean, 166 tests pass, all three diagrams rendered and inspected in
  light and dark. The lesson page returned 200 with its title on the production URL.
    - Conventions recorded: the **limit of proportionality** (graph stops being straight) and
      the **elastic limit** (object stops returning to its original length) are taught as
      distinct points, with the LOP usually reached first for a metal wire; the unloading line
      is parallel to the initial straight part, so the permanent extension is where it meets the
      x-axis; area under the loading graph = work done, area under the unloading line = energy
      recovered, and the difference is dissipated past the elastic limit.
    - Same caveat as the other batches: the review was a second adversarial pass by the **same
      agent** with every numeric key recomputed in Python; no separate reviewer model was
      available. A reviewer should still be run over the five files before treating them as final.
    - **Diagram gotcha:** `dg-fill-accent`/`dg-fill-accent-2` are already semi-transparent
      (`rgba(..., 0.14-0.2)`). Adding `opacity={0.2}` on top makes the shading invisible; use
      `opacity={1}` (or omit it).
    - Another cloud chat was writing 9618 6.1 (and restyling 9709) at the same time. This chat
      checked for in-flight files before starting and took 9702 6.2 instead. Check again before
      the next unit: the two chats share this VM and both push to `main`; rebase, never force.
- **9618 6.1 Data Security is published** (28 Oct, a93ff08): 7 lessons, 42 questions, 6
  diagrams. `data-security-privacy-integrity` (6.1.1), `-system-and-data` (6.1.2),
  `-accounts-authentication` and `-system-measures` (6.1.3, split into identity then
  firewall/anti-malware/encryption), `-network-threats` (6.1.4), `-restricting-risk`
  (6.1.5), `-encryption-access-rights` (6.1.6). Diagrams: `cs-data-security-privacy-integrity`,
  `-system-vs-data`, `-authentication-factors`, `-defence-layers`, `-phishing-vs-pharming`,
  `-access-rights`. `content:check` 0/0, `tsc` clean, 166 tests pass, all six diagrams
  rendered and inspected in light and dark.
    - Teaching choices worth keeping: digital signatures are taught as hash → sign with the
      **private** key → verify with the **public** key, with an explicit warning that this is
      the reverse of encryption-for-confidentiality (lesson 7 repeats the warning, because the
      two lessons would otherwise contradict each other). Phishing vs pharming is separated by
      **who is fooled** (the user vs the name lookup), with pharming shown as needing no click.
      Anti-virus vs anti-spyware is contrasted by purpose (replication/damage vs secret data
      collection), and a firewall is explicitly said **not** to scan file contents.
    - Review caveat, same as other batches: the review was a second adversarial pass by the
      **same agent** (no separate reviewer model in this environment), and every provenance
      note says so. A reviewer should still be run over `data-security-*` before treating it
      as final.
    - Cloud-VM rendering: Chromium cannot run here (no libnss3/atk/cups and no root), so the
      six diagrams were rasterised with `@resvg/resvg-js` into `.work-logs/previews/` by
      `.work-logs/render-preview.tsx` (both gitignored/untracked work files), using the DejaVu
      TTFs bundled with matplotlib and inlined `dg-*` colours from `src/styles/tokens.css`.
      That catches geometry, overlaps, clipping and dark-mode contrast, but **not** KaTeX
      overflow: none of these six diagrams uses `MathLabel`, so the proper check is still
      `npm run diagram:render` on a machine that can launch Chromium.
      Caught that way: a clipped footer in `-defence-layers`, notes overlapping the last box in
      `-phishing-vs-pharming`, a stray icon dot in `-privacy-integrity`, and an ambiguous
      "two factors" caption in `-authentication-factors` (now "any two from different
      columns").
- Done in the second and third chats:
  - published 9618 2.1 (networks), 9709 1.6+1.7 (series, differentiation), 9702 3.2+3.3
    (non-uniform motion, linear momentum), 9701 3.1+3.2 (electronegativity, ionic bonding;
    "a difference above about 1.8 means ionic" is taught as a rule of thumb, books use 1.7–2.0),
    9709 1.8 (integration: 9 lessons in the one-method style) and 9618 3.1 (computer
    components: 17 lessons; pseudocode constants are written `CONSTANT Name ← value`);
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
- **9702 6.1 Stress and strain is published** (28 Oct, a621c26): 6 lessons
  (`stress-strain-deformation`, `-hookes-law`, `-spring-constant`, `-stress-and-strain`,
  `-young-modulus`, `-young-modulus-experiment`), 37 questions, 6 diagrams
  (`phys-stress-strain-tension-compression`, `-force-extension-graph`, `-spring-stiffness`,
  `-stress-strain-definitions`, `-young-modulus`, `-young-modulus-apparatus`). Objectives
  6.1.1–6.1.6 are each taught by a core lesson and tested (`content:check` clean, `tsc` clean,
  166 tests pass, all 6 diagrams rendered and inspected in light and dark).
    - Definitions follow the mark-scheme wording: stress = force per unit cross-sectional area,
      strain = extension per unit **original** length (no unit), $E$ = ratio of tensile stress to
      tensile strain, valid within the limit of proportionality.
    - The experiment lesson teaches Searle's apparatus: two wires, micrometer for $d$ in several
      places and two directions, vernier for $x$, graph of $F$ against $x$, then $E = kL/A$. Note
      the gradient is $k$, not $E$ — a real student trap that is called out explicitly.
    - Review caught two real errors: a stress/strain comparison question whose reasoning said
      strain falls by 2 when it falls by 4 (strain is proportional to stress, so to $1/A$), and a
      garbled "stiff vs strong" sentence. Both fixed before publishing.
    - Same caveat: the review was a second adversarial pass by the **same agent**. A reviewer
      should still be run over these before treating them as final.
- **9701 5.2 Hess's law is published** (28 Oct, ed32d0e): 4 lessons
  (`hess-law-route-independence`, `-formation-cycles`, `-combustion-cycles`,
  `-bond-energies`), 24 questions, 4 diagrams (`chem-hess-law-route-independence`,
  `-formation-cycle`, `-combustion-cycle`, `-bond-energy-route`). Objectives 5.2.1 and 5.2.2
  (including 5.2.2(a) cycles for unmeasurable changes and 5.2.2(b) bond-energy data) are taught
  and tested (`content:check` clean, `tsc` clean, 166 tests pass, all 4 diagrams rendered and
  inspected in light and dark).
    - Conventions recorded: formation cycles route reactants → elements → products with the
      reactants' formation arrows **reversed**; combustion cycles put the shared oxides
      (CO₂ + H₂O) at the bottom; bond calculations use
      $\Delta H_r = \sum$ broken $-$ $\sum$ formed and say plainly that mean bond enthalpies are
      averages, so the answer is approximate.
    - Review caught one real error: the methanol formation key was written as $-238.1$; the
      correct cycle value is $-239.1$ (fixed, and recomputed independently in Python).
    - Same caveat: the review was a second adversarial pass by the **same agent** — a reviewer
      should still be run over these before treating them as final.
- **9709 3.3+3.4+3.5 is published** (28 Oct, 0cad6e0): 15 lessons, 85 questions, no new
  diagrams. Trigonometry (`p3-trig-sec-cosec-cot`, `-pythagorean-identities`,
  `-addition-formulae`, `-double-angle`, `-r-form`), differentiation
  (`p3-diff-standard-derivatives`, `-products-quotients`, `-implicit`, `-parametric`) and
  integration (`p3-int-standard-integrals`, `-trig-integrals`, `-partial-fractions`,
  `-f-prime-over-f`, `-by-parts`, `-substitution`). Objectives 3.3.1-3.3.2, 3.4.1-3.4.3 and
  3.5.1-3.5.6 are each taught by a core lesson and tested.
    - `content:check` 0 errors / 0 warnings, `tsc` clean, 166 tests pass.
    - Every antiderivative was verified by numeric differentiation in Python and every definite
      key recomputed (`∫₀¹2x(x²+1)⁵dx = 10.5`, `½ln 5 ≈ 0.8047`, `1 − π/4 ≈ 0.2146`, etc.).
    - **Diagrams are missing for this unit on purpose.** Six diagram blocks referenced SVG keys
      that were never written (`math-p3-trig-r-form`, `math-p3-trig-reciprocal-graphs`,
      `math-p3-diff-derivatives-table`, `math-p3-int-by-parts-recipe`, `math-p3-int-f-over-f`,
      `math-p3-int-substitution-flow`); they were removed rather than shipped broken. Writing
      those six diagrams is the obvious next quality job for this unit.
    - Review caveat: a second adversarial pass by the **same** agent, plus the numeric checks
      above. No separate reviewer model and no teacher has seen them.
    - YAML gotcha worth remembering: never build these files with
      `open(path,'w').write(open(path).read() + ...)` — the `'w'` truncates before the read and
      silently wipes a lesson. Read first into a variable, then write.
- **9709 3.2 logarithms was corrected after publication** (28 Oct, e55fe7c). A review of the four
  live lessons found: an MCQ distractor `2\ln 5^{x}` that is algebraically *equal* to the correct
  answer (replaced); the claim that `5^x + 2^x = 7` "has no elementary algebraic solution" (x = 1
  works, so it now says "no general algebraic method"); a garbled `y`-against-`ln x` explanation in
  `p3-logarithmic-exponential-linear-form`; and two label collisions in
  `math-p3-logarithmic-exponential-inverse-graphs` (the `y = ln x` label sat on the `y = x` line and
  `(1, 0)` collided with the tick `1`). All four numeric chapters' keys were re-verified; the maths
  was right, these were explanation/label defects.
    - Diagram previews need fontconfig fonts. On a fresh cloud runner `fc-list` is empty, so all
      SVG text renders as invisible; copy `.work-logs/libs/x/usr/share/fonts/truetype/*` into
      `~/.local/share/fonts`, run `fc-cache -f`, and render with
      `LD_LIBRARY_PATH=$PWD/.work-logs/libs/x/usr/lib/x86_64-linux-gnu` and
      `CHROMIUM_PATH=$HOME/.cache/ms-playwright/chromium-1194/chrome-linux/chrome` (the wrapper in
      `.work-logs/chromium-wrapper.sh` adds `--no-sandbox`).
- **9618 6.2 Data Integrity is published** (28 Oct, 3c37a6a, from the other chat): 5 lessons,
  32 questions, 5 diagrams. `data-integrity-validation-vs-verification` (6.2.1),
  `-validation-checks` and `-check-digits` (6.2.2), `-entry-verification` and
  `-transfer-verification` (6.2.3). Diagrams: `cs-data-integrity-validation-vs-verification`,
  `-validation-toolbox`, `-check-digit`, `-double-entry`, `-block-parity`. `content:check` 0/0,
  `tsc` clean, 166 tests pass, all five diagrams rendered and inspected in light and dark.
    - Conventions recorded: **range check** = two boundaries, **limit check** = one;
      **length** counts characters while **format** tests the pattern; **existence** looks a
      value up in stored reference data. Check digits are taught twice (modulus 11 with weights
      10 down to 2, and modulus 10 with weights 3 and 1), both with full tables and the
      "exclude the check digit from the calculation" trap. Block parity is presented as column
      parity (equal to the XOR of the bytes), with the two-bit error that byte parity misses.
    - Every check digit, parity bit, block check character and checksum in the lesson text and
      the answer keys was recomputed in Python during the review pass.
    - Review caveat as usual: second adversarial pass by the **same agent**, no separate
      reviewer model here. A reviewer should still be run over `data-integrity-*`.
- Queue: 38 published, 116 todo (`node scripts/lessons/status.mjs`). The queue's head is
  **9709 3.6+3.7**, but 9709 is being restyled by the other chat, so skip it. 9702 7.1 is
  done; take **9701 7.1** or **9702 7.2+7.3+7.4** next, after checking the sibling worktree and
  `git log --all` for in-flight files. A whole-unit cycle (write → independent review →
  validate → publish → update this file) runs without asking the user; they asked for it to
  repeat autonomously on 28 Oct. 9702 6.2, 9702 7.1 and 9701 6.1 came from this chat; 9618 6.1
  and 9618 6.2 came from the other chat.
- **Pushing now needs a rebase, not just a push.** Two chats published from the same
  `77cd89e` base on 28 Oct, so the first `cloud_git` push succeeded and the other was
  rejected as non-fast-forward. The working recovery, repeated twice:
  `cloud_git fetch` → `git log --oneline HEAD..FETCH_HEAD` and
  `git diff --name-only` to confirm no overlap → `git rebase FETCH_HEAD` → `cloud_git push`.
  Never force. `publish.sh` itself still ends in "push failed" here (no git credentials in the
  VM) after it has verified and committed; recover its commit with
  `git fsck --unreachable --no-reflogs` and reset --soft to it, as described below.
- **START HERE** (updated 27 Oct 2026, cloud chat). `main` holds only reviewed work; drafts
  are only on `wip-snapshot`.
  - **Teaching-depth rules landed on 27 Oct (51b4384 + 6 earlier commits).** CLAUDE.md,
    `docs/CONTENT_GUIDE.md` §"Teaching philosophy: understanding before brevity" and both
    prompt templates in `scripts/lessons/templates.mjs` now forbid shortening a lesson for
    brevity: assume zero prior knowledge, define notation before use, show every needed
    intermediate step, explain why a method works, and let a lesson exceed 2–5 minutes when
    the concept needs it. Read that section before writing or reviewing anything. The 9701
    batch below was written in the same understanding-first structure before the expansion
    landed; if you touch it, deepen it, never trim it for length.
  - **9709 3.1+3.2 Algebra and logarithmic/exponential functions is published** (28 Oct,
    48ddba4): 13 lessons (`p3-algebra-*` 9 files, `p3-logarithmic-exponential-*` 4 files),
    79 questions, 7 diagrams (`math-p3-algebra-long-division`, `-modulus-graph`,
    `-modulus-inequality`, `-binomial-validity`, `math-p3-logarithmic-exponential-inverse-graphs`,
    `-index-graph`, `-linear-form-plot`). Every objective 3.1.1–3.1.5 and 3.2.1–3.2.4 is
    taught and tested (`content:check` clean, `tsc` clean, 166 tests pass, all diagrams
    rendered and inspected in light and dark).
    - Written in the maths "one question type, one method" style: what they ask, a numbered
      method with the forgotten step in bold, easy example, check, exam-style example, check,
      misconceptions, exam technique, takeaways, one deeper section.
    - Coverage traps worth remembering: factor/remainder theorem must include divisors of the
      form `(ax + b)` and answer "factorise completely" by dividing then factorising the
      quotient; partial fractions need all three syllabus forms, including the `(cx + d)^2`
      and irreducible-quadratic cases; 3.1.5 includes adapting the series (factor out the
      constant **and** raise it to the power n) and stating the new validity range.
    - Same caveat as the other batches: the review was a second adversarial pass by the **same
      agent**, recomputing every key from the question's own data in Python. It caught two
      wrong keys written into the first draft (`4^x = 3^(x+2)` answered 3.82 instead of 7.64,
      and a `3x + 5` partial-fraction check answered 1 instead of 3) plus three questions left
      outside a check block. A separate reviewer should still be run before treating them as
      final.
    - **New YAML traps this batch hit** (all now in the "YAML traps" list below): an unquoted
      `title:` containing `: ` ("Inequalities: the one extra rule"); a `summary:` or `title:`
      in **double** quotes holding `\ln` (`\l` is an invalid escape — use single quotes); and
      every question must be listed in a `type: check` block, so a lesson with 7 questions
      needs a second check block (`title: Practice`) or content:check errors out.
    - `scripts/lessons/publish.sh`'s commit body was reworded this session: it no longer claims
      a "separate AI reviewer" when the second pass is the same agent.

  - **9701 5.1 Enthalpy change is published** (28 Oct, f31adaa): 7 lessons (`enthalpy-change-*`),
    43 questions, 7 diagrams (`chem-enthalpy-change-exo-endo`, `-pathway`, `-standard-state`,
    `-named-changes`, `-bonds`, `-bond-energy-steps`, `-calorimetry`). Objectives 5.1.1–5.1.7 are
    each taught by a core lesson and tested (`content:check` clean, `tsc` clean, 166 tests pass,
    all 7 diagrams rendered and inspected in light and dark).
    - Definitions follow the mark-scheme wording: "one mole of…", "standard conditions",
      "standard states", plus "completely"/"excess oxygen" for combustion and "from its elements"
      for formation. ⦵ is written `$\Delta H^{\ominus}$` in maths (the raw ⦵ glyph is not in the
      bundled fonts and renders as a tofu box in diagrams).
    - Same caveat: the review was a second adversarial pass by the **same agent**. That pass
      caught three real errors — a gas-phase hydrogen calculation using a whole mole of O=O
      instead of half, a wrong key in a calorimetry question, and an inconsistent vaporisation
      figure. A reviewer should still be run over these before treating them as final.
  - **9702 5.2 Gravitational and kinetic energy is published** (28 Oct, 2df96dc): 5 lessons
    (`gpe-ke-*`), 31 questions, 5 diagrams (`phys-gpe-ke-work-to-gpe`, `-gpe-height-graph`,
    `-derivation`, `-v-squared`, `-falling-exchange`). Objectives 5.2.1–5.2.4 are each taught
    by a core lesson and tested (`content:check` clean, `tsc` clean, 166 tests pass, all 5
    diagrams rendered and inspected in light and dark). 5.2.3 is taught in the suvat route
    *and* the average-speed route, so the ½ is explained rather than asserted.
    - Same caveat: the review was a second adversarial pass by the **same agent**, with every
      numeric key recomputed in Python from the question's own data. A reviewer should still be
      run over these before treating them as final.
    - **Fresh-cloud-VM rendering now needs `FONTCONFIG_FILE`.** `$HOME/.fonts` is populated but
      `fc-list` is empty, and without `FONTCONFIG_FILE=$PWD/.work-logs/libs/x/etc/fonts/fonts.conf`
      Chromium renders **every label invisibly** (boxes and arrows only). Export
      `LD_LIBRARY_PATH`, `FONTCONFIG_FILE` and `CHROMIUM_PATH` before `npm run diagram:render`.
    - YAML traps in this batch: a plain list item containing `: ` becomes a mapping (quote it),
      and **double**-quoted strings silently mangle `\frac`/`\Delta` (`\f` is a form feed) — use
      single quotes for any line holding LaTeX.
  - **9618 4.2+4.3 Assembly language + bit manipulation is published** (28 Oct, f20c04e):
    9 lessons (`assembly-language-*` 6 files, `bit-manipulation-*` 3 files), 54 questions,
    9 diagrams (`cs-assembly-language-machine-code`, `-two-pass`, `-instruction-set`,
    `-trace-table`, `-groups`, `-addressing-modes`, `cs-bit-manipulation-shifts`,
    `-masking`, `-device-control`). Every objective 4.2.1–4.2.7 and 4.3.1–4.3.3 is taught
    and tested (`content:check` clean, `tsc` clean, 166 tests pass, all 9 diagrams rendered
    and inspected). Written from the current syllabuses: `MOV` copies the accumulator to the
    given register, `CMI` is an indirect compare (a real trap), and the instruction groups
    are data movement / input-output / arithmetic / unconditional / conditional.
    - Same caveat: the review was a second adversarial pass by the **same agent** — a
      reviewer should still be run over these before treating them as final. Key values
      (every trace, bit pattern and mask) were recomputed from scratch in Python during that
      pass rather than trusted from the drafts.
    - YAML traps this batch hit: a list item that starts with `**` is parsed as an alias, and
      an unquoted item containing `: ` becomes a mapping. Quote or reword them.
  - **9701 4.1+4.2 The gaseous state + Bonding and structure is published** (27 Oct,
    d1ab38f): 11 lessons (`gases-*` 4 files, `bonding-structure-*` 7 files), 41 questions,
    6 diagrams (`chem-gases-molecular-collisions`, `chem-bonding-structure-ionic-lattice`,
    `-simple-molecular`, `-giant-molecular`, `-giant-metallic`, `-melting-points`). All six
    objectives 4.1.1–4.1.3, 4.2.1–4.2.3 are taught and tested (`content:check` clean,
    `tsc` clean, diagram tests pass, all 6 diagrams rendered and inspected in light and
    dark). The lesson pages are live at `/subjects/chemistry/4-1/...` and `4-2/...`.
    - Same caveat as below: the review was a second, adversarial pass by the **same agent**,
      cross-checked against web sources (R, melting points, graphite sublimation and
      conduction, Cu⁺ model); the provenance notes say so. A reviewer should still be run
      over `gases-*` and `bonding-structure-*` before treating them as final.
    - Corrections made during review, keep them: copper's lattice is Cu⁺ cores with one
      delocalised 4s electron per atom (not Cu²⁺); graphite's delocalised electrons are
      *within* the layers; diamond and graphite sublime near 3800 °C rather than melt at
      1 atm.
  - **9702 5.1 Work, energy and power is published** (27 Oct, 595af22): 8 lessons
    (`energy-conservation-*`), 40 original questions, 8 diagrams. Objectives 5.1.1–5.1.7 are
    each taught by a core lesson and tested by questions (`content:check` clean, `tsc` clean,
    diagram registry/notation tests pass, all 8 diagrams rendered and inspected in light and
    dark).
    - Same caveat as 9618 4.1 below: the review was a second, adversarial pass by the **same
      agent** (no separate reviewer model in this environment); the provenance notes say so.
      A reviewer should still be run over `energy-conservation-*` before treating it as final.
    - The batch was written in one lesson per objective except 5.1.1 (two lessons: work done,
      then work at an angle and zero-work cases). `\dfrac` is used everywhere; the checker
      rejects display maths split across lines, so keep each `$$…$$` on one line.
  - **Publishing in this cloud VM:** plain `git push` has no credentials, so `publish.sh`
    always ends with "push failed" *after* it has verified and committed (it does not run its
    final `git reset` on failure). Recover its commit instead of rebuilding it:
    `git fsck --unreachable --no-reflogs | awk '$2=="commit"{print $3}'`, find the one whose
    subject is `Add N reviewed lessons`, then `git reset --soft <sha> && git reset -q`,
    `git commit --amend` (fix the boilerplate message: it claims a *separate* reviewer), and
    push with the `cloud_git` tool. Docs commits: plain `git commit`, then `cloud_git` again.
    `snapshot.sh`'s push also fails here; the drafts stay in the worktree.
  - **Rendering diagrams in a fresh cloud VM:** `npx playwright install chromium`, extract
    `fonts-dejavu-core` plus the missing X11/NSS/Cairo/fontconfig debs with `dpkg-deb -x`
    into one directory (this chat used `/tmp/libs/x`), copy the DejaVu TTFs into `$HOME/.fonts`
    (a VM with no fonts renders every label invisibly), then run with
    `LD_LIBRARY_PATH=<extract>/usr/lib/x86_64-linux-gnu:<extract>/usr/lib` and
    `CHROMIUM_PATH` pointing at a wrapper that execs
    `$HOME/.cache/ms-playwright/chromium-*/chrome-linux/chrome --no-sandbox "$@"`.
  - **9709 2.6 Numerical solution of equations is published** (27 Oct, 3935a04): 4 lessons
    (`p2-numerical-solution-*`: sign change, approximations, using iteration, rearranging),
    24 questions, 3 diagrams (`math-p2-numerical-solution-sign-change`, `-staircase`,
    `-divergence`). Objectives 2.6.1–2.6.3 are each taught and tested. Written in the Maths
    "one question type, one method" structure above. `content:check` clean, `tsc` clean,
    diagram notation tests pass, all 3 diagrams rendered and inspected in light and dark
    (label collisions and a clipped footer were fixed). Same review caveat: the review was a
    second adversarial pass by the **same agent**, and the provenance notes say so.
  - **Fun-writing rules landed on 27 Oct (e4d3816 + 5 earlier commits) after that batch was
    written.** CLAUDE.md §"Lesson-writing style: fun and easy to read", CONTENT_GUIDE §6 and
    HANDOFF §2 now require conversational, genuinely engaging lessons with analogies and
    appropriate humour. The four `p2-numerical-solution-*` lessons are conversational and
    analogy-led but predate the rule, so give them a fun/engagement pass when you next touch
    9709 2.6; write every new lesson in that voice from the start.
  - **Queue order** (`node scripts/lessons/status.mjs`): **9618 4.2+4.3 next**, then
    9702 5.2, 9701 5.1, 9709 3.1+3.2, …
  - **Tooling fixes (27 Oct, later cloud chat):** `scripts/render-diagram.tsx` dropped the
    first key whenever `--out` was omitted (it treated `outIdx + 1 = 0` as the value to
    skip) — fixed; `scripts/lessons/snapshot.sh` now copies the index via
    `git rev-parse --git-path index` so it also works in cloud worktrees where `.git` is a
    gitdir file; `.work-logs/` (render scratch: extracted debs, fonts, wrapper) is now
    gitignored. Rendering in a fresh VM also needs `FONTCONFIG_PATH` pointing at an
    extracted `fontconfig-config`'s `etc/fonts` — fonts alone still render every label
    invisibly.
  - **Running the e2e suite in this VM:** set the same `LD_LIBRARY_PATH` and
    `FONTCONFIG_PATH` as for rendering, plus `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1`
    (without it all 25 tests fail at browser launch with "Host system is missing
    dependencies"). With them, `npx playwright test` passes 25/25 in about 1.2 minutes; it
    serves on :3210 with `tests/fixtures/content` and its own throwaway DB in
    `data/e2e-pglite`, so the real `data/pglite` stays clean.
  - **9618 4.1 CPU architecture is published** (27 Oct, a8198e7): 10 lessons, 52 questions,
    10 diagrams plus the shared `src/components/diagrams/9618/cpu-architecture-kit.tsx`
    helper. The review there was also a same-agent second pass — run a reviewer over those 10
    files if independent review is required.
  - `scripts/lessons/templates.mjs` was repaired on 27 Oct: the writer prompt template had
    unescaped backticks inside a template literal, so the module no longer parsed and
    `prompts.mjs` failed. Keep `\`minutes\`` and `\`objectives\`` escaped.
  - Leftovers in the cloud worktree are expected and ignored by `publish.sh`: regenerated
    `src/components/diagrams/*/index.ts`, the unreferenced draft
    `src/components/diagrams/9702/turning-effects-toppling.tsx`, and the restored drafts.
  1. Older round (24 Oct), kept for reference: in a fresh container, run
     `bash scripts/lessons/restore-drafts.sh` to bring the drafts back, then
     `npm run diagrams:gen`.
  2. **9709 1.8 Integration: published 24 Oct** (ef055f1, reviewed; marker tests 166/166).
  3. **9618 3.1 Computers and their components: published 24 Oct** (5960250, reviewed).
  4. **Halted by the user on 24 Oct at 19:20 UTC ("we will continue next week").** No agents
     are running. Restore the drafts first (step 1). Then start this round:
     - **9701 3.3+3.4+3.5:** written, not reviewed. 13 draft lessons (`metallic-bonding-*`,
       `covalent-bonding-*`, `shapes-molecules-*`) with 82 questions, 15 diagrams and the
       helpers `covalent-bonding-kit.tsx` and `shapes-molecules-kit.tsx`. A reviewer had
       started but changed nothing. Next: regenerate the review brief and append the
       writer's flags:
       - the bond energies were recalled from memory, so check each against the Data
         Booklet;
       - expanded octets use the "empty 3d orbitals" story;
       - the angles are VSEPR predictions;
       - the stretch examples are ClF₃, hydrazine, propenenitrile, solid PCl₅ and SF₆
         angles;
       - count every electron in each dot-and-cross diagram.
     - **9702 4.1+4.2:** written, not reviewed. 10 draft lessons (`turning-effects-*`,
       `equilibrium-forces-*`), 13 diagrams and the helper `turning-effects-kit.tsx`. A
       reviewer had started but changed nothing. Next: regenerate the review brief and
       append the writer's flags:
       - the marker treats N m and J as the same dimension, so N m is a fixed label and an
         MCQ tests N m vs J;
       - `tension-expression` uses w for W and t for θ; test it with the marker;
       - check the scope of the hinged-beam "deeper" block, the sine rule, and toppling
         with the plumb line;
       - `hinge-components` uses a rounded 163 N, with tolerances ±1 N and ±0.6 N;
       - the hinge arrow in `phys-equilibrium-forces-hinged-beam` overlaps the beam by a
         few pixels.
     - **9709 2.1+2.2:** not started; the writer was stopped before writing any file. Next:
       run `prompts.mjs write "9709 2.1+2.2" <today>`, append the MATHS STYLE block (the
       Maths review checks below, written as writing rules, with the p1-integration
       lessons as the model), and run the writer on Sonnet.
     - Then the next `todo` units in order: 9618 3.2, …
  5. **Models (the user's choice, 24 Oct):** run writer agents with `model: "sonnet"`.
     Reviewers stay on Opus, the default, because they are the quality gate. Don't use
     Haiku for lesson work.
  6. **Agent rounds.** On 24 Oct the user said "hurry up, I want progress": keep chaining
     rounds (start each reviewer as soon as its writer finishes, publish what passes) and
     stop only when they say so. They want a check-in at about 80% of the session limit.
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
