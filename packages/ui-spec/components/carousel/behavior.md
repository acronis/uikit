# Carousel — behavior

Carousel is a composable slider: the root sets up the Embla instance and
context; `CarouselContent`/`CarouselItem` lay out the track and slides;
`CarouselPrevious`/`CarouselNext` drive navigation from that shared context.

## Navigation

```gherkin
Scenario: Advancing to the next slide
  Given a Carousel on its first of several slides
  When the user activates the next control
  Then the track scrolls to the following slide
  And the previous control becomes enabled
```

```gherkin
Scenario: The edge controls are disabled
  Given a Carousel on its first slide, with `opts.loop` unset (or false)
  Then the previous control is disabled
  And, once on the last slide, the next control becomes disabled
```

```gherkin
Scenario: Looping
  Given a Carousel with `opts={{ loop: true }}`
  Then both the previous and next controls stay enabled at every slide,
       wrapping around at the ends
```

```gherkin
Scenario: Keyboard navigation
  Given a Carousel with focus inside its root
  When the user presses ArrowRight (horizontal orientation)
  Then the track scrolls to the next slide
  When the user presses ArrowLeft
  Then the track scrolls to the previous slide
```

## Orientation

```gherkin
Scenario: Vertical orientation
  Given a Carousel with orientation="vertical"
  Then CarouselContent lays its items out in a column instead of a row
  And CarouselPrevious/CarouselNext offset from the top/bottom instead of the sides
```

## Composition

```gherkin
Scenario: Parts require a Carousel ancestor
  Given a CarouselContent, CarouselItem, CarouselPrevious, or CarouselNext
        rendered without a wrapping Carousel
  Then it throws "useCarousel must be used within a <Carousel />"
```

```gherkin
Scenario: Reading the underlying Embla API
  Given a Carousel with a setApi callback
  When the Embla instance initializes
  Then setApi is called once with that CarouselApi instance
```

## Pass-through

```gherkin
Scenario: A custom className is merged, not replaced
  Given a CarouselItem with className="md:basis-1/2"
  When it renders
  Then it carries both "md:basis-1/2" and the item's base layout classes
```
