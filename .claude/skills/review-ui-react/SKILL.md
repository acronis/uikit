---
name: review-ui-react
description: >
  Local-IDE first-pass review for a GitHub PR against acronis/uikit, tailored
  to packages/ui-react — not limited to that folder. Non-destructively
  fetches the PR (no checkout, no branch switch) via a git pull/<n>/head ref,
  classifies changed files into five tiers (ui-react itself plus its
  ui-spec companion: full review; the generated-artifact pipeline packages
  that feed its styling/icons, its other declared dependencies, and
  consumer apps that render it: impact review; everything else: listed
  only), statically verifies --ui-* token resolution and repo conventions
  (no --av-*, no hardcoded colors, tier imports present, changeset present)
  against the PR's HEAD commit — not just main — using only local
  tokens-pd/design-tokens data (no Figma value queries), checks whether a
  source change requires a regeneration command that wasn't run in the same
  PR (design-tokens → tokens-pd, icons-svg → icons-sprite, a component change
  → its Storybook VR baselines/spec/Code Connect) so a diff that "looks fine"
  doesn't silently ship a stale generated artifact, stops to ask the
  developer if a token can't be resolved, surfaces CI status via
  `gh pr checks` instead of re-running tests, hunts for bugs by reading
  surrounding code/comments for intent (not just diff lines) and greps for
  the same pattern elsewhere when a fix looks partial/mechanical, then
  adversarially re-verifies findings through the devil-advocate agent.
  Writes a markdown report to the repo root; never posts to GitHub, never
  edits code. Invoke with `/review-ui-react <pr-number-or-url> [focus notes]`.
argument-hint: '<pr-number-or-url> [focus notes]'
---

# Skill: /review-ui-react

A **read-only, local-IDE PR review**. It never checks out the PR, never
touches your working tree or current branch, never posts to GitHub, and
never edits code. It writes one markdown report to the repo root for you to
read and act on.

