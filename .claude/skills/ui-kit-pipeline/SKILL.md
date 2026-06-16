---
name: ui-kit-pipeline
description: >
  Full development pipeline for Acronis UI Kit work. Orchestrates the
  specialized agent team through a phase-gated workflow: Design → Plan →
  Development → QA → Review → Audit. Use for any non-trivial component
  work, new components, Web Component fixes, or feature additions. For
  simple single-file edits, skip to Development directly. Invoke with
  /ui-kit-pipeline <ComponentName or feature description>.
---

# UI Kit Pipeline

Team orchestration skill for the Acronis UI Kit. Drives a 6-phase
gated workflow using the specialized agents in `.claude/agents/`.

Consult [CLAUDE.md](../../../CLAUDE.md) for tech stack and conventions.
Read [.ai/START_HERE.md](../../../.ai/START_HERE.md) before starting.

---

## Invocation

```
/ui-kit-pipeline <ComponentName|feature> [--scope <type>] [--from <phase>]
```

### Arguments

| Argument         | Purpose                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| `ComponentName`  | Pascal-case component (e.g., `Select`, `Table`) or feature description |
| `--scope new`    | New component — all 6 phases                                           |
| `--scope wc-fix` | Web Component compatibility fix — skip Design, start at Plan           |
| `--scope bug`    | Bug fix — start at Development                                         |
| `--scope audit`  | Audit only — skip to Audit phase                                       |
| `--from <phase>` | Explicit phase override: `design\|plan\|dev\|qa\|review\|audit`        |
| `--solo`         | Force solo subagent mode (no TeamCreate)                               |
| `--dry-run`      | Phase 0 analysis only, print recommended scope and phases              |

---

## Phase Classification

Choose the entry point based on work type:

| Work type               | Phases                                           |
| ----------------------- | ------------------------------------------------ |
| New component           | Design → Plan → Dev → QA → Review → Audit        |
| WC fix (blockers exist) | Plan → Dev → QA → Review → Audit update          |
| Feature addition        | Design → Plan → Dev → QA → Review → Audit update |
| Bug fix                 | Dev → QA → Review                                |
| Docs/spec only          | Dev → Audit update                               |
| Audit only              | Audit                                            |

When in doubt, run Phase 0 analysis: `/ui-kit-pipeline Button --dry-run`

---

## Phase 0: Component Analysis (always first)

Before spawning any agent, collect context:

1. Read [.ai/audit/MASTER-AUDIT.md](../../../.ai/audit/MASTER-AUDIT.md) for current component status.
2. Read `.ai/audit/components/<name>.md` if it exists.
3. Check the component's `@status` and `@wc-blockers` JSDoc tags in source.
4. Check [.ai/CURRENT_TASKS.md](../../../.ai/CURRENT_TASKS.md) for active work on this component.
5. Check [.ai/PLANS_STATUS.md](../../../.ai/PLANS_STATUS.md) for existing plans.

### Phase 0 Output

```
================================================================
  AvSelect  |  @status unstable  |  Audit: yellow  |  330 usages
================================================================

  Source:    src/components/select/select.vue
  @status:   unstable
  @wc-blockers:
    - document.addEventListener on mounted (WC blocker)
    - string inject key 'select-group' (WC blocker)
  Audit:     .ai/audit/components/select.md (yellow)
  Plan:      none
  Active task: none

  Recommended scope: wc-fix
  Phases: Plan → Dev → QA → Review → Audit update

  1. Start pipeline (Plan phase)
  2. Design phase first (if API changes needed)
  3. Dry-run only (stop here)
```

---

## Solo vs Team Mode

Default to **solo subagents** (sequential Task calls). Use a **team**
only when parallel coordination is needed.

| Condition                                                         | Mode           |
| ----------------------------------------------------------------- | -------------- |
| Single component, linear phases                                   | Solo subagents |
| Multiple agents needed in parallel (e.g., researcher + architect) | Team           |
| Iterative back-and-forth between agents                           | Team           |
| Simple bug fix or docs update                                     | Solo subagent  |

