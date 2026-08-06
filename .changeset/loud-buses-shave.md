---
'@acronis-platform/ui-react': minor
---

feat(charts): plot several metrics in one `ConfidenceCone`, with optional bands, thresholds, dots and styled forecast ticks

`ConfidenceCone` now takes a `series` array — one entry per metric, each naming
its own actual / forecast / bound columns and taking its hue from
`config[actualKey]` — so several forecasts share one axis with independent cones.
Every synthetic band is stripped from the tooltip and legend, and the legend
names each metric once. The single-series `actualKey` / `forecastKey` /
`lowerKey` / `upperKey` props stay as the shorthand for one metric.

`lowerKey` / `upperKey` are now optional: omit them for a band-less projection (a
bare dashed forecast line) when a model gives a point estimate but no interval.

New props: `actualType` (draw the observed period as a bare `line` instead of the
default filled `area`, so the cone stays the only shaded region), `referenceLine`
(one or more dashed horizontal thresholds on the value axis, with an optional
caption), `showDots` (filled dots on the observed values, hollow ones on the
projection) and `styleForecastTicks` (italic, metric-colored X ticks over the
projected period).

`keepMetricSeries` now takes an array of actual keys instead of a single key.
