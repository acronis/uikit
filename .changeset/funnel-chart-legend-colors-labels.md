---
'@acronis-platform/ui-react': minor
---

feat(charts): add a legend, gradient coloring, per-stage overrides and advanced labels to FunnelChart

`FunnelChart` had a `lastShape` variant, `reversed`, and one fixed right-hand name
label per stage. It now covers the rest of what a funnel needs, all opt-in.

**Legend.** `showLegend` renders one entry per visible stage — labelled, colored
and marked like every other chart's legend, because it goes through the shared
`ChartLegendContent` — and `legendPos` moves it to the top edge. The renderer
builds no legend payload for a funnel series (unlike bar/line/area/pie/radar), so
the component synthesizes one from its visible stages; without that a `<Legend>`
inside a funnel renders empty.

**Labels.** `labelFormat` says what a label carries — `name` (the default),
`value`, `percent`, or a `name-value` / `name-percent` / `value-percent` pair —
where a percentage is the stage's conversion from the widest stage, not a share of
the sum, because a funnel's stages are nested subsets rather than parts of a
whole. The base is the largest value rather than the first row, so an unsorted
funnel still tops out at 100%. `labelPosition` places it beside the segment or on
it, switching to the on-fill color token so an on-segment label keeps its
contrast; `labelFill` overrides that, `labelFormatter` formats the value and
`percentFormatter` the share — separately, so a locale that doesn't write a bare
`%` can replace only the latter. `showValueLabels` + `valuePosition` add a second
label, so a stage's name and its number can sit on opposite sides of the funnel;
`valuePosition` defaults to the side **opposite** `labelPosition`, following the
names instead of pinning itself to one edge.

A composite label beside the funnel narrows the **funnel** to make room for
itself. The renderer word-wraps a label against the gap between its own segment
and the plot area's edge, so a margin can't create that room — it moves the edge
inward together with the funnel and leaves the label with less. Narrowing the
funnel is the lever that works, because the plot area stays put. `margin` reserves
the side a label list sits on so unwrappable text isn't clipped at the SVG edge,
and is merged over the defaults per side, so passing one side keeps the others.

An on-segment (`inside`) label is legible only while every stage is wide enough to
hold its text; a funnel narrows, so its tail stages often aren't. That's why the
value labels default to the side opposite the names rather than onto the segments,
and why `inside` is documented as wanting a short format with the names in the
legend. A composite **left-hand** label wraps regardless: the widest segment
always sits flush against the plot area's left edge, so there is no room to free.

**Coloring.** `colorMode="gradient"` ramps one hue — `gradientColor`, or the first
visible stage's own color, including a `stageSettings` color set on it — from the
widest stage to the narrowest, mixing it toward the surface so every segment stays
opaque. `stageSettings` overrides one stage at a time: `color` wins over both
`config` and `colorMode`, and `hidden` drops the stage from the funnel, its
labels, the legend, and the conversions.

**Segment style.** `stroke` / `strokeWidth` border the segments — `strokeWidth`
alone pairs with the border token, since the renderer's own default there is a
hardcoded white the container neutralizes — `funnelWidth` narrows the shape,
`margin` sets the plot-area inset, and `showActiveShape` outlines the hovered
segment instead of changing its fill.

Every prop is opt-in and the defaults are unchanged, so an existing funnel renders
exactly as before.
