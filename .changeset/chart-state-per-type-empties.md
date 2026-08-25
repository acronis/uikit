---
'@acronis-platform/ui-react': minor
---

feat(chart-state): draw the empty state per chart type

`empty` is the one state the design draws per chart type — an area silhouette for
an area chart, a ring for a donut, a funnel for a funnel — so an empty widget
still says what it _would_ have shown, which a single generic glyph can't.

```tsx
<ChartState state="empty" variant="donut" />
<ChartWidget header={{ title: 'Conversion' }} variant="funnel" state="empty" />
```

`ChartState` gains:

- `variant` — `area` · `bar` · `line` · `donut` · `radial` · `funnel` · `radar` ·
  `sankey` · `scatter` · `treemap` · `table` · `text`. `donut` and `radial` share
  one ring: a radial-bar widget with no data has nothing to tell it apart.
- `description` replaces the previous `message` prop and is now the single text
  control for every state. Each state has a built-in default (`"Data is loading…"` /
  `"No data found"` / `"Something went wrong"`); pass `description` to override.

`ChartWidget` forwards both (`variant`, `stateDescription`). The previous
`stateMessage` prop is removed.

The twelve silhouettes are derived from the Figma empty-state instances rather
than redrawn, so a curve is the curve the design draws. Every path is
`currentColor`, with the tone set once on the container, so brand and theme
overrides reach the artwork.

Without a `variant` the `empty` state shows no artwork — just the text.
`loading` and `error` share one treatment and ignore `variant`.

`WidgetPlaceholder` stays. It is a different job — the composable skeleton for a
whole tile, with its own header/footer parts and an `interactive` affordance,
for a widget that isn't a chart. Both docs pages now say which is which.
