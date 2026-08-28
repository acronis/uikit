# Treemap

A typed treemap built on the shared `Chart` primitives. Give it `data`, a
per-leaf `config`, the size field (`dataKey`), and the label field (`nameKey`);
it renders a themed recharts `Treemap` — cells sized by value, colored + labelled
per name, with a tooltip — so you don't hand-compose recharts children.

Cell colors come from the `palette` prop — a dataviz palette resolving to the
`--ui-dataviz-*` tokens, `diverging` (blue-orange) by default — not from `config`.

On-cell labels adapt their text color to three fill tones, decided structurally
by the resolved token name suffix (not a runtime luminance check):

- **dark** (diverging a3/b3, sequential 3–6, categorical, status): always white
  text (`--ui-text-on-status-strong-neutral`).
- **pale** (diverging a2/b2/a1/b1, sequential 1–2): theme-adaptive text via
  `--ui-text-on-surface-primary` (dark in light, light in dark).
- **inverts** (sequential 7–8, whose `light-dark()` values mirror across themes):
  `--ui-text-on-status-strong-primary` — near-white in light (fill is dark),
  near-black in dark (fill is pale).

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
  React: { label: 'React' },
  Vue: { label: 'Vue' },
  Angular: { label: 'Angular' },
  Svelte: { label: 'Svelte' },
} satisfies ChartConfig;

<Treemap
  config={config}
  data={data}
  dataKey="size"
  nameKey="name"
  className="h-[320px] w-[520px]"
/>;
```

Cell colors are assigned automatically from the active `palette` (diverging
blue-orange by default). The `--ui-dataviz-*` tokens are `light-dark()` pairs,
so light/dark and brand overrides come for free.
