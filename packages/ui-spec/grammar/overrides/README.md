# `grammar/overrides` — approved rule deviations

An **override** is how an _intentional_ deviation from a grammar rule stays legal.
Instead of a defect, the audits (`kit-lint`, the screen audit) treat a matching
finding as a **pass** — and record that it was waived, never silently dropped.

This is the third resolution for an audit finding (proposal §9): fix it, write a
new rule for it, or — when the deviation is intended — **override** it. It is also
what unblocks shipping the deferred `must` detectors: a rule can block CI broadly
while genuine exceptions carry a scoped, dated, human-approved waiver.

## Shape

```ts
interface KitOverride {
  id: string; // unique kebab slug
  rule: string; // grammar rule id it waives (must resolve)
  scope: {
    // at least one selector required
    component?: string; // ui-react component (dir or PascalCase)
    screen?: string; // screen slug
    region?: string; // region id within a screen
    file?: string; // repo-relative path / fragment (kit-lint findings)
    ref?: string; // node locator (screen-audit findings)
  };
  reason: string; // why the deviation is intentional
  approvedBy: string; // the human who approved it
  date: string; // YYYY-MM-DD approved
  expires?: string; // optional YYYY-MM-DD; after this it no longer applies
}
```

A finding is suppressed when an override has the **same rule** and **every
specified scope selector matches** the finding's location (and the override is not
expired). An empty scope never matches.

## Adding one (a human owns this)

The registry in [`index.ts`](./index.ts) ships **empty** — there are no approved
deviations yet. To add one, append a typed entry with a real `reason` and your
name in `approvedBy`. `validateOverrides()` (run by `__tests__/overrides.test.ts`,
part of `test`) enforces a resolvable rule, a non-empty scope, a reason, an
approver, and well-formed dates — so a malformed waiver fails CI.

```ts
export const overrides: KitOverride[] = [
  {
    id: 'compact-device-table',
    rule: 'spacing/control-height-parity',
    scope: { screen: 'devices', region: 'table' },
    reason:
      'The device table is intentionally compact per the approved design.',
    approvedBy: 'Jane Doe',
    date: '2026-06-28',
  },
];
```

## API

- `validateOverrides(list?, ruleExists?)` → `string[]` of errors (empty = valid).
- `matchesOverride(o, target, today?)` → does this override cover that finding?
- `isOverridden(target, { overrides?, today? })` → boolean.
- `applyOverrides(findings, toTarget, { overrides?, today? })` →
  `{ active, suppressed }`. Both `kit-lint` and the screen audit run their findings
  through this; the CLIs print active findings and an `N suppressed by approved
override(s)` line, and gate CI on the **active** `must` findings only.
