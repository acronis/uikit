# PieChart — accessibility

- recharts' `accessibilityLayer` is **on by default** (recharts v3), giving the
  chart keyboard focus and an accessible description of the plotted slices.
- A pie chart is inherently visual. **Pair it with a text alternative** — a
  caption, a summary sentence, or an adjacent data table carrying the same
  numbers — and give the chart an accessible name (`aria-label` /
  `aria-labelledby` referencing a visible heading) when it is meaningful on its
  own. The wrapper forwards native `div` attributes, so `aria-*` pass through.
- Do **not** rely on color alone to distinguish slices. Keep `showLegend` (or the
  tooltip) visible so each color is paired with a text label. Pie charts read
  poorly with many similar-sized slices — prefer a handful of slices and combine
  the tail into an "Other" slice.
- The chrome (tooltip, legend) resolves to semantic `--ui-*` tokens that meet
  contrast in light and dark. **Slice colors are caller-supplied** via `config` —
  pick values that meet 3:1 against the surface and are distinguishable for
  color-vision deficiencies (adjacent slices especially). The borrowed semantic
  tokens are a design-pending stopgap until the `--ui-chart-*` palette lands.
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer for heavily-customized charts.

## Contrast

Chart chrome meets contrast in both themes via the semantic tokens. Slice fills
come from `config` and are the caller's responsibility — keep adjacent slices
distinguishable, not just against the surface but from each other.
