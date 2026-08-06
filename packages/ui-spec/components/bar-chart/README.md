# BarChart

A typed bar-chart built on the shared `Chart` primitives. Give it `data`, a
per-series `config`, the series to plot (`dataKeys`), and the category key
(`xKey`); it renders a themed recharts `BarChart` — tooltip, legend, axes, and
grid included — so you don't hand-compose recharts children.

> **Design-pending v1.** Ported from the apps/demo `BarChartPlayground`. There is
> no chart token tier yet, so **series colors are supplied by the caller** via
> `config` — a dedicated `--ui-chart-*` data-viz palette is a pending upstream
> design deliverable. The chrome is reconciled with Figma later; Code Connect is
> deferred.

## When to use

- Comparing a quantity across categories (sales by month, usage by device).
- Comparing a few series per category — grouped (side-by-side) or stacked.

## When not to use

- A single metric or KPI — use a `Tag`, `Badge`, or plain text.
- Trends over a continuous dimension — prefer a line/area chart.
- Part-to-whole of a single total — consider a pie/donut chart.
- Tabular detail — use `Table` / `DataTable`.

## Variants

| Axis          | Values                    | Effect                                                 |
| ------------- | ------------------------- | ------------------------------------------------------ |
| `orientation` | `vertical` · `horizontal` | Bars grow up (category on x) vs right (category on y). |
| `layout`      | `grouped` · `stacked`     | Series side-by-side vs summed on a shared stack.       |

## Highlighting a range

A projection, a quarter under review, or any other stretch of the category axis
can be set apart without leaving the component:

- `referenceArea` shades the range, captions it, accents the ticks it covers,
  and optionally rules its leading edge (`divider`).
- `barSettings` restyles one series over a range — `fill`, `opacity`, `dashed`,
  `shape`, and a track via `background` (`true` for the full plot height, or a
  data field name to cap it at that row's value, i.e. the headroom up to an
  upper bound).

Both address a range as `{ from, to }`, inclusive, taking either a category's
own value or its row index; an omitted bound runs to that end of the data. A
capped track stacks on its bar, so it needs the default `layout="grouped"`, and
it never becomes a tooltip row or a legend entry.

## Example

```tsx
import { BarChart } from '@acronis-platform/ui-react';
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

<BarChart
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
