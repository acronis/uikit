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
- On-cell labels **adapt their text color** to three fill tones (structural,
  based on the token name suffix — not a runtime luminance check):
  - **dark** (diverging a3/b3, sequential 3–6, categorical, status): white via
    `--ui-text-on-status-strong-neutral`.
  - **pale** (diverging a2/b2/a1/b1, sequential 1–2): dark/light via
    `--ui-text-on-surface-primary`.
  - **inverts** (sequential 7–8, whose fills mirror across themes): near-white
    in light, near-black in dark via `--ui-text-on-status-strong-primary`.
    The tooltip chrome and cell separators resolve to semantic `--ui-*` tokens
    that meet contrast in both themes.
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer for heavily-customized charts.

## Contrast

Tooltip chrome and the surface-colored cell separators meet contrast in both
themes via the semantic tokens. Cell fills come from the active palette's
`--ui-dataviz-*` tokens. The adaptive label text ensures contrast on every
palette-assigned stop; adjacent cells are kept distinguishable by the
interleaved/ramp ordering of the palette.
