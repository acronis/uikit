# PieChart

A typed pie/donut-chart built on the shared `Chart` primitives. Give it `data`, a
per-slice `config`, the value field (`dataKey`), and the label field (`nameKey`);
it renders a themed recharts `PieChart` — tooltip and legend included — so you
don't hand-compose recharts children.

> **Design-pending v1.** Ported from the apps/demo `PieChartPlayground`. There is
> no chart token tier yet, so **slice colors are supplied by the caller** via
> `config` — a dedicated `--ui-chart-*` data-viz palette is a pending upstream
> design deliverable. The chrome is reconciled with Figma later; Code Connect is
> deferred.

## When to use

- Showing part-to-whole proportions across a handful of categories.
- A compact, at-a-glance distribution (device share, channel split).
- Use `shape="donut"` when you want a lighter footprint or a centre for a total.

## When not to use

- More than ~6 categories, or many similar-sized slices — use a bar chart, which
  compares magnitudes far more precisely.
- Trends over time — use a line or area chart.
- Comparing exact values — angles are hard to read; prefer bars or a table.

## Variants

| Axis    | Values          | Effect                                    |
| ------- | --------------- | ----------------------------------------- |
| `shape` | `pie` · `donut` | Filled arc vs a hollow-centre donut ring. |

## Example

```tsx
import { PieChart } from '@acronis-platform/ui-react';
import type { ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { browser: 'Chrome', value: 275 },
  { browser: 'Safari', value: 200 },
  { browser: 'Firefox', value: 187 },
  { browser: 'Edge', value: 173 },
];

const config = {
  Chrome: { label: 'Chrome', color: 'var(--ui-background-brand-secondary)' },
  Safari: {
    label: 'Safari',
    color: 'var(--ui-background-status-strong-danger)',
  },
  Firefox: {
    label: 'Firefox',
    color: 'var(--ui-background-status-strong-success)',
  },
  Edge: { label: 'Edge', color: 'var(--ui-background-status-strong-warning)' },
} satisfies ChartConfig;

<PieChart
  config={config}
  data={data}
  dataKey="value"
  nameKey="browser"
  shape="donut"
  className="h-[360px] w-[360px]"
/>;
```

Slice colors reference existing semantic `--ui-*` tokens, keyed by each slice's
`nameKey` value. `--ui-background-status-strong-*` is chromatic in every brand;
`--ui-background-brand-secondary` is brand-dependent (blue in `default`, neutral
in some white-label brands), so it is not color-stable across brands until the
real data-viz palette lands.
