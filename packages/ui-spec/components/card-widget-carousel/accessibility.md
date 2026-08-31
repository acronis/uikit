# CardWidgetCarousel — Accessibility

## ARIA

- The Previous `<button>` carries an `aria-label` sourced from the `prevLabel`
  prop (default `'Previous'`). Localize this string for non-English deployments.
- The Next `<button>` carries an `aria-label` sourced from the `nextLabel` prop
  (default `'Next'`). Localize this string for non-English deployments.
- The scroll track (`div`) has no ARIA role. Screen readers traverse the child
  cards directly since they are standard HTML elements.

## Keyboard

| Key           | Target                      | Effect                                             |
| ------------- | --------------------------- | -------------------------------------------------- |
| Tab           | Previous / Next button      | Moves keyboard focus onto the visible button(s).   |
| Enter / Space | Navigation button (focused) | Advances or retreats the scroll track by one step. |

Both buttons are native `<button>` elements, so Enter and Space activation follow
the UA's default behavior without custom `keydown` handling.

## Focus management

- Both navigation buttons have a visible focus ring using `focus-visible:ring-2`
  bound to `--ui-focus-primary`. The ring is suppressed for pointer interactions
  (`:focus-visible` only).

## Screen reader

- Screen readers can navigate to and activate each navigation button by label.
- The scrollable track (`overflow-x: auto`, hidden scrollbar) does not expose
  a scroll role; assistive technology reads through the children sequentially.
  For very long lists of cards, consider complementing the carousel with a
  "See all" link so AT users can reach all items without repeated button presses.

## Contrast

- Both navigation buttons use `--ui-background-surface-primary` (white / dark
  surface). The chevron icon inherits the default text color from the token
  pipeline, which meets WCAG AA contrast against that surface.

## CardWidget — skeleton loading

- When `skeleton` is true, the loading placeholder has `role="status"` with
  `aria-label="Loading"`, so assistive technology announces the loading state.
  The animated pulse bars inside are decorative.
