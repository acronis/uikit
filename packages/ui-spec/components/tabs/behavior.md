# Tabs — behavior

Tabs shows one panel at a time and lets the user switch between them. It owns
the selected-tab state (or the consumer controls it via `value`).

## Selecting

```gherkin
Scenario: Activating a tab by pointer
  Given a tab group with the first tab selected
  When the user clicks another trigger
  Then that trigger becomes active (data-active, aria-selected="true")
  And its content panel replaces the previous one
  And value-change fires with the new value
```

```gherkin
Scenario: Keyboard navigation (manual activation)
  Given focus is on the active trigger
  When the user presses Arrow keys (per orientation)
  Then focus moves between triggers without changing the selection
  And pressing Enter or Space activates the focused trigger
```

## Controlled vs uncontrolled

```gherkin
Scenario: Uncontrolled with default-value
  Given a Tabs with default-value = "account" and no value prop
  When it mounts
  Then the "account" tab is selected and the user can switch freely
```

```gherkin
Scenario: Controlled
  Given a Tabs with a fixed value prop
  When the user activates another tab
  Then the selection does NOT change on its own
  And value-change fires so the consumer can update value
```

## Orientation

```gherkin
Scenario: Vertical orientation
  Given a Tabs with orientation = "vertical"
  Then Up/Down arrows move between triggers (instead of Left/Right)
```
