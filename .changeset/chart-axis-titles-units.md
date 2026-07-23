---
'@acronis-platform/ui-react': minor
---

Expose axis-title and unit props on the cartesian charts. `BarChart`,
`LineChart`, `AreaChart`, `ComposedChart` and `ScatterChart` now accept
`xAxisLabel` / `yAxisLabel` (forwarded to recharts' native axis `label`) and a
`unit` suffix on their numeric axes (`yUnit`, plus `xUnit` where the x-axis is
numeric — `ScatterChart` and horizontal `BarChart`). Axis titles inherit the
theme token via a `.recharts-label` fill selector, so they stay legible in light
and dark.
