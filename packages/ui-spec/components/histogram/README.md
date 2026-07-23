# Histogram

A frequency histogram built on the shared `Chart` primitives. Give it raw
`values` and a per-series `config`; it bins the samples into equal-width ranges
and plots the count of each as contiguous bars — you don't pre-aggregate.

> **Design-pending v1.** There is no chart token tier yet, so the bar color is
> **caller-supplied** via `config` (a dedicated `--ui-chart-*` data-viz palette
> is a pending upstream design deliverable). No `apps/demo` playground — built
> net-new. Code Connect is deferred.

## When to use

- Showing the **distribution** of a single continuous variable — how many
  samples fall in each value range (response times, scores, sizes).
- Spotting shape: skew, spread, modality, outliers.

## When not to use

- Comparing named categories — that's a [`BarChart`](/components/bar-chart)
  (pre-categorized rows), not a histogram (binned continuous data).
- Part-to-whole — use a pie/donut.
- Two-variable relationships — use a scatter chart.

## Example

```tsx
import { Histogram } from '@acronis-platform/ui-react';
import type { ChartConfig } from '@acronis-platform/ui-react';

const values = [12, 15, 18, 20, 22, 22, 25, 28, 30, 35, 42, 48, 60];

const config = {
  count: { label: 'Frequency', color: 'var(--ui-background-brand-secondary)' },
} satisfies ChartConfig;

<Histogram
  config={config}
  values={values}
  binCount={10}
  className="h-[320px] w-[560px]"
/>;
```

Tune the resolution with `binCount`, or fix the range with `domain={[0, 100]}`
(samples outside the domain are dropped). The bar color references an existing
semantic `--ui-*` token; `--ui-background-brand-secondary` is brand-dependent, so
it is not color-stable across brands until the real data-viz palette lands.
