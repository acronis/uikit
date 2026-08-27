# FunnelChart

A typed funnel-chart built on the shared `Chart` primitives. Give it `data`, a
per-stage `config`, the value field (`dataKey`), and the label field (`nameKey`);
it renders a themed recharts funnel with a tooltip, plus the two-column stage
list beside it — so you don't hand-compose recharts children.

## Layout

The root is a **row**: a 120×120 square plot, a 16px gutter, then the legend
column taking every remaining pixel. That is the same composition `PieChart` and
`RadialBarChart` use, and the legend is a **sibling of the plot** rendered
outside the SVG — never a recharts legend, and never a row below the funnel.

The component declares **no width and no height of its own**. It fills the width
its parent gives it and the legend column absorbs the surplus; the 120px figure
is the plot square Figma specifies, not a widget width. With `showLegend={false}`
the row centres its lone plot.

> The card, header and metric row Figma draws around the funnel belong to
> [`ChartWidget`](../chart-widget/README.md). `FunnelChart` is card-less by
> design.

## Colour

Stage colours come from the `palette` prop — a dataviz palette resolving to the
`--ui-dataviz-*` tokens — not from `config`, which supplies each stage's label.
The default is `{ type: 'sequential', ramp: 'blue' }`, exported as
`FUNNEL_CHART_DEFAULT_PALETTE`. Every other chart takes the shared **categorical**
default; a funnel differs on purpose, because its stages are an ordered series
rather than unrelated categories, which is exactly what a ramp reads as.

`stageSettings[name].color` is the per-stage escape hatch, and applies to the
segment and its legend marker alike.

### Known deviation from Figma

Figma paints the four stages with sequential blue stops **2 / 4 / 6 / 8**, while
the shared palette resolver walks the ramp in order and assigns the **consecutive**
stops 1 / 2 / 3 / 4. The funnel is therefore paler than the mockup. This is not a
funnel-local fix: how N series spread across a ramp's stops is the shared
resolver's decision, applied identically to every ramp-painted chart, so it is
left as a known deviation pending a decision there.

## Geometry

- **2px of surface between stages.** n stages produce exactly n-1 gaps; the
  topmost stage stays flush with the top of the plot area.
- **2px rounded corners** on every stage, the triangle's apex included.
- **Plot-area inset** when nothing sits beside the funnel: 4 top, 8 right, 4
  bottom, 8 left. Whichever side a label list sits on widens.
- `lastShape="triangle"` (the default) narrows the final stage to a point;
  `"rectangle"` keeps a flat lower edge.
- `reversed` flips the stack so the funnel widens downward — the gap-free stage
  becomes the last row.

The gap and the radius are drawn by the component's own shape renderer, because
recharts' `Funnel`/`Trapezoid` support neither.

## Legend

One two-column row per visible stage: the round marker and the `config` label on
the inline start, the stage's `dataKey` value — formatted by
`legendValueFormatter` when given — on the inline end. Both columns use
`--ui-text-on-surface-primary`, the value in semibold; Figma deliberately differs
from the donut and radial list legends here, which colour their values with the
link token.

Markers carry each stage's **resolved palette token** rather than a
`--color-<name>` custom property: those are scoped to the chart container, and the
legend sits outside it.

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

| Axis        | Values                   | Effect                                       |
| ----------- | ------------------------ | -------------------------------------------- |
| `lastShape` | `triangle` · `rectangle` | Final stage narrows to a point vs ends flat. |

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
  Visits: { label: 'Visits' },
  Signups: { label: 'Signups' },
  Trials: { label: 'Trials' },
  Purchases: { label: 'Purchases' },
} satisfies ChartConfig;

<FunnelChart config={config} data={data} dataKey="value" nameKey="stage" />;
```

The `config` keys are each stage's `nameKey` value. No colour is declared there —
the stages take the sequential blue ramp; pass `palette` to change it.

On-plot labels are **off** by default (`showLabels`), because the legend already
names every stage. Turn them on when a funnel is shown without its legend.
