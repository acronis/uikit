#!/usr/bin/env bash
#
# Deterministic pre-flight + static audit for /review-ui-react.
#
# Non-destructive: never checks out a branch, never touches the working tree
# or the developer's current HEAD. Fetches the PR into refs/pr/<n> and diffs
# everything against origin/main. Read-only — never edits files.
#
# Usage:
#   bash .claude/skills/review-ui-react/scripts/pr-audit.sh <pr-number> [--ci]
#
# Sections printed (parsed by the calling skill, not by humans):
#   PREFLIGHT, FETCH, PR_METADATA, FETCH_VERIFY, SCOPE, TOKEN_CHECK,
#   CONVENTION_CHECK, GENERATED_ARTIFACT_FRESHNESS, CI_CHECKS (only with --ci)
#
# The interpretive parts (is a finding real, does a pattern repeat elsewhere,
# devil-advocate verification) are NOT here — this script only surfaces facts.

set -uo pipefail

ROOT="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT" || exit 1

NUM="${1:-}"
if [ -z "$NUM" ]; then
  echo "Usage: pr-audit.sh <pr-number> [--ci]" >&2
  exit 2
fi
PR_REF="refs/pr/$NUM"
WANT_CI=0
[ "${2:-}" = "--ci" ] && WANT_CI=1

TOKENS_DIR=packages/tokens-pd/css
STYLES=packages/ui-react/src/styles/index.css

TIER_B_RE='^packages/design-tokens/|^tools/style-dictionary/|^packages/tokens-pd/'
TIER_D_RE='^apps/docs/|^apps/demo/|^apps/demos/'

echo "=== PREFLIGHT ==="
if ! gh auth status >/dev/null 2>&1; then
  echo "AUTH: FAIL — run: gh auth login"
  exit 1
fi
echo "AUTH: OK"

REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)"
echo "REPO: ${REPO:-unknown}"

echo
echo "=== FETCH ==="
git fetch origin main >/dev/null 2>&1 && echo "origin/main: updated" || echo "origin/main: FETCH FAILED"
# The leading "+" forces the update even when the PR's history diverged from
# what refs/pr/$NUM already points to locally (rebase/amend/force-push) — a
# plain refspec only allows a fast-forward and would silently leave the old,
# stale commit in place while reporting success on the next line.
if git fetch origin "+pull/$NUM/head:$PR_REF" >/dev/null; then
  echo "$PR_REF: updated"
else
  echo "$PR_REF: FETCH FAILED (see git error above; check for shallow clone or run again)"
  exit 1
fi

echo
echo "=== PR_METADATA ==="
gh pr view "$NUM" --json state,baseRefName,isDraft,title,author,additions,deletions,changedFiles,url,headRefOid,isCrossRepository 2>/dev/null

echo
echo "=== FETCH_VERIFY ==="
HEAD_REF_OID="$(gh pr view "$NUM" --json headRefOid -q .headRefOid 2>/dev/null)"
LOCAL_REF_SHA="$(git rev-parse "$PR_REF" 2>/dev/null)"
if [ -z "$HEAD_REF_OID" ]; then
  echo "FETCH_VERIFY: FAIL — could not read headRefOid from gh pr view."
  exit 1
elif [ "$LOCAL_REF_SHA" != "$HEAD_REF_OID" ]; then
  echo "FETCH_VERIFY: FAIL — $PR_REF is at $LOCAL_REF_SHA but the PR's current head is $HEAD_REF_OID."
  echo "  The local ref does not reflect the PR's real head (stale fetch, or the PR moved"
  echo "  between the fetch above and this check) — aborting rather than reviewing a stale diff."
  exit 1
fi
echo "FETCH_VERIFY: OK — $PR_REF matches PR head ($HEAD_REF_OID)"

echo
echo "=== SCOPE ==="
ALL_FILES="$(git diff --name-only --diff-filter=ACMR "origin/main...$PR_REF" 2>/dev/null)"

