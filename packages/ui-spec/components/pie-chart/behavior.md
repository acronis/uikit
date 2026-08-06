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
Scenario: Partial sweep
  Given a startAngle of 180 and an endAngle of 0
  Then the slices are laid out over that half turn instead of a full circle
  And their relative sizes are unchanged
```

```gherkin
Scenario: Rounded slices
  Given cornerRadius is greater than 0
  Then each slice's corners are rounded by that radius
```

```gherkin
Scenario: Minimum slice angle
  Given minAngle is greater than 0
  Then every non-zero slice occupies at least that angle
  And a slice smaller than it is drawn out of proportion so it stays hoverable
```

```gherkin
Scenario: Data-label format
  Given showLabels is true
  And labelFormat is one of value, name-value, name-percent or percent
  Then each slice's label reads its value, its name, and/or its share of the
    sum of every slice value, to one decimal
  And a labelFormatter formats the slice's value, so it reaches the value and
    name-value formats only — a share is always rendered as NN.N%
```

```gherkin
Scenario: Percent with nothing to divide by
  Given a percent-bearing labelFormat
  And the slice values sum to zero, or this slice's value is non-numeric
  Then name-percent falls back to the slice name and percent renders no label
```

```gherkin
Scenario: Slice with no value at all
  Given a data row that carries no dataKey field
  Then the name-bearing formats fall back to the bare slice name
  And the value-only formats render no label, rather than an empty one
```

```gherkin
Scenario: Leader lines
  Given showLabels and labelLine are both true
  Then a line runs from each slice to its label, in that slice's colour
  And the labels sit outside the arc regardless of labelPosition
```

```gherkin
Scenario: Per-slice overrides
  Given a sliceSettings entry keyed by a slice's nameKey value
  Then that slice takes the entry's colour and labelFormat in place of the
    chart-level ones
  And an entry with hideLabel drops that slice's label — and its leader line —
    while every other slice keeps its own
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a slice
  Then a card shows that slice's name and value
```

```gherkin
Scenario: Tooltip value format
  Given tooltipFormat is "value-percent"
  When the user hovers a slice
  Then the card shows that slice's value followed by its share of the total
  And a tooltipContent of the caller's own takes precedence over the preset
```

```gherkin
Scenario: Legend
  Given showLegend is true
  Then a swatch + label renders for each slice (from nameKey / config)
  And it sits on the edge given by legendPosition (bottom by default)
```

```gherkin
Scenario: Donut center label
  Given shape is "donut" and a centerLabel { value, label }
  Then the value renders large and the label smaller beneath it, centered in the hole
  And the block stays centered on the donut whether or not a legend is shown,
    and on whichever edge legendPosition puts it
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
