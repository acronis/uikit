# AreaChart — behavior

`AreaChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It takes `data`, a per-series `config`, the series to
plot (`dataKeys`), and the category key (`xKey`), and renders a themed recharts
`AreaChart` inside a `ChartContainer`.

```gherkin
Scenario: Render areas from data and config
  Given data rows and a config mapping each series key to a label and color
  And dataKeys ["desktop", "mobile"]
  Then one <Area> renders per dataKey
  And each area strokes and fills from its injected --color-<key> custom property
```

```gherkin
Scenario: Single layout (default)
  Given layout is "single" and two or more dataKeys
  Then each area is plotted independently and they may overlap
```

```gherkin
Scenario: Stacked layout
  Given layout is "stacked" and two or more dataKeys
  Then the areas share a stackId and sum into one band
  And the value axis grows to the stacked total
```

```gherkin
Scenario: Gradient fill (default)
  Given fill is "gradient"
  Then a vertical linear gradient (top-opaque to bottom-transparent) is defined per series
  And each area fills from its gradient
```

```gherkin
Scenario: Solid fill
  Given fill is "solid"
  Then no gradient defs are emitted
  And each area fills flat at fillOpacity
```

```gherkin
Scenario: Curve interpolation (default monotone)
  Given curve is one of linear, monotone, natural, basis, step, stepBefore, stepAfter
  Then every area's top edge uses that recharts `type`
  And "natural" smooths further than "monotone" and may overshoot, while "basis" need not pass through the points
  And "stepBefore" / "stepAfter" move the step to the leading or trailing point
  And each type draws distinct geometry — an unrecognized value would silently fall back to straight segments
```

```gherkin
Scenario: Dots
  Given showDots is true
  Then a dot renders at each data point with radius dotSize
  And hovering a point enlarges its active dot by 2px
  And showActiveDot decides the hover dot on its own when set, instead of following showDots
```

```gherkin
Scenario: Restyle one series
  Given areaSettings maps "mobile" to { dashed: true, fillOpacity: 0.1, showDots: false }
  Then only the "mobile" area has a dashed top edge, a fainter fill, and no dots
  And every other series renders from the chart-wide props
  And an unset field in the entry falls back to the chart-wide prop
```

```gherkin
Scenario: Recolor one series
  Given areaSettings maps a series to a color
  And fill is "gradient"
  Then that series' gradient stops take the override color, not its config color
  And the other series keep their config colors
```

```gherkin
Scenario: Per-series value labels
  Given areaSettings maps a series to { showLabel: false }
  And showLabels is true
  Then that series renders no value labels while the others do
  And a { showLabel: true } entry labels only that series with showLabels unset
```

```gherkin
Scenario: Reference line
  Given referenceLine is { value: 250, label: "Target" }
  Then a dashed rule draws across the value axis at 250, captioned "Target"
  And it is drawn in the muted text token, over the series
  And the axis domain extends to include it, so a target above the data maximum stays visible
```

```gherkin
Scenario: Averaged reference line
  Given referenceLine is { average: true } (or a single series key)
  Then the rule draws at the mean of every plotted series' values (or that one series)
  And when there is nothing numeric to average, no rule is drawn
```

```gherkin
Scenario: Multiple reference lines
  Given referenceLine is an array of configs (e.g. a fixed target and an average)
  Then one dashed rule draws per config
  And each is resolved independently (a config with nothing to draw is skipped)
```

```gherkin
Scenario: Null gaps
  Given a data row has a null value for a series
  And connectNulls is false
  Then that area breaks at the gap
  But when connectNulls is true the area bridges the gap
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
Scenario: Empty data
  Given data is an empty array
  Then the chart renders its axes and grid with no areas and does not throw
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
