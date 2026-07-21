# LineChart

A typed line-chart built on the shared `Chart` primitives. Give it `data`, a
per-series `config`, the series to plot (`dataKeys`), and the category key
(`xKey`); it renders a themed recharts `LineChart` — tooltip, legend, axes, and
grid included — so you don't hand-compose recharts children.

> **Design-pending v1.** Ported from the apps/demo `ChartPlayground`. There is no
> chart token tier yet, so **series colors are supplied by the caller** via
> `config` — a dedicated `--ui-chart-*` data-viz palette is a pending upstream
> design deliverable. The chrome is reconciled with Figma later; Code Connect is
> deferred.

## When to use

- Showing a trend over a continuous or ordered dimension (revenue by month,
  latency over time).
- Comparing the trends of a few series on shared axes.

## When not to use

- Comparing a quantity across discrete categories — use a bar chart.
- Part-to-whole of a single total — consider a pie/donut chart.
- A single metric or KPI — use a `Tag`, `Badge`, or plain text.
- Tabular detail — use `Table` / `DataTable`.

## Variants

| Axis        | Values                         | Effect                                                       |
| ----------- | ------------------------------ | ------------------------------------------------------------ |
| `curve`     | `linear` · `monotone` · `step` | Straight, smoothed, or stepped interpolation between points. |
| `lineStyle` | `solid` · `dashed`             | Solid or dashed stroke.                                      |

Single vs multi line is not a variant — it follows from how many `dataKeys` you
plot.

## Example

```tsx
import { LineChart } from '@acronis-platform/ui-react';
import type { ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
];

const config = {
  desktop: { label: 'Desktop', color: 'var(--ui-background-brand-secondary)' },
  mobile: {
    label: 'Mobile',
    color: 'var(--ui-background-status-strong-danger)',
  },
} satisfies ChartConfig;

<LineChart
  config={config}
  data={data}
  dataKeys={['desktop', 'mobile']}
  xKey="month"
  className="h-[320px] w-[560px]"
/>;
```

Series colors reference existing semantic `--ui-*` tokens. `--ui-background-status-strong-*`
is chromatic in every brand; `--ui-background-brand-secondary` is brand-dependent
(blue in `default`, neutral in some white-label brands), so it is not color-stable
across brands until the real data-viz palette lands.
