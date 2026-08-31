# CardWidgetCarousel — Accessibility

## ARIA

- The Previous `<button>` carries an `aria-label` sourced from the `prevLabel`
  prop (default `'Previous'`). Localize this string for non-English deployments.
- The Next `<button>` carries an `aria-label` sourced from the `nextLabel` prop
  (default `'Next'`). Localize this string for non-English deployments.
- At scroll boundaries a button is marked `aria-disabled="true"` (not removed
  from the DOM), so assistive technology still discovers it and announces its
  disabled state.
- The scroll track (`div`) has no ARIA role. Screen readers traverse the child
  cards directly since they are standard HTML elements.

## Keyboard

| Key           | Target                      | Effect                                                        |
| ------------- | --------------------------- | ------------------------------------------------------------- |
| Tab           | Previous / Next button      | Moves keyboard focus onto either button (both always in DOM). |
| Enter / Space | Navigation button (focused) | Advances or retreats the scroll track by one step.            |
| Enter / Space | Disabled button (focused)   | No-op — the click handler is guarded.                         |

Both buttons are native `<button>` elements, so Enter and Space activation follow
the UA's default behavior without custom `keydown` handling. Disabled buttons use
`aria-disabled` (not `disabled`) to remain in the tab order and preserve focus.

## Focus management

- Both navigation buttons are always present in the DOM. When a button becomes
  disabled at a scroll boundary, focus is not lost — the button stays focusable
  via `aria-disabled` (rather than being unmounted).
- Both navigation buttons have a visible focus ring using `focus-visible:ring-2`
  bound to `--ui-focus-primary`. The ring is suppressed for pointer interactions
  (`:focus-visible` only).

## Screen reader

- Screen readers can navigate to and activate each navigation button by label.
  A disabled button is announced as "Previous, button, disabled" (or "Next").
- The scrollable track (`overflow-x: auto`, hidden scrollbar) does not expose
  a scroll role; assistive technology reads through the children sequentially.
  For very long lists of cards, consider complementing the carousel with a
  "See all" link so AT users can reach all items without repeated button presses.

## Contrast

- Both navigation buttons use `--ui-background-surface-primary` (white / dark
  surface). The chevron icon inherits the default text color from the token
  pipeline, which meets WCAG AA contrast against that surface.

## CardWidget — skeleton loading

- When `skeleton` is true, the loading placeholder has `role="status"` with an
  `aria-label` sourced from the `loadingLabel` prop (default `'Loading'`), so
  assistive technology announces the loading state. Localize `loadingLabel` for
  non-English deployments. The animated pulse bars inside are decorative.
