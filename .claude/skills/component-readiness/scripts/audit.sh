#!/usr/bin/env bash
#
# Component readiness audit for @acronis-platform/ui-react.
#
# Static (no-build) pre-flight checks run BEFORE /figma-component. Read-only —
# never edits files. Prints a per-component matrix + verdict.
#
# Usage:
#   bash .claude/skills/component-readiness/scripts/audit.sh [ComponentName | kebab-name | all] [git-ref]
#
# git-ref (optional): audit the component as it exists at that commit/ref
# instead of the working tree — e.g. a PR head fetched into refs/pr/<n>, for
# reviewing a component that doesn't exist on disk yet (used by
# /review-ui-react). Implemented via a throwaway detached `git worktree` so
# none of the checks below need to know or care whether they're reading the
# working tree or a ref — same logic, different ROOT.
#
# Columns:
#   TOKENS    every --ui-* ref (.tsx + tests + stories + spec) resolves — in tokens-pd,
#             or among the hand-authored layout vars in ui-react styles/index.css
#   IMPORTS   every referenced component tier is @import-ed in ui-react styles/index.css
#   IMPL      no @radix-ui import / asChild prop in the component's own .tsx — ui-react
#             is Base UI only, this is a hard repo rule, not a style preference
#   SPEC      ui-spec 7-file set present
#   TESTS     __tests__/<name>.test.tsx present
#   CODECONN  <name>.figma.tsx present + marked COMPLETE
#   VERDICT   READY | DRIFT (token/import/impl failure) | INCOMPLETE (spec/tests/CC gap)
#
# Three more checks run per component but are printed as non-blocking advisory
# notes, not columns (they're heuristic greps, prone to false positives —
# same treatment as the stale-prose-token note below):
#   I18N hint   a literal string sits where a prop default belongs (aria-label/
#               placeholder/title attrs, or bare JSX text) in the component's
#               own .tsx (excludes .stories./.test./.figma.)
#   RTL hint    a physical directional Tailwind utility (ml-/mr-/pl-/pr-/
#               left-/right-) where a logical one (ms-/me-/ps-/pe-/start-/end-)
#               should be used instead
#   DOCS hint   apps/docs/content/docs/components/<name>.mdx is missing, or a
#               prop declared in the component's own Props interface isn't
#               mentioned anywhere in it (both are heuristic — judge each hit).
#               This is presence/prop-mention only, not content staleness — for
#               a git-history-based staleness check, use the companion
#               docs-sync-audit.sh in this same directory.
#
# What this script does NOT check (needs reading, not grepping — see SKILL.md
# §Implementation conformance / §Spec & docs content accuracy, an agent step):
# whether the right Base UI primitive/composition pattern was chosen, whether
# spec prose (behavior.md/accessibility.md) still describes actual behavior,
# whether docs prose is accurate (only presence/prop-mention is checked here).
#
# The dynamic checks (vitest run, typecheck, lint, `ui-spec test` conformance) are
# slower and run by the caller per SKILL.md — this script does the fast static pass.

# Note: no `set -e` — grep/comm return non-zero on "no match", which is expected here.
set -uo pipefail

SCRIPT_ROOT="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel 2>/dev/null || pwd)"

REF="${2:-}"
WORKTREE=""
if [ -n "$REF" ]; then
  WORKTREE="$(mktemp -d)"
  if ! git -C "$SCRIPT_ROOT" worktree add --detach --quiet "$WORKTREE" "$REF" >/dev/null 2>&1; then
    echo "ERROR: could not create a worktree for ref '$REF'" >&2
    rm -rf "$WORKTREE"
    exit 1
  fi
  trap 'git -C "$SCRIPT_ROOT" worktree remove --force "$WORKTREE" >/dev/null 2>&1; rm -rf "$WORKTREE" 2>/dev/null' EXIT
  ROOT="$WORKTREE"
else
  ROOT="$SCRIPT_ROOT"
fi
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

