# Tooltip — accessibility

Provided by the Base UI Tooltip primitive; verify these hold after styling.

## Roles & ARIA

- The popup has `role="tooltip"`. The trigger references it via
  `aria-describedby` while open, so screen readers announce the hint as a
  description of the trigger.
- The trigger must be a real, focusable element (a button by default, or any
  focusable element via the trigger's `render` prop) so the tooltip is reachable
  by keyboard, not just pointer.

## Keyboard & focus

- **Focus** the trigger opens the tooltip; **blur** closes it.
- **Escape** closes an open tooltip.
- The tooltip is supplementary — focus never moves into the popup, and the popup
  contains no interactive content (use a Popover/Dialog for that).

## Content guidance

- Keep tooltips to short, non-essential text. Don't put critical information or
  actions in a tooltip — it isn't available to touch users and vanishes on blur.
- Don't rely on a tooltip as the only label for an icon-only control; give the
  control its own accessible name (e.g. `aria-label`) as well.

## Contrast

- `--ui-tooltip-label-color` on `--ui-tooltip-container-color` meets contrast; the bubble's
  ~90% opacity keeps text legible over varied backgrounds.
