# FunnelChart

A typed funnel-chart built on the shared `Chart` primitives. Give it `data`, a
per-stage `config`, the value field (`dataKey`), and the label field (`nameKey`);
it renders a themed recharts `FunnelChart` — on-chart stage labels and a tooltip
included — so you don't hand-compose recharts children. (There's no legend: the
inline labels already name every stage.)

> **Design-pending v1.** Ported from the apps/demo `FunnelChartPlayground`. There
> is no chart token tier yet, so **stage colors are supplied by the caller** via
> `config` — a dedicated `--ui-chart-*` data-viz palette is a pending upstream
> design deliverable. The chrome is reconciled with Figma later; Code Connect is
> deferred.

## When to use

- Showing progression (and drop-off) through the ordered stages of a process —
  a conversion funnel, a recruitment pipeline, an onboarding flow.
- A handful of monotonically decreasing stages read best.

## When not to use

- Unordered categories or part-to-whole of a single total — use a pie/donut or
  bar chart.
- A trend over time — use a line or area chart.
- Values that don't decrease stage to stage — the funnel metaphor misleads.

## Variants

| Axis        | Values                   | Effect                                         |
| ----------- | ------------------------ | ---------------------------------------------- |
| `lastShape` | `triangle` · `rectangle` | Final segment narrows to a point vs ends flat. |

## Example

```tsx
import { FunnelChart } from '@acronis-platform/ui-react';
import type { ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { stage: 'Visits', value: 5000 },
  { stage: 'Signups', value: 2600 },
  { stage: 'Trials', value: 1400 },
  { stage: 'Purchases', value: 620 },
];

const config = {
  Visits: { label: 'Visits', color: 'var(--ui-background-brand-secondary)' },
  Signups: {
    label: 'Signups',
    color: 'var(--ui-background-status-strong-success)',
  },
  Trials: {
    label: 'Trials',
    color: 'var(--ui-background-status-strong-warning)',
  },
  Purchases: {
    label: 'Purchases',
    color: 'var(--ui-background-status-strong-danger)',
  },
} satisfies ChartConfig;

<FunnelChart
  config={config}
  data={data}
  dataKey="value"
  nameKey="stage"
  className="h-[380px] w-[460px]"
/>;
```

Stage colors reference existing semantic `--ui-*` tokens, keyed by each stage's
`nameKey` value. `--ui-background-status-strong-*` is chromatic in every brand;
`--ui-background-brand-secondary` is brand-dependent (blue in `default`, neutral
in some white-label brands), so it is not color-stable across brands until the
real data-viz palette lands.
