# Grade estimation methodology

Design study for Phase 4. Status: **draft for review** (2026-10-19).
Scope: how Fathom turns a student's practice evidence into (a) a per-component estimate of
current exam performance, (b) a probability distribution over AS / A Level grades, and
(c) optionally, a forecast to the exam date. Covers the evidence weights, the statistical
model, paper-difficulty equating, the grade-threshold data, sufficiency gates, the UI and
its wording, validation with kill criteria, and implementation.
Out of scope (sibling studies in `docs/design/`): the question bank, item calibration and
paper assembly (`question-generation.md`, whose contracts this study consumes), AI marking
of handwritten work, and the tutor.

> **What this is not.** The output is Fathom's statistical estimate from practice on
> Fathom. It is not a Cambridge result, not an official or teacher "predicted grade" (the
> term schools use for university applications), and not a guarantee. Every surface that
> shows it says so (§10).

> **All numbers in the worked examples are made up** (student data, item parameters,
> grade thresholds). Facts about Cambridge components, weightings and threshold tables are
> recalled and marked **verify**: each must be checked against the current syllabus PDF and
> published grade threshold tables before use, in the same way as `syllabus.yaml`.

---

## 0. Decisions in one table

| # | Decision | Why |
|---|---|---|
| D1 | Three separate outputs: the **record** (descriptive marks, always shown), the **current estimate** ("if you sat it now"), and a **forecast** (to the exam date). They are never merged into one number. The forecast is **off at launch** (Phase 4a) and is enabled only after it passes its own backtest (§7). | The brief requires current demonstrated performance to be kept separate from a forecast. Individual trends are noisy, and a forecast is what is most likely to be read as a promise. |
| D2 | Estimate a latent ability **θ per Cambridge component** (9709 P1, P5, …) on the same partial-credit (PCM) logit scale used for item calibration, with a multivariate-normal population prior across components (shrinkage) and a Bayesian posterior (exact 1-D profiles on a grid, Laplace and importance resampling). | This accounts for item difficulty and mark allocation by construction, handles little data by shrinkage, and lets components borrow strength without averaging them together. |
| D3 | Evidence enters as a **tempered likelihood** with weight `w = w_mode · w_source · w_dependence · 2^(−age/h)`. Full timed papers 1.0, timed question sets 0.8, untimed exam questions 0.5 (plus an untimed offset γ). Recall questions enter only through a correlated auxiliary dimension. Assisted attempts and repeats are excluded. | Each weight expresses how much a mark tells us about performance under exam conditions (§3). The weights are tuned by backtest within fixed orderings. |
| D4 | Marks that are still pending (working not yet evidenced) enter as **interval-censored** observations (`score ∈ [min, max]`). Nothing is imputed. | This answers the question left open by the scoring engine (`question-generation.md` §2.5) without inventing marks. |
| D5 | Timed and untimed performance are modelled separately: untimed responses inform `θ + γ`. The headline estimate is always **timed / exam conditions**. The untimed level is shown beside it, labelled. | The brief requires timed exam performance to be kept separate from untimed practice. |
| D6 | Grades come from **Monte Carlo simulation** over: the ability posterior, the score distribution of one sitting of a representative paper (Lord–Wingersky), day-to-day variation, mismatch between Fathom and Cambridge papers, and a **distribution of historical thresholds** (several series, same variant where possible). | Uncertainty is propagated rather than hidden. In the worked example (§5.5), one-sitting variation and Fathom-to-Cambridge paper mismatch each contribute more variance than ability uncertainty does. |
| D7 | Output: probability of each grade, the most likely grade, and an equal-tailed **80% range**. A grade letter is never shown without its range. | The brief requires a range and the most likely grade, with uncertainty shown. |
| D8 | **Hard sufficiency gates** must pass before any grade is shown. Before that, the student sees "not enough evidence yet" and the options that would unlock an estimate (§6). | No confident-looking number from thin data. |
| D9 | Paper difficulty is handled by **equating through item calibration**. For Cambridge papers not yet calibrated (licensed papers, or results a student reports from paper they sat elsewhere), that series' published thresholds act as the difficulty proxy (§8). | Raw marks on different papers are not comparable. |
| D10 | Grade thresholds are **transcribed numbers** with source, hash and double-entry verification, stored as YAML in git and imported to Postgres. The PDFs themselves are never redistributed. Permission to store and display them is sought (§9.4). | Provenance and correctness, with the licensing question settled before thresholds are shown to students. |
| D11 | Grade estimates are **opt-in**, are visible only to the student unless they choose to share them, and never send notifications. There are no comparisons with other students, and a hysteresis rule stops the displayed grade from flickering. | Wellbeing: many users are minors, and the brief rules out guilt-based mechanics. |
| D12 | The pipeline is **deterministic statistics with no LLM**. Monte Carlo runs from a seeded PRNG, so the same inputs and the same model version give the same output. AI enters only upstream, as weighted mark evidence from the marking module, and its share is disclosed. | The estimate must be reproducible, auditable and explainable. |
| D13 | Validation runs in three stages: simulation-based calibration, next-paper backtests on platform data, and real Cambridge outcomes reported with consent. Each stage has **kill criteria** that turn grade estimates off for a subject (§11). | An estimate that is not demonstrably calibrated should not be shown. |

---

## 1. Definitions

### 1.1 The three outputs

| Output | Question it answers | Method | Always available? |
|---|---|---|---|
| **Record** (descriptive) | "What have I actually scored?" | Sums and rates only: marks earned / available by component, mode (timed paper, timed set, untimed), topic and date. No model. | Yes (once there is any evidence) |
| **Current estimate** ("current demonstrated performance") | "If I sat a typical Paper 1 today, under exam conditions, what would I probably score, and what grade would that be?" | §4–5: θ posterior as of today, converted through a representative paper and historical thresholds. | Only after the gates pass (§6) |
| **Forecast** | "Where am I likely to be on the exam date?" | §7: damped trend applied to the θ history, with widening intervals. | Phase 4b, after its own gates and backtest |

The current estimate describes only what the evidence shows now. It assumes no further
study and makes no claim about the exam date. The forecast is a separate statement that
depends on the student's behaviour ("if your recent progress continues and then levels
off"). Each has its own visual and its own wording (§10). The forecast never replaces the
current estimate.

### 1.2 Vocabulary

| Term | Meaning here |
|---|---|
| Component | A Cambridge paper such as 9709 Paper 1. Each has a maximum raw mark, a duration and a weighting. |
| Variant | The administrative-zone version of a component (e.g. 9709/11, /12, /13). Thresholds can differ between variants. |
| Option | The combination of components (and variants) a candidate enters for a qualification. Cambridge publishes option-level thresholds. |
| Series / session | An exam series (June, November; March in some markets, **verify**). |
| θ_c | The student's latent ability on component c, in logits, on Fathom's calibrated scale. θ = 0 is the **average Fathom student** on that component, not the Cambridge cohort. |
| γ | The untimed offset: how much better the same student does when the clock is removed (in logits). |
| Reference form | A distribution of representative papers for a component (§5.1), used to turn θ into marks. |
| TCC | Test characteristic curve: expected raw score on a form as a function of θ. |
| Single-sitting range | The range of marks one sitting of a typical paper could plausibly produce, including the luck of which questions appear and how the day goes. |
| Anchored / unanchored | Whether a component's conversion to Cambridge grades uses calibrated real Cambridge papers (anchored) or Fathom's own papers plus extra mismatch uncertainty (unanchored) (§5.1). |

### 1.3 Deterministic, AI or human

| Step | Deterministic code | AI | Human |
|---|---|---|---|
| Which attempts count, and their weights | ✔ | | Owner sets policy; backtest tunes it |
| Marks on typed answers | ✔ (marking engine) | | |
| Marks on handwritten working | Engine combines evidence | ✔ evidence only (marking study), weighted 0.7 or 0.5 | Student confirms the transcription; teacher marks where available |
| Item parameters (difficulty, steps) | ✔ (PCM calibration, stats worker) | | |
| θ posterior, simulation, gates, forecast | ✔ | | |
| Threshold data | Validators | | ✔ two independent transcriptions |
| Explanatory text | ✔ (templates filled from computed values) | | Copy reviewed by owner and safeguarding lead |
| Validation and kill decisions | Metrics computed ✔ | | ✔ owner decides |

No LLM is called anywhere in this pipeline (§12.7).

---

## 2. Cambridge grading facts the model depends on (verify)

### 2.1 How grades are awarded

* Cambridge International AS Level is graded **a–e** and A Level **A\*–E**. Results below
  the lowest grade are ungraded (u / U).
* A grade is awarded on the candidate's **weighted total** across the components of the
  option they entered. It is **not** an average of component grades. A\* exists at option
  (qualification) level only, not for an individual component (**verify** wording in the
  threshold tables).
* **Thresholds are set afresh for each series** as part of awarding, and can differ by
  component variant and option. Cambridge publishes a **grade threshold table** for each
  syllabus and series on its website. As recalled (**verify** the format against the
  current PDFs), each table gives, per component variant, the maximum raw mark and the
  minimum raw mark needed for each of A–E (a–e), and, per option, the maximum weighted total
  and the minimum weighted total for each grade, including A\* for A Level options. The
  table also states the maximum total after weighting.
* A Level can be **staged**: AS components are taken in an earlier series and carried
  forward. The carry-forward rules and time limits must be checked in the current Cambridge
  Handbook (**verify**). Modelling carry-forward is a Phase 4b extension (§5.6).

### 2.2 Component weightings (recalled from current syllabuses, verify each against its PDF)

| Syllabus | Level | Components (max raw marks) and weighting |
|---|---|---|
| 9709 Maths | AS | P1 (75) 60% + one of P2 / P4 / P5 (50) 40% |
| 9709 Maths | A | P1 (75) 30% + P3 (75) 30% + two of P4 / P5 / P6 (50) at 20% each; P4 + P6 not permitted; P2 cannot count towards A Level (see `content/subjects/9709/syllabus.yaml` notes) |
| 9702 Physics, 9701 Chemistry | AS | P1 MCQ (40) 31%, P2 (60) 46%, P3 practical (40) 23% |
| 9702, 9701 | A | P1 15.5%, P2 23%, P3 11.5%, P4 (100) 38.5%, P5 planning (30) 11.5% |
| 9618 CS | AS | P1 (75) 50%, P2 (75) 50% |
| 9618 CS | A | P1, P2, P3, P4 (75 each) at 25% each |

**Weighting factors.** The weighted total for option o is

```
T_o = Σ_c f_{o,c} · X_c          X_c = raw mark on component c
f_{o,c} = W_{o,c} · T_o^max / M_c   W = syllabus weighting, M_c = component max, T_o^max = option max after weighting
```

For 9709 the raw maxima already sit in the weighting proportions (75 : 50 = 60 : 40), so
`f = 1` and `T^max = 125` (AS) or `250` (A). For 9702 AS they do not (40 : 60 : 40 against
31 : 46 : 23). As a **hypothetical** illustration only: if a table stated `T^max = 200`,
then `f = 1.55, 1.533, 1.15` for P1, P2, P3. The importer derives `f` from the stated
`T^max` and the syllabus weightings, and rejects a table unless `Σ f·M = T^max` (±0.5) and
each `f·M / T^max` is within 0.5 percentage points of the weighting. If Cambridge's
published method differs (for example, integer factors with rounding), the importer
stores the published factors and the validator checks those instead.

