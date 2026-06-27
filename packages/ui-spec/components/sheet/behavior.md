# Sheet — behavior

Sheet is a modal side panel built on the Base UI Dialog primitive. It owns one
piece of state, `open`; `side` chooses the edge.

```gherkin
Scenario: Open from a trigger
  Given a Sheet with a SheetTrigger
  When the user activates the trigger
  Then the panel slides in from its side and the overlay covers the page
  And open-change(true) is emitted
```

```gherkin
Scenario: Side
  Given a SheetContent with side="left"
  Then the panel anchors to the left edge and slides in from the left
  (right is the default; top/bottom are full-width, left/right full-height)
```

```gherkin
Scenario: Dismiss
  Given an open Sheet
  When the user clicks the close button, presses Esc, or clicks the overlay
  Then the panel slides out and open-change(false) is emitted
```

```gherkin
Scenario: Controlled
  Given a Sheet with a controlled `open` prop
  When a dismiss interaction occurs
  Then open-change is emitted but the panel stays until the consumer updates `open`
```

```gherkin
Scenario: Focus + scroll
  Given an open modal Sheet
  Then focus is trapped within the panel and background scroll is locked
  And focus returns to the trigger on close
```

```gherkin
Scenario: Details alias
  Given the Vue kit's `Details` component
  Then `Details*` (Details / DetailsContent / …) are aliases of `Sheet*` for a
  1:1 drop-in migration
```