# Every --ui-* custom property a component can legitimately reference:
#   1. everything DEFINED in tokens-pd (union across tiers + brands), and
#   2. the few hand-authored ones DEFINED in ui-react's own styles/index.css.
# (2) is not a loophole for hand-authoring theme values — it only matches
# `--ui-x: <value>;` *declarations* in that one stylesheet, which exist solely
# for non-color layout facts the design system has no Figma variable for
# (`--ui-breakpoint-*`, `--ui-draggable-cursor*`; each is documented in place).
# They resolve at paint time exactly like a generated token, so a reference to
# one is not dangling. Colors still must come from tokens-pd — that rule is
# enforced by the no-hex convention, not by this list.
defined="$(mktemp)"
{ grep -rho -- '--ui-[a-z0-9-]*' "$TOKENS"
  grep -hoE '^\s*--ui-[a-z0-9-]+:' "$STYLES" | tr -d ' :'
} | sort -u > "$defined"

fail=0
printf '%-22s %-7s %-8s %-6s %-8s %-6s %-8s %s\n' COMPONENT TOKENS IMPORTS IMPL SPEC TESTS FIGMA VERDICT
printf '%-22s %-7s %-8s %-6s %-8s %-6s %-8s %s\n' "----------------------" "------" "-------" "-----" "-------" "-----" "-------" "-------"

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
    tier="$(grep -rl -- "$t:" "$TOKENS"/*/default.css 2>/dev/null | head -1 \
            | sed -E "s|$TOKENS/([^/]+)/default.css|\1|")"
    [ -z "$tier" ] && continue   # base/shared token (css/default.css) — always imported
    grep -qF "css/$tier/default.css" "$STYLES" || miss_imp="$miss_imp $tier"
  done < "$refs"
  miss_imp="$(printf '%s' "$miss_imp" | tr ' ' '\n' | sort -u | tr '\n' ' ' | sed 's/^ *//;s/ *$//')"
  if [ -z "$miss_imp" ]; then imp=PASS; else imp=FAIL; fi

  # ---- IMPL: hard ui-react rule — no Radix, no asChild (component's own .tsx only) ----
  impl_hits="$(grep -lE '@radix-ui|asChild' "$UI/$c"/*.tsx 2>/dev/null \
               | grep -vE '\.(stories|test|figma)\.tsx$')"
  if [ -z "$impl_hits" ]; then impl=PASS; else impl=FAIL; fi

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

  # ---- I18N / RTL: non-blocking advisory heuristics (component's own .tsx only) ----
  i18n_hits=""
  rtl_hits=""
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    h="$(grep -nE '(aria-label|placeholder|title)=["'"'"'][A-Za-z][A-Za-z ]{2,}["'"'"']|>[A-Z][a-zA-Z]+( [a-zA-Z]+){1,4}<' "$f" 2>/dev/null)"
    [ -n "$h" ] && i18n_hits="$i18n_hits$f:$(printf '\n%s' "$h" | sed 's/^/    /')"
    r="$(grep -nE '(^|[[:space:]"'"'"'])(ml|mr|pl|pr)-[0-9\[]|(^|[[:space:]"'"'"'])(left|right)-[0-9\[]' "$f" 2>/dev/null)"
    [ -n "$r" ] && rtl_hits="$rtl_hits$f:$(printf '\n%s' "$r" | sed 's/^/    /')"
  done < <(find "$UI/$c" -maxdepth 1 -name '*.tsx' ! -name '*.stories.tsx' ! -name '*.test.tsx' ! -name '*.figma.tsx' 2>/dev/null)

  # ---- DOCS: advisory only — a missing page is never blocking (both
  # /legacy-component and /figma-component write one, but older components may
  # predate that convention). Prop-mention check only runs when the component
  # declares its own Props interface (skips React.ComponentProps<'tag'>-only
  # components, which have nothing custom to document).
  mdx="apps/docs/content/docs/components/$c.mdx"
  main_tsx="$UI/$c/$c.tsx"
  docs_missing_props=""
  if [ -f "$main_tsx" ]; then
    own_props="$(sed -nE '/interface [A-Za-z0-9_]*Props/,/^}/p' "$main_tsx" 2>/dev/null \
                 | grep -oE '^[[:space:]]*[A-Za-z_][A-Za-z0-9_]*\??:' \
                 | sed -E 's/^[[:space:]]*//; s/\??:$//' | sort -u)"
    if [ -f "$mdx" ] && [ -n "$own_props" ]; then
      while IFS= read -r p; do
        [ -z "$p" ] && continue
        grep -qF "$p" "$mdx" || docs_missing_props="$docs_missing_props $p"
      done <<< "$own_props"
    fi
  fi

  # ---- VERDICT ----
  if [ "$tok" = FAIL ] || [ "$imp" = FAIL ] || [ "$impl" = FAIL ]; then
    verdict="DRIFT"; fail=1
  elif [ "$spec" != PASS ] || [ "$tst" != PASS ] || [ "$fig" = NONE ] || [ "$fig" = PARTIAL ]; then
    verdict="INCOMPLETE"
  else
    verdict="READY"
  fi

  printf '%-22s %-7s %-8s %-6s %-8s %-6s %-8s %s\n' "$c" "$tok" "$imp" "$impl" "$spec" "$tst" "$fig" "$verdict"
  [ -n "$dangling" ]      && echo "    ↳ dangling tokens: $(printf '%s' "$dangling" | tr '\n' ' ')"
  [ -n "$miss_imp" ]      && echo "    ↳ missing tier imports (add to $STYLES): $miss_imp"
  [ "$impl" = FAIL ]      && echo "    ↳ Radix/asChild found (ui-react is Base UI only): $(printf '%s' "$impl_hits" | tr '\n' ' ')"
  [ "$spec" = PARTIAL ]   && echo "    ↳ missing spec files:$spec_missing"
  [ "$spec" = NONE ]      && echo "    ↳ no ui-spec dir ($SPEC/$c)"
  [ "$tst" = NONE ]       && echo "    ↳ no unit test ($UI/$c/__tests__/$c.test.tsx)"
  [ "$fig" = NONE ]       && echo "    ↳ no Figma link (index.yaml figma.node + <name>.figma.tsx)"
  [ "$fig" = PARTIAL ]    && echo "    ↳ Figma link incomplete (one side missing or codeConnect path broken)"
  [ "$fig" = DRAFT ]      && echo "    ↳ Code Connect not COMPLETE ($ff)"
  [ -n "$fig_node" ]      && echo "    ↳ figma parity: spec node $fig_node, code-connect node ${cc_node:-none} — run live diff (SKILL §Figma design parity)"
  [ -n "$prose_stale" ]   && echo "    ↳ (non-blocking) stale token names in spec prose: $(printf '%s' "$prose_stale" | tr '\n' ' ')"
  [ -n "$i18n_hits" ]     && echo "    ↳ (advisory) possible hardcoded label — confirm it's a prop default, not inlined:$i18n_hits"
  [ -n "$rtl_hits" ]      && echo "    ↳ (advisory) physical directional utility — confirm dir=\"rtl\" still renders correctly, prefer logical (ms-/me-/ps-/pe-/start-/end-):$rtl_hits"
  [ ! -f "$mdx" ]         && echo "    ↳ (advisory) no docs page ($mdx)"
  [ -n "$docs_missing_props" ] && echo "    ↳ (advisory) props not mentioned in docs ($mdx):$docs_missing_props"
  rm -f "$refs"
done

rm -f "$defined"

echo
if [ "$fail" -ne 0 ]; then
  echo "RESULT: DRIFT present — resolve dangling tokens / missing imports / Radix-asChild before /figma-component."
else
  echo "RESULT: no token drift. Review INCOMPLETE rows; run the dynamic checks (SKILL.md §Dynamic checks)."
fi
exit "$fail"
