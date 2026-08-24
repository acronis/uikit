---
'@acronis-platform/ui-react': minor
---

feat(chart): add the dataviz palettes to the shared Chart primitives

`ChartContainer` gains an optional `palette` prop. Series that state no `color`
of their own now take one from that palette, so a chart no longer needs every
color hand-written into its `config`.

Four palettes, mirroring the product's widget editor, all resolving to the
`--ui-dataviz-*` tokens already shipped by `@acronis-platform/tokens-pd`:

- `{ type: 'categorical' }` — 16 distinct hues, assigned in order.
- `{ type: 'sequential', ramp }` — `blue` | `teal` | `orange` | `violet`.
- `{ type: 'diverging', pair }` — `blue-orange` | `teal-violet`.
- `{ type: 'status' }` — the six semantic tones, named per series.

Series walk the palette in its **defined order** — series 1 takes stop 1, series
2 takes stop 2, wrapping once the stops run out.

`categorical` and `status` accept a per-series override via `tone`
(`{ slot: 7 }` / `{ status: 'danger' }`). `sequential` and `diverging` do not:
their stops are a ramp, so the colors mean something only in relation to each
other. An override passed under those palettes is ignored with a dev warning,
and a categorical slot outside the palette is clamped rather than passed
through — a chart can never paint off-palette.

Also exported for consumers building a color picker over this: the token maps
(`CHART_CATEGORICAL_TOKENS`, `CHART_SEQUENTIAL_TOKENS`, `CHART_DIVERGING_TOKENS`,
`CHART_STATUS_TOKENS`), `listPaletteStops`, `listPaletteChoices`,
`resolveSeriesColor`, `resolveChartColors` and `findDuplicateTones`.

Every per-type chart component (`AreaChart`, `BarChart`, `ComposedChart`,
`ConfidenceCone`, `FunnelChart`, `Histogram`, `LineChart`, `PieChart`,
`RadarChart`, `RadialBarChart`, `SankeyChart`, `ScatterChart`, `Treemap`)
forwards `palette` to its container.

Additive: `palette` is optional and an explicit `color`/`theme` still wins, so
existing charts are unchanged.
