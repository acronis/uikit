# SegmentControl — Accessibility

## Role and name

- The root has `role="radiogroup"`; every item has `role="radio"` and exposes
  `aria-checked`.
- Supply an accessible name to the group through `aria-label` or
  `aria-labelledby`. Item labels and counters form each item's accessible name.

## Keyboard and focus

- `Tab` and `Shift+Tab` enter and leave the radio group at its roving tab stop.
- Arrow keys move selection and focus between enabled items, respecting writing
  direction as provided by the underlying radio-group primitive.
- `Space` selects the focused item. Disabled items cannot be selected.
- Keyboard focus displays the 3px `--ui-focus-primary` ring; pointer focus does
  not.

## Contrast and disabled state

- Idle, hover, and selected foreground/surface pairs resolve through the
  SegmentControl token tier, preserving brand and light/dark overrides.
- Disabled items are inert and visually muted. Do not use a disabled option as
  the only way to communicate essential status.
