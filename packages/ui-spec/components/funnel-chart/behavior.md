# FunnelChart — behavior

`FunnelChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It plots a single series of stages (`data` rows) as
stacked, narrowing segments inside a `ChartContainer`.

```gherkin
Scenario: Render stages from data and config
  Given data rows and a config mapping each stage name to a label and color
  And dataKey "value" and nameKey "stage"
  Then one segment renders per row, sized by its dataKey value
  And each segment fills from its injected --color-<name> custom property
```

```gherkin
Scenario: Triangle last shape (default)
  Given lastShape is "triangle"
  Then the final segment narrows to a point
```

```gherkin
Scenario: Rectangle last shape
  Given lastShape is "rectangle"
  Then the final segment ends flat (a stack of trapezoids)
```

```gherkin
Scenario: Reversed
  Given reversed is true
  Then the funnel widens toward the bottom instead of narrowing
```

```gherkin
Scenario: Stage labels
  Given showLabels is true
  Then each stage's name renders beside its segment
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
Scenario: A partial margin keeps the other sides
  Given a margin that sets only one side
  Then the remaining sides keep their default insets rather than collapsing to zero
```

```gherkin
Scenario: Legend is opt-in
  Given showLegend is unset
  Then no legend renders
```

```gherkin
Scenario: Legend entries come from the visible stages
  Given showLegend is true
  Then one entry renders per distinct visible stage name, labelled and colored
    from config
  And two stages sharing a name share the single entry they share a color with
  And it sits on the edge given by legendPos (bottom by default)
```

```gherkin
Scenario: Gradient color mode
  Given colorMode is "gradient"
  Then every stage fills from one hue — gradientColor, or the first visible stage's
    own color, including a stageSettings color set on it
  And the hue is mixed further toward the surface at each stage down the funnel
```

```gherkin
Scenario: Per-stage color override
  Given a stageSettings entry keyed by a stage's nameKey value carries a color
  Then that stage fills with it, whatever config and colorMode say
```

```gherkin
Scenario: Hidden stage
  Given a stageSettings entry hides its stage
  Then the stage has no segment, no label and no legend entry
  And the remaining conversions are measured over the visible stages only
```

```gherkin
Scenario: Active segment
  Given showActiveShape is true
  When the user hovers a stage
  Then that segment is outlined and keeps its fill
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
