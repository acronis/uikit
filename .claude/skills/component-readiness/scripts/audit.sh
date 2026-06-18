#!/usr/bin/env bash
#
# Component readiness audit for @acronis-platform/ui-react.
#
# Static (no-build) pre-flight checks run BEFORE /figma-component. Read-only —
# never edits files. Prints a per-component matrix + verdict.
#
# Usage:
#   bash .claude/skills/component-readiness/scripts/audit.sh [ComponentName | kebab-name | all]
#
# Columns:
#   TOKENS    every --ui-* ref (.tsx + tests + stories + spec) resolves in tokens-pd
#   IMPORTS   every referenced component tier is @import-ed in ui-react styles/index.css
#   SPEC      ui-spec 7-file set present
#   TESTS     __tests__/<name>.test.tsx present
#   CODECONN  <name>.figma.tsx present + marked COMPLETE
#   VERDICT   READY | DRIFT (token/import failure) | INCOMPLETE (spec/tests/CC gap)
#
# The dynamic checks (vitest run, typecheck, lint, `ui-spec test` conformance) are
# slower and run by the caller per SKILL.md — this script does the fast static pass.

# Note: no `set -e` — grep/comm return non-zero on "no match", which is expected here.
set -uo pipefail

ROOT="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT" || exit 1

UI=packages/ui-react/src/components/ui
SPEC=packages/ui-spec/components
TOKENS=packages/tokens-pd/css
STYLES=packages/ui-react/src/styles/index.css

to_kebab() { printf '%s' "$1" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]'; }

arg="${1:-all}"
if [ "$arg" = "all" ]; then
  comps=$(ls "$UI")
else
  comps=$(to_kebab "$arg")
fi

# Every --ui-* token DEFINED in tokens-pd (union across tiers + brands).
defined="$(mktemp)"
grep -rho -- '--ui-[a-z0-9-]*' "$TOKENS" | sort -u > "$defined"

fail=0
printf '%-22s %-7s %-8s %-8s %-6s %-8s %s\n' COMPONENT TOKENS IMPORTS SPEC TESTS FIGMA VERDICT
printf '%-22s %-7s %-8s %-8s %-6s %-8s %s\n' "----------------------" "------" "-------" "-------" "-----" "-------" "-------"

