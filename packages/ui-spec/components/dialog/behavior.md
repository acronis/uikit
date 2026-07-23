# Dialog — behavior

Dialog is a recipe over the DialogRoot primitive: it owns the same `open`
state and modal focus/scroll management, and adds a `variant`-driven preset for
the title, body and footer.

## Variants

```gherkin
Scenario: A variant selects its canned content
  Given a Dialog with variant = "discard changes"
  When it opens
  Then the title reads "Discard changes"
  And the body asks to confirm discarding changes
  And the footer shows a "Go back" secondary and a destructive "Confirm"
```

```gherkin
Scenario: The rename variant embeds a text field
  Given a Dialog with variant = "rename"
  When it opens
  Then the body renders a text field prefilled with the current name
```

```gherkin
Scenario: The read-only variant has a single action
  Given a Dialog with variant = "read-only"
  When it opens
  Then the footer shows only a primary "Done" button (no secondary button)
```

```gherkin
Scenario: The wide variant is a free-form escape hatch
  Given a Dialog with variant = "wide" and a footer override
  When it opens
  Then the popup defaults to the large (832px) size
  And the footer renders exactly the caller-supplied buttons, not a canned
  secondary/primary pair
```

## Body slot

```gherkin
Scenario: Children override the canned body
  Given a Dialog with children provided
  When it opens
  Then the body renders the children instead of the variant's default copy
  And the header title and footer buttons are unchanged
```

## Object name interpolation

```gherkin
Scenario: objectName replaces the generic placeholder
  Given a Dialog with variant = "rename" and objectName = "Q3 Report.xlsx"
  When it opens
  Then the title reads "Rename Q3 Report.xlsx"
  And the body's text field is prefilled with "Q3 Report.xlsx"
```

```gherkin
Scenario: objectName is ignored by variants with no placeholder
  Given a Dialog with variant = "default" and objectName provided
  When it opens
  Then the canned title and body render unchanged
```

## Footer override

```gherkin
Scenario: The footer prop replaces the canned buttons
  Given a Dialog with a footer override provided
  When it opens
  Then the footer renders the override content
  And secondaryLabel/primaryLabel are ignored
```

## Loading

```gherkin
Scenario: The loading overlay covers body and footer
  Given an open Dialog with hasLoading = true
  Then a spinner overlay is shown from just below the header to the bottom
  And it is hidden when hasLoading is false
```

## Header and footer optionality

```gherkin
Scenario: Hiding the header keeps the dialog's accessible name
  Given a Dialog with hasHeader = false
  When it opens
  Then the visible title bar and close button are not rendered
  And the dialog still has an accessible name (the title renders off-screen)
```

```gherkin
Scenario: Hiding the footer removes its actions
  Given a Dialog with hasFooter = false
  When it opens
  Then no secondary/primary/footer-override content is rendered
```

```gherkin
Scenario: Hiding both leaves only the body
  Given a Dialog with hasHeader = false and hasFooter = false
  When it opens
  Then only the body content is visible
  And the dialog still has an accessible name
```

```gherkin
Scenario: The loading overlay adapts to a hidden header
  Given a Dialog with hasHeader = false and hasLoading = true
  When it opens
  Then the spinner overlay covers from the very top of the popup, not from
  below a (non-existent) header
```

## Opening & closing

```gherkin
Scenario: Dismissing via the secondary button
  Given an open Dialog with a secondary button
  When the user activates it
  Then the dialog closes and open-change(false) fires
```

```gherkin
Scenario: Dismissing with the keyboard
  Given an open modal Dialog
  When the user presses Escape
  Then the dialog closes and open-change(false) fires
```

```gherkin
Scenario: Controlled
  Given a Dialog with a fixed open prop
  When the user attempts to dismiss it
  Then internal state does NOT change on its own
  And open-change fires so the consumer can update the open prop
```
