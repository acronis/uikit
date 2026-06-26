---
name: component-readiness
description: >
  Read-only pre-flight gate that audits ui-react components for token drift and
  spec/test completeness BEFORE running /figma-component. Per component it checks
  that every --ui-* reference resolves in tokens-pd, that each referenced token
  tier is imported in styles/index.css, that the ui-spec 7-file set is present and
  conformance passes, that tests exist, and that the Figma link is intact
  (index.yaml node + a COMPLETE Code Connect). A deep mode adds Figma design
  parity: structural (variants/states), value-level (each design variable's value
  == the referenced --ui-* token's resolved value), and an advisory screenshot
  pixel-diff — via the Figma MCP + bundled scripts. Reports a
  READY / DRIFT / INCOMPLETE matrix; never edits files. Invoke with
  /component-readiness [ComponentName | all].
argument-hint: '[ComponentName | all]'
---

# Skill: /component-readiness

A **read-only gate**. Run it **before** [`/figma-component`](../figma-component/SKILL.md)
(especially before an `--update`) to learn, per component, whether it is safe to
build on or is silently drifted. It produces a status matrix and a verdict — it
**does not edit anything**. Fixes are done by `/figma-component` or by the agent
afterward.

Why this exists: a `var(--ui-does-not-exist)` reference is a **silent** failure —
it makes the CSS property invalid and the element falls back to inherited values;
nothing fails the build, typecheck, lint, or `ui-spec test`. A token-sync (e.g.
`/figma-to-design-tokens`) can rename or remove tokens out from under a shipped
component, and the conformance test only regexes token **names**, never checks
they **exist** in `tokens-pd` (the gap tracked in issue #297). This gate closes
that gap.

Read the workspace contracts first — they override anything here on conflict:

- [packages/ui-react/AGENTS.md](../../../packages/ui-react/AGENTS.md) +
  [context/conventions.md](../../../packages/ui-react/context/conventions.md)
- [packages/ui-spec/AGENTS.md](../../../packages/ui-spec/AGENTS.md)

This skill is the per-component pre-build gate. The token-resolution discipline
mirrors `/figma-component` Phase 2.

---

## Invocation

```
/component-readiness [ComponentName | all]
```

| Arg             | Meaning                                                                    |
| --------------- | -------------------------------------------------------------------------- |
| `ComponentName` | One component — PascalCase (`InputTextArea`) or kebab (`input-text-area`). |
| `all`           | Every component under `packages/ui-react/src/components/ui/` (default).    |

---

## What it checks (per component)

| Column      | Check                                                                                                                                                                                                                                                                                                       | Blocking?                      |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| **TOKENS**  | Every `--ui-*` referenced in the component's code (`.tsx`/`.ts`: `var(--ui-*)` bindings, test/story class assertions) **and** in its `ui-spec` YAML (`tokens.yaml`, `anatomy.yaml`) resolves to a token defined in `packages/tokens-pd/css/**`.                                                             | **Yes** → DRIFT                |
| **IMPORTS** | Every component **tier** whose tokens it references (e.g. `--ui-radio-*` → `Radio`) is `@import`-ed in `packages/ui-react/src/styles/index.css`. Component tiers are **opt-in**; a missing import means the tokens are undefined at runtime even though they exist in `tokens-pd`.                          | **Yes** → DRIFT                |
| **SPEC**    | The `ui-spec` 7-file set is present (`index.yaml`, `anatomy.yaml`, `api.yaml`, `tokens.yaml`, `behavior.md`, `accessibility.md`, `README.md`).                                                                                                                                                              | No → INCOMPLETE                |
| **TESTS**   | `__tests__/<name>.test.tsx` exists.                                                                                                                                                                                                                                                                         | No → INCOMPLETE                |
| **FIGMA**   | **Linkage parity:** `index.yaml` has a `figma.node` **and** a `<name>.figma.tsx` marked `COMPLETE` whose `figma.codeConnect` path resolves. Values: `LINKED` / `DRAFT` (Code Connect unfinished) / `PARTIAL` (one side missing/broken) / `NONE`. The script surfaces both node IDs for the live diff below. | No → INCOMPLETE (NONE/PARTIAL) |

> **Node IDs are not equality-checked.** The spec's `figma.node` is often the
> component-**set** frame while Code Connect targets a specific **variant** node
> (e.g. Button: spec `1173-2789`, Code Connect `2236-5696`) — both are correct.

**Non-blocking advisory:** stale `--ui-*` token names mentioned in spec **prose**
(`behavior.md` etc.) that no longer resolve are reported but do **not** fail the
gate (prose is documentation, not a live binding) — clean them during an update.

---

## Run it

**1. Static pass (fast, no build)** — the bundled script does the token / import /
spec-files / tests / Code-Connect checks and prints the matrix:

```bash
bash .claude/skills/component-readiness/scripts/audit.sh all          # or a single component
bash .claude/skills/component-readiness/scripts/audit.sh InputTextArea
```

**2. Dynamic checks (run for the target component, or repo-wide before a release).**
The static pass confirms files _exist_; these confirm they _pass_:

```bash
pnpm --filter @acronis-platform/ui-react exec vitest run src/components/ui/<name>   # unit tests
pnpm --filter @acronis-platform/ui-react typecheck
pnpm --filter @acronis-platform/ui-react lint
pnpm --filter @acronis-platform/ui-spec test            # schema + cva conformance (all specs)
pnpm --filter @acronis-platform/ui-react exec figma:connect   # Code Connect validity (optional)
```

---

## Figma design parity (live — agent step)

The static `FIGMA` column only proves the **link exists**. True conformity — that
the implemented variants, states, geometry, and tokens still match the design —
requires reading the node. The script prints the node IDs to diff; the agent then
compares against the design via the Figma MCP (same tools as `/figma-component`
Phase 1):

```
get_context_for_code_connect({ nodeId, fileKey })   # exact variant / prop names + options
get_variable_defs({ nodeId, fileKey })              # the --ui-* / design vars the node uses
get_design_context({ nodeId, fileKey })             # states + part structure (+ screenshot)
```

`fileKey` is in the `.figma.tsx` connect URL (`figma.com/design/:fileKey/…`); use
the **Code Connect** node ID (the specific variant) for `get_context_for_code_connect`.

Diff the design against the implementation and report mismatches (do not fix here):

- **Variants / sizes** — every Figma variant option maps to a `cva` key + an
  `api.yaml` enum value, and vice-versa (no design variant missing in code, no code
  variant absent from the design). This is the parity the `cva`↔`api.yaml`
  conformance test can't see across the Figma boundary.
- **States** — interaction states (`hover`/`active`/`focus`/`disabled`) and
  structural distinctions (e.g. "current page") are represented per
  `anatomy.yaml` (states vs. parts).
- **Tokens** — each design variable the node uses (`component/<x>/<y>`) has a
  matching `--ui-<x>-<y>` token the component references — no design token left
  unwired, no hardcoded value substituted.
- **Code Connect** — `figma.enum(...)` property names equal the design's exact
  property names (run `figma:connect` to validate).

### Value-level parity — `scripts/parity-values.mjs`

Confirms each design variable's **value** equals the resolved value of the
`--ui-*` token the component references (not just that a token is wired). Save the
MCP output and run the (dependency-free) comparator:

```bash
# 1. agent: dump the node's design variables to JSON (node must be selected in Figma desktop)
#    get_variable_defs({ nodeId, fileKey })  →  save as figma-vars.json
# 2. compare against tokens-pd resolved values:
node .claude/skills/component-readiness/scripts/parity-values.mjs <Component> figma-vars.json [--theme light|dark] [--brand acronis]
```

It maps each Figma variable name → `--ui-*` token (Option-A kebab), then reports
`MATCH` / `VALUE-DIFF` (name-paired, **exit 1**) and `MISSING` (a design value no
referenced token carries — advisory, may be out of the component's scope). Colors
are compared alpha-aware (`#191B23E5` ≡ `rgb(25 27 35 / 0.898)`); dimensions by
number (`12` ≡ `12px`).

### Visual parity — `scripts/parity-image.mjs` (advisory)

Pixel-diffs a Figma node screenshot against a Storybook render and writes a
highlighted diff PNG:

```bash
# 1. agent: capture the node image via the Figma MCP (get_screenshot / get_design_context) → figma.png
# 2. storybook render: a committed VR baseline works, or a fresh Playwright capture
node .claude/skills/component-readiness/scripts/parity-image.mjs figma.png \
  packages/ui-react/test/__snapshots__/ui-<name>--default.png --out parity-diff.png
```

Reuses `pixelmatch` + `pngjs` from the pnpm store (no new deps); resizes the
Storybook image to the Figma dims before diffing. **Advisory only** — the two
aren't pixel-aligned (framing/scale differ), so the % is a delta signal; read the
diff PNG. Crop the Storybook capture to just the component for the cleanest result.

> **Selection-bound caveat (same as `/figma-component` Phase 1):** the Figma MCP
> in this setup rejects reads with "nothing selected" even given a valid
> `nodeId`/`fileKey`. Ask the user to open the node URL in the Figma **desktop**
> app and click the layer, then retry. If Figma is unavailable, report `FIGMA`
> linkage status from the static pass and note the live diff was skipped.

---

## Verdict → gate decision

| Verdict        | Meaning                                                                           | Action before `/figma-component`                                                                                                               |
| -------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **READY**      | No token drift; spec + tests present.                                             | Proceed.                                                                                                                                       |
| **DRIFT**      | A `--ui-*` ref doesn't resolve, or a tier isn't imported. **Will render broken.** | **Fix first.** Rewire dead token names to the current `tokens-pd` tier; add the missing `@import` to `styles/index.css`. Then re-run the gate. |
| **INCOMPLETE** | Renders fine, but the spec or tests are missing.                                  | Safe to build; close the gap in the same change (`/figma-component` Phases 3–4 produce these).                                                 |

For a **`--update`** run of `/figma-component`, a `READY` verdict on the target
component means you're refreshing a sound baseline; a `DRIFT` verdict means the
update must include the rewire, not just the design refresh.

---

## Discipline

- **Read-only.** This skill never edits files. If it finds DRIFT, hand the fix to
  `/figma-component` or apply it directly — then re-run the gate to confirm green.
- **Resolution is union-of-brands.** A token counts as defined if any brand CSS in
  `tokens-pd/css/**` defines it (`acronis` is primary). Per-brand gaps are out of
  scope here.
- **Dynamic prefixes are ignored.** Refs built by string concat
  (`var(--ui-button-${variant}-…)`) end in `-` and are skipped — the script can't
  resolve a runtime-constructed name, and they aren't literal danglers.
