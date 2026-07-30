---
'@acronis-platform/ui-react': minor
---

Add opt-in data labels to the Bar, Line, Area, Composed, Radar, RadialBar, and Pie charts via shared `showLabels` / `labelPosition` / `labelFormatter` props (a themed `LabelList` over the shared chart utils, reusing the axis tick formatters). Off by default, so charts without it render unchanged.
