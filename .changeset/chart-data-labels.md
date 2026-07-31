---
'@acronis-platform/ui-react': minor
---

Add opt-in data labels to the Bar, Line, Area, Composed, Radar, RadialBar, and Pie charts via shared `showLabels` / `labelPosition` / `labelFormatter` props (a themed `LabelList` over the shared chart utils, reusing the axis tick formatters). Off by default, so charts without it render unchanged.

Label placement and colour are resolved per family so the value stays legible: labels drawn on an opaque series fill (any `inside*` position, a stacked bar segment, an on-arc polar placement) use the on-fill text token instead of the on-surface one, area series keep the on-surface token at every position because their fill is translucent, stacked Bar/Area segments centre their value rather than overflowing into the next segment, and Pie/RadialBar accept the polar positions recharts actually honors — Pie defaulting to `outside`. `labelFormatter` no longer coerces a `null` gap into a printed value.
