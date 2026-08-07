# RadialBarChart — behavior

`RadialBarChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It plots each data row as a concentric arc sized by
`dataKey` and colored per `nameKey`, inside a `ChartContainer`.

```gherkin
Scenario: Render arcs from data and config
  Given data rows and a config mapping each arc name to a label and color
  And dataKey "value" and nameKey "browser"
  Then one concentric arc renders per row, sized by its dataKey value
  And each arc fills from its injected --color-<name> custom property
```

```gherkin
Scenario: Full circle (default)
  Given startAngle 90 and endAngle -270
  Then the arcs sweep a full clockwise circle
```

```gherkin
Scenario: Gauge
  Given startAngle 180 and endAngle 0
  Then the arcs sweep a half circle (a gauge)
```

The sweep's **direction** is the order of its two angles — `90 → -270` runs
clockwise, `-270 → 90` counter-clockwise. There is no separate `clockWise` prop:
recharts 3 exposes none for a radial bar, and the angles already say it.

```gherkin
Scenario: A single value needs a scale to read as a gauge
  Given one data row and no valueDomain
  Then its arc fills the whole sweep, because the row is its own maximum
  But given valueDomain [0, 100] and a value of 65
  Then the arc covers 65% of the sweep over the background track
```

```gherkin
Scenario: Center readout
  Given centerLabel { value, label }
  Then the value renders large and the caption under it, centered in the hole
  And the block is centered as a whole when both lines are present
```

```gherkin
Scenario: Multi-metric
  Given dataKeys ["used", "quota"]
  Then one arc renders per metric, not one per row
  And each takes its color and legend label from config keyed by that metric
  And nameKey names the band the metrics share
```

Segment gaps are **decorative on a pie (`paddingAngle`) but structural here**: a
radial arc has no padding of its own, so a notched ring is built by laying the
pieces out as one stack of synthetic series measured in degrees. That is what
`segments` does — and it is deliberately scoped to a single-value gauge, where the
pieces mean something; concentric rows keep the clean single-arc rendering.

```gherkin
Scenario: Segmented gauge
  Given one data row, valueDomain [0, 38], a value of 29 and segments 8
  Then the ring renders as 8 equal segments separated by transparent notches
  And the segments up to 29/38 of the drawn ring take the arc's color
  And the rest take the track's muted surface
  And the notches never eat into the value's proportion
  And the arc labels and the legend are suppressed (the pieces are not data rows)
  And hovering anywhere on the ring reads the metric and its maximum
```

```gherkin
Scenario: Segments only apply to a single-value gauge
  Given segments is set
  But data holds more than one row, or dataKeys is set,
    or segments is fewer than two, or the dataKey value is not a number
  Then the chart renders its normal concentric arcs, legend included,
    and ignores segments
```

```gherkin
Scenario: A domain that cannot place a value
  Given segments and a valueDomain with no span ([n, n]) or an inverted one
  Then the ring renders as all track and no value is claimed
  Because a gauge that cannot read its scale must not report progress
```

```gherkin
Scenario: A tiny value stays visible
  Given minAngle 12
  Then a non-zero arc smaller than 12 degrees is grown to 12 degrees
  And it grows along the sweep's own direction, not against it
```

```gherkin
Scenario: Background track
  Given showBackground is true
  Then a muted track renders behind each arc
  But when false only the value arcs render
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers an arc
  Then a card shows that arc's name and value
```

```gherkin
Scenario: Legend
  Given showLegend is true
  Then a swatch + label renders for each arc (from nameKey / config)
  And in multi-metric mode one renders per metric instead (from dataKeys / config)
```

```gherkin
Scenario: Data labels
  Given showLabels is true
  Then each arc carries its value, following the arc from labelPosition
  And labelFormat "name-value" prefixes the arc's name
  And an inside placement switches the label to the on-fill token
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders with no arcs and does not throw
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
