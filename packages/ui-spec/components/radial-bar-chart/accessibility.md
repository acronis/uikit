# RadialBarChart — accessibility

- recharts' `accessibilityLayer` is **on by default** (recharts v3), giving the
  chart keyboard focus and an accessible description of the plotted arcs.
- A radial bar chart is inherently visual and hard to read precisely (arc length
  on a curve is a poor quantitative encoding). **Pair it with a text
  alternative** — a caption, a summary, or an adjacent data table carrying the
  same numbers — and give the chart an accessible name (`aria-label` /
  `aria-labelledby` referencing a visible heading). The wrapper forwards native
  `div` attributes, so `aria-*` pass through.
- Do **not** rely on color alone to distinguish arcs. Keep `showLegend` (or the
  tooltip) visible so each color is paired with a text label — the radial arcs
  carry no inline labels of their own.
- The chrome (tooltip, legend) and the muted background track resolve to semantic
  `--ui-*` tokens that meet contrast in light and dark. **Arc colors are
  caller-supplied** via `config` — pick values that meet 3:1 against the surface
  and are distinguishable for color-vision deficiencies. The borrowed semantic
  tokens are a design-pending stopgap until the `--ui-chart-*` palette lands.
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer for heavily-customized charts.

## Contrast

Chart chrome and the background track meet contrast in both themes via the
semantic tokens. Arc fills come from `config` and are the caller's
responsibility — keep adjacent arcs distinguishable from each other.
