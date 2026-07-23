# ConfidenceCone — behavior

`ConfidenceCone` composes a solid actual line, a dashed forecast line, and a
shaded prediction band (the "cone") on the shared `Chart` primitives.

```gherkin
Scenario: Actual + forecast + cone (one color)
  Given data with actual values up to a hand-off point, then forecast values with lower/upper bounds
  Then the actual period renders as a solid line with a filled area beneath it
  And the forecast period renders as a dashed line
  And a shaded band fills between lower and upper across the forecast, typically widening with the horizon
  And the whole metric uses one color: the actual area, forecast line, and cone band all reuse the actual series' color (actual vs forecast differ by line style, not hue)
  And the areas never mark points (no dots, no active dot on hover)
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
