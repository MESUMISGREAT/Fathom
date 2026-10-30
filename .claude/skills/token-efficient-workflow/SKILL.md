---
name: token-efficient-workflow
description: Keep Claude Code repository work focused and context-efficient without sacrificing correctness, teaching quality, or verification.
---

# Token-Efficient Workflow

## Objective

Use the smallest sufficient context and fewest useful operations. Optimize wasted effort, not the quality of the result.

## 1. Orient

- Start with `git status --short` and the current branch before editing.
- Read `CLAUDE.md` and `AGENTS.md`, then only the task-relevant documentation.
- For continuing work, consult the relevant part of `docs/HANDOFF.md`; do not load it all by default.
- Preserve all existing modifications, untracked files, and drafts.

## 2. Search before reading

- Find headings first: `rg -n '^#{1,6} ' file.md`.
- Search for the relevant term, symbol, component, or caller: `rg -n -C 3 'pattern' path/`.
- Read a bounded range around the match. Expand only when context or dependencies require it.
- For Markdown, include the parent heading when needed to preserve context.
- Use `python scripts/md_section.py FILE "Heading"` when that helper is available and appropriate.
- Prefer function definitions, call sites, and diffs over full source-file dumps.

## 3. Keep operations efficient

- Batch independent read-only searches and fetches.
- Reuse findings already in context; do not repeat successful searches without a reason.
- Avoid recursive directory dumps, repeated full-file reads, and unnecessary dependency exploration.
- Use focused commands and bounded output (`head`, `tail`, `sed`, `rg`, `git diff --stat`).
- Do not print secrets, environment values, credentials, private keys, or entire lockfiles.
- Do not create workers or multi-agent coordination infrastructure by default. Work independently unless the user explicitly asks for a multi-agent workflow.

## 4. Make the smallest safe change

- Identify the files, dependencies, and tests that directly relate to the task.
- Avoid unrelated refactors and speculative cleanup.
- Preserve existing behavior unless the request requires changing it.
- Before replacing or deleting content, inspect references and preserve recoverable history.
- Never use destructive Git commands such as `git reset --hard`, `git clean`, broad restore commands, or indiscriminate staging.

## 5. Verify proportionately

- Run the narrowest meaningful check first.
- Run broader checks when the change affects shared infrastructure, schemas, imports, security, or production behavior.
- For content edits, run the relevant content validator; before an authorized content commit, run the full `npm run content:check`.
- Inspect `git diff --check` and the exact diff.
- Report checks accurately. Do not claim success for commands that were not run.

## 6. Educational content is not a token-saving target

When creating or reviewing Fathom lessons, follow `docs/CONTENT_GUIDE.md` and the lesson prompts in `scripts/lessons/templates.mjs`.

- Teach a beginner, not an expert. Define new terms, symbols, variables, units, and prerequisites before using them.
- Explain why methods work and show necessary intermediate steps.
- Use examples, diagrams, tables, and analogies when they improve understanding.
- Preserve Cambridge syllabus coverage, technical precision, conditions, and exceptions.
- Avoid repetition and filler, but never remove necessary teaching to shorten a lesson.
- The 2–5 minute lesson duration is guidance, not a limit.
- Default to one main concept and one lesson per syllabus objective unless combining tightly connected objectives clearly improves teaching.

For a content audit requested by the user, inspect actual published lesson text, syllabus coverage, equations, worked examples, question content, and rendered diagrams. Audit systematically and keep a register. Do not spend time testing unrelated UI interactions such as MCQ controls, hover states, badges, navigation paths, or responsive layouts unless explicitly requested or a defect prevents access to lesson content.

## 7. Finish clearly

At the end, provide:
- What changed and why.
- Files affected.
- Checks actually run and their results.
- Anything not inspected, not verified, or still blocked.

Keep the report concise. Never claim full coverage from a sample.
