# Chip — Accessibility

## Roles

- **Removable:** the chip container is presentational; the **× is a real
  `<button>`** with an accessible name (`removeLabel`, default "Remove"). Give
  it a contextual name when there are several chips (e.g. "Remove Backup").
- **Selectable:** the chip container is a toggle — `role="button"` with
  `aria-pressed` reflecting `selected`.

## Keyboard

- **Removable:** Tab focuses the × button; Enter / Space activate it (native
  `<button>`).
- **Selectable:** Tab focuses the chip; Enter / Space activate it (the component
  mirrors native button activation for the `div[role=button]`).

## Focus

- A visible 3px `--ui-focus-primary` ring marks focus — on the × button for
  `removable` (via `focus-within` on the container) and on the chip itself for
  `selectable` (`focus-visible`). Focus is never suppressed without a
  replacement indicator.

## Screen readers

- Selectable chips announce their pressed/unpressed state via `aria-pressed`.
- The remove button announces its label; pair it with the chip's text in the
  accessible name when ambiguity is possible.

## Contrast

- Label, border, and icon colors come from `--ui-chips-*` tokens that meet the
  contrast bar per theme; do not override them with ad-hoc colors.
