---
'@acronis-platform/ui-react': minor
---

`BarChart`: add a `referenceLine` prop — one or more dashed reference/average lines on the value axis (Y for vertical bars, X for horizontal). Pass a single config or an array. Each is driven by a fixed `value`, or a computed `average` (the mean of one series by key, or of every plotted series when `true`), with an optional `label` caption. Themed from the existing `--ui-text-on-surface-secondary` token.
