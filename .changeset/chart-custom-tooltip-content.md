---
'@acronis-platform/ui-react': minor
---

Let consumers customize chart tooltips without composing recharts. `BarChart`,
`LineChart`, `AreaChart`, `ComposedChart`, `ScatterChart`, `PieChart`,
`RadarChart`, `RadialBarChart`, `FunnelChart` and `Treemap` now accept a
`tooltipContent` prop — pass a configured `ChartTooltipContent` (imported from
this library) with a `formatter` / `labelFormatter` / `indicator` to control
formatting, per-series rows, and extra fields. Defaults are unchanged.
