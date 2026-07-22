---
'@acronis-platform/ui-react': minor
---

Add `Treemap` — a typed recharts composition over the shared `Chart` primitives. Tiles a flat set of leaves into rectangles sized by `dataKey` and colored per `nameKey`, with on-cell labels and a tooltip (no axes, grid, or legend). Themed through a custom cell renderer (recharts' default has no token hooks); rows are stamped with `fill` so a real hover resolves the cell color. No CVA variants — `aspectRatio` is a plain prop and nesting is out of v1 scope. On-cell labels use the `--ui-text-on-status-strong-neutral` token over the saturated series colors. Initial version ported from the apps/demo `TreemapChartPlayground`; design + data-viz palette reconciliation pending.
