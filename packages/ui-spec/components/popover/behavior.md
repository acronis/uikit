# Popover — behavior

Popover shows a floating panel anchored to a trigger. It owns the open state (or
the consumer controls it via `open`).

## Opening & closing

```gherkin
Scenario: Toggling from the trigger
  Given a closed popover
  When the user activates the trigger
  Then the popup opens, positioned per side/align, and receives focus
  And open-change(true) fires
```

```gherkin
Scenario: Dismissing
  Given an open popover
  When the user presses Escape, or presses outside the popup
  Then the popover closes and open-change(false) fires
  And focus returns to the trigger
```

## Controlled vs uncontrolled

```gherkin
Scenario: Uncontrolled with default-open
  Given a Popover with default-open = true and no open prop
  When it mounts
  Then it renders open and the user can dismiss it without consumer code
```

```gherkin
Scenario: Controlled
  Given a Popover with a fixed open prop
  When the user attempts to toggle it
  Then internal state does NOT change on its own
  And open-change fires so the consumer can update open
```

## Positioning

```gherkin
Scenario: Side and alignment
  Given a PopoverContent with side="right" and align="start"
  When it opens
  Then the popup renders to the right of the trigger, aligned to its start edge
  And it flips/shifts to stay within the viewport when space is tight
```
