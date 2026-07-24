---
'@acronis-platform/ui-react': minor
---

Add `Metric` — a presentational dashboard metric card modelled on the MetricCard
design: a label (+ optional caption) over a primary value with an optional
status-tinted icon badge, unit, and trend, plus optional supporting text and a
composable `children` body (a chart, a `Meter` breakdown, a `Separator`, an
insight line). It is a Card and composes `TrendIndicator` for the trend slot;
`size` scales the typography, `status` subtly tints the icon badge, and `loading`
shows a skeleton. Purely presentational — the consumer passes a ready-formatted
value and resolved status; the kit never computes, formats, or interprets the
data. Initial version (design + token-tier reconciliation pending).
