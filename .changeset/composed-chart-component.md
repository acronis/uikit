---
'@acronis-platform/ui-react': minor
---

Add `ComposedChart` — a typed recharts composition over the shared `Chart` primitives. Plots a `series` list over one shared category axis where each entry picks its own render `type` (bar / line / area), in the caller's order (later entries paint on top). Shared `curve` / `barRadius` / `fillOpacity` controls and a themed tooltip/legend/axes/grid with caller-supplied series colors. No CVA variants (the mix is data-driven via `series[].type`). Initial version ported from the apps/demo `ComposedChartPlayground`; design + data-viz palette reconciliation pending.
