---
'@acronis-platform/ui-react': minor
---

Add `Meter` — a labelled proportional bar for a value within a known range (a fractional value / share), built on Base UI's `Meter` (`role="meter"`, like the HTML `<meter>` element), as opposed to `Progress`/`ProgressCircle` which track a task over time. One row: label + `value · %` over a track bar, with a chart-style hover tooltip (light card); stack several sharing one `max` to build a ranked breakdown (a "bar list"). Fill color is caller-supplied per row. Design-pending v1 — no `--ui-chart-*` palette yet, Code Connect deferred.
