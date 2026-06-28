---
name: grammar-rule
description: >
  Curate a cross-component grammar rule in packages/ui-spec/grammar — usually born
  from a discrepancy-ledger finding whose resolution is "new-rule". Drives the full
  addition: a typed KitRule in grammar/rules/<category>.ts, a 1:1 CHECKLIST.md row,
  a detector (kit-lint static, screen-audit structural, or an honest stub), a test,
  and the ledger cross-link. A human ratifies severity — only a person may set
  `must` (it blocks CI). Invoke with /grammar-rule <ledger-id | description>.
argument-hint: '<ledger-id | short description>'
---

# Skill: /grammar-rule

The curation half of the self-improving loop (Phase 4 of
[`context/kit-consistency-audit-proposal.md`](../../../context/kit-consistency-audit-proposal.md)).
When an audit finding isn't already covered by a rule and isn't an intentional
deviation, it becomes a **new permanent check** so it can never recur. This skill
adds that rule end-to-end and keeps every mirror in sync.

It **proposes**; a human **ratifies severity**. Only a person may set a rule to
`must` (that blocks CI) — default a fresh rule to `should` unless told otherwise.

## Inputs

- A **ledger id** (preferred): an entry in `packages/ui-spec/grammar/ledger/`
  whose `status` is `open` and whose intended `resolution.kind` is `new-rule`; or
- a **short description** of the discrepancy (then also add the ledger entry).

## Steps

1. **Locate the finding.** Read the ledger entry (or capture the description).
   Confirm it's genuinely uncovered: search `grammar/rules/*` — if an existing rule
   already fits, the resolution is `detector`, not a new rule (stop and say so).

2. **Pick category + id + checklist row.** Category is one of `tokens` `spacing`
   `typography` `anatomy` `interaction` `accessibility` `composition` `cross-impl`.
   The rule `id` is `<category>/<kebab>` (the prefix MUST equal the category).
   The `checklist` row id is the next free in that section (e.g. `C9`) — both must
   be unique (enforced by `__tests__/grammar.test.ts`).

3. **Draft the `KitRule`.** Append to `grammar/rules/<category>.ts` with all
   required fields: `id`, `title`, `category`, `severity`, `rule` (imperative,
   1–2 sentences), `rationale`, `checklist`, `detector` (the id of the check that
   enforces it — see step 5), and optional `tokens`/`wcag`/`relatedRules`.
   **Severity:** propose `should`/`may`; flag explicitly if you believe it warrants
   `must` and ask the human to ratify.

4. **Add the CHECKLIST.md row.** A matching `| <row> | … | <detect> | <sev> |`
   row under the right section — `grammar.test.ts` enforces the registry ↔
   CHECKLIST 1:1 mapping.

5. **Add the detector** (or an honest stub). Match the detector id to the kind:
   - `kit-lint/<name>` — a static detector: append to `DETECTORS` in
     `scripts/kit-lint.ts` (AST/string over component source). Add a focused test
     in `__tests__/kit-lint.test.ts` via `lintSource()`.
   - `screen/<name>` — a structural detector: append to `DETECTORS` in
     `screens/audit/detectors.ts` (pure over a `ScreenSnapshot`), declare its
     `scope`, and test it in `__tests__/screen-audit.test.ts`.
   - `ref/<name>` / `ai/<name>` / `spec/<name>` — if no detector can be implemented
     yet, the rule still ships with the intended `detector` id (it's documented as
     not-yet-enforced — no false confidence). Note the deferral.
     **Never relax `must` to make a flaky static check pass.** If a `must` detector
     would fire on real, intentional variation, it needs a ratified canonical and an
     [override](../../../packages/ui-spec/grammar/overrides/README.md) path first —
     keep it deferred and say so.

6. **Close the loop in the ledger.** Set the entry's `resolution` to
   `{ kind: 'new-rule', rule: '<new id>', date }` and `status: 'resolved'`; update
   the `LEDGER.md` row. `__tests__/ledger.test.ts` checks the rule exists.

7. **Verify.** `pnpm --filter @acronis-platform/ui-spec test` (grammar + ledger +
   detector tests) and `pnpm --filter @acronis-platform/ui-spec kit-lint`. Report
   the new rule, its severity, the detector, and what now fires.

## Output

A summary: the new rule id + severity (flagging any `must` for human ratification),
the CHECKLIST row, the detector (implemented or deferred + why), the ledger entry
it closes, and the test/lint result. Open a PR — ui-spec is private (no changeset).
