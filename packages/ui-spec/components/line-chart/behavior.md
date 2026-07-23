# LineChart — behavior

`LineChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It takes `data`, a per-series `config`, the series to
plot (`dataKeys`), and the category key (`xKey`), and renders a themed recharts
`LineChart` inside a `ChartContainer`.

```gherkin
Scenario: Render lines from data and config
  Given data rows and a config mapping each series key to a label and color
  And dataKeys ["desktop", "mobile"]
  Then one <Line> renders per dataKey
  And each line strokes from its injected --color-<key> custom property
```

```gherkin
Scenario: Single line
  Given dataKeys has one entry
  Then a single line renders against the category and value axes
```

```gherkin
Scenario: Multiple lines
  Given dataKeys has two or more entries
  Then one line renders per key on shared axes
  And the legend distinguishes them by color + label
```

```gherkin
Scenario: Curve interpolation (default monotone)
  Given curve is "linear", "monotone", or "step"
  Then every line uses that recharts `type`
  And "linear" draws straight segments, "monotone" smooths them, "step" draws right angles
```

```gherkin
Scenario: Dashed line style
  Given lineStyle is "dashed"
  Then every line strokes with a dashed pattern
```

```gherkin
Scenario: Dots
  Given showDots is true
  Then a dot renders at each data point
  And hovering a point enlarges its active dot
  But when showDots is false neither the static dots nor the hover active dot render
```

```gherkin
Scenario: Null gaps
  Given a data row has a null value for a series
  And connectNulls is false
  Then that line breaks at the gap
  But when connectNulls is true the line bridges the gap
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
Scenario: Comparison / trend overlay
  Given comparisonKeys lists a subset of dataKeys (e.g. ["lastYear"])
  Then those series render dashed, dimmed, and without dots
  And the remaining series render normally (current lineStyle / showDots)
  And each series keeps its own config color
```

```gherkin
Scenario: Delta band between two series
  Given deltaBands lists a pair [current, comparison] (e.g. [["thisYear","lastYear"]])
  Then a dimmed area shades the gap between the two series at each point
  And the band is tinted with the current key's config color and sits behind the lines
  And points where either series is non-numeric are left un-banded
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders its axes and grid with no lines and does not throw
```
