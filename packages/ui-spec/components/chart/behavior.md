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
Scenario: Series colors from config
  Given a config entry { desktop: { color: 'var(--ui-background-brand-secondary)' } }
  Then a `--color-desktop` custom property is injected scoped to this chart
  And series referencing fill="var(--color-desktop)" paint with that color
```

```gherkin
Scenario: Per-theme series colors
  Given a config entry with { theme: { light, dark } } instead of a single color
  Then the light value applies by default
  And the dark value applies under [data-theme='dark']
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
Scenario: Config without colors
  Given a config whose entries have only labels (no color / theme)
  Then no <style> is injected and series fall back to recharts defaults
```
