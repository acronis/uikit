---
'@acronis-platform/ui-react': minor
---

Add `FunnelChart` — a typed recharts composition over the shared `Chart` primitives. Plots a single series of stages (rows) as stacked, narrowing segments, with per-stage `Cell` colors from a `nameKey`-keyed `config`, on-chart stage labels, and a themed tooltip (no legend — the inline labels name every stage). One `lastShape` variant (triangle / rectangle) plus a `reversed` toggle. Initial version ported from the apps/demo `FunnelChartPlayground`; design + data-viz palette reconciliation pending.