# ---- Tier (c): declared @acronis-platform/* deps of ui-react, resolved dynamically ----
# (no associative arrays — macOS ships bash 3.2, which lacks `declare -A`)
NAME_TO_PATH_FILE="$(mktemp)"
for pj in packages/*/package.json tools/*/package.json; do
  [ -f "$pj" ] || continue
  name="$(grep -m1 -oE '"name": *"[^"]+"' "$pj" | sed -E 's/.*"name": *"([^"]+)".*/\1/')"
  [ -n "$name" ] && printf '%s\t%s\n' "$name" "$(dirname "$pj")" >> "$NAME_TO_PATH_FILE"
done

ui_react_pkg="$(git show "$PR_REF:packages/ui-react/package.json" 2>/dev/null)"
dep_names="$(printf '%s' "$ui_react_pkg" | grep -oE '"@acronis-platform/[a-zA-Z0-9_-]+"' | tr -d '"' | sort -u)"

tier_c_paths=""
for dep in $dep_names; do
  p="$(grep -m1 -F "$(printf '%s\t' "$dep")" "$NAME_TO_PATH_FILE" | cut -f2)"
  [ -z "$p" ] && continue
  [ "$p" = "packages/ui-react" ] && continue
  printf '%s/\n' "$p" | grep -qE "$TIER_B_RE" && continue
  tier_c_paths="$tier_c_paths $p"
done
rm -f "$NAME_TO_PATH_FILE"

