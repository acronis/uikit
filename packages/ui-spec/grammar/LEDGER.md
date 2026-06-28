# Discrepancy ledger

The record that makes the kit **ratchet**. Every real consistency finding is
logged here with **how it was resolved** — because a finding is not done when the
pixel is fixed, it's done when a permanent check exists so it can never recur
(proposal §9).

Each row is **mirrored 1:1 by an entry** in [`ledger/`](./ledger/index.ts) (the
TS registry is the source of truth; `__tests__/ledger.test.ts` keeps the two in
sync and validates every entry).

A finding resolves into one of three kinds:

- **detector** — an existing or newly-added detector now guards this class of
  defect (the ratchet).
- **new-rule** — a new `KitRule` was ratified for it (a human owns the `must`
  tier). Use [`/grammar-rule`](../../../.claude/skills/grammar-rule/SKILL.md).
- **override** — it's an intentional deviation, waived by an approved
  [override](./overrides/README.md) (`status: accepted`).

Columns: **Entry** (stable id) · **Discrepancy** · **Where** · **Rule (row)** ·
**Sev** · **Status** · **Resolution**.

| Entry                              | Discrepancy                                                     | Where                          | Rule (row)                               | Sev    | Status   | Resolution                                                               |
| ---------------------------------- | --------------------------------------------------------------- | ------------------------------ | ---------------------------------------- | ------ | -------- | ------------------------------------------------------------------------ |
| app-shell-search-offcenter         | Header search left-aligned / off the header center axis         | protection-dashboard · header  | composition/edge-baseline-alignment (C2) | should | resolved | detector `screen/alignment-grid` now catches near-miss edges             |
| app-shell-collapsed-rail-crops-row | Collapsed rail reserved a scrollbar gutter that cropped the row | protection-dashboard · sidebar | composition/no-clipping (C8)             | should | resolved | fixed by overlay scrollbar (PR #479); `screen/reserved-gutter` guards it |
| scroll-area-hover-active-token     | `hover:` wired to an `-active` border token instead of `-hover` | scroll-area                    | tokens/state-token-wiring (T4)           | should | open     | surfaced by `kit-lint/state-token-wiring`; awaiting fix or override      |

## Adding an entry

Append a typed entry to [`ledger/index.ts`](./ledger/index.ts) and a matching row
here. `validateLedger()` (run by `__tests__/ledger.test.ts`) enforces: unique id,
a resolvable rule/checklist row, valid severity/status/dates, a non-empty source,
and — once `status` is `resolved`/`accepted` — a resolution whose target exists
(a declared detector, a real rule, or an existing override). An `accepted` entry
must point at a real override.
