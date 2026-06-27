# Chart

A theming layer over [recharts](https://recharts.org). `ChartContainer` supplies
per-series colors and themes recharts' internals with the semantic token
vocabulary; `ChartTooltipContent` and `ChartLegendContent` give the tooltip and
legend the library's look. The chart type itself (bar / line / area / pie / …) is
composed by the caller from recharts primitives.

> **Design-pending v1.** Ported from the legacy shadcn-uikit `chart`. There is no
> chart token tier yet, so **series colors are supplied by the caller** via
> `config` — a dedicated data-viz palette is pending an upstream design pass. The
> chrome is reconciled with Figma later.

## When to use

- Visualizing quantitative data — trends, comparisons, distributions.
- You want recharts' flexibility but the Acronis tooltip/legend/axis styling.

## When not to use

- A single metric or KPI — use a `Tag`, `Badge`, or plain text.
- Tabular detail — use `Table` / `DataTable`.
- Progress toward a goal — use `Progress` or `ProgressCircle`.

## Parts

| Export                | Purpose                                                                              |
| --------------------- | ------------------------------------------------------------------------------------ |
| `ChartContainer`      | The wrapper. Takes `config` + the recharts plot as children; injects series colors.  |
| `ChartTooltip`        | Re-export of recharts' `Tooltip`. Pass `ChartTooltipContent` as its `content`.       |
| `ChartTooltipContent` | Themed tooltip body — label + per-series indicator/value.                            |
| `ChartLegend`         | Re-export of recharts' `Legend`. Pass `ChartLegendContent` as its `content`.         |
| `ChartLegendContent`  | Themed legend body — swatch + label per series.                                      |
| `ChartStyle`          | Injects the `--color-<key>` custom properties (used internally by `ChartContainer`). |

`ChartConfig` is the per-series map of `label` / `icon` / `color` (or per-theme
`{ light, dark }` colors).

## Example

```tsx
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@acronis-platform/ui-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const config = {
  desktop: { label: 'Desktop', color: 'var(--ui-background-brand-secondary)' },
  mobile: { label: 'Mobile', color: 'var(--ui-background-status-danger)' },
} satisfies ChartConfig;

<ChartContainer config={config} className="h-[300px] w-[500px]">
  <BarChart data={data}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>;
```

`recharts` is a peer-resolved dependency of `@acronis-platform/ui-react`; import
the chart primitives (`BarChart`, `Bar`, …) directly from `recharts`.
