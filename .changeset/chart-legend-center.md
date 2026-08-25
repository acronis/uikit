---
'@acronis-platform/ui-react': patch
---

fix(charts): center legend + gap-24 across all cartesian charts

`ChartLegendContent` now uses `justify-center gap-x-6` (24 px column gap,
centred) instead of `justify-start gap-x-4`, matching the Figma spec
(nodes 8700:55607, 8174:22232, 8811:175677, 9005:73829).
Row wrap gap (`gap-y-2`) is unchanged.

Legend markers are now always circular dots, consistent with tooltip row
indicators. The previous per-series marker logic (square swatch for filled
series, line/dashed line for stroke series) is removed.
