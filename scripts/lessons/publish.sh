#!/bin/bash
# Publishes reviewed (status: ai-checked) lessons that are not on main yet, with
# the diagram files they need. Everything is verified in a clean worktree built
# from main; lessons that fail validation are left out. The main working tree's
# files are never modified (only its index and branch ref move to the new commit).
set -u
# Commit attribution: set COMMIT_TRAILER to the lines your session should end commits with.
TRAILER="${COMMIT_TRAILER:-Co-Authored-By: Claude <noreply@anthropic.com>}"
REPO=$(git -C "$(dirname "$0")" rev-parse --show-toplevel)
WT=$(mktemp -d)/publish-wt
cd "$REPO" || exit 1

mapfile -t CANDIDATES < <(git status --porcelain --untracked-files=all -- content/subjects | awk '{print $2}' | grep '/lessons/.*\.yaml$' | while read -r f; do grep -q '^  status: ai-checked' "$f" && echo "$f"; done)
if [ ${#CANDIDATES[@]} -eq 0 ]; then echo "nothing reviewed to publish"; exit 0; fi

rm -rf "$WT"; git worktree prune
git worktree add -q --detach "$WT" HEAD || exit 1
ln -s "$REPO/node_modules" "$WT/node_modules"
for f in "${CANDIDATES[@]}"; do mkdir -p "$WT/$(dirname "$f")"; cp "$f" "$WT/$f"; done

# Diagram files the candidates reference, plus local files those diagrams import.
python3 - "$REPO" "$WT" "${CANDIDATES[@]}" <<'PY'
import os, re, shutil, sys
repo, wt, lessons = sys.argv[1], sys.argv[2], sys.argv[3:]
root = os.path.join(repo, 'src/components/diagrams')
bykey = {}
for subj in os.listdir(root):
    d = os.path.join(root, subj)
    if not os.path.isdir(d): continue
    for f in os.listdir(d):
        if f.endswith('.tsx'):
            m = re.search(r"export const diagramKey\s*=\s*['\"]([^'\"]+)", open(os.path.join(d, f)).read())
            if m: bykey[m.group(1)] = os.path.join(d, f)
todo = []
for l in lessons:
    for k in re.findall(r"^\s*diagram:\s*['\"]?([a-z0-9-]+)", open(os.path.join(repo, l)).read(), re.M):
        if k in bykey: todo.append(bykey[k])
seen = set()
while todo:
    f = todo.pop()
    if f in seen or not os.path.exists(f): continue
    seen.add(f)
    for imp in re.findall(r"from '\./([\w-]+)'", open(f).read()):
        todo.append(os.path.join(os.path.dirname(f), imp + '.tsx'))
for f in seen:
    if not os.path.exists(f): continue
    dest = os.path.join(wt, os.path.relpath(f, repo))
    if not os.path.exists(dest): shutil.copy(f, dest)
print(f"copied {len(seen)} diagram file(s)")
PY

cd "$WT"
npx tsx scripts/gen-diagrams.ts >/dev/null 2>&1
for round in 1 2 3 4 5 6; do
  out=$(npx tsx scripts/content-check.ts --quiet 2>&1)
  bad=$(echo "$out" | grep '^ERROR' | sed -E 's/^ERROR +([^:]+):.*/\1/' | sort -u)
  [ -z "$bad" ] && break
  for b in $bad; do
    case "$b" in content/subjects/*/lessons/*) rm -f "$b"; echo "left out (validation): $b" ;;
      *) echo "error outside lessons, aborting: $b"; cd "$REPO"; git worktree remove --force "$WT"; exit 1 ;; esac
  done
done
if echo "$out" | grep -q '^ERROR'; then echo "still invalid, aborting"; cd "$REPO"; git worktree remove --force "$WT"; exit 1; fi
if ! npx tsc --noEmit >"$WT.tsc.log" 2>&1; then echo "typecheck failed, aborting:"; head -20 "$WT.tsc.log"; cd "$REPO"; git worktree remove --force "$WT"; exit 1; fi
if ! npx vitest run tests/diagrams.test.ts >"$WT.vitest.log" 2>&1; then echo "diagram registry test failed, aborting"; tail -20 "$WT.vitest.log"; cd "$REPO"; git worktree remove --force "$WT"; exit 1; fi

git add -A content src/components/diagrams
n=$(git diff --cached --name-only -- content | wc -l)
if [ "$n" -eq 0 ]; then echo "nothing passed validation"; cd "$REPO"; git worktree remove --force "$WT"; exit 0; fi
summary=$(echo "$out" | grep -E '^  9' | sed 's/^  //')
git commit -q -F - <<EOF
Add $n reviewed lessons

Each was written, then checked line by line (facts, worked examples,
answer keys) by a separate AI reviewer. Not yet reviewed by a teacher.

Coverage now:
$summary

$TRAILER
EOF
new=$(git rev-parse HEAD)
pushed=0
for i in 1 2 3 4; do git push -q origin "$new:refs/heads/main" && { pushed=1; break; }; sleep $((2**i)); done
cd "$REPO"
git worktree remove --force "$WT"
[ "$pushed" -eq 1 ] || { echo "push failed"; exit 1; }
git reset -q "$new"   # move main and the index to the new commit; working files untouched
echo "published $n lessons in $(git rev-parse --short "$new")"
echo "$summary"
