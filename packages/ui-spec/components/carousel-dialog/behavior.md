# CarouselDialog — behavior

CarouselDialog is a pure function of its props — no internal state. The
carousel engine (which slide is active, how to move between slides) lives in
the caller — typically `DialogWelcome`'s Embla instance, threaded through
`DialogFooterCarousel` — which passes `slideCount`/`selectedIndex` in and
receives `onSelectIndex`/`onBack`/`onNext`/`onPrimaryAction` back out.

```gherkin
Scenario: First slide (variant="first")
  Given a CarouselDialog with variant="first"
  Then `Back` is not rendered
  And `Next` is rendered in boxRight
  And the dot indicator marks the first dot active
```

```gherkin
Scenario: A middle slide (variant="middle")
  Given a CarouselDialog with variant="middle"
  Then `Back` is rendered in boxLeft
  And `Next` is rendered in boxRight
```

```gherkin
Scenario: The last slide (variant="last")
  Given a CarouselDialog with variant="last"
  Then `Back` is rendered in boxLeft
  And the call-to-action label (default "Call to action") replaces `Next` in boxRight
```

```gherkin
Scenario: Jumping to an arbitrary slide
  Given a CarouselDialog with slideCount=3
  When a dot other than the active one is activated
  Then onSelectIndex fires with that dot's 0-based index
  And the caller is responsible for actually moving the carousel and passing
    back an updated `variant`/`selectedIndex`
```

```gherkin
Scenario: A single-slide carousel
  Given a CarouselDialog with slideCount=1
  Then only one dot renders, always active
  And the caller is responsible for choosing variant="last" for that single
    slide (it is both the first and the last), so the call-to-action button
    is reachable
```
