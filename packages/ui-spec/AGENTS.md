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

**Phase 1 — `kit-lint`** (`scripts/kit-lint.ts`, `pnpm --filter @acronis-platform/ui-spec kit-lint`):
static detectors over shipped ui-react component source for the `kit-lint` checklist
rows (T1 no-hardcoded-color, T2 unbridged-name as `must`; T3 opacity-hack, Z1
off-grid-spacing as `should`). It reads severities from the grammar registry and is
**enforced via `__tests__/kit-lint.test.ts`** (which is part of `test`), so a
`must` finding fails CI. Add a detector by appending to the `DETECTORS` array and
its grammar rule's `detector` id.

## Scripts

`build`/`dev`/`clean` are no-ops (ships source YAML/MD). `lint`/`typecheck` run
eslint/tsc over the `.ts` tooling. `test` (= `validate`) runs the vitest suite.
