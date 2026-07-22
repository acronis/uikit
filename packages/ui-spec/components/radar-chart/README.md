# RadarChart

A typed radar-chart built on the shared `Chart` primitives. Give it `data`, a
per-series `config`, the series to plot (`dataKeys`), and the angular axis key
(`angleKey`); it renders a themed recharts `RadarChart` — polar grid, spoke
labels, tooltip, and legend included — so you don't hand-compose recharts
children.

> **Design-pending v1.** Ported from the apps/demo `RadarChartPlayground`. There
> is no chart token tier yet, so **series colors are supplied by the caller** via
> `config` — a dedicated `--ui-chart-*` data-viz palette is a pending upstream
> design deliverable. The chrome is reconciled with Figma later; Code Connect is
> deferred.

## When to use

- Comparing several entities across the **same set of quantitative axes** (skill
  profiles, product-feature scorecards, test results per subject).
- A handful of axes (~4–8) and a few series read best.

## When not to use

- A single series or a single metric — a bar chart compares magnitudes far more
  precisely (radial value judgement is hard).
- Many series or many axes — the overlapping areas become unreadable.
- A trend over time — use a line or area chart.

## Variants

| Axis       | Values               | Effect                                                   |
| ---------- | -------------------- | -------------------------------------------------------- |
| `gridType` | `polygon` · `circle` | The web drawn as straight-edged rings vs smooth circles. |

## Example

```tsx
import { RadarChart } from '@acronis-platform/ui-react';
import type { ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { subject: 'Math', alice: 120, bob: 110 },
  { subject: 'English', alice: 86, bob: 130 },
  { subject: 'Physics', alice: 85, bob: 90 },
  { subject: 'History', alice: 65, bob: 85 },
];

const config = {
  alice: { label: 'Alice', color: 'var(--ui-background-brand-secondary)' },
  bob: { label: 'Bob', color: 'var(--ui-background-status-strong-danger)' },
} satisfies ChartConfig;

<RadarChart
  config={config}
  data={data}
  dataKeys={['alice', 'bob']}
  angleKey="subject"
  className="h-[380px] w-[420px]"
/>;
```

Series colors reference existing semantic `--ui-*` tokens. `--ui-background-status-strong-*`
is chromatic in every brand; `--ui-background-brand-secondary` is brand-dependent
(blue in `default`, neutral in some white-label brands), so it is not color-stable
across brands until the real data-viz palette lands.