for c in $comps; do
  if [ ! -d "$UI/$c" ]; then
    echo "$c: no such component dir under $UI"
    fail=1
    continue
  fi

  # ---- TOKENS: dangling refs in LIVE bindings only ----
  # Blocking scan = code (.tsx/.ts: var(--ui-*) bindings + test/story assertions)
  # + spec YAML (tokens.yaml is the canonical name list; anatomy.yaml schematic).
  # Prose (.md) is intentionally excluded — a stale token *name* in behavior.md is
  # doc drift, not a render-breaking ref; it surfaces below as a non-blocking note.
  refs="$(mktemp)"
  { grep -rho --include='*.tsx' --include='*.ts' -- '--ui-[a-z0-9-]*' "$UI/$c" 2>/dev/null
    grep -rho --include='*.yaml' -- '--ui-[a-z0-9-]*' "$SPEC/$c" 2>/dev/null
  } | grep -v -- '-$' | sort -u > "$refs"
  dangling="$(comm -23 "$refs" "$defined")"
  if [ -z "$dangling" ]; then tok=PASS; else tok=FAIL; fi

  # Non-blocking: stale token names mentioned in spec prose (.md) that no longer resolve.
  prose_refs="$(grep -rho --include='*.md' -- '--ui-[a-z0-9-]*' "$SPEC/$c" 2>/dev/null \
                | grep -v -- '-$' | sort -u)"
  prose_stale="$(comm -23 <(printf '%s\n' "$prose_refs" | sort -u) "$defined" 2>/dev/null)"

  # ---- IMPORTS: each referenced component tier is imported in styles/index.css ----
  miss_imp=""
  while read -r t; do
    [ -z "$t" ] && continue
    tier="$(grep -rl -- "$t:" "$TOKENS"/*/acronis.css 2>/dev/null | head -1 \
            | sed -E "s|$TOKENS/([^/]+)/acronis.css|\1|")"
    [ -z "$tier" ] && continue   # base/shared token (css/acronis.css) — always imported
    grep -qF "css/$tier/acronis.css" "$STYLES" || miss_imp="$miss_imp $tier"
  done < "$refs"
  miss_imp="$(printf '%s' "$miss_imp" | tr ' ' '\n' | sort -u | tr '\n' ' ' | sed 's/^ *//;s/ *$//')"
  if [ -z "$miss_imp" ]; then imp=PASS; else imp=FAIL; fi

  # ---- SPEC: 7-file set present ----
  spec_missing=""
  if [ -d "$SPEC/$c" ]; then
    for f in index.yaml anatomy.yaml api.yaml tokens.yaml behavior.md accessibility.md README.md; do
      [ -f "$SPEC/$c/$f" ] || spec_missing="$spec_missing $f"
    done
    if [ -z "$spec_missing" ]; then spec=PASS; else spec=PARTIAL; fi
  else
    spec=NONE
  fi

  # ---- TESTS presence ----
  if [ -f "$UI/$c/__tests__/$c.test.tsx" ]; then tst=PASS; else tst=NONE; fi

  # ---- FIGMA: linkage parity (static) ----
  # Both sides of the design link must exist and agree structurally:
  #   index.yaml `figma.node` + `figma.codeConnect` ↔ a COMPLETE <name>.figma.tsx.
  # Node IDs are surfaced (not equality-checked) — the spec node is often the
  # component-set frame while Code Connect targets a specific variant; the live
  # design comparison is an agent MCP step (see SKILL.md §Figma design parity).
  idx="$SPEC/$c/index.yaml"
  ff="$UI/$c/$c.figma.tsx"
  fig_node=""; cc_path=""
  if [ -f "$idx" ]; then
    fig_node="$(grep -E '^[[:space:]]+node:' "$idx" 2>/dev/null | head -1 \
                | sed -E "s/.*node:[[:space:]]*['\"]?([0-9:-]+)['\"]?.*/\1/")"
    cc_path="$(grep -E '^[[:space:]]+codeConnect:' "$idx" 2>/dev/null | head -1 \
                | sed -E 's/.*codeConnect:[[:space:]]*//; s/[[:space:]]*$//')"
  fi
  cc_node="$(grep -oE 'node-id=[0-9-]+' "$ff" 2>/dev/null | head -1 | sed 's/node-id=//')"
  if [ ! -f "$ff" ] && [ -z "$fig_node" ]; then
    fig=NONE
  elif [ ! -f "$ff" ] || [ -z "$fig_node" ]; then
    fig=PARTIAL                                   # only one side of the link exists
  elif ! grep -q COMPLETE "$ff"; then
    fig=DRAFT                                      # Code Connect not finalized
  elif [ -n "$cc_path" ] && [ ! -f "$cc_path" ]; then
    fig=PARTIAL                                    # index.yaml codeConnect path is broken
  else
    fig=LINKED
  fi

  # ---- VERDICT ----
  if [ "$tok" = FAIL ] || [ "$imp" = FAIL ]; then
    verdict="DRIFT"; fail=1
  elif [ "$spec" != PASS ] || [ "$tst" != PASS ] || [ "$fig" = NONE ] || [ "$fig" = PARTIAL ]; then
    verdict="INCOMPLETE"
  else
    verdict="READY"
  fi

  printf '%-22s %-7s %-8s %-8s %-6s %-8s %s\n' "$c" "$tok" "$imp" "$spec" "$tst" "$fig" "$verdict"
  [ -n "$dangling" ]      && echo "    ↳ dangling tokens: $(printf '%s' "$dangling" | tr '\n' ' ')"
  [ -n "$miss_imp" ]      && echo "    ↳ missing tier imports (add to $STYLES): $miss_imp"
  [ "$spec" = PARTIAL ]   && echo "    ↳ missing spec files:$spec_missing"
  [ "$spec" = NONE ]      && echo "    ↳ no ui-spec dir ($SPEC/$c)"
  [ "$tst" = NONE ]       && echo "    ↳ no unit test ($UI/$c/__tests__/$c.test.tsx)"
  [ "$fig" = NONE ]       && echo "    ↳ no Figma link (index.yaml figma.node + <name>.figma.tsx)"
  [ "$fig" = PARTIAL ]    && echo "    ↳ Figma link incomplete (one side missing or codeConnect path broken)"
  [ "$fig" = DRAFT ]      && echo "    ↳ Code Connect not COMPLETE ($ff)"
  [ -n "$fig_node" ]      && echo "    ↳ figma parity: spec node $fig_node, code-connect node ${cc_node:-none} — run live diff (SKILL §Figma design parity)"
  [ -n "$prose_stale" ]   && echo "    ↳ (non-blocking) stale token names in spec prose: $(printf '%s' "$prose_stale" | tr '\n' ' ')"
  rm -f "$refs"
done

rm -f "$defined"

echo
if [ "$fail" -ne 0 ]; then
  echo "RESULT: DRIFT present — resolve dangling tokens / missing imports before /figma-component."
else
  echo "RESULT: no token drift. Review INCOMPLETE rows; run the dynamic checks (SKILL.md §Dynamic checks)."
fi
exit "$fail"
