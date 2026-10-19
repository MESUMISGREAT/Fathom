# Exam question bank and AI-assisted question generation

Design study for Phases 2–3. Status: **draft for review** (2026-10-19).
Scope: the exam-practice bank (data model, sources, labelling), the generation and
validation pipeline, parametric variants, the copyright policy, diagrams, timed practice
and full-paper assembly, quality monitoring, and generation cost.
Out of scope (sibling studies in `docs/design/`): AI marking of uploaded handwritten work,
the tutor dialogue, and grade prediction. This document defines the contracts those
components consume: item content, mark-scheme semantics, per-mark-point evidence, and
item statistics.

> **Not legal advice.** Section 5 describes engineering safeguards and a working policy.
> It must be reviewed by a qualified IP lawyer before any generated or licensed item is
> shown to students. The questions to put to the lawyer and to Cambridge are listed in
> §5.7–5.8.

---

## 0. Decisions in one table

| # | Decision | Why |
|---|---|---|
| D1 | One item schema for all sources (`original`, `cambridge-style`, `licensed-past-paper`), with `source`, `provenance` and `licence` fields that drive labelling and access. | One renderer, one marking engine, one stats pipeline; labelling is computed, not hand-written. |
| D2 | Mark schemes are **structured data** (mark points with type M/A/B/DM/C, `dependsOn`, `impliedBy`, FT rules, group caps, alternative methods, special cases). A deterministic engine computes marks from per-mark-point evidence. AI, self-assessment or a teacher only supply evidence. | Marks are reproducible and explainable; AI judgement never silently sets a total. |
| D3 | AI-generated items reach students only after **human teacher review** (default). Unreviewed items never feed full-paper simulations or grade prediction. | Wrong answer keys do real harm; the brief requires validation before content is treated as reliable. |
| D4 | Generation is an **offline batch job** (Message Batches API, 50% off) on `claude-opus-5-5`, never on a student request path. No student data enters generation prompts. | Cost, latency, privacy. |
| D5 | Every computable claim in an item (derivatives, roots, unit dimensions, equation balance, trace tables) is checked by a **deterministic verifier**, not by an AI. AI checks (independent solve, ambiguity) are a second, independent layer. | Models share failure modes with themselves; CAS and interpreters do not. |
| D6 | **Parametric templates** (human-authored, enumerated and verified at build time) are the default way to get many variants. No AI call per variant. Variants form one *family* for exposure and calibration. | Cheap, deterministic, reviewable once. |
| D7 | Past-paper text is never placed in a prompt unless a written licence explicitly permits AI processing and derivative works. Every candidate passes an **originality check** (lexical, semantic, structural) before review. | Changing numbers is not originality; memorised content can surface without being in the prompt. |
| D8 | Licensed Cambridge content is **never stored in git** (DB + object storage only), carries licence id/terms/expiry/territories, and is filtered at query time. | Takedown and expiry must be able to actually delete it. |
| D9 | Diagrams are generated from **typed parameter specs by deterministic renderers** (SVG); the AI writes specs, never SVG. Specs are checked against the item's givens (circuit solved, forces summed, points on curves). | Diagram–text mismatch is a common, silent failure. |
| D10 | Difficulty starts as an estimate (band 1–5 → logit prior) and is replaced by IRT (Rasch / partial-credit) calibration from first, unassisted attempts. | The brief's grade prediction needs paper difficulty, not raw averages. |

---

## 1. What is deterministic, what is AI, what is human

| Step | Deterministic code | AI (Claude) | Human |
|---|---|---|---|
| Schema, mark totals, dependency graph, tags exist in syllabus | ✔ (zod + validator) | | |
| Maths answers (derivatives, roots, integrals, intervals, probabilities) | ✔ (SymPy in sandbox) | | Confirms claims marked `unsupported` |
| Physics units, dimensions, magnitudes, s.f. policy | ✔ (existing `units.ts` engine) | | |
| Chemistry balance, charge, stoichiometry, structure validity | ✔ (formula parser, RDKit, OPSIN) | | Reaction products outside the rule table |
| CS trace tables, outputs, logic, SQL, conversions | ✔ (own pseudocode interpreter, sandboxed runners) | | |
| Writing the candidate question, mark scheme, solution, hints, diagram spec | | ✔ | Or a human author |
| Solving the question without the key | | ✔ (independent call) | |
| Finding alternative interpretations | Lints (missing accuracy instruction etc.) | ✔ | |
| Originality | ✔ (n-gram, embeddings, structure) | Advisory only | ✔ escalations |
| Initial difficulty | Feature model | ✔ rubric rating | ✔ reviewer band |
| Calibrated difficulty | ✔ (IRT from response data) | | |
| Approve for students | | | ✔ always |
| Marks for a student's attempt | ✔ engine over evidence | Evidence for working-based mark points (tutor study) | Self-assessment / teacher |

---

## 2. Question bank data model

### 2.1 Concepts

| Concept | Definition |
|---|---|
| **Item** | One exam question: shared stem, ordered parts, total marks, metadata, provenance. Stable id. |
| **Part / sub-part** | `(a)`, `(b)(i)`. Exactly two levels (part → sub-part); Cambridge papers rarely go deeper, and a fixed depth keeps the structured-output JSON schema non-recursive. A part with sub-parts carries no marks itself. |
| **Leaf** | A part or sub-part that is answered and marked. Every leaf has `marks`, `answer` (typed-input fields), `markScheme`, `solution`, `hints`. |
| **Mark point** | One creditable element of a leaf's mark scheme: type, marks (usually 1), criteria text, optional deterministic `check`, dependencies. |
| **Method** | A complete alternative set of mark points for a leaf (e.g. "P = Fv" vs "energy per second"). A leaf scores the **maximum over methods**, never a sum. |
| **Version** | Immutable snapshot of an item. Attempts reference `(itemId, version)`. Any content change after publication creates a new version. |
| **Family** | Items that a student would recognise as "the same question": all variants of a template, or a revised item and its predecessor. Exposure control and calibration operate on families. |
| **Template** | A parametric item (§4.12) that produces variants deterministically from a seed. |

### 2.2 Item file (YAML, maths example, complete)

Authoring format, one file per item, validated by a new `QuestionItemSchema` (zod)
alongside `src/content/schema.ts`. The DB stores the same structure as canonical JSON in
`question_versions.content`. This example is an original item written for this document.

```yaml
id: q-9709-p1-1-7-cubic-stationary-0001
version: 3
subject: "9709"
syllabus: cambridge-9709-2026          # id from content/subjects/9709/syllabus.yaml
component: P1                           # paper the item is written for
source: cambridge-style                 # original | cambridge-style | licensed-past-paper
type: structured                        # see §2.4 for the type vocabulary
title: Stationary points of a cubic and a horizontal line   # staff-facing only
calculator: allowed
defs:                                   # named expressions usable by checks and FT rules
  f: "x^3 - 6x^2 + 9x + 2"
stem: |
  The function $\mathrm{f}$ is defined by $\mathrm{f}(x) = x^3 - 6x^2 + 9x + 2$
  for $x \in \mathbb{R}$.
parts:
  - label: a
    prompt: Find the $x$-coordinates of the stationary points of the curve $y = \mathrm{f}(x)$.
    marks: 3
    commandWords: [find]
    objectives: ["1.7.5"]               # illustrative code; real codes come from syllabus.yaml
    primaryObjective: "1.7.5"
    ao: [AO1]
    examSkills: [differentiate-polynomial, solve-quadratic]
    answer:                             # typed-input mode; each field is checked deterministically
      fields:
        - name: fprime
          label: "f′(x) ="
          required: false               # optional "show your derivative" field
          check: { kind: expression, answer: "3x^2 - 12x + 9", variables: [x] }
        - name: x
          label: "x ="
          check: { kind: numeric-set, values: [1, 3] }
    markScheme:
      methods:
        - id: std
          points:
            - id: B1
              type: B
              criteria: Correct derivative $3x^2 - 12x + 9$ (or equivalent) seen.
              evidenceFrom: { field: fprime }
            - id: M1
              type: M
              criteria: Sets their 3-term quadratic derivative equal to 0 and attempts to solve it.
              impliedBy: [A1]           # a correct final answer is evidence of the method
            - id: A1
              type: A
              dependsOn: [M1]
              criteria: $x = 1$ and $x = 3$ only.
              evidenceFrom: { field: x }
              flags: [cao]
    commonErrors:
      - id: ce-sign
        description: Sign error in the derivative, giving $3x^2 + 12x + 9$ and $x = -1, -3$.
        detect: { field: x, check: { kind: numeric-set, values: [-1, -3] } }
        consequence: "B0 M1 A0"
        feedback: Check the sign when you differentiate $-6x^2$.
    solution:
      - text: $\mathrm{f}'(x) = 3x^2 - 12x + 9$
        earns: [B1]
      - text: $3x^2 - 12x + 9 = 0 \Rightarrow 3(x-1)(x-3) = 0$
        earns: [M1]
      - text: $x = 1$ or $x = 3$
        earns: [A1]
    hints:
      - level: 1
        text: At a stationary point, what is the gradient of the curve?
      - level: 2
        text: Differentiate, set $\mathrm{f}'(x) = 0$, and look for a common factor first.
      - level: 3
        text: "$\\mathrm{f}'(x) = 3(x^2 - 4x + 3)$. Factorise the bracket."

  - label: b
    prompt: Find the coordinates of each stationary point and determine its nature.
    marks: 3
    commandWords: [find, determine]
    objectives: ["1.7.5"]
    primaryObjective: "1.7.5"
    ao: [AO1, AO2]
    examSkills: [classify-stationary-points]
    answer:
      fields:
        - { name: max, label: "Maximum point", check: { kind: coordinates, value: [1, 6] } }
        - { name: min, label: "Minimum point", check: { kind: coordinates, value: [3, 2] } }
    markScheme:
      methods:
        - id: std
          points:
            - id: B1
              type: B
              criteria: $\mathrm{f}(1) = 6$ and $\mathrm{f}(3) = 2$, FT their $x$-values from (a).
              evidenceFrom: { fields: [max.y, min.y] }
              ft: { uses: [a.x], expect: "f(a.x)" }      # expected y = f at the student's own x
            - id: M1
              type: M
              criteria: >-
                Valid method for the nature of at least one point: evaluates
                $\mathrm{f}''(x) = 6x - 12$ at their $x$, or tests the sign of $\mathrm{f}'(x)$
                either side.
            - id: A1
              type: A
              dependsOn: [M1]
              criteria: $(1, 6)$ maximum and $(3, 2)$ minimum, both correct.
              evidenceFrom: { fields: [max, min] }
              flags: [cao]
    solution:
      - { text: "$\\mathrm{f}(1) = 6,\\ \\mathrm{f}(3) = 2$", earns: [B1] }
      - { text: "$\\mathrm{f}''(x) = 6x - 12$; $\\mathrm{f}''(1) = -6 < 0$, $\\mathrm{f}''(3) = 6 > 0$", earns: [M1] }
      - { text: "$(1, 6)$ is a maximum, $(3, 2)$ is a minimum.", earns: [A1] }
    hints:
      - { level: 1, text: "Substitute each $x$ into $\\mathrm{f}(x)$ for the $y$-coordinates." }
      - { level: 2, text: "Find $\\mathrm{f}''(x)$ and look at its sign at each point." }

  - label: c
    prompt: >-
      The line $y = c$ meets the curve $y = \mathrm{f}(x)$ at three distinct points.
      Find the set of possible values of $c$.
    marks: 2
    commandWords: [find]
    objectives: ["1.7.5", "1.2.3"]
    primaryObjective: "1.7.5"
    ao: [AO2]
    examSkills: [interpret-graph]
    answer:
      fields:
        - name: c
          label: "Values of c"
          check: { kind: interval, lower: 2, upper: 6, lowerClosed: false, upperClosed: false }
    markScheme:
      methods:
        - id: std
          points:
            - id: M1
              type: M
              criteria: Uses the $y$-coordinates of both stationary points as the bounds for $c$.
              impliedBy: [A1]
            - id: A1
              type: A
              dependsOn: [M1]
              criteria: $2 < c < 6$ (strict). FT their $y$-values from (b).
              evidenceFrom: { field: c }
              ft:
                uses: [b.min.y, b.max.y]
                expect: { kind: interval, lower: "b.min.y", upper: "b.max.y", lowerClosed: false, upperClosed: false }
                require: "b.min.y < b.max.y"      # FT is not given if their values make the problem trivial or invalid
    commonErrors:
      - id: ce-inclusive
        detect: { field: c, check: { kind: interval, lower: 2, upper: 6, lowerClosed: true, upperClosed: true } }
        consequence: "M1 A0"
        feedback: >-
          At $c = 2$ or $c = 6$ the line touches the curve at a stationary point, so there
          are only two distinct intersection points.
    solution:
      - { text: "Three intersections need $c$ strictly between the minimum and maximum values.", earns: [M1] }
      - { text: "$2 < c < 6$", earns: [A1] }

meta:                                   # derived fields are recomputed by the validator
  marks: 8                              # = sum of part marks (validated)
  estMinutes: 12                        # = ceil(8 × 110/75); later replaced by median observed time
  topics: ["1.7", "1.2"]
  difficulty: { band: 3, b: 0.0, bSe: 1.0, source: estimate }   # §4.11
  verify: { coverage: 1.0 }             # share of final answers established by a passing verifier claim
verify:                                 # machine-checkable claims; see §4.4.2
  maths:
    claims:
      - { id: c1, part: a, kind: derivative, of: f, var: x, equals: "3x^2 - 12x + 9" }
      - { id: c2, part: a, kind: real-roots, expr: "3x^2 - 12x + 9", var: x, equals: [1, 3] }
      - { id: c3, part: b, kind: value, expr: f, at: { x: 1 }, equals: 6 }
      - { id: c4, part: b, kind: value, expr: f, at: { x: 3 }, equals: 2 }
      - { id: c5, part: b, kind: sign, expr: "6x - 12", at: { x: 1 }, sign: negative }
      - { id: c6, part: b, kind: sign, expr: "6x - 12", at: { x: 3 }, sign: positive }
      - { id: c7, part: c, kind: distinct-real-root-count, expr: "f - c", var: x, param: c,
          count: 3, equals: { interval: [2, 6], lowerClosed: false, upperClosed: false } }
diagrams: []
provenance:
  origin: ai-generated                  # human | ai-generated | ai-assisted | parametric
  status: human-reviewed                # see §2.10
  generator:
    model: claude-opus-5-5
    promptVersion: qgen-9709-v4
    blueprint: bp-9709-p1-1-7-stationary-b3-8m
    runId: run-2026-11-02-014
    createdAt: 2026-11-02
  checks:                               # summary; full results in qgen_checks
    schema: pass
    verifier: { tool: "sympy (pinned)", claims: 7, pass: 7, unsupported: 0 }
    independentSolve: { model: claude-opus-5-5, agree: true }
    ambiguity: { blocking: 0, minor: 0 }
    originality: { c5Max: 0.06, longestRun: 6, cosineMax: 0.71, structural: none, decision: pass }
  reviews:
    - { by: "teacher:t014", at: 2026-11-04, decision: approve-with-edits, minutes: 11,
        notes: "Made (c) say 'three distinct points'." }
licence: null
```

