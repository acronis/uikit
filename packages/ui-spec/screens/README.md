# `screens` — product screen descriptors

The **application layer**: machine-readable descriptions of real product screens,
assembled from real `@acronis-platform/ui-react` components. This is the layer
above `components/` (one component), `patterns/` (a recipe), and `grammar/`
(cross-component rules). A screen descriptor is the "screen spec" that the
rendered **screen consistency audit** ([`audit/`](./audit/README.md), Phase 3)
consumes.

Design and rationale: [`context/kit-consistency-audit-proposal.md`](../../../context/kit-consistency-audit-proposal.md).

## Layout

```
screens/<slug>/screen.yaml     # one ScreenDescriptor per directory
```

Validated by `../__tests__/screens.test.ts` against `../schema/screen.schema.json`.

## A `screen.yaml` contains

- **identity** — `name` (= folder slug), `title`, `status`, optional `route`,
  `permissions`, `figma` ({ file, node }), a `pattern` slug it assembles, and a
  `story` id (the assembled-screen Storybook story the audit captures).
- **`regions[]`** — the spatial layout. Each region has a `layout`
  (`fixed-width`/`flex-fill`/`overlay`/`sticky`/`dock-bottom` + position/scroll),
  the real **`components[]`** it holds (root ui-react names, with `props` whose
  values may be literals, `{ $bind: '<path>' }`, or `{ $token: '--ui-*' }`),
  optional `rules` (grammar rule ids that govern the region), and nested
  `children`.
- **`stateMachine`** — `states` (each `idle`/`loading`/`loaded`/`empty`/`error`/
  `custom`, exactly one `initial`) + `transitions` (`from`/`to`/`trigger`/`guard`).

## What the test enforces

- Schema validity; `name` equals the folder.
- Every referenced **component** resolves to a real ui-react component directory.
- Every referenced **grammar rule** id resolves in the registry.
- The **pattern** slug (if set) exists under `../patterns/`.
- The **state machine** has exactly one initial state, transitions reference real
  states, and every non-initial state is reachable from the initial one.

## The audit

[`audit/`](./audit/README.md) renders a descriptor's `story` and runs structural
detectors (control-height parity, accessible name, contrast, edge alignment,
reserved-gutter clipping, icon-size parity, vertical rhythm) over the measured DOM
— keyed to the grammar's `screen/*` rules, `must` blocks CI. Driven by the
[`/screen-audit`](../../../.claude/skills/screen-audit/SKILL.md) skill +
`pnpm --filter @acronis-platform/ui-spec screen-audit <slug> <snapshot.json>`.

## Next

A `ProductDescriptor` (screens + navigation `flows` + entry screen — the "app
description"), the AI visual-review pass, reference-implementation diffing, and the
discrepancy ledger follow in Phase 4.
