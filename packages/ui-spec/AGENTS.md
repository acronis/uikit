# AGENTS.md — `packages/ui-spec`

`@acronis-platform/ui-spec` — **framework-agnostic** component specifications for
the Acronis UI Kit. **Private** (not published). This is the **Phase 0 spike** of
the proposal in
[`context/component-specs-proposal.md`](./context/component-specs-proposal.md):
prove the spec format and its conformance check on three existing components
(`button`, `button-icon`, `switch`) before scaling.

Repo-wide rules live in the repo root `./context/`. This file documents only
what's specific to this workspace.

## What a spec is

A spec describes **what a component is** — contract, anatomy, states, behavior,
accessibility, and the tokens it consumes — independent of any framework. React
is the only implementation today; the contract is written so a future Vue or Web
Component implementation can target the same definition.

## The 7-file format

One directory per component under `components/<name>/`:

| File               | Format | Purpose                                                               |
| ------------------ | ------ | --------------------------------------------------------------------- |
| `index.yaml`       | YAML   | Identity: component name, status, category, dependencies, Figma link  |
| `anatomy.yaml`     | YAML   | Root element/role, named parts, visual states + triggers              |
| `api.yaml`         | YAML   | Framework-agnostic contract (props/events/content/methods) + adapters |
| `tokens.yaml`      | YAML   | **References** to the `--ui-*` tokens consumed — see below            |
| `behavior.md`      | MD     | Given/When/Then behavior scenarios (incl. cross-component)            |
| `accessibility.md` | MD     | ARIA, keyboard map, focus, contrast                                   |
| `README.md`        | MD     | When to use / not use, quick examples                                 |

YAML for structured/queryable data, Markdown for prose. The four YAML files are
validated against JSON Schemas in `schema/`.

## Tokens by reference — never duplicate values

`tokens.yaml` lists **only token names** (`--ui-button-primary-background-idle`),
the part each affects, and a description. **It must not restate values** — those
live in `@acronis-platform/tokens-pd` (generated from `@acronis-platform/design-tokens`).
The token-schema forbids a `value`/`default` key to enforce this. This is the
single-source-of-truth rule that keeps specs from drifting from the design data.

## Validation + conformance (this is the point)

`pnpm --filter @acronis-platform/ui-spec test` runs `__tests__/specs.test.ts`:

1. **Schema validation** — every YAML file validates against its `schema/*.json`.
2. **Conformance** — for components built with `cva`, the spec's `api.yaml`
   `variant`/`size` enums must match the actual `cva` keys in the
   `@acronis-platform/ui-react` source (parsed via the TypeScript AST in
   `lib/cva.ts`). This is what stops the spec from rotting into stale docs.

When you add or change a component spec, run `test`. When you change a
component's variants in `ui-react`, update its `api.yaml` or the conformance
test fails.

## Usage patterns

`patterns/<name>/pattern.yaml` defines **approved multi-component compositions**
(recipes) — bigger than one component (e.g. `filter-popover`). They are the
agent-facing source of truth for "how to combine components" and are rendered
for humans in the docs site's **Patterns** section. Validated by
`__tests__/patterns.test.ts` against `schema/pattern.schema.json`, which also
checks every referenced `components[]` entry exists in `@acronis-platform/ui-react`.
See [`patterns/README.md`](./patterns/README.md).

## Grammar (cross-component rules)

`grammar/` is the machine-readable registry of **cross-component invariants** —
"the same thing is always the same across components" (no hard-coded color, one
token per semantic role, one focus-ring treatment, controls in a row share
height, …). It sits above `components/` (one component) and `patterns/` (specific
recipes). Each rule (`grammar/rules/*.ts`, typed `KitRule`) has a `severity`
(`must`/`should`/`may`), a `detector` (the check that enforces it — built across
the rollout phases), and a back-link to its `grammar/CHECKLIST.md` row.
`__tests__/grammar.test.ts` enforces registry integrity and keeps the registry
and the checklist in sync. This is **Phase 0** of
[`context/kit-consistency-audit-proposal.md`](../../context/kit-consistency-audit-proposal.md);
screen specs and the rendered audit follow. See [`grammar/README.md`](./grammar/README.md).

