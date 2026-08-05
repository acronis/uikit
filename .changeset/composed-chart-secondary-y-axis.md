---
'@acronis-platform/ui-react': minor
---

Add an opt-in secondary Y axis to `ComposedChart`. A series selects it with `yAxis: 'secondary'`, and the second axis renders on the side opposite the primary one with its own unit, tick formatter, tick count, and domain (`secondaryYUnit`, `secondaryYTickFormatter`, `secondaryYAxisTickCount`, `secondaryYAxisDomain`, `secondaryYAxisLabel`, `showSecondaryYAxis`). This is what a composed chart needs to plot two measures whose units or magnitudes differ — a count next to a rate — where one shared scale flattens the smaller series onto the baseline. `yAxisOrientation` moves the primary axis to the right and mirrors the pair.

The axis is derived from the series rather than a flag of its own, so the two unrenderable states can't be expressed: an axis with no series measured against it, and a series pointing at an axis that was never declared. A chart where no series opts in keeps the primary axis's implicit recharts id and renders byte-identically — verified by diffing the rendered SVG of every existing `ComposedChart` story before and after. The grid's horizontal lines stay bound to the primary axis; a second set from a different domain would cross the first at meaningless heights.

`ComposedChart` is the only chart that takes these props: its series already differ in mark type, so a bar read against the left axis and a line against the right can't be mistaken for two marks sharing one scale.
