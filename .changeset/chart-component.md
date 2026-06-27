---
'@acronis-platform/ui-react': minor
---

feat(chart): add Chart (initial version ported from ui-legacy)

A theming layer over recharts: `ChartContainer` supplies per-series colors and
themes recharts' internals with the semantic token vocabulary, plus
`ChartTooltipContent` / `ChartLegendContent` chrome (and `ChartTooltip` /
`ChartLegend` re-exports). recharts is externalized from the bundle and resolved
as a dependency. Design reconciliation pending.
