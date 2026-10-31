# Handoff

Read this, then `CLAUDE.md` and `docs/CONTENT_GUIDE.md`. Everything older than what is here is
in git history (`git log -- docs/HANDOFF.md`); it is no longer needed.

## 1. Facts

- Live: https://fathom-steel-ten.vercel.app. **Every push to `main` deploys to production.**
- Vercel: team `team_B3kW8x8OsulpVUvH5QfGjWc6`, project `prj_jXj1Ie1VEFG9NLnTp2KQ5Vj4r8rQ`.
  Preview deployments are off on purpose (they share the production database).
- Lesson URL: `/subjects/mathematics/<topic with - for .>/<lesson id>`, e.g. `.../3-7/p3-vectors-notation`.
- **Publishing (user, 31 Oct 2026):** "do not ask me before publishing changes". Reviewed,
  validated lesson batches may be pushed to `main` without asking again. All other safety rules
  in `CLAUDE.md` still apply.

## 2. What the user wants (the point of Fathom)

- A 15-year-old must understand every lesson **without looking anything up**.
- Long is fine. Hard to read is not. Use the layout rules in `docs/CONTENT_GUIDE.md` §2
  ("Layout for easy reading"): short paragraphs, blank lines, bullets, one step per line.
- Fun, warm, accurate. Cambridge wording where marks depend on it.
- Never claim teacher review. Never copy past papers.
- Replies to the user: short and plain. They are a student.

## 3. How lesson work is done now

One agent does the writing. Independence for `ai-checked` comes from **one reviewer subagent
per batch** (general-purpose, told not to edit). There is no mailbox, heartbeat or
multi-agent protocol any more; `docs/AGENT_COORDINATION.md` and `scripts/lessons/prompts.mjs`
are from the old multi-agent push and are not used.

For each batch (about 6–10 lessons, usually one or two topics):

1. Rewrite the lessons. Set `provenance.status: draft` and add a note
   `Revised on <date> for beginners (…). Awaiting independent review.`
2. `npm run content:check -- --only lessons/<prefix>` until 0 errors.
3. Reviewer subagent: give it the file paths and ask it to recompute every worked step and
   answer key with python, check syllabus fit, check the layout rules, and report findings
   only (no edits).
4. Apply the findings. Set `ai-checked` and replace the note's last sentence with
   `Independently re-checked in a separate AI review on <date> (every worked step and answer
   key recomputed); its findings were applied. Not yet reviewed by a teacher.`
5. Publish (section 4).

Set `minutes` to a realistic reading time (roughly words ÷ 200, at least the old value).

## 4. Publishing recipe

Work in the clean worktree `.work-logs/publish-wt4` (branch tracks `origin/main`). The main
checkout is mid-merge with other people's uncommitted work: **never commit from it, never
clean it up.**

```bash
git fetch origin && git merge-base --is-ancestor origin/main HEAD   # else rebase onto origin/main first
npm run -s content:check -- --quiet      # whole tree: 0 errors
npm run -s typecheck
npx vitest run
git add -- <exact lesson and diagram paths>   # plus src/components/diagrams/9709/index.ts only if it changed
git commit -F <message file>                  # end with the attribution trailer your session gives
git push origin HEAD:refs/heads/main
```

The `src/components/diagrams/{9618,9701,9702}/index.ts` changes in the worktree are not ours:
never stage them.

**Verify live.** HTTP 200 proves nothing (unknown URLs also return 200). Wait for a phrase that
only exists in the new text to appear in the page HTML, then check each page for 200,
`katex-error` count 0 and `<svg` present.

## 5. Traps that have bitten

- **Shell escaping:** heredocs and inline python turned `\\` into `\` (one-row pmatrix vectors)
  and `\t` into a TAB. Write scripts with the Write tool, or edit with Edit.
- **YAML:** LaTeX only in block scalars (`|-`) or single quotes. Quote any scalar containing
  `: `. Display maths goes on one line of its own: `$$…$$`.
- **Block `title:` is plain text**: no `$…$` in titles.
- **Diagrams:** formulas in `MathLabel` (box centred on x, y). Render with
  `CHROMIUM_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe" npm run -s diagram:render -- <key> --out .work-logs/dg`
  and look at it. Regenerate the registry with `npx tsx scripts/gen-diagrams.ts`.
- **Questions:** vectors and pairs → multi-field `numeric`, not `text`. Mechanics uses g = 10.
- **Old answer keys were sometimes wrong.** Recompute every key you touch.

## 6. Current state (31 Oct 2026)

- **9709 Maths:** 166 lessons. About 38 have been rewritten for beginners and published
  (batches up to `efd449c`). The rest are being rewritten topic by topic to the layout rules.
  List the ones still to do with:
  `grep -L -E '(Revised|Redrafted|Rewritten|Retyped)[^.]*2026-1[01]' content/subjects/9709/lessons/*.yaml`
- Pure Mathematics 2 (9709 2.1–2.6) was **removed on purpose** (`466f2c4`). `status.mjs` still
  lists those units as `todo`; ignore them.
- Other subjects: `node scripts/lessons/status.mjs` (68 of 154 units published). Not being
  worked on until maths is done.

## 7. Follow-ups

- Diagram label nits seen in review: line-forms "P(−1, 5)" overlap, circumcentre label,
  quadratic-inequality labels, sign-change tick label.
- The 38 lessons rewritten before the layout rules existed could use a light layout pass.
- `stats-data-central-tendency`: reading time is above `minutes` (validator warning).
- Keep the README lesson and question counts current.
