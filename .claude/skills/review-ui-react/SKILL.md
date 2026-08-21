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
  (no --av-*, no hardcoded colors, tier imports present, changeset present,
  plus advisory greps for hardcoded labels and physical directional
  utilities that risk breaking RTL) against the PR's HEAD commit — not just
  main — using only local
  tokens-pd/design-tokens data (no Figma value queries), checks whether a
  source change requires a regeneration command that wasn't run in the same
  PR (design-tokens → tokens-pd, a component change
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

| Tier                                | Paths                                                                                                | Treatment                                                                                                                                                                                     |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **(a) Primary**                     | `packages/ui-react/**`, `packages/ui-spec/**`                                                        | Full review: every check below, unabridged. `ui-spec` is the framework-agnostic spec companion to a ui-react component and is reviewed at the same depth, not as an afterthought.             |
| **(b) Generated-artifact pipeline** | `packages/design-tokens/**`, `tools/style-dictionary/**`, `packages/tokens-pd/**`                    | Impact review: does this change break or silently drift something ui-react relies on? Includes the freshness table below.                                                                     |
| **(c) Declared dependency**         | Resolved dynamically from `packages/ui-react/package.json`'s `@acronis-platform/*` deps (see script) | Impact review, same lens as (b).                                                                                                                                                              |
| **(d) Consumer**                    | `apps/docs/**`, `apps/demo/**`, `apps/demos/**`                                                      | Impact review: per the `qa`/`devil-advocate` "wide-view mandate," does this PR's ui-react change still render/import correctly here (prop renames, the `"use client"`/RSC-manifest landmine)? |
| **(e) Out-of-scope**                | Everything else                                                                                      | Listed in the report for context only. Never reviewed.                                                                                                                                        |

If tiers (a)–(d) are **all** empty, stop after the scope step: this PR
doesn't touch ui-react or anything that affects it. Report what tier (e)
contains and exit — don't run devil-advocate on nothing.

---

## Statelessness contract

This skill must behave identically on the first review of a PR and the
tenth re-review of the same PR after it changed — it must never be aware it
ran before. Two layers enforce that:

- **On disk / in git**: no local ref, worktree, or temp file this skill
  creates is allowed to outlive or influence a later invocation.
  `pr-audit.sh` defensively wipes a leftover `refs/pr/<num>` from a prior
  run on entry (step 2), but leaves the ref it fetches in place on exit,
  since steps 4 and 5 still need to read it after the script returns; step
  12 of this skill deletes it explicitly once the report is written.
  `pr-audit.sh` also refuses to run at all if another invocation for the
  same PR number is already in flight (`LOCK: FAIL`, see step 2) rather than
  race it on the shared `refs/pr/<num>` ref. That lock only spans the
  script's own runtime, though — don't start a second review of the same PR
  number while an earlier one is still mid-flow (steps 3–12 not yet done),
  since those steps read and finally delete that ref outside the script.
- **In the conversation**: if this skill is invoked again for a PR number
  already discussed earlier in this session, treat it as a cold start
  anyway. Re-run `pr-audit.sh`, re-run `gh pr diff`, re-read `git show`
  content — do not answer from an earlier turn's tool output, findings, or
  report content still sitting in context. The PR may have gained commits,
  lost commits, or been rebased since that earlier turn; the only source of
  truth is what this run's fetch actually returns. If a finding from a
  previous run of this skill on the same PR still applies, it will show up
  again on its own because the underlying code is still there — it should
  never be asserted from memory of the earlier run.

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
   - If it prints `FORK_CHECK: FAIL`, **stop — this is a hard, by-design
     block, not a bug to work around.** It means the checkout's `origin`
     remote doesn't match the repo `gh` resolves as the PR's home (a fork
     checkout: `origin` = the developer's fork, some other remote = the base
     repo). This skill only runs when `origin` IS the base repo, because
     every fetch is hardcoded against `origin` — in a fork checkout that
     would fetch PR refs from the wrong repository, at best failing outright
     and at worst (if the fork happens to have its own same-numbered PR)
     silently reviewing unrelated commits. Tell the developer exactly what
     the script reported (which repo `origin` points at vs. which repo `gh`
     resolved) and that they need to run this from a checkout where `origin`
     is the base repo — do not attempt to fetch from the other remote
     yourself as a workaround.
   - If it prints `LOCK: FAIL`, another review of the same PR number is
     already running (a concurrent invocation, not this run). Wait for it to
     finish and re-run — do not delete the lock directory or retry
     immediately; that's exactly the race this check exists to prevent.
   - If it prints `origin/main: FETCH FAILED`, this is a **hard abort** —
     every downstream check in this run diffs against `origin/main`, so a
     stale fetch there makes the whole run's output untrustworthy, not just
     one section. Report the git error the script printed to the developer
     instead of retrying blind or falling back to whatever `origin/main` was
     fetched last time.
   - If it fails to fetch `refs/pr/<num>`, or `FETCH_VERIFY` reports a
     mismatch, this is a **hard abort** — do not retry silently. Read the git
     error the script printed: only if it names a shallow clone should you
     ask before running `git fetch --unshallow origin` and re-invoking the
     script; any other failure (most commonly the PR having been
     rebased/amended/force-pushed since a prior run) won't be fixed by
     `--unshallow`, so report the failure to the developer instead of
     retrying blind.
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
   - A `FAIL` row (design-tokens↔tokens-pd) is a
     strong Critical candidate, but check whether the design-tokens
     edit actually changes a resolved value (e.g. a JSON key reordering with
     no value change wouldn't require regenerating anything) before reporting
     it — this exact judgment call also gets a second look from
     devil-advocate in step 8.
   - `DESIGN_ASSETS_CHANGED` and `VR_BASELINE_HEURISTIC` are advisory only —
     read them, decide whether they're worth a finding, don't auto-escalate.
   - `HARDCODED_LABELS_ADVISORY` / `RTL_PHYSICAL_UTILITY_ADVISORY` are heuristic
     greps over added lines in changed component source (see
     `packages/ui-react/context/conventions.md`), also advisory only. A hit is
     only a real finding if the string truly has no way for the consumer to
     override it, or the physical utility truly needs to mirror under
     `dir="rtl"` — a `side="left"` variant or symmetric centering
     (`left-1/2 -translate-x-1/2`) is a legitimate false positive; check the
     surrounding code before reporting it as Important/Critical.
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

   For any **element-reconstruction / prop-dropping transform** (code that
   builds a new element from another element's props by picking a subset —
   e.g. `disabled`/`onClick`/`children` — instead of spreading the rest):
   - Enumerate what's dropped (`render`/`href`, other event handlers,
     `aria-*`, `type`, …) and grep this component's own stories/tests for the
     same prop/variant used on a non-trivial composition (a trigger
     component, a link-rendered button, anything driven by more than a bare
     click handler) — not just a plain click-button case. Report it even if
     nothing in the current diff visibly breaks, since a later consumer will
     hit it (see the PageHeaderActions/ButtonMenu fold precedent).
   - Check that whichever behavior the transform _does_ preserve (e.g. the
     surviving `onClick`) has its own dedicated regression test — attach a
     spy, trigger the transformed path, assert it fires — not just an
     assertion that the label/disabled state renders correctly.

   For any **comment asserting equivalence with other code** ("same shape
   as X", "mirrors Y", "same as Z"), verify the claim against the
   referenced code instead of taking it on faith — a stale or inaccurate
   equivalence comment is a Nit-severity finding on its own.

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
    (see structure below), **always overwriting** any existing file with that
    name unconditionally — no ask, no `-<timestamp>` suffixed copy. A prior
    run's report for the same PR number is stale by definition once the PR
    has moved; keeping it around (under this name or a suffixed one) only
    risks the developer reading old findings by mistake. The report is the
    one piece of this skill's output that's meant to persist — but each write
    replaces the last, it never accumulates.

12. **Delete `refs/pr/<num>` now that nothing else needs it.** Steps 4 and 5
    read this ref after `pr-audit.sh` has already returned, so the script
    itself cannot safely delete it on exit — it defensively wipes a leftover
    ref from a prior run on entry (see `pr-audit.sh`), but leaves the ref it
    just fetched in place when it exits. Once the report is written (step 11)
    and nothing in this skill needs the ref anymore, run
    `git update-ref -d refs/pr/<num>` yourself as this step. The forced fetch
    (`+pull/<num>/head:refs/pr/<num>`) is what keeps a single run correct even
    if this delete is ever skipped; this step is what keeps no ref surviving
    _between_ runs.

13. **Print a short terminal summary** (verdict, top findings, report path)
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

| Check                                                                            | Result                      |
| -------------------------------------------------------------------------------- | --------------------------- |
| Dangling `--ui-*` tokens (at PR head)                                            | PASS/FAIL (list)            |
| Legacy `--av-*` references introduced                                            | PASS/FAIL (list)            |
| Hardcoded hex/hsl/oklch on added lines                                           | PASS/FAIL (list)            |
| Tier `@import` present in styles/index.css                                       | PASS/FAIL (list)            |
| Changeset present (published package)                                            | PASS/FAIL                   |
| Hardcoded label introduced (advisory — confirm it's a prop default)              | none / flagged (list)       |
| Physical directional utility introduced (advisory — RTL risk)                    | none / flagged (list)       |
| Visual snapshot PNGs changed                                                     | N/A / flagged               |
| `tokens-pd` regenerated after `design-tokens` change                             | PASS/FAIL/N/A               |
| `icons-react` icon names still referenced correctly after `design-assets` change | PASS/FLAGGED/N/A            |
| VR baselines look current for changed components                                 | PASS/FLAGGED/N/A            |
| Component spec/story completeness (component-readiness)                          | READY/DRIFT/INCOMPLETE/N/A  |
| CI checks (`gh pr checks`)                                                       | pass/fail/pending breakdown |

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
  with a forced refspec
  (`git fetch origin +pull/<num>/head:refs/pr/<num>`) so the ref always
  reflects the PR's real current head even after a rebase/amend/force-push —
  this works for fork PRs too, since GitHub mirrors them into the base
  repo's `refs/pull/*` namespace. `main` freshness comes from a forced
  `git fetch origin +main:refs/remotes/origin/main`, which hard-aborts the
  whole script on failure (every downstream check diffs against
  `origin/main`, so a stale fetch there would make every result wrong, not
  just one section); the developer's checked-out branch (even if it happens
  to be `main`) is never fast-forwarded or switched. A hard `FETCH_VERIFY`
  check in the script cross-checks the fetched local SHA against `gh pr
view`'s `headRefOid` and aborts on any mismatch, so a stale fetch can never
  silently drive the rest of the review.
- **Base-repo checkouts only.** `pr-audit.sh` hard-aborts (`FORK_CHECK: FAIL`)
  before fetching anything if `origin` doesn't match the repo `gh` resolves
  as current — i.e. a fork checkout (`origin` = your fork, some other remote
  = the base repo). Every fetch in this skill targets `origin` by name; in a
  fork checkout that silently targets the wrong repository. There is no
  workaround mode — point `origin` at the base repo and re-run. Note this
  check itself first asks `gh repo view` to resolve the current repo, which
  needs `origin`'s host to be one `gh` recognizes (github.com, or a
  configured `GH_HOST`); an SSH config host alias for `origin` (e.g.
  `git@github-work:owner/repo`) makes that resolution fail too, so it is
  **not** a safe setup — every `gh` command in this skill would fail the
  same way, not just this check.
- **One review of a given PR number at a time.** `pr-audit.sh` takes an
  exclusive lock (`LOCK: FAIL` if held) before touching `refs/pr/<num>`,
  since a second concurrent run would race the first on that shared ref's
  delete/fetch. Don't start a second invocation for the same PR number until
  the first has finished through step 12.
- **No lingering local git state, once the whole review is done.**
  `pr-audit.sh` defensively deletes a leftover `refs/pr/<num>` from a prior
  run on entry (after AUTH/FORK_CHECK pass), but leaves the ref it fetches in
  place on exit — steps 4 and 5 still need it after the script returns. Step
  12 of this skill deletes it explicitly once the report is written, so a
  killed/interrupted run can't poison the next one and a completed run never
  leaves the ref behind either. `component-readiness/audit.sh`'s worktree
  (used in step 5) is the same story: pruned defensively before creation,
  removed via an `EXIT` trap after (that trap intentionally does not add
  `INT`/`TERM` — `EXIT` already fires for those signals, and a non-terminating
  handler for them would let the script resume against a worktree it just
  deleted). The report file (always overwritten, never suffixed) is the only
  thing that persists after a run.
- **Local-only token/style truth.** All `--ui-*` resolution and
  generated-artifact freshness checks read `packages/tokens-pd`,
  `packages/design-tokens` at the PR's own head commit. Figma is never queried
  for token or style values in this flow.
- **No local build by default.** CI status comes from `gh pr checks`, not a
  local `pnpm install`/build/test run.
- **Ask, don't guess.** An unresolved token always triggers the interactive
  gate in step 3. A generated-artifact freshness "FAIL" is a candidate, not
  an auto-Critical — devil-advocate gets a chance to refute it first.
