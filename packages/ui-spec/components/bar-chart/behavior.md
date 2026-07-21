# BarChart — behavior

`BarChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It takes `data`, a per-series `config`, the series to
plot (`dataKeys`), and the category key (`xKey`), and renders a themed recharts
`BarChart` inside a `ChartContainer`.

```gherkin
Scenario: Render bars from data and config
  Given data rows and a config mapping each series key to a label and color
  And dataKeys ["desktop", "mobile"]
  Then one <Bar> renders per dataKey
  And each bar fills from its injected --color-<key> custom property
```

```gherkin
Scenario: Vertical orientation (default)
  Given orientation is "vertical"
  Then bars grow upward
  And the category axis (xKey) is the x-axis and the value axis is the y-axis
  And the grid draws horizontal lines
```

```gherkin
Scenario: Horizontal orientation
  Given orientation is "horizontal"
  Then bars extend rightward (recharts layout="vertical")
  And the category axis (xKey) is the y-axis and the value axis is the x-axis
  And the grid draws vertical lines
```

```gherkin
Scenario: Grouped layout (default)
  Given layout is "grouped" and two or more dataKeys
  Then the bars in each category render side by side
  And each bar's growing end is rounded by barRadius
```

```gherkin
Scenario: Stacked layout
  Given layout is "stacked" and two or more dataKeys
  Then the bars in each category share a stackId and sum into one column/row
  And only the last segment's growing end is rounded
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
  Then a swatch + label renders for each series in dataKeys
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders its axes and grid with no bars and does not throw
```
