---
'@acronis-platform/ui-react': minor
---

Add `SankeyChart` — a typed Sankey flow-diagram over the shared `Chart`
primitives (built on recharts' `Sankey`). Renders a `nodes` + `links` graph with
token-themed node bars and target-tinted link ribbons (width ∝ flow value),
optional node labels, a tooltip, and geometry props (`nodePadding` / `nodeWidth`
/ `linkCurvature` / `sort`). Initial design-pending v1 — colors borrow existing
semantic `--ui-*` tokens until the `--ui-chart-*` palette lands; Figma Code
Connect deferred.
