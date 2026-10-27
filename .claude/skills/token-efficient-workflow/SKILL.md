---
name: token-efficient-workflow
description: Reduce Claude token usage during coding, research, and document work by loading only relevant file sections, searching before reading, keeping context compact, avoiding redundant tool calls, and keeping agent use small and focused. Use whenever working in a repository, reading large Markdown or text files, or trying to conserve context/tokens.
---

# Token-Efficient Workflow

## Objective
Solve the task with the smallest sufficient context and fewest redundant operations, without sacrificing correctness. Optimize *input/context tokens first*, then output tokens and tool calls. Never omit information needed for a correct result.

## Core rules

1. **Search before reading.** For a large file, use targeted search (`rg`, `grep`, filename search) to locate relevant terms, headings, symbols, or line numbers before opening content.
2. **Do not dump whole files by default.** Avoid `cat` on long files and avoid reading entire Markdown files when a relevant section will do. Read a bounded line range around a match.
3. **Markdown section loading.**
   - Find headings first (`rg -n '^#{1,6} ' file.md`).
   - Locate the relevant heading and the next heading at the same or higher level.
   - Read only that section, plus a small amount of surrounding context if needed.
   - If the section is still large, search within it and read narrower ranges.
   - Include parent heading(s) when a subsection could be ambiguous out of context.
4. **Use summaries as indexes, not replacements for source truth.** If a project has `README`, `AGENTS.md`, `CLAUDE.md`, or design docs, read the smallest relevant portion. Do not load every instruction file unless the task requires it. Follow applicable repository instructions.
5. **Prefer symbols and diffs over whole source files.** Search for function/class names, imports, callers, and tests. Read only relevant implementation ranges. After editing, inspect the diff rather than re-reading all modified files.
6. **Progressive disclosure.** Start with the smallest likely-relevant slice. Expand only when evidence shows context is missing, a dependency matters, or an ambiguity affects the result.
7. **Keep tool output bounded.** Prefer commands such as:
   - `rg -n "term|symbol" path/`
   - `sed -n '120,180p' file`
   - `git diff -- path/to/file`
   - `git diff --stat`
   - `head -n 60 file` / `tail -n 40 file`
   Use output limits where supported. Do not repeatedly print the same output.
8. **Avoid redundant calls.** Batch independent searches into one tool call when possible. Reuse findings already in context. Do not re-run a successful search unless the question changed or the prior result was insufficient.
9. **Minimize generated output.** Answer directly, avoid restating the prompt, avoid long preambles, and use compact bullets. Expand only when asked or when safety/correctness needs it.
10. **No fake certainty from truncation.** If only part of a file was read, state that conclusions are based on the inspected section. Read more when a full-file claim is necessary.
11. **Preserve correctness.** Never skip required tests, security checks, repository rules, or important edge cases merely to save tokens. Do not modify unrelated code.
12. **Protect secrets.** Do not print `.env`, credentials, tokens, private keys, or large lockfiles. Inspect only relevant variable names or configuration snippets, with values redacted.

## Recommended workflow

### A. Orient cheaply
- List only the relevant directory level; avoid recursively dumping the entire repository.
- Check `git status --short` and relevant project instruction files if needed.
- Identify likely files using filenames and search terms.

### B. Locate
- Search for the exact symbol, error, feature, or heading.
- Capture line numbers and inspect a narrow range around matches.
- For Markdown, inspect heading structure before content.

### C. Read selectively
- Read the target section or function plus its immediate dependencies.
- If context is insufficient, widen the range in small increments.
- For changes, inspect tests and call sites related to the target, not every test in the project.

### D. Change and verify
- Make the smallest relevant edit.
- Run the narrowest meaningful test first, then broader tests if warranted.
- Review `git diff --check` and the targeted diff.
- Report what changed and which checks ran. Do not claim tests passed unless they ran.

## Markdown-specific examples

### Find headings
```bash
rg -n '^#{1,6} ' docs/guide.md
```

### Find a term and surrounding line numbers
```bash
rg -n -C 3 'authentication|session expiry' docs/guide.md
```

### Read a known range
```bash
sed -n '80,145p' docs/guide.md
```

### Extract a Markdown section with the helper
```bash
python scripts/md_section.py docs/guide.md "Authentication"
```

### List headings only
```bash
python scripts/md_section.py docs/guide.md --headings
```

## Token-efficiency decisions

- If a user asks about one section of a long document, read that section only.
- If a task needs a global overview, first read headings, TOC, metadata, and a short summary; then sample relevant sections. Read the full document only if the task genuinely requires whole-document coverage.
- If a file is under roughly 100 lines and relevant in full, reading it all may be cheaper than multiple tool calls.
- Do not obsessively optimize tiny files or spend more tokens describing optimization than the optimization saves.
- When using tools with unavoidable full-file output, use a script or command to extract the exact relevant range before returning content to the model.
- If a requested change spans multiple areas, create a compact working map: `file → relevant symbol/section → line range`. Keep it updated only when useful.
- When prior conversation already contains the necessary information, use it instead of re-fetching it.

## Educational-content rule

When writing or reviewing lessons, token efficiency must never come at the expense of student understanding. Explain concepts for a beginner: define unfamiliar notation, include necessary intermediate steps, explain why methods work, and use examples or visual structure where useful. Prefer removing redundant research, repeated instructions and duplicated explanations over cutting teaching. A 2–5 minute lesson is a guideline, not a reason to omit necessary content. Follow the project's `docs/CONTENT_GUIDE.md` and lesson templates.

## Agent budget and token control

- Default to a single agent for small tasks, writing, simple edits, and localized bug fixes.
- Use multiple agents only when subtasks are genuinely independent and parallel execution adds value.
- For routine work, use no more than 3 concurrent agents.
- Never spawn agents merely to review work already completed by the main agent.
- Before delegating, identify the exact files and requirements each agent needs. Avoid redundant repository exploration.
- Never give every agent the entire requirements document when a relevant section is sufficient.
- Prefer one focused verification pass over repeated review and verification loops.
- Stop spawning agents when new agents are unlikely to add meaningful findings.
- Preserve essential requirements, tests, and quality checks.
- Prioritize correctness and finished output over exhaustive exploration for its own sake.

## Limits
This skill guides Claude's behavior; it cannot guarantee a fixed token reduction. Token savings depend on file sizes, task type, tools, and how much context is genuinely required. Large files may still need broad reading for cross-cutting changes.
