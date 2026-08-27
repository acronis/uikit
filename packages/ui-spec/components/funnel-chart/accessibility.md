# FunnelChart — accessibility

- **No name of its own.** `FunnelChart` sets no `role` and no `aria-*`, and it
  passes nothing down to the plot, so the `<title>`/`<desc>` pair the renderer
  emits stays empty. Put the name on the root, which spreads the props you give
  it: `aria-label` or `aria-labelledby` referencing a visible heading. Choose the
  role deliberately — `role="img"` names the chart but makes its subtree
  presentational, so a `<figure>` with a `<figcaption>` is often the better fit.
- recharts' `accessibilityLayer` is **on by default** (recharts v3) and is not
  switched off here, so the plot is a tab stop carrying `role="application"`.
  Until the chart is named, that focus stop announces neither a name nor any
  data. Watch recharts issue
  [#4809](https://github.com/recharts/recharts/issues/4809) on the a11y layer for
  heavily-customized charts.
- **A name is not a text alternative.** A funnel encodes numbers as geometry, so
  the numbers themselves have to be reachable as text — a caption, a summary
  sentence, or an adjacent table carrying the same values (including the
  drop-off between stages, which the funnel only implies).
- **The legend is the reliable text.** It is on by default and is ordinary HTML
  laid out beside the plot, so it reads in the accessibility tree: one row per
  stage, the marker and label on the inline start, the value on the inline end.
  The on-plot labels (`showLabels`, off by default) and value labels
  (`showValueLabels`) are real `<text>` rather than pixels, but they sit inside
  the SVG with no structural role, and a stage's name and its value are two
  separate lists on opposite sides with nothing tying them together.
- Do **not** rely on colour alone to distinguish stages. Keep the legend, the
  on-plot labels, or the tooltip visible so every colour is paired with a text
  label. A sequential ramp — the funnel's default palette — makes this stricter
  than a categorical one: adjacent stops are neighbouring shades of one hue, not
  distinct colours.

## Contrast

Chart chrome, the legend and the on-plot labels resolve to semantic `--ui-*`
tokens and meet contrast in light and dark: a label beside the funnel uses the
primary on-surface token, a label on a segment switches to the on-fill token
(white in both themes) so it survives a saturated stage fill. Stage fills come
from the `--ui-dataviz-*` palettes rather than from caller-supplied colours, so
their contrast against the surface is the design data's responsibility — but
picking a ramp still trades stage-to-stage distinguishability for its ordered
reading, so keep the stage count low.
