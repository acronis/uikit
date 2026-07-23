# Histogram — accessibility

- recharts' `accessibilityLayer` is **on by default** (recharts v3), giving the
  chart keyboard focus and an accessible description of the plotted bins.
- A histogram is inherently visual. **Pair it with a text alternative** — a
  caption, a summary, or an adjacent data table carrying the same counts — and
  give the chart an accessible name (`aria-label` / `aria-labelledby` referencing
  a visible heading). The wrapper forwards native `div` attributes, so `aria-*`
  pass through.
- Do **not** rely on the bar color alone — the x-axis bin labels and the tooltip
  (kept on via `showTooltip`) carry the range and count. Keep enough bins for the
  distribution to be legible, but not so many that labels collide.
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer for heavily-customized charts.

## Contrast

Tooltip chrome, axis labels, and the grid meet contrast in both themes via the
semantic tokens. The bar fill comes from `config` and is the caller's
responsibility — pick a token with sufficient contrast on the surface.