Check of the worked numbers: f′(x) = 3(x − 1)(x − 3); f(1) = 1 − 6 + 9 + 2 = 6;
f(3) = 27 − 54 + 27 + 2 = 2; f″(1) = −6, f″(3) = 6. For part (c), the discriminant of
x³ − 6x² + 9x + (2 − c) is −27d(d + 4) with d = 2 − c, which is positive exactly when
2 < c < 6. That is the claim `c7` the verifier computes.

### 2.3 Physics excerpt: units, s.f., compensatory marks, alternative methods

```yaml
id: q-9702-p2-5-1-motor-efficiency-0001
subject: "9702"
component: P2
source: original
givens:                                  # every numeric given has a unit; used by verifier and FT
  m: "1.2 kg"
  v: "0.35 m s^-1"
  V: "12 V"
  I: "0.60 A"
constants: { g: "9.81 m s^-2" }          # data-sheet value
stem: |
  A small electric motor lifts a load of mass 1.2 kg vertically at a constant speed of
  $0.35\ \text{m s}^{-1}$. The potential difference across the motor is 12 V and the
  current in it is 0.60 A.
parts:
  - label: a
    prompt: Calculate the useful output power of the motor.
    marks: 2
    commandWords: [calculate]
    answer:
      fields:
        - name: P
          check: { kind: numeric, value: 4.1202, tolerance: { rel: 0.01 },
                   sigFigs: { min: 2, max: 4 }, acceptUnits: [W, "J s^-1"] }
    markScheme:
      methods:
        - id: force-velocity
          points:
            - { id: C1, type: C, criteria: "Uses $P = Fv$ with $F = mg$.", impliedBy: [A1] }
            - { id: A1, type: A, criteria: "4.1 W (2 s.f. or more).", evidenceFrom: { field: P } }
        - id: energy-per-time
          points:
            - { id: C1, type: C, criteria: "Uses $P = mg\\Delta h / t$ with $\\Delta h / t = v$.", impliedBy: [A1] }
            - { id: A1, type: A, criteria: "4.1 W (2 s.f. or more).", evidenceFrom: { field: P } }
    commonErrors:
      - { id: ce-g10, detect: { field: P, check: { kind: numeric, value: 4.2, tolerance: { rel: 0.002 } } },
          consequence: "C1 A0", feedback: "Use g = 9.81 m s⁻² from the data list." }
      - { id: ce-mass, detect: { field: P, check: { kind: numeric, value: 0.42, tolerance: { rel: 0.01 } } },
          consequence: "C0 A0", feedback: "The force needed is the weight mg, not the mass." }
  - label: b
    prompt: Calculate the efficiency of the motor.
    marks: 2
    commandWords: [calculate]
    answer:
      fields:
        - name: eff
          check: { kind: numeric, value: 0.57225, tolerance: { rel: 0.01 },
                   sigFigs: { min: 2, max: 4 }, forms: [ratio, percent] }
    markScheme:
      methods:
        - id: std
          points:
            - { id: C1, type: C, criteria: "Input power $VI = 7.2$ W used as the denominator.", impliedBy: [A1] }
            - id: A1
              type: A
              criteria: "0.57 or 57%. FT their (a) ÷ 7.2."
              evidenceFrom: { field: eff }
              ft: { uses: [a.P], expect: "a.P / (V * I)", require: "a.P < V * I" }
  - label: c
    prompt: Suggest one reason why the efficiency is less than 100%.
    marks: 1
    commandWords: [suggest]
    answer: { fields: [ { name: reason, check: { kind: criteria } } ] }
    markScheme:
      methods:
        - id: std
          groups: [ { points: [B1a, B1b, B1c], max: 1 } ]          # "any one from"
          points:
            - { id: B1a, type: B, criteria: "Thermal energy dissipated in the resistance of the motor's coil." }
            - { id: B1b, type: B, criteria: "Work done against friction in the bearings/axle." }
            - { id: B1c, type: B, criteria: "Energy transferred as sound." }
```

Worked numbers: P = 1.2 × 9.81 × 0.35 = 4.1202 W; VI = 7.2 W; efficiency
4.1202 / 7.2 = 0.5722. With g = 10 the answer is 4.2 W, which differs from 4.1 W at 2 s.f.,
so the common error is distinguishable. That is the error-discrimination check in §4.4.1 (S08).

### 2.4 Metadata tags required by the brief

| Brief tag | Field | Level | Notes |
|---|---|---|---|
| Subject | `subject` | item | `9709` etc. |
| Syllabus version | `syllabus` | item | Points to `syllabus.id` in the syllabus YAML (which records `sourceVersion`). When a syllabus changes, items are re-tagged or retired; the validator rejects objective codes that do not exist in the referenced syllabus. |
| Topic / subtopic | `meta.topics` (derived) and part `objectives` | part | Topic = objective prefix. |
| Learning objective | `objectives`, `primaryObjective` | part | `primaryObjective` drives mark allocation in paper assembly (§7). |
| Type | `type` (item), `answer.fields[].check.kind` (leaf) | both | Item types: `mcq`, `short-answer`, `structured`, `show-that`, `extended-response`, `data-analysis`, `practical-planning`, `trace`, `algorithm-design`, `programming`. |
| Difficulty | `meta.difficulty` `{band 1–5, b, bSe, source: estimate\|calibrated}` | item (+ per-part `b` once calibrated) | Recall questions keep their 1–3 scale; exam items use 1–5. |
| Marks | `marks` per leaf, `meta.marks` | both | Validated sums. |
| Est. time | `meta.estMinutes` | item | `ceil(marks × componentMinutes / componentMarks)` from the paper spec, replaced by the observed median once n ≥ 30. |
| Exam skills | `ao` (Cambridge assessment objectives) + `examSkills` (controlled vocabulary per subject in `content/taxonomy/<code>/skills.yaml`) | part | E.g. 9618: `trace-algorithm`, `write-pseudocode`, `data-representation`; 9702: `quantitative-calculation`, `graph-analysis`, `experimental-planning`, `uncertainty-analysis`. |
| Mark scheme / expected answer | `markScheme`, `answer` | leaf | Machine-readable; §2.5. |
| Solution explanation | `solution[]` with `earns` | leaf | Each step names the mark points it earns, so the step-by-step reveal and the mark scheme cannot drift apart. |
| Command words | `commandWords` | leaf | Must be in the subject's command-word list and must appear in the prompt. Our definitions are paraphrased, not copied. |
| Diagrams | `diagrams[]` (item) or `diagram` (part) | both | Spec + alt text; §6. |
| Provenance / licence / review | `provenance`, `licence` | item | §2.10, §3. |

### 2.5 Mark-scheme semantics and the scoring engine

Cambridge conventions vary by subject. 9709 uses M (method), A (accuracy, dependent on
M), B (independent) and DM (method dependent on an earlier M). Physics schemes also use C
(compensatory) marks. Abbreviations such as FT, cao, awrt, oe, isw, AG and SC appear across
subjects. **Verify each subject's conventions against its current published marking
principles. Encode the semantics; paraphrase the wording.**

| Type / flag | Engine semantics |
|---|---|
| `M` | Method mark. Awarded on evidence of the method; arithmetic slips do not remove it. |
| `DM` | As `M`, with `dependsOn` naming the earlier `M` (required by the validator). |
| `A` | Accuracy mark. `dependsOn` defaults to the nearest preceding `M`/`DM` in the same method; the validator makes it explicit. |
| `B` | Independent mark. No default dependency. |
| `C` | Compensatory mark: awarded for working when the final answer is wrong. Encoded as a point with `impliedBy: [<final A>]`, so a correct answer earns it automatically. |
| `impliedBy: [p…]` | Evidence for any listed point counts as evidence for this point. Evidence-level, not award-level, so there is no cycle with `dependsOn`. |
| `ft` | The expected value is computed from the student's own earlier values (`uses`), and the `check` is re-run against it. `require` states when FT is not given (e.g. their values make the problem trivial or invalid). |
| `groups[].max` | "Any *n* from" lists: awarded points in the group are capped at `max`. |
| `cao` | No FT and no tolerance beyond the check's own. |
| `awrt` | The check's `tolerance` and `sigFigs` express it; the flag is for display. |
| `oe` | Expression equivalence (`kind: expression`) instead of a string match. |
| `isw` | Marker instruction: after a correct answer is seen, later incorrect working is ignored. Relevant to AI/teacher evidence only. |
| `AG` (answer given, "show that") | The final value is in the question, so a final-answer check is meaningless. All marks need working evidence; `impliedBy` is forbidden on such leaves (validator rule). |
| `specialCases[]` | Alternative scoring, e.g. `{ id: SC1, when: ce-x, marks: 1 }`. Scored as an extra "method"; max over all. |

**Evidence.** For each mark point, the engine receives evidence:
`{ value: true | false | null, source: auto | ai | self | teacher, confidence?, quote? }`.
`null` means unknown (e.g. working not shown in typed mode). `auto` evidence comes only from
`evidenceFrom` fields checked by the deterministic checker. The tutor/marking study defines
how AI evidence for working-based points is produced. This engine only consumes it.

**Algorithm** (pure function, `src/domain/marking/engine.ts`, three-valued logic):

```ts
type Tri = true | false | null;
const and = (a: Tri, b: Tri): Tri => (a === false || b === false ? false : a === null || b === null ? null : true);
const or  = (a: Tri, b: Tri): Tri => (a === true  || b === true  ? true  : a === null || b === null ? null : false);

function scoreLeaf(leaf: Leaf, ev: Map<string, Evidence>, ctx: FtContext): LeafScore {
  const schemes = [...leaf.markScheme.methods, ...(leaf.markScheme.specialCases ?? []).map(asMethod)];
  let best: LeafScore | undefined;
  for (const m of schemes) {
    const award = new Map<string, Tri>();
    for (const p of topoSort(m.points, (p) => p.dependsOn ?? [])) {   // validator guarantees a DAG
      let own: Tri = ev.get(p.id)?.value ?? null;
      for (const q of p.impliedBy ?? []) own = or(own, ev.get(q)?.value ?? null);
      for (const d of p.dependsOn ?? []) own = and(own, award.get(d) ?? false);
      award.set(p.id, own);
    }
    const sure = capByGroups(m, award, (v) => v === true);            // marks certainly earned
    const possible = capByGroups(m, award, (v) => v !== false);       // if every unknown went the student's way
    const s = { method: m.id, min: Math.min(sure, leaf.marks), max: Math.min(possible, leaf.marks), award };
    if (!best || s.min > best.min || (s.min === best.min && s.max > best.max)) best = s;
  }
  return best!;
}
```

The leaf result is a **range** `[min, max]`. In typed mode, a student who types only the
final answers to (b) above gets B1 (auto, FT-checked) and A1's evidence, but A1 depends on
M1, which needs working. The result is "1–3 of 3, 2 marks depend on working". The UI then
offers: upload working (AI evidence), self-assess against the mark point, or leave it
pending. Pending marks are excluded from grade-prediction evidence, or included at reduced
weight; the grade-prediction study decides which.

**FT evaluation.** For a point with `ft`, the engine resolves `uses` from the student's own
parsed answers to earlier fields, evaluates `require` and then `expect` (expression grammar
from `src/domain/answers/expression.ts`, plus `min`, `max` and `count`), and runs the point's
check against the computed expectation. If an earlier value is missing or unparseable, FT
evidence is `null`.

**Unit tests are part of the item.** `commonErrors[].consequence` (e.g. `"C1 A0"`) is an
assertion: the validator feeds the detect value through the engine and requires that exact
award pattern. A mark scheme that does not score its own documented errors as intended fails
validation.

### 2.6 Answer check kinds

The existing checker (`checkAnswer` in `src/domain/answers/check.ts`) covers `numeric`,
`expression`, `text`, `cloze`, `mcq`, `spot-error` and `explain`. Exam leaves need these
extensions (deterministic, server-side, all with `invalid` for unparseable input so nothing
is recorded):

