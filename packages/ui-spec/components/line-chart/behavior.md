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
  Given curve is one of linear, monotone, natural, basis, step, stepBefore, stepAfter
  Then every line uses that recharts `type`
  And "linear" draws straight segments, "monotone" smooths them without overshooting a point
  And "natural" smooths further and may overshoot, while "basis" need not pass through the points
  And "step" draws right angles at the midpoint, "stepBefore" at the leading point, "stepAfter" at the trailing one
  And each type draws distinct geometry — an unrecognized value would silently fall back to straight segments
```

```gherkin
Scenario: Dashed line style
  Given lineStyle is "dashed"
  Then every line strokes with a dashed pattern
```

```gherkin
Scenario: Dots
  Given showDots is true
  Then a dot renders at each data point with radius dotSize
  And hovering a point enlarges its active dot by 2px
  But when showDots is false neither the static dots nor the hover active dot render
```

```gherkin
Scenario: Hover dot independent of the static dots
  Given showActiveDot is set
  Then it decides the hover dot on its own instead of following showDots
  And showDots false with showActiveDot true gives a bare line that still emphasizes the hovered point
  And showDots true with showActiveDot false gives static dots with no hover emphasis
```

```gherkin
Scenario: Restyle one series
  Given lineSettings maps "mobile" to { dashed: true, strokeWidth: 3, showDots: false }
  Then only the "mobile" line is dashed, thicker, and dot-less
  And every other series renders from the chart-wide props
  And an unset field in the entry falls back to the chart-wide prop
```

```gherkin
Scenario: A comparison overlay keeps its treatment
  Given a series is listed in comparisonKeys
  And its lineSettings entry sets showDots true
  Then the series still renders dot-less — the overlay treatment wins
  But its color, strokeWidth and curveType overrides still apply
```

```gherkin
Scenario: Per-series value labels
  Given lineSettings maps a series to { showLabel: false }
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
  And the caption sits at the rule's top right unless labelPosition moves it
```

```gherkin
Scenario: Averaged reference line
  Given referenceLine is { average: true } (or a single series key)
  Then the rule draws at the mean of every plotted series' values (or that one series)
  And a comparisonKeys overlay counts as a plotted series in that mean
  And null values are skipped rather than counted as zero
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
  And it follows the current key's curveType, so its edges match the line it shades
  And points where either series is non-numeric are left un-banded
  And the band is not surfaced as its own tooltip row or legend entry
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders its axes and grid with no lines and does not throw
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
