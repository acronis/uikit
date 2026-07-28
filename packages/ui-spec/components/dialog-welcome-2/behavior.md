# DialogWelcome2 — behavior

```gherkin
Scenario: Opening the carousel variant
  Given a DialogWelcome2 with variant="carousel" and 3 slides
  When it opens
  Then the first slide's image/title/description render
  And the footer renders with variant="start" (no Back, Next visible)
  And the dot indicator marks the first dot active
```

```gherkin
Scenario: Advancing through the carousel
  Given an open DialogWelcome2 carousel on a middle slide
  When Next is activated
  Then the carousel scrolls to the next slide
  And onSelectedIndexChange fires with the new index
  And the footer's variant updates (start/middle/end) to match the new position
```

```gherkin
Scenario: Reaching the last slide
  Given an open DialogWelcome2 carousel on the last slide
  Then the footer renders with variant="end"
  And its call-to-action button (default "Call to action") replaces Next
  When the call-to-action button is activated
  Then onPrimaryAction fires — the dialog does not close automatically
```

```gherkin
Scenario: Jumping directly to a slide
  Given an open DialogWelcome2 carousel
  When a dot other than the active one is activated
  Then the carousel scrolls directly to that slide
  And onSelectedIndexChange fires with its index
```

```gherkin
Scenario: Non-active slides are inert
  Given an open DialogWelcome2 carousel with more than one slide
  Then every slide except the active one is `aria-hidden` and `inert` —
    unreachable by keyboard/screen reader until it becomes active
```

```gherkin
Scenario: Opening the single variant
  Given a DialogWelcome2 with variant="single"
  When it opens
  Then the image/title/description render once, with no footer
  And a primary call-to-action button and a "Close" link render below it
```

```gherkin
Scenario: Closing from the single variant
  Given an open DialogWelcome2 with variant="single"
  When Close is activated
  Then onCloseAction fires
  And the dialog closes (Dialog.Close's default behavior)
```
