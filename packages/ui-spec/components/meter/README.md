# Meter

A labelled proportional bar for a value within a known range — a fractional
value / share. Built on Base UI's `Meter` (`role="meter"`, like the HTML
`<meter>` element), as opposed to `Progress` / `ProgressCircle`, which track a
task over time. One row: label + `value · %` over a track bar, with a hover
tooltip; stack several to build a ranked breakdown (a "bar list").

> **Design-pending v1.** No chart token tier yet, so the fill color is
> **caller-supplied** per row via `color` (a dedicated `--ui-chart-*` data-viz
> palette is a pending upstream design deliverable). The tooltip uses the
> chart-tooltip look (light card). Code Connect deferred.

## When to use

- One row of a **breakdown** — a category's value and its share of a total,
  with a proportional bar (severity split, top browsers, storage by type).
- Stacked and sorted, as a ranked bar-list.

## When not to use

- Task progress over time (uploads, loading) — use
  [`Progress`](/components/progress) / `ProgressCircle`.
- Many categories compared without a part-to-whole reading — a bar chart.

## Example

```tsx
import { Meter } from '@acronis-platform/ui-react';

<Meter
  label="Critical"
  value={6}
  max={29}
  color="var(--ui-background-status-strong-danger)"
/>;
```

Stack several sharing one `max` (the total), sorted by value, for a ranked
breakdown:

```tsx
const rows = [
  {
    label: 'High',
    value: 9,
    color: 'var(--ui-background-status-strong-warning)',
  },
  {
    label: 'Medium',
    value: 8,
    color: 'var(--ui-background-status-strong-info)',
  },
  {
    label: 'Critical',
    value: 6,
    color: 'var(--ui-background-status-strong-danger)',
  },
];
const total = rows.reduce((sum, r) => sum + r.value, 0);

<div className="flex flex-col gap-4">
  {rows
    .sort((a, b) => b.value - a.value)
    .map((r) => (
      <Meter
        key={r.label}
        label={r.label}
        value={r.value}
        max={total}
        color={r.color}
      />
    ))}
</div>;
```

The fill color references an existing semantic `--ui-*` token; the status tokens
are chromatic across brands, so they read consistently until the real data-viz
palette lands.
