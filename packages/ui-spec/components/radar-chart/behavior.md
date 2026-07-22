# RadarChart — behavior

`RadarChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It plots a set of series (`dataKeys`) over one shared
angular axis (`angleKey`) inside a `ChartContainer`.

```gherkin
Scenario: Render radar areas from data and config
  Given data rows and a config mapping each series key to a label and color
  And dataKeys ["alice", "bob"]
  Then one <Radar> area renders per dataKey
  And each area strokes and fills from its injected --color-<key> custom property
```

```gherkin
Scenario: Polygon grid (default)
  Given gridType is "polygon"
  Then the polar grid draws straight-edged rings connecting the spokes
```

```gherkin
Scenario: Circle grid
  Given gridType is "circle"
  Then the polar grid draws smooth concentric rings
```

```gherkin
Scenario: Angle axis
  Given an angleKey
  Then each data row contributes one labelled spoke around the web
```

```gherkin
Scenario: Dots
  Given showDots is true
  Then a dot renders where each series crosses each spoke
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers near a spoke
  Then a card shows the axis label and one row per series (indicator + value)
```

```gherkin
Scenario: Legend
  Given showLegend is true
  Then a swatch + label renders for each series in dataKeys
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders the grid with no areas and does not throw
```
