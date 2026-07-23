# ConfidenceCone — accessibility

- recharts' `accessibilityLayer` is **on by default** (recharts v3), giving the
  chart keyboard focus and an accessible description of the plotted series.
- A forecast cone is inherently visual. **Pair it with a text alternative** — a
  caption or an adjacent table with the actual, forecast, and bound values — and
  give the chart an accessible name (`aria-label` / `aria-labelledby`). The
  wrapper forwards native `div` attributes, so `aria-*` pass through.
- Don't rely on color or line style alone: the legend labels the actual vs
  forecast series, and the tooltip carries the values. The dashed forecast line
  is a redundant cue on top of color, not the only distinction.
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer for heavily-customized charts.

## Contrast

Tooltip chrome, axis labels, and the grid meet contrast in both themes via the
semantic tokens. The actual/forecast line colors come from `config` and are the
caller's responsibility; the cone band is a low-opacity tint of the forecast
color, intended as a secondary cue behind the lines.
