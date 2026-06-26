# Progress — behavior

Progress shows the completion of a task. State is driven entirely by the `value`
prop; there is no internal state.

```gherkin
Scenario: Determinate
  Given a Progress with value={40}
  Then the indicator fills 40% of the track
  And aria-valuenow is 40
```

```gherkin
Scenario: Custom range
  Given a Progress with value={5} and max={10}
  Then the indicator fills 50% of the track
  And aria-valuemax is 10
```

```gherkin
Scenario: Indeterminate
  Given a Progress with value={null}
  Then a fixed-width indicator slides across the track continuously
  And aria-valuenow is omitted
  And the root carries data-indeterminate
```

```gherkin
Scenario: Reduced motion
  Given a user with prefers-reduced-motion
  Then the platform honors that preference for the sliding animation
```
