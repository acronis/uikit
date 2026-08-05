---
'@acronis-platform/ui-react': minor
---

Add the polar axes, geometry, and per-series styling to `RadarChart`. The chart now has a value scale: `showRadiusAxis` draws a `PolarRadiusAxis` (`radiusAxisAngle` / `radiusAxisOrientation` / `radiusAxisTickCount` / `radiusAxisReversed`), and `radiusAxisDomain="fixed"` with `radiusAxisDomainMax` pins the outer ring to a known maximum so the areas read as absolute profiles instead of being stretched to the largest value in the data — that rescaling applies whether or not the scale itself is shown.

The categorical axis and the web are configurable too (`showAngleAxis`, `angleAxisOrientation`, `angleAxisLine`, `angleAxisLineType`, `angleTickLine`, `angleTickSize`, `radialLines`), as is the geometry (`cx`, `cy`, `startAngle`, `endAngle`, `innerRadius`, `outerRadius`, `margin`). `seriesSettings` overrides colour, outline, and dots for one series while the rest keep the chart-level values; `dotRadius`, `activeDot`, and `legendPosition` cover the remaining chart-level knobs.

The new props are additive: with all of them unset the rendered output is unchanged.

One pre-existing behavior is fixed alongside them. A radar area is a translucent fill, so a value label placed on it (`labelPosition="insideEnd"` and the other `inside*` / `center*` positions) now uses the theme-inverting on-surface token instead of the white on-fill one, matching `AreaChart` and the composed chart's areas — the white token was disappearing into the tinted surface in light mode. Labels at the default `top` position are unaffected.
