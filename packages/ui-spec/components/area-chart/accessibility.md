# AreaChart — accessibility

- recharts' `accessibilityLayer` is **on by default** (recharts v3), giving the
  chart keyboard focus and an accessible description of the plotted points.
- An area chart is inherently visual. **Pair it with a text alternative** — a
  caption, a summary sentence, or an adjacent data table carrying the same
  numbers — and give the chart an accessible name (`aria-label` /
  `aria-labelledby` referencing a visible heading) when it is meaningful on its
  own. The wrapper forwards native `div` attributes, so `aria-*` pass through.
- Do **not** rely on color alone to distinguish series. Keep `showLegend` (or the
  tooltip) visible so each color is paired with a text label. Overlapping
  translucent fills can be hard to read — prefer `layout="stacked"` or a solid
  `fill` when legibility matters, and keep enough opacity contrast between series.
- The chrome (tooltip, legend, axis ticks, grid) resolves to semantic `--ui-*`
  tokens that meet contrast in light and dark. **Series colors are
  caller-supplied** via `config` — pick values that meet 3:1 against the surface
  and are distinguishable for color-vision deficiencies. The borrowed semantic
  tokens are a design-pending stopgap until the `--ui-chart-*` palette lands.
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer for heavily-customized charts.

## Contrast

Chart chrome meets contrast in both themes via the semantic tokens. Area fills
and strokes come from `config` and are the caller's responsibility — note that
translucent fills (solid `fillOpacity`, gradient stops) lower the effective
contrast against the surface.
