# Chart — accessibility

- Charts are inherently visual. recharts renders an SVG surface; on its own a
  chart conveys little to assistive tech, so **pair every chart with a text
  alternative** — a caption, a summary sentence, or an adjacent data table that
  carries the same numbers.
- Give the `ChartContainer` an accessible name when the chart is meaningful on its
  own (`aria-label` / `aria-labelledby` referencing a visible heading).
- Do **not** rely on color alone to distinguish series. The legend pairs each
  color swatch with a text label, and the tooltip shows series names next to
  values — keep both visible (don't `hideLabel` + `hideIndicator` together).
- The tooltip surface uses `--ui-background-surface-primary` with
  `--ui-text-on-surface-primary` values and `--ui-text-on-surface-secondary`
  labels; axis ticks use the muted token. These meet contrast in light and dark.
  Series colors are caller-supplied — pick values that meet 3:1 against the
  surface and are distinguishable for color-vision deficiencies.

## Contrast

The chart chrome (tooltip, legend, axis labels, grid) resolves to semantic
`--ui-*` tokens that meet contrast in both themes. Series fills/strokes come from
`config` and are the caller's responsibility.
