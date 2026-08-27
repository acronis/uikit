# FunnelChart — behavior

`FunnelChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It lays out a square plot and a stage-list legend in a
row: the plot stacks one series of stages (`data` rows) as narrowing segments
inside a `ChartContainer`, and the legend beside it names them.

```gherkin
Scenario: Render stages from data and config
  Given data rows and a config mapping each stage name to a label
  And dataKey "value" and nameKey "stage"
  Then one segment renders per row, sized by its dataKey value
  And each segment is painted from its palette stop
```

## Layout

```gherkin
Scenario: The plot and the legend sit side by side
  Given a FunnelChart with its default chrome
  Then the root is a row holding a 120×120 square plot, a 16px gutter, and the
    legend column
  And the legend column takes every pixel the plot does not
```

```gherkin
Scenario: The component has no size of its own
  Given a parent wider than the plot
  And no label list sits beside the funnel
  Then the component fills that width and the legend column absorbs the surplus
  And the plot stays a 120×120 square rather than stretching into a tall wedge
```

```gherkin
Scenario: The plot grows when labels sit beside the funnel
  Given showLabels is true and labelPosition is "right" or "left"
    Or showValueLabels is true and valuePosition is "right" or "left"
  Then the plot-frame switches to h-[120px] flex-1 and grows with available width
  Because the label margins would otherwise consume the entire 120px fixed width
```

```gherkin
Scenario: The lone plot centres
  Given showLegend is false
  Then the plot is the row's only child and is centred in it
```

```gherkin
Scenario: No card of its own
  Given a FunnelChart rendered directly
  Then it draws no card, header or metric row — those belong to ChartWidget
```

## Geometry

```gherkin
Scenario: Surface shows between the stages
  Given a funnel of n stages
  Then 2px of surface separates each stage from the one above it, n-1 times over
  And the topmost stage stays flush with the top of the plot area
```

```gherkin
Scenario: Every stage is rounded
  Given any funnel
  Then each stage's corners are rounded by 2px, the triangle's apex included
```

```gherkin
Scenario: The gap and the radius are the component's own drawing
  Given the renderer's funnel shape supports neither a gap nor a radius
  Then the component draws each stage itself, so both survive on hover too
```

```gherkin
Scenario: Plot-area inset with nothing beside the funnel
  Given no label list sits beside the funnel
  Then the plot area is inset by 4 top, 8 right, 4 bottom and 8 left — the room
    the rounded corners and the apex need, and nothing more
```

```gherkin
Scenario: Triangle last shape (default)
  Given lastShape is "triangle"
  Then the final stage narrows to a point
```

```gherkin
Scenario: Rectangle last shape
  Given lastShape is "rectangle"
  Then the final stage keeps a flat lower edge (a stack of trapezoids)
```

```gherkin
Scenario: Reversed
  Given reversed is true
  Then the funnel widens toward the bottom instead of narrowing
  And the gap-free stage is the last row rather than the first
```

## Colour

```gherkin
Scenario: The default palette is a ramp, not a categorical set
  Given no palette is given
  Then the stages are painted from the sequential blue ramp, because a funnel's
    stages are an ordered series
  And every other chart type still defaults to the shared categorical palette
```

```gherkin
Scenario: Palette is the only source of a stage's colour
  Given a palette and a config
  Then each stage takes a palette stop; config supplies its label, not its colour
```

```gherkin
Scenario: Per-stage colour override
  Given a stageSettings entry keyed by a stage's nameKey value carries a color
  Then that stage paints with it in the funnel and in its legend marker,
    whatever the palette says
```

## Labels

```gherkin
Scenario: On-plot labels are off by default
  Given showLabels is unset
  Then no stage labels render on the plot, because the legend already names them
  And showLabels renders them
```

```gherkin
Scenario: Label format
  Given showLabels is true
  And labelFormat is "name-percent"
  Then each label pairs the stage's name with its conversion from the widest stage
  And the widest stage reads 100.0%, whatever order the stages arrive in
  And the share is formatted by percentFormatter, so a locale that doesn't write a
    bare percent sign can replace it
```

```gherkin
Scenario: Label position drives the label color
  Given labelPosition is "inside"
  Then each label is centred on its segment
  And it uses the on-fill color, which holds its contrast over a saturated fill
```

```gherkin
Scenario: An on-segment label needs a segment wide enough to hold it
  Given labelPosition is "inside"
  And a stage too narrow for its label text
  Then the text runs past that segment onto the surface, where the on-fill color
    has nothing to sit on
  And the readable options are a short labelFormat or a position beside the funnel
```

```gherkin
Scenario: Separate value labels
  Given showValueLabels is true
  Then each stage carries its name on one side of the funnel and its value on the
    other — the values default to the side opposite the names
  And both read against the surface, so the narrow tail stages stay legible
```

```gherkin
Scenario: The value labels follow the names to the other side
  Given showValueLabels is true
  And labelPosition is "left"
  And no valuePosition is given
  Then the values render to the right of the funnel, not on top of the names
```

```gherkin
Scenario: A composite label gets room by narrowing the funnel
  Given showLabels is true
  And labelFormat is a pair, sitting to the right of the funnel
  And no funnelWidth is given
  Then the funnel is narrowed within the plot area so the label has room to wrap
    into, because a label wraps against the gap between its segment and the plot
    area's edge — an inset moves that edge inward with the funnel and so gives it
    less room, not more
  And a caller-supplied funnelWidth replaces the reserve
```

```gherkin
Scenario: A label list widens the inset on its own side
  Given a label list sits beside the funnel
  Then the plot area's inset on that side widens, so text that cannot wrap is not
    clipped at the SVG edge
```

```gherkin
Scenario: A partial margin keeps the other sides
  Given a margin that sets only one side
  Then the remaining sides keep their default insets rather than collapsing to zero
```

## Legend

```gherkin
Scenario: The legend is visible by default
  Given showLegend is unset
  Then the stage list renders beside the plot
  And showLegend=false hides it
```

```gherkin
Scenario: The legend is a sibling of the plot, not a chart legend
  Given showLegend is true
  Then the list is ordinary HTML outside the plot's SVG, never a renderer legend
    and never a row below the funnel
```

```gherkin
Scenario: Legend entries come from the visible stages
  Given showLegend is true
  Then one two-column row renders per distinct visible stage name
  And the inline start holds the stage's round marker and its config label
  And the inline end holds the stage's dataKey value, formatted by
    legendValueFormatter when one is given
  And two stages sharing a name share the single row they share a colour with
```

```gherkin
Scenario: Legend text colour
  Given a legend row
  Then both its label and its value use the primary on-surface text token, the
    value in semibold — not the link colour the donut and radial legends give
    their values
```

```gherkin
Scenario: Legend markers resolve their own colour
  Given the legend sits outside the chart container
  Then each marker carries its stage's resolved palette token, because the
    container-scoped --color-<name> custom properties do not reach outside it
```

```gherkin
Scenario: Hidden stage
  Given a stageSettings entry hides its stage
  Then the stage has no segment, no label and no legend row
  And the remaining conversions are measured over the visible stages only
```

## Interaction

```gherkin
Scenario: Active segment
  Given showActiveShape is true
  When the user hovers a stage
  Then that segment is outlined and keeps its fill, gap and rounded corners
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a stage
  Then a card shows that stage's name and value
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders with no segments and does not throw
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
