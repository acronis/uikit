# Chart — behavior

Chart is a theming layer over [recharts](https://recharts.org). `ChartContainer`
provides the series `config` (via context) and a sized, responsive box; the
caller composes the actual plot from recharts primitives (`BarChart`, `LineChart`,
`AreaChart`, `PieChart`, …). `ChartTooltipContent` and `ChartLegendContent` are
passed to recharts' `Tooltip` / `Legend` through their `content` prop.

```gherkin
Scenario: Render a chart
  Given a config and a recharts plot as children
  Then the plot renders inside a responsive, aspect-video container
  And recharts' grid, axis, and cursor pick up the semantic theme tokens
```

```gherkin
Scenario: Series colors from palette
  Given a config entry { desktop: { label: 'Desktop' } } and palette={ type: 'categorical' }
  Then a `--color-desktop` custom property is injected scoped to this chart
  And the value is the first stop of the categorical palette
  And series referencing fill="var(--color-desktop)" paint with that color
```

```gherkin
Scenario: Series tone override
  Given a config entry with { failed: { tone: { status: 'danger' } } } and palette={ type: 'status' }
  Then the `--color-failed` custom property resolves to the danger status token
```

```gherkin
Scenario: Tooltip on hover
  Given a ChartTooltip with content={<ChartTooltipContent />}
  When the user hovers a data point
  Then a card shows the point's label and one row per series
  And each row has a color indicator (dot by default; line or dashed via `indicator`)
```

```gherkin
Scenario: Legend
  Given a ChartLegend with content={<ChartLegendContent />}
  Then a swatch + label renders for each configured series
  And a series icon replaces the swatch unless hideIcon is set
```

```gherkin
Scenario: Default palette
  Given a ChartContainer with no explicit palette prop
  Then the categorical palette is used
  And each series takes the next categorical stop in config-declaration order
```
