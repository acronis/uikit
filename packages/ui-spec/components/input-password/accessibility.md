# InputPassword — Accessibility

- **Label association:** the `label` is a real `<label htmlFor>` tied to the
  input's `id` (auto-generated when not supplied), so clicking it focuses the
  input and screen readers announce the field name.
- **Required:** `required` sets `aria-required="true"` on the input; the visual
  `*` marker is decorative (no `aria-hidden` needed beyond styling — the
  required semantics come from the attribute).
- **Description / error:** whichever message is shown is linked to the input
  via `aria-describedby`, so it is announced with the field. The error message
  also drives `aria-invalid="true"` on the input.
- **Toggle button:** a native `<button>` (`ButtonIconInput`) with an explicit
  `aria-label` that tracks its state ("Show password" / "Hide password",
  overridable via `showPasswordLabel`/`hidePasswordLabel`) and `aria-pressed`
  reflecting whether the value is currently shown. Reachable by Tab and
  activated by Enter / Space.
- **Keyboard:** the input is a native text field (`type` toggles between
  `password`/`text`); the toggle button is a separate tab stop after it.
- **Focus visible:** keyboard focus on the input paints a 3px ring on the box —
  `--ui-focus-primary` normally and `--ui-focus-error` in the error state; the
  toggle button has its own focus ring (see `ButtonIconInput`).
- **Disabled:** native `disabled` removes both the input and the toggle button
  from the tab order; not used to convey state by color alone (the field is
  also inert).
- **Contrast:** label / value / placeholder / message / border pairs come from
  the design tokens, authored to meet WCAG contrast.
- **WCAG:** 1.3.1 (info/relationships), 2.1.1 (keyboard), 2.4.7 (focus
  visible), 1.4.3 / 1.4.11 (contrast), 3.3.1 / 3.3.2 (error identification +
  labels), 4.1.2.
