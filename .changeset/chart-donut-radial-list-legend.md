---
'@acronis-platform/ui-react': minor
---

feat(charts): Figma-align PieChart & RadialBarChart — list legend always-right

- Add `variant="list"` to `ChartLegendContent` for the vertical dot-label-value layout; accepts `valueKey` and `valueFormatter` to show per-item values
- PieChart and RadialBarChart now **always** render as `flex-row`: chart square on the left, list legend on the right — matching the Figma donut/radial widget layout. The `legendPosition` prop is removed; configuring legend position is no longer supported on these charts (cartesian charts keep their bottom legend unchanged)
- Center-label nudge logic removed from `PieChart` (was compensating for recharts' built-in legend, which is now always external)
