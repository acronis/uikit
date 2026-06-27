# Slider — behavior

```gherkin
Scenario: Drag to change the value
  Given a Slider with a value
  When the user drags the thumb (or uses arrow keys)
  Then the value updates and onValueChange fires, clamped to min/max and snapped to step
```

```gherkin
Scenario: Range
  Given a Slider with an array value [low, high]
  Then two thumbs render and each is dragged independently (they cannot cross)
```

```gherkin
Scenario: Disabled
  Given disabled is set
  Then the thumb cannot be focused or dragged
```