| `kind` | Spec | Notes |
|---|---|---|
| `numeric` | existing + `sigFigs: {min, max}` range, `forms: [ratio, percent]` | Physics/chemistry accept a range of s.f.; current schema has exact `sigFigs`. |
| `numeric-set` | `values`, `ordered: false`, tolerance | Roots, multiple solutions. |
| `coordinates` | `value: [x, y]` or set of points | Accepts `(1, 6)`, `x=1, y=6`. |
| `interval` | `lower`, `upper`, closed flags, `union` of intervals | Accepts `2 < c < 6`, `(2, 6)`, `{c : 2 < c < 6}`. |
| `angle-set` | values, unit `deg\|rad`, range | Trig equations on an interval. |
| `exact-form` | e.g. `a + b√c`, `a/b`, `k·π` | For "give your answer in exact form"; rejects decimals. |
| `chem-formula` / `chem-equation` | species, coefficients, `stateSymbols: required\|optional\|ignored` | Parser shared with the chemistry verifier. |
| `chem-structure` | canonical SMILES / InChI | Student input via a structure editor (Phase 3); compare canonical forms. |
| `trace-table` | columns, rows, `blankMeansUnchanged` | Cell-by-cell; matches Cambridge-style "only show changed values" convention if the item says so. |
| `code` | language, test cases, timeouts | Sandboxed runner; §4.4.2. |
| `criteria` | none | Not machine-checkable; evidence from AI, self or teacher only. |

### 2.7 Hints, solutions, common errors