### 2.3 Components Fathom cannot assess

9702 and 9701 Paper 3 (laboratory practical) is not assessed on Fathom. It is 23% of the AS
qualification and 11.5% of the A Level. 9618 Paper 4 (practical programming) is only
partly covered (sandboxed code items), and 9702/9701 Paper 5 is covered by planning items
only. For such a component the model draws θ from its **conditional prior** given the
student's other components, using the population correlation. This is labelled
"assumed from your other papers, very uncertain", and is replaced by evidence if the
student enters a school practical mark (§3.8). Gate Q3 (§6.2) limits how much of a
qualification may be assumed in this way.

---

## 3. Evidence and reliability weights

### 3.1 What counts at all (eligibility filters)

An exam leaf response (a marked part or sub-part, from `exam_attempts`) is eligible for
grade evidence only if **all** of the following hold:

1. The item is `published` and human-reviewed. Probation items are allowed, with their
   parameter uncertainty (§4.4). `ai-checked` preview-pool items, flagged and suspended
   items are excluded (`question-generation.md` D3, §2.10).
2. The item's `source` is `cambridge-style` or `licensed-past-paper`. `original`
   (scaffolded, non-exam-format) items count only towards mastery.
3. It is the student's **first attempt at the item's family**. Later exposures are
   memory, not ability.
4. It was unassisted: `hints_used = 0`, `tutor_used = false`, and the answer was not
   revealed before submission (`hintsUsed` / `solutionViewed` flags from AI-marked
   submissions included).
5. It was submitted, with time on task ≥ 10 s (the same filter as calibration).
6. It belongs to a component in the student's chosen option.

Recall questions (lesson and review attempts in the existing `attempts` table) follow the
separate path described in §3.9.

### 3.2 Weight formula

Each eligible observation i gets a weight in (0, 1] that multiplies its log-likelihood.
This is a tempered or power likelihood. A weight of 0.5 means "this counts as half an
observation", which widens the posterior honestly.

```
w_i = w_mode(i) · w_source(i) · w_dep(i) · 2^(−Δt_i / h)
```

The weights are **initial values**. The next-paper backtest (§11.2) tunes them to maximise
the predictive log-likelihood of held-out full papers, under fixed order constraints:
`w_paper ≥ w_timed_set ≥ w_untimed`, and `w_teacher ≥ w_auto ≥ w_ai ≥ w_self`. Each tuned
set is a new `grade_model_params` version (§12.2).

### 3.3 Mode weights

| Mode (from `exam_attempts.mode` and the conditions declared at submission) | `w_mode` | Why |
|---|---|---|
| Full paper, exam conditions (`paper`; server-authoritative timer; tutor disabled; not overtime; student declared "exam conditions") | **1.0** | Closest to the real thing: a representative blueprint (not adapted to the student, `question-generation.md` §7.2), the full duration, time allocation across questions, and stamina. This is the evidence the estimate is about. |
| Full paper submitted `overtime` (beyond the 2-minute grace) | 0.8 | Treated as a timed set: the timing condition was not met. |
| Timed question set (`timed-question`), or a full paper the student declared "interrupted" | **0.8** | Timed, but shorter. Topic choice is often the student's, so the set is less representative, and endurance and time allocation across a whole paper are not tested. |
| Untimed exam practice (`practice`, first attempt, unassisted) | **0.5**, and the observation informs `θ + γ` | No time pressure, and possible use of notes, which cannot be verified. The offset γ corrects the average shift. The lower weight covers the extra noise and selection: students pick topics they are working on. |
| Recall questions | not in the exam likelihood (§3.9) | A different format (short, single-step), repeated by spaced repetition, and on a different scale. |

**Declared conditions.** At submission, and **before marks are shown**, a full paper asks
"Did you sit this under exam conditions?" (**Yes** / **I was interrupted**). Declaring an
interruption downgrades the paper to timed-set weight, and blank leaves are then ignored
instead of scored 0. Asking before results are shown prevents cherry-picking bad papers
after seeing the marks. The exclusion rate is monitored (§13). If the timer expires, the
paper is auto-submitted and unanswered leaves score 0, as in a real exam, unless the
student declared an interruption.

### 3.4 Source weights (per mark point, from the marking engine's evidence)

| Evidence source | `w_source` | Why |
|---|---|---|
| `teacher` | 1.0 | A qualified marker applies the scheme. |
| `auto` (deterministic checker) | 1.0 | Reproducible. Residual key errors are caught by item monitoring. |
| `ai-estimate` (marking study label "estimate", `ai-marking.md` §4.4) | 0.7 | AI marking of working is an estimate. Its error rate is measured, not zero. The leaf enters as the interval `[L, U]` from `ai-marking.md` §4.3 (firm points fixed), so soft points widen it instead of being taken at face value. |
| `ai-estimate` with `finalAnswerEdited` | 0.5 | The student edited a final-answer line in the transcript. Nothing verifies the edit against the image (`ai-marking.md` §1.8). |
| `ai-uncertain`, `ai-rough`, feedback-only | **excluded** | As specified in `ai-marking.md` §1.13: these do not move grade prediction. |
| `self` (self-assessed against the mark point) | 0.5 | The same rule as mastery (`src/domain/mastery.ts`: self-marked counts for half). Self-marking tends to be lenient (to be measured). |
| `null` (pending) | see §3.7 | Interval-censored, not weighted. |

Uploads of questions that are not in the bank (`ai-marking.md` mode B, or the
validated-expected-answer route) have no calibrated item parameters. They count towards
mastery, not grade evidence.

A leaf's `w_source` is the mark-weighted mean over its decided mark points:
`w_source(leaf) = Σ_p m_p · w(src_p) / Σ_p m_p`. Example: a 75-mark paper with 55 marks
decided automatically and 20 marks from confirmed AI evidence gets
`(55·1 + 20·0.7) / 75 = 0.92` (row 2 of §4.7).

### 3.5 Local dependence within an item

Leaves of one multi-part item share a stem, "hence" chains and follow-through, so they are
not independent given θ. Treating them as independent overstates the information they
carry. Each leaf of an item with L leaves therefore gets a design-effect weight

```
w_dep = 1 / (1 + (L − 1) · ρ_LD)
```

