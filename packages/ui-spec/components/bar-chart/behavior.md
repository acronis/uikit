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
Scenario: Fixed reference line
  Given referenceLine is { value: 250, label: "Target" }
  Then a dashed line draws across the value axis at 250
  And it is captioned "Target"
  And for horizontal orientation the line is vertical (on the x-axis), else horizontal (on the y-axis)
```

```gherkin
Scenario: Averaged reference line
  Given referenceLine is { average: true } (or a single series key)
  Then the line draws at the mean of every plotted series' values (or that one series)
  And when there are no numeric values to average, no line is drawn
```

```gherkin
Scenario: Multiple reference lines
  Given referenceLine is an array of line configs (e.g. a fixed target and an average)
  Then one dashed line draws per config
  And each config is resolved independently (a config with nothing to draw is skipped)
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders its axes and grid with no bars and does not throw
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

```gherkin
Scenario: Range brush
  Given showBrush is true
  Then a brush strip renders beneath the plot with a handle at each end
  And dragging a handle (or the selected window) zooms the series to that slice
  And the category axis and tooltip follow the selected range
  And the brush renders whether or not the category axis is shown
  And unset renders no brush
```

```gherkin
Scenario: Range brush keyboard and accessible name
  Given showBrush is true
  Then each of the two handles is reachable by Tab
  And the focused handle moves one row per left/right arrow key press
  And each handle exposes brushAriaLabel as its accessible name
```
