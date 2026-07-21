# AreaChart — behavior

`AreaChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It takes `data`, a per-series `config`, the series to
plot (`dataKeys`), and the category key (`xKey`), and renders a themed recharts
`AreaChart` inside a `ChartContainer`.

```gherkin
Scenario: Render areas from data and config
  Given data rows and a config mapping each series key to a label and color
  And dataKeys ["desktop", "mobile"]
  Then one <Area> renders per dataKey
  And each area strokes and fills from its injected --color-<key> custom property
```

```gherkin
Scenario: Single layout (default)
  Given layout is "single" and two or more dataKeys
  Then each area is plotted independently and they may overlap
```

```gherkin
Scenario: Stacked layout
  Given layout is "stacked" and two or more dataKeys
  Then the areas share a stackId and sum into one band
  And the value axis grows to the stacked total
```

```gherkin
Scenario: Gradient fill (default)
  Given fill is "gradient"
  Then a vertical linear gradient (top-opaque to bottom-transparent) is defined per series
  And each area fills from its gradient
```

```gherkin
Scenario: Solid fill
  Given fill is "solid"
  Then no gradient defs are emitted
  And each area fills flat at fillOpacity
```

```gherkin
Scenario: Curve interpolation (default monotone)
  Given curve is "linear", "monotone", or "step"
  Then every area's top edge uses that recharts `type`
```

```gherkin
Scenario: Null gaps
  Given a data row has a null value for a series
  And connectNulls is false
  Then that area breaks at the gap
  But when connectNulls is true the area bridges the gap
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a point
  Then a card shows the category label and one row per series (indicator + value)
```

```gherkin
Scenario: Legend
  Given showLegend is true
  Then a swatch + label renders for each series in dataKeys
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders its axes and grid with no areas and does not throw
```
