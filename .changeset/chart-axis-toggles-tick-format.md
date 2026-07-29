---
'@acronis-platform/ui-react': minor
---

Add axis visibility toggles and tick value formatting to the cartesian charts
(`BarChart`, `LineChart`, `AreaChart`, `ComposedChart`, `ScatterChart`,
`ConfidenceCone`, `Histogram`). Each now accepts `showXAxis` / `showYAxis`
(default `true`) to hide either axis, and `xTickFormatter` / `yTickFormatter` to
format tick values. Ships shared `formatCompactNumber` (thousands/millions),
`formatPercent`, and a `createTickFormatter(Intl.NumberFormatOptions)` factory
(for currency, fixed decimals, locales) — any function is also a valid
formatter. Defaults preserve existing rendering.
