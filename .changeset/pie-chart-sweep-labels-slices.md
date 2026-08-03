---
'@acronis-platform/ui-react': minor
---

Extend `PieChart` with the arc geometry, slice labelling and per-slice controls it was missing. `startAngle` / `endAngle` / `minAngle` shape the sweep (semicircles and arcs) and `cornerRadius` rounds each slice. Data labels gain a `labelFormat` preset (`value` · `name-value` · `name-percent` · `percent`, where a percentage is the slice's share of the total to one decimal) and an opt-in `labelLine` that draws a leader line to each label in the slice's own colour. `sliceSettings` overrides one slice at a time — its `color`, whether it carries a label, and that label's format — and a slice whose label is hidden loses its leader line too. `tooltipFormat="value-percent"` covers the value-and-share tooltip without hand-rolling a `tooltipContent`, and `legendPos` / `margin` place the legend and the plot area. Everything is opt-in, so an existing chart renders unchanged.
