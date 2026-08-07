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
- Two measures whose **units or magnitudes** differ (a count and a rate) — put one
  on the secondary value axis so neither flattens the other.

## When not to use

- All series are the same kind — use `BarChart`, `LineChart`, or `AreaChart`.
- Part-to-whole — use a pie/donut chart.
- Two measures a reader would want to compare **directly**, value against value —
  two scales make any crossing point an artifact of the domains, not a fact about
  the data. Split into separate charts (or share one axis) instead.

## Two value axes

A series opts in with `yAxis: 'secondary'`, and the second axis appears on the
side opposite the primary one:

```tsx
<ComposedChart
  config={config}
  data={data}
  series={[
    { key: 'revenue', type: 'bar' },
    { key: 'conversion', type: 'line', yAxis: 'secondary' },
  ]}
  xKey="month"
  secondaryYUnit="%"
/>
```

Each axis takes its own unit, tick formatter, tick count, and domain
(`secondaryYUnit`, `secondaryYTickFormatter`, `secondaryYAxisTickCount`,
`secondaryYAxisDomain`, `secondaryYAxisLabel`). `yAxisOrientation` moves the
primary axis to the right and mirrors the pair; `showSecondaryYAxis: false` keeps
the second scale but drops its chrome. The grid's horizontal lines follow the
primary axis only — a second set from a different domain would cross the first at
meaningless heights. If every series opts in, the primary axis has nothing measured
against it: it isn't rendered, and the grid follows the secondary axis instead.

Give the two axes matching domain presets when you want their tick rows to line
up; a tightly fitted (`auto`) secondary domain will otherwise place its ticks
between the primary axis's gridlines.

## Per-series styling and stacking

Every styling prop on the chart is the **default a series can override**, keyed by
the same name on its `series[]` entry — `color`, `curve`, `strokeWidth`,
`strokeDasharray`, `showDots`, `showActiveDots`, `connectNulls`, `barRadius`,
`barSize`, `showActiveBar`, `showBackground`, `fillOpacity`, `legendType`:

```tsx
<ComposedChart
  config={config}
  data={data}
  strokeWidth={3}
  series={[
    { key: 'revenue', type: 'bar', stackId: 'total' },
    { key: 'forecast', type: 'bar', stackId: 'total' },
    // Reads as a projection: dashed, thinner than the chart default, no dots.
    {
      key: 'projection',
      type: 'line',
      strokeDasharray: '5 5',
      strokeWidth: 1.5,
    },
  ]}
  xKey="month"
/>
```

Series sharing a `stackId` stack — **bars with bars, areas with areas**. The ids
are namespaced per mark type, so reusing one id across types can't merge a bar
into an area's stack, and a line ignores it (recharts does not stack lines). Only
the segment at the top of a stack rounds its corners, and its data labels centre
in their own segment (a stacked segment has no free space at its growing end).

`legendType: 'none'` keeps a series off the legend; `line` / `rect` pick its
marker. The wider recharts icon set is deliberately not exposed — the legend draws
its own marker and reads only those cases.

## References

`referenceLine` draws dashed rules: a fixed `value`, the `average` of one/every
series, or — with `category` — a rule _across_ the categories at one of them, the
hand-off between actuals and forecast. `referenceArea` shades a band behind a
range of categories (`from`/`to`, inclusive, each a category value or a row
index). Both take an array to draw several.

A rule belongs to **one scale**. On a chart carrying two value axes, `yAxis` picks
which — defaulting to the axis of the series named by `average`, and to `primary`
otherwise — and `average: true` pools only the series measured against that axis.
Averaging a count and a rate together, or plotting a rate's mean against a count's
scale, would put the rule somewhere meaningless; neither can happen by accident.

## Variants

`orientation` (`vertical` — the default — / `horizontal`) is the one CVA variant
axis: it is the direction the marks grow, and it re-roles both axes. Horizontal
puts the categories on the y-axis and the values on x, turns the grid lines
vertical, rounds each bar's right end instead of its top, and renders a secondary
value axis as a second x-axis along the top edge. `yAxisOrientation` goes inert
there — the value axis is X, so the primary sits along the bottom and the
secondary along the top, and neither has a left/right side to pick.

The mark mix is _not_ a variant — it is data-driven via each `series[].type`
(`bar` / `line` / `area`). Series render in the order you list them (later entries
sit on top, whatever their mark type) — order them so a thin line comes after the
bars/areas it should overlay.

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
