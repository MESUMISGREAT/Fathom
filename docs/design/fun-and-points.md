# Fun, points and the playful redesign

Students asked for Fathom to feel less like a textbook and more like something built for
fun, with rewards that keep an ADHD brain coming back. This document is the spec for the
points system and the visual redesign. It is the contract the code follows.

Principles:

* **Reward learning, not clicking.** Every point comes from doing real work for the first
  time (a first correct answer, a due review, a finished lesson). Re-answering a question
  you already got right earns nothing, so points can't be farmed.
* **Immediate, visible, frequent.** Feedback appears on the same frame as the answer is
  marked: "+15 XP", a combo counter, a bar that fills.
* **Never punish.** No lost points, no red streak warnings, no shame copy. Streak freezes
  cover a missed day automatically. Copy is warm: "Back at it. Nice." not "You broke
  your streak".
* **No comparison.** No public leaderboards (most users are under 18, and ranking against
  others turns motivation into anxiety). Students compete with their own past self.
* **Calm on request.** Celebrations (confetti, pops) can be turned off; sounds are off by
  default; everything respects `prefers-reduced-motion`.
* **Server is the source of truth.** XP is computed and stored on the server. The browser
  only displays what the server returns.

## 1. Points (XP)

All rules live in one pure module, `src/domain/points.ts`, with unit tests.

| Event | XP | Limit |
| --- | --- | --- |
| Lesson question, correct on the **first ever** attempt | difficulty 1: 10, 2: 15, 3: 20 | once per question |
| …partially correct on the first attempt | half of the above, rounded | once per question |
| …self-assessed (`explain` format) | round(base × score × 0.5) | once per question |
| Correct on a **later** attempt (you fixed it) | 5 | once per question; only if it never awarded XP before |
| Review question answered while **due**, correct | 10 (partial: 5) | once per question per due date |
| Lesson finished for the first time | 20 | once per lesson |
| Perfect lesson (every question in it correct first time) | +10 | once per lesson |
| Combo bonus (consecutive *scoring* correct answers, see below) | 3 in a row: +5, 5: +10, 10 and every 5 after: +15 | per combo milestone |
| Daily goal reached | +10 | once per day |

A *scoring* answer is one that awarded XP. Answers that award nothing (repeats, reviews
that are not due) neither extend nor break a combo. A combo breaks on an incorrect
scoring-eligible answer or after 15 minutes without one.

Guests can answer questions but earn no XP; they see "Sign up to keep your XP".

### Storage

* `xp_events (id, user_id, kind, amount, source_id, local_day, created_at)` where `kind` is
  `answer | review | lesson | perfect | combo | daily-goal`. A unique index on
  `(user_id, kind, source_id)` enforces the limits above at the database level, so a
  double-submitted answer cannot award twice. `source_id` is the question id (`answer`),
  `questionId@dueAt` (`review`), the lesson id (`lesson`, `perfect`), the local day
  (`daily-goal`) or a unique combo id (`combo`).
* `local_day` is the `YYYY-MM-DD` date in the user's time zone when it was earned.
* `user_badges (user_id, badge_id, earned_at)`.
* `users` gains `daily_goal` (default 50), `time_zone` (IANA, default `UTC`, detected from
  the browser), `celebrations` (default true), `sounds` (default false).

Account deletion cascades; the data export includes XP events and badges.

## 2. Levels

Total XP to reach level L is 25 × (L − 1) × L: level 2 at 50 XP, 3 at 150, 4 at 300,
5 at 500, 10 at 2,250, 20 at 9,500. Each level has a progress bar to the next. Every five
levels unlocks a title: 1 Curious, 5 Explorer, 10 Problem Solver, 15 Sharp Mind,
20 Examiner's Nightmare, 25 Legend.

## 3. Daily goal and streak

* Daily goal options: 20 (Chill), 50 (Regular, default), 100 (Serious), 150 (Intense).
* A **streak day** is any local day with at least one XP event: a low bar on purpose.
* **Freezes:** every 7 consecutive streak days earn one freeze, up to 2 banked. A missed
  day is covered by a freeze automatically. Freezes are derived from history by a pure
  function, so there is no extra state to get out of sync.
* If today has no activity yet but yesterday was a streak day (or frozen), the streak is
  still alive and the UI says "Do one question to keep your 6-day streak".

## 4. More rewards for real progress, and badges

Extra XP events (all once-only, enforced by the same unique index):

| Event | XP | Limit |
| --- | --- | --- |
| Topic finished (every core lesson in a syllabus topic finished) | 50 | once per topic |
| Review session finished (5+ review answers in one local day) | 15 | once per day |
| Comeback: a question you got wrong before, now right in review | +5 | once per question |
| Topic secured (every objective in the topic reaches Secure) | 30 | once per topic |

All amounts live in one config object in `src/domain/points.ts`; nothing is hard-coded
elsewhere. Exam-practice rewards (timed papers) wait until exam practice exists.

How the server decides (all in `src/server/points.ts`, rules in `src/domain/points.ts`):

