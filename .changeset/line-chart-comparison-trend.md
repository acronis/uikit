---
'@acronis-platform/ui-react': minor
---

`LineChart`: add QoQ/YoY trend-comparison support — `comparisonKeys` renders a subset of `dataKeys` as dashed, dimmed, dot-less overlays (e.g. a previous quarter or year) keeping each series' own `config` color, and `deltaBands` shades the gap between `[current, comparison]` pairs with a dimmed area (the delta) behind the lines. (Internally the chart now composes over recharts' `ComposedChart` so lines and the band coexist.)
