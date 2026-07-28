# DialogFooterCarousel — behavior

DialogFooterCarousel renders inside a `<Carousel>` and reads
`canScrollPrev`/`canScrollNext`/`scrollPrev`/`scrollNext` from its context via
`useCarousel()`. It has no `variant`/`state` prop — the row always reflects
the Carousel's real position.

## State derivation

```gherkin
Scenario: First slide
  Given a DialogFooterCarousel inside a Carousel on its first slide
  Then no Back control is rendered
  And the dot at index 0 is active
  And a Next control is rendered, calling scrollNext() on activation
```

```gherkin
Scenario: A middle slide
  Given a DialogFooterCarousel inside a Carousel on a slide that is neither
        first nor last
  Then a Back control is rendered, calling scrollPrev() on activation
  And the dot at the Carousel's real selectedScrollSnap() index is active
  And a Next control is rendered, calling scrollNext() on activation
```

```gherkin
Scenario: Last slide
  Given a DialogFooterCarousel inside a Carousel on its last slide
  Then a Back control is rendered, calling scrollPrev() on activation
  And the dot at the last index is active
  And no Next control is rendered
  And a Close control is rendered in its place
```

```gherkin
Scenario: A single slide
  Given a DialogFooterCarousel inside a Carousel with exactly one slide
  Then no Back control is rendered
  And the dot at index 0 is active
  And no Next control is rendered
  And a Close control is rendered in its place
```

```gherkin
Scenario: The indicator matches the real slide count, within [1, 5]
  Given a Carousel with N slides (Embla's scrollSnapList().length), 1 <= N <= 5
  Then DialogFooterCarousel renders exactly N dot slots, one per slide
```

```gherkin
Scenario: Too many slides
  Given a Carousel with more than 5 slides (e.g. used standalone, bypassing
        DialogWelcome's own children slice)
  Then DialogFooterCarousel renders only the first 5 dot slots
  And a development-mode console warning is logged
```

```gherkin
Scenario: Too few slides
  Given a Carousel with fewer than 1 slide
  Then a development-mode console warning is logged
```

## Closing

```gherkin
Scenario: Close actually closes the dialog
  Given a DialogFooterCarousel on its last slide, rendered within a Dialog
  When the user activates the Close control
  Then the ambient Dialog closes (Base UI composition via DialogClose's
       `render` prop — not a manual onClick handler)
```

## Composition

```gherkin
Scenario: Requires a Carousel ancestor
  Given a DialogFooterCarousel rendered without a wrapping Carousel
  Then it throws "useCarousel must be used within a <Carousel />" (inherited
       from Carousel's own useCarousel() guard)
```
