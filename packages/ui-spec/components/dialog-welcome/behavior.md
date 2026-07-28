# DialogWelcome — behavior

DialogWelcome is headerless. Its layout (`single` vs `carousel`) is derived
from how many `<DialogWelcomeSlide>` children are passed — it is not a prop.

## Layout selection

```gherkin
Scenario: One slide renders the single layout
  Given a DialogWelcome with exactly one <DialogWelcomeSlide> child
  Then it renders that slide's image + title/description
  And a primary "call to action" button plus a "Close" button below it
  And no footer/position-indicator is rendered
```

```gherkin
Scenario: Two or more slides render the carousel layout
  Given a DialogWelcome with N <DialogWelcomeSlide> children, 2 <= N <= 5
  Then each slide (its own image + title/description) becomes one Carousel
       slide
  And a DialogFooterCarousel is rendered inside the Carousel, driving
      navigation from context
  And no CTA/Close button pair is rendered outside the footer
```

## Navigation (carousel layout)

```gherkin
Scenario: Advancing through slides
  Given a DialogWelcome open on its first slide (carousel layout)
  When the user activates the footer's Next control
  Then the Carousel scrolls to the following slide
  And the footer re-derives its first/middle/last state from the new position
```

```gherkin
Scenario: Closing on the last slide
  Given a DialogWelcome open on its last slide (carousel layout)
  When the user activates the footer's Close control
  Then the dialog closes (onOpenChange(false, …) fires in uncontrolled mode)
```

## Closing (single layout)

```gherkin
Scenario: Closing via the Close button
  Given a DialogWelcome in the single layout
  When the user activates the Close button
  Then the dialog closes (onOpenChange(false, …) fires in uncontrolled mode)
```

```gherkin
Scenario: Activating the call-to-action
  Given a DialogWelcome in the single layout with an `onPrimaryAction` handler
  When the user activates the CTA button
  Then `onPrimaryAction` fires
  And the dialog does NOT close on its own — the caller decides via
      `open`/`onOpenChange` if the action should close it
```

## Composition

```gherkin
Scenario: Too many slides
  Given a DialogWelcome with more than 5 <DialogWelcomeSlide> children
  Then only the first 5 reach the Carousel (and the footer's dot indicator)
  And a development-mode console warning is logged
```

```gherkin
Scenario: Too few slides
  Given a DialogWelcome with fewer than 1 <DialogWelcomeSlide> child
  Then a development-mode console warning is logged
  And nothing is clamped (there is nothing to add)
```

```gherkin
Scenario: Root props pass through
  Given a DialogWelcome with `open`/`onOpenChange`/`defaultOpen`/`modal`
  Then it behaves exactly as the equivalent `DialogRoot` props would
```
