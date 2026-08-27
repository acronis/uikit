---
'@acronis-platform/ui-react': major
---

**FunnelChart**: aligned with the Figma widget (`ChartFunnel`, node `8811:175245`).

The funnel is now laid out the way `PieChart` and `RadialBarChart` already are: a
120×120 square plot, a 16px gutter, then the stage list taking the remaining
width. The component fills its parent's width and carries no height of its own,
so it no longer stretches into a tall, narrow wedge inside a widget body.

- The legend moves from **below** the funnel to **beside** it, as a two-column
  list — dot + label on the inline start, the stage's value on the inline end —
  and is now **on by default** (`showLegend` defaults to `true`).
- Legend values use `--ui-text-on-surface-primary`, matching the design; the
  donut/radial legends keep their link-coloured values.
- Legend markers now carry each stage's **resolved** palette colour. They
  previously referenced a `--color-*` custom property scoped to the chart
  container, which does not resolve outside it — so a legend rendered beside the
  plot painted its markers transparent.
- Stages are drawn with the design's 2px gap between them and 2px rounded
  corners (including the triangle's apex). recharts' `Funnel`/`Trapezoid` support
  neither, so the component supplies its own stage shape.
- On-plot stage labels are now **off by default** (`showLabels` defaults to
  `false`) — the design names the stages in the legend, not on the funnel.
- The default palette is the sequential blue ramp
  (`FUNNEL_CHART_DEFAULT_PALETTE`) rather than the shared categorical default: a
  funnel's stages are an ordered series.
- New `legendValueFormatter` prop for the value in each legend row.

**Breaking changes**

- `legendPos` is **removed**. The legend is beside the funnel, not on its top or
  bottom edge, so there is no edge to choose. Remove the prop; there is no
  replacement.
- `colorMode` and `gradientColor` are **removed**, along with the
  `FunnelChartColorMode` type. `palette` is now the only source of stage colour.
  Replace `colorMode="gradient"` with a sequential palette — e.g.
  `palette={{ type: 'sequential', ramp: 'blue' }}`, which is also the new default
  — or pin individual stages through `stageSettings`.
- `showLegend` now defaults to `true` and `showLabels` to `false`. A chart that
  relied on the old defaults must set them explicitly.
