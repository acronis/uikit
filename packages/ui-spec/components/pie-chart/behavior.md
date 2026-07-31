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
Scenario: Donut center label
  Given shape is "donut" and a centerLabel { value, label }
  Then the value renders large and the label smaller beneath it, centered in the hole
  And the block stays centered on the donut whether or not a legend is shown
```

```gherkin
Scenario: Center label ignored for a pie
  Given shape is "pie" and a centerLabel
  Then no center content renders (a filled pie has no hole)
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders with no slices and does not throw
```

```gherkin
Scenario: Entrance animation is opt-in
  Given animate is unset
  Then the series render at their final geometry with no entrance animation
  And the committed visual baselines are unaffected
```

```gherkin
Scenario: Reduced motion
  Given animate is true
  And a user with prefers-reduced-motion
  Then the entrance animation does not play and the series render at their final geometry
  And the same applies when rendering on the server
```
