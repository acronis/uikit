# RadarChart — behavior

`RadarChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It plots a set of series (`dataKeys`) over one shared
angular axis (`angleKey`) inside a `ChartContainer`.

```gherkin
Scenario: Render radar areas from data and config
  Given data rows and a config mapping each series key to a label and color
  And dataKeys ["alice", "bob"]
  Then one <Radar> area renders per dataKey
  And each area strokes and fills from its injected --color-<key> custom property
```

```gherkin
Scenario: Polygon grid (default)
  Given gridType is "polygon"
  Then the polar grid draws straight-edged rings connecting the spokes
```

```gherkin
Scenario: Circle grid
  Given gridType is "circle"
  Then the polar grid draws smooth concentric rings
```

```gherkin
Scenario: Angle axis
  Given an angleKey
  Then each data row contributes one labelled spoke around the web
```

```gherkin
Scenario: Angle-axis chrome
  Given showAngleAxis is false
  Then no spoke labels, tick lines, or outer axis line render
  And the axis itself is still mounted, so the tooltip names each category
```

```gherkin
Scenario: Value scale
  Given showRadiusAxis is true
  Then a radial scale of ticks renders from the centre outward at radiusAxisAngle
```

```gherkin
Scenario: Absolute scaling
  Given radiusAxisDomain is "fixed" and radiusAxisDomainMax is the metric maximum
  Then the outer ring is that maximum rather than the largest value in the data
  And two charts of the same metric are comparable
  And the rescaling applies whether or not the scale is shown
```

```gherkin
Scenario: Inverted scale
  Given radiusAxisReversed is true
  Then the maximum sits at the centre and 0 at the outer ring
```

```gherkin
Scenario: Unusable fixed maximum
  Given radiusAxisDomain is "fixed"
  And radiusAxisDomainMax is zero, negative, or not a finite number
  Then the outer ring falls back to the data's own largest value
  And the web is neither collapsed onto its centre nor inverted
```

```gherkin
Scenario: Grid spokes
  Given radialLines is false
  Then the web keeps its concentric rings and drops the radial spokes
```

```gherkin
Scenario: Dots
  Given showDots is true
  Then a dot renders where each series crosses each spoke
  And its radius is dotRadius
```

```gherkin
Scenario: Per-series overrides
  Given seriesSettings has an entry keyed by a plotted dataKeys entry
  Then that series uses the entry's color/stroke/opacity/width/dots
  And a color or stroke override also moves that series' legend swatch and tooltip dot
  And every other series keeps the chart-level values
  And an entry for a key that is not plotted is ignored
  And a deliberately falsy override (zero opacity or width, dots off) wins over the chart-level value
```

```gherkin
Scenario: Geometry
  Given cx/cy, startAngle/endAngle, innerRadius/outerRadius or margin
  Then the web, its axes, and the areas are all laid out to match
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers near a spoke
  Then a card shows the axis label and one row per series (indicator + value)
```

```gherkin
Scenario: Legend
  Given showLegend is true
  Then a swatch + label renders for each series in dataKeys
  And legendPosition puts the row below (default) or above the chart
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders the grid with no areas and does not throw
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

## Not exposed, and why

- **A grid-only inner/outer radius.** recharts ignores a `PolarGrid`'s own
  `innerRadius`/`outerRadius` inside a chart — it takes both from the chart's
  polar view box — so the web's extent is the chart-level `innerRadius` /
  `outerRadius`, which moves the axes and the areas with it.
- **`connectNulls`.** recharts places a radar point with no value at the centre
  (radius 0) rather than leaving a hole, so there is no gap for a `connectNulls`
  to bridge — a series missing a value renders as a spike into the middle, which
  reads as a zero. Every plotted series therefore needs a value in every row;
  drop the whole category row instead.
- **A per-series legend marker shape.** The shared `ChartLegendContent` now picks
  a marker from the series' `legendType` (swatch / line / dashed), so a per-series
  shape became expressible once that rework landed. It stays unexposed here on
  purpose: a radar paints filled areas, so every series wants the swatch, and
  choosing per series is a design call across the whole chart suite rather than
  one component's prop.
