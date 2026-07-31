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
