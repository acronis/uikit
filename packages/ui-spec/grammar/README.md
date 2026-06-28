# `grammar` — cross-component rules

The kit's **grammar**: machine-readable cross-component invariants — the rules
that keep "the same thing always the same" across every component. This is the
layer above individual component specs (`../components/*`, _what one component
is_) and approved compositions (`../patterns/*`, _specific recipes_). Grammar
rules are universal: "no component hard-codes a color", "every focus ring is the
same", "one token per semantic role", "controls in a row share height".

Design and rationale: [`context/kit-consistency-audit-proposal.md`](../../../context/kit-consistency-audit-proposal.md).

## Layout

```
grammar/
├── types.ts            # KitRule, RuleCategory, RuleSeverity
├── rules/              # one file per category + index (registry + lookups)
├── overrides/          # approved, scoped, dated rule deviations (see README)
├── CHECKLIST.md        # human mirror of the registry (1:1 by row id)
└── index.ts            # public surface
```

The test (`../__tests__/grammar.test.ts`) enforces registry integrity and that
the registry and `CHECKLIST.md` stay in sync;
`../__tests__/overrides.test.ts` validates the [overrides](./overrides/README.md)
registry.

## Overrides

[`overrides/`](./overrides/README.md) is how an _intentional_ deviation stays
legal: an approved, scoped, dated entry that the audits treat as a pass instead of
a defect (the third resolution for a finding — fix / new rule / **override**).
Both `kit-lint` and the screen audit run findings through `applyOverrides`, so an
approved waiver removes a finding from what gates CI while keeping it auditable.
The registry ships empty until a human ratifies one.

## Usage

```ts
import {
  allRules,
  getRule,
  getRulesByCategory,
  getMandatoryRules,
} from '../grammar';

getRule('tokens/no-hardcoded-color');
getRulesByCategory('composition');
getMandatoryRules(); // the `must` rules — intended to block CI
```

## Severity

- `must` — a defect; intended to fail CI. **Only a human may set `must`.**
- `should` — a strong recommendation; warns.
- `may` — guidance.

## How it grows (self-improving loop)

This registry is **seeded** (Phase 0), then grows from real findings: when an
audit (`kit-lint` or the rendered screen audit) surfaces a new class of
inconsistency, it becomes a new rule here + a `CHECKLIST.md` row + a detector, so
it can never recur. AI proposes rules and severities; a human ratifies the `must`
tier. See the proposal for the full loop and the planned `detector` ids.
