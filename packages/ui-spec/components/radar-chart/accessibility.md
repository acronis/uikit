# RadarChart — accessibility

- recharts' `accessibilityLayer` is **on by default** (recharts v3), giving the
  chart keyboard focus and an accessible description of the plotted points.
- A radar chart is inherently visual (and hard to read precisely — overlapping
  areas, angular value judgement). **Pair it with a text alternative** — a
  caption, a summary, or an adjacent data table carrying the same numbers — and
  give the chart an accessible name (`aria-label` / `aria-labelledby` referencing
  a visible heading). The wrapper forwards native `div` attributes, so `aria-*`
  pass through.
- Do **not** rely on color alone to distinguish series. Keep `showLegend` (or the
  tooltip) visible so each color is paired with a text label; keep `fillOpacity`
  low enough that overlapping areas remain distinguishable.
- The chrome (tooltip, legend, polar grid) resolves to semantic `--ui-*` tokens
  that meet contrast in light and dark. The component adds a local override so the
  **angle-axis (spoke) labels** use `muted-foreground` — without it they render
  near-black and disappear in dark mode (the shared container themes only
  cartesian axis ticks; this is a tracked shared-primitives gap). **Series colors
  are caller-supplied** via `config` — pick values that meet 3:1 against the
  surface and are distinguishable for color-vision deficiencies. The borrowed
  semantic tokens are a design-pending stopgap until the `--ui-chart-*` palette
  lands.
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer for heavily-customized charts.

## Contrast

Chart chrome and the spoke labels meet contrast in both themes via the semantic
tokens. Radar area fills/strokes come from `config` and are the caller's
responsibility — translucent overlapping fills lower effective contrast.
