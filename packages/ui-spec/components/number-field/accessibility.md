# NumberField — accessibility

- Built on Base UI's NumberField: the input is keyboard-operable (↑/↓ step,
  PageUp/PageDown, Home/End) and exposes the value to assistive tech; the steppers
  are real `<button>`s.
- Give the steppers accessible labels ("Increase" / "Decrease") and the input a
  name — via `aria-label` or by pairing the field with a `Field` / `FieldLabel`.

## Contrast

The box reuses the InputText tier (border / value text meet contrast in light and
dark); the stepper icons use the muted `--ui-text-on-surface-secondary`, going to
the primary text on hover, and the disabled token when disabled.