matches_tier_c() {
  local f="$1" p
  for p in $tier_c_paths; do
    case "$f" in "$p"/*) return 0 ;; esac
  done
  return 1
}

TIER_A_FILE="$(mktemp)"; TIER_B_FILE="$(mktemp)"; TIER_C_FILE="$(mktemp)"
TIER_D_FILE="$(mktemp)"; TIER_E_FILE="$(mktemp)"
: > "$TIER_A_FILE"; : > "$TIER_B_FILE"; : > "$TIER_C_FILE"; : > "$TIER_D_FILE"; : > "$TIER_E_FILE"

while IFS= read -r f; do
  [ -z "$f" ] && continue
  if [[ "$f" =~ ^packages/ui-react/|^packages/ui-spec/ ]]; then
    echo "$f" >> "$TIER_A_FILE"
  elif [[ "$f" =~ $TIER_B_RE ]]; then
    echo "$f" >> "$TIER_B_FILE"
  elif matches_tier_c "$f"; then
    echo "$f" >> "$TIER_C_FILE"
  elif [[ "$f" =~ $TIER_D_RE ]]; then
    echo "$f" >> "$TIER_D_FILE"
  else
    echo "$f" >> "$TIER_E_FILE"
  fi
done <<< "$ALL_FILES"

echo "TIER_A (packages/ui-react + packages/ui-spec, full review):"
sed 's/^/  /' "$TIER_A_FILE"
echo "TIER_B (generated-artifact pipeline, impact review):"
sed 's/^/  /' "$TIER_B_FILE"
echo "TIER_C (declared dependency${tier_c_paths:+ [$tier_c_paths ]}, impact review):"
sed 's/^/  /' "$TIER_C_FILE"
echo "TIER_D (consumer apps, impact review):"
sed 's/^/  /' "$TIER_D_FILE"
echo "TIER_E (out of scope, listed only):"
sed 's/^/  /' "$TIER_E_FILE"

if [ ! -s "$TIER_A_FILE" ] && [ ! -s "$TIER_B_FILE" ] && [ ! -s "$TIER_C_FILE" ] && [ ! -s "$TIER_D_FILE" ]; then
  echo
  echo "RESULT: SHORT_CIRCUIT — no files in tiers (a)-(d); PR doesn't touch ui-react or anything that affects it."
  rm -f "$TIER_A_FILE" "$TIER_B_FILE" "$TIER_C_FILE" "$TIER_D_FILE" "$TIER_E_FILE"
  exit 0
fi

echo
echo "=== TOKEN_CHECK ==="
REFS_FILE="$(mktemp)"; : > "$REFS_FILE"
if [ -s "$TIER_A_FILE" ]; then
  while IFS= read -r f; do
    case "$f" in *.tsx|*.ts|*.yaml) git show "$PR_REF:$f" 2>/dev/null ;; esac
  done < "$TIER_A_FILE" | grep -o -- '--ui-[a-z0-9-]*' | grep -v -- '-$' | sort -u > "$REFS_FILE"

  defined="$(mktemp)"
  git ls-tree -r --name-only "$PR_REF" -- "$TOKENS_DIR" 2>/dev/null \
    | while IFS= read -r tf; do git show "$PR_REF:$tf" 2>/dev/null; done \
    | grep -rho -- '--ui-[a-z0-9-]*' | sort -u > "$defined"

  dangling="$(comm -23 "$REFS_FILE" "$defined" 2>/dev/null)"
  if [ -z "$dangling" ]; then
    echo "DANGLING_TOKENS: none"
  else
    echo "DANGLING_TOKENS:"
    printf '%s\n' "$dangling" | sed 's/^/  /'
  fi
  rm -f "$defined"
else
  echo "DANGLING_TOKENS: n/a (no tier A files)"
fi

echo
echo "=== CONVENTION_CHECK ==="
if [ -s "$TIER_A_FILE" ]; then
  ADDED="$(git diff "origin/main...$PR_REF" -- packages/ui-react 2>/dev/null | grep -E '^\+' | grep -v '^\+\+\+')"

  legacy="$(printf '%s\n' "$ADDED" | grep -oE -- '--av-[a-z0-9-]*' | sort -u)"
  if [ -z "$legacy" ]; then echo "LEGACY_AV_TOKENS: none"; else
    echo "LEGACY_AV_TOKENS:"; printf '%s\n' "$legacy" | sed 's/^/  /'
  fi

  hardcoded="$(printf '%s\n' "$ADDED" | grep -noE '#[0-9a-fA-F]{3,8}\b|hsla?\(|oklch\(' | sort -u)"
  if [ -z "$hardcoded" ]; then echo "HARDCODED_COLORS: none"; else
    echo "HARDCODED_COLORS:"; printf '%s\n' "$hardcoded" | sed 's/^/  /'
  fi

  styles_at_head="$(git show "$PR_REF:$STYLES" 2>/dev/null)"
  miss_imp=""
  while IFS= read -r t; do
    [ -z "$t" ] && continue
    tier="$(grep -rl -- "$t:" "$TOKENS_DIR"/*/default.css 2>/dev/null | head -1 \
            | sed -E "s|$TOKENS_DIR/([^/]+)/default.css|\1|")"
    [ -z "$tier" ] && continue
    printf '%s' "$styles_at_head" | grep -qF "css/$tier/default.css" || miss_imp="$miss_imp $tier"
  done < "$REFS_FILE"
  miss_imp="$(printf '%s' "$miss_imp" | tr ' ' '\n' | sort -u | tr '\n' ' ' | sed 's/^ *//;s/ *$//')"
  if [ -z "$miss_imp" ]; then echo "MISSING_TIER_IMPORTS: none"; else
    echo "MISSING_TIER_IMPORTS: $miss_imp"
  fi

  if printf '%s\n' "$ALL_FILES" | grep -qE '^\.changeset/.*\.md$'; then
    echo "CHANGESET: PRESENT"
  else
    echo "CHANGESET: MISSING (required for a published-package change)"
  fi

  snap="$(printf '%s\n' "$ALL_FILES" | grep -E '^packages/ui-react/test/__snapshots__/.*\.png$')"
  if [ -z "$snap" ]; then echo "SNAPSHOT_PNGS_CHANGED: none"; else
    echo "SNAPSHOT_PNGS_CHANGED (confirm Docker/Linux origin):"
    printf '%s\n' "$snap" | sed 's/^/  /'
  fi

  # Advisory only (heuristic greps, not semantic analysis) — restricted to a
  # component's own source (excludes .stories./.test./.figma., where example
  # text and dir-comparison fixtures are expected). See
  # packages/ui-react/context/conventions.md for the actual rule.
  comp_src="$(grep -E '^packages/ui-react/src/components/ui/[^/]+/[^/]+\.tsx$' "$TIER_A_FILE" \
              | grep -vE '\.(stories|test|figma)\.tsx$')"
  hc_label=""; rtl_phys=""
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    added_f="$(git diff "origin/main...$PR_REF" -- "$f" 2>/dev/null | grep -E '^\+' | grep -v '^\+\+\+')"
    h="$(printf '%s\n' "$added_f" | grep -noE '(aria-label|placeholder|title)=["'"'"'][A-Za-z][A-Za-z ]{2,}["'"'"']|>[A-Z][a-zA-Z]+( [a-zA-Z]+){1,4}<')"
    [ -n "$h" ] && hc_label="$hc_label$f: $(printf '%s' "$h" | tr '\n' ';')"$'\n'
    r="$(printf '%s\n' "$added_f" | grep -noE '(^|[[:space:]"'"'"'])(ml|mr|pl|pr)-[0-9\[]|(^|[[:space:]"'"'"'])(left|right)-[0-9\[]')"
    [ -n "$r" ] && rtl_phys="$rtl_phys$f: $(printf '%s' "$r" | tr '\n' ';')"$'\n'
  done <<< "$comp_src"
  if [ -z "$hc_label" ]; then echo "HARDCODED_LABELS_ADVISORY: none"; else
    echo "HARDCODED_LABELS_ADVISORY (confirm it's a prop default, not inlined):"
    printf '%s' "$hc_label" | sed 's/^/  /'
  fi
  if [ -z "$rtl_phys" ]; then echo "RTL_PHYSICAL_UTILITY_ADVISORY: none"; else
    echo "RTL_PHYSICAL_UTILITY_ADVISORY (confirm dir=\"rtl\" still renders correctly; prefer ms-/me-/ps-/pe-/start-/end-):"
    printf '%s' "$rtl_phys" | sed 's/^/  /'
  fi
