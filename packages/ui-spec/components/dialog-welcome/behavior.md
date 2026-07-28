# DialogWelcome — behavior

DialogWelcome is headerless. Its layout (`single` vs `carousel`) is derived
by default from how many real `<DialogWelcomeSlide>` children are passed.
Only elements whose type is `DialogWelcomeSlide` are counted; a falsy child
(`null`/`undefined`/`false`, e.g. from a conditional) or any other element
type is ignored rather than miscounted as a slide. `variant` (a real Figma
component property) can override this default explicitly — see "Variant
override" below.

## Layout selection

```gherkin
Scenario: One slide renders the single layout
  Given a DialogWelcome with exactly one <DialogWelcomeSlide> child
  And no `variant` prop
  Then it renders that slide's image + title/description
  And a primary "call to action" button plus a "Close" button below it
  And no footer/position-indicator is rendered
```

```gherkin
Scenario: Two or more slides render the carousel layout
  Given a DialogWelcome with N <DialogWelcomeSlide> children, 2 <= N <= 5
  And no `variant` prop
  Then each slide (its own image + title/description) becomes one Carousel
       slide
  And a DialogFooterCarousel is rendered inside the Carousel, driving
      navigation from context
  And no CTA/Close button pair is rendered outside the footer
```

## Variant override

```gherkin
Scenario: variant="carousel" forces the carousel layout for a single slide
  Given a DialogWelcome with exactly one <DialogWelcomeSlide> child
  And variant="carousel"
  Then the carousel layout renders (Carousel + DialogFooterCarousel)
  And DialogFooterCarousel resolves to its own single-slide 'last' state
      (no Next, Close reachable)
```

```gherkin
Scenario: variant="single" forces the single layout, dropping extra slides
  Given a DialogWelcome with 2 or more <DialogWelcomeSlide> children
  And variant="single"
  Then only the first slide's image + title/description renders
  And the remaining slides are silently dropped
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
```

```gherkin
Scenario: Zero real slides
  Given a DialogWelcome whose children contain no <DialogWelcomeSlide>
        element (e.g. all falsy, fewer than one, or children of another type)
  Then DialogWelcome renders nothing (not even an empty Dialog)
```

```gherkin
Scenario: Root props pass through
  Given a DialogWelcome with `open`/`onOpenChange`/`defaultOpen`/`modal`
  Then it behaves exactly as the equivalent `DialogRoot` props would
```
