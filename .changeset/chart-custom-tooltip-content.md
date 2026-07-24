---
'@acronis-platform/ui-react': minor
---

Let consumers customize chart tooltips without composing recharts. `BarChart`,
`LineChart`, `AreaChart`, `ComposedChart`, `ScatterChart`, `PieChart`,
`RadarChart`, `RadialBarChart`, `FunnelChart`, `Treemap`, `ConfidenceCone` and
`Histogram` now accept a `tooltipContent` prop — pass a configured
`ChartTooltipContent` (imported from this library) with a `formatter` /
`labelFormatter` / `indicator` to control formatting, per-series rows, and extra
fields. For `LineChart` (delta bands) and `ConfidenceCone` (the prediction
cone), the synthetic range series is filtered out of the payload before a custom
tooltip sees it. Defaults are unchanged.
