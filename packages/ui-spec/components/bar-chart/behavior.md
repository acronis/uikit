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
  Given orientation is omitted or "vertical"
  Then the recharts chart renders
  And bars grow upward
  And the category axis (xKey) is the x-axis and the value axis is the y-axis
  And the grid draws horizontal lines
```

```gherkin
Scenario: Horizontal orientation
  Given orientation is "horizontal" and items is a list of { label, value, color }
  Then no chart renders — one labelled bar row renders per item
  And each row shows its label, its formatted value, and its share of max
  And each row exposes role="meter" with aria-valuenow and aria-valuemax
  And the track fills to value/max in the item's own color
```

```gherkin
Scenario: Horizontal orientation without an explicit max
  Given orientation is "horizontal" and max is omitted
  Then max falls back to the sum of every items[].value
  And each row's percentage is its share of that total
```

```gherkin
Scenario: Horizontal item with forecast
  Given orientation is "horizontal" and an item has forecast greater than value
  Then a translucent bar (30% opacity) extends from the actual value to the forecast
  And the actual bar renders solid on top
  And aria-valuetext includes the forecast value
  And aria-valuenow reflects the actual value only
  But when forecast is omitted or less than or equal to value, no forecast bar renders
```

```gherkin
Scenario: Horizontal palette-driven colors
  Given orientation is "horizontal" and a palette is set
  Then each item's color is resolved through the palette machinery
  And an item with a tone resolves to the palette's tone-specific token
  And an explicit item.color still overrides the resolved palette color
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
  And the entries follow the dataKeys order, not the underlying chart library's
      default alphabetical sort
  And the order does not change when bar-styling props (barShape, barSettings) are set
```

```gherkin
Scenario: Fixed reference line
  Given referenceLine is { value: 250, label: "Target" }
  Then a horizontal dashed line draws across the value (y) axis at 250
  And it is captioned "Target"
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

```gherkin
Scenario: Highlight a range of categories
  Given referenceArea is { from: "Apr" }
  Then a shaded band spans from the "Apr" category through the last one
  And the category ticks it covers render in the accent style, italic
  But the accent is skipped when the entry sets highlightTicks: false
```

```gherkin
Scenario: Address a range by index or by value
  Given a referenceArea or barSettings entry with from and/or to
  Then a bound matching a category's own value selects that category
  And an integer bound with no matching category selects that row index
  And an omitted bound runs to that end of the data
  And nothing is drawn when a bound resolves to no category, or to lies before from
```

```gherkin
Scenario: Mark the hand-off into a forecast
  Given a referenceArea entry sets divider: true
  Then a dashed rule draws on the band's leading edge
  And it follows the category (x) axis — the band's left edge
```

```gherkin
Scenario: Restyle one series over a range
  Given barSettings maps "desktop" to { from: "Apr", opacity: 0.35, dashed: true }
  Then the "desktop" bars from "Apr" onward render translucent with a dashed outline in the series color
  And the "desktop" bars before "Apr" render normally
  And every other series renders normally
```

```gherkin
Scenario: Track behind a bar
  Given showBackground is true
  Then a full-height track renders behind every bar, filled with backgroundFill
  And a barSettings entry with background: true limits that track to its own range
```

```gherkin
Scenario: Cap a track at an upper bound
  Given a barSettings entry sets background to a data field name
  Then the matched bars carry a headroom segment from their value up to that field's value
  And the headroom stacks on its own bar, so the series stay side by side
  And it is excluded from the tooltip rows and the legend entries
  But it is not drawn at all under layout="stacked"
```

```gherkin
Scenario: Bar shape
  Given barShape is "pill"
  Then every corner of each bar is rounded into a capsule
  And "gradient" fades the series color along the bar while "pattern" hatches it
  And a barSettings entry's shape overrides the chart's for its own range
```

```gherkin
Scenario: Bar sizing
  Given barSize, maxBarSize, barGap, barCategoryGap or minPointSize is set
  Then the bar thickness, the gaps around it, and the floor for a non-zero value follow those values
  And a value of exactly 0 still renders nothing, including a zero segment inside a stack
```

```gherkin
Scenario: Active bar on hover
  Given showActiveBar is true
  When the user hovers a bar
  Then that bar repaints with the activeBar fill and opacity, defaulting to the series color
  And a bar that carries a barSettings track keeps that track while it is hovered
```
