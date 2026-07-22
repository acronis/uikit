# Treemap — accessibility

- recharts' `accessibilityLayer` is **on by default** (recharts v3), giving the
  chart keyboard focus and an accessible description of the plotted cells.
- A treemap is inherently visual (area is a weak quantitative encoding, small
  cells lose their labels). **Pair it with a text alternative** — a caption, a
  summary, or an adjacent data table carrying the same numbers — and give the
  chart an accessible name (`aria-label` / `aria-labelledby` referencing a visible
  heading). The wrapper forwards native `div` attributes, so `aria-*` pass
  through.
- Do **not** rely on color alone to distinguish cells. The on-cell labels name
  the larger cells; keep `showTooltip` on so small (unlabelled) cells are still
  identifiable on hover.
- On-cell labels use the `--ui-text-on-status-strong-neutral` token ("text on a
  strong colored surface", constant white in both themes) to read over the
  saturated series colors. This is legible on the chromatic brand/status tokens
  used here but is **not** guaranteed for arbitrary caller colors — pick cell
  colors dark enough for the light label text (matched per-cell label colors are a
  design-pending item for the `--ui-chart-*` palette). The tooltip chrome and cell
  separators resolve to semantic `--ui-*` tokens that meet contrast in both themes.
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer for heavily-customized charts.

## Contrast

Tooltip chrome and the surface-colored cell separators meet contrast in both
themes via the semantic tokens. Cell fills come from `config` and are the
caller's responsibility — keep them dark enough for the white on-cell labels, and
adjacent cells distinguishable from each other.
