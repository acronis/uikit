#!/usr/bin/env bash
#
# Docs-sync classifier for @acronis-platform/ui-react components.
#
# Classifies every public ui-react component's apps/docs page as:
#   NEW      no docs/<name>.mdx exists yet
#   IN_SYNC  docs/<name>.mdx is at or after the component's last meaningful
#            source commit (or the only newer commits are test/story/figma-only)
#   STALE    the component's own impl (or its ui-spec entry) changed after the
#            docs page was last touched — tagged (high) if audit.sh's own
#            prop-mention grep also finds undocumented props, (low) otherwise
#
# Read-only — never edits files. Companion to audit.sh (reuses its component
# list + own-Props extraction so the two scripts don't drift from each other).
#
# Two known caveats of the git-log approach:
#   - Uncommitted docs edits don't move `git log`'s last-touch date, so a page
#     just fixed in the working tree still reports STALE until committed.
#   - A path that was deleted and later recreated (e.g. a legacy docs page
#     dropped, then a same-named page added fresh for the new component) can
#     inherit the deleted file's old commit date as its "last touched" date,
#     since `git log -- <path>` doesn't distinguish the two lifetimes.
#
# Usage:
#   bash .claude/skills/component-readiness/scripts/docs-sync-audit.sh [ComponentName | kebab-name | all]

set -uo pipefail

SCRIPT_ROOT="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$SCRIPT_ROOT" || exit 1

UI=packages/ui-react/src/components/ui
SPEC=packages/ui-spec/components
DOCS=apps/docs/content/docs/components

to_kebab() { printf '%s' "$1" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]'; }

arg="${1:-all}"
if [ "$arg" = "all" ]; then
  # Every component dir under $UI, minus internal-only sub-parts
  # (carousel-dialog, search) that are never exported from index.ts.
  comps=$(ls "$UI" | grep -vE '^(carousel-dialog|search)$')
else
  comps=$(to_kebab "$arg")
fi

printf '%-22s %-10s %-12s %s\n' COMPONENT STATUS LAST_SRC LAST_DOCS
printf '%-22s %-10s %-12s %s\n' "----------------------" "----------" "------------" "------------"

for c in $comps; do
  if [ ! -d "$UI/$c" ]; then
    echo "$c: no such component dir under $UI"
    continue
  fi

  mdx="$DOCS/$c.mdx"
  main_tsx="$UI/$c/$c.tsx"

  if [ ! -f "$mdx" ]; then
    src_date="$(git log -1 --format=%ci -- "$UI/$c" 2>/dev/null)"
    printf '%-22s %-10s %-12s %s\n' "$c" "NEW" "${src_date:0:10}" "-"
    continue
  fi

  docs_sha="$(git log -1 --format=%H -- "$mdx" 2>/dev/null)"
  docs_date="$(git log -1 --format=%ci -- "$mdx" 2>/dev/null)"
  docs_ts="$(git log -1 --format=%ct -- "$mdx" 2>/dev/null)"
  src_date="$(git log -1 --format=%ci -- "$UI/$c" 2>/dev/null)"
  src_ts="$(git log -1 --format=%ct -- "$UI/$c" 2>/dev/null)"

  # Compare unix timestamps (%ct), not the %ci strings above — %ci renders
  # each commit in its own committer's timezone, and this repo mixes offsets,
  # so a lexicographic string compare can misorder same-day commits.
  if [ -z "$docs_sha" ] || [ -z "$src_ts" ] || [ "$src_ts" -le "$docs_ts" ]; then
    printf '%-22s %-10s %-12s %s\n' "$c" "IN_SYNC" "${src_date:0:10}" "${docs_date:0:10}"
    continue
  fi

  # Source looks newer than docs — filter delta commits down to ones that
  # touch real impl or spec, dropping test/story/figma-connect-only commits.
  meaningful="$(git log --name-only --format='%H' "$docs_sha..HEAD" -- "$UI/$c" "$SPEC/$c" 2>/dev/null \
    | awk 'BEGIN{sha=""} /^[0-9a-f]{40}$/{sha=$0; next} NF{print sha"\t"$0}' \
    | grep -vE '__tests__/|\.stories\.tsx$|\.figma\.tsx$' \
    | cut -f1 | sort -u)"

  if [ -z "$meaningful" ]; then
    printf '%-22s %-10s %-12s %s\n' "$c" "IN_SYNC" "${src_date:0:10}" "${docs_date:0:10}"
    continue
  fi

  # Cross-check with audit.sh's own-prop-mention heuristic for a confidence tag.
  confidence="low"
  if [ -f "$main_tsx" ]; then
    own_props="$(sed -nE '/interface [A-Za-z0-9_]*Props/,/^}/p' "$main_tsx" 2>/dev/null \
                 | grep -oE '^[[:space:]]*[A-Za-z_][A-Za-z0-9_]*\??:' \
                 | sed -E 's/^[[:space:]]*//; s/\??:$//' | sort -u)"
    while IFS= read -r p; do
      [ -z "$p" ] && continue
      grep -qF "$p" "$mdx" || { confidence="high"; break; }
    done <<< "$own_props"
  fi

  printf '%-22s %-10s %-12s %s\n' "$c" "STALE($confidence)" "${src_date:0:10}" "${docs_date:0:10}"
  echo "    ↳ $(printf '%s\n' "$meaningful" | grep -c .) meaningful commit(s) since docs last touched:"
  printf '%s\n' "$meaningful" | while read -r sha; do
    [ -z "$sha" ] && continue
    echo "      $(git log -1 --format='%h %s' "$sha" 2>/dev/null)"
  done
done
