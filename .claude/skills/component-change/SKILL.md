---
name: component-change
description: >
  Drive a ux-design-irrelevant change to an existing ui-react component — a bug
  fix, a new non-visual prop, a refactor, an a11y/i18n fix. Enforces the same
  shipped contract /figma-component and /legacy-component apply on a
  component's first build: ui-spec, Code Connect, VR baselines, docs,
  changeset. No more relying on whoever's editing to remember that by hand.
  Runs a fixed multi-agent pipeline on every invocation: context → analyst →
  developer-react → tech-writer → qa → devil-advocate, plus architect/researcher
  when their own triggers fire. Reuses component-readiness's audit.sh as the
  pre-check and pre-push-check's script as the closing gate — no new scripts
  or agent definitions. Hands off to /figma-component --update (or
  /legacy-component --update) if the request turns out to be design-relevant.
  Hands off to /figma-component or /legacy-component outright if the named
  component doesn't exist yet. Never reads Figma. Invoke with
  /component-change [ComponentName] <description of the change>.
argument-hint: '[ComponentName] <description of the change>'
---

# Skill: /component-change

Drives a change to a component that **already shipped** and has **no
Figma/legacy source** behind the change itself — a bug fix, a new non-visual
prop, a refactor, an a11y/i18n tweak. `/figma-component` and `/legacy-component`
never let a first build land without also touching `ui-spec`, Code Connect, VR
baselines, and the docs page; nothing plays that role for a follow-up change,
so it silently narrows to whatever `developer-react`'s own checklist covers
(test + story + changeset — no spec, no Code Connect, no VR, no docs). The
Avatar component lived this gap firsthand: `18a32a90` added props through the
full `/figma-component` recipe correctly, but the very next commit
(`2552eb33`, a null-`children` bug fix with no Figma source) shipped with
stale VR baselines and a stale Code Connect example, and needed a third
commit (`14f585ec`) just to backfill the docs and spec prose it silently
skipped. This skill exists to make that propagation an executed step instead
of a checklist line that's easy to skip on a follow-up change.

Read the workspace contracts first — they override anything here on conflict:

- Root: [AGENTS.md](../../../AGENTS.md), [context/conventions.md](../../../context/conventions.md)
- ui-react: [packages/ui-react/AGENTS.md](../../../packages/ui-react/AGENTS.md),
  [packages/ui-react/context/conventions.md](../../../packages/ui-react/context/conventions.md)
- ui-spec: [packages/ui-spec/AGENTS.md](../../../packages/ui-spec/AGENTS.md)
- Sibling skills: [`component-readiness`](../component-readiness/SKILL.md)
  (the pre-check this skill runs at Step 0), [`pre-push-check`](../pre-push-check/SKILL.md)
  (the closing gate this skill runs at Step 7), [`figma-component`](../figma-component/SKILL.md) /
  [`legacy-component`](../legacy-component/SKILL.md) (where a design-relevant
  request, or a not-yet-existing component, gets redirected)

---

## Invocation

```
/component-change [ComponentName] <description of the change> [--pr]
```

