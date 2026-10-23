@AGENTS.md

# Fathom

- Continuing earlier work? Read `docs/HANDOFF.md` first. It holds the user's specs, the lesson
  pipeline (`scripts/lessons/`), the current state and what to do next.
- Work token-efficiently with `.claude/skills/token-efficient-workflow/SKILL.md`: at most 3
  agents, one review pass, read docs by section. Never skip correctness checks.
- Content rules: `docs/CONTENT_GUIDE.md`. Design and points rules: `docs/design/fun-and-points.md`.
- Only `ai-checked` lessons go on `main`, which deploys to production. Back up drafts with
  `bash scripts/lessons/snapshot.sh`.
