# ToggleGroup — behavior

```gherkin
Scenario: Press an item
  Given a ToggleGroup with items
  When the user clicks an item
  Then it becomes pressed (tinted) and its value is added to the group value
```

```gherkin
Scenario: Single vs. multiple
  Given a single-selection group
  When the user presses another item
  Then the previously pressed item is released
  (a multiple-selection group keeps both pressed)
```

```gherkin
Scenario: Standalone toggle
  Given a standalone Toggle
  When the user clicks it
  Then it flips its pressed state (onPressedChange fires)
```

```gherkin
Scenario: Disabled
  Given disabled is set
  Then the toggle(s) cannot be pressed or focused
```
