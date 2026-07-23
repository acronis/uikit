# ConfidenceCone

A forecast confidence-cone built on the shared `Chart` primitives: give it a
time series with actual values, forecast values, and a lower/upper bound per
forecast point; it draws the actuals as a solid line with a filled area, the
forecast as a dashed line, and the uncertainty as a shaded band that widens with
the horizon — plus a divider and shaded region setting the forecast off from the
actuals. It's **one metric in one color**: actual vs forecast differ by line
style (solid vs dashed), not hue.

> **Design-pending v1.** No chart token tier yet, so the metric color is
> **caller-supplied** via `config` (a dedicated `--ui-chart-*` data-viz palette
> is a pending upstream design deliverable). The actual area and cone band reuse
> the actual series' color at low opacity. Built net-new (no `apps/demo`
> playground); Code Connect deferred.

## When to use

- Showing a projection with **explicit uncertainty** — capacity/licenses/revenue
  forecasts where the plausible range matters, not just the point estimate.

## When not to use

- A conversion funnel — that's [`FunnelChart`](/components/funnel-chart), a
  different thing despite the "cone/funnel" shape.
- A plain trend with no forecast — use [`LineChart`](/components/line-chart)
  (which also supports comparison overlays + delta bands).

## Example

```tsx
import { ConfidenceCone } from '@acronis-platform/ui-react';
import type { ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { month: 'Apr', actual: 130 },
  { month: 'May', actual: 141 },
  { month: 'Jun', actual: 150, forecast: 150, lower: 150, upper: 150 }, // hand-off
  { month: 'Jul', forecast: 162, lower: 150, upper: 176 },
  { month: 'Aug', forecast: 173, lower: 154, upper: 196 },
];

const config = {
  actual: { label: 'Actual', color: 'var(--ui-background-brand-secondary)' },
  forecast: {
    label: 'Forecast',
    color: 'var(--ui-background-brand-secondary)',
  },
} satisfies ChartConfig;

<ConfidenceCone
  config={config}
  data={data}
  xKey="month"
  actualKey="actual"
  forecastKey="forecast"
  lowerKey="lower"
  upperKey="upper"
  className="h-[320px] w-[560px]"
/>;
```

Make the actual and forecast lines meet by giving the hand-off point both an
`actual` and a `forecast` (with `lower = upper` so the cone starts at a point).