See `~/.claude/skills/team-lead/SKILL.md` (or project copy) for full
TeamCreate / SendMessage coordination protocol.

---

## Phase 1: Design

**When to run:** New component, feature with API changes, or WC
architecture requires a new pattern.

**Skip when:** The component API is unchanged and the approach is
established (e.g., standard WC fix using existing patterns).

**Agent:** `architect`

**Inputs:**

- Phase 0 analysis
- Existing component source (if refactor)
- [.ai/audit/MASTER-AUDIT.md](../../../.ai/audit/MASTER-AUDIT.md)
- Reference component: `src/components/button/`

**Outputs:**

- `.ai/plans/DESIGN-<component>.md` — component API, Shadow DOM
  approach, inject key design, slot structure, event interface
- `.ai/plans/adr/ADR-NNN-<decision>.md` — for non-obvious choices

**Gate 1 Checklist:**

- [ ] Props interface defined with TypeScript types
- [ ] Emits typed
- [ ] All inject keys are Symbol-based
- [ ] WC approach stated (teleport strategy, style injection)
- [ ] No breaking changes to existing API (or breaking changes justified)
- [ ] Design tokens used — no hardcoded values planned

**On blocker:** Send back to architect with specific issue.

---

## Phase 2: Plan

**When to run:** Always (except pure bug fix or docs-only).

**Agent:** `architect`

**Inputs:**

- `.ai/plans/DESIGN-<component>.md` (if Design ran)
- Phase 0 analysis
- `@wc-blockers` list from component source

**Outputs:**

- `.ai/plans/DECOMPOSITION-<component>.md` — implementation units:
  - List of files to change
  - Order of changes (dependencies first)
  - Test strategy
  - Expected `@wc-blockers` state after fix (`none`)

**Gate 2 Checklist:**

- [ ] All WC blockers from `@wc-blockers` are addressed in the plan
- [ ] File change list is complete (source + tests + docs)
- [ ] No unplanned breaking changes
- [ ] Plan is specific enough for developer to implement without ambiguity

**On blocker:** Send back to architect.

---

## Phase 3: Development

**When to run:** Always.

**Agent:** `developer-react` (this is a React repo; `developer-vue` exists only
for reuse in Vue projects). Both overlay the technology-independent root
developer at `~/.claude/agents/developer/agent.md`.

For gated interactive development of a single component, the developer
should invoke the `component-dev` skill:

```
/component-dev <ComponentName> --ticket <JIRA-ID>
```

The `component-dev` skill drives: spec → implementation → stories →
tests → docs alignment with fix-and-recheck loops.

For broader changes (composables, multiple components, infrastructure),
the developer implements directly following the DECOMPOSITION plan.

**Inputs:**

- `.ai/plans/DECOMPOSITION-<component>.md`
- `.ai/plans/DESIGN-<component>.md` (if exists)
- Component source at `src/components/<name>/`

**Outputs:**

- Updated `.vue` source with `@wc-blockers none` (if WC fix)
- Updated `@status` tag (if status changed)
- Unit tests in `__tests__/<name>.spec.ts`
- Stories in `__stories__/<name>.stories.ts`
- Spec in `__specs__/<name>.yaml` (if spec-driven)

**Gate 3 Checklist:**

- [ ] `@wc-blockers none` (or remaining blockers documented)
- [ ] All inject keys use `Symbol() as InjectionKey<T>` with null fallback
- [ ] No `document.*` / `window.*` in component code
- [ ] No `any` in TypeScript
- [ ] Design tokens only — no hardcoded values
- [ ] `npm run lint` passes
- [ ] `npm run lint:ts` passes
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds

**On blocker:** Send back to developer with specific issue and file:line.

---

## Phase 4: QA

