# SankeyChart — accessibility

- **recharts gives a Sankey no accessibility layer.** Unlike the cartesian charts,
  recharts' `Sankey` (v3.8) implements no `accessibilityLayer`: it renders no
  `role`, no `tabIndex`, and no generated description, so the plot is **not
  keyboard-focusable** and its hover tooltip is pointer-only. Treat the chart as
  an image and carry the numbers in accessible content next to it.
- A Sankey is inherently visual (ribbon width is a weak quantitative encoding).
  **Pair it with a text alternative** — a caption, a summary, or an adjacent
  legend/table carrying the same numbers (as the reference "Certification
  compliance" usage does) — and give the chart an accessible name (`aria-label` /
  `aria-labelledby` referencing a visible heading). The wrapper forwards native
  `div` attributes, so `aria-*` pass through.
- Do **not** rely on color alone to distinguish nodes/flows. Keep `showLabels` on
  (or supply an external legend) so each node is named, and keep `showTooltip` on
  so values are recoverable on hover.
- Node labels use the `--ui-text-on-surface-primary` token (fill-foreground), so
  they read on the themed surface in both modes. Node/link colors come from
  `config` and are the caller's responsibility — keep adjacent nodes
  distinguishable and flows legible at the low ribbon opacity (matched data-viz
  colors are a design-pending item for the `--ui-chart-*` palette).
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer — if `Sankey` ever gains one, this component should adopt it
  instead of relying purely on the caller's text alternative.

## Contrast

Tooltip chrome and node labels meet contrast in both themes via the semantic
tokens. Node bar fills and link ribbon tints come from `config` and are the
caller's responsibility — pick node colors that stay distinguishable from each
other and legible as ~35%-opacity ribbons.
