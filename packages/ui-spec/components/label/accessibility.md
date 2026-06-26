# Label — accessibility

- Renders a native `<label>`. Associate it with its control via `htmlFor` (the
  control's `id`) so clicking the label focuses the control and assistive tech
  reads the label as the control's accessible name.
- Prefer an explicit `htmlFor`/`id` pairing over wrapping the control in the
  label — explicit association is unambiguous for all controls.
- The `peer-disabled:` dimming is visual only; the control's own `disabled`
  state is what assistive tech announces.

## Contrast

The label inherits `--ui-text-on-surface-primary` (text-foreground), which meets
text contrast against the page surface in light and dark.
