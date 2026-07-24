---
'@acronis-platform/ui-react': minor
---

Add `TrendIndicator` — a small presentational primitive showing how a metric
changed (a direction glyph + a caller-formatted value + an optional comparison
label). It separates `direction` (up/down/flat) from `sentiment`
(positive/negative/neutral) so the kit never assumes up = good; renders inline or
as a compact status-tinted badge in two sizes, with an optional tooltip and an
`ariaLabel` for a full accessible sentence. Purely presentational — never
computes or formats the trend (initial version; design + data-viz reconciliation
pending).
