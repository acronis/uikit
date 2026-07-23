---
'@acronis-platform/ui-react': minor
---

Add `Histogram` — a frequency histogram over the shared `Chart` primitives. Takes raw `values` and bins them into `binCount` equal-width ranges (with an optional fixed `domain`), plotting the count of each as contiguous bars. Distinct from `BarChart`: the binning is the component's own job via a pure, unit-tested helper. Design-pending v1 — bar color is caller-supplied via `config` (no `--ui-chart-*` palette yet), Code Connect deferred.
