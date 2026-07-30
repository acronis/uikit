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
formatter. Also adds `xAxisAngle`, `xAxisInterval`, `yAxisTickCount`,
`yAxisDomain` (`auto`/`dataMin-dataMax`/`zero`), and `gridDashed` /
`gridHorizontal` / `gridVertical` for tick placement, domain, and grid trim.
These shared props live on a common `CartesianChartProps` interface (which also
now carries the previously per-chart `showGrid` / `showTooltip` / `xAxisLabel` /
`yAxisLabel` / `yUnit` / `tooltipContent`). Defaults preserve existing rendering.

Notes on the value-axis props:

- `yAxisDomain="auto"` fits the data at both ends and need not include 0.
  Omitting the prop keeps recharts' default, which is already zero-anchored — so
  `zero` is the explicit form of that default, not a change to it.
- `yAxisTickCount` / `yAxisDomain` drive whichever axis carries the values: Y for
  most charts, X for `BarChart` with `orientation="horizontal"` (recharts ignores
  both on a category axis).
- `xAxisInterval`'s numeric form is the number of ticks _skipped_ between two
  rendered ones (recharts `interval`), so `2` shows every third tick.
- `xAxisAngle` and `xAxisLabel` can be combined; the X axis reserves room for both.
- The bundled `formatCompactNumber` / `formatPercent` format in `en`; use
  `createTickFormatter(options, locale)` for anything else. Blank and
  whitespace-only tick values pass through all three unchanged.
