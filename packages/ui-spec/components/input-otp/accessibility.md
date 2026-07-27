# InputOTP — Accessibility

- **Grouping:** the root is `role="group"`, so assistive tech announces the
  slots as a related set. Pass `aria-label`/`aria-labelledby` on the root (it
  forwards arbitrary `div` props) to name the group — e.g. from an external
  `Field` label, since InputOTP itself renders no label.
- **Per-slot name:** each slot is a native `<input>` with its own
  `aria-label` (default `Digit N of length`, overridable via `slotAriaLabel`).
- **Keyboard:** digits type normally; ArrowLeft/ArrowRight move focus between
  slots; Backspace on an empty slot moves back and clears the previous one.
  Standard Tab/Shift+Tab also move between slots.
- **Autofill:** each slot carries `autocomplete="one-time-code"`,
  `inputMode="numeric"`, and `pattern="[0-9]*"` so browsers/password managers
  can offer OTP autofill and mobile keyboards default to numeric.
- **Numeric-only:** `inputMode`/`pattern` are keyboard hints only, not
  enforcement — both typed and pasted input are filtered to digits in JS. A
  non-digit keystroke is rejected outright; non-digit characters are stripped
  from a paste.
- **Error:** `error` sets `aria-invalid="true"` on every slot; the message
  itself is expected to live in a wrapping `Field` (not part of this bare
  component), same as `Input`.
- **Focus visible:** keyboard focus paints a 3px ring on the focused slot —
  `--ui-focus-primary` normally, `--ui-focus-error` while `error` is set.
- **Disabled:** native `disabled` removes each slot from the tab order.
- **Contrast:** value/placeholder/border pairs come from the design tokens,
  authored to meet WCAG contrast.
- **WCAG:** 1.3.1 (info/relationships), 2.1.1 (keyboard), 2.4.7 (focus
  visible), 1.4.3 / 1.4.11 (contrast), 4.1.2.
