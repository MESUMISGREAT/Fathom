#!/bin/bash
# Saves the working tree to refs/heads/wip-snapshot and pushes it, without touching HEAD or the real index.
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)" || exit 1
idx=$(mktemp)
cp .git/index "$idx"
export GIT_INDEX_FILE="$idx"
git add -A
tree=$(git write-tree)
unset GIT_INDEX_FILE
rm -f "$idx"
parent=$(git rev-parse -q --verify refs/heads/wip-snapshot || git rev-parse HEAD)
[ "$(git rev-parse "$parent^{tree}")" = "$tree" ] && { echo "$(date -u +%H:%M) no change"; exit 0; }
commit=$(printf 'WIP snapshot of unreviewed lesson drafts\n\n%s\n' "${COMMIT_TRAILER:-Co-Authored-By: Claude <noreply@anthropic.com>}" | git commit-tree "$tree" -p "$parent")
git update-ref refs/heads/wip-snapshot "$commit"
for i in 1 2 3 4; do git push -q origin wip-snapshot 2>/dev/null && break; sleep $((2**i)); done
echo "$(date -u +%H:%M) snapshot $(git rev-parse --short "$commit") files=$(git status --short | wc -l)"
