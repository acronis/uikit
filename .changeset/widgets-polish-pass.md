---
'@acronis-platform/ui-react': minor
---

Polish pass over the widget set: an RTL fix, two new styling hooks, and four new
exported axis helpers.

`ChartContainer` now pins `.recharts-surface` to `direction: ltr`. recharts
anchors its axis tick text with the direction-relative SVG keywords
(`text-anchor: start|end`) while placing every mark at a computed physical
coordinate, so a chart inheriting `dir="rtl"` flipped only its text: `end`-anchored
Y-axis ticks mirrored about their anchor and landed inside the plot (24–39px),
rotated ticks shifted ~15px, and a `ReferenceLine` label at the right edge
overflowed the surface. Pinning the surface keeps the plot's coordinate system
consistent with the geometry recharts computed for it, and leaves the chrome that
should mirror — tooltip and legend, which are HTML outside the surface —
untouched. Verified in a browser against every cartesian story: the pin restores
LTR geometry under `dir="rtl"` and is a no-op under `dir="ltr"`, so no
visual-regression baseline moved.

`SankeyChart`'s node legend and `ConfidenceCone`'s cone band each gained a
`data-slot` (`sankey-chart-legend`, `confidence-cone-band`). Both existed only as
unlabelled markup: the Sankey legend was indistinguishable from the node labels
in the SVG, and the cone band is a stroke-less `<Area>` painting in the same hue
at the same opacity as its metric's own area — telling them apart meant relying
on `stroke-width`, which is an accident of the two elements' props rather than a
contract. They are addressable now, for styling as well as for tests.

The axis boilerplate every cartesian chart had copied — the rotated-tick
`text-anchor` ternary, the X-axis height allowance, and the two axis-title
objects — is now shared as `resolveRotatedTickAnchor`, `resolveXAxisHeight`,
`resolveXAxisTitle` and `resolveYAxisTitle`, replacing seven copies of each.
These four are exported from the `chart` barrel and so are additions to the
package's public surface, which is what makes this a minor rather than a patch.

Ten components — the shared `Chart` primitives plus `ComposedChart`, `BarChart`,
`ConfidenceCone`, `RadarChart`, `PieChart`, `LineChart`, `AreaChart`,
`CategoryBar` and `Metric` — had their deepest JSX lifted into named pieces. That
part changes no rendered output: it was verified by diffing the serialized markup
of several dozen prop combinations per component against the previous
implementation, and the visual-regression baselines did not move.
