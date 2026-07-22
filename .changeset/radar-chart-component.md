---
'@acronis-platform/ui-react': minor
---

Add `RadarChart` — a typed recharts composition over the shared `Chart` primitives (the first polar chart type). Plots a set of series `dataKeys` over one shared angular axis (`angleKey`) with a polar grid, spoke labels, tooltip, and legend; caller-supplied series colors. One `gridType` variant (polygon / circle), plus `fillOpacity` / `strokeWidth` / `showDots` controls. Scopes the polar angle-axis labels to the muted-foreground token locally (the shared container themes only cartesian ticks — a tracked primitives gap). Initial version ported from the apps/demo `RadarChartPlayground`; design + data-viz palette reconciliation pending.