**When to run:** Always (except docs-only).

**Agent:** `qa`

**Inputs:**

- Phase 3 output (changed files list)
- `.ai/plans/DECOMPOSITION-<component>.md`
- Component source

**Outputs:**

- `.ai/team/<component>/verify/qa.md`

**Gate 4 Checklist (from qa report):**

- [ ] All automated checks pass (lint, ts, test, build)
- [ ] WC compliance verified (no blockers in source)
- [ ] Test coverage ≥ 60% for changed component
- [ ] No console errors in browser test (if docs:dev available)
- [ ] No regressions in related components

**On blocker:** QA FAIL = blocker. Send back to developer.

---

## Phase 5: Review

**When to run:** Always for non-trivial changes.

**Skip when:** Pure docs update or single-line bug fix.

**Agent:** `devil-advocate`

**Inputs:**

- All phase artifacts (design, plan, qa report)
- Changed source files

**Outputs:**

- `.ai/team/<component>/verify/da-review.md`

**Gate 5 Checklist:**

- [ ] No WC compliance issues missed by QA
- [ ] Implementation matches DESIGN artifact (if Design ran)
- [ ] No assumptions without evidence
- [ ] No untested code paths
- [ ] CLEAR or specific BLOCKER items

**On blocker:** Send specific revision task to owning agent. Re-run
QA after fix if source changed.

---

## Phase 6: Audit

**When to run:** After any substantive component change. Always after
WC fix or status change.

**Agent:** `researcher` (new/updated audit) or `qa` (quick audit update)

**Inputs:**

- Final component source
- QA report
- Existing `.ai/audit/components/<name>.md`

**Outputs:**

- Updated `.ai/audit/components/<name>.md`
- Updated entry in `.ai/audit/MASTER-AUDIT.md`

**Audit report structure:**

```markdown
# AvComponentName Audit

**Date:** YYYY-MM-DD
**Status:** 🟢 Green | 🟡 Yellow | 🔴 Red
**@status:** ready|stable|wip|etc.
**@wc-blockers:** none | list

## Summary

One-line verdict.

## WC Compliance

- [ ] No document/window access
- [ ] Symbol inject keys with null fallback
- [ ] No global event bus
- [ ] No Teleport to body
- [ ] @wc-blockers tag accurate

## Test Coverage

- Unit tests: N cases, XX% coverage
- Stories: N exports

## Documentation

- Docs page: exists | missing | stub
- Examples: N demos

## Issues

(if Yellow or Red)

- Issue description → recommended action

## History

- YYYY-MM-DD: description of change
```

**Color thresholds:**

| Color     | Criteria                                                |
| --------- | ------------------------------------------------------- |
| 🟢 Green  | @wc-blockers none, ≥60% test coverage, docs page exists |
| 🟡 Yellow | 1-2 minor issues: partial WC, low coverage, stub docs   |
| 🔴 Red    | Zero tests, major WC blockers, no docs, broken          |

After audit update, verify [.ai/audit/MASTER-AUDIT.md](../../../.ai/audit/MASTER-AUDIT.md)
totals are updated (green/yellow/red counts).

---

## Gate Rules

- **Only the orchestrator (you) opens gates.** Agents do not advance themselves.
- A `devil-advocate` BLOCKED = the gate does not open.
- A QA FAIL caused by the new change = blocker (pre-existing failures are warnings).
- Tech-writer closes each phase with a summary when the work is significant enough to document.
- Send-backs quote the exact blocker and assign to the owning agent.

---

## File Ownership

| Phase       | Agent           | Writes to                                                            |
| ----------- | --------------- | -------------------------------------------------------------------- |
| Design      | architect       | `.ai/plans/DESIGN-*.md`, `.ai/plans/adr/`                            |
| Plan        | architect       | `.ai/plans/DECOMPOSITION-*.md`                                       |
| Development | developer-react | `src/components/<name>/`, `__tests__/`, `__stories__/`, `__specs__/` |
| QA          | qa              | `.ai/team/<name>/verify/qa.md`                                       |
| Review      | devil-advocate  | `.ai/team/<name>/verify/da-review.md`                                |
| Audit       | researcher / qa | `.ai/audit/components/<name>.md`, `.ai/audit/MASTER-AUDIT.md`        |

