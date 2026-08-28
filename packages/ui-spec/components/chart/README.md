# Chart

A theming layer over [recharts](https://recharts.org). `ChartContainer` resolves
each series' color from a **dataviz palette** and themes recharts' internals with
the semantic token vocabulary; `ChartTooltipContent` and `ChartLegendContent` give
the tooltip and legend the library's look. The chart type itself (bar / line /
area / pie / …) is composed by the caller from recharts primitives.

Series colors are never hand-written. `config` names the series, the `palette`
prop says which palette they are painted from, and `ChartContainer` resolves each
one into a `--color-<key>` custom property the recharts marks reference. Every
palette resolves to `--ui-dataviz-*` tokens on the semantic tier.

## When to use

- Visualizing quantitative data — trends, comparisons, distributions.
- You want recharts' flexibility but the Acronis tooltip/legend/axis styling.

## When not to use

- A single metric or KPI — use a `Tag`, `Badge`, or plain text.
- Tabular detail — use `Table` / `DataTable`.

## Parts

| Export                | Purpose                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| `ChartContainer`      | The wrapper. Takes `config` + `palette` + the recharts plot as children; resolves and injects series colors. |
| `ChartTooltip`        | Re-export of recharts' `Tooltip`. Pass `ChartTooltipContent` as its `content`.                               |
| `ChartTooltipContent` | Themed tooltip body — label + per-series indicator/value.                                                    |
| `ChartLegend`         | Re-export of recharts' `Legend`. Pass `ChartLegendContent` as its `content`.                                 |
| `ChartLegendContent`  | Themed legend body — swatch + label per series.                                                              |
| `ChartStyle`          | Injects the `--color-<key>` custom properties (used internally by `ChartContainer`).                         |

`ChartConfig` is the per-series map of `label` / `icon` / `tone`. It carries no
color: `tone` only re-points a series **within** the palette — `{ slot: n }` for
another categorical hue, `{ status: '…' }` under the `status` palette, or
`{ sameAs: 'key' }` to share another series' color.

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

// No colors here — the default `categorical` palette paints the series in the
// order they are declared.
const config = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
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
