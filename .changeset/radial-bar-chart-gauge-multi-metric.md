---
'@acronis-platform/ui-react': minor
---

Extend `RadialBarChart` into a gauge primitive. `valueDomain` scales the arcs against a known range (without it a single value always fills the sweep, so a gauge could not read correctly), `centerLabel` renders a headline value and caption in the hole, and `segments` / `segmentGap` draw a single-value gauge's ring as notched segments — the reached ones in the arc's color, the rest in the muted track. `dataKeys` adds multi-metric mode (one arc per metric, colored and named from `config` keyed by the metric, as on the cartesian charts), `labelFormat` lets a data label read `name-value`, and `cx` / `cy` / `barSize` / `barGap` / `barCategoryGap` / `minAngle` / `margin` / `showPolarGrid` expose the remaining geometry. All additive: with the new props unset the rendered output is unchanged.
