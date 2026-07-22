# ComposedChart — behavior

`ComposedChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It plots a `series` list over one shared category axis
(`xKey`), where each entry picks its own render `type` (bar / line / area).

```gherkin
Scenario: Render mixed series from data and config
  Given data rows and a config mapping each series key to a label and color
  And series [{ key: "revenue", type: "bar" }, { key: "profit", type: "line" }]
  Then a <Bar> renders for revenue and a <Line> for profit
  And each paints from its injected --color-<key> custom property
```

```gherkin
Scenario: Paint order follows the series array
  Given series lists a bar then a line
  Then the bar paints first and the line paints on top of it
  And reordering the series entries reorders the painted layers
```

```gherkin
Scenario: Curve interpolation (default monotone)
  Given curve is "linear", "monotone", or "step"
  Then the line and area series use that recharts `type`
```

```gherkin
Scenario: Bar corner radius
  Given barRadius is greater than 0
  Then each bar series rounds its growing end by that radius
```

```gherkin
Scenario: Area fill
  Given an area series and a fillOpacity
  Then the area fills at that opacity below its line
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a category
  Then a card shows the category label and one row per series (indicator + value)
```

```gherkin
Scenario: Legend
  Given showLegend is true
  Then a swatch + label renders for each series
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders its axes and grid with no series marks and does not throw
```
