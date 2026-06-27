# ProgressCircle — behavior

A circular progress indicator. State is driven by `value`; there is no internal
state.

```gherkin
Scenario: Fill
  Given a ProgressCircle with value={75}
  Then the arc fills 75% of the ring
  And aria-valuenow is 75
```

```gherkin
Scenario: Status by level
  Given no explicit status
  Then the arc color is derived from value/max (danger → critical → warning → success)
```

```gherkin
Scenario: Status override
  Given status="danger" with value={90}
  Then the arc is the danger color regardless of value
```

```gherkin
Scenario: Center content
  Given showValue, the center shows the rounded percentage
  Given showIcon, the center shows a status icon (priority over the percentage)
  Given children, they render in the center (priority over icon / percentage)
```

```gherkin
Scenario: Custom range
  Given value={5} and max={10}
  Then the arc fills 50% and aria-valuemax is 10
```