**Overrides** (`grammar/overrides/`, Phase 4): approved, scoped, dated waivers for
_intentional_ deviations — the third resolution for a finding (fix / new rule /
override). A `KitOverride` names the `rule` it waives, a `scope` (component / screen
/ region / file / ref), a `reason`, `approvedBy`, `date`, and optional `expires`.
Both `kit-lint` and the screen audit pass findings through `applyOverrides`, so an
approved waiver is removed from what gates CI yet stays auditable (the CLIs print an
`N suppressed by approved override(s)` line). The registry ships **empty**; only a
human adds an entry. `validateOverrides()` (run by `__tests__/overrides.test.ts`)
keeps entries well-formed. This unblocks the deferred `must` detectors — a rule can
block CI broadly while genuine exceptions carry a scoped waiver. See
[`grammar/overrides/README.md`](./grammar/overrides/README.md).

**Phase 1 — `kit-lint`** (`scripts/kit-lint.ts`, `pnpm --filter @acronis-platform/ui-spec kit-lint`):
static detectors over shipped ui-react component source for the `kit-lint` checklist
rows. `must`: T1 no-hardcoded-color, T2 unbridged-name. `should`: T3 opacity-hack,
T4 state-token-wiring, Z1 off-grid-spacing, Y1 type-scale, Y2 line-height, Y3
font-weight. `may`: I3 timing-parity. It reads severities from the grammar registry
and is **enforced via `__tests__/kit-lint.test.ts`** (part of `test`), so a `must`
finding fails CI; that test also exercises each detector over synthetic source via
the exported `lintSource()`. Add a detector by appending to the `DETECTORS` array
and pointing its grammar rule's `detector` id at it. Three static rows stay
deferred: A1 focus-ring and C5 z-index (`must`) — a static "parity"/"layer-scale"
detector would block CI on real, possibly-intentional variation, so they need a
ratified canonical (and the overrides/ledger) first; Z5 touch-target (`must`) is
not reliably detectable from source. A3 border-border is held pending a focused
audit of the ~80 bare-`border` usages.

## Screens (application layer)

`screens/<slug>/screen.yaml` describes a real **product screen** assembled from
real ui-react components — the layer above `components/`/`patterns/`/`grammar/`,
and the input to the future rendered screen audit. Each descriptor has `regions[]`
(layout + `components[]` with `$bind`/`$token` props + governing grammar `rules`),
a `stateMachine`, and a `figma` node. Validated by `__tests__/screens.test.ts`
against `schema/screen.schema.json`: schema, component refs resolve in ui-react,
grammar-rule refs resolve, the `pattern` slug exists, and the state machine has
one initial + all-reachable states. First example: `screens/protection-dashboard`
(the App Shell with-secondary screen, captured via its `story` id). **Phase 2** of
the kit-consistency proposal. See [`screens/README.md`](./screens/README.md).

**Phase 3 — the rendered screen audit** (`screens/audit/`,
`pnpm --filter @acronis-platform/ui-spec screen-audit <slug> <snapshot.json>`):
measure a real assembled screen, then run cross-component **structural detectors**
keyed to the grammar's `screen/*` rules. Like `kit-lint`, measurement is split
from detection: `screens/audit/probe.ts`'s `collectScreenSnapshot` runs in the
browser (via the VR `page.evaluate` or the MCP `evaluate_script`) and returns a
serializable `ScreenSnapshot`; `screens/audit/detectors.ts` are **pure** functions
over that snapshot + descriptor, unit-tested in `__tests__/screen-audit.test.ts`
without a browser. Findings map 1:1 to a `KitRule` (severity + checklist from the
registry); `must` fails CI. Implemented: control-height-parity (Z2), accessible-name
(I1), contrast (I5) — `must`; edge-baseline-alignment (C2), no-clipping (C8),
icon-size-parity (Z6), radius-parity (Z3), vertical-rhythm (C1), disabled-parity
(A2), tab-order (I4) — `should`. Region detectors run only on regions whose
`rules[]` opt in; screen detectors (accessible-name, contrast, disabled-parity)
run screen-wide. Four `screen/*` rules stay deferred (one-token-per-role T5,
overlay-dismiss I2, padding-tier Z4, shared-grid C3) — they need a role taxonomy,
an interactive capture, or a column-grid model a single static snapshot lacks; see
`screens/audit/README.md`. Capture is driven by the
[`/screen-audit`](../../.claude/skills/screen-audit/SKILL.md) skill.
The AI visual-review pass, reference diffs, and the ledger are Phase 4. See
[`screens/audit/README.md`](./screens/audit/README.md).

## Scripts

`build`/`dev`/`clean` are no-ops (ships source YAML/MD). `lint`/`typecheck` run
eslint/tsc over the `.ts` tooling. `test` (= `validate`) runs the vitest suite.