Never assign two agents to the same file in parallel.

### Team artifact layout (canonical — shared with `team-lead`)

Per-feature coordination artifacts live under `.ai/team/<component>/<phase>/`,
where `<component>` is the work-item slug. Phase folders:
`explore` · `design` · `build` · `verify` · `audit` — use only the phases this
pipeline runs (QA → `verify/qa.md`; the Review gate → `verify/da-review.md`).
Each phase folder holds:

- `<agent>.md` — that agent's work product (e.g. `qa.md`)
- `da-review.md` — the devil-advocate's review **of that phase**. Reviews live
  in the phase they gate; there is no separate `review/` folder.
- `summary.md` — the tech-writer's phase summary

Durable artifacts live outside the phase folders: DESIGN / DECOMPOSITION / ADRs
in `.ai/plans/` (+ `.ai/plans/adr/`), audit reports in `.ai/audit/`.

---

## Typical Flows

### WC fix for existing component (most common now)

```
Phase 0: Analysis  →  identifies blockers
Phase 2: Plan      →  architect decomposes the fix
Phase 3: Dev       →  developer fixes blockers, runs component-dev
Phase 4: QA        →  qa verifies no blockers remain, tests pass
Phase 5: Review    →  devil-advocate clears
Phase 6: Audit     →  update .ai/audit/components/<name>.md to green
```

### New component

```
Phase 0: Analysis  →  confirm it doesn't exist
Phase 1: Design    →  architect designs API + WC approach
Phase 2: Plan      →  architect decomposes implementation
Phase 3: Dev       →  developer builds with component-dev
Phase 4: QA        →  qa verifies
Phase 5: Review    →  devil-advocate clears
Phase 6: Audit     →  create new .ai/audit/components/<name>.md
```

### Bug fix

```
Phase 0: Analysis  →  identify affected files
Phase 3: Dev       →  developer fixes
Phase 4: QA        →  qa verifies fix, no regressions
Phase 5: Review    →  devil-advocate clears (optional for trivial fix)
```

### Audit sweep (batch)

```
Phase 0: Analysis  →  pick unaudited/outdated components
Phase 6: Audit     →  researcher audits each, updates MASTER-AUDIT.md
```

---

## Progress Display

After each gate, print:

```
================================================================
  AvSelect  |  Pipeline Progress
================================================================

  Phase 1 (Design):      SKIPPED (wc-fix scope)
  Phase 2 (Plan):        PASS  →  .ai/plans/DECOMPOSITION-select.md
  Phase 3 (Development): PASS  →  @wc-blockers none, tests pass
  Phase 4 (QA):          PASS  →  .ai/team/select/verify/qa.md
  Phase 5 (Review):      IN PROGRESS...
  Phase 6 (Audit):       --

  Next: awaiting devil-advocate review
================================================================
```

---

## Integration with component-dev

In Phase 3, the developer agent should invoke the `component-dev`
skill for the gated interactive workflow within their session. The
`component-dev` skill handles:

- Spec classification (Track A/B/C)
- Story completeness gate
- VR preview
- Behavior test gate
- Docs alignment gate

The pipeline's Gate 3 checklist is the **exit condition** from
`component-dev` — all component-dev gates must pass before Gate 3
is cleared.

---

## Cardinal Rule

**You (the orchestrator) never implement.** Route all code changes
to `developer-react`, all design artifacts to `architect`, all reviews to
`devil-advocate`, all verification to `qa`, and all audit updates to
`researcher`. Your only actions are: assign, gate, redirect, escalate.
