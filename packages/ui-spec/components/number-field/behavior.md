# NumberField — behavior

```gherkin
Scenario: Step the value
  Given a NumberField with a value
  When the user clicks − / + (or presses ↓ / ↑)
  Then the value decrements / increments by step, clamped to min/max
```

```gherkin
Scenario: Type a value
  Given the input is focused
  When the user types a number and blurs
  Then the value is parsed and clamped to min/max
```

```gherkin
Scenario: Disabled
  Given disabled is set
  Then the input and both steppers are non-interactive
```
