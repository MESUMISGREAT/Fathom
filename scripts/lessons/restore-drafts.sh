#!/bin/bash
# Restores unpublished lesson drafts (and their diagrams) from the wip-snapshot branch into the
# working tree of a fresh checkout of main. Only files that do not exist on main are restored, so
# published lessons are never overwritten. Safe to run more than once.
set -eu
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
git fetch -q origin wip-snapshot
mapfile -t FILES < <(git diff --name-only --diff-filter=A HEAD origin/wip-snapshot -- content/subjects src/components/diagrams \
  | grep -E '^(content/subjects/[^/]+/lessons/[^/]+\.yaml|src/components/diagrams/[^/]+/[^/]+\.tsx)$' || true)
if [ ${#FILES[@]} -eq 0 ]; then echo "no drafts to restore"; exit 0; fi
git checkout origin/wip-snapshot -- "${FILES[@]}"
git reset -q -- "${FILES[@]}"   # keep them as untracked drafts, not staged
npx tsx scripts/gen-diagrams.ts
echo "restored ${#FILES[@]} draft file(s)"
npx tsx scripts/content-check.ts --quiet | tail -1
