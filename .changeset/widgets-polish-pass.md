---
'@acronis-platform/ui-react': patch
---

Polish pass over the widget set: no API changes, two new styling hooks.

`SankeyChart`'s node legend and `ConfidenceCone`'s cone band each gained a
`data-slot` (`sankey-chart-legend`, `confidence-cone-band`). Both existed only as
unlabelled markup: the Sankey legend was indistinguishable from the node labels
in the SVG, and the cone band is a stroke-less `<Area>` painting in the same hue
at the same opacity as its metric's own area — telling them apart meant relying
on `stroke-width`, which is an accident of the two elements' props rather than a
contract. They are addressable now, for styling as well as for tests.

Everything else here is internal. The axis boilerplate every cartesian chart had
copied — the rotated-tick `text-anchor` ternary, the X-axis height allowance, and
the two axis-title objects — is now shared as `resolveRotatedTickAnchor`,
`resolveXAxisHeight`, `resolveXAxisTitle` and `resolveYAxisTitle`, replacing seven
copies of each. Ten components — the shared `Chart` primitives plus
`ComposedChart`, `BarChart`, `ConfidenceCone`, `RadarChart`, `PieChart`,
`LineChart`, `AreaChart`, `CategoryBar` and `Metric` — had their deepest JSX
lifted into named pieces. The rendered output is unchanged: it was verified by
diffing the serialized markup of several dozen prop combinations per component
against the previous implementation, and the visual-regression baselines did not
move.
