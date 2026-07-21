# PieChart — behavior

`PieChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It takes `data`, a per-slice `config`, the value field
(`dataKey`), and the label field (`nameKey`), and renders a themed recharts
`PieChart` inside a `ChartContainer`.

```gherkin
Scenario: Render slices from data and config
  Given data rows and a config mapping each slice name to a label and color
  And dataKey "value" and nameKey "browser"
  Then one arc slice renders per row, sized by its dataKey value
  And each slice fills from its injected --color-<name> custom property
```

```gherkin
Scenario: Pie shape (default)
  Given shape is "pie"
  Then the arc fills to the centre (innerRadius 0)
```

```gherkin
Scenario: Donut shape
  Given shape is "donut"
  Then the arc has a hollow centre at innerRadius
```

```gherkin
Scenario: Padding between slices
  Given paddingAngle is greater than 0
  Then a gap of that many degrees separates adjacent slices
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a slice
  Then a card shows that slice's name and value
```

```gherkin
Scenario: Legend
  Given showLegend is true
  Then a swatch + label renders for each slice (from nameKey / config)
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders with no slices and does not throw
```
