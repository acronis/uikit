---
'@acronis-platform/ui-react': minor
---

feat(chart-widget): add the dashboard card a chart sits in

Every chart in the design is drawn inside the same card — a header with a title,
an optional filter chip and the ⋯ actions menu, then an optional metric readout,
then the plot. `ChartWidget` is that composition.

```tsx
<ChartWidget
  header={{
    title: 'Sessions',
    extras: <Tag variant="info">Last 6 months</Tag>,
    actions: <WidgetMenu />,
  }}
  className="h-[300px] w-[592px]"
>
  <AreaChart
    config={config}
    data={data}
    dataKeys={['sessions']}
    xKey="month"
    className="size-full"
  />
</ChartWidget>
```

It adds only the one thing a `Card` doesn't know about: **what the body shows
while there is no plot.** `state="loading" | "empty" | "error"` renders
`ChartState` in place of the chart, and `error` also gives the card its error
border — one prop, not two.

The header is `Card`'s: `header` is typed `CardHeaderProps` and spread onto
`CardHeader`, so everything that component takes works here — including the
parts `ChartWidget` never mentions (`isDraggable`, `hasRename`,
`isCollapsible`, …). Nothing to keep in sync.

There is no `size` prop. The Figma `size` axis (`sm`/`md`/`lg`) only changes the
frame width (288/592/896); the height is the dashboard grid's. So the widget
declares no size and _passes one down_ — the card is a full-height flex column,
the header takes what it needs, and the body takes the rest, so a chart given
`size-full` fills the whole remaining card. In a parent with no definite height
the card hugs its content instead. `bodyClassName` covers the one remaining gap:
a placeholder-only widget outside a sized cell.

The per-type chart components stay card-less, so a chart is still usable outside
a widget — in a table cell, a popover, or a `Metric`'s sparkline slot.