* `hints` (≤ 3 levels per leaf): level 1 names the idea, level 2 the first step, level 3
  a worked step. The validator rejects hints that contain a final answer value
  (numbers in hints ⊆ givens ∪ numbers in earlier parts' answers).
  The tutor offers these validated hints before generating its own, which serves the
  brief's "prefer hints" rule with content that has been checked.
* `solution[]` steps each `earn` mark points; every mark point of at least one method is
  earned by some step (validator).
* `commonErrors` are real mistakes with a deterministic `detect` where possible, a
  `consequence` (asserted, §2.5) and `feedback`. They power instant feedback in typed mode
  and seed the tutor.

### 2.8 Storage

**Source of truth.**

| Content | Where | Why |
|---|---|---|
| Original and Cambridge-style items, templates, blueprints, paper specs | YAML in git: `content/subjects/<code>/questions/<topic>/<id>.yaml`, `content/subjects/<code>/templates/…`, `content/subjects/<code>/papers/<component>.yaml` | Same review-by-PR model as lessons; history = audit trail. |
| Generation candidates, check results, review records | Postgres (`qgen_*`, `reviews`) | High volume, mostly discarded. |
| Licensed past-paper items and licence documents | Postgres + encrypted object storage, **never git** | Expiry and takedown must delete; git history makes deletion impractical. |
| Originality comparison corpus (if lawful, §5.3) | Separate schema, separate credentials, encrypted | Not readable by the prompt builder or the app. |

Phase 2: generated YAML goes to a PR and teachers review a rendered preview on a staff-only
route. Phase 3: the in-app review queue commits approved items through a bot using the
GitHub API, with the reviewer identity in `provenance.reviews`. Teachers never need git.
`content:import` loads YAML into the tables below. Content is keyed by `content_hash`, so an
unchanged file is a no-op and a changed file becomes a new version.

**Tables** (Postgres via Drizzle; abbreviated DDL):

```sql
create table questions (
  id               text primary key,                 -- q-9709-p1-1-7-cubic-stationary-0001
  subject_code     char(4) not null,
  syllabus_id      text not null,
  component        text not null,                    -- P1
  source           text not null check (source in ('original','cambridge-style','licensed-past-paper')),
  family_id        text not null,                    -- = id, or template id for variants
  current_version  int,
  state            text not null,                    -- §2.10 lifecycle
  created_at       timestamptz not null default now()
);

create table question_versions (
  question_id      text not null references questions(id),
  version          int  not null,
  content          jsonb not null,                   -- full item, zod-validated
  content_hash     char(64) not null,                -- sha256 of canonical JSON
  total_marks      int not null,
  est_minutes      int not null,
  difficulty_band  smallint not null,
  origin           text not null,                    -- human | ai-generated | ai-assisted | parametric
  review_status    text not null,                    -- ai-checked | human-reviewed
  licence_id       text references licences(id),
  probation        boolean not null default true,    -- §4.10
  published_at     timestamptz,
  retired_at       timestamptz,
  change_note      text,
  primary key (question_id, version)
);

create table question_parts (                         -- denormalised for queries, assembly and stats
  question_id text, version int, part_path text,      -- 'a', 'b.ii'
  marks int not null, primary_objective text not null, objectives text[] not null,
  command_words text[] not null, ao text[] not null, check_kinds text[] not null,
  primary key (question_id, version, part_path)
);

create table mark_points (                            -- per-mark-point statistics need stable ids
  question_id text, version int, part_path text, method_id text, point_id text,
  type text not null, marks int not null, auto boolean not null,  -- auto = has evidenceFrom
  primary key (question_id, version, part_path, method_id, point_id)
);

create table licences (
  id text primary key, licensor text not null, agreement_ref text not null,
  signed_at date not null, effective_from date not null, expires_at date,
  territories text[] not null,                        -- ISO 3166-1 alpha-2 allow-list; empty = none
  permitted_uses text[] not null,                     -- display, practice, full-paper, ai-processing, derivatives, mark-scheme-display, mark-scheme-adaptation
  attribution_text text not null,
  purge_on_expiry boolean not null, purge_grace_days int not null default 0,
  document_object_key text not null,                  -- signed PDF in encrypted storage
  status text not null check (status in ('active','suspended','expired','terminated')),
  notes text
);

create table licensed_items (
  question_id text primary key references questions(id),
  licence_id text not null references licences(id),
  source_ref jsonb not null,                          -- {series:"June 2024", paper:"9709/12", question:5}
  mark_scheme_source text not null check (mark_scheme_source in ('official-licensed','platform-written'))
);

create table exam_attempts (
  id uuid primary key, user_id uuid not null, question_id text not null, version int not null,
  variant_seed bigint, variant_params jsonb,          -- reproducible variant
  mode text not null check (mode in ('practice','timed-question','paper')),
  paper_instance_id uuid, started_at timestamptz not null, submitted_at timestamptz,
  first_attempt boolean not null, hints_used int not null default 0, tutor_used boolean not null default false,
  responses jsonb not null,                           -- typed field values; upload refs
  evidence jsonb not null,                            -- per mark point: {value, source, confidence}
  score_min numeric not null, score_max numeric not null, max_marks int not null
);

create table exposures (                              -- repeat avoidance, per family
  user_id uuid, family_id text, first_seen_at timestamptz, last_seen_at timestamptz,
  times_seen int, in_full_paper boolean, primary key (user_id, family_id)
);

create table item_stats (
  question_id text, version int, computed_at timestamptz,
  n_first int, facility numeric, item_rest_r numeric, irt_model text, b numeric, b_se numeric,
  a numeric, infit numeric, outfit numeric, median_seconds int,
  modal_wrong_share numeric, report_rate numeric, primary key (question_id, version)
);

create table item_reports (
  id uuid primary key, question_id text, version int, user_id uuid,
  category text not null,                             -- answer-wrong | unclear | typo | diagram | marking | copyright | other
  message text, status text not null, created_at timestamptz, resolved_by text, resolution text
);

create table blueprints        (id text primary key, subject_code char(4), spec jsonb not null, created_by text, created_at timestamptz);
create table qgen_runs         (id text primary key, blueprint_id text, model text, prompt_version text, effort text,
                                batch_id text, input_tokens bigint, output_tokens bigint, cost_usd numeric(10,4),
                                started_at timestamptz, finished_at timestamptz);
create table qgen_candidates   (id uuid primary key, run_id text, state text, content jsonb, repaired boolean,
                                discard_stage text, discard_reason text, question_id text);
create table qgen_checks       (candidate_id uuid, stage text, check_id text,
                                status text check (status in ('pass','fail','unsupported','error')),
                                detail jsonb, tool_version text, created_at timestamptz);
create table originality_results (subject_ref text, corpus text, c5_max numeric, longest_run int, cosine_max numeric,
                                structural_match boolean, nearest_ref text, decision text, decided_by text, decided_at timestamptz);
create table reviews           (id uuid primary key, subject_ref text, reviewer_id text, decision text,
                                reason_codes text[], checklist jsonb, minutes numeric, created_at timestamptz);
create table takedown_requests (id uuid primary key, received_at timestamptz, claimant jsonb, work_identified text,
                                question_ids text[], interim_action_at timestamptz, decision text, decided_at timestamptz,
                                log jsonb not null);  -- append-only
create table paper_specs       (id text primary key, subject_code char(4), component text, spec jsonb, source_url text, checked_at date);
create table paper_instances   (id uuid primary key, spec_id text, user_id uuid, cohort_id uuid,
                                items jsonb not null, difficulty_index numeric, created_at timestamptz);
```

### 2.9 Versioning and corrections

* A published version is immutable. A fix creates version n+1 with a `change_note`.
* **Answer-key or mark-scheme corrections**: attempts on the old version are re-scored
  wherever evidence is `auto` (deterministic). AI- or self-assessed points are re-scored if
  their mark point still exists; otherwise they are marked "scheme changed". Mastery and
  predictions are recomputed. Affected students get a neutral notice ("We corrected the mark
  scheme for a question you attempted; your mark changed from 5 to 6"). No blame, no streak
  effects.
* **Substantive rewrites** (e.g. after an originality concern) get a **new item id**, not
  a version, so the old item's statistics do not carry over.

### 2.10 Lifecycle and student-facing labels

```
candidate ─▶ validated ─▶ ai-checked ─▶ in-review ─▶ published (human-reviewed, probation) ─▶ published
    │            │             │             │                │
    └─discarded  └─discarded   └─discarded   └─rejected       ├─▶ flagged ─▶ suspended ─▶ (new version) | retired
                                                              └─▶ licence-suspended (licensed only)
```

| State | Visible to students? | Label |
|---|---|---|
| `candidate`, `validated`, `ai-checked`, `in-review`, `rejected`, `discarded` | No (default). **Owner option**: an opt-in "preview pool" of `ai-checked` items for topic practice only. | "AI-generated · checked automatically · not yet teacher-reviewed". Excluded from full papers and grade prediction. |
| `published` | Yes | Source label (§3) + "Teacher-reviewed". `probation` items appear in topic practice only (§4.10). |
| `flagged` | Yes, with a banner if the flag is a suspected key error | "Under review: a problem has been reported with this question." |
| `suspended`, `licence-suspended`, `retired` | No | Past attempts still show the student's own marks. Licensed text is hidden if the licence requires. |

Labels follow `docs/CONTENT_GUIDE.md` §5: AI-drafted content is never labelled
teacher-reviewed.

---

## 3. Sources and labelling

| `source` | What it is | Label shown with every rendering (practice, paper, tutor) | Mark scheme label |
|---|---|---|---|
| `original` | Written for Fathom (by a person, AI-assisted, or from a template). Not exam-formatted: skill-building, scaffolded, concept-checking. | "Fathom original question" | "Fathom mark scheme. Marks are practice estimates, not official Cambridge marks." |
| `cambridge-style` | Original question written to the format, command words, mark allocation and difficulty of a named component (e.g. 9709 Paper 1). Not derived from any specific past-paper question (§5.4). | "Original Cambridge-style practice question for 9709 Paper 1, written by Fathom. Not a Cambridge question." | As above. |
| `licensed-past-paper` | A Cambridge past-paper question reproduced under a written licence. | Exact `attribution_text` from the licence, plus source reference, e.g. "Cambridge International AS & A Level Mathematics 9709, Paper 12, June 2024, Q5. Reproduced by permission of Cambridge University Press & Assessment." (wording per licence). | `official-licensed`: "Official mark scheme, reproduced by permission". Otherwise: "Mark scheme written by Fathom. Not the official Cambridge mark scheme." AI mark estimates are always labelled as estimates. |

Global rules:

* No Cambridge logos. A site-wide statement says Fathom is not affiliated with or endorsed
  by Cambridge University Press & Assessment unless an agreement says otherwise (wording
  for the lawyer, §5.7).
* "Cambridge-style" is a descriptive label. The lawyer must confirm it is acceptable
  (§5.7 Q5). Fallback label: "Exam-style practice question for 9709 Paper 1".
* The label is computed from `source` and `licence` at render time, never stored as free
  text, so it cannot be mislabelled by hand.

### 3.1 Licensed past-paper items

Only with a **signed written licence** recorded in `licences`. Ingestion:

1. Staff create the licence record (terms transcribed from the agreement and the PDF stored).
   Two people check `permitted_uses`, `territories`, `expires_at` and `attribution_text`.
2. Items are transcribed (or imported from licensed digital files) into the item schema
   with `source: licensed-past-paper`, a `licensed_items.source_ref`, and the licence id.
3. Stage-2 deterministic validation runs (it catches transcription errors in keys).
   Originality checks are skipped. **No AI generation uses these items** unless
   `permitted_uses` contains both `ai-processing` and `derivatives`.
4. Human review checks the transcription against the original and the mark scheme encoding.

**Access enforcement.** A single server-side function `visibleItems(user, purpose)` is the
only path to item content (rendering, tutor context, paper assembly, export). For licensed
items it requires:

```
licence.status = 'active'
and now() between licence.effective_from and coalesce(licence.expires_at, 'infinity')
and user.country in licence.territories       -- declared school/account country; unknown → deny
and purpose in licence.permitted_uses         -- 'tutor-context' requires 'ai-processing'
```

* Region comes from the declared account or school country, with billing country as a
  cross-check. IP geolocation is a weak secondary signal and is logged, not trusted alone.
  Whether this is enough is a question for Cambridge (§5.8).
* If `ai-processing` is not permitted, the tutor works on that item only with stored hints,
  solutions and deterministic marking. Its text is never sent to the model.
* A daily job sends warnings to the owner at 60, 30 and 7 days before expiry. At expiry it
  sets `licence-suspended`. If `purge_on_expiry`, it deletes `content` after
  `purge_grace_days` and keeps the hash, metadata and students' own scores. Retaining the
  scores is itself a question for the licence.
* Tests: a fixture licence that is expired, wrong-territory or lacks `ai-processing` must
  make `visibleItems` return nothing for each purpose. These run in CI.

### 3.2 Takedown process (any source)

Proposed SLAs; for lawyer review.

1. **Intake**: `copyright@` mailbox, a form for rights holders, and the in-app "Report a
   problem → copyright concern" category. Each creates a `takedown_requests` row; its log
   is append-only.
2. **Acknowledge** within 1 business day.
3. **Interim action** within 24 hours if the notice identifies specific items and is not
   manifestly unfounded: set the items to `suspended`, which removes them from all views,
   papers and the tutor. Attempts are kept without displaying text.
4. **Assess** within 10 business days (copyright reviewer, plus counsel if needed): compare
   against the identified work and record the decision: **remove** (retire; purge content
   from DB; remove from git in a new commit, and rewrite history if counsel requires),
   **rewrite** (new item id, full pipeline including originality), or **reinstate** with
   written reasons.
5. **Root cause** from provenance: run, prompt version, model, blueprint, reviewer. Search the
   bank (embedding and n-gram) for siblings from the same blueprint or run that resemble the
   claimed work. If memorisation is suspected, add the pattern, in our own words, to the
   subject's avoid-list (§4.3).
6. Notify the claimant. Report counts and outcomes in the monthly quality report.

---

## 4. Generation pipeline

### 4.1 Overview

```
 coverage gaps ─▶ [0] blueprint ─▶ [1] GENERATE (AI, batch) ─▶ [2] DETERMINISTIC VALIDATION
                                         ▲                          │ schema · marks · tags · lints
                                         │ 1 repair max             │ subject verifier (SymPy / units / chem / CS interpreter)
                                         └──────── fail ◀───────────┤ diagram spec consistency
                                                                    ▼
                         [3] ORIGINALITY (local) ─▶ [4] INDEPENDENT SOLVE (AI, no key) ─▶ compare deterministically
                                                                    │ disagree → [4b] ADJUDICATE (AI) → discard / continue
                                                                    ▼
                         [5] AMBIGUITY + DIFFICULTY RATING (AI) + DIAGRAM VISION CHECK (AI)
                                                                    │ blocking issue → 1 repair max → back to [2]
                                                                    ▼
                         [6] DIFFICULTY PRIOR (deterministic combine) ─▶ [7] HUMAN REVIEW QUEUE ─▶ [8] PUBLISH (probation)
                                                                                                        │
                                                                     IRT calibration from responses ◀───┘
```

Every stage writes `qgen_checks` rows. A candidate's state only advances when all its
checks are `pass`, or `unsupported` with the follow-up rules below. Repairs are limited to
**one per candidate per failure class** (deterministic, ambiguity). A repaired candidate
re-runs every stage from [2]. Regenerating is usually cheaper than repeated repair and avoids
drift.

### 4.2 Stage 0: blueprints

A blueprint states what to test, not what to write.

```yaml
id: bp-9709-p1-1-7-stationary-b3-8m
subject: "9709"
syllabus: cambridge-9709-2026
component: P1
source: cambridge-style
objectives: { primary: ["1.7.5"], secondary: ["1.2.3"] }
ao: { AO1: 0.6, AO2: 0.4 }                  # share of marks, approximate
examSkills: [differentiate-polynomial, classify-stationary-points, interpret-graph]
commandWords: [find, determine]
difficulty: { band: 3 }                     # 1 (routine) … 5 (hardest on the paper)
marks: 8
structure:
  template: stepped-3-part                  # from our structure-template library
  parts:
    - { label: a, marks: [2, 3], role: routine }
    - { label: b, marks: [2, 3], role: builds-on-previous, ft: true }
    - { label: c, marks: [2, 3], role: interpret-or-extend }
calculator: allowed
diagram: none                               # none | optional | required:<kind>
answerStyle: exact-small-integers-or-simple-fractions
context: none                               # pure; for applied subjects: a context-bank tag
candidates: 4                               # generated per blueprint run, with distinct diversity seeds
```

* **Structure templates** (`stepped-3-part`, `show-that-then-hence`, `calc-then-explain`,
  `data-table-analysis`, `trace-then-modify`, `mcq-single`, `synthesis-route`,
  `program-task` …) are our own abstractions of generic exam forms. They are written from
  command-word conventions, not modelled on a specific past paper.
* **Blueprint selection**: a coverage matrix of cells
  `(component, primaryObjective, band, type)` has target counts (default: ≥ 3 published
  items per objective × band 2–4 for each component that assesses it). A nightly job lists
  under-filled cells weighted by student demand (practice attempts in that objective) and
  opens blueprint runs within a budget.
* **Context bank** (physics, chemistry, CS): a teacher-curated list of generic,
  internationally familiar contexts (lift, cyclist, kettle, titration of a household acid,
  library system) with a per-subject **avoid-list**. Teachers write the avoid-list in their
  own words for contexts that are overused in our bank or recognisably tied to specific
  published questions. Seeds rotate so candidates from one blueprint differ.

### 4.3 Stage 1: generation (AI)

* Model: `claude-opus-5-5`, submitted through the **Message Batches API** (50% discount,
  asynchronous). Adaptive thinking with `output_config.effort: high` for generation (tuned in
  the pilot; §9 shows cost sensitivity to thinking tokens).
* **Structured output**: `output_config.format` carries the JSON Schema generated from the
  zod `QuestionCandidateSchema`: the item schema of §2.2 plus a `verify` block, `diagrams`
  specs and an advisory `selfReport` field. Fixed nesting depth (part → sub-part) keeps the
  schema non-recursive. Structured outputs guarantee shape, not meaning. The output is
  parsed again with zod and then goes to stage 2.
* **Prompt composition**, ordered so the stable prefix is cacheable:

| Block | Content | Source | ~Tokens |
|---|---|---|---|
| System (stable) | Role, rules: original only, no reproduction or adaptation of any published exam question even if recalled, British spelling, Cambridge unit style, accessibility rules | Ours | 1,500 |
| Subject conventions (stable per subject) | Mark-point types and semantics (§2.5, our wording), command-word meanings (our paraphrase), notation, `verify` claim grammar with examples | Ours | 3,000 |
| Output contract (stable) | Field-by-field instructions for the schema | Ours | 1,500 |
| Exemplars (stable per subject) | 2 published **platform-original** items | Our bank | 2,500 |
| Task (varies) | Blueprint; objective text **from our paraphrased syllabus YAML**; structure template; context seed; avoid-list; "do not use these functions/contexts already in the bank for this objective" (top-k from our own bank) | Ours | 1,500 |

* **Never in the prompt**: past-paper, mark-scheme or examiner-report text (unless a licence
  explicitly permits it, §5.2), student data of any kind, student uploads.
* **Solution-first instruction**: the model must produce the worked solution, the mark
  scheme mapped to solution steps, and the `verify` claims (each final answer must be
  established by at least one claim). Only then does it finalise the question wording. The
  `verify` block is what makes stage 2 possible.
* `selfReport` (advisory, never trusted): the model's own notes on assumptions and on any
  resemblance to a question it recognises. A non-empty resemblance note sends the item to
  copyright escalation regardless of scores.

### 4.4 Stage 2: deterministic validation

#### 4.4.1 Structural checks (TypeScript, in `src/content/validate-questions.ts`, also run by `content:check`)

| Id | Check | Failure means |
|---|---|---|
| S01 | zod parse of the full item | Malformed |
| S02 | Leaf marks sum to item marks; every method of a leaf can reach exactly the leaf's marks (after group caps) | Mark allocation inconsistent |
| S03 | Mark-point ids unique per method; `dependsOn` and `impliedBy` resolve within the method; `dependsOn` graph acyclic; every `A`/`DM` has an explicit `dependsOn`; `C` has `impliedBy`; `AG` leaves have no `impliedBy` | Invalid scheme logic |
| S04 | FT `uses` refer only to earlier fields; feeding the correct earlier values into `expect` reproduces the key exactly | FT rule wrong |
| S05 | Objective codes exist in the referenced syllabus and in sections assessed by `component` (AS vs A Level, paper list in `syllabus.yaml`) | Off-syllabus tag |
| S06 | Every `commandWords` entry is in the subject list and appears in the prompt text | Command word misuse |
| S07 | `estMinutes` within ±25% of `marks × min/mark` for the component | Time estimate off |
| S08 | **Self-consistency**: the key answer passes its own check (`modelResponse` pattern from `check.ts`). Every `commonErrors[].detect` value fails the correct check at the required precision (**error discrimination**). Each `consequence` is reproduced by the engine. | Key, check or error list inconsistent |
| S09 | Lints: KaTeX renders server-side without error; no raw HTML; British spelling list; unit style; the words "Cambridge", paper codes or session names absent from student-facing text; the final answer value does not appear in the stem (unless `AG`); numeric answers in maths have an accuracy instruction or the paper rubric covers them | Presentation / leakage |
| S10 | Hints contain no final-answer values; every mark point is `earned` by some solution step | Hint leakage / solution gap |
| S11 | Diagram specs validate and agree with the givens (§6.3) | Diagram mismatch |
| S12 | Verifier coverage: share of auto-checkable final answers established by a `pass` claim; must be 1.0 for maths and physics, ≥ 0.8 for chemistry and CS (remaining items need reviewer confirmation) | Unverified answers |

#### 4.4.2 Subject verifiers

Run in a **verifier service**: a separate container, no network, CPU/memory/time limits
(10 s per claim, 60 s per item), and pinned tool versions recorded in
`qgen_checks.tool_version`. It returns
`[{claimId, status: pass | fail | unsupported | error, detail}]`.
**It never executes model-written code.** Claims are declarative data parsed by our own
grammars.

`unsupported` means the claim type cannot be checked deterministically. It does not fail
the item, but the item is marked `machineVerified: partial` and needs (a) independent-solve
agreement on that part and (b) an explicit reviewer tick for each unsupported claim.

**Maths (9709): SymPy.** Expressions are parsed by our TypeScript grammar
(`src/domain/answers/expression.ts`, extended to export its AST) and sent as AST JSON. The
Python side constructs SymPy objects node by node. No `sympify`/`parse_expr` (they use
`eval`).

| Claim kind | Deterministic check |
|---|---|
| `derivative`, `integral` (indefinite) | `simplify(diff(F) − f) == 0`; fallback: numerical equivalence at 24 points (same rule as `areEquivalent`) |
| `definite-integral`, `area`, `value` | Exact evaluation; compare with `equals` exactly (rationals, surds) or to tolerance |
| `real-roots`, `solutions-in-interval` | `solveset` over ℝ or the interval; set equality. Trig equations: in degrees or radians as stated; count and values |
| `distinct-real-root-count` (polynomials) | Discriminant / Sturm sequence; parameter condition via `solve_univariate_inequality` |
| `inequality-solution` | `solve_univariate_inequality`; interval equality including endpoints |
| `identity`, `show-that` | `simplify(lhs − rhs) == 0`; fallback sampling |
| `stationary-points` | Solve f′ = 0, classify by f″ or sign change |
| `series` (AP/GP/binomial term) | Exact computation |
| `probability`, `distribution` (P5/P6) | Exact rationals via SymPy combinatorics/stats; normal-distribution values to 4 s.f. |
| `vector`, `mechanics-equation` | Exact solve of the stated system |
| Niceness (from blueprint `answerStyle`) | Answers rational with denominator ≤ 20, or surds of integers ≤ 200, unless `allowDecimal` |
| Well-posedness | "Find *the* value" has a unique solution; logs/roots/denominators defined along the solution path; domain stated where needed |

**Physics (9702): unit-aware arithmetic in TypeScript** (reusing `parseUnit`,
`sameDimensions` from `src/domain/answers/units.ts`):

```yaml
verify:
  physics:
    givens: { m: "1.2 kg", v: "0.35 m s^-1", V: "12 V", I: "0.60 A" }
    constants: { g: "9.81 m s^-2" }
    quantities:
      Pout: { formula: "m*g*v", unit: W, stated: 4.12 }
      Pin:  { formula: "V*I",   unit: W, stated: 7.2 }
      eff:  { formula: "Pout/Pin", unit: "1", stated: 0.572, bounds: [0, 1] }
    invariants: ["Pout <= Pin"]
```

Checks: (1) the formula's dimensions equal the stated unit's dimensions
(kg · m s⁻² · m s⁻¹ = kg m² s⁻³ = W); (2) value within rounding of `stated`
(1.2 × 9.81 × 0.35 = 4.1202 → 4.12 ✓); (3) **s.f. policy**: the key's accepted s.f. range
starts at the least precise given's s.f. (here 2) and runs to +2; (4) plausibility bounds per
quantity kind (efficiency in (0, 1], refractive index ≥ 1, speeds < 3.00 × 10⁸ m s⁻¹, absolute
temperature > 0 K, μ in 0–1.5 unless the item says otherwise); (5) declared invariants
(energy conservation, "constant speed ⇒ resultant force 0"); (6) constants come only from our
data table, which is transcribed from the current data sheet and checked like
`syllabus.yaml`.

**Chemistry (9701)**:

```yaml
verify:
  chemistry:
    equations: ["H2SO4(aq) + 2NaOH(aq) -> Na2SO4(aq) + 2H2O(l)"]
    calc:
      - { id: nNaOH, expr: "0.0250 dm^3 * 0.100 mol dm^-3", stated: "2.50e-3 mol" }
      - { id: nAcid, expr: "nNaOH / 2", ratio: { equation: 1, of: H2SO4, per: NaOH }, stated: "1.25e-3 mol" }
      - { id: cAcid, expr: "nAcid / 0.02080 dm^3", stated: "0.0601 mol dm^-3" }
    structures:
      - { name: "butan-2-ol", smiles: "CCC(O)C", claims: { formula: C4H10O, chiralCentres: 1 } }
```

| Check | Tool |
|---|---|
| Element balance and charge balance of every equation and half-equation (brackets, hydrates `·5H2O`, charges, state symbols) | Own formula parser (TS) |
| Electrons in half-equations balance charge; oxidation numbers of simple species | Own rule set |
| Stoichiometry chain with units (moles, concentrations, gas volumes at r.t.p., Ar from our data-booklet table): 0.00125 / 0.02080 = 0.0601 mol dm⁻³ ✓ | Units engine + Ar table |
| Ratio claims match equation coefficients (1 : 2 above) | Parser |
| Structure validity (valence), formula and Mr match, functional groups (SMARTS), chiral-centre and E/Z counts vs claims about optical/geometric isomerism | RDKit |
| IUPAC name ↔ structure agreement | OPSIN (name → structure), compared via canonical SMILES |
| Reaction products for a **whitelist of syllabus reaction types** encoded as reaction SMARTS (e.g. electrophilic addition of HBr to alkenes with the major product, nucleophilic substitution of halogenoalkanes by OH⁻) | RDKit reactions |
| Anything outside the whitelist (mechanism arrows, unusual reagents, transition-metal colours, explanation answers) | `unsupported` → solve agreement + reviewer |
| Plausibility: pH range, K > 0, sign of ΔH consistent with "exothermic" in text | Rules |

**Computer Science (9618)**:

| Check | Tool |
|---|---|
| Pseudocode answers and trace tables | **Own interpreter for Cambridge-style pseudocode** (TS): `DECLARE`, `←`, `FOR…NEXT`, `WHILE…ENDWHILE`, `REPEAT…UNTIL`, `IF/CASE`, `PROCEDURE/FUNCTION` with `BYREF/BYVAL`, 1- or n-based `ARRAY[l:u]`, `DIV`, `MOD`, string functions, file operations against an in-memory FS. Semantics transcribed from the current official pseudocode guide, with a conformance test suite. Step limit 100,000; `INPUT` from a declared queue; `OUTPUT` captured. Because it is our interpreter, it executes data, not code. |
| Trace-table claims | Interpreter records variable state after each assignment and each `OUTPUT`; compared cell by cell with the item's table, respecting the item's "blank = unchanged" convention |
| "Write an algorithm" model answers | Executed against the item's test vectors plus generated edge cases (empty array, single element, duplicates, boundary values) |
| Boolean logic, logic circuits, truth tables, simplification | Truth-table enumeration (≤ 6 inputs); equivalence by full enumeration |
| Number representation: binary, hex, BCD, two's complement, normalised floating point (mantissa/exponent sizes from the item), overflow | Exact integer arithmetic |
| SQL | SQLite in memory, schema and rows from the item; result-set comparison (order-sensitive only with `ORDER BY`) |
| Program code (Paper 4 style; Python first) | Separate gVisor/Firecracker-style sandbox container: no network, 2 s CPU, 256 MB, read-only FS. Only our own model answers run there at generation time; student code execution is a separate decision. |

Worked trace example (original): `Total ← 0; FOR Count ← 1 TO 4: IF Count MOD 2 = 0 THEN
Total ← Total + Count * Count ELSE Total ← Total − Count`. Rows: (1, −1), (2, 3), (3, 0),
(4, 16); `OUTPUT` 16. The interpreter reproduces this and fails any row that differs.

### 4.5 Stage 3: originality

Runs locally (no AI call); detail in §5.3. Candidates scoring above the block threshold are
discarded. Escalations continue through the pipeline but cannot be approved until the
copyright reviewer decides. This stage also removes **near-duplicates of our own bank**
(cosine ≥ 0.93 against a published item or a sibling candidate; keep the one with better
check results).

### 4.6 Stage 4: independent AI solve

* A fresh `claude-opus-5-5` call (batch) sees **only the student-facing rendering**: stem,
  parts, marks, the component's rubric (our paraphrase), and each diagram as the **rendered
  PNG** from the deterministic renderer. It sees no key, no mark scheme, no `verify`
  block and no generator reasoning. Sending the image rather than the spec means
  diagram–text mismatches show up as disagreements.
* Structured output (JSON Schema via `output_config.format`):

```json
{
  "type": "object", "additionalProperties": false, "required": ["parts", "issues"],
  "properties": {
    "parts": { "type": "array", "items": {
      "type": "object", "additionalProperties": false,
      "required": ["label", "working", "final", "confidence"],
      "properties": {
        "label": { "type": "string" },
        "working": { "type": "string" },
        "final": { "type": "array", "items": { "type": "string" } },
        "confidence": { "type": "string", "enum": ["high", "medium", "low"] },
        "assumptions": { "type": "array", "items": { "type": "string" } } } } },
    "issues": { "type": "array", "items": {
      "type": "object", "additionalProperties": false, "required": ["part", "kind", "detail"],
      "properties": {
        "part": { "type": "string" },
        "kind": { "type": "string", "enum": ["ambiguous", "unsolvable", "missing-data", "inconsistent-diagram", "off-syllabus", "other"] },
        "detail": { "type": "string" } } } } }
}
```

* `final` strings use the same input syntax students type (`"1, 3"`, `"2 < c < 6"`,
  `"4.1 W"`). They are **compared deterministically** using each field's own `check` (the
  production checker, so this also tests the checks). Agreement = every auto-checkable
  field passes. For `criteria` leaves the adjudicator compares meaning.
* **Decision table**:

| Verifier | Solver | Action |
|---|---|---|
| pass | agree | Continue |
| pass | disagree | [4b] adjudicate. The verifier is trusted for verified claims, so a solver error usually means the wording leads competent readers astray → ambiguity repair; if the adjudicator attributes it to a solver slip, continue with a note to the reviewer |
| unsupported | agree | Continue; reviewer confirms the claim |
| unsupported | disagree | [4b] adjudicate → key wrong: discard; ambiguous: repair; solver wrong: continue, reviewer must confirm |
| any | `issues` non-empty | Forward issues to stage 5 as blocking candidates |

* **[4b] Adjudication** (`claude-opus-5-5`, batch, effort high) sees question, key, solver
  output and verifier results, and classifies: `key-wrong | question-ambiguous |
  solver-error | both-wrong`. Advisory. Its classification only routes; it never edits the key.
* **Correlated-error caveat**: generator and solver share a model, so they can share
  misconceptions. Deterministic verifiers are the primary truth for computable claims; the
  solver mainly catches wording, missing data and diagram problems. **Owner option**: use a
  different model for the solver (§9.4).
* Phase 3, once AI marking exists: a **mark-scheme dry run** marks the solver's working with
  the item's mark scheme. A correct solution that does not get full marks shows the scheme is
  too narrow (a missing alternative method) and goes to the reviewer.

### 4.7 Stage 5: ambiguity check (AI + lints)

* One call (batch, effort medium) sees the student view **and** the key. Task: "List every
  interpretation a competent candidate could reasonably adopt for each part. For each, give
  the answer it leads to and whether that answer differs from the key." The same call returns
  the difficulty rubric rating (§4.8) to save a request.
* Output items: `{part, kind, interpretationA, interpretationB, answersDiffer, severity:
  blocking | minor, suggestedFix}`. Kinds the prompt and lints cover explicitly: acute vs
  obtuse angle; degrees vs radians; inclusive vs strict bounds; missing accuracy or s.f.
  instruction; "hence" vs "hence or otherwise"; unstated assumptions (air resistance,
  ideal gas, r.t.p.); which variable is meant; diagram labels referring to two things;
  pseudocode semantics differing between common languages (integer division, 0- vs 1-based
  indexing); conditions not stated (e.g. a > 0).
* `blocking` = `answersDiffer` for a reasonable interpretation → one repair (the generator
  receives the issue list), then stages 2–5 again; a second blocking result → discard.
  `minor` issues go to the reviewer.
* **Diagram vision check** (items with diagrams): the rendered PNG plus spec go to a call that
  lists discrepancies (labels missing, arrow directions, "drawn to scale" claims). Advisory;
  it duplicates the deterministic §6.3 checks on the final pixels.

### 4.8 Stage 6: initial difficulty estimate

Bands 1–5 map to a Rasch logit prior: `b₀ = band − 3` (−2 … +2), prior SD 1.0.
Inputs combined as a weighted mean of band estimates:

| Signal | Weight (initial) | Notes |
|---|---|---|
| Blueprint target band | 0.3 | What we asked for |
| AI rubric rating (from the stage-5 call), anchored with 10 teacher-rated example items per subject inside the prompt | 0.4 | Rubric dimensions: steps, unfamiliarity, scaffolding, integration of objectives, algebraic or computational load |
| Feature model (marks, number of solution steps, number of objectives, "hence" chains, unscaffolded parts) | 0.3 | Linear model, refit monthly against calibrated items |

The reviewer records their own band; if it differs by ≥ 2 from the estimate, the item is
flagged for a second opinion. Weights are refit once ≥ 200 items are calibrated (§4.11):
regress empirical `b` on each signal and keep the weights that minimise RMSE.

### 4.9 Stage 7: human teacher review queue

**Assignment**: the reviewer holds the subject qualification flag (has taught that A Level),
is not the blueprint author, and has no more than 40 items a day (fatigue). 5% of approvals
are randomly double-reviewed, and every originality escalation also goes to the copyright
reviewer.

**Review screen** shows the student rendering (light and dark), mark scheme, worked
solution, hints, verifier results with claim coverage and `unsupported` claims, solver
output and its diff with the key, ambiguity report, originality scores (side-by-side text only
for corpora we may lawfully display to staff), difficulty estimate, and generation metadata.

**Checklist** (structured, stored in `reviews.checklist`):

1. Key and solution correct; each `unsupported` claim confirmed individually.
2. Unambiguous; minor ambiguity items resolved or accepted.
3. On syllabus; objective tags correct; component appropriate (AS vs A Level).
4. Command words used with their exam meaning.
5. Mark allocation fair; mark scheme follows the subject's conventions; plausible alternative
   methods covered; FT rules sensible.
6. Reviewer's difficulty band (1–5).
7. Language: clear international English, accessible to EAL students, culturally neutral,
   no sensitive or distressing contexts, names diverse.
8. Diagram correct, readable and accessible; alt text gives what a student needs without
   giving away answers.
9. Originality attestation: "I do not recognise this as a specific past-paper or published
   question" (plus notes).

**Decisions**: `approve`; `approve-with-edits` (edits are made in the UI, which re-runs
stages 2–5; approve stays disabled until checks are green); `send-back` (AI repair with the
reviewer's notes, counted against the repair limit); `reject` with reason codes (`wrong`,
`ambiguous`, `off-syllabus`, `low-value`, `duplicate`, `too-close-to-source`,
`poor-diagram`, `other`).

**Reviewer quality**: 2% of queue items are **seeded-defect items**: known-good items with
one deliberately introduced fault (wrong key, missing condition, wrong unit). Per-reviewer
detection rate is tracked; below 80% triggers retraining. Inter-reviewer agreement on the 5%
double sample is reported as Cohen's κ on approve/reject (target ≥ 0.6).

### 4.10 Stage 8: publish and probation

Approval writes the YAML (Phase 3: bot commit) with `provenance.reviews` filled; import
creates the version with `probation = true`. Probation items appear in **topic practice
only**. They become eligible for full-paper simulations once they have n ≥ 50 first unassisted
attempts, facility in [0.10, 0.95], item–rest r ≥ 0.15 and no open flags. For a new subject
with no data, the owner may allow probation items in papers. Such papers are tagged
`uncalibrated` and grade prediction must lower confidence.

### 4.11 Difficulty calibration from response data

* **Data used**: first attempts only, unassisted (`hints_used = 0`, `tutor_used = false`),
  submitted, time on task ≥ 10 s, marks from `auto` or teacher evidence (self-assessed marks
  enter at weight 0.5 in a sensitivity run; reported separately). Repeated family exposures are
  excluded. Response data stays in our database; it is never sent to an AI model.
* **Model**: partial credit model (PCM) at leaf level. For leaf *i* with max *mᵢ* and student
  ability θ:
  `P(Xᵢ = k | θ) = exp(Σ_{j=1..k}(θ − b_{ij})) / Σ_{h=0..mᵢ} exp(Σ_{j=1..h}(θ − b_{ij}))`.
  Item difficulty `bᵢ` = mean of the step parameters. Single-mark leaves reduce to Rasch
  `P = 1/(1 + e^{−(θ − b)})`.
* **Estimation**: nightly Bayesian (MAP) concurrent calibration with prior `N(b₀, 1²)` from
  §4.8, anchored on published items whose `b_se < 0.2`. θ priors are `N(0, 1)` per subject and
  component. Implement in the stats worker (Python, alongside the verifier service but in a
  separate process).
* **Reporting**: `source: calibrated` once `b_se ≤ 0.3` (≈ 100+ responses, depending on
  spread). Until then `estimate`. A 2PL discrimination parameter is fitted only once n ≥ 300.
* **Selection bias**: students choose topics. Concurrent calibration with θ estimated from all
  of a student's responses corrects for ability differences, not for motivation or timing.
  Full-paper attempts (assigned items) get double weight in anchoring.
* **Variants**: one `b` per family; heterogeneity is tested once n ≥ 200 (variant-group
  facility χ² test, p < 0.01 → tighten template constraints or split the family).
* **Output to grade prediction**: per-version `b`, `b_se`, step parameters, and for each
  paper instance an expected score curve `E[score | θ]`.

### 4.12 Parametric variants (deterministic, no AI per variant)

A template is a human-authored (or AI-drafted then reviewed once) item with parameters,
constraints and derived values. Variants are enumerated and verified at build time.

```yaml
id: tpl-9709-p1-1-7-cubic-stationary
kind: template
subject: "9709"
component: P1
source: cambridge-style
origin: human
params:
  m: { int: [0, 6] }        # x of the maximum
  n: { int: [0, 6] }        # x of the minimum
  r: { int: [-5, 5] }
where:                       # hard constraints
  - "m < n"
  - "(m + n) % 2 == 0"       # keeps the x² coefficient an integer
  - "r != 0"
derived:
  p: "-3*(m + n)/2"
  q: "3*m*n"
  f: "x^3 + p*x^2 + q*x + r"           # f'(x) = 3(x − m)(x − n)
  ymax: "m^3 + p*m^2 + q*m + r"
  ymin: "n^3 + p*n^2 + q*n + r"
nice:                        # presentation constraints
  - "abs(ymax) <= 60 and abs(ymin) <= 60"
distinct:                    # error-discrimination and degeneracy
  - "ymax != ymin"
  - "commonErrorsDiffer"     # every commonErrors.detect value ≠ key at required precision
stem: |
  The function $\mathrm{f}$ is defined by $\mathrm{f}(x) = {{poly f x}}$ for $x \in \mathbb{R}$.
# parts, mark scheme, hints, solution and verify claims as in §2.2, with {{…}} placeholders
```

* **Rendering helpers** format coefficients correctly: no `+ −5`, no `1x`, no `0x²` terms,
  fractions as `\frac`. Each helper is unit-tested.
* **Enumeration**: if the parameter space has ≤ 10⁵ points, enumerate all; otherwise sample
  5,000 with a fixed seed. Every surviving variant runs the full stage-2 suite (verifier
  claims, S08 self-consistency and error discrimination). Variants that fail are excluded,
  with the reason logged. This template has 9 valid (m, n) pairs × 10 values of r = 90
  combinations, of which **70** satisfy `nice`. (m, n, r) = (1, 3, 2) is the item in §2.2.
  The build fails if fewer than 10 variants survive.
* **Physics example of error discrimination**: a motor template with m = 1.0 kg,
  v = 0.20 m s⁻¹ gives P = 1.962 W → "2.0 W" at 2 s.f., and the g = 10 error also gives
  "2.0 W". That variant cannot distinguish the error, so it is excluded (or the item requires
  3 s.f.).
* **Selection**: `index = H(userId, templateId, k) mod |valid|` with k = number of prior
  exposures to the family, so a retry gets a different variant. `variant_seed` and
  `variant_params` are stored on the attempt and the exact rendering is reproducible.
* **Review**: the template is reviewed once, with 5 rendered variants shown (random + the
  parameter extremes). Any later template change re-enumerates and needs a new review.
* **Family semantics**: variants share a `family_id`. Exposure, repeat avoidance and
  calibration operate on the family. Variants do not count as distinct items for coverage
  targets or full-paper uniqueness.

### 4.13 Where it runs

| Module | Location | Notes |
|---|---|---|
| Generation orchestrator | `scripts/qgen/*.ts` (CLI, staff-run) and a Phase-3 worker | Server-side Anthropic key from the secret store; never in the client bundle |
| Prompt builder | `src/server/ai/qgen/prompt.ts` | Reads only allowed sources (§5.2); fails closed |
| Verifier service | `services/verifier/` (Python: SymPy, RDKit, OPSIN via JVM sidecar) + TS verifiers in `src/domain/verify/` | No network; resource limits; pinned versions |
| Originality service | `services/originality/` | Holds its own corpora and credentials |
| Review queue | `src/app/(staff)/review/` | Staff role only; audit log |
| Stats worker | `services/stats/` | Nightly IRT, item stats, alerts |

Privacy: generation and verification process **no personal data**. Calibration uses
pseudonymous response data inside our own infrastructure. Student uploads are never used as
exemplars, corpora or prompts for generation. Mining **de-identified wrong final answers**
(numbers only) to enrich `commonErrors` is an owner/DPO decision that needs privacy-notice
coverage.

---

## 5. Copyright safeguards

> **This is an engineering policy, not legal advice.** Copyright, database right and
> trademark law differ by jurisdiction (UK, where Cambridge University Press & Assessment is
> based, and each country where Fathom has users). Counsel must approve this section before
> launch.

### 5.1 Principles

1. Fathom reproduces Cambridge past-paper questions, mark schemes and examiner reports
   **only under a written licence**, within its terms.
2. Generated and authored questions must be **genuinely original**. Changing the numbers,
   names or order of a past-paper question does not make it original.
3. Testing the same syllabus objective, skill or command word as an exam question is
   normal and expected. Copying a specific question's expression is not.
4. Every safeguard is technical where possible, logged, and backed by human escalation.

### 5.2 Prompt hygiene (enforced in code)

* The prompt builder takes content only from an allow-list of sources: our syllabus
  paraphrases, our conventions documents, published items with `source ∈ {original,
  cambridge-style}`, blueprints, context bank, avoid-list. It **cannot** read
  `licensed_items` or the comparison corpus (separate DB role without grants).
* Licensed text enters a prompt only if `permitted_uses` contains `ai-processing` (for
  tutoring/marking) or `ai-processing` **and** `derivatives` (for generation). The check is
  in the prompt builder and is unit-tested.
* **Prompt firewall**: before submission, every outgoing generation prompt is checked against
  the comparison corpora (if any) with the §5.3 lexical test. Any shared 12-token run that is
  not boilerplate blocks the request and alerts. This catches, for example, an exemplar that
  was itself too close.
* Blueprints never name a past paper, session or question number, and never say "write a
  question like …". A lint on blueprint text rejects paper codes such as `9709/12`, months
  and years, and the words "past paper".
* Prompts and outputs are retained for audit for the period counsel advises.
* Staff authoring rule: writers and reviewers may study past papers to learn the general
  style, but do not draft with a specific past-paper question open in front of them.

### 5.3 Originality checks

**Corpora** (each with a recorded lawful basis, `corpora.lawful_basis`):

| Corpus | Contents | Status |
|---|---|---|
| `own-bank` | All Fathom items (published and candidates) | Always |
| `licensed` | Licensed Cambridge items | If licensed |
| `comparison` | Public past-paper text held **solely** for comparison | **Only if counsel confirms it is lawful** (§5.7 Q3). Stored encrypted, separate credentials; never shown to students or used in prompts; possibly as fingerprints only |

**Normalisation**: NFKC; lowercase; LaTeX stripped to tokens (`\frac{a}{b}` → `a / b`);
**every number replaced by `<n>`** (so number-changed copies match); variable names kept;
whitespace collapsed. **Boilerplate**: 5-gram shingles that occur in > 1% of our own items
(e.g. "give your answer correct to <n> significant figures", "find the set of values of")
are removed before scoring, so stock exam phrasing does not trigger false positives.

**Signals and initial thresholds** (to be tuned; see calibration below):

| Signal | Definition | Pass | Escalate to copyright reviewer | Block (auto-discard) |
|---|---|---|---|---|
| 5-gram containment `C5` | \|S(cand) ∩ S(ref)\| / \|S(cand)\| after boilerplate removal, max over refs | < 0.15 | 0.15–0.40 | ≥ 0.40 |
| Longest common token run | After normalisation, excluding boilerplate | < 12 | ≥ 12 | ≥ 25 |
| Embedding cosine | Whole-item and per-part embeddings from a **self-hosted open-weights sentence-embedding model** (our cached Claude API facts list no embedding endpoint; a local model also keeps corpora in-house) | < 0.85 | ≥ 0.90, or 0.85–0.90 together with a structural match | — |
| Structural match | ≥ 3 consecutive parts with the same (command word, primary objective, marks) **and** either scenario-entity Jaccard ≥ 0.6 (entities extracted as nouns/quantities) or ≥ 3 shared non-trivial given values (excluding 0, 1, 2, 10, 100, 9.81 …) | none | match | — |
| Diagram match | Circuit netlists isomorphic with equal component values; geometry figures with the same labelled measurements; data tables with ≥ 50% identical cells | none | match | identical data table |
| Model self-report | `selfReport` resemblance note | empty | non-empty | — |
| Own-bank near-duplicate | Cosine ≥ 0.93 to an own-bank item | — | — | Discard as duplicate (quality, not copyright) |

**Calibration of thresholds** (before Phase 3 launch): build a labelled set per subject.
(a) 200 known-original items. (b) Staff-made "attacks" on items from corpora we may lawfully
use (licensed items, or our own items standing in): numbers changed, names changed, parts
reordered, paraphrased by a model, context swapped. Targets: recall ≥ 0.95 on
number-changed and close-paraphrase attacks; escalation rate ≤ 5% of original candidates
(reviewer capacity). Re-run when the embedding model or normalisation changes.

**If no comparison corpus can lawfully be held**, assurance is lower. Compensations:
own-bank and licensed checks still run; reviewer attestation (§4.9 item 9) becomes
mandatory with a second reviewer on 20% of items; an optional exact-phrase web search of 2–3
distinctive 10-token sequences per item (subject to the search provider's terms; only hit
counts and URLs are stored); the advisory model self-report. Report this residual risk to the
owner.

**Escalation**: the copyright reviewer (trained, independent of the generation operator)
decides `original` / `revise` (back to generation with "move away from X") / `reject`, with a
written rationale stored in `originality_results`. Overrides of a `block` are not possible
in the UI.

### 5.4 What "inspired by structure" may and may not mean

| Allowed | Not allowed |
|---|---|
| Testing the same syllabus objective, skill, AO or command word | Reusing a specific question's function, expression, equation or data with numbers changed |
| Same mark total and generic part pattern (e.g. "differentiate → classify → interpret") that is common across textbooks and years | Reproducing the specific **sequence of parts** of a particular past question together with its context or twist |
| Generic contexts common to the whole subject (projectile, potential divider, acid–base titration, bubble sort, stock-control record) | A **distinctive scenario** from a specific question: its particular story, named entities, apparatus arrangement, or record structure with the same field names |
| Standard notation and stock rubric phrases | Copying a **data set** (table of experimental results, sample data) even with values perturbed |
| Matching a component's overall format (marks, timing, topic balance) in full papers | Copying a **diagram** (layout, labelled dimensions, component arrangement); mirroring a specific session's paper question by question |
| Paraphrased syllabus objectives (already the policy for `syllabus.yaml`) | Copying mark-scheme or examiner-report wording; presenting our mark scheme as Cambridge's |

Borderline cases go to the copyright reviewer, not to the item author.

### 5.5 Attribution and labelling

* Licensed items carry the licence's exact attribution text and source reference (§3).
* Cambridge-style items are labelled as original and not Cambridge's (§3). They never carry a
  paper code, session or "Question 5" style numbering that suggests a real paper.
* Full-paper simulations are titled "Fathom practice paper in the style of 9709 Paper 1" and
  show per-item source labels in the review view.
* AI provenance is visible to students ("AI-assisted, teacher-reviewed") for items whose
  `origin` is `ai-generated` or `ai-assisted`. This is the honest default; whether to show it
  on every item or in an info panel is a UX decision.

### 5.6 Residual risks

Model memorisation can surface past-paper content without any prompt exposure. Checks
without a comparison corpus cannot fully detect that. Generic patterns are judgement calls.
Takedown (§3.2) and provenance make errors containable and attributable.

### 5.7 Questions for a lawyer

1. Which rights protect Cambridge past papers, mark schemes, examiner reports, specimen
   papers, syllabus documents and data booklets (copyright, database right), and which
   jurisdictions' laws apply to us given where students are?
2. Where is the line for infringement of a question as a "substantial part" (a qualitative
   test in UK law)? Specifically: number-changed copies, close paraphrase, same structure
   with a new context, same context with new structure.
3. May we lawfully hold copies of public past papers **solely** to check our questions for
   similarity? Does any exception apply? Our understanding is that the UK text-and-data-mining
   exception (CDPA s29A) is limited to non-commercial research. Would storing only hashed
   fingerprints change the analysis?
4. Students will photograph and upload past-paper pages to the AI tutor. What is our
   liability for processing user-uploaded copyrighted material with a third-party AI
   provider, what retention and notice terms do we need, and is a hosting defence available?
5. Is "Cambridge-style", "for Cambridge International AS & A Level 9709" and use of
   syllabus codes acceptable descriptive use of trademarks? What disclaimer wording is needed?
6. Who owns copyright in AI-generated items (e.g. UK CDPA s9(3) computer-generated works) and
   in human-edited AI items? Does that affect our ability to enforce rights in our bank?
7. If a generated item turns out to reproduce a past paper, what is our exposure? Are the
   takedown SLAs in §3.2 adequate? What should our terms of service say?
8. Licence drafting: AI sub-processor use, derivative works, territories, caching and
   embeddings, retention of student scores after expiry, audit rights, termination
   obligations.
9. Is our syllabus paraphrase approach (CONTENT_GUIDE §1) sufficient, or do we need a
   licence for syllabus objective text?
10. Contracts for teacher authors and reviewers: IP assignment, originality warranty, the
    "no specific past paper open while drafting" rule, and use of materials they hold as
    teachers.
11. Is the exact-phrase web-search fallback (§5.3) acceptable under search providers' terms
    and copyright law?

### 5.8 Questions for Cambridge University Press & Assessment

1. Do you license past papers and mark schemes for a commercial digital practice platform?
   Which components, series and years, at what cost model (per student, flat, revenue
   share)?
2. Does a licence permit sending licensed text to an AI sub-processor for tutoring and
   marking, storing embeddings or fingerprints, and adapting mark schemes into
   machine-readable form?
3. Are derivative or adapted questions permitted, or verbatim reproduction only?
4. Territorial restrictions and how you expect us to enforce them (declared country,
   billing, IP).
5. Required attribution wording, logo rules, and whether "Cambridge-style" is acceptable to
   you.
6. Can we display published grade thresholds alongside predictions, labelled as context
   and not guarantees?
7. Are inserts, data booklets, formula lists, diagrams and source files for practical papers
   included?
8. Is there an endorsement or partnership programme for digital resources, and what are
   its review requirements?
9. Takedown contact and process, notice periods, and obligations on expiry or termination
   (delete vs retain student attempt records).
10. Would you run, or permit, an originality comparison of our items against your archive
    without us holding the archive?

---

## 6. Diagrams

### 6.1 Approach

Phase-1 diagrams are prop-less React components in a registry
(`src/components/diagrams/<code>/`), coloured only with `dg-*` classes and previewed by
`scripts/render-diagram.tsx`. Exam items need **parametric** diagrams, so a question
references `{ kind, params, alt, scale }`. A renderer is a pure function
`(params) => <svg>` built on the existing primitives (`Svg`, `Arrow`, `Label`, `plotPath`,
`axes`, `graph`). The AI (or an author) writes the **spec**, never SVG. Each kind has a zod
schema and a verifier.

```yaml
diagrams:
  - id: d1
    kind: circuit
    scale: not-to-scale
    params:
      netlist:                        # series-parallel tree, laid out deterministically
        series:
          - { cell: { emf: "12 V", internalResistance: "0 Ω" } }
          - { resistor: { id: R1, value: "4.0 Ω" } }
          - parallel:
              - { resistor: { id: R2, value: "6.0 Ω" } }
              - { resistor: { id: R3, value: "3.0 Ω" } }
          - { ammeter: { id: A1 } }
    alt: >-
      A 12 V cell in series with a 4.0 Ω resistor, an ammeter, and a parallel pair of
      6.0 Ω and 3.0 Ω resistors.
```

### 6.2 Renderers by subject

| Subject | Kinds | Generation method |
|---|---|---|
| 9709 | `function-graph` (curves, asymptotes, labelled points), `geometry` (triangles, sectors, circles with labelled lengths/angles), `vectors-2d/3d` (projected), `tree-diagram`, `histogram`, `box-plot`, `cumulative-frequency`, `stem-and-leaf`, `velocity-time` | `plotPath`/`graph` for exact functions; geometry solved from constraints (e.g. SSS → coordinates) |
| 9702 | `free-body` (forces as magnitude + angle), `circuit` (series-parallel trees; potential divider and bridge templates), `ray-diagram`, `wave-graph` (displacement–distance/time), `iv-characteristic`, `field-lines` (computed from point charges/masses), `projectile` | Physics computed from params; arrow lengths ∝ magnitude when `to-scale` |
| 9701 | `structure` (skeletal/displayed from SMILES), `reaction-scheme`, `energy-profile`, `maxwell-boltzmann` (computed distribution), `titration-curve` (computed from concentrations and pKa), `mass-spectrum` (bars), `lattice` (2D templates) | RDKit `rdMolDraw2D` SVG (black-and-white palette, post-processed to `dg-*` classes); "displayed formula" = explicit H; condensed structural formulae generated as text for simple chains, else reviewer-written |
| 9618 | `logic-circuit` (from boolean expression AST, layered layout, distinctive-shape gates), `flowchart` (from pseudocode AST), `data-structure` (array, linked list, stack, queue, binary tree), `er-diagram`, `network-topology`, `state-diagram` | Deterministic layout from structure; truth tables rendered as HTML tables, not images |

General automatic circuit layout is hard. Restricting circuits to series-parallel trees
plus a few named templates covers most AS circuits and lays out deterministically.
Anything else is hand-drawn by an author, as a registered component, and reviewed.

### 6.3 Verification

| Check | Deterministic rule |
|---|---|
| Spec ↔ text consistency | Every value in the spec that also appears in the stem is equal after unit normalisation; every given the question relies on is either in the text or labelled on the diagram |
| Circuits | Netlist connected, no floating nodes, no ideal source shorted; **solved by modified nodal analysis**; stated currents and p.d.s match (worked: R2 ∥ R3 = 2.0 Ω, total 6.0 Ω, I = 2.0 A) |
| Forces | If text says "equilibrium": ΣF = 0 and Σmoments = 0 within 10⁻⁶ relative; angle labels match geometry |
| Graphs | Labelled points satisfy \|f(x) − y\| < 10⁻⁹·scale; stated intercepts and turning points computed and compared; axis ranges contain all labelled features |
| Geometry | Triangle inequality, angle sum, given lengths reproduce the drawing within 1% when `to-scale`; `not-to-scale` required otherwise |
| Chemistry | RDKit sanitisation; drawn formula = stated formula; stereo depiction matches claims |
| Logic circuits | Truth table of the drawn netlist = truth table of the stated expression |
| Rendering | Render in headless Chromium (as `render-diagram.tsx` does): every `<text>` bounding box inside the viewBox; no pairwise label overlap (bbox intersection > 2 px²); min text 12 px in viewBox units; lint that only `dg-*` classes are used (no hard-coded colours); light and dark renders produced for the reviewer |
| Alt text | Generated from the spec by a template, editable by the reviewer; numbers in alt text ⊆ givens (no answer leakage); required for every diagram |
| Pixels (advisory) | AI vision check (§4.7) and the independent solver seeing the PNG (§4.6) |

---

## 7. Timed practice and full-paper assembly

### 7.1 Paper specs

One YAML per component, transcribed from the current syllabus and checked like
`syllabus.yaml` (`sourceUrl`, `checkedAt`). Durations and totals below are recalled from
the current syllabuses and **must be verified against each PDF before use**:

| Subject | Component | Duration | Marks | min/mark |
|---|---|---|---|---|
| 9709 | P1, P3 | 1 h 50 min | 75 | 1.47 |
| 9709 | P2, P4, P5, P6 | 1 h 15 min | 50 | 1.50 |
| 9702 / 9701 | P1 (multiple choice, 40 items) | 1 h 15 min | 40 | 1.88 |
| 9702 / 9701 | P2 (AS structured) | 1 h 15 min | 60 | 1.25 |
| 9702 / 9701 | P4 (A Level structured) | 2 h | 100 | 1.20 |
| 9702 / 9701 | P3 practical / P5 planning | 2 h / 1 h 15 min | 40 / 30 | (practical not simulated in Phase 2–3; P5 planning items only) |
| 9618 | P1, P3 | 1 h 30 min | 75 | 1.20 |
| 9618 | P2 | 2 h | 75 | 1.60 |
| 9618 | P4 (practical) | 2 h 30 min | 75 | 2.00 |

```yaml
id: ps-9709-p1
subject: "9709"
syllabus: cambridge-9709-2026
component: P1
durationMinutes: 110
totalMarks: 75
questionCount: [10, 12]
marksPerQuestion: [3, 12]
sections: ["1"]                       # syllabus sections assessed
topicMarks:                           # ILLUSTRATIVE targets, to be set by the subject lead
  "1.1": [6, 10]                      # quadratics
  "1.2": [6, 10]                      # functions
  "1.3": [7, 11]                      # coordinate geometry
  "1.4": [4, 8]                       # circular measure
  "1.5": [8, 12]                      # trigonometry
  "1.6": [6, 10]                      # series
  "1.7": [11, 15]                     # differentiation
  "1.8": [11, 15]                     # integration
bandMarkShare: { "1-2": [0.30, 0.40], "3": [0.35, 0.45], "4-5": [0.20, 0.30] }
ordering: ascending-marks-then-band   # papers generally open with shorter, easier questions
calculator: allowed                   # verify per component
rubric: rubric-9709-general           # our paraphrase of the general instructions
sourceUrl: https://…                  # official syllabus PDF
checkedAt: 2026-10-19
```

Midpoints of the illustrative targets (8, 8, 9, 6, 10, 8, 13, 13) sum to 75.

### 7.2 Assembly as a small integer program

Eligible pool E: `published`, not probation, `visibleItems(user, 'full-paper')`, family not
seen by this student in a previous full paper and not seen at all in the last 90 days.
Variables `xᵢ ∈ {0,1}`; `mᵢ` marks, `mᵢₜ` marks of item *i* whose leaves have primary
objective in topic *t*, `eᵢ` est. minutes, `rᵢ` recency penalty, `dₜ⁺, dₜ⁻ ≥ 0`.

```
minimise   Σₜ wₜ (dₜ⁺ + dₜ⁻) + λ Σᵢ rᵢ xᵢ + μ |Σᵢ E[scoreᵢ | θ=0] xᵢ / M − target|
subject to Σᵢ mᵢ xᵢ = M                                   (exact total, e.g. 75)
           Σᵢ mᵢₜ xᵢ − dₜ⁺ + dₜ⁻ = targetₜ ;  lowₜ ≤ Σᵢ mᵢₜ xᵢ ≤ highₜ     ∀t
           Qmin ≤ Σᵢ xᵢ ≤ Qmax
           Σ_{i∈band k} mᵢ xᵢ ∈ [Lₖ, Uₖ]·M                ∀k
           Σᵢ eᵢ xᵢ ≤ 1.05 · duration
           Σ_{i∈family f} xᵢ ≤ 1                          ∀f
           Σ_{i: objective o primary} xᵢ ≤ 2              ∀o   (no objective dominates)
           mᵢ ∈ [marksPerQuestion]                        (filter)
```

* Solve with a MILP solver (e.g. HiGHS via its WebAssembly build). The pool per component is
  at most a few thousand items, so a solve takes well under a second. Fallback: greedy by
  largest topic deficit, then swap-based local search.
* Small random perturbations of `wₜ` give different students different papers. **Fixed
  papers** (a teacher sets one instance for a class) are also supported and help calibration
  through common items.
* The absolute value term is linearised in the usual way. `E[score | θ=0]` uses calibrated
  parameters where available, otherwise priors. An assembled paper whose expected percentage
  for θ = 0 is more than 5 points from the component target is rejected and re-solved.
  Simulations should be **representative**, not adapted to the student, because grade
  prediction weights them as exam evidence.
* Each `paper_instance` stores items, versions, variant seeds and `difficulty_index`, so
  grade prediction can adjust for paper difficulty (equating). Licensed full past papers,
  where licensed, are stored as fixed instances and are the best anchor to real grade
  thresholds.
* Multiple-choice components: 40 single-mark items, topic shares from the spec, answer-key
  letters balanced (each letter 20–30%), and no more than 3 identical keys in a row.

### 7.3 Timed modes

| Mode | Timer | Help | Recorded as |
|---|---|---|---|
| Topic practice | Optional, per question (`marks × min/mark`) | Hints and tutor allowed | `practice`; untimed or timed flag |
| Timed question set (e.g. 30-minute mini-mock, blueprint scaled from the paper spec) | Server-authoritative | None until submit | `timed-question` |
| Full paper | Server-authoritative; start time stored server-side; submissions after time + 2 min grace flagged `overtime`; no pause in exam-conditions mode | None until submit; the tutor is disabled | `paper` |

Marking after submission: typed answers are auto-marked. Handwritten working can be uploaded
for AI evidence (tutor/marking study) and is labelled as an estimate. The student can
self-assess pending points. Each mark records its evidence source, so grade prediction can
weight reliability. Wellbeing: timers are opt-in outside full-paper mode, there are no
leaderboards, and copy is neutral ("Time's up. Here's how you did.").

---

## 8. Quality metrics and monitoring

Computed nightly by the stats worker on first unassisted attempts (§4.11 filter) per item
version; the minimum n applies before a metric can raise a flag.

| Metric | Definition | Flag rule | Action |
|---|---|---|---|
| Facility | `Σ score / (n · max)` (per leaf and item) | < 0.10 or > 0.95, n ≥ 30 | Review difficulty, wording, key |
| Mark-point facility, P(A \| M) | Per mark point; conditional rate of A given M | P(A\|M) < 0.2 with P(M) > 0.6, n ≥ 30 | Likely key or accuracy-demand problem |
| Discrimination | Item–rest correlation on full papers; correlation with θ̂ (item excluded) otherwise | r < 0.15 (n ≥ 50) → review; r < 0 → suspend from papers | Review |
| IRT fit | Rasch/PCM infit and outfit mean-square | outside [0.7, 1.3], n ≥ 100 | Review |
| Time | Median seconds vs `estMinutes` | ratio > 1.5 or < 0.5, n ≥ 30 | Update estimate; review if extreme |
| Modal wrong answer | Share of incorrect auto-checked answers equal to the most common wrong value | ≥ 25 % of wrong answers, n ≥ 30, and not in `commonErrors` | Review key and alternatives (often a wrong key or a missing accepted form) |
| Invalid-input rate | `invalid` outcomes / submissions per field | > 5 %, n ≥ 50 | Input format or parser problem |
| Error reports | Reports per 100 attempts by category | ≥ 3 distinct users "answer wrong", or rate > 2 % with n ≥ 50 | Review; with modal-wrong also firing → **auto-suspend** pending review |
| Copyright reports | Any | 1 | Takedown process (§3.2), immediate |
| Mark disputes | Students contesting auto or AI marks | > 3 % of attempts | Review scheme and checks |
| Variant homogeneity | χ² of facility across variants | p < 0.01, n ≥ 200 | Tighten template |
| Exposure | Share of paper instances containing the family in 30 days | > 0.3 | Down-weight in assembly |

**Pipeline metrics** (per subject × prompt version × model): pass rate per stage; discard
reasons; repair success; verifier `unsupported` share; reviewer reject rate and reason codes;
reviewer edit distance; minutes per review; κ on double reviews; seeded-defect detection;
originality escalation rate; **post-publication defect rate**: items found wrong after
publication per 100 published (from reports, audits and corrections). Target < 1 per 100;
alert at 2.

**Audit**: each month 2% of published items are randomly re-reviewed by a different
teacher.

**Regression**: a golden set of 50 blueprints per subject runs before any change of model,
prompt version, verifier version or effort setting. The change ships only if pass rates and
reviewer-sample defect rates do not degrade (two-proportion test, α = 0.05) and no seeded
defect is newly missed.

**Fault injection**: 2% of verifier runs receive a deliberately corrupted copy (key
perturbed, sign flipped, unit changed). The verifier must fail ≥ 98% of them. This is the
check that the checker works.

Alerts go to the content lead. Nothing is auto-edited. The only automatic actions are
suspension and exclusion from papers.

---

## 9. Cost estimate per validated question

### 9.1 Assumptions

* Typical item: 6–8 marks, 2–3 parts; half have one diagram.
* Prices (cached Claude API facts, 2026-10-06): `claude-opus-5-5` $4.00 / MTok input,
  $20.00 / MTok output; Message Batches API 50% off → **$2.00 / $10.00**. Thinking tokens
  are assumed to be billed as output tokens (*verify against current pricing docs*).
* Image: ≈ **1,600 tokens** per rendered diagram (assumption: ≈ width × height / 750, with
  large images downscaled to ≈ 1.15 MP; *verify against current pricing docs*). At batch
  input price that is ≈ $0.0032 per image, which is negligible.
* Token counts per call are estimates to be replaced by pilot measurements (`qgen_runs`
  records actuals).

| Call | Input tokens | Output tokens (visible + thinking) | Batch cost per call |
|---|---|---|---|
| G: generate | 10,000 (6,000 stable prefix) | 3,000 + 4,000 = 7,000 | 0.0200 + 0.0700 = **$0.0900** |
| R: repair | 13,000 (prompt + candidate + issues) | 7,000 | 0.0260 + 0.0700 = **$0.0960** |
| S: independent solve | 4,000 (incl. one 1,600-token image) | 1,500 + 4,000 = 5,500 | 0.0080 + 0.0550 = **$0.0630** |
| A: adjudicate | 8,000 | 1,000 + 2,000 = 3,000 | 0.0160 + 0.0300 = **$0.0460** |
| D: ambiguity + difficulty rating | 4,000 | 1,000 + 2,000 = 3,000 | 0.0080 + 0.0300 = **$0.0380** |
| V: diagram vision check | 3,100 (incl. image) | 500 + 1,000 = 1,500 | 0.0062 + 0.0150 = **$0.0212** |

### 9.2 Funnel (assumption, per 100 generated candidates)

| Stage | In | Out | Discarded | AI calls |
|---|---|---|---|---|
| 1 Generate | 100 | 100 | 0 | G × 100 |
| 2 Deterministic validation (20 fail; 1 repair each; 10 fixed) | 100 | 90 | 10 | R × 20 |
| 3 Originality (local) | 90 | 88 | 2 | — |
| 4 Independent solve (18 disagree → adjudicate; 8 key wrong) | 88 | 80 | 8 | S × 88, A × 18 |
| 5 Ambiguity / diagram (12 blocking; 1 repair; 7 fixed; re-run S, D, V) | 80 | 75 | 5 | D × 80, V × 40, R × 12, S × 12, D × 12, V × 6 |
| 7 Human review (16% rejected) | 75 | **63** | 12 | — |

**Assumed discard rate: 37 of 100 candidates (≈ 1.59 candidates per published item)**: 25
discarded by automated stages and 12 rejected by teachers. Maths and physics, with full
verifier coverage, should do better. Organic chemistry and algorithm-writing CS items are
expected to do worse (see the sensitivity table).

### 9.3 Arithmetic

Call totals: G 100, R 32, S 100, A 18, D 92, V 46.

| Call | Count | Cost |
|---|---|---|
| G | 100 × $0.0900 | $9.000 |
| R | 32 × $0.0960 | $3.072 |
| S | 100 × $0.0630 | $6.300 |
| A | 18 × $0.0460 | $0.828 |
| D | 92 × $0.0380 | $3.496 |
| V | 46 × $0.0212 | $0.975 |
| **Total per 100 candidates** | | **$23.67** |

Cross-check by token totals: input 2,470,600 tokens × $2/MTok = $4.94; output 1,873,000
tokens × $10/MTok = $18.73; sum $23.67 ✓.

**Per published question: $23.67 / 63 ≈ $0.38** (batch); ≈ $0.75 if run interactively
without the batch discount. Per published item that is ≈ 39,200 input and ≈ 29,700 output
tokens.

Output tokens (mostly thinking) are **79%** of cost. Prompt caching of the 6,000-token
prefix for G and R saves at most 6,000 × ($2.00 − $0.20)/MTok ≈ $0.011 per call, about $1.43
per 100 candidates (≈ 6%). Cache-write pricing and its interaction with batch pricing are not
in our cached facts; verify both. **Effort level matters far more than caching.**

### 9.4 Sensitivity and model options (owner decisions, never silent)

| Scenario | Per 100 candidates | Yield | Per published |
|---|---|---|---|
| Base (Opus 5.5, batch) | $23.67 | 63% | **$0.38** |
| Thinking tokens × 2 (effort high everywhere) | $35.61 | 63% | $0.57 |
| Thinking tokens × 0.5 | $17.70 | 63% | $0.28 |
| Pessimistic yield (e.g. organic chemistry) | ≈ $23.67 | 35% | $0.68 |
| Optimistic yield (maths with full verifier coverage) | ≈ $23.67 | 80% | $0.30 |
| Interactive (no batch) | $47.34 | 63% | $0.75 |
| Opus generator + Sonnet 5.5 solver (diversity; solver batch $1/$5) | $20.52 | 63% (assumed) | $0.33 |
| Sonnet 5.5 everywhere (batch $1/$5) | $11.84 | 50% (assumed lower) | $0.24 |
| Fable 5.1 everywhere (batch $5/$25) | $59.18 | 75% (assumed higher) | $0.79 |
| Extra cheap second solver on Haiku 5.5 (batch $0.05/$0.25) | +$0.16 | — | +$0.003 |

(Thinking × 2 adds 1,194,000 output tokens per 100 candidates = +$11.94. Sonnet and Fable
rows scale the base token profile by price ratio 0.5 and 2.5.)

**Human review dominates total cost.** At an assumed 12 minutes per review and a
placeholder $40/hour (owner to set), a review costs $8.00. With 75 reviews per 63 published
(1.19 per item), that is **$9.52 per published item, about 25× the AI cost**. A cheaper model
that raised the reviewer reject rate from 16% to 30% would raise review cost to
$8 / 0.70 = $11.43 per item (+$1.91), against a token saving of $0.14 (Sonnet row). That is
why the default stays `claude-opus-5-5`. The best levers are verifier coverage and reviewer
tooling, which cut reviewer minutes and rejects.

**Bank-scale example**: 1,500 published items per subject × 4 subjects = 6,000 items →
≈ 9,500 candidates, AI ≈ 6,000 × $0.38 = **$2,280**, review ≈ 7,143 reviews × 12 min ≈
1,429 hours ≈ **$57,000** at the placeholder rate.

**Parametric templates**: about 60 minutes of teacher time per template (author + review,
≈ $40 at the placeholder rate) and optionally ≈ $0.50 of AI drafting. Variants then cost no
AI per variant (the 70-variant cubic template in §4.12 comes to ≈ $40.50 / 70 ≈ $0.58 per
variant, including drafting). They are one family, so they add practice depth, not bank breadth.

No generation cost is incurred per student. All of this is offline.

---

## 10. Failure modes and detection

| Failure | Detected by | Residual handling |
|---|---|---|
| Wrong answer key | Verifier claims; independent solve; modal-wrong-answer stat; reports | Correction re-scores auto evidence (§2.9) |
| Key right, mark scheme too narrow (valid alternative rejected) | Solver dry run (Phase 3); mark disputes; invalid-input rate | Add method/accepted form; re-score |
| Ambiguous wording | Ambiguity call; solver disagreement; low discrimination | Repair or retire |
| Off-syllabus content | S05 tag check (codes); reviewer (substance) | Re-tag or retire |
| Too close to a past paper | §5.3 checks; reviewer attestation; reports | Takedown process |
| Diagram contradicts text | §6.3 checks; solver sees the PNG; vision check | Fix spec |
| Common error indistinguishable from the correct answer | S08 error discrimination; template `distinct` | Change numbers or precision |
| Verifier bug passes a wrong claim | Fault injection (≥ 98% detection); verifier unit tests; reviewer | Fix verifier; re-verify affected items by tool version |
| Model or prompt drift | Golden-set regression gate | Roll back prompt version |
| Licence expiry not enforced | Daily job; query-time filter; CI fixtures | Incident review |
| Generator output contains instructions (prompt injection into later stages) | Inputs to generation are all ours; downstream calls treat item text as data and are schema-constrained | Low risk; logged |
| Sandbox escape | No model-written code executed; Python only in an isolated container with limits | Container isolation |
| Reviewer fatigue or rubber-stamping | Seeded defects; κ; daily cap; minutes-per-review outliers (< 2 min) | Retraining, reassignment |
| Difficulty mis-estimated | Calibration; reviewer-band disagreement | Prior weights refit |

---

## 11. Implementation plan

**Phase 2: bank foundations (no AI generation).**

1. `QuestionItemSchema` + validator rules S01–S12 + `content:check` integration; YAML
   location and import into the §2.8 tables.
2. Marking engine (`src/domain/marking/engine.ts`) with three-valued evidence, FT, groups,
   special cases; consequence assertions. Unit tests built from hand-written schemes in
   each subject's conventions.
3. Checker extensions (§2.6): `numeric` s.f. range and percent forms, `numeric-set`,
   `coordinates`, `interval`, `angle-set`, `exact-form`, `chem-equation`, `trace-table`.
4. TS verifiers: physics units, chemistry formula/balance/stoichiometry, CS pseudocode
   interpreter (with conformance suite), boolean logic, number representation. Python
   verifier service with SymPy (maths) and RDKit/OPSIN (chemistry).
5. Parametric template engine + rendering helpers + enumeration in `content:check`.
6. Parametric diagram renderers for the first kinds (function-graph, geometry, circuit,
   free-body, structure, logic-circuit, trace-table rendering) with §6.3 checks.
7. Human-authored and template items for the first topics in each subject; paper specs;
   timed modes; assembly ILP; exposures.
8. Stats worker: facility, discrimination, time, modal wrong answer, reports; flags and
   alerts.
9. Licence tables, `visibleItems`, expiry job and takedown workflow (built even before any
   licence exists, because takedown applies to all sources).

**Phase 3: AI-assisted generation.**

1. Blueprints, coverage matrix, context bank, avoid-lists.
2. Prompt builder (allow-listed sources, firewall), generator and solver schemas, batch
   orchestration, `qgen_*` tables, cost accounting.
3. Originality service, threshold calibration set, escalation UI.
4. Ambiguity and adjudication calls; diagram vision check.
5. Review queue UI with checklist, inline edit and re-validation, bot commits, seeded
   defects, double review.
6. IRT calibration (PCM) and difficulty-prior refit; probation graduation.
7. Golden-set regression gate and fault injection in CI and nightly runs.

**Acceptance criteria before AI-generated items reach students**: verifiers catch ≥ 98% of
injected faults; originality recall ≥ 0.95 on the attack set with ≤ 5% escalation on
originals; a pilot of 200 published AI-assisted items per subject audited by a second teacher
shows < 2 defects per 100; counsel has signed off §5; labels verified in the UI.

---

## 12. Owner decisions

| # | Decision | Default recommended here |
|---|---|---|
| O1 | Show `ai-checked`, not-yet-teacher-reviewed exam items in a labelled preview pool? | **No** for Phases 2–3; revisit with defect data |
| O2 | Generator/solver models | `claude-opus-5-5` for all calls; option: Sonnet 5.5 solver for diversity (§9.4) |
| O3 | Reviewer pay rate and capacity (drives bank growth: 1,429 review-hours per 6,000 items) | To be set |
| O4 | Pursue a Cambridge licence for past papers and mark schemes | Yes, ask (§5.8); design does not depend on it |
| O5 | Hold a comparison corpus of public past papers | Only on counsel's written advice |
| O6 | Use de-identified wrong final answers to enrich `commonErrors` | Yes, if DPO approves and the privacy notice covers it |
| O7 | Show "AI-assisted" provenance on each item or in an info panel | On each item (honest default) |
| O8 | Allow probation items in full papers for new subjects | Yes, tagged `uncalibrated` |

## 13. Assumptions to replace with measurements

Token counts per call; stage pass rates and the 63% yield; 12 minutes per review; image
tokens per diagram; originality thresholds; difficulty-prior weights; component durations
and topic mark targets (to be transcribed from the official syllabuses); Cambridge marking
conventions per subject (to be checked against current published marking principles).
