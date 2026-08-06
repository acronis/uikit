# ComposedChart — behavior

`ComposedChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It plots a `series` list over one shared category axis
(`xKey`), where each entry picks its own render `type` (bar / line / area).

```gherkin
Scenario: Render mixed series from data and config
  Given data rows and a config mapping each series key to a label and color
  And series [{ key: "revenue", type: "bar" }, { key: "profit", type: "line" }]
  Then a <Bar> renders for revenue and a <Line> for profit
  And each paints from its injected --color-<key> custom property
```

```gherkin
Scenario: Paint order follows the series array
  Given series lists a bar then a line
  Then the bar paints first and the line paints on top of it
  And reordering the series entries reorders the painted layers
  And the order holds across mark types — an area listed after a bar covers that bar
```

```gherkin
Scenario: Curve interpolation (default monotone)
  Given curve is "linear", "monotone", or "step"
  Then the line and area series use that recharts `type`
```

```gherkin
Scenario: Bar corner radius
  Given barRadius is greater than 0
  Then each bar series rounds its growing end by that radius
  And in a stack only the segment at the top of the stack is rounded
```

```gherkin
Scenario: Orientation re-roles both axes
  Given orientation is "horizontal"
  Then the marks grow rightward with the categories on the y-axis and the values on x
  And the grid lines run vertically
  And each bar rounds its right end instead of its top
  And a secondary value axis renders as a second x-axis along the top edge
  And yAxisOrientation is inert, leaving the category axis where it is
```

```gherkin
Scenario: A series overrides a chart-level default
  Given the chart sets strokeWidth
  And one series entry sets its own strokeWidth
  Then that series uses its own value and every other series uses the chart's
  And the same holds for color, curve, strokeDasharray, showDots, showActiveDots,
      connectNulls, barRadius, barSize, showActiveBar, showBackground and fillOpacity
```

```gherkin
Scenario: Series stack by shared id, within a mark type
  Given two bar series and two area series, each pair sharing a stackId
  Then each pair is summed into one stack
  And a bar and an area sharing the same id are not merged into one stack
  And a line series ignores stackId
```

```gherkin
Scenario: Null values break a series unless bridged
  Given a data row whose series value is null
  Then the line/area breaks at that point
  And with connectNulls the gap is bridged into one continuous mark
```

```gherkin
Scenario: Reference rules and bands
  Given a referenceLine with a value or an average of a series
  Then a dashed rule renders at that position on the value axis
  And a referenceLine with a category renders a rule across the categories at it
  And a category that is not in the data renders no rule
  And a referenceArea shades the band spanning its from/to categories
  And each renders its label when one is given
  And with orientation "horizontal" a value rule stands vertical, a category rule
      lies flat, and the band runs down the category axis
  And a labelled vertical rule reserves plot headroom for the caption it hangs
      above the plot, so it is not clipped
```

```gherkin
Scenario: A reference rule belongs to one value axis
  Given a chart with a primary and a secondary value axis
  When a referenceLine averages a series measured against the secondary axis
  Then the rule is drawn against that axis, not the primary one
  And "average: true" pools only the series on the axis the rule is drawn against
  And an explicit yAxis on the rule overrides both
  And a secondary yAxis is ignored while no series has brought that axis into being
```

```gherkin
Scenario: A series is kept off the legend
  Given a series entry sets legendType to "none"
  Then the legend renders every other series and omits that one
  And the series itself still renders and appears in the tooltip
```

```gherkin
Scenario: Area fill
  Given an area series and a fillOpacity
  Then the area fills at that opacity below its line
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
  Then a swatch + label renders for each series
  And legendPosition places it above or below the plot (default below)
```

```gherkin
Scenario: A series opts in to a second value axis
  Given series [{ key: "revenue", type: "bar" }, { key: "conversion", type: "line", yAxis: "secondary" }]
  Then a second value axis renders on the side opposite the primary one
  And the bar is scaled against the primary axis and the line against the secondary
  And each axis resolves its own unit, tick formatter, tick count, and domain
```

```gherkin
Scenario: The second axis exists only when a series asks for it
  Given no series entry sets yAxis to "secondary"
  Then no second axis renders
  And the secondary-axis props have no effect
  And the chart's output is unchanged from before the prop existed
```

```gherkin
Scenario: Hiding the second axis keeps its scale
  Given a series measured against the secondary axis
  And showSecondaryYAxis is false
  Then the second axis's ticks and title are not rendered
  And that series stays scaled against it rather than falling back to the primary
```

```gherkin
Scenario: Flipping the primary axis mirrors the pair
  Given yAxisOrientation is "right"
  Then the primary axis renders on the right
  And a secondary axis, if present, renders on the left
```

```gherkin
Scenario: Grid lines follow the primary axis
  Given two value axes with different domains
  Then the horizontal grid lines are drawn at the primary axis's ticks only
  And the secondary axis does not add a second set of grid lines
```

```gherkin
Scenario: Every series opts in, leaving the primary axis empty
  Given every series entry sets yAxis to "secondary"
  Then the primary axis is not rendered and gives up its gutter
  And the horizontal grid lines follow the secondary axis instead
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders its axes and grid with no series marks and does not throw
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
