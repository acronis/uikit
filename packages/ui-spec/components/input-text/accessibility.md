# InputText — Accessibility

- **Label association:** the `label` is a real `<label htmlFor>` tied to the
  input's `id` (auto-generated when not supplied), so clicking it focuses the
  input and screen readers announce the field name.
- **Required:** `required` sets `aria-required="true"` on the input; the visual `*`
  marker is `aria-hidden` (the asterisk is decorative — the required semantics come
  from the attribute).
- **Description / error:** whichever message is shown is linked to the input via
  `aria-describedby`, so it is announced with the field. The error message also
  drives `aria-invalid="true"` on the input.
- **Clear button:** a native `<button>` with `aria-label="Clear"`; reachable by Tab
  and activated by Enter / Space.
- **Keyboard:** the input is a native text field; the clear button is a separate tab
  stop after it.
- **Focus visible:** keyboard focus paints a 3px ring — `--ui-focus-primary` normally
  and `--ui-focus-error` in the error state — flush to the box; the clear button has
  its own focus ring.
- **Disabled:** native `disabled` removes the input (and clear button) from the tab
  order; not used to convey state by color alone (the field is also inert).
- **Contrast:** label / value / placeholder / message / border pairs come from the
  design tokens, authored to meet WCAG contrast.
- **WCAG:** 1.3.1 (info/relationships), 2.1.1 (keyboard), 2.4.7 (focus visible),
  1.4.3 / 1.4.11 (contrast), 3.3.1 / 3.3.2 (error identification + labels), 4.1.2.
