# SankeyChart

A typed Sankey flow diagram built on the shared `Chart` primitives. Give it a
graph (`data.nodes` + `data.links`) and a per-node `config`; it renders a themed
recharts `Sankey` — node bars colored per name, link ribbons whose width is
proportional to the flow value and tinted by their target node — so you don't
hand-compose recharts children.

Node colors come from the `palette` prop — a dataviz palette resolving to the
`--ui-dataviz-*` tokens, `categorical` by default — not from `config`. Link
ribbons tint from their target node unless a link sets its own `color`.

> **Design-pending v1.** Built on recharts' `Sankey` primitive (no apps/demo
> playground existed). The chrome is reconciled with Figma later; Code Connect is
> deferred.

## When to use

- Showing how a total **flows/breaks down** across stages where the width of each
  flow matters (tenants → certification status, traffic → outcomes, budget → spend).
- A part-to-whole across two or more levels in one picture.

## When not to use

- Precise value comparison — ribbon width is hard to judge; a bar chart reads better.
- A single-level part-to-whole — a pie/donut or a `CategoryBar` is clearer.
- Very dense graphs (many nodes/links) — ribbons overlap and labels collide.

## Variants

None. SankeyChart has no CVA variant axes — everything is plain props: geometry
(`nodePadding` / `nodeWidth` / `linkCurvature`), `sort` (auto-order vs the given
node order), `showLabels` / `showLegend`, and a per-link `color` override
(rendered full-opacity; the default ribbon is the target color at 35%).

## Example

```tsx
import { SankeyChart } from '@acronis-platform/ui-react';
import type { ChartConfig } from '@acronis-platform/ui-react';

const data = {
  nodes: [{ name: 'all' }, { name: 'certified' }, { name: 'expired' }],
  links: [
    { source: 0, target: 1, value: 209 },
    { source: 0, target: 2, value: 31 },
  ],
};

const config = {
  all: {
    label: 'All tenants',
    color: 'var(--ui-background-status-strong-info)',
  },
  certified: {
    label: 'Certified',
    color: 'var(--ui-background-status-strong-info)',
  },
  expired: {
    label: 'Expired',
    color: 'var(--ui-background-status-strong-danger)',
  },
} satisfies ChartConfig;

<SankeyChart config={config} data={data} className="h-[360px] w-[620px]" />;
```

`showLegend` renders a built-in legend below the chart — a color dot + label per
node plus each node's value and its share of the largest node (the count + %
shown in the "Certification compliance" card). Pair it with `showLabels={false}`
to move naming off the chart. Give a link an explicit `color` to override its
default target tint (rendered full-opacity to match its node bar).

Node `name`s are the color keys, so they must be unique and CSS-safe;
`config[name].label` carries the human-readable text.
