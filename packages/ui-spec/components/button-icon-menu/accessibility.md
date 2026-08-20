# ButtonIconMenu — Accessibility

## Role & name

- Renders a native `<button>` (role `button`).
- The control is **icon-only**, so it has no text to name it. The accessible name
  comes from `ariaLabel` (or a native `aria-label` / `aria-labelledby`). The
  built-in `'More options'` default is a fallback so the button is never
  unnamed — pass a localized, context-specific name ("Row actions", "Backup plan
  actions") whenever more than one of these sits on a screen.
- The ellipsis glyph is decorative and carries no separate accessible name.

## Expanded state

- The button sets `aria-haspopup="menu"` so assistive technology announces it as
  a menu trigger before activation — unlike a labelled trigger, there is no text
  to imply it.
- While `open`, it sets `aria-expanded="true"`; when closed the attribute is
  absent (treated as not expanded). Keep `open` in sync with the menu it
  controls.
- When wired to a real menu, the trigger should also reference the popup it
  controls (`aria-controls`). The menu component owns that; ButtonIconMenu owns
  only the trigger. Composing via `render={<Menu.Trigger />}` lets Base UI
  manage those attributes.

## Keyboard

- `Tab` / `Shift+Tab` — move focus to / from the button.
- `Enter` / `Space` — activate the button (opens the associated menu).
- Disabled buttons are skipped in the tab order and ignore activation.

## Focus

- `:focus-visible` paints a 3px ring in `--ui-focus-primary` flush to the button
  edge (no offset); the ring is suppressed for pointer focus.

## Contrast

- Color pairs come from `@acronis-platform/tokens-pd` and are maintained against
  WCAG AA at the design-token level. The disabled treatment uses dedicated
  disabled tokens rather than an opacity dim, so contrast stays predictable.

## Target size

- The 32×32 box meets the 24×24 minimum of WCAG 2.2 **Target Size (Minimum)**.
  In dense rows keep adjacent triggers spaced so their targets do not overlap.
