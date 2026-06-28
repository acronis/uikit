# Kit inconsistency checklist

The canonical, human-readable taxonomy of common UI-kit inconsistencies. Each row
is **mirrored 1:1 by a machine rule** in `./rules/` (the `id` back-links here via
its `checklist` field; `__tests__/grammar.test.ts` keeps the two in sync).

Columns:

- **#** — stable row id, referenced by `KitRule.checklist`.
- **Inconsistency** — what goes wrong.
- **Detect** — how it is (to be) caught: `kit-lint` (static AST/CSS),
  `spec` (ui-spec conformance test), `screen` (rendered-screen detector),
  `ref` (reference-implementation diff), `ai` (AI visual reviewer),
  `human` (review only).
- **Sev** — default severity (`must` blocks CI, `should` warns, `may` guides).

Detectors are built across the rollout phases; this checklist and the rule
registry are seeded first (Phase 0).

## Tokens & color

| #   | Inconsistency                                                          | Detect        | Sev    |
| --- | ---------------------------------------------------------------------- | ------------- | ------ |
| T1  | Hard-coded hex/hsl/rgb instead of a `--ui-*` token                     | kit-lint      | must   |
| T2  | Bridged Tailwind name with no ui-react bridge → silent invalid         | kit-lint      | must   |
| T3  | Opacity-modifier color hack (`bg-primary/90`) instead of a state token | kit-lint      | should |
| T4  | Interaction state wired to the wrong token (`hover:` not `*-hover`)    | kit-lint+spec | should |
| T5  | One semantic role rendered by different tokens across components       | ref+screen    | must   |
| T6  | Dangling `var(--ui-*)` reference                                       | spec          | must   |

## Spacing & sizing

| #   | Inconsistency                                               | Detect   | Sev    |
| --- | ----------------------------------------------------------- | -------- | ------ |
| Z1  | Off-grid spacing (not a 4px multiple / not a spacing token) | kit-lint | should |
| Z2  | Control-height drift — controls disagree in one row         | screen   | must   |
| Z3  | Border-radius drift between sibling controls                | screen   | should |
| Z4  | Padding-tier drift (same role, different padding)           | screen   | should |
| Z5  | Touch target below the kit minimum                          | kit-lint | must   |
| Z6  | Icon-size drift within a row/cluster                        | screen   | should |

## Typography

| #   | Inconsistency                       | Detect   | Sev    |
| --- | ----------------------------------- | -------- | ------ |
| Y1  | Off-scale font size                 | kit-lint | should |
| Y2  | Line-height off the type ramp       | kit-lint | should |
| Y3  | Font-weight outside the allowed set | kit-lint | should |
| Y4  | Label casing/format drift           | ai       | may    |

## Anatomy & state treatment

| #   | Inconsistency                                          | Detect   | Sev    |
| --- | ------------------------------------------------------ | -------- | ------ |
| A1  | Focus-ring drift across components                     | kit-lint | must   |
| A2  | Disabled-treatment drift                               | screen   | should |
| A3  | Bare `border` instead of `border-border`               | kit-lint | should |
| A4  | Missing/extra part vs spec anatomy                     | spec     | must   |
| A5  | Missing empty/loading/error state for a data component | spec     | should |
| A6  | Empty-state / skeleton composition drift               | screen   | should |

## Interaction & accessibility

| #   | Inconsistency                                | Detect   | Sev    |
| --- | -------------------------------------------- | -------- | ------ |
| I1  | Interactive element with no accessible name  | screen   | must   |
| I2  | Escape-close / focus-trap missing on overlay | screen   | must   |
| I3  | Hover/transition timing drift                | kit-lint | may    |
| I4  | Tab order ≠ visual order                     | screen   | should |
| I5  | Contrast below WCAG                          | screen   | must   |

## Composition (screen-level)

| #   | Inconsistency                                                | Detect   | Sev    |
| --- | ------------------------------------------------------------ | -------- | ------ |
| C1  | Vertical-rhythm drift between sections                       | screen   | should |
| C2  | Misaligned baselines / left edges across components          | screen   | should |
| C3  | Components not sharing the layout/alignment grid             | screen   | should |
| C4  | Variant mismatch — the primary action differs across screens | ref+ai   | must   |
| C5  | Z-index / layering violation                                 | kit-lint | must   |
| C6  | Two components solving the same job differently on a screen  | ai       | should |
| C7  | Density mismatch (compact table beside a roomy form)         | ai       | may    |
| C8  | Reserved-gutter / clipping defects                           | screen   | should |

## Cross-implementation drift

| #   | Inconsistency                                     | Detect | Sev    |
| --- | ------------------------------------------------- | ------ | ------ |
| X1  | Variant set ≠ legacy ≠ Figma ≠ Vue spec           | ref    | should |
| X2  | Token value drift (Figma vs tokens-pd)            | ref    | must   |
| X3  | Component present in a reference but missing here | ref    | may    |
