# ScatterChart — behavior

`ScatterChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It plots each `series[]` entry's points on numeric
`xKey` / `yKey` axes inside a `ChartContainer`, optionally sizing points by a
`zKey` (bubble chart).

```gherkin
Scenario: Render points from series and config
  Given a series list, each { key, data }, and a config mapping each key to a label and color
  Then one <Scatter> renders per series
  And each series' points fill from its injected --color-<key> custom property
```

```gherkin
Scenario: Single (ungrouped) scatter
  Given series has one entry
  Then a single set of points renders against the x/y axes
```

```gherkin
Scenario: Grouped scatter
  Given series has two or more entries
  Then each renders as its own colored set of points
  And the legend distinguishes them by color + label
```

```gherkin
Scenario: Bubble sizing
  Given a zKey is supplied
  Then a ZAxis maps that field to point size across zRange
  But when zKey is omitted every point uses a fixed size
```

```gherkin
Scenario: Marker shape
  Given shape is one of circle / cross / diamond / square / star / triangle / wye
  Then every point renders with that marker glyph
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a point
  Then a card shows that point's axis values
```

```gherkin
Scenario: Legend
  Given showLegend is true
  Then a swatch + label renders for each series
```

```gherkin
Scenario: Empty series
  Given series is an empty array
  Then the chart renders its axes and grid with no points and does not throw
```
