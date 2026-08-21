#!/usr/bin/env bash
#
# Pre-push gate for local ui-react/ui-spec changes.
#
# Unlike component-readiness (a per-named-component pre-BUILD gate) or
# review-ui-react (a PR-scoped review via gh), this runs locally against
# whatever differs from a base ref — committed commits on the branch AND
# uncommitted working-tree changes — so it works before a PR exists, on a
# small fix or a big one. It auto-discovers touched components; you never
# name them.
#
# Usage:
#   bash .claude/skills/pre-push-check/scripts/pre-push-audit.sh [base-ref]
#
# base-ref defaults to origin/main, falling back to main.
#
# Sections printed:
#   CHANGED           files that differ from base-ref (committed + working tree)
#   COMPONENT_AUDIT   per touched component: component-readiness's audit.sh
#                     (TOKENS/IMPORTS/IMPL/SPEC/TESTS/FIGMA + i18n/RTL/docs advisories)
#   DYNAMIC           vitest (scoped to touched components) / typecheck / lint /
#                     ui-spec test / uikit-docs typecheck+build (if apps/docs changed)
#   CHANGESET         presence check for a published-package change
#
# What this does NOT check — same gap as component-readiness, and worse here
# since there's no Figma node in scope at all: implementation conformance,
# spec/docs content accuracy, and Figma design parity are agent judgment
# steps, never scriptable. See SKILL.md. If the change is design-relevant
# (a new/changed variant or prop with a Figma counterpart), this script is
# the wrong tool — use `/figma-component <Name> <url> --update` instead.

set -uo pipefail

ROOT="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT" || exit 1

BASE="${1:-}"
if [ -z "$BASE" ]; then
  if git rev-parse --verify --quiet origin/main >/dev/null; then
    BASE=origin/main
  elif git rev-parse --verify --quiet main >/dev/null; then
    BASE=main
  else
    echo "ERROR: no base ref found (tried origin/main, main) — pass one explicitly." >&2
    exit 2
  fi
fi
if ! git rev-parse --verify --quiet "$BASE" >/dev/null; then
  echo "ERROR: base ref '$BASE' does not exist." >&2
  exit 2
fi

echo "=== CHANGED (vs $BASE) ==="
committed="$(git diff --name-only --diff-filter=ACMR "$BASE"...HEAD 2>/dev/null)"
uncommitted="$(git status --porcelain=v1 --untracked-files=all 2>/dev/null | cut -c4- | sed -E 's/.* -> //')"
all_changed="$(printf '%s\n%s\n' "$committed" "$uncommitted" | grep -v '^$' | sort -u)"

if [ -z "$all_changed" ]; then
  echo "(nothing changed vs $BASE)"
  echo
  echo "RESULT: PUSH-READY — no changes to check."
  exit 0
fi
printf '%s\n' "$all_changed" | sed 's/^/  /'

ui_react_changed="$(printf '%s\n' "$all_changed" | grep -E '^packages/ui-react/' || true)"
ui_spec_changed="$(printf '%s\n' "$all_changed" | grep -E '^packages/ui-spec/' || true)"
docs_changed="$(printf '%s\n' "$all_changed" | grep -E '^apps/docs/' || true)"

if [ -z "$ui_react_changed" ] && [ -z "$ui_spec_changed" ] && [ -z "$docs_changed" ]; then
  echo
  echo "RESULT: PUSH-READY — no packages/ui-react, packages/ui-spec, or apps/docs changes; nothing for this gate to check."
  exit 0
fi

# ---- derive touched components (no naming them yourself) ----
components="$(printf '%s\n%s\n' "$ui_react_changed" "$ui_spec_changed" \
  | grep -oE '(packages/ui-react/src/components/ui|packages/ui-spec/components)/[^/]+' \
  | sed -E 's#.*/##' | sort -u)"

echo
echo "=== COMPONENT_AUDIT ==="
fail_static=0
if [ -z "$components" ]; then
  echo "(no component-scoped files touched)"
else
  for c in $components; do
    [ -d "packages/ui-react/src/components/ui/$c" ] || continue
    bash .claude/skills/component-readiness/scripts/audit.sh "$c" || fail_static=1
    echo
  done
fi

echo "=== DYNAMIC ==="
dyn_fail=0
if [ -n "$components" ]; then
  test_paths=""
  for c in $components; do
    [ -d "packages/ui-react/src/components/ui/$c" ] && test_paths="$test_paths src/components/ui/$c"
  done
  if [ -n "$test_paths" ]; then
    echo "--- vitest (scoped: $test_paths) ---"
    # shellcheck disable=SC2086
    pnpm --filter @acronis-platform/ui-react exec vitest run $test_paths || dyn_fail=1
  fi
fi
if [ -n "$ui_react_changed" ]; then
  echo "--- typecheck ---"
  pnpm --filter @acronis-platform/ui-react typecheck || dyn_fail=1
  echo "--- lint ---"
  pnpm --filter @acronis-platform/ui-react lint || dyn_fail=1
fi
if [ -n "$ui_spec_changed" ]; then
  echo "--- ui-spec test ---"
  pnpm --filter @acronis-platform/ui-spec test || dyn_fail=1
fi
if [ -n "$docs_changed" ]; then
  echo "--- uikit-docs typecheck (demo .tsx compiles) ---"
  pnpm --filter @acronis-platform/uikit-docs typecheck || dyn_fail=1
  echo "--- uikit-docs build (MDX + AutoTypeTable resolve, page renders) ---"
  pnpm --filter @acronis-platform/uikit-docs build || dyn_fail=1
fi

echo
echo "=== CHANGESET ==="
if [ -n "$ui_react_changed" ]; then
  if printf '%s\n' "$all_changed" | grep -qE '^\.changeset/.*\.md$'; then
    echo "CHANGESET: PRESENT"
  else
    echo "CHANGESET: MISSING (packages/ui-react is published — run: pnpm changeset)"
  fi
else
  echo "CHANGESET: n/a (no packages/ui-react change)"
fi

echo
if [ "$fail_static" -ne 0 ] || [ "$dyn_fail" -ne 0 ]; then
  echo "RESULT: FIX-FIRST — see DRIFT rows and/or failing dynamic checks above."
  exit 1
else
  echo "RESULT: static + dynamic checks clear. Before pushing, still walk the"
  echo "        agent-judgment steps in SKILL.md (implementation conformance,"
  echo "        spec/docs content accuracy) — this script can't read for you."
  exit 0
fi