else
  echo "n/a (no tier A files)"
fi

echo
echo "=== GENERATED_ARTIFACT_FRESHNESS ==="
dt_changed="$(printf '%s\n' "$ALL_FILES" | grep -c '^packages/design-tokens/tiers/.*\.json$' || true)"
pd_changed="$(printf '%s\n' "$ALL_FILES" | grep -c '^packages/tokens-pd/' || true)"
if [ "$dt_changed" -gt 0 ]; then
  if [ "$pd_changed" -gt 0 ]; then
    echo "DESIGN_TOKENS_TO_TOKENS_PD: PASS (both changed together)"
  else
    echo "DESIGN_TOKENS_TO_TOKENS_PD: FAIL — design-tokens changed, tokens-pd did not."
    echo "  Fix: pnpm --filter @acronis-platform/style-dictionary build pd-css pd-tailwind"
  fi
else
  echo "DESIGN_TOKENS_TO_TOKENS_PD: n/a (design-tokens tiers unchanged)"
fi

assets_changed="$(printf '%s\n' "$ALL_FILES" | grep -c '^packages/design-assets/packs/' || true)"
if [ "$assets_changed" -gt 0 ]; then
  echo "DESIGN_ASSETS_CHANGED: yes — advisory only (icons-react's \`generate\` auto-runs before its"
  echo "  build/test/typecheck/storybook, output is gitignored). If an icon was renamed/removed,"
  echo "  manually confirm no tier A/D file still references the old name."
else
  echo "DESIGN_ASSETS_CHANGED: n/a"
fi

if [ -s "$TIER_A_FILE" ]; then
  echo "VR_BASELINE_HEURISTIC: style/class/CVA changes present in tier A — cross-check the"
  echo "  visual-regression job under CI_CHECKS rather than re-rendering locally."
fi

if [ "$WANT_CI" -eq 1 ]; then
  echo
  echo "=== CI_CHECKS ==="
  gh pr checks "$NUM" 2>&1 || echo "(no checks yet, or gh pr checks failed)"
fi

rm -f "$TIER_A_FILE" "$TIER_B_FILE" "$TIER_C_FILE" "$TIER_D_FILE" "$TIER_E_FILE" "$REFS_FILE"
