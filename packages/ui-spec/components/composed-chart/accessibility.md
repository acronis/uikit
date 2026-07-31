# ComposedChart — accessibility

- recharts' `accessibilityLayer` is **on by default** (recharts v3), giving the
  chart keyboard focus and an accessible description of the plotted points.
- The **range brush** (`showBrush`) is the only interactive control these charts
  render. It adds two focusable `role="slider"` handles: Tab reaches each one and
  the left/right arrow keys move the selection a row at a time, so the whole
  feature is operable without a pointer.
  - Both handles take their accessible name from `brushAriaLabel` (default
    `'Chart range selector'`); pass your own to localize it. Never leave it to
    recharts' fallback, which names the handles from a `name` field on the data
    row and otherwise announces "Min value: undefined, Max value: undefined".
  - The handles keep a visible focus indicator: the shared `ChartContainer`
    suppresses outlines on recharts layers, so it re-enables one for
    `.recharts-brush-traveller` specifically (an `outline`, since `box-shadow`
    does not paint on SVG children).
  - The two range captions only appear while a handle is hovered, dragged, or
    focused — they are a supplement to the category axis, not a replacement for
    it. Zooming changes which rows are plotted, so **pair the brush with a text
    alternative that reflects the current range** rather than the full series.
- A composed chart is inherently visual. **Pair it with a text alternative** — a
  caption, a summary sentence, or an adjacent data table carrying the same
  numbers — and give the chart an accessible name (`aria-label` /
  `aria-labelledby` referencing a visible heading) when it is meaningful on its
  own. The wrapper forwards native `div` attributes, so `aria-*` pass through.
- Do **not** rely on color alone to distinguish series. Keep `showLegend` (or the
  tooltip) visible so each color is paired with a text label; the differing
  render types (bar vs line vs area) add a second, non-color channel.
- Mixed series can share one value axis even when their magnitudes differ wildly
  (e.g. revenue vs order-count) — call out the scale in the caption so a small
  bar next to a tall line isn't misread.
- With **two value axes** (`yAxis: 'secondary'`), which series is measured against
  which scale is conveyed by position alone: nothing in the legend, the tooltip,
  or the accessible description names an axis, and the tooltip renders the two
  values without their units. Say it in the text alternative — "revenue in $ on
  the left, conversion in % on the right" — and prefer a `secondaryYAxisLabel` +
  `yAxisLabel` pair so the mapping is at least visible to a sighted reader.
- The chrome (tooltip, legend, axis ticks, grid) resolves to semantic `--ui-*`
  tokens that meet contrast in light and dark. **Series colors are
  caller-supplied** via `config` — pick values that meet 3:1 against the surface
  and are distinguishable for color-vision deficiencies. The borrowed semantic
  tokens are a design-pending stopgap until the `--ui-chart-*` palette lands.
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer for heavily-customized charts.

## Contrast

Chart chrome meets contrast in both themes via the semantic tokens. Series fills
and strokes come from `config` and are the caller's responsibility — note that an
area's translucent `fillOpacity` lowers its effective contrast against the surface.
