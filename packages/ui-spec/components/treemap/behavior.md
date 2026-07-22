# Treemap — behavior

`Treemap` is a typed [recharts](https://recharts.org) composition over the shared
`Chart` primitives. It tiles a flat set of leaves into rectangles sized by
`dataKey` and colored per `nameKey`, inside a `ChartContainer`.

```gherkin
Scenario: Render cells from data and config
  Given data rows and a config mapping each leaf name to a label and color
  And dataKey "size" and nameKey "name"
  Then one rectangle renders per row, its area proportional to the dataKey value
  And each cell fills from its injected --color-<name> custom property
```

```gherkin
Scenario: On-cell labels
  Given showLabels is true
  Then each cell large enough shows its name centered
  But small cells omit the label to avoid overflow
  And when showLabels is false no labels render
```

```gherkin
Scenario: Aspect ratio
  Given an aspectRatio
  Then the tiling targets that width-to-height ratio per cell
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a cell
  Then a card shows that leaf's name and value
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders no cells and does not throw
```
