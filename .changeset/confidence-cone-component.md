---
'@acronis-platform/ui-react': minor
---

Add `ConfidenceCone` — a forecast chart over the shared `Chart` primitives, shown as one metric in one color: a solid line + filled area over the actual period, a dashed line over the forecast, and a shaded prediction band (the "cone") between a lower and upper bound that widens with the horizon. A dashed divider and a subtle shaded region set the forecast off from the actuals (`showForecastRegion`). Composes over recharts' `ComposedChart`; the synthetic band range series is filtered out of the tooltip and legend, and the areas never mark points. Distinct from the conversion `FunnelChart`. Design-pending v1 — metric color caller-supplied via `config` (no `--ui-chart-*` palette yet), Code Connect deferred.
