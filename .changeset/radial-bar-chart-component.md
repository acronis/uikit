---
'@acronis-platform/ui-react': minor
---

Add `RadialBarChart` — a typed recharts composition over the shared `Chart` primitives (a polar/radial type). Plots each data row as a concentric arc sized by `dataKey`, colored per `nameKey`, with an optional muted background track, tooltip, and legend; caller-supplied arc colors. No CVA variants — the sweep (`startAngle` / `endAngle`) and radii are plain geometry props (full ring or gauge). Rows are stamped with `fill` so a real hover resolves the arc color in the tooltip. Initial version ported from the apps/demo `RadialChartPlayground`; design + data-viz palette reconciliation pending.
