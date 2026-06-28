---
name: screen-audit
description: >
  Render a real product screen from its ui-spec descriptor and run the
  cross-component structural detectors over it — the "complete-screen
  consistency audit". For each screen it loads screens/<slug>/screen.yaml,
  opens the assembled-screen Storybook story (the descriptor's `story` id) in
  light AND dark, captures a serializable snapshot with the screens/audit probe
  (geometry, computed style, a11y, scrollbar gutters), then runs the pure
  detectors via `pnpm --filter @acronis-platform/ui-spec screen-audit` — keyed to
  the grammar's screen/* rules (control-height parity, accessible name, contrast,
  edge alignment, reserved-gutter clipping, icon-size parity, vertical rhythm),
  with `must` failing. Detectors first; an optional AI visual review covers the
  judgment-only rows. Reports findings keyed by checklist id + severity; proposes
  (never auto-applies) fixes + new grammar rules. Invoke with /screen-audit [screen-slug | all].
argument-hint: '[screen-slug | all]'
---

# Skill: /screen-audit

The rendered-screen half of the kit-consistency system (Phase 3 of
[`context/kit-consistency-audit-proposal.md`](../../../context/kit-consistency-audit-proposal.md)).
Where [`/kit-consistency`](../../../packages/ui-spec/scripts/kit-lint.ts) reads
**source** statically, `/screen-audit` measures a **real assembled screen** and
asks the questions only the rendered DOM can answer: do controls in a row share a
height, do edges actually align, does a scrollbar gutter crop a full-bleed row,
does text clear the contrast minimum.

It **proposes**, it does not silently change anything. Findings are reported;
`must` findings are CI-blocking defects; fixes and any new grammar rules are
drafted for a human to ratify.

## What it is built on

- **Descriptors** — `packages/ui-spec/screens/<slug>/screen.yaml`: regions (each
  opting into grammar `rules`), the components per region, a state machine, and a
  `story` id (the assembled-screen Storybook story to capture).
- **The engine** — `packages/ui-spec/screens/audit/`:
  - `probe.ts` — `collectScreenSnapshot(opts)`, a self-contained browser function
    (runs via `page.evaluate` / MCP `evaluate_script`) that returns a
    `ScreenSnapshot` (no DOM handles).
  - `detectors.ts` — pure detectors, one per `screen/*` grammar rule.
  - `index.ts` — `runScreenAudit(snapshot, descriptor)` + `formatScreenReport`.
- **The CLI** — `pnpm --filter @acronis-platform/ui-spec screen-audit <slug> <snapshot.json>`
  (the Node half: detect + report + exit non-zero on `must`).

The split is deliberate: **measurement** happens in the browser, **detection** is
pure data-in/data-out (unit-tested in `__tests__/screen-audit.test.ts`). This
skill is the glue that captures the snapshot and feeds it to the CLI.

## Detectors implemented today

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

A region-scoped detector runs only on regions whose `rules[]` opt into it;
screen-scoped detectors run over every node. A `screen/*` rule with no detector
here is simply not enforced yet (no false confidence) — add one by appending to
`DETECTORS` and pointing the rule's `detector` field at it. Four screen rules
remain deferred because a single static snapshot can't judge them
(`tokens/one-token-per-role`, `accessibility/overlay-dismiss`,
`spacing/padding-tier`, `composition/shared-grid`) — see
[`screens/audit/README.md`](../../../packages/ui-spec/screens/audit/README.md).

## Steps

1. **Resolve the target(s).** `all` → every `screens/*/screen.yaml`; otherwise the
   named slug. Read each descriptor; note its `story` id. If a descriptor has no
   `story`, report it as **un-capturable** and skip (it needs an assembled-screen
   story first).

2. **Serve Storybook.** Use a running instance if one is up, else start it with
   `pnpm --filter @acronis-platform/ui-react storybook` (dev, port 6007), or build
   then serve `storybook:build`. The story renders in isolation at
   `http://localhost:6007/iframe.html?id=<story>&viewMode=story`.

3. **Capture a snapshot per color mode.** For each of `light` and `dark`:
   - Navigate to the iframe URL (chrome-devtools MCP `navigate_page`, or
     Playwright). Set the theme the way the VR harness does:
     ```js
     document.documentElement.dataset.theme = mode;
     document.documentElement.style.colorScheme = mode;
     ```
   - Wait for fonts/network idle.
   - Inject the probe and capture: read `screens/audit/probe.ts`, strip the type
     annotations, and `evaluate_script` calling
     `collectScreenSnapshot({ screen: '<slug>', story: '<story>', colorMode: '<mode>', rootSelector: '#storybook-root' })`.
   - Write the returned JSON to a temp file, e.g.
     `packages/ui-react/test/screen-audit/<slug>.<mode>.snapshot.json` (gitignored).

4. **Run the detectors.** For each snapshot:
   `pnpm --filter @acronis-platform/ui-spec screen-audit <slug> <snapshot.json>`.
   Collect the report; the command exits non-zero if any `must` finding is present.

5. **(Optional) AI visual review — second pass.** Screenshot the story and, with
   the screenshot + the descriptor + the grammar rules, judge the rows the
   structural detectors cannot measure (`composition/single-solution-per-job`
   C6, `composition/density-parity` C7, `typography/label-casing` Y4,
   `anatomy/empty-skeleton-parity` A6, `composition/variant-parity` C4 across
   screens). Report these as **advisory** findings — never auto-apply.

6. **Report + propose.** Emit a per-screen report grouped by severity (must /
   should / may), each line keyed by `[<checklist> <ruleId>] <region>: <ref> — <message>`.
   Then, per the self-improving loop, for any finding **not** already covered by a
   rule, **propose** a new `KitRule` + detector + `CHECKLIST.md` row for a human to
   ratify (a person owns the `must` tier). Do not edit grammar or source unless
   asked.

## Output

A consistency verdict per screen:

- **CLEAN** — no findings.
- **WARN** — `should`/`may` findings only.
- **DEFECT** — one or more `must` findings (CI-blocking).

## Not in scope (yet)

Reference-implementation diffing (`ref/*`: legacy/Figma/Vue variant + token-value
parity), the discrepancy **ledger**, and folding capture into the VR test-runner
are **Phase 4**. This skill is detectors-first over a single rendered screen.
