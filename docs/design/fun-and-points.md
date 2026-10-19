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

## 4. Badges

Computed by a pure function over the user's stats after each XP-earning action; newly
earned badges are stored and returned so the UI can celebrate them once.

| Badge | Earned for |
| --- | --- |
| First Spark | first correct answer |
| Off the Blocks | first lesson finished |
| Flawless | first perfect lesson |
| Combo ×5, Combo ×10 | a 5- and a 10-answer combo |
| On a Roll, Week Warrior, Unstoppable | 3-, 7- and 30-day streaks |
| Ten Down, Half Century | 10 and 50 lessons finished |
| Memory Keeper | 25 due reviews answered correctly |
| Goal Getter | daily goal reached on 5 different days |
| Explorer | lessons finished in 2 or more subjects |
| 500 Club, 2.5K Club | 500 and 2,500 XP |

## 5. Visual redesign

Personality: bright, bouncy, friendly and confident. Playful for 16–19 year olds, not
childish. Think of a mix of Duolingo's energy, Brilliant's clarity and Apple's polish.

* **Colour:** a vivid primary (violet-indigo) plus one strong hue per subject (Maths
  violet, Computer Science cyan, Physics orange, Chemistry green), gold for XP and a flame
  orange for streaks. Soft tinted backgrounds, not flat grey. Dark mode is a deep
  blue-black with the same hues tuned for contrast. All text meets WCAG AA.
* **Buttons that look pressable:** chunky rounded buttons with a darker bottom edge
  (a solid "3D" shadow). They lift slightly on hover and press down instantly on pointer
  down (translateY plus a shrinking edge). Thick, clear focus rings.
* **Answer options** are big tappable cards with a keycap letter, a bold selected state, a
  green pop when correct and a gentle shake when wrong (no shake with reduced motion).
* **Cards and tiles:** generous radius, colourful subject tiles with an icon, a progress
  ring and a bold title.
* **Motion:** short, springy, interruptible; pops on XP, a filling bar, confetti when a
  lesson is finished. Off with `prefers-reduced-motion` or the Celebrations setting.
* **Typography:** a rounded, friendly face for headings (system `ui-rounded` where
  available), tight tracking on large text, comfortable body leading.
* **Sounds (optional):** tiny synthesised blips via the Web Audio API for correct, wrong,
  combo and lesson complete. No audio files. Off by default.

Where it appears:

* **Top bar / tab bar:** streak flame with day count, today's XP against the goal as a
  small ring, level badge.
* **Answer feedback:** "+15 XP" pop, combo counter ("Combo ×3"), badge and level-up toasts.
* **Lesson finished:** a celebration card with confetti, XP earned, accuracy, and a big
  "Next lesson" button.
* **Home:** greeting, daily goal ring, streak with the last 7 days as dots, level progress,
  a big "Continue" button, latest badges.
* **Progress:** level and title, XP for the last 14 days as bars, badge gallery (locked
  badges shown greyed with how to earn them).
* **Settings:** daily goal, celebrations on/off, sounds on/off.

## 6. Brand direction (update from the student brief)

The first redesign brief was not bold enough. The current site reads as a corporate
website. Students are used to TikTok-level stimulation; Fathom must look **polished and
really fun**, so that opening it feels like opening a game, not a school portal.

* **Redesign everything, including the logo**: a new wordmark and app icon, and an
  original **mascot** with a few expressions (happy, thinking, cheering, sleepy) that
  appears on the home page, empty states, loading, the lesson celebration and level-ups.
  It must be original, not a look-alike of any existing brand's mascot.
* **A real display font with personality**, self-hosted (font files in the repo, OFL
  licence) so it looks the same on Windows, Android, Mac and iPhone. `ui-rounded` falls
  back to Segoe UI on Windows, which looks corporate.
* **Bold, saturated colour**, gradients and illustration where they add joy: subject
  tiles, headers, badges, the celebration. Chunky 3D buttons, sticker-like cards,
  playful shapes, bouncy micro-interactions.
* **Fun around the learning, calm inside it.** The lesson reading area and the question
  itself stay clean and easy to focus on (ADHD-friendly). The fun lives in the chrome,
  the feedback, the rewards and the transitions.
* Still polished and accessible: consistent spacing, crisp SVGs, WCAG AA contrast in
  light and dark, reduced-motion respected.

The chosen direction and its assets are in `docs/design/brand/` (see `brand.md`).
