# CategoryBar

A single horizontal bar split into proportional colored segments — a
part-to-whole across a handful of categories, in one row. Give it a `data` array
(`key` + `value`) and a per-segment `config`; each segment's width is its value
over the total.

Segment colors come from the `palette` prop — a dataviz palette resolving to the
`--ui-dataviz-*` tokens, `categorical` by default — not from `config`.

> **Design-pending v1.** A plain flex composition (no recharts, no demo
> playground). Chrome is reconciled with Figma later; Code Connect is deferred.

## When to use

- A single-level part-to-whole where the **relative size** of each category
  matters and you want it in one compact row (onboarding stages, certification
  status, a pass/warn/fail split).
- As a header/summary widget above a table or in a dashboard card.

## When not to use

- Ranked single values that each need their own labelled row — use `Meter`
  stacked into a bar list.
- Precise value comparison across many categories — a bar chart reads better.
- A flow across two or more levels — use `SankeyChart`.
- More than ~6 segments, or very uneven values — thin slivers become unreadable;
  lean on the legend or a different chart.

## Variants

One CVA axis: `size` (`sm` / `md` / `lg`) sets the track height. Everything else
is plain props: `showLegend`, `showTooltip`, `valueFormatter`, `defaultOpenIndex`.

## Example

```tsx
import { CategoryBar } from '@acronis-platform/ui-react';
import type { ChartConfig } from '@acronis-platform/ui-react';

const config = {
  passed: {
    label: 'Passed',
    color: 'var(--ui-background-status-strong-success)',
  },
  warnings: {
    label: 'Warnings',
    color: 'var(--ui-background-status-strong-warning)',
  },
  failed: {
    label: 'Failed',
    color: 'var(--ui-background-status-strong-danger)',
  },
} satisfies ChartConfig;

<CategoryBar
  config={config}
  data={[
    { key: 'passed', value: 68 },
    { key: 'warnings', value: 22 },
    { key: 'failed', value: 10 },
  ]}
  showLegend
/>;
```

`showLegend` renders a color dot + label per segment plus each segment's value
and share of the total. Segment `key`s must be unique and CSS-safe;
`config[key].label` carries the human-readable text.
