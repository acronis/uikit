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

TIER_B_RE='^packages/design-tokens/|^tools/style-dictionary/|^packages/tokens-pd/|^packages/icons-svg/|^packages/icons-svg-next/|^packages/icons-sprite/'
TIER_D_RE='^apps/docs/|^apps/demo/|^apps/demos/'

# Statelessness contract: this script must behave identically whether this is
# the first time <NUM> has ever been reviewed or the tenth time in a row. The
# forced refspec used below (+pull/$NUM/head:$PR_REF) already guarantees that
# on its own — it overwrites $PR_REF regardless of what it pointed to before.
# We additionally wipe any leftover $PR_REF from a prior run (interrupted,
# killed, or simply never cleaned up) once we know this run will actually
# fetch — i.e. after AUTH/FORK_CHECK pass, not before — so a run that aborts
# early never destroys a pre-existing ref for no benefit. $PR_REF is left in
# place when this script exits: the calling skill's steps 4/5 read it after
# the script returns, so it must survive until the whole review is done. The
# skill deletes it as its own final step once nothing else needs it.

echo "=== PREFLIGHT ==="
if ! gh auth status >/dev/null 2>&1; then
  echo "AUTH: FAIL — run: gh auth login"
  exit 1
fi
echo "AUTH: OK"

REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)"
echo "REPO: ${REPO:-unknown}"

# Fork guard — this skill's fetch/diff logic hardcodes the "origin" remote,
# but every gh command below (pr view/diff/checks) resolves independently
# against whatever repo `gh` considers current (it prefers an "upstream"
# remote over "origin" when both exist, e.g. a fork checkout with origin =
# your fork and upstream = the base repo). If those two disagree, `git fetch
# origin +pull/<n>/head:...` fetches PR refs from the WRONG repository — at
# best it fails outright (no such ref), at worst (if the fork happens to
# have its own same-numbered PR) it fetches an unrelated PR's commits while
# FETCH_VERIFY is the only thing standing between that and a silently wrong
# review. Check this explicitly, up front, instead of relying on that as an
# incidental safety net.
ORIGIN_URL="$(git remote get-url origin 2>/dev/null)"
if [ -z "$ORIGIN_URL" ]; then
  echo "FORK_CHECK: FAIL — no 'origin' remote configured; this skill requires origin to be the base repo."
  exit 1
fi
ORIGIN_REPO="$(gh repo view "$ORIGIN_URL" --json nameWithOwner -q .nameWithOwner 2>/dev/null)"
if [ -z "$REPO" ] || [ -z "$ORIGIN_REPO" ]; then
  echo "FORK_CHECK: FAIL — could not resolve the repo for 'origin' and/or gh's current repo; aborting rather than guessing."
  exit 1
elif [ "$ORIGIN_REPO" != "$REPO" ]; then
  echo "FORK_CHECK: FAIL — 'origin' is $ORIGIN_REPO but gh resolves the base repo as $REPO."
  echo "  This is a fork checkout (origin = your fork, a separate remote = the base repo)."
  echo "  This skill assumes 'origin' IS the base repo it reviews PRs against — fetching PR refs"
  echo "  from the wrong repo can silently review the wrong commits. Re-run this from a checkout"
  echo "  where 'origin' points at $REPO (e.g. swap remotes, or reclone non-forked)."
  exit 1
fi
echo "FORK_CHECK: OK — origin matches $REPO"

# Now that we know this run will actually fetch, wipe any leftover $PR_REF
# from a prior run (interrupted, killed, or simply never cleaned up) —
# never trust that a previous invocation left things tidy.
git update-ref -d "$PR_REF" >/dev/null 2>&1 || true

echo
echo "=== FETCH ==="
# Forced, same reasoning as the PR fetch below: origin/main may have been
# rewritten (rare, but possible), and a non-force fetch would then either no-op
# or fail while leaving the OLD local origin/main in place. Unlike before, a
# failed main fetch is now a hard abort (exit 1) rather than a printed warning
# the rest of the script silently ignores — every downstream diff/scope/token
# check is computed against origin/main, so a stale main means every result
# in this run is wrong, not just one section of it.
if git fetch origin +main:refs/remotes/origin/main >/dev/null 2>&1; then
  echo "origin/main: updated"
else
  echo "origin/main: FETCH FAILED — aborting rather than diffing against a stale local origin/main."
  exit 1
fi
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

svg_changed="$(printf '%s\n' "$ALL_FILES" | grep -c '^packages/icons-svg/' || true)"
sprite_changed="$(printf '%s\n' "$ALL_FILES" | grep -c '^packages/icons-sprite/' || true)"
if [ "$svg_changed" -gt 0 ]; then
  if [ "$sprite_changed" -gt 0 ]; then
    echo "ICONS_SVG_TO_ICONS_SPRITE: PASS (both changed together)"
  else
    echo "ICONS_SVG_TO_ICONS_SPRITE: FAIL — icons-svg changed, icons-sprite did not."
    echo "  Fix: pnpm --filter @acronis-platform/icons-sprite build"
  fi
else
  echo "ICONS_SVG_TO_ICONS_SPRITE: n/a (icons-svg unchanged)"
fi

svgnext_changed="$(printf '%s\n' "$ALL_FILES" | grep -c '^packages/icons-svg-next/' || true)"
if [ "$svgnext_changed" -gt 0 ]; then
  echo "ICONS_SVG_NEXT_CHANGED: yes — advisory only (icons-react's \`generate\` auto-runs before its"
  echo "  build/test/typecheck/storybook, output is gitignored). If an icon was renamed/removed,"
  echo "  manually confirm no tier A/D file still references the old name."
else
  echo "ICONS_SVG_NEXT_CHANGED: n/a"
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
