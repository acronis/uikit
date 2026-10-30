# ChartWidget — accessibility

## Roles and structure

The widget itself is a plain `div` (a `Card`) and adds no role: it is a grouping
surface, and the meaning lives in what it holds.

A dashboard that wants each widget to be a landmark uses `render`, which the
widget forwards to `Card`:

```tsx
<ChartWidget
  render={<section aria-label="Sessions" />}
  header={{ title: 'Sessions' }}
>
  {chart}
</ChartWidget>
```

The accessible name has to come from the caller: the header's `title` is visible
text inside the region, not a name for it, so a landmark without an
`aria-label` (or `aria-labelledby` pointing at the title) is an unnamed region.

The heading text comes from `CardHeader`'s `title`. It is the widget's visible
name, so a chart inside should not repeat it in its own accessible name.

## The placeholder is the live region

While `state` is set, `ChartState` is the live region — `role="status"`
(`aria-live="polite"`) for loading, empty, warning, and number; `role="alert"`
(`aria-live="assertive"`) for error. The widget deliberately does **not** add
`aria-busy` around it: the placeholder is unmounted and replaced by the plot
rather than un-busied, and some assistive tech defers announcing a busy region's
content, which would swallow the loading announcement.

A consumer that wants a busy signal sets `aria-busy` on the element it controls
— the widget accepts it as a passthrough prop.

## Header controls

The header's affordances are `Card`'s and carry its labelling: the drag handle,
switch, rename button and collapse trigger each take a label prop with a
default, and the `actions` slot is the caller's own control (an icon button
needs its own `aria-label` — the mockups' ⋯ menu has no visible text).

## State meaning

The widget card border stays consistent across states. `ChartState` supplies a
state icon and message (or the numeric KPI value), so meaning does not rely on
color alone.
