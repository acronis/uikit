# ButtonMenu — Accessibility

## Role & name

- Renders a native `<button>` (role `button`). Its accessible name comes from the
  label text content — always provide a meaningful label.
- The trailing chevron is decorative; it must not be the only thing conveying the
  action and needs no separate accessible name.

## Expanded state

- While `open`, the button sets `aria-expanded="true"`; when closed the attribute
  is absent (treated as not expanded). Keep `open` in sync with the menu the
  button controls.
- When wired to a real menu, the trigger should also reference the menu it
  controls (e.g. `aria-haspopup="menu"` and `aria-controls` pointing at the
  popup). The menu component owns those; ButtonMenu only owns the trigger.

## Keyboard

- `Tab` / `Shift+Tab` — move focus to / from the button.
- `Enter` / `Space` — activate the button (toggles the associated menu).
- Disabled buttons are skipped in the tab order and ignore activation.

## Focus

- `:focus-visible` paints a 3px ring in `--ui-focus-primary` flush to the button
  edge (no offset); the ring is suppressed for pointer focus.

## Contrast

- Color pairs come from `@acronis-platform/tokens-pd` and are maintained against
  WCAG AA at the design-token level. The disabled treatment uses dedicated
  disabled tokens rather than an opacity dim, so contrast stays predictable.