* `xp_events.kind` gains `topic | review-session | comeback | topic-secure`. Source ids:
  the topic id (`topic`, `topic-secure`), the local day (`review-session`), the question
  id (`comeback`).
* **Topic finished** is checked whenever a lesson is saved as finished: the lesson's topic
  must have at least one core, non-archived lesson and all of them finished.
* **Review session**: the review page calls `finishReviewSession()` when a session ends;
  it pays when at least 5 *different* questions were answered on the review page today
  (local day), right or wrong. Re-answering one question doesn't add to the count.
* **Comeback**: an earlier attempt at the question was incorrect and this answer is fully
  correct while the question is due (the scheduler's due date, as for review XP).
* **Topic secured** and **Comeback Arc** use the progress page's mastery rules
  (`src/domain/mastery.ts`, topic state = all objectives with content Secure). After every
  answer the server compares the state of the question's topics before and after it. A
  topic seen in Needs revision is remembered in `topic_recoveries (user_id, topic_id,
  slipped_at, secured_at)`; `secured_at` is set when it is next fully Secure.
* `users.show_points` (default true) stores the Show points and badges preference; a daily
  goal of 0 means Off.

Badges (data-driven catalogue; locked badges show how to earn them):

| Badge | Earned for |
| --- | --- |
| First Steps | first lesson finished |
| Recall Rookie | first review session finished |
| Getting Warmer | first comeback (wrong before, right in review) |
| Flawless | first perfect lesson |
| On a Roll / In the Zone | 5- and 10-answer combos |
| Topic Finisher | first topic with every lesson finished |
| Curious Mind | lessons finished in 5 different topics |
| Concept Master | first topic fully Secure |
| Comeback Arc | a topic that had objectives in Needs revision becomes fully Secure |
| Consistency Club | studied on 5 different days (any days, not in a row) |
| Ten Down / Half Century | 10 and 50 lessons finished |
| Memory Keeper | 25 due reviews answered correctly |
| Goal Getter | daily goal reached on 5 different days |
| Explorer | lessons finished in 2 or more subjects |
| 500 Club / 2.5K Club | 500 and 2,500 XP |

No streak badges and no streak warnings: the home page shows **days studied this week**
(dots), and the longest run is a quiet stat on the progress page.

Preferences (Settings, all persisted): **Show points and badges** (on by default; off hides
every XP chip, pop, toast and badge surface, while XP is still recorded so turning it back
on shows real history), daily goal (Off, 20, 50, 100, 150), celebrations, sounds (off by
default).

## 5. Visual identity (supersedes earlier drafts)

Goal: the simplicity of a great learning tool with the personality of a well-made consumer
app. Human, art-directed, recognisable without the logo. Not a SaaS template.

* **Palette:** warm cream / off-white backgrounds; deep navy text; **cobalt** for primary
  actions and interactive elements; **coral** for energy and key highlights; **soft
  yellow** for achievements and tips; **mint/green** for correct and completed; **lavender
  or pink** as a secondary accent. Each subject has its own accent (Maths coral, Computer
  Science mint, Physics cobalt-sky, Chemistry lavender-pink). Colour is used for
  hierarchy, never everywhere at once, never alone to carry meaning. AA contrast in light
  and dark (dark = deep navy, not black).
* **Avoid:** generic purple gradients, glassmorphism, everything-in-a-white-rounded-card,
  identical section layouts, purposeless blobs or floating shapes, emoji as icons,
  oversized empty heroes, decorative charts, marketing copy.
* **Type:** a distinctive, highly readable pairing, self-hosted (OFL files in the repo,
  `next/font/local`), the same on Windows, Android, Mac and iPhone.
* **Icons and illustration:** one coherent icon style (extend `src/components/icons.tsx`);
  small purposeful SVG illustrations (subject motifs, empty states, lesson complete, badge
  art). New logo: wordmark and mark.
* **Interaction:** every interactive element has distinct hover, pressed, selected, focus,
  disabled and loading states; transitions 150–250 ms; small lifts or presses only on
  interactive things; nothing decorative reacts to hover. Touch targets ≥ 44 px; hover
  effects have touch/focus equivalents; `prefers-reduced-motion` removes movement.
* **Feedback:** correct → brief positive message, mint state, "+N XP" pop; incorrect →
  gentle contrasting colour (not alarm red), the explanation, and a clear Try again.
  Badge unlocks: a small toast with the badge art, name and what was achieved; never
  full-screen, never covering the question; dismissible.
* **Home:** a welcome line that reacts to context ("Two reviews waiting", "Picking up
  Functions"), a prominent Continue card, colourful subject tiles with motifs and
  progress, the next recommendation, XP and level progress, days studied this week, recent
  unlocks. Varied composition, not a grid of identical cards.
* **Lessons:** strong hierarchy; definitions, formulas, worked examples, exam tips,
  misconceptions and takeaways each get a distinct, consistent treatment; subject colour
  shows where you are; clear progress; easy previous/next and topic navigation; finished
  lessons look satisfyingly done; questions feel part of the lesson. The reading area stays
  calm: fun lives around the learning, not on top of it.
* **Copy:** short, natural, specific. No slogans.
