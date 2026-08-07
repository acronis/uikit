# ConfidenceCone — behavior

`ConfidenceCone` composes a solid actual line, a dashed forecast line, and a
shaded prediction band (the "cone") on the shared `Chart` primitives.

```gherkin
Scenario: Actual + forecast + cone (one color)
  Given data with actual values up to a hand-off point, then forecast values with lower/upper bounds
  Then the actual period renders as a solid line with a filled area beneath it
  And the forecast period renders as a dashed line
  And a shaded band fills between lower and upper across the forecast, typically widening with the horizon
  And the metric uses one color: the actual area, forecast line, and cone band all reuse the actual series' color (actual vs forecast differ by line style, not hue)
  And the areas mark no points unless showDots is set
```

```gherkin
Scenario: Several metrics on one shared axis
  Given a series array naming each metric's actual / forecast / bound fields
  Then every metric renders its own cone and lines against the one shared axis
  And each metric uses its own hue, taken from config[actualKey]
  And every cone renders behind every line, so no band covers another metric's line
  And the legend names each metric once
  And the series array supersedes the single-series actualKey / forecastKey / lowerKey / upperKey shorthand
```

```gherkin
Scenario: Actual as a bare line
  Given actualType is "line"
  Then the observed period renders as a solid line with no filled region beneath it
  And the cone band is the only shaded region left under the series
  And with actualType "area" (the default) the filled region returns
```

```gherkin
Scenario: Band-less projection
  Given a series that omits lowerKey and upperKey
  Then its actual line hands off to a bare dashed forecast with no cone
  And other series in the same chart still render their own cones
```

```gherkin
Scenario: Value-axis thresholds
  Given a referenceLine value (or an array of them)
  Then each renders as a dashed horizontal line on the value axis, with its label at the line's right end
  And a threshold beyond the data max extends the domain so it stays visible
```

```gherkin
Scenario: Measured vs predicted points
  Given showDots is true
  Then each observed point carries a filled dot in the metric's hue
  And each projected point carries a hollow dot — the metric's hue as its outline, the surface color as its fill
  And with showDots false (the default) no point is marked
```

```gherkin
Scenario: Styled forecast ticks
  Given styleForecastTicks is true
  Then the X-axis ticks over the projected period render italic in the first series' hue
  And the ticks over the actual period keep the axis' default styling
  And a caller's xTickFormatter still formats every tick
  And the projected ticks are matched by x value, so a tick interval that skips ticks cannot mis-style them
```

```gherkin
Scenario: Forecast region marker
  Given showForecastRegion is true (the default) and a hand-off point exists
  Then a dashed vertical divider is drawn at the hand-off (first row with a forecast)
  And a subtle shaded band covers the forecast region behind the series
  And with showForecastRegion false, neither the divider nor the shaded region render
```

```gherkin
Scenario: Missing bounds
  Given a row without numeric lower/upper (e.g. the actual-only period)
  Then the cone band breaks there (only the forecast region is shaded)
```

```gherkin
Scenario: Band excluded from chrome
  Given showTooltip and/or showLegend are true
  Then the synthetic band range series is filtered out of the tooltip and legend
  And only the actual and forecast series appear there
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a point
  Then a card shows the point's actual and/or forecast value (not the band)
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders its axes and grid with no lines or band and does not throw
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