| Arg             | Meaning                                                                                                                                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ComponentName` | Optional explicit target. If the leading token(s) resolve to a real `packages/ui-react/src/components/ui/<name>/` directory, treat it as the target; otherwise omit it.                                                                                |
| description     | Free text. If `ComponentName` was omitted, infer the target component(s) and the change type from this text and/or the currently open/edited files, and **state what you inferred before proceeding** — a cheap confirmation, not a blocking question. |
| `--pr`          | Opt-in. Runs Step 9 (`integrator`) after the pipeline closes clean. Omit for a local-only change (the default, and the common case per the original motivating request: "fix … locally").                                                              |

**Multiple components in one request** (e.g. "add X to Button and IconButton")
just means Steps 0–8 run once per touched component, the same way
`pre-push-check` already auto-discovers multiple touched components from a
diff. Don't try to batch them into a single agent prompt per step — keep each
component's context self-contained the way [[developer-react]]'s own file
layout is per-component.

---

## Full roster, every time — no fast path

**Every invocation runs the complete Step 0–8 sequence below** —
`context → analyst → developer-react → tech-writer → qa → devil-advocate`,
plus `architect`/`researcher` when their own triggers fire — even for a
one-line, fully-specified fix. This is a deliberate choice over a
tiered/fast-path design: it favors catching everything the Avatar saga missed
over minimizing latency on the common case. **Do not "optimize" this into a
fast path without checking with the user first** — that tradeoff was decided
deliberately and shouldn't be silently reversed by a future editor.

The one agent that is **not** part of the always-on roster is `integrator`
(Step 9) — it only runs with `--pr`, because it's the one step that commits,
pushes, and opens a PR (see Step 9's confirmation note).

---

## How this skill orchestrates

Unlike `/figma-component`/`/legacy-component` (single-session recipes with no
subagent calls anywhere), every step below is executed by spawning the named
agent via the Agent tool (`subagent_type: <name>`) — the orchestrating session
(you) never edits component source, spec files, or docs prose directly. That's
the whole point of the skill: turn each checklist line into an accountable,
executed step instead of an easy-to-skip line in someone's mental checklist.

**No `.ai/` artifact tree.** `ui-kit-pipeline` and `team-lead` persist phase
artifacts under `.ai/team/<name>/<phase>/` — that directory **does not exist**
in this repo (`ui-kit-pipeline/SKILL.md` is itself stale: it references a
nonexistent `component-dev` skill and a nonexistent `.ai/` tree, and is a
standalone entry point nothing else invokes — a separate cleanup from this
skill). This skill does not resurrect that convention for itself. Each step's
findings live in the conversation and get carried forward **verbatim** into
the next agent's
prompt — write self-contained prompts the way the Agent tool's own guidance
requires (file paths, the actual brief, not "see above"), since a spawned
agent has no memory of this conversation.

**Two of the nine roster agents are generic, not repo-aware.** `context`,
`analyst`, and `integrator` (Steps 1, 2, 9) are global agents defined in
`~/.claude/agents/` for a generic "Split Agent Flow" — their own files
reference Jira tickets, a `~/.claude/state/*.json` handoff chain, and (for
`integrator`) an autonomous commit/push/PR flow. Don't rely on that
scaffolding; it's written for a different, ticket-driven workflow. Brief each
one with a self-contained, repo-specific prompt instead (concrete instructions
below per step) and read its **returned text**, not a state file, as the
actual handoff.

**Only you open gates.** An agent reports a finding or a result; it doesn't
decide the pipeline advances. If a step surfaces a blocker (Step 0's hard
stops, a `devil-advocate` BLOCKED, a `qa` `FIX-FIRST`), stop and resolve it —
send back to the owning step — before continuing.

---

## Step 0 — Classify & scope (mechanical, no agent call)

1. **Resolve target component(s)** per the Invocation table above.

2. **New-component check (hard stop).** If the resolved/inferred target does
   **not** exist under `packages/ui-react/src/components/ui/<name>/`, this
   isn't a change to an existing component — it's a first build wearing this
   skill's invocation. Stop and redirect:
   - A "ready for dev" Figma node exists → `/figma-component <Name> <url>`.
   - No Figma node, but a `packages/ui-legacy` counterpart exists →
     `/legacy-component <Name> [legacy-name]`.
   - Neither → tell the user there's no source to build from yet.

3. **Design-relevance boundary (hard stop).** If the request describes a
   new/changed visual variant, a prop that maps 1:1 to a Figma property, or
   any restyle, **stop** and recommend `/figma-component <Name> <url>
--update` (or `/legacy-component --update`) instead. Same rule of thumb
   `pre-push-check` already uses: **if you'd have to open the Figma file to
   explain the change, use `--update`.** This is a classifier reading prose,
   not a structural gate — a terse request ("fix the dialog padding on
   mobile") can look like a plain bug fix and not trip this check. When in
   doubt, ask; don't guess past this boundary.

4. **Pre-existing drift check.** Run the read-only audit before touching
   anything:

   ```bash
   bash .claude/skills/component-readiness/scripts/audit.sh <ComponentName>
   ```

   A `DRIFT` verdict means the change would land on an already-broken
   baseline — fold the fix into this change's scope, or explicitly tell the
   user it's out of scope and being left as-is.

---

## Step 1 — `context` (always on)

Spawn `context` with a self-contained prompt: the raw change request, the
resolved target component's path(s), and what to gather — `git log`/`git
blame` on the target file(s), any Jira ticket the request references (skip
gracefully if none, or if the Jira MCP isn't authorized in this session — see
this session's own notes on MCP auth), and a grep for the same bug pattern
elsewhere in the component or its siblings. Ask for the answer to **why the
current code is shaped the way it is** — not a `~/.claude/state/context.json`
file, its returned text is the handoff. Applied to the Avatar saga above,
this is the step that would have surfaced that `children ?? fallback` was a
deliberate default-label pattern before Step 2 decided how to change it
around the `null` case.

---

## Step 2 — `analyst` (always on)

Spawn `analyst` with Step 1's returned findings plus the raw change request.
Ask explicitly for a **short prose brief** — root cause (for a bug) or the
minimal correct shape (for a feature ask) plus the fix approach — not its own
default JSON solutions-with-effort-estimate template (that template is for
its native ticket-driven flow; override it in the prompt). This brief is what
Step 4 implements against.

**Joins conditionally — `researcher`.** If the brief runs into non-obvious
Base UI / token / primitive behavior (e.g. "does this Base UI primitive even
expose that state"), spawn `researcher` to investigate and report facts/
trade-offs — no recommendation, that stays `analyst`'s call — then fold the
findings back into the brief before moving to Step 3/4.

---

## Step 3 — `architect` (conditional)

**Runs only** when Step 2's brief alters the component's public API/contract:
a new prop, a new variant, part restructuring. Spawn `architect` with the
brief; it decides the API shape and any package-boundary implications before
Step 4 implements it.

**Skip** for a pure internal fix with no API surface change — there's nothing
for `architect` to decide.

---

## Step 4 — `developer-react` (always on)

Spawn `developer-react` with Step 2's brief (and Step 3's API decision, if it
ran), the target component's path, and an explicit instruction to follow its
own `agent.md` rules — `forwardRef`, `cva`/`cn()`, no new hardcoded label, no
new physical-directional utility, localization — and to update
`__tests__/<name>.test.tsx` and `__stories__/<name>.stories.tsx` for the
change. This is the baseline every change already gets today; read back its
list of changed files before Step 5 — you need it to classify the change type.

---

## Step 5 — Propagate through the shipped contract (the point of this skill)

Classify the actual diff against this table (the same decision
`/figma-component` Phase 4 makes, just triggered by a prose diff instead of a
Figma diff) and touch **only** what it implicates — not a blanket
regenerate-everything:

| Change type                      | `api.yaml`                                                                                                                       | `tokens.yaml`/`anatomy.yaml` | Code Connect                | Generated stories          | VR baselines                     | docs MDX                                       | `behavior.md`/`accessibility.md` | changeset                                                                            |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | --------------------------- | -------------------------- | -------------------------------- | ---------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------ |
| Bug fix, no API/visual change    | —                                                                                                                                | —                            | confirm example still valid | —                          | only if rendered output changed  | only if an example demonstrates the fixed path | add/update scenario              | `patch`                                                                              |
| New/changed prop (non-visual)    | update + conformance                                                                                                             | if new token refs            | update mapping/example      | regen (`generate:stories`) | regen if story changed           | update Usage/Examples; confirm `AutoTypeTable` | update if behavior changes       | `minor`                                                                              |
| Refactor, no behavior/API change | —                                                                                                                                | —                            | —                           | —                          | re-run check, no change expected | —                                              | —                                | usually none — confirm against [context/releasing.md](../../../context/releasing.md) |
| a11y / i18n / RTL fix            | —                                                                                                                                | —                            | —                           | —                          | only if visible output changed   | maybe                                          | update `accessibility.md`        | `patch`                                                                              |
| Token rewire / drift fix         | —                                                                                                                                | update refs                  | —                           | —                          | regen if colors visibly changed  | —                                              | —                                | `patch`                                                                              |
| Visual/style change              | 🛑 out of scope — this should have hit Step 0's design-relevance boundary; stop and hand off to `--update` instead of proceeding |                              |                             |                            |                                  |                                                |                                  |                                                                                      |

Reuse existing tooling for the cells that need regeneration — no new scripts:

```bash
pnpm --filter @acronis-platform/ui-spec generate:stories     # regenerated stories
pnpm --filter @acronis-platform/ui-spec test                  # api.yaml/cva conformance
pnpm --filter @acronis-platform/ui-react exec figma:connect   # Code Connect validity
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:update:all  # VR regen (light+dark)
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:all         # VR check (what CI runs)
pnpm changeset                                                 # from repo root
```

The structured contract data (`api.yaml`, `tokens.yaml`, `anatomy.yaml`) is
edited directly (by you or by asking `developer-react` to extend Step 4) —
it's conformance-tested against the actual `cva` keys, closer to
implementation than documentation. The **prose** columns are Step 6's job.

---

## Step 6 — `tech-writer` (when any prose column above is non-`—`)

Prompt `tech-writer` with the concrete, already-true facts — the diff
summary, the new/changed prop signatures, the bug description — and an
explicit instruction to **update prose to match, and flag what it can't
verify, never invent** (its own stated rule). Split by artifact:

- `apps/docs/content/docs/components/<name>.mdx` + the live demo + nav entry —
  explicitly owned per its `agent.md`.
- `packages/ui-spec/components/<name>/{behavior.md,accessibility.md,README.md}`
  — owned per the addition made to its `agent.md`'s "What you own" alongside
  this skill (prose only; the YAML stays with `developer-react`).

If a docs page is **missing** rather than stale, `tech-writer` will notice
there's nothing to update — surface that to the user as a scope decision
("create one now" is new scope beyond propagating this change), don't
silently skip it and don't silently create it either.

---

## Step 7 — `qa` (always on)

Spawn `qa` to run the closing gate — `pre-push-check`'s own script, which
already covers the vitest/typecheck/lint/`ui-spec test` pass, the
`component-readiness` audit, the changeset-presence check, **and** (per its
own current version) a `uikit-docs typecheck` + `uikit-docs build` pass
whenever `apps/docs` changed — so a broken `AutoTypeTable` path or demo
import introduced by Step 6 doesn't slip through:

```bash
bash .claude/skills/pre-push-check/scripts/pre-push-audit.sh
```

`qa` is wide-view here — beyond the script's `RESULT`, it also checks for
regressions elsewhere in the monorepo that the script alone doesn't reason
about (per its own agent.md's wide-view mandate). A `FIX-FIRST` result is a
blocker: send back to the owning step (Step 4 for a source issue, Step 6 for
a docs build failure) before Step 8.

---

## Step 8 — `devil-advocate` (always on)

Adversarial final pass over the **whole** diff — code, spec, docs, VR
baselines. Spawn it with the full list of changed files and Step 7's report;
ask it to hunt specifically for what a passing script can't see: a story that
should demonstrate the fixed behavior but wasn't added, a docs example that's
technically unchanged but now misleading, a VR baseline that regenerated
cleanly but no longer represents the case it's named for. This is the step
that most directly targets the failure mode this skill exists for — Step 7
answers "did the scripts pass," Step 8 answers "did we forget something the
scripts can't see." A BLOCKED verdict sends the specific item back to the
owning step; it does not open the gate itself.

---

## Step 9 — `integrator` (opt-in only, `--pr`)

Runs **only** when the user passed `--pr`. Commits, opens the PR, updates the
linked Jira ticket (if Step 1 found one), writes a delivery report.

**This environment's standing confirmation rule still applies even with
`--pr` passed.** `integrator`'s own `agent.md` defaults to auto-commit +
auto-push + auto-PR once its own confidence heuristic clears 90% — that's
its native behavior for its ticket-driven flow, and it is **not** sufficient
authorization on its own here. `--pr` is the user's consent to _attempt_
integration at the end of a clean pipeline, not blanket consent to skip the
push/PR confirmation this environment otherwise always asks for (pushing code
and opening a PR are both "affects shared state" actions). Show the user what
Step 9 is about to commit/push/open, and get explicit confirmation, before
letting it execute — same as any other push or PR in this environment.

---

## Utilities, not stages

`Explore` and `general-purpose` aren't sequential steps — any step above
(most often `context` or `analyst`) reaches for them ad hoc to locate code or
usages (e.g. "does this bug pattern exist elsewhere too").

## Explicitly excluded from the roster entirely

| Agent               | Why not                                                                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `developer-vue`     | This repo is React-only — root `AGENTS.md`: _"No Vue... any `.vue` reference is stale."_ Categorically inapplicable.                                      |
| `implementer`       | Duplicates Step 4 (`developer-react`), minus its Base UI/CVA/token/ui-react-convention awareness. Running both risks two agents writing conflicting code. |
| `Plan`              | Duplicates Step 3 (`architect`) for this repo, minus token/ui-spec awareness.                                                                             |
| `reviewer`          | Duplicates Step 7 (`qa`) + Step 8 (`devil-advocate`) — already this repo's established review pair.                                                       |
| `claude`            | The generic catch-all; not a role, it's what fires when nothing else applies.                                                                             |
| `claude-code-guide` | Answers questions about Claude Code the CLI tool itself. Unrelated to component source changes.                                                           |
| `statusline-setup`  | Configures the CLI's status line UI. Unrelated.                                                                                                           |

---

## Output checklist (done = all green)

- [ ] Step 0 gate passed: target exists (else redirected to
      `figma-component`/`legacy-component`), not design-relevant (else
      redirected to `--update`), pre-existing drift scoped or flagged.
- [ ] `context` + `analyst` findings/brief captured before any edit; `researcher`
      ran if non-obvious Base UI/token behavior was in question.
- [ ] `architect` ran and produced an API decision, if the change touches the
      public contract; skipped otherwise.
- [ ] Source, `__tests__/`, `__stories__/` updated for the target component(s)
      (Step 4) — no new hardcoded label, no new physical directional utility.
- [ ] Step 5's table walked for the actual change type: every non-`—` cell
      addressed, everything else left untouched.
- [ ] `tech-writer` pass complete wherever a prose column was implicated
      (`apps/docs` MDX/demo/nav, and/or `behavior.md`/`accessibility.md`/
      `README.md`) — updates match the actual diff, or flagged as unverifiable.
- [ ] `pre-push-audit.sh` `RESULT` is clean (or explicitly triaged and
      resolved) — includes the `uikit-docs` build if `apps/docs` changed.
- [ ] `devil-advocate` raised no unresolved blocker.
- [ ] Changeset added per Step 5's bump-type column (or explicitly "none" for
      a pure refactor, per `context/releasing.md`).
- [ ] User told what was inferred (target component, change type) wherever
      Step 0 didn't have an explicit `ComponentName`/unambiguous request.
- [ ] `integrator` ran only if `--pr` was passed, and only after explicit
      confirmation of what it's about to commit/push/open.

---

## Known limitations vs. `figma-component`

No external design oracle, by construction — this skill can only enforce
**internal** consistency (code ↔ spec ↔ tests), never catch the code silently
drifting from the design. The design-relevance boundary (Step 0.3) is
judgment over prose, not a structural gate the way a required Figma URL
argument is. No shared-chrome/context-frame check for overlay components, no
live value-level or visual parity, no authoring a brand-new Code Connect
mapping, no unconditional "create the docs page if missing," no `tokens-pd`
freshness rebuild. None of this is a defect in this skill's scope — it's the
tradeoff of having no Figma node to diff against.

**Possible mitigation for the value/visual parity gap.** `ui-spec`'s
`index.yaml` already records a `figma.node` for every shipped component. Step
0 could optionally look that node up and run `component-readiness`'s deep-mode
parity check (`parity-values.mjs`, advisory, non-blocking) even without the
user supplying a URL — giving partial design-drift detection for free on any
component that already has a recorded node. Not implemented here; would need
its own follow-up if the gap turns out to matter in practice.
