# CategoryBar — behavior

`CategoryBar` renders a single bar split into proportional colored segments from
a `data` array and a per-segment `config`. It is a plain flex composition, not a
recharts chart.

```gherkin
Scenario: Render segments proportional to value
  Given data with segments (each a key + value) and a config mapping each key to a label and color
  Then one segment renders per datum, its width its value over the sum of all values
  And each segment is filled from its config color
```

```gherkin
Scenario: Size variant
  Given size is sm, md (default), or lg
  Then the track renders at the corresponding height
```

```gherkin
Scenario: Legend
  Given showLegend is true
  Then a legend renders below the bar with a color dot + label per segment
  And each segment's value plus its share of the total as a percentage
  And when showLegend is false no legend renders
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a segment
  Then a card shows a color dot, the segment's label, and its value + percentage
  And defaultOpenIndex renders that segment's tooltip initially open
  And tooltipContent replaces the default card body with a per-segment render
```

```gherkin
Scenario: Value formatting
  Given a valueFormatter
  Then the legend and tooltip show the formatted value
```

```gherkin
Scenario: Accessible summary
  Given no aria-label
  Then the bar exposes a role="img" with a generated "<label> <value>" summary
  Given an aria-label
  Then that string is used instead
```

```gherkin
Scenario: All-zero data
  Given every segment value is 0
  Then no segment takes width, each share reads 0%, and nothing divides by zero
```
