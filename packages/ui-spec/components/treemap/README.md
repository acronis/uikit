# Treemap

A typed treemap built on the shared `Chart` primitives. Give it `data`, a
per-leaf `config`, the size field (`dataKey`), and the label field (`nameKey`);
it renders a themed recharts `Treemap` — cells sized by value, colored + labelled
per name, with a tooltip — so you don't hand-compose recharts children.

> **Design-pending v1.** Ported from the apps/demo `TreemapChartPlayground`. There
> is no chart token tier yet, so **cell colors are supplied by the caller** via
> `config` — a dedicated `--ui-chart-*` data-viz palette is a pending upstream
> design deliverable. On-cell labels use the `--ui-text-on-status-strong-neutral`
> token (a light "text on a colored surface" color) over the saturated series
> colors (pending matched label colors in the real palette). The chrome is
> reconciled with Figma later; Code Connect is deferred.

## When to use

- Showing part-to-whole across many items where the **relative size** matters
  more than precise values (disk usage, portfolio weight, category volume).
- A compact, space-filling overview of a flat set of categories.

## When not to use

- Precise value comparison — area is hard to judge; a bar chart reads better.
- Few categories — a bar or pie chart is clearer.
- Hierarchical drill-down — this v1 renders a **flat** set of leaves only.

## Variants

None. Treemap has no CVA variant axes — `aspectRatio` (the tiling ratio) is a
plain prop, and nesting is out of scope for v1.

## Example

```tsx
import { Treemap } from '@acronis-platform/ui-react';
import type { ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { name: 'React', size: 2400 },
  { name: 'Vue', size: 1600 },
  { name: 'Angular', size: 1200 },
  { name: 'Svelte', size: 800 },
];

const config = {
  React: { label: 'React', color: 'var(--ui-background-brand-secondary)' },
  Vue: { label: 'Vue', color: 'var(--ui-background-status-strong-success)' },
  Angular: {
    label: 'Angular',
    color: 'var(--ui-background-status-strong-danger)',
  },
  Svelte: {
    label: 'Svelte',
    color: 'var(--ui-background-status-strong-warning)',
  },
} satisfies ChartConfig;

<Treemap
  config={config}
  data={data}
  dataKey="size"
  nameKey="name"
  className="h-[320px] w-[520px]"
/>;
```

Cell colors reference existing semantic `--ui-*` tokens, keyed by each leaf's
`nameKey` value. `--ui-background-status-strong-*` is chromatic in every brand;
`--ui-background-brand-secondary` is brand-dependent (blue in `default`, neutral
in some white-label brands), so it is not color-stable across brands until the
real data-viz palette lands.
