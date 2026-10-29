# DialogRoot — behavior

DialogRoot is a modal overlay assembled from composable parts. It owns one
piece of state — `open` — and the focus/scroll management that comes with
being modal.

## Opening & closing

```gherkin
Scenario: Opening from the trigger
  Given a closed DialogRoot with a DialogTrigger
  When the user activates the trigger
  Then the overlay and popup appear
  And focus moves into the dialog
  And open-change(true) fires
```

```gherkin
Scenario: Closing via the close button
  Given an open DialogRoot with a DialogCloseButton
  When the user activates the close button
  Then the dialog closes
  And open-change(false) fires
  And focus returns to the trigger
```

```gherkin
Scenario: Dismissing with the keyboard
  Given an open modal DialogRoot
  When the user presses Escape
  Then the dialog closes and open-change(false) fires
```

```gherkin
Scenario: Dismissing by clicking outside
  Given an open DialogRoot
  When the user presses on the overlay outside the popup
  Then the dialog closes and open-change(false) fires
```

## Controlled vs uncontrolled

```gherkin
Scenario: Uncontrolled with default-open
  Given a DialogRoot with default-open = true and no open prop
  When it mounts
  Then it renders open, and the user can dismiss it without consumer code
```

```gherkin
Scenario: Controlled
  Given a DialogRoot with a fixed open prop
  When the user attempts to dismiss it
  Then internal state does NOT change on its own
  And open-change fires so the consumer can update the open prop
```

## Modality

```gherkin
Scenario: Modal locks the background (default)
  Given an open DialogRoot with modal = true
  Then background content is inert, scroll is locked, and focus is trapped
  inside the dialog until it closes
```

## Placement

```gherkin
Scenario: The popup is centered by default
  Given a DialogRoot whose DialogContent has no verticalAlign (or
  verticalAlign = "center")
  When it opens
  Then the popup is centered in the viewport, horizontally and vertically
```

```gherkin
Scenario: verticalAlign = "top" pins the popup near the top edge
  Given a DialogRoot whose DialogContent has verticalAlign = "top"
  When it opens
  Then the popup's top edge sits 48px below the top of the viewport
  And it stays horizontally centered
  And it keeps its content height (still capped at 100dvh - 96px), leaving
  the viewport below it empty
```
