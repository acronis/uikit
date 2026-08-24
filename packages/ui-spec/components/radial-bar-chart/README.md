# RadialBarChart

A typed radial-bar-chart built on the shared `Chart` primitives. Give it `data`,
a per-arc `config`, the value field (`dataKey`), and the label field (`nameKey`);
it renders a themed recharts `RadialBarChart` — concentric arcs, an optional
background track, tooltip, and legend included — so you don't hand-compose
recharts children.

Arc colors come from the `palette` prop — a dataviz palette resolving to the
`--ui-dataviz-*` tokens, `categorical` by default — not from `config`.

> **Design-pending v1.** Ported from the apps/demo `RadialChartPlayground`. The
> chrome is reconciled with Figma later; Code Connect is deferred.

## When to use

- A compact, decorative comparison of a few categories (device/browser share).
- A gauge-style progress readout — one value against a known range. This needs
  **`valueDomain`**, not just a half sweep: without a domain every arc is scaled
  against the largest value in the data, so a lone value always fills whatever
  sweep it is given. Pair it with `centerLabel` for the reading, and `segments`
  for the notched-ring look.
- When the circular form is worth more than precise value comparison.

## When not to use

- Accurate magnitude comparison — a bar chart is far easier to read (arc length
  on a curve distorts).
- Part-to-whole of a single total — a pie/donut reads more directly.
- A trend over time — use a line or area chart.

## Variants

None. RadialBarChart has no CVA variant axes — its sweep (`startAngle` /
`endAngle`), radii (`innerRadius` / `outerRadius`) and centre (`cx` / `cy`) are
plain geometry props, so a caller can build a full ring or a half circle;
`showBackground` toggles the muted track.

What the chart _reads as_ is driven by the data mapping rather than a variant:
one arc per row (the default), one arc per metric (`dataKeys`), or a single-value
gauge scaled by `valueDomain` — optionally with its ring notched into `segments`.

## Example

```tsx
import { RadialBarChart } from '@acronis-platform/ui-react';
import type { ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { browser: 'Chrome', value: 65 },
  { browser: 'Safari', value: 50 },
  { browser: 'Firefox', value: 35 },
  { browser: 'Edge', value: 25 },
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

<RadialBarChart
  config={config}
  data={data}
  dataKey="value"
  nameKey="browser"
  className="h-[360px] w-[360px]"
/>;
```

Arc colors reference existing semantic `--ui-*` tokens, keyed by each arc's
`nameKey` value. `--ui-background-status-strong-*` is chromatic in every brand;
`--ui-background-brand-secondary` is brand-dependent (blue in `default`, neutral
in some white-label brands), so it is not color-stable across brands until the
real data-viz palette lands.
