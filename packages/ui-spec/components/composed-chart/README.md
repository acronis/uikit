# ComposedChart

A typed composed (mixed) chart built on the shared `Chart` primitives. Give it
`data`, a per-series `config`, and a `series` list where each entry picks its own
render `type` (bar / line / area); it renders a themed recharts `ComposedChart` —
tooltip, legend, axes, and grid included — so you don't hand-compose recharts
children.

> **Design-pending v1.** Ported from the apps/demo `ComposedChartPlayground`.
> There is no chart token tier yet, so **series colors are supplied by the
> caller** via `config` — a dedicated `--ui-chart-*` data-viz palette is a pending
> upstream design deliverable. The chrome is reconciled with Figma later; Code
> Connect is deferred.

## When to use

- Overlaying related measures with different shapes — e.g. revenue **bars** with
  a profit-margin **line**, or volume **bars** behind a trend **area**.
- Emphasizing one series (line on top) against a backdrop of others (bars/areas).

## When not to use

- All series are the same kind — use `BarChart`, `LineChart`, or `AreaChart`.
- The measures have wildly different scales that mislead on one axis (this v1
  shares a single Y axis) — split into separate charts.
- Part-to-whole — use a pie/donut chart.

## Variants

None. ComposedChart has no CVA variant axes — the mix is data-driven via each
`series[].type` (`bar` / `line` / `area`). Series render in the order you list
them (recharts paints children back-to-front, so later entries sit on top) —
order them so a thin line comes after the bars/areas it should overlay.

## Example

```tsx
import { ComposedChart } from '@acronis-platform/ui-react';
import type { ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { month: 'Jan', revenue: 2400, profit: 1600 },
  { month: 'Feb', revenue: 1398, profit: 1200 },
  { month: 'Mar', revenue: 9800, profit: 4800 },
];

const config = {
  revenue: { label: 'Revenue', color: 'var(--ui-background-brand-secondary)' },
  profit: {
    label: 'Profit',
    color: 'var(--ui-background-status-strong-success)',
  },
} satisfies ChartConfig;

<ComposedChart
  config={config}
  data={data}
  series={[
    { key: 'revenue', type: 'bar' },
    { key: 'profit', type: 'line' },
  ]}
  xKey="month"
  className="h-[320px] w-[560px]"
/>;
```

Series colors reference existing semantic `--ui-*` tokens. `--ui-background-status-strong-*`
is chromatic in every brand; `--ui-background-brand-secondary` is brand-dependent
(blue in `default`, neutral in some white-label brands), so it is not color-stable
across brands until the real data-viz palette lands.
