# Dialog — behavior

Dialog is a modal overlay assembled from composable parts. It owns one piece of
state — `open` — and the focus/scroll management that comes with being modal.

## Opening & closing

```gherkin
Scenario: Opening from the trigger
  Given a closed Dialog with a DialogTrigger
  When the user activates the trigger
  Then the overlay and popup appear
  And focus moves into the dialog
  And open-change(true) fires
```

```gherkin
Scenario: Closing via the close button
  Given an open Dialog with a DialogCloseButton
  When the user activates the close button
  Then the dialog closes
  And open-change(false) fires
  And focus returns to the trigger
```

```gherkin
Scenario: Dismissing with the keyboard
  Given an open modal Dialog
  When the user presses Escape
  Then the dialog closes and open-change(false) fires
```

```gherkin
Scenario: Dismissing by clicking outside
  Given an open Dialog
  When the user presses on the overlay outside the popup
  Then the dialog closes and open-change(false) fires
```

## Controlled vs uncontrolled

```gherkin
Scenario: Uncontrolled with default-open
  Given a Dialog with default-open = true and no open prop
  When it mounts
  Then it renders open, and the user can dismiss it without consumer code
```

```gherkin
Scenario: Controlled
  Given a Dialog with a fixed open prop
  When the user attempts to dismiss it
  Then internal state does NOT change on its own
  And open-change fires so the consumer can update the open prop
```

## Modality

```gherkin
Scenario: Modal locks the background (default)
  Given an open Dialog with modal = true
  Then background content is inert, scroll is locked, and focus is trapped
  inside the dialog until it closes
```
