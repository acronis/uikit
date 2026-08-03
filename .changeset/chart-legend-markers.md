---
'@acronis-platform/ui-react': minor
---

Give the chart legend and tooltip one marker vocabulary each.

**Legend.** The shared `ChartLegendContent` lays its entries out from the start edge (they were centred) and marks a series after what it paints: a 10px `rounded-sm` swatch for a filled series (it was an 8px one), or a 16×3px line for a stroke-drawn one — recharts types both `<Line>` and `<Area>` as `line` — painted as a repeating gradient when the series carries a `strokeDasharray`, so a dashed line reads as dashed. A stroke series that should still read as one swatch sets `legendType="rect"`.

**Tooltip.** Every row keeps a round color dot, whatever marker the legend gives that series. **Breaking:** `ChartTooltipContent`'s `indicator` prop (`'dot' | 'line' | 'dashed'`) is gone along with its vertical-bar and dashed-rule shapes — nothing in the kit used them, and they matched neither the dot nor the legend's line. `hideIndicator` still hides the dot. A caller passing `indicator` should drop the prop; a chart needing a different row marker can render its own `tooltipContent`.

`CategoryBar` and `SankeyChart` build their own legends; their swatches switch from a circle to the same `rounded-sm` square, while their layouts (a distributed stat row and a two-column grid) stay as they are. Their tooltip dots stay round.

`ConfidenceCone` now names its metric once in the legend: actual, forecast and the cone band are three recharts series painting one metric, so only the actual series reaches the legend, with a swatch rather than the two line styles listed as separate series. The one-hue rule is enforced rather than incidental — the forecast key's `--color-*` is re-pointed at the actual series' color, so a `config` entry can no longer paint the metric in a second hue through a custom tooltip.
