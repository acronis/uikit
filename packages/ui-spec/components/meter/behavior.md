# Meter — behavior

`Meter` is a labelled proportional bar for a value within a range (Base UI
`Meter`, `role="meter"`).

```gherkin
Scenario: Render a value's share
  Given a label, value, and max
  Then the fill spans value / max of the track (Base UI sizes the indicator)
  And the row shows the formatted value and `· <pct>%` on the right
  And the fill uses the caller-supplied color
```

```gherkin
Scenario: Accessible value
  Given value and max
  Then the meter exposes role="meter" with aria-valuenow / aria-valuemin (0) /
    aria-valuemax (max), an accessible name from the label, and an
    aria-valuetext of "value of max (pct%)"
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true (the default)
  When the user hovers or focuses the meter
  Then a chart-style tooltip card (light surface + border + shadow) shows a color
    dot, the label, and "value of max · pct%"
  And with showTooltip false, no tooltip is wired
```

```gherkin
Scenario: Zero or empty range
  Given max is 0 (or value is 0)
  Then the share reads 0% and the fill is empty, without dividing by zero
```

```gherkin
Scenario: Stacked into a ranked breakdown
  Given several meters sharing one max (the total), sorted by value
  Then they read as a ranked bar-list of shares
```
