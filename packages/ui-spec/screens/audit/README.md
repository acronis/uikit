# `screens/audit` — rendered screen consistency audit

The **complete-screen audit** (Phase 3 of
[`context/kit-consistency-audit-proposal.md`](../../../../context/kit-consistency-audit-proposal.md)):
render a real assembled screen from its `../<slug>/screen.yaml` descriptor and run
cross-component **structural detectors** over it, keyed to the grammar's
`screen/*` rules. Where `kit-lint` reads source statically, this measures the
rendered DOM — the questions only a real screen can answer.

## The split: measurement vs detection

```
audit/
├── types.ts       # ScreenSnapshot / SnapshotNode / ScreenFinding (the seam)
├── probe.ts       # collectScreenSnapshot() — runs IN the browser, returns a snapshot
├── detectors.ts   # pure detectors, one per screen/* rule (snapshot in, findings out)
└── index.ts       # runScreenAudit() + formatScreenReport()
```

1. **Measure** — `probe.ts`'s `collectScreenSnapshot` runs inside the page (via
   `page.evaluate` in the VR test-runner, or the chrome-devtools MCP
   `evaluate_script` against a running Storybook). It walks the DOM and emits a
   serializable `ScreenSnapshot` — geometry, computed color/background/radius/font,
   accessible name, and net scrollbar gutters — with **no DOM handles**.
2. **Detect** — `detectors.ts` runs over that snapshot + the descriptor. Pure
   data-in/data-out, so it is unit-tested in Node without a browser
   (`../../__tests__/screen-audit.test.ts`). Findings are keyed by grammar rule id;
   the rule supplies severity + checklist row (defined once in the registry).

This is the same shape as `kit-lint`: a finding maps 1:1 to a `KitRule`, and
`must` findings fail CI.

## Detectors implemented

| Rule id                               | Checklist | Severity | Scope  |
| ------------------------------------- | --------- | -------- | ------ |
| `spacing/control-height-parity`       | Z2        | must     | region |
| `accessibility/accessible-name`       | I1        | must     | screen |
| `accessibility/contrast`              | I5        | must     | screen |
| `composition/edge-baseline-alignment` | C2        | should   | region |
| `composition/no-clipping`             | C8        | should   | region |
| `spacing/icon-size-parity`            | Z6        | should   | region |
| `spacing/radius-parity`               | Z3        | should   | region |
| `composition/vertical-rhythm`         | C1        | should   | region |
| `anatomy/disabled-parity`             | A2        | should   | screen |
| `accessibility/tab-order`             | I4        | should   | region |

**Region** detectors run only on descriptor regions whose `rules[]` opt into the
detector's rule (nodes matched to the region by landmark role ↔ `ariaRole`).
**Screen** detectors run over every node. A `screen/*` rule with no detector here
is simply not enforced yet — add one by appending to `DETECTORS` and pointing the
rule's `detector` field at it.

### Deferred `screen/*` detectors (need a capability a single snapshot lacks)

| Rule id                         | Checklist | Why it is not a snapshot detector                                                     |
| ------------------------------- | --------- | ------------------------------------------------------------------------------------- |
| `tokens/one-token-per-role`     | T5 (must) | needs a semantic-role taxonomy per node; better as a static role→token map + ref diff |
| `accessibility/overlay-dismiss` | I2 (must) | needs an interactive before/after-Escape capture; the probe is one static snapshot    |
| `spacing/padding-tier`          | Z4        | "same role/size → same padding"; without a role model it is pure noise                |
| `composition/shared-grid`       | C3        | overlaps `edge-baseline-alignment` (C2); needs a column-grid model to add signal      |

## Running

Capture is driven by the [`/screen-audit`](../../../../.claude/skills/screen-audit/SKILL.md)
skill (navigate the story → inject the probe → write a snapshot JSON), then:

```bash
pnpm --filter @acronis-platform/ui-spec screen-audit <screen-slug> <snapshot.json>
```

The CLI prints findings grouped by severity and exits non-zero on any `must`.

## Not here yet (Phase 4)

The judgment-only rows (`ai/*`: single-solution, density, label-casing) via an AI
visual reviewer, reference-implementation diffing (`ref/*`), and the discrepancy
ledger.
