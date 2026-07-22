# RadialBarChart

A typed radial-bar-chart built on the shared `Chart` primitives. Give it `data`,
a per-arc `config`, the value field (`dataKey`), and the label field (`nameKey`);
it renders a themed recharts `RadialBarChart` — concentric arcs, an optional
background track, tooltip, and legend included — so you don't hand-compose
recharts children.

> **Design-pending v1.** Ported from the apps/demo `RadialChartPlayground`. There
> is no chart token tier yet, so **arc colors are supplied by the caller** via
> `config` — a dedicated `--ui-chart-*` data-viz palette is a pending upstream
> design deliverable. The chrome is reconciled with Figma later; Code Connect is
> deferred.

## When to use

- A compact, decorative comparison of a few categories (device/browser share),
  or a gauge-style progress readout (via `startAngle`/`endAngle`).
- When the circular form is worth more than precise value comparison.

## When not to use

- Accurate magnitude comparison — a bar chart is far easier to read (arc length
  on a curve distorts).
- Part-to-whole of a single total — a pie/donut reads more directly.
- A trend over time — use a line or area chart.

## Variants

None. RadialBarChart has no CVA variant axes — its sweep (`startAngle` /
`endAngle`) and radii (`innerRadius` / `outerRadius`) are plain geometry props, so
a caller can build a full ring or a half-circle gauge; `showBackground` toggles
the muted track.

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
