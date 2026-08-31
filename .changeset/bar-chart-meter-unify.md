---
'@acronis-platform/ui-react': minor
---

feat(BarChart): unify BarChart + Meter, add palette support and horizontal forecast

- **BREAKING**: `orientation="horizontal"` now renders labelled proportional bars (label + value + percentage + track) instead of a recharts horizontal bar chart. Pass `items` (an array of `{ label, value, color }`) and an optional `max`.
- **BREAKING**: `Meter` removed — use `<BarChart orientation="horizontal" />`.
- **BREAKING**: `xUnit` removed. It only applied to the recharts horizontal orientation, whose numeric X axis is gone; the value axis is always Y, so use `yUnit`.
- **BREAKING**: `gridDashed` now defaults to `true` (pass `gridDashed={false}` for solid grid lines).
- New: `palette` prop on `BarChartHorizontalProps` — resolves item colors through the same palette machinery as the vertical chart. Items can now carry `tone` instead of (or alongside) `color`.
- New: `forecast` on `BarChartItem` — renders a translucent bar (30% opacity) extending beyond the actual value. `aria-valuetext` includes the forecast; `aria-valuenow` reflects the actual value only.
- New types: `BarChartItem`, `BarChartHorizontalProps`, `BarChartVerticalProps`. `BarChartProps` is now the discriminated union of the last two.
- Figma Code Connect maps vertical, horizontal, and horizontal-forecast Figma nodes.