where `ρ_LD` is the mean within-item residual correlation (Yen's Q3), estimated per
component by the stats worker. The default is 0.2, so a 3-leaf item has `w_dep = 0.71`.

### 3.6 Recency

The half-life is `h = 42` days to start (tuned over {28, 42, 60, 90} by backtest).
Evidence from 6 weeks ago counts half. The student-facing explanation says exactly that.
Known consequence: for an improving student, the current estimate lags real progress by
roughly a half-life. This is conservative for improving students, and the trend model
(§7) addresses it.

### 3.7 Pending marks: interval censoring

The engine returns a leaf score range `[lo, hi]`. If working has not been evidenced, the
range is wider than one mark. The leaf's likelihood is the probability that the score
falls in that range:

```
L_i(θ) = Σ_{k=lo_i}^{hi_i} P_i(k | θ)
```

No value is imputed and no mark is assumed. A wider range simply carries less
information. Worked example: a 3-mark leaf with PCM steps (−0.5, 0.2, 0.8) at θ = 0.5 has
`P(0..3) = 0.099, 0.269, 0.363, 0.269`. A fully decided score of 3 contributes Fisher
information 0.89 and a score gradient of +1.20. A pending result "1–3 of 3" contributes
information 0.30 and gradient +0.20, so the evidence counts but weakly. Pending marks do
**not** count towards the gate totals in §6. If the student later self-assesses or uploads
working, the leaf becomes decided, with that source's weight.

### 3.8 External results (self-reported)

Students can enter marks from papers sat away from Fathom, such as a school mock or a real
past paper sat at home with the official mark scheme. No question content is stored, only
the paper reference and the mark.

| Field | Values |
|---|---|
| Paper | Component, and optionally series + variant (e.g. "9709/12 June 2024"), or "unknown / school-written" |
| Mark | raw / max |
| Conditions | `exam-at-school`, `timed-at-home`, `untimed` |
| Marked by | `teacher`, `self` |
| First time seeing this paper? | yes / no (no → excluded) |

Such a result enters as a Gaussian pseudo-observation of θ_c (§8.3). Its weight is
`w_mode` from the conditions (1.0 / 1.0 / 0.5 with γ) × `w_source` (teacher 0.8, because
the number is unverifiable; self 0.5). An unknown paper gets an extra linking error of
0.30 logits. External results can satisfy the gates only for unmeasured components (Q3).
Elsewhere they inform the estimate but cannot unlock it alone, which removes the incentive
to type in a hopeful number.

### 3.9 Recall questions

Recall attempts measure retrieval of facts and single steps. They are central to mastery
and spaced repetition, and only weakly related to exam marks. They enter as an
**auxiliary dimension** ρ (a Rasch ability over recall items) that is correlated with each
θ_c through the population covariance, with the correlation capped at 0.5 and a tempering
weight of 0.25 (repeats under spaced repetition are not independent). Even perfect
knowledge of ρ, with r = 0.5, removes at most `r² = 25%` of the prior variance of θ_c:
recall can nudge an estimate, never carry it. Recall evidence never counts towards a gate.
It does drive the topic-level "what would move this" suggestions (§10.4) through mastery
states.

---

## 4. Model: current ability per component

### 4.1 Item model

The item model is the partial credit model (PCM) at leaf level, as calibrated in
`question-generation.md` §4.11. For leaf i with maximum m_i and step parameters
b_i1 … b_im:

```
P_i(k | θ) = exp( Σ_{j=1..k} (θ − b_ij) ) / Σ_{h=0..m_i} exp( Σ_{j=1..h} (θ − b_ij) ),   k = 0..m_i
E_i(θ) = Σ_k k · P_i(k | θ)        V_i(θ) = Σ_k (k − E_i)² · P_i(k | θ)
```

For an interval observation `[lo, hi]`, with `E_i^[lo,hi]` and `V_i^[lo,hi]` the mean and
variance of X restricted to the interval:

```
∂/∂θ log L_i   = E_i^[lo,hi](θ) − E_i(θ)
∂²/∂θ² log L_i = V_i^[lo,hi](θ) − V_i(θ)      (≤ 0; equals −V_i for an exact score)
```

PCM is a Rasch-family model, so on a fixed set of leaves the raw total is sufficient for
θ. Difficulty and mark allocation are accounted for because every leaf contributes
through its own step parameters and its own maximum. Six marks on easy leaves and six on
hard leaves yield different θ.

**Contract change requested from the question-bank study:** item calibration must include
a mode covariate (untimed responses modelled as `θ + γ_c`), so that item parameters sit on
the timed scale and γ_c is estimated jointly. Leaf step parameters must also be stored with
their standard errors and a `valid_from` date (§12.2).

### 4.2 Student parameters and prior

For a student in subject s with option o over components c = 1..K:

```
ϑ = (θ_1, …, θ_K, ρ, γ_s)
(θ_1..θ_K, ρ) ~ MVN(μ_pop, Σ_pop)            population prior, per subject and syllabus version
γ_s ~ N(0, σ_γs² + se(γ_c)²)                  student deviation from the population untimed offset γ_c
untimed effective ability on component c = θ_c + γ_c + γ_s
```

* `μ_pop` is 0 by the calibration anchor. `Σ_pop` has unit variances to start and
  correlations estimated nightly by the stats worker from students with evidence on two or
  more components (EM on their posteriors). Defaults until n ≥ 200 such students: 0.6
  between components of the same subject, 0.3 between ρ and each θ_c. Correlations are
  capped at 0.85 (θ–θ) and 0.5 (ρ–θ).
* `γ_c` defaults to 0.35 logits (se 0.10), about 5 percentage points of marks near the
  middle of the scale, until estimated. `σ_γs` = 0.15.
* **Shrinkage.** With little data the posterior stays near the population mean, and a
  component with no data is inferred from the others through Σ_pop. The **prior share** of
  each θ_c is reported and gated (§6):
  `prior_share_c = (Σ_pop⁻¹)_cc / (−H)_cc`, the fraction of posterior precision that comes
  from the prior.
* The prior is the Fathom population, which is self-selected and not the Cambridge cohort.
  This is another reason to gate on prior share.

### 4.3 Posterior

```
ℓ(ϑ) = log MVN(θ, ρ; μ_pop, Σ_pop) + log N(γ_s; 0, σ_γs² + se(γ_c)²)
     + Σ_{i ∈ exam leaves}   w_i · log Σ_{k=lo_i..hi_i} P_i(k | θ_c(i) + u_i·(γ_c(i) + γ_s))     u_i = 1 if untimed
     + Σ_{j ∈ recall}        w_j · [ x_j log σ(ρ − β_j) + (1 − x_j) log(1 − σ(ρ − β_j)) ]
     + Σ_{e ∈ external}      w_e · log N(θ̂_e; θ_c(e), s_e²)
```

Here σ is the logistic function, β_j is the recall item's Rasch difficulty, and x_j ∈
[0, 1] is the recall score.

**Computation (exact and cheap).** Every exam term depends on a single scalar, `θ_c` or
`θ_c + γ`. The likelihood therefore splits into one-dimensional profiles that are computed
once per estimate on a grid (θ ∈ [−6, 6], step 0.01, 1,201 points):

```
λ_c^T(t) = Σ_{timed i on c} w_i log L_i(t)        λ_c^U(t) = Σ_{untimed i on c} w_i log L_i(t)
ℓ(ϑ) = log prior(ϑ) + Σ_c [ λ_c^T(θ_c) + λ_c^U(θ_c + γ_c + γ_s) ] + λ^R(ρ) + Σ_e (…)
```

1. Build the profiles. The cost is O(grid × leaves), for example 1,201 × 2,000 PCM
   evaluations, about 10 ms in Node.
2. Find the MAP by Newton–Raphson on ϑ (dimension K + 2 ≤ 7), using analytic leaf
   derivatives (§4.1) or the grid's cubic-spline derivatives, with step-halving. Stop when
   ‖Δ‖ < 1e-6 or after 50 iterations.
3. Laplace step: `Σ_post = (−H(ϑ̂))⁻¹`.
4. **Sampling importance resampling (SIR).** Draw 4R proposals from a multivariate
   t₅(ϑ̂, Σ_post), weight each by `exp(ℓ(ϑ)) / t₅(ϑ)` (exact ℓ via the profiles), and
   resample R = 8,000. If the effective sample size is below R/4, double the proposals
   once. If it is still low, the estimate is marked `unstable`, no grade is shown, and the
   case is logged. This corrects the skew that appears with perfect or near-zero scores
   and with sparse data.

### 4.4 Item-parameter uncertainty

Leaf parameters are estimates. Probation items, and owner-allowed uncalibrated papers
(`question-generation.md` O8), carry large `b_se`. Their effect is added to each θ_c's
posterior variance by the delta method:

```
Var_item(θ_c) = Σ_{i on c} ( w_i I_i / Σ_j w_j I_j )² · se(b_i)²  +  1[uncalibrated paper present] · σ_paper²
```

Here I_i is the leaf's information at θ̂_c and `σ_paper` = 0.3 logits covers shared
(non-independent) prior error. Consequence: for a brand-new subject with no calibrated
items, a single 12-item paper with `se(b) = 1` gives `Var_item ≈ 1/12 + 0.09 = 0.17`
(SD 0.42 logits, about 7 percentage points of marks), which fails gate C3. **Grade
estimates for a new subject therefore wait for calibration.** This is deliberate. Relaxing
it is an owner decision (O4).

### 4.5 Consistency (day-to-day variation)

Real performance varies between sittings by more than item sampling explains. For a
student with n_k ≥ 2 full papers on a component, with per-paper estimates θ̂_k (standard
errors se_k):

```
s²_excess = max(0, (1/n_k) Σ_k [ (θ̂_k − θ̄)² − se_k² ])
σ²_day,student = (ν₀ · σ²_day,pop + n_k · s²_excess) / (ν₀ + n_k),   ν₀ = 4
```

`σ_day,pop` defaults to 0.20 logits (estimated nightly from students with three or more
full papers within 60 days). It is used only in simulating a sitting (§5.3). It widens the
single-sitting range for inconsistent students. It does not move θ.

### 4.6 Outputs per component

| Output | Definition |
|---|---|
| Level | Posterior of `TCC_ref,c(θ_c)`: mean and 10th / 90th percentiles over draws. "Expected mark on a typical paper today, under exam conditions." |
| Single-sitting range | 10th / 50th / 90th percentiles of the simulated marks X_c (§5.3). |
| Untimed level | Mean of `TCC_ref,c(θ_c + γ_c + γ_s)`. |
| Topic offsets | `δ̂_t = Σ_{i∈t} w_i g_i(θ̂_c) / ( Σ_{i∈t} w_i (−h_i(θ̂_c)) + 1/τ² )` with τ = 0.5 logits (one Newton step from the component θ with a shrinkage prior). This is converted to expected marks on topic t in a typical paper: `Σ_{i∈ref, topic t} E_i(θ̂_c + δ̂_t)`. |
| Evidence summary | Full papers, reliability-weighted timed marks, untimed marks, AI-evidence share, self-assessed share, coverage, date of last timed evidence. |

### 4.7 Worked example (made-up data)

A student is aiming for **9709 AS Level, option P1 + P5** (75 + 50 = 125, weighted 60/40).
The estimate is made on 19 Oct 2026. The real PCM runs at leaf level. To keep the
arithmetic visible, this example treats each paper as M one-mark Rasch units with
difficulties evenly spaced over `d ± 2` logits, where d is the form's difficulty. Each
block is reduced to its MLE θ̂ and standard error, and the blocks are combined by
precision weighting. An exact weighted-likelihood grid gives the same answer to within
0.01 logits (below).

Parameters: h = 42 days; γ = 0.35 ± 0.10; prior SD 1 with ρ(P1, P5) = 0.6. Reference forms
(Fathom papers assembled to Cambridge-like difficulty) have d = −0.5 for both components.

| # | Comp | Evidence | Marks | Score | Form d | Age (d) | w_mode | w_src | 2^(−age/42) | **w** | θ̂ (block) | se | Obs. for θ | **w / var** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | P1 | Full paper F1, typed, all auto | 75 | 49 | −0.3 (harder) | 42 | 1.0 | 1.00 | 0.500 | 0.500 | +0.53 | 0.275 | +0.53 | 6.60 |
| 2 | P1 | Full paper F2; 20 marks from AI-read working, confirmed | 75 | 55 | −0.7 (easier) | 7 | 1.0 | 0.92 | 0.891 | 0.820 | +0.61 | 0.291 | +0.61 | 9.68 |
| 3 | P1 | Two 30-min timed sets | 30 | 20 | −0.4 | 21 | 0.8 | 1.00 | 0.707 | 0.566 | +0.51 | 0.440 | +0.51 | 2.92 |
| 4 | P1 | Untimed practice (first attempts, no hints) | 120 | 92 | −0.6 | 21 (median) | 0.5 | 1.00 | 0.707 | 0.354 | +0.92 | 0.238 | +0.57 (= 0.92 − γ) | 5.30 |
| 5 | P5 | Full paper F3 | 50 | 33 | −0.5 | 14 | 1.0 | 1.00 | 0.794 | 0.794 | +0.37 | 0.339 | +0.37 | 6.92 |
| 6 | P5 | Untimed practice | 60 | 44 | −0.5 | 28 | 0.5 | 1.00 | 0.630 | 0.315 | +0.81 | 0.326 | +0.46 | 2.71 |

For untimed rows, `var = se² + 0.10²` (uncertainty in γ). Recall evidence is omitted for
brevity: its effect is bounded (§3.9).

**Equating in action.** F1 and F2 differ by 6 raw marks (49 vs 55) but by only 0.08 logits
in θ̂. On the reference form they correspond to 51.6 and 52.6 out of 75. About 5 of the 6
raw marks are paper difficulty, not ability.

**Combine.** Data precision: P1 = 6.60 + 9.68 + 2.92 + 5.30 = 24.50, with a
precision-weighted mean of +0.568. P5 = 6.92 + 2.71 = 9.63, mean +0.395. The prior
precision matrix for ρ = 0.6 is `[[1.5625, −0.9375], [−0.9375, 1.5625]]`. The posterior
precision is `[[26.06, −0.94], [−0.94, 11.20]]` and

```
θ_P1 = 0.548 ± 0.196        θ_P5 = 0.386 ± 0.299        (exact weighted grid: 0.554 ± 0.193, 0.397 ± 0.297)
prior share: P1 1.5625 / 26.06 = 0.06     P5 1.5625 / 11.20 = 0.14
```

**Component outputs** (reference form; single-sitting ranges from the simulation in §5.5):

| | Level (expected mark) | Level 80% (posterior only) | Single sitting 10–50–90% | Untimed level | Average Fathom student |
|---|---|---|---|---|---|
| P1 /75 | 51.8 (69%) | 48.5–54.8 | 44 – 52 – 60 | 56.1 (75%) | 44.5 (59%) |
| P5 /50 | 33.1 (66%) | 29.7–36.3 | 27 – 33 – 39 | 36.1 (72%) | 29.7 (59%) |

### 4.8 Why this is not a simple average

A naive estimate pools every mark: 293 / 410 = 71.5% gives 89 / 125, which against the
mean of the thresholds in §5.5 reads as a confident "b". That calculation:

* counts untimed practice (180 of the 410 marks, at 76%) at full weight;
* ignores that F2 was an easy paper and F1 a hard one;
* ignores evidence age and the AI-marked share;
* weights P1 and P5 by marks *practised* (300 : 110) instead of the qualification
  weighting (60 : 40);
* gives no uncertainty. As §5.5 shows, a single sitting alone spreads this student over
  three grades.

Together these put the naive figure 3.5 percentage points above the model's exam-conditions
expectation (84.9 / 125 = 68%). With more untimed practice, or easier papers, the gap would
grow.

---

## 5. Converting to a grade

### 5.1 Reference forms and the anchoring problem

θ lives on Fathom's scale. Thresholds live on Cambridge's raw marks for Cambridge's
papers. Converting between them needs an assumption about how a Fathom paper compares
with a Cambridge paper. There are two modes, chosen per component:

| Mode | When | Score model on the day | Extra uncertainty |
|---|---|---|---|
| **Unanchored** (launch default) | No calibrated Cambridge papers for the component | **Reference form**: the mixture of F = 50 paper instances drawn by the assembly ILP from the calibrated pool, with the spec's θ = 0 difficulty target (`question-generation.md` §7.2). They are never shown to students. The score distribution given θ is the average of the 50 instances' Lord–Wingersky distributions (formula below the table). | Form mismatch `δ_form ~ N(0, (σ_form · M_c)²)` added to the marks, with σ_form = 5% of the component maximum until estimated from outcomes. Thresholds are sampled independently of paper difficulty, which is conservative (§5.2). |
| **Anchored** | Licensed Cambridge past papers for the component, calibrated (≥ 80% of the paper's marks on leaves with `b_se ≤ 0.3`) | The **actual session form**: simulate the score on the calibrated past paper of the sampled session, and compare it with *that* session's thresholds. | None for form mismatch. Paper difficulty and its thresholds are correctly paired. |

LW is the Lord–Wingersky recursion: the exact distribution of the total score given θ. The
unanchored reference form averages it over the F instances:

```
P_ref(X = x | θ) = (1/F) Σ_f LW_f(x | θ)

f_0(0) = 1
f_i(s) = Σ_{k=0..m_i} f_{i−1}(s − k) · P_i(k | θ)          s = 0 .. Σ_{j≤i} m_j
```

It is precomputed per form on a θ grid (step 0.02 over [−4, 4], 401 points) and stored as
CDFs (§12.2).

In the anchored mode, the per-series grade boundaries in θ, `θ_{s,g} = TCC_s⁻¹(t_{s,g})`,
also show how stable Cambridge's standard is on our scale. Their spread across series
replaces the conservative raw-threshold spread.

### 5.2 The threshold distribution

* **Eligible series:** the same syllabus code with the same component structure and maxima
  (a `comparable_group` on threshold sources, §9.3); main series (June, November); March
  only if the student sits in a March market (**verify** which syllabuses have one); the
  most recent N = 6 eligible series (about 3 years).
* **Variant:** if the student has set their usual variant (e.g. "I sit /12"), use option
  rows built from that variant. Otherwise pool all variants, weighting each series equally.
* **Minimum:** 3 eligible series (gate Q4). After a structural syllabus change with fewer
  than 3 series, the previous structure's series may be used if the component maxima match.
  The result is labelled, and the common-shift SD is doubled.
* **Predictive draw:** pick a series s uniformly, then shift all its option thresholds by a
  common `e ~ N(0, σ_S² / n)`. Here σ_S is the between-series SD of the mean threshold
  level (in weighted marks) and n the number of series. This approximates the uncertainty
  in a *future* series: between-series variation plus uncertainty in its mean,
  `≈ σ_S²(1 + 1/n)`. Sampling whole series keeps a series' grades internally consistent
  (A ≥ B ≥ …).
* **Why unanchored conversion is conservative.** On a hard paper, thresholds are lower *and*
  the student scores lower. The unanchored mode samples thresholds independently of
  reference-form difficulty, so it overstates spread. This is accepted until anchoring or
  outcome data allow the threshold variation to be split into "difficulty" and "standard"
  parts.

### 5.3 Simulation algorithm

```
input: posterior draws ϑ^(1..R) (SIR, R = 8,000), option o, per-component conversion mode,
       eligible series S_o with option thresholds t_{s,g} and factors f_{o,c}, σ_S, σ_day, σ_form
rng ← PRNG(seed = sha256(user_id ‖ inputs_hash ‖ model_version)[0..16])
for r in 1..R:
  s ← uniform(S_o);  e ← N(0, σ_S² / |S_o|)
  T ← 0
  for c in components(o):
    θd ← θ_c^(r) + N(0, σ_day,student,c²)               # day-to-day variation
    if anchored(c, s): X ← sample LW_{form(c,s)}(· | θd)
    else:              X ← clip(round(sample P_ref,c(· | θd) + N(0, (σ_form,c · M_c)²)), 0, M_c)
    T ← T + f_{o,c} · X                                  # unmeasured components: θ_c^(r) comes from
                                                         # the conditional prior inside ϑ^(r) (§2.3)
  grade^(r) ← highest g with T ≥ t_{s,g} + e (u if none)
  record T^(r), X_c^(r), grade^(r)
```

The cost per estimate is about 8,000 × K inverse-CDF lookups, in milliseconds. Monte Carlo
error on a probability is at most √(0.25/8000) = 0.006. Displayed probabilities are
rounded to 5%.

### 5.4 Summaries

| Summary | Definition |
|---|---|
| `P(g)` | Share of draws with grade g. Stored unrounded, displayed rounded (§10). |
| Most likely grade | argmax_g P(g). If two grades are within 0.05 of each other, both are named ("b or c"). |
| 80% range | Equal-tailed. Lower end = the highest g with `P(grade ≥ g) ≥ 0.90`. Upper end = the lowest g with `P(grade ≤ g) ≥ 0.90`. Because grades are discrete, the range usually covers more than 80%, and its actual mass is stored (`range_mass`) so validation compares like with like (§11.4). |
| `P(at least g)` | Cumulative probabilities. Shown only on request ("What's my chance of at least a B?"), because students with offers ask exactly this. |
| Weighted total | 10th / 50th / 90th percentiles of T. |

### 5.5 Worked example continued

Six made-up series for option P1 + P5 (max 125). **These are not real Cambridge
thresholds.**

| Series | a | b | c | d | e |
|---|---|---|---|---|---|
| J23 | 94 | 82 | 70 | 58 | 46 |
| N23 | 91 | 78 | 66 | 55 | 43 |
| J24 | 96 | 85 | 73 | 61 | 49 |
| N24 | 92 | 80 | 67 | 55 | 43 |
| J25 | 89 | 77 | 66 | 54 | 42 |
| N25 | 93 | 81 | 69 | 58 | 46 |
| mean (%) | 92.5 (74.0) | 80.5 (64.4) | 68.5 (54.8) | 56.8 (45.5) | 44.8 (35.9) |

σ_S = 2.6 marks. With the posterior from §4.7, σ_day = 0.20, σ_form = 5% (unanchored) and
R = 40,000 (more than production, to show stable numbers):

```
P(a) = 0.18   P(b) = 0.51   P(c) = 0.28   P(d) = 0.03   P(e or u) < 0.01
most likely: b       80% range: c to a   (P(≥ b) = 0.69 < 0.90, so the lower end is c; P(≤ b) = 0.82 < 0.90, so the upper end is a)
weighted total: 74 – 85 – 95 / 125 (10th – 50th – 90th)
```

**Where the uncertainty comes from** (SD of the total in marks, and the grade
probabilities, adding one source at a time; mean thresholds used until the last row):

| Sources included | SD(T) | a | b | c | d |
|---|---|---|---|---|---|
| Ability posterior only (expected score) | 3.7 | 0.02 | 0.86 | 0.12 | 0.00 |
| + which questions appear (one sitting, LW) | 5.9 | 0.09 | 0.68 | 0.23 | 0.00 |
| + day-to-day variation | 6.6 | 0.12 | 0.63 | 0.25 | 0.01 |
| + form mismatch (unanchored) | 8.1 | 0.17 | 0.53 | 0.27 | 0.02 |
| + threshold variation across series (= full model) | 8.0 | 0.18 | 0.51 | 0.28 | 0.03 |
| θ known exactly, everything else included | 7.1 | 0.15 | 0.57 | 0.26 | 0.02 |
| θ known exactly, anchored (no form mismatch) | 5.5 | 0.10 | 0.66 | 0.23 | 0.01 |

### 5.6 Consequences for the product

1. **There is a floor.** Even with perfect knowledge of ability, one sitting spreads this
   mid-band student over three grades, and P(most likely) stays below about 0.6
   (unanchored) or 0.7 (anchored). Grade bands here are about 12 marks wide, against a
   single-sitting SD of 5.5–7 marks with θ known. More practice data cannot remove this, so the UI must not
   imply it can (§10.4).
2. **Anchoring is worth more than more data.** Removing form mismatch narrows the range
   more than collapsing the ability posterior does. Licensed past papers (`question-generation.md`
   O4) and outcome data (§11.3) matter more than extra papers.
3. **Staged A Level (Phase 4b).** If the student reports an AS grade already achieved, the
   AS components' contribution is drawn uniformly from that grade's band in the reported
   series' AS thresholds, scaled by the A Level weighting. Their current θ is ignored for
   those components, because those marks are already fixed.

---

## 6. Data sufficiency gates

The gates are deterministic, recomputed with every estimate, and stored with it. The
numbers are initial values, tuned by backtest (coverage must hold among estimates that
just passed).

### 6.1 Component gate (all must hold to show a component's level and single-sitting range)

| # | Condition | Initial value | Why |
|---|---|---|---|
| C1 | Timed evidence in the last 120 days: ≥ 1 full timed paper on c, **or** reliability-weighted timed marks `Σ w_mode · w_src · m` (no recency decay, decided marks only) ≥ 1.0 × M_c | one paper's worth | The estimate is about exam conditions. Untimed work cannot stand in for it. |
| C2 | Coverage: ≥ 70% of the component's topic mark weight (paper-spec midpoints) has ≥ 3 marks of exam-format evidence (timed or untimed) in the last 180 days | 70% | A θ built from three topics says little about a paper that tests eight. |
| C3 | Posterior SD of the expected component percentage ≤ 7 percentage points (including item uncertainty, §4.4) | 7 pp | About half a grade band. Beyond that, the conversion is mostly noise. |
| C4 | Prior share ≤ 0.35 | 0.35 | The estimate must mostly reflect this student, not the population. |
| C5 | AI-evidence share: decided timed marks whose evidence source is `ai`, divided by all decided timed marks, ≤ 0.5 | 0.5 | An estimate resting mostly on AI-estimated marks is labelled as such and cannot pass alone. |
| C6 | SIR effective sample size ≥ R/4 | — | Numerical health. |

### 6.2 Qualification gate (for the grade distribution)

| # | Condition |
|---|---|
| Q1 | Every **measured** component in the option passes C1–C6. |
| Q2 | ≥ 2 full timed papers across the option's components in the last 120 days, on different days. |
| Q3 | Components assessed only through the conditional prior (no Fathom items and no external result) weigh ≤ 25% of the qualification. This allows 9702 / 9701 AS with Paper 3 assumed (23%), always with a visible caveat. |
| Q4 | ≥ 3 eligible threshold series for the option (§5.2), with verified threshold data and display permission in place, or the owner-approved fallback in §9.4. |
| Q5 | The student has opted in (§10.6). |

### 6.3 States and what is shown

| State | Condition | Shown |
|---|---|---|
| `insufficient` | No component passes | The record (descriptive marks by mode and topic), topic mastery, and **"Not enough evidence for an estimate yet"**, with unlock options (§6.4). No θ, no percentages labelled as estimates, no grades. |
| `components-only` | Some components pass, or all pass but Q2–Q4 fail | For passing components: level and single-sitting range. For the others: the record and unlock options. No grade. |
| `estimate` | Q1–Q5 pass | Everything in §10.3. |

### 6.4 Unlock options (deterministic)

For each failing condition, generate the cheapest actions that would satisfy it, phrased as
options, not instructions:

| Failing | Generated option |
|---|---|
| C1 | "Sit one timed Paper 5 (1 h 15 min)" **or** "about 30 more marks of timed questions on Paper 5" (the shortfall rounded up to the nearest 10) |
| C2 | The three highest-weight uncovered topics: "Topics not yet practised in exam questions: 5.4 Discrete random variables (≈ 8 marks on a typical paper), …" |
| C3 / C4 | Usually resolved by C1 / C2. Otherwise: "One more timed paper would make this reliable enough to show." |
| C5 | "Most of your timed marks so far are AI estimates. Typed answers, or a teacher's marking, would let us show an estimate." |
| Q2 | "One more full timed paper on any component." |
| Q3 | "Paper 3 (practical) isn't assessed on Fathom. If you have a school practical mark, adding it would let us include it." |

The copy opens with "When you're ready, either of these would unlock an estimate:". No
countdowns, no streaks, and no "you're falling behind".

**Worked example check.** P1: C1 has 2 full papers (75 + 69 + 24 = 168 weighted timed marks
≥ 75); C2 coverage 0.86 (assumed); C3 3.3 pp; C4 0.06; C5 AI share 20/180 = 0.11. P5: C1
has 1 full paper (50 ≥ 50); C2 0.78 (assumed); C3 5.2 pp; C4 0.14; C5 0. Q2: 3 full
papers. Q3: nothing assumed. Q4: 6 series. **State: `estimate`, conversion unanchored.**

---

## 7. Forecasting to the exam date

### 7.1 Decision

**Phase 4a ships no forecast.** The page shows only "if you sat it now", plus the record of
how that estimate has moved. Reasons:

* Individual learning curves are noisy and non-linear. Revision bursts, mock seasons and
  forgetting dominate. A linear extrapolation of a few points is usually wrong, and is
  wrong in a way students read as a promise. In the example below, an undamped trend
  projects 62/75, against a current 52.
* Regression to the mean: a student who just had a good paper will usually look worse
  next time, and vice versa.
* A forecast is conditional on behaviour, so showing it can change behaviour: complacency
  if it looks good, anxiety if it looks bad.
* It cannot be validated until there are longitudinal outcome data, which take at least
  one exam series after launch.

**Phase 4b** may enable a **damped-trend forecast** per component, behind its own gate and
only after the forecast backtest (§11.2, F-metrics) passes.

### 7.2 Model (Phase 4b)

Per component, take the sequence of per-sitting estimates θ̂_k (standard errors se_k). A
sitting is a full paper, or a day's timed sets of at least 0.5 × M_c. Weeks are measured
from today.

```
β̂, se(β̂)      weighted least-squares slope of θ̂_k on t_k (weights 1/se_k²)
κ = τ_β² / (τ_β² + se(β̂)²)
β̃ = κ β̂ + (1 − κ) β_pop(weeks-to-exam)            shrink to the population learning rate
Var(β̃) = (1/τ_β² + 1/se(β̂)²)⁻¹
Φ_H = Σ_{k=1..H} φ^k = φ (1 − φ^H) / (1 − φ)       damped cumulative effect over H weeks
θ_T = θ_now + β̃ Φ_H
Var(θ_T) = Var(θ_now) + H q + Φ_H² Var(β̃)          q = random-walk drift per week
```

`β_pop` (by weeks-to-exam bucket), `τ_β` (between-student SD of slopes), φ and q are
estimated by the stats worker from students with long histories. θ_T then goes through
§5.3 unchanged. Constraints: the forecast interval is never narrower than the current
interval, and H ≤ 26 weeks; beyond that, "too far ahead to forecast".

### 7.3 Worked example (made-up)

Five timed sittings for P1 at weeks −14, −10, −6, −3, −1, with θ̂ = 0.15, 0.28, 0.45, 0.50,
0.60 (se 0.28 each). For continuity, take θ_now = 0.548 ± 0.196 from §4.7. Note that the
WLS level at week 0 is 0.63: this is the recency lag from §3.6. Exam in H = 24 weeks.
Population values: β_pop = 0.010 / week, τ_β = 0.015, φ = 0.92, q = 0.05².

```
β̂ = 0.034 / week (se 0.027)    κ = 0.24    β̃ = 0.016 ± 0.013    Φ_24 = 9.95
θ_T = 0.548 + 0.016 × 9.95 = 0.705      SD = √(0.196² + 24 × 0.0025 + 9.95² × 0.013²) = 0.34
```

| | θ | Expected P1 mark, 80% (level) |
|---|---|---|
| Now | 0.55 ± 0.20 | 51.8 (48.6–54.9) |
| Forecast for June (damped, shrunk) | 0.70 ± 0.34 | 53.9 (48.1–58.7) |
| Undamped linear extrapolation (not used) | 1.44 | 61.7 |

The forecast moves the centre by 2 marks and widens the range. That is about the most a
forecast can honestly say here.

### 7.4 Forecast gate

The forecast gate requires all of: the component gate passes; ≥ 4 sittings spanning ≥ 8
weeks; an exam series set in the enrolment; H ≤ 26 weeks; and the subject's forecast
backtest passed. Otherwise the page shows: "No forecast yet. We only show where you are
now. Forecasts need about two months of timed practice to say anything useful." The §4.7
student (two P1 papers over six weeks) gets this message.

---

## 8. Paper difficulty and equating

### 8.1 Calibrated items: equating comes free

All of Fathom's papers are assembled from items calibrated concurrently on one PCM scale
per component (`question-generation.md` §4.11). θ̂ from any paper is therefore already
corrected for its difficulty, as F1 and F2 show in §4.7. The paper's `difficulty_index` is
stored for display and audit, not used in the likelihood.

### 8.2 Uncalibrated items

Probation items, and owner-allowed `uncalibrated` papers, use the prior `b₀ = band − 3`
(SD 1.0) from `question-generation.md` §4.8. Their uncertainty is propagated (§4.4). Gate C3
then usually keeps such evidence from unlocking an estimate by itself.

### 8.3 Cambridge papers before calibration: the series' thresholds as a difficulty proxy

This applies to a licensed past paper sat on Fathom that is not yet calibrated, and to an
external result with a known series and variant (§3.8). The paper's own published
**component** thresholds indicate how hard it was: an easier paper has higher thresholds.
The raw mark is linearly equated to the average series, between grade thresholds, and then
mapped to θ through the reference form:

```
anchors on the paper:  0 < t_{p,E} < t_{p,D} < … < t_{p,A} < M     (that series' component thresholds)
anchors on average:    0 < t̄_E   < t̄_D   < … < t̄_A   < M          (mean over eligible series, same component)
for x in [t_{p,g}, t_{p,g+1}]:   x' = t̄_g + (x − t_{p,g}) · (t̄_{g+1} − t̄_g) / (t_{p,g+1} − t_{p,g})
θ̂ = TCC_ref,c⁻¹(x')         s² = 1 / I_ref(θ̂) + σ_eq²        σ_eq = 0.15 logits (0.30 if the paper is unknown)
```

The result enters ℓ(ϑ) as a Gaussian pseudo-observation with weight `w_e` (§3.8, §4.3).

Example (made-up): on 9709/12 from a series with component thresholds B = 50 and A = 58,
the student scored 52/75. The averages are B = 47 and A = 55, so
`x' = 47 + 2 · (8/8) = 49`: the paper was easy, and 52 on it is worth 49 on an average
paper. Then `θ̂ = TCC_ref⁻¹(49) = 0.33`, with `s = √(0.275² + 0.15²) = 0.31`.

This rests on the unanchored assumption that the reference form is an "average" Cambridge
paper, so σ_eq is added on top of σ_form. A licensed paper switches from this proxy to
item-level evidence once ≥ 80% of its marks are on leaves with `b_se ≤ 0.3`.

### 8.4 Anchored conversion

Once a component has calibrated licensed past papers from several series, §5.1's anchored
mode applies. It also yields an estimate of σ_form and of the mean offset between Fathom's
reference form and real papers (the RMS and mean of `TCC_ref(θ_{s,g}) − t_{s,g}` across
series and grades). Those estimates replace the 5% default for **all** students in that
subject, including those who never sat a licensed paper.

### 8.5 Drift monitoring

The stats worker tracks, per component per month: the mean θ of new full-paper takers;
reference-form expected score at θ = 0 (it must stay within ±2 percentage points of the
spec target, or the reference form is rebuilt); and anchor-item parameter stability
(|Δb| > 0.3 on an anchor triggers review). A recalibration that moves θ by more than 0.1
for students with evidence on the affected items queues their recomputation (§12.3).

---

## 9. Grade threshold data

### 9.1 Source

Cambridge International's published **grade threshold tables**: one PDF per syllabus per
series, on its website. Only this official source is used. Thresholds quoted elsewhere
(forums, tutoring sites) are never used. Each record keeps the URL, the retrieval date
and the SHA-256 of the PDF as retrieved. The PDF itself is kept only as a hash and a link;
it is not stored or redistributed (§9.4).

### 9.2 Transcription workflow

1. Staff member A transcribes the table into YAML (format below). Every component variant
   and option row printed is included, even those Fathom does not yet use.
2. Staff member B, a different person, re-enters the numbers blind in a staff form. The
   importer refuses the file unless both entries match exactly. Disagreements are resolved
   against the PDF and logged.
3. `content:check` runs the validators:
   * thresholds monotone (A\* ≥ A ≥ B ≥ C ≥ D ≥ E; equal values warn), 0 ≤ t ≤ max;
   * component maxima equal the paper spec for that syllabus version;
   * option rows reference existing components and permitted combinations; `Σ f·M =
     T^max`, and the weights match the syllabus weightings (§2.2);
   * plausibility: each threshold, as a percentage, is within ±15 percentage points of the
     median of the previous 6 series, or a `verifiedUnusual` note by B is required;
   * the series is not duplicated, and the syllabus `comparable_group` exists.
4. Import into Postgres. Estimates for affected subjects are queued for recomputation.

```yaml
# content/subjects/9709/thresholds/2025-june.yaml   (ILLUSTRATIVE NUMBERS, NOT REAL)
source:
  id: gt-9709-2025-june
  url: https://www.cambridgeinternational.org/…        # the official grade threshold table PDF
  retrievedAt: "2026-10-19"
  documentSha256: "…"
  transcribedBy: staff-a
  verifiedBy: staff-b
comparableGroup: 9709-2020-structure                    # components and maxima unchanged since …(verify)
series: { year: 2025, session: june }
components:
  - { component: P1, variant: "12", maxRaw: 75, thresholds: { A: 58, B: 50, C: 42, D: 34, E: 26 } }
  - { component: P5, variant: "52", maxRaw: 50, thresholds: { A: 37, B: 31, C: 26, D: 21, E: 16 } }
options:
  - code: "<as printed>"
    level: AS
    components: [{ component: P1, variant: "12" }, { component: P5, variant: "52" }]
    maxWeighted: 125
    factors: { P1: 1, P5: 1 }
    thresholds: { a: 89, b: 77, c: 66, d: 54, e: 42 }
```

### 9.3 Storage schema

```sql
create table threshold_sources (
  id               text primary key,                  -- gt-9709-2025-june
  subject_code     char(4) not null,
  comparable_group text not null,                     -- same components and maxima
  series_year      int not null,
  series_session   text not null check (series_session in ('march','june','november')),
  source_url       text not null,
  retrieved_at     date not null,
  document_sha256  char(64) not null,
  transcribed_by   text not null,
  verified_by      text not null check (verified_by <> transcribed_by),
  status           text not null check (status in ('verified','withdrawn')),
  notes            text,
  unique (subject_code, series_year, series_session)
);

create table component_thresholds (
  source_id  text not null references threshold_sources(id),
  component  text not null,                           -- P1
  variant    text not null,                           -- 12
  max_raw    int  not null,
  thresholds jsonb not null,                          -- {"A":58,"B":50,...}; AS components lower-case if printed so
  primary key (source_id, component, variant)
);

create table option_thresholds (
  source_id    text not null references threshold_sources(id),
  option_code  text not null,                         -- as printed
  level        text not null check (level in ('AS','A')),
  components   jsonb not null,                        -- [{"component":"P1","variant":"12"},…]
  max_weighted numeric not null,
  factors      jsonb not null,                        -- {"P1":1,"P5":1}
  thresholds   jsonb not null,                        -- {"A*":…,"A":…,…} or {"a":…,…}
  primary key (source_id, option_code)
);
```

### 9.4 Licensing and permission (not legal advice)

The tables are Cambridge University Press & Assessment material, published openly for
information. Individual threshold numbers are facts. A systematic collection of them could
still engage database rights in some jurisdictions (e.g. the UK / EU sui generis database
right), and the website's terms of use. Working policy:

1. Store **numbers only**, each with a citation and link to the official PDF. Never store or
   serve the PDFs.
2. Before launch, ask Cambridge in writing for permission to store transcribed thresholds
   and to display derived ranges to students, with attribution. Add this to the questions
   for Cambridge in `question-generation.md` §5.8, and the database-right question to the
   lawyer list in §5.7.
3. **If permission is refused or still pending** (owner decision O3): thresholds may be used
   internally for computation only if counsel confirms that is lawful. The UI shows
   probabilities without printing threshold numbers, and links to the official tables. If
   counsel does not confirm, grade estimates stay off (gate Q4) and only component levels
   are shown.

### 9.5 Context, not guarantees

Thresholds describe past series. The next series' thresholds are unknown until results
day. Every grade view names the series used ("based on thresholds from June 2023 to
November 2025, 6 series") and says "Thresholds change every series. Ranges from past
series are context, not a guide to what you will need."

---

## 10. UI and communication

### 10.1 Principles

1. **Range first, letter second.** The most likely grade is never larger or bolder than the
   range.
2. **Honest about status.** Every view says what the estimate is and what it is not, in
   plain words, near the number (not behind an info icon only).
3. **Frequencies over decimals** for minors: "about 1 in 4", not "0.28".
4. **No guilt, no alarm.** No red for low grades, no down arrows, no "falling behind", no
   notifications, and no comparisons with other students.
5. **Explain how it moves.** Every estimate comes with "what this is based on" and "what
   would move it".

### 10.2 Wording

| Say | Don't say | Why |
|---|---|---|
| "Grade estimate (from your Fathom practice)" | "Predicted grade", "Your grade", "Expected grade" | "Predicted grade" means a school's official prediction for university applications. |
| "If you sat these papers now, your practice so far is most consistent with grades **c to a**, most likely **b**." | "You will get a B." / "You're a B student." | Not a guarantee. It describes evidence, not the person. |
| "This is Fathom's estimate. It isn't a Cambridge result or an official prediction." | "Cambridge-standard grade" | The brief forbids implying official status. |
| "Part of this estimate uses AI-estimated marks for handwritten working (20 of 180 timed marks)." | (silence) | Disclosure of AI involvement. |
| "Your estimate moved from b to c as most likely after your last Paper 1. One sitting can vary by several marks." | "Your grade dropped." | Neutral, with context. |
| "Not enough evidence for an estimate yet. When you're ready, either of these would unlock one: …" | "Do 2 more papers to unlock your grade!" | Options, not pressure. |
| "Below e" | "Fail", "U" in large type | Gentle wording for minors. "Ungraded" appears in the details. |

All strings live in one module (`src/domain/grades/copy.ts`) and are reviewed by the owner
and the safeguarding lead. The explanation page renders the rules from code constants,
like `MASTERY_RULES` (§10.7).

### 10.3 Layout (estimate state)

```
Mathematics 9709 · AS Level (Papers 1 and 5)            Grade estimate · updated 19 Oct
─────────────────────────────────────────────────────────────────────────────────────
If you sat both papers now, your practice so far is most consistent with
grades c to a — most likely b.

   c ░░░░░░░░░░██████████████████████████████░░░░░░ a     ← 80% range on a mark scale,
      past-series grade bands drawn as soft ranges, not lines

   a  ▇▇▇▇▇▇              about 1 in 5
   b  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇     about 1 in 2
   c  ▇▇▇▇▇▇▇▇            about 1 in 4
   d  ▏                   unlikely (under 1 in 20)

Paper 1 · typical paper, exam conditions: about 52 / 75
          a single sitting could reasonably land anywhere from 44 to 60
          untimed practice: about 56 / 75 (time pressure costs you about 4 marks)
Paper 5 · about 33 / 50 (27 to 39) · untimed about 36 / 50

Based on: 3 timed papers, 2 timed sets, 180 marks of untimed practice (older work counts less).
Fathom's papers aren't yet linked to real Cambridge papers for 9709, so the range is wider.
Thresholds from 6 past series. Thresholds change every series.
This is Fathom's estimate, not a Cambridge result or official prediction.     [How this works]
─────────────────────────────────────────────────────────────────────────────────────
What would move this                                                   [Hide estimates]
```

Visual rules: a single neutral hue for bars, with no traffic-light colours. Text
alternatives for every chart, and a screen-reader sentence equal to the headline. Under
5% shows as "under 1 in 20", never 0%. There is no big standalone letter anywhere, including
dashboards and the subject card. The subject card shows "Estimate: c–a" or "Not enough
evidence yet".

### 10.4 "What would move this" (deterministic)

There are two kinds of lever, each computed by re-running the simulation with one input
changed:

1. **Evidence levers** (more certainty). Shown only if collapsing the ability posterior to
   its mean would raise P(most likely) by ≥ 0.10. Otherwise the copy says "The range is
   wide mainly because one exam sitting naturally varies by several marks. More practice
   papers won't narrow it much." In the §5.5 example, P(b) rises only from 0.51 to 0.57, so
   no evidence lever is shown.
2. **Performance levers** (where marks are). For each topic t, the gap is
   `marks_on_typical_paper(t) − expected_marks(t | θ̂_c + δ̂_t)`. The top three topics by gap
   are shown, then the effect of closing half of each gap on the most likely grade. Example
   copy (illustrative): "Integration (1.8) carries about 13 marks on a typical Paper 1; under
   timed conditions you're earning about 7 of them. Closing half that gap (about 3 marks)
   would raise the chance of **a** from about 1 in 5 to about 3 in 10." (Re-running §5.5 with
   +3 marks on P1 gives P(a) 0.18 → 0.29 and P(c) 0.28 → 0.18.) Each lever links to the lessons and questions for that topic
   (the existing recommendation engine, `src/domain/recommend.ts`).
3. **Timing lever.** If the untimed level exceeds the timed level by ≥ 3 marks on a
   component, or ≥ 5% of timed marks were left unattempted at the end of papers: "Time
   pressure costs you about 4 marks on Paper 1. Timed sets on familiar topics can help."

### 10.5 Changes and hysteresis

* Recomputation happens on every relevant event (§12.3). The **displayed** most-likely grade
  and range change only if the new most-likely grade's probability exceeds the old one's by
  ≥ 0.10, or the range changes ends. Otherwise the stored estimate updates silently (the
  numbers on the detail view still update). This stops b/c flicker on noise.
* At most one "your estimate changed" line is shown per day, on the page itself, never as a
  notification or email.
* Model-version changes show "We improved how estimates are calculated (details)". They are
  not presented as a change in the student's performance.

### 10.6 Opt-in and visibility

* Off by default. Turning it on shows a one-screen explainer (what it is, what it isn't, that
  it can be hidden at any time) and requires a tap on "Show my estimates".
* "Hide estimates" is available on every view. Hiding stops display but not computation, so
  re-enabling is instant. The student can also turn computation off, which deletes stored
  estimates.
* Teachers, parents and guardians see estimates only if the student explicitly shares them
  (per subject, revocable). For under-age users, the privacy study decides whether guardian
  consent is also needed. Estimates are never used in rankings, leaderboards or marketing.
* Close to exams (≤ 14 days), the page adds a short supportive note and links to wellbeing
  resources. It shows no new "what would move this" levers in the final 3 days.

### 10.7 Explanation page

`/about/grades` renders `GRADE_RULES` from `src/domain/grades/rules.ts`: the weights (§3),
half-life, gates (§6), series used, and the uncertainty sources. It uses the same pattern
as `MASTERY_RULES`, so the explanation cannot drift from the code.

---

## 11. Validation plan

### 11.1 Stage 1: simulation-based calibration (before launch)

* Simulate 5,000 synthetic students per subject with known θ trajectories (flat, linear
  improving, improve-then-plateau, forgetting after a gap) and realistic practice
  behaviour (topic choice, a mix of untimed and timed work, a pending-mark rate, AI-evidence
  share, abandoned papers). Responses are generated from the calibrated item parameters.
  Grades are generated by sitting a simulated reference-like paper against thresholds drawn
  from a held-out series.
* Run the full pipeline. Check: 80% θ intervals cover the true θ 78–82% of the time; grade
  80% ranges cover the true grade at their nominal mass (§11.4); P(g) is calibrated
  (reliability curve within ±0.05).
* Misspecification runs: the true γ is double the assumed value; the true σ_day is 0.35;
  students cherry-pick (abandon 30% of bad papers) and do untimed work with notes. Report how
  coverage degrades. This sets expectations for real data.

### 11.2 Stage 2: next-paper backtest (platform data, from launch)

There is no need to wait for exam results. For every student with ≥ 3 full timed papers on a
component, predict the k-th paper's raw score from evidence strictly before it, with item
parameters re-estimated **excluding that student** (leave-student-out) to avoid leakage.

| Metric | Target |
|---|---|
| 80% single-sitting interval coverage of the held-out raw score | 0.78–0.82 overall; each subject 0.75–0.85 |
| PIT histogram (rank of the observed score in the predictive distribution) | No U or ∩ shape (χ² over deciles, p > 0.01 with n ≥ 500) |
| CRPS of the predicted raw score | ≥ 10% better than both next-paper baselines: **N1**, the previous full paper's score on that component (equated to the target paper's TCC) with the empirical residual SD; **N2**, the simple average percentage of all exam practice × M, with the empirical residual SD |
| Forecast metrics (Phase 4b, F) | The same coverage and CRPS, for papers 4–12 weeks ahead, against N1, N2 and the no-trend current estimate |

This stage tunes `h`, the mode and source weights, `w_dep`, `σ_day` and `γ` (grid search
under the order constraints, choosing on log predictive density and then checking coverage).

### 11.3 Stage 3: real outcomes (after each exam series)

* **Collection.** After results day (mid-August for June, mid-January for November;
  **verify** dates), students who used estimates get one neutral, optional prompt: "Would you
  share your result to help us check our estimates?" They report the grade per qualification
  (self-reported, optional verification by photo is **not** requested: minimal data). This
  needs its own explicit consent, which can be revoked. For minors, the consent route is set
  by the privacy study. Reports go in `outcome_reports`, are used only for validation, are
  reported only in aggregate, and are deleted on request.
* **Reporting bias.** Students who did well report more often. The pre-exam estimates of
  reporters and non-reporters are compared. Metrics are reweighted by inverse propensity,
  estimated from the pre-exam P(≥ c), usage and subject, and both raw and reweighted metrics
  are published.
* **Lead times.** Each outcome is scored against the estimates stored (recomputed
  deterministically from evidence as of that date, §12.4) at 12, 8, 4 and 1 weeks before the
  first paper.
* **Sample size.** Measuring 80% coverage to ±5 pp (95%) needs n ≈ 1.96² · 0.8 · 0.2 / 0.05²
  ≈ 246 outcomes per subject. Group comparisons at ±10 pp need about 62 per group.

### 11.4 Metrics

With G ordered grades, predicted p_ng and outcome indicator o_ng:

```
Brier (multi-category)  BS  = (1/N) Σ_n Σ_g (p_ng − o_ng)²
Ranked probability      RPS = (1/N) Σ_n (1/(G−1)) Σ_{k=1..G−1} (P_nk − O_nk)²     P, O cumulative over ordered grades
Log score               LS  = −(1/N) Σ_n log max(p_n,g*(n), 0.005)
Coverage                hit rate of "actual ∈ 80% range", compared with the mean stored range_mass (not with 0.80)
Calibration             for each event "grade ≥ g": reliability diagram (deciles of p); logistic recalibration
                        logit P(o = 1) = a + b · logit(p), target a ≈ 0, b ≈ 1
Sharpness               mean number of grades in the range; mean entropy (reported, judged only after calibration)
```

**Baselines** (the model must beat them; RPS skill = 1 − RPS_model / RPS_baseline):
B0, the base-rate distribution of reported grades; B1, the last full paper's percentage
mapped to the mean thresholds (one-hot, smoothed 0.7 / 0.15 / 0.15 to the neighbours);
B2, the simple average of all exam-practice percentages mapped the same way (the "simple
average" the brief rules out).

### 11.5 Fairness checks

Run on the attributes Fathom has without extra collection: subject; level (AS / A);
variant zone (a coarse region proxy); input mode (share of AI-marked handwriting vs typed
answers, which matters because AI marking accuracy may differ by handwriting or language);
usage intensity (tertiles of timed marks). Optionally, with a separate voluntary survey
(own consent, stored apart from accounts, reported only for cells with n ≥ 50): gender,
school type, first language.

Per group: coverage; calibration-in-the-large (mean predicted grade points minus mean
actual, with A\*/a = 6 … u = 0); RPS. This runs at Stage 2 (next-paper residuals, larger
n) as well as Stage 3.

| Result | Action |
|---|---|
| Coverage gap ≤ 10 pp and absolute calibration difference ≤ 0.3 grade points | OK |
| Gap of 10–15 pp or 0.3–0.5 grade points | Investigate. Common causes: AI-evidence bias (then lower that group's evidence weight pending a fix in the marking study), or untimed-offset differences. |
| Worse | Kill criterion K4 |

### 11.6 Wellbeing checks

* An optional 3-question pulse two weeks after opt-in: "helped me plan", "made me more
  worried", "I understand it isn't a guarantee" (5-point Likert).
* Behavioural signal: practice activity in the 14 days after a displayed **decrease**,
  compared with matched students after an increase. Hide rate after first view.

### 11.7 Kill criteria

"Kill" means grade estimates are turned off for that subject (components-only, or the record
only). Students who had opted in see a neutral notice, and the cause is fixed and
re-validated before re-enabling.

| # | Stage | Criterion |
|---|---|---|
| K1 | Pre-launch | Simulation-based calibration coverage for θ or grade outside 0.75–0.85, or any monotonicity property test fails (§12.5) → do not launch |
| K2 | Next-paper backtest (n ≥ 500 held-out papers per subject) | 80% coverage outside 0.72–0.88 after tuning, or CRPS not ≥ 10% better than both N1 and N2 → grade estimates off; component levels only if their own coverage passes |
| K3 | First outcome series (≥ 150 outcomes per subject) | Coverage more than 10 pp below the mean range mass, or RPS skill vs the better of B1 / B2 < 5%, or calibration slope b outside 0.7–1.3 → off for that subject |
| K4 | Fairness | Any monitored group with coverage < 0.65 or more than 15 pp below the overall rate, or a calibration difference > 0.5 grade points → off for that subject until resolved |
| K5 | Wellbeing | > 25% of respondents agree "made me more worried" without also agreeing "helped me plan", or practice falls > 20% (relative) after decreases compared with increases → copy and display redesign; the feature is paused if not resolved within one release |
| K6 | Integrity | A threshold transcription error, or a systematic bug that shifted estimates → recompute immediately, add a neutral notice to affected estimates, and pause the subject if more than one series was affected |

---

## 12. Implementation

### 12.1 Modules

| Path | Contents | Runs where |
|---|---|---|
| `src/domain/grades/evidence.ts` | Eligibility filters, weights, interval extraction, external-result linking (§8.3) | Pure TS |
| `src/domain/grades/pcm.ts` | PCM probabilities, interval log-likelihood, derivatives, Lord–Wingersky | Pure TS |
| `src/domain/grades/posterior.ts` | 1-D profiles on a grid, Newton MAP, Laplace, SIR, item-uncertainty inflation, prior share | Pure TS |
| `src/domain/grades/simulate.ts` | Seeded PRNG (xoshiro128\*\*), §5.3 simulation, summaries (§5.4) | Pure TS |
| `src/domain/grades/gates.ts` | C1–C6, Q1–Q5, unlock options | Pure TS |
| `src/domain/grades/levers.ts` | "What would move this" (§10.4) | Pure TS |
| `src/domain/grades/forecast.ts` | Damped trend (Phase 4b) | Pure TS |
| `src/domain/grades/rules.ts`, `copy.ts` | `GRADE_RULES`, all strings | Pure TS |
| `src/server/grades/recompute.ts` | Load evidence and params, run the pipeline, write `grade_estimates` | Node worker |
| `src/server/queries/grades.ts` | Read the latest estimate for the page | Next.js server components |
| `stats/grades/` (stats worker, Python) | Population fits: Σ_pop, γ_c, σ_day, ρ_LD, β_pop, τ_β, φ, q, σ_form; reference-form LW grids; backtests and SBC; reports | Nightly / on demand |

Per-student estimation is in TypeScript (vitest, the same types as the app). Population
fitting lives in the existing Python stats worker next to item calibration.

### 12.2 Tables (abbreviated DDL)

```sql
-- additions to enrollments (Phase 1 table)
alter table enrollments add column option_code text;           -- validated against syllabus options
alter table enrollments add column variant_pref text;          -- '12' | null (= pool)
alter table enrollments add column exam_series text;           -- '2027-06'
alter table enrollments add column grade_estimates text not null default 'off'
  check (grade_estimates in ('off','computed-hidden','shown'));

-- contract with the question-bank study (leaf-level parameters, versioned)
create table leaf_params (
  question_id text, version int, part_path text, calibration_run text,
  steps real[] not null, steps_se real[] not null, component text not null,
  valid_from timestamptz not null, primary key (question_id, version, part_path, calibration_run)
);

create table grade_model_params (
  version          text primary key,                 -- 'gm-9709-2027.1'
  subject_code     char(4) not null,
  params           jsonb not null,                   -- weights, h, gates, Σ_pop, γ_c, σ_day, ρ_LD, σ_form, forecast params
  calibration_run  text not null,                    -- which leaf_params
  backtest_report  text,                             -- object key of the report that justified activation
  status           text not null check (status in ('candidate','active','retired')),
  activated_at     timestamptz, activated_by text
);

create table reference_forms (
  id text primary key, subject_code char(4), component text, comparable_group text,
  kind text not null check (kind in ('blueprint-mixture','licensed-session')),
  source_ref jsonb,                                  -- paper_instance ids, or {series, variant}
  calibration_run text not null, max_marks int not null,
  theta_grid real[] not null,                        -- 401 points
  cdf bytea not null,                                -- float32 [401 × (max+1)], P(X ≤ x | θ)
  created_at timestamptz not null
);

create table external_results (
  id uuid primary key, user_id uuid not null references users(id) on delete cascade,
  subject_code char(4) not null, component text not null,
  paper_ref jsonb,                                   -- {year, session, variant} or null (unknown paper)
  raw_mark int not null, max_mark int not null,
  conditions text not null check (conditions in ('exam-at-school','timed-at-home','untimed')),
  marked_by text not null check (marked_by in ('teacher','self')),
  first_sight boolean not null, sat_on date not null, created_at timestamptz not null default now()
);

create table grade_estimates (
  id uuid primary key, user_id uuid not null references users(id) on delete cascade,
  subject_code char(4) not null, option_code text not null,
  computed_at timestamptz not null, model_version text not null references grade_model_params(version),
  inputs_hash char(64) not null,                     -- sha256 of the canonical evidence list + param versions
  status text not null check (status in ('insufficient','components-only','estimate','unstable')),
  result jsonb not null,                             -- GradeEstimate (below)
  displayed jsonb not null,                          -- what the hysteresis rule currently shows
  is_latest boolean not null
);
create unique index grade_estimates_latest on grade_estimates (user_id, subject_code) where is_latest;

create table grade_jobs (                            -- debounced queue
  user_id uuid not null, subject_code char(4) not null,
  reasons text[] not null, not_before timestamptz not null, attempts int not null default 0,
  primary key (user_id, subject_code)
);

create table outcome_reports (
  id uuid primary key, user_id uuid references users(id) on delete cascade,
  consent_id uuid not null, subject_code char(4) not null, level text not null,
  series text not null, grade text not null, reported_at timestamptz not null
);
```

```ts
// result jsonb shape (src/domain/grades/types.ts)
type Grade = 'A*' | 'A' | 'B' | 'C' | 'D' | 'E' | 'U' | 'a' | 'b' | 'c' | 'd' | 'e' | 'u';
interface GradeEstimate {
  seed: string;
  components: Array<{
    component: string; maxMarks: number; measured: boolean; gate: Record<string, { pass: boolean; value: number; need: number }>;
    theta: { mean: number; sd: number }; priorShare: number;
    level: { mean: number; p10: number; p90: number };
    singleSitting: { p10: number; p50: number; p90: number };
    untimedLevel: number | null;
    evidence: { fullPapers: number; timedMarksWeighted: number; untimedMarks: number; aiShare: number; selfShare: number;
                coverage: number; lastTimedAt: string | null; excludedInterrupted: number };
    topics: Array<{ topic: string; offset: number; typicalMarks: number; expectedMarks: number }>;
  }>;
  qualification?: {
    level: 'AS' | 'A'; conversion: 'anchored' | 'unanchored' | 'mixed';
    probs: Partial<Record<Grade, number>>; mostLikely: Grade[]; range80: [Grade, Grade]; rangeMass: number;
    atLeast: Partial<Record<Grade, number>>; total: { p10: number; p50: number; p90: number; max: number };
    thresholdSources: string[]; caveats: string[];   // 'unanchored' | 'assumed-component:P3' | 'ai-evidence' | 'stale' | …
  };
  forecast?: { status: 'not-available'; reasons: string[] } | { status: 'ok'; examSeries: string; /* same shape as qualification */ };
  unlock: Array<{ condition: string; options: string[] }>;
  levers: Array<{ kind: 'evidence' | 'topic' | 'timing'; text: string; effect: Partial<Record<Grade, number>> }>;
}
```

### 12.3 Recomputation triggers

Every trigger upserts into `grade_jobs` with `not_before = now() + 2 min`, which coalesces
bursts such as marking a paper leaf by leaf. Workers claim jobs with
`FOR UPDATE SKIP LOCKED`.

| Event | Scope |
|---|---|
| Exam attempt submitted (any mode) or re-scored (scheme correction, `question-generation.md` §2.9) | That student, that subject |
| Evidence changed: AI evidence arrives or is corrected, transcription confirmed, self-assessment, teacher marking | That student, that subject |
| External result added, edited or deleted | That student, that subject |
| Enrolment change: option, variant, exam series, opt-in state | That student, that subject |
| Nightly item calibration publishes a new `calibration_run` | Students with evidence on items whose parameters moved by > 0.1 logits; everyone at the next nightly batch |
| New threshold source imported or withdrawn | All opted-in students in that subject |
| New `grade_model_params` activated | All opted-in students in that subject (batched, rate-limited) |
| Nightly recency batch | Opted-in students active in the last 180 days (decay changes the estimate even without new evidence) |
| Item suspended or retired | Students with evidence on it |
| Student deletes data or account | Estimates deleted (cascade), not recomputed |

The page reads the latest row and shows "Updating…" if a job for that student is pending.
Nothing is computed on the request path.

### 12.4 Determinism, reproducibility, performance

* **Same inputs, same output.** `inputs_hash` covers the canonical evidence list (ids,
  scores, sources, timestamps), the `calibration_run`, the threshold source ids and the
  model version. The PRNG seed derives from it. Recomputing with the same inputs reproduces
  the stored result (floating-point `Math.exp` can differ in the last bits across runtimes;
  tests use tolerances, and displayed values are rounded).
* **Historical estimates are recomputable,** so they need not be stored for validation:
  filter the evidence to `created_at < t`, use `leaf_params` valid at t, and run the stored
  model version. Only the latest row plus 26 weekly snapshots of the displayed summary
  (for the student's own "how it's moved" chart) are kept.
* **Cost.** About 10 ms for the profiles, < 5 ms for Newton/SIR (exact log-posterior via
  profiles), and about 10 ms for the simulation (CDF lookups). That is under 50 ms per
  estimate in Node, and a nightly batch of 100,000 students takes about 1.5 CPU-hours.
  Reference-form grids are rebuilt by the stats worker after each calibration run.

### 12.5 Testing

* **Unit:** PCM against hand-computed values (§3.7); interval derivatives against finite
  differences; LW sums to 1 and its mean equals the TCC; the threshold validators; gates on
  boundary values.
* **Property tests:**
  * adding a correct leaf never lowers the θ mean;
  * raising all thresholds never raises any `P(≥ g)`;
  * a weight of 0 is identical to exclusion;
  * re-ordering the evidence list never changes the output;
  * interval `[k, k]` equals an exact score.
* **Reference cross-check:** the Python stats worker has an independent dense-grid
  implementation (no Laplace, no SIR). In CI, 200 golden students must agree within 0.02
  logits on θ and 0.02 on each P(g).
* **Golden files:** the §4.7 / §5.5 example is a test fixture (with the toy item model)
  asserting the published numbers within Monte Carlo tolerance.
* **Copy tests:** no forbidden phrases ("predicted grade", "you will get", "guarantee",
  "fail") appear in `copy.ts` output, and every grade view includes the status sentence.

### 12.6 Privacy and data management

* Estimates are derived personal data about (mostly) minors. They are visible only to the
  student unless shared (§10.6), included in the data export, deleted with the account
  (cascade) or when computation is switched off, and never sent to any AI model or third
  party.
* Population fitting (Σ_pop, γ, σ_day, item parameters) uses pseudonymous attempt data
  inside Fathom's database. It is "using student data to improve the service", which must
  be stated in the privacy notice. The privacy study decides the lawful basis and whether
  an opt-out from population fitting is offered. No private submission is used to train any
  model.
* Outcome reports and the fairness survey each need separate consent, are stored apart,
  are reported only in aggregate (cells with n ≥ 50), and are deleted on request.
* Minimal data: no school name, exam centre number, candidate number or verification
  documents are collected.

### 12.7 No LLM

The pipeline is statistics and templates. It makes no Claude API calls and has no model
cost. AI touches it only through mark evidence produced upstream by the marking module,
which is weighted (§3.4), gated (C5) and disclosed. The tutor may *read* the latest
estimate to discuss it, but must quote the stored numbers and wording and must not compute,
reinterpret or restate a grade. That is a constraint on the tutor study. If natural-language
summaries are ever wanted, they would be an owner decision. Templates are recommended here
because they can be reviewed and tested exhaustively.

### 12.8 Phasing

| Phase | Scope | Exit criteria |
|---|---|---|
| 4a.1 | `pcm`, `posterior`, `simulate`, `gates`, `evidence` with tests; stats-worker population fits; reference forms; threshold YAML, validators and import for the four syllabuses (6 series each) | K1 passes; reference cross-check green |
| 4a.2 | Internal-only estimates (`computed-hidden` for staff and pilot accounts); next-paper backtest; weight tuning | K2 passes per subject |
| 4a.3 | Student UI (opt-in), explanation page, levers, hysteresis; threshold permission settled (§9.4) | Copy review, safeguarding sign-off, accessibility review |
| 4b | External results; forecast behind its gate; staged-A-Level carry-forward; outcome collection after the first series; fairness reports | Forecast backtest; K3–K5 reviewed after each series |
| 4c | Anchored conversion where licensed papers exist; σ_form from outcomes | Re-run of K2–K4 |

---

## 13. Failure modes and detection

| Failure | Effect | Detection | Mitigation |
|---|---|---|---|
| Wrong answer key on an item | Biased θ for everyone who met it | Item monitoring: modal wrong answer, P(A\|M), reports (`question-generation.md` §8) | Re-score (§2.9) → automatic recomputation |
| Threshold transcription error | Wrong grade for a whole subject | Double entry, validators, plausibility rule | K6; recompute and notify |
| Fathom papers easier or harder than Cambridge's | Systematic grade bias | Anchored papers (§8.4); outcome calibration-in-the-large | σ_form; bias correction once measured |
| Students do "timed" work with notes | Over-estimate | Timed level ≥ untimed level by a lot (γ_s strongly negative) on many papers; this is honour-based | The estimate states that it assumes exam conditions; the student's own interest is aligned; no policing |
| Cherry-picking (abandon or declare interrupted after bad papers) | Over-estimate | Interrupted-declaration rate per student; the declaration comes before marks are shown | Count shown in the evidence summary; the rate is monitored |
| Topic self-selection in practice | Biased θ | Full papers are representative; the untimed weight is low | Coverage gate C2 |
| AI marking bias for some handwriting or languages | Group unfairness | Fairness checks on AI-evidence share (§11.5); marking-study audits | Weight 0.7 / 0.5, cap C5, disclosure |
| Recency lag for fast improvers | Under-estimate | Next-paper PIT skew for improving trajectories | h tuned; forecast (4b) |
| Non-representative population prior | Shrinkage to the wrong centre | Prior-share gate C4 | Gate; re-fit nightly |
| Local dependence ignored | Overconfident intervals | Next-paper coverage below target | `w_dep` from Q3 |
| Laplace failure (perfect scores, sparse data) | Wrong intervals | SIR effective sample size | `unstable` state, no grade |
| Monte Carlo flicker | Anxiety-inducing changes | Displayed-change rate per student | Seeded PRNG; hysteresis |
| Syllabus change | Thresholds not comparable | `comparable_group` check in Q4 | Fallback with doubled shift SD, or no grade |
| Estimate read as a promise | Complacency or harm | Wellbeing pulse; copy tests | §10 wording; opt-in; K5 |

---

## 14. Owner decisions

| # | Decision | Default recommended here |
|---|---|---|
| O1 | Grade estimates opt-in or on by default | **Opt-in**, with an explainer screen |
| O2 | Show a forecast | **No** in 4a; 4b only after the forecast backtest |
| O3 | Threshold display if Cambridge permission is pending or refused | Probabilities only, no threshold numbers, link to the official tables, and only if counsel confirms internal use is lawful; otherwise grade estimates stay off |
| O4 | Allow estimates from uncalibrated papers in a new subject (relax C3) | **No**. Wait for calibration. |
| O5 | Allow teachers and guardians to see estimates | Only if the student shares them; guardian rules per the privacy study |
| O6 | Collect outcome reports and the fairness survey | Yes, both with separate consent, starting with the first series after launch |
| O7 | Initial evidence weights and half-life | As in §3; tuned by backtest within the order constraints |
| O8 | Allow external self-reported results | Yes (4b), unable to unlock gates except for unmeasured components |
| O9 | Show "chance of at least g" | On request only |

## 15. Assumptions to replace with measurements

Mode, source and dependence weights (§3); half-life 42 days; γ_c = 0.35 ± 0.10; σ_γs =
0.15; σ_day = 0.20; σ_form = 5%; σ_paper = 0.3; σ_eq = 0.15 / 0.30; inter-component
correlation 0.6 and recall correlation 0.3 (cap 0.5); gate values (§6); forecast parameters
β_pop, τ_β, φ, q; component weightings, maxima, threshold-table format, series and variant
structure, A\* rules and carry-forward rules (to be checked against the current Cambridge
syllabuses, grade threshold tables and Handbook); results-day dates.