Why this exists: manual review of a `packages/ui-react` PR already follows a
proven pattern — pull the diff via `gh` (not local git diff), cross-check
changed lines against `main`'s actual state, read surrounding intent before
calling something a regression, and adversarially re-verify findings before
trusting them. This skill automates that pattern and adds two things a human
reviewer tends to miss under time pressure: whether a `--ui-*` token
reference actually resolves anywhere locally, and whether a source change
required a regeneration command that was never run (so the diff "looks
fine" but the package breaks at build/runtime).

Read the workspace contracts first — they override anything here on
conflict:

- [packages/ui-react/AGENTS.md](../../../packages/ui-react/AGENTS.md) +
  [context/conventions.md](../../../packages/ui-react/context/conventions.md)
- [.claude/agents/devil-advocate/agent.md](../../agents/devil-advocate/agent.md)
- [.claude/skills/component-readiness/SKILL.md](../component-readiness/SKILL.md)
  (reused directly for the SPEC/TESTS/Code-Connect verdict — don't reinvent it)

---

## Invocation

```
/review-ui-react <pr-number-or-url> [free-text focus notes]
```

Examples: `/review-ui-react 501`,
`/review-ui-react https://github.com/acronis/uikit/pull/501, focus on
regressions in Radio`.

---

## The skill is tailored to ui-react, not limited to that folder

A PR can break `packages/ui-react` through files that live nowhere near
it — a design-token value change, an icon rename, a demo story whose props
no longer match. Every changed file is classified into one of five tiers,
never a binary in/out split:

| Tier                                | Paths                                                                                                                                                                | Treatment                                                                                                                                                                                     |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **(a) Primary**                     | `packages/ui-react/**`, `packages/ui-spec/**`                                                                                                                        | Full review: every check below, unabridged. `ui-spec` is the framework-agnostic spec companion to a ui-react component and is reviewed at the same depth, not as an afterthought.             |
| **(b) Generated-artifact pipeline** | `packages/design-tokens/**`, `tools/style-dictionary/**`, `packages/tokens-pd/**`, `packages/icons-svg/**`, `packages/icons-svg-next/**`, `packages/icons-sprite/**` | Impact review: does this change break or silently drift something ui-react relies on? Includes the freshness table below.                                                                     |
| **(c) Declared dependency**         | Resolved dynamically from `packages/ui-react/package.json`'s `@acronis-platform/*` deps (see script)                                                                 | Impact review, same lens as (b).                                                                                                                                                              |
| **(d) Consumer**                    | `apps/docs/**`, `apps/demo/**`, `apps/demos/**`                                                                                                                      | Impact review: per the `qa`/`devil-advocate` "wide-view mandate," does this PR's ui-react change still render/import correctly here (prop renames, the `"use client"`/RSC-manifest landmine)? |
| **(e) Out-of-scope**                | Everything else                                                                                                                                                      | Listed in the report for context only. Never reviewed.                                                                                                                                        |

If tiers (a)–(d) are **all** empty, stop after the scope step: this PR
doesn't touch ui-react or anything that affects it. Report what tier (e)
contains and exit — don't run devil-advocate on nothing.

---

## Steps

1. **Parse the argument** — a bare PR number, a full GitHub URL, or a number
   plus free-text focus notes.

2. **Run the preflight + static audit script**:

   ```bash
   bash .claude/skills/review-ui-react/scripts/pr-audit.sh <num> --ci
   ```

   This is a single deterministic pass covering prerequisites, the
   non-destructive fetch, PR metadata, scope classification into tiers
   (a)–(e), the token/convention checks, the generated-artifact freshness
   table, and (with `--ci`) `gh pr checks`. Read its output before doing
   anything else — most of the mechanical work is already done for you.
   - If it prints `AUTH: FAIL`, stop and tell the developer to run
     `gh auth login`, then retry.
   - If it fails to fetch `refs/pr/<num>` (shallow clone), ask before
     running `git fetch --unshallow origin` — it can be slow.
   - Cross-check `PR_METADATA.baseRefName` — if it isn't `main`, stop and ask
     whether to review against the actual base or abort (the script still
     diffed against `origin/main`, so a mismatch here means the diff itself
     may be wrong).
   - If `PR_METADATA.state` is `MERGED`/`CLOSED`, ask whether a retrospective
     review is still wanted.
   - If `PR_METADATA.isDraft` is true, proceed, but mark the report **DRAFT**.
   - If `PR_METADATA.changedFiles` is very large (rule of thumb ~150+), warn
     and confirm before continuing in full.
   - If the script prints `RESULT: SHORT_CIRCUIT`, stop here — write the
     short report described below and exit.

3. **Interactive stop-and-ask gate for dangling tokens** — if
   `TOKEN_CHECK.DANGLING_TOKENS` is non-empty, stop and show the developer
   the exact list (file, token). Ask explicitly whether to continue treating
   each as a DRIFT finding or whether it resolves somewhere the static grep
   can't see (e.g. a brand-specific tier). **Never guess silently either
   way** — this is the one hard "must ask" gate.

4. **Read full diff + before/after context** for anything the script flagged
   or that looks worth a closer look:
   - `gh pr diff <num>` for the human-readable overview.
   - `git show refs/pr/<num>:<path>` / `git show origin/main:<path>` for full
     file content before/after — so intent (comments, surrounding logic) is
     visible, not just the changed lines.

5. **Generated-artifact freshness — interpret, don't just relay.** The
   script's `GENERATED_ARTIFACT_FRESHNESS` section is a heuristic, not a
   verdict:
   - A `FAIL` row (design-tokens↔tokens-pd, icons-svg↔icons-sprite) is a
     strong Critical candidate, but check whether the design-tokens/icons-svg
     edit actually changes a resolved value (e.g. a JSON key reordering with
     no value change wouldn't require regenerating anything) before reporting
     it — this exact judgment call also gets a second look from
     devil-advocate in step 8.
   - `ICONS_SVG_NEXT_CHANGED` and `VR_BASELINE_HEURISTIC` are advisory only —
     read them, decide whether they're worth a finding, don't auto-escalate.
   - For any component under `packages/ui-react/src/components/ui/<X>/` that
     changed, reuse the existing gate instead of re-deriving it — pass
     `refs/pr/<num>` as the optional second argument so it audits the
     component as it exists in the PR, not the working tree (this also
     covers a component that's brand new in the PR and doesn't exist on disk
     at all yet, via a throwaway detached worktree):
     ```bash
     bash .claude/skills/component-readiness/scripts/audit.sh <X> refs/pr/<num>
     ```
     Its SPEC/TESTS/FIGMA verdict answers "did stories/spec/Code Connect get
     updated" — don't hand-roll that check here.

6. **First-pass bug hunt (tier a)** — for each candidate issue, read
   surrounding code/comments for actual intent before calling it a
   regression (a "redundant-looking" class or prop may be load-bearing). If
   the PR looks like a partial/mechanical fix applied to a subset of files,
   grep the rest of `packages/ui-react` for the same pattern and classify
   each additional hit as confirmed-bug / needs-a-design-call / false-positive
   (e.g. symmetric/non-directional cases that only look like the same bug).

   For any **new or changed pure function** (equality/comparison, parsing,
   sorting, formatting, any helper over an `unknown`/union-typed value) — do
   a separate coverage-vs-input-space pass, since "the logic reads
   correctly" is not the same question as "the tests match what the input
   space can contain":
   - Enumerate the function's guards/branches, then for each one ask: is
     there an input that satisfies this guard/enters this branch while the
     function still returns the wrong answer? (Common shapes: two
     independent checks that each pass individually but the combination they
     jointly rule out is untested — e.g. an arity/length check plus a
     per-slot equality check that together miss a presence-vs-value mixup; a
     branch that explicitly handles one type/shape and silently falls
     through to a generic default — `String()`, a template literal, JSON
     stringify — for everything else.)
   - Check the actual test/story file for that combination, not just each
     condition in isolation — tests that cover condition A and condition B
     separately do not cover the case where A and B combine to hide a bug.
     A story or test that only exercises a function through a caller-supplied
     override (a custom formatter/comparator prop) does not exercise that
     function's own default/fallback path.
   - An untested guard-combination or fallback branch is a finding on its
     own — report it even before constructing the exact failing input, and
     even if nothing currently visibly fails.

7. **Impact review (tiers b/c/d)** — for tiers (b)/(c), assess effect on
   ui-react specifically rather than reviewing the file as if it were
   ui-react source. For tier (d), apply the `qa`/`devil-advocate` wide-view
   check: does this PR's ui-react change still render/import correctly in
   the touched consumer files?

8. **Severity-tag every candidate finding**: **Critical** (merge-blocking —
   security, correctness, or a hard convention violation, including an
   unresolved token or a confirmed stale generated artifact), **Important**
   (real issue, not merge-blocking), or **Nit** (minor polish — prefix the
   title with "Nit:").

9. **Adversarial verification** — dispatch the `devil-advocate` agent (Task
   tool) with this **self-contained prompt** (its own overlay at
   `.claude/agents/devil-advocate/agent.md` defers to a root definition file
   that does not exist on this machine, so do not rely on it supplying
   anything not stated here):

   ```
   You are running as the `devil-advocate` reviewer for this repo. Apply the
   repo-specific checklist in .claude/agents/devil-advocate/agent.md's
   "Repo-specific checks — Build phase" section. Its reference to a root
   definition at ~/.claude/agents/devil-advocate/agent.md does not exist on
   this machine — this prompt is the complete contract; do not assume
   anything not stated here.

   CORE RULE: You raise blockers or you clear the gate. You do not propose
   alternatives, you do not fix anything, you do not soften a finding to be
   diplomatic. Every blocker cites exact evidence (file:line or a diff hunk).

   INPUT: candidate findings from a first-pass review of <PR_URL> (tailored
   to packages/ui-react, including tiered impact-review findings and any
   generated-artifact-freshness findings), plus the scoped diff and
   before/after file content needed to verify each one.

   YOUR JOB: for EACH candidate finding, independently re-derive whether it
   holds up by reading the surrounding code/comments/tests yourself — do not
   trust the first-pass framing. Pay particular attention to any
   generated-artifact-freshness finding: confirm the source edit actually
   changes a resolved value/output before agreeing regeneration was required.
   Also look for anything the first pass missed within the same scope.

   Severity for every finding you confirm or add must be one of: Critical
   (blocks merge — security, correctness, or a hard convention violation),
   Important (should fix — real issue, not merge-blocking), or Nit (minor
   polish, prefix the title with "Nit:").

   OUTPUT (exactly this shape):
   ## Devil-Advocate Review — PR <number>
   VERDICT: CLEAR | BLOCKED
   ### Confirmed findings
   - [Critical|Important|Nit] <file>:<line> — <what/why> — evidence: <quote/diff/test>
   ### Rejected findings
   - <original finding> — rejected because <evidence the first pass missed>
   ### New findings
   - [Critical|Important|Nit] <file>:<line> — <what/why> — evidence
   ```

10. **Reconcile** — merge first-pass + devil-advocate's
    confirmed/rejected/new findings into one final list, ordered Critical →
    Important → Nit.

11. **Write the report** to the repo root as `uikit-pr-<number>-review.md`
    (see structure below). If it already exists, ask: overwrite, or write a
    `-<timestamp>` suffixed copy — never silently clobber.

12. **Print a short terminal summary** (verdict, top findings, report path)
    so the developer doesn't have to open the file for the headline.

---

## Report structure

```markdown
# PR Review — acronis/uikit#<number>

**PR:** <title> (<url>)
**Author:** <author> · **Status:** OPEN|DRAFT|MERGED|CLOSED
**Base:** `<baseRefName>` ← head `<headRefOid short>`
**Size:** +<additions>/-<deletions> across <changedFiles> files
**Review scope:** tailored to `packages/ui-react` — its own source, its
generated-artifact-pipeline dependencies, and its direct consumers

## Scope

**(a) Primary — packages/ui-react + packages/ui-spec (full review):** <N> files — <list>
**(b) Generated-artifact pipeline (impact review):** <N> files — <list>
**(c) Declared dependency (impact review):** <N> files — <list>
**(d) Consumer (impact review):** <N> files — <list>
**(e) Out-of-scope (touched, not reviewed):** <M> files, grouped by workspace

## Method

- Non-destructive fetch: `git fetch origin pull/<number>/head:refs/pr/<number>`
- Diff: `gh pr diff <number>` + scoped `git diff origin/main...refs/pr/<number>`
  - `git show` before/after
- Token/convention checks and generated-artifact freshness evaluated at the
  PR's HEAD commit, not pre-PR main
- CI surfaced via `gh pr checks <number>`, not re-run locally
- Findings adversarially re-verified by the devil-advocate agent

## Token / Convention / Generated-Artifact Verdict

| Check                                                                             | Result                      |
| --------------------------------------------------------------------------------- | --------------------------- |
| Dangling `--ui-*` tokens (at PR head)                                             | PASS/FAIL (list)            |
| Legacy `--av-*` references introduced                                             | PASS/FAIL (list)            |
| Hardcoded hex/hsl/oklch on added lines                                            | PASS/FAIL (list)            |
| Tier `@import` present in styles/index.css                                        | PASS/FAIL (list)            |
| Changeset present (published package)                                             | PASS/FAIL                   |
| Visual snapshot PNGs changed                                                      | N/A / flagged               |
| `tokens-pd` regenerated after `design-tokens` change                              | PASS/FAIL/N/A               |
| `icons-sprite` regenerated after `icons-svg` change                               | PASS/FAIL/N/A               |
| `icons-react` icon names still referenced correctly after `icons-svg-next` change | PASS/FLAGGED/N/A            |
| VR baselines look current for changed components                                  | PASS/FLAGGED/N/A            |
| Component spec/story completeness (component-readiness)                           | READY/DRIFT/INCOMPLETE/N/A  |
| CI checks (`gh pr checks`)                                                        | pass/fail/pending breakdown |

## Findings (Critical first, then Important, then Nit)

### 1. [Critical|Important|Nit] <title>

- What / Why / Evidence (file:line, diff hunk)
- Devil-advocate: confirmed / rejected (why) / new
- Same pattern elsewhere?: none / <file:line> — confirmed bug / needs design
  call / false positive

## Devil-Advocate Verdict

CLEAR | BLOCKED — <reason>

## Summary

| Severity (Critical/Important/Nit) | Comment | File | Line |
| --------------------------------- | ------- | ---- | ---- |
```

If the scope step short-circuited (no files in tiers a–d), write a short
report instead: PR overview, the tier (e) file list, and a one-line note
that this PR doesn't touch `packages/ui-react` or anything that affects it.

---

## Discipline

- **Read-only.** This skill never edits code, never checks out the PR branch,
  never touches the developer's working tree or current branch, never posts
  to GitHub. It writes exactly one report file.
- **Non-destructive GitHub access.** The PR is fetched into `refs/pr/<num>`
  (`git fetch origin pull/<num>/head:refs/pr/<num>`) — this works for
  fork PRs too, since GitHub mirrors them into the base repo's `refs/pull/*`
  namespace. `main` freshness comes from `git fetch origin main` only; the
  developer's checked-out branch (even if it happens to be `main`) is never
  fast-forwarded or switched.
- **Local-only token/style truth.** All `--ui-*` resolution and
  generated-artifact freshness checks read `packages/tokens-pd`,
  `packages/design-tokens`, `packages/icons-svg(-next)`, and
  `packages/icons-sprite` at the PR's own head commit. Figma is never queried
  for token or style values in this flow.
- **No local build by default.** CI status comes from `gh pr checks`, not a
  local `pnpm install`/build/test run.
- **Ask, don't guess.** An unresolved token always triggers the interactive
  gate in step 3. A generated-artifact freshness "FAIL" is a candidate, not
  an auto-Critical — devil-advocate gets a chance to refute it first.
