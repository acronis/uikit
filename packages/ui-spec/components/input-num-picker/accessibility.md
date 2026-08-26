# InputNumPicker — Accessibility

- **Label association:** the `label` is a real `<label htmlFor>` tied to the
  value input's `id` (auto-generated when not supplied), so clicking it
  focuses the input and screen readers announce the field name.
- **Required:** `required` is set on the field; the visual `*` marker is
  `aria-hidden` (the asterisk is decorative — the required semantics come from
  the field, not the glyph).
- **Stepper labels:** `decrementLabel`/`incrementLabel` (default "Decrease" /
  "Increase") give each stepper button an accessible name via `aria-label`,
  since the buttons carry only a glyph.
- **Keyboard:** the value input supports Arrow Up/Down (± `step`), Shift+Arrow
  (± `largeStep`), Home/End (to `min`/`max`). Both steppers are native
  `<button>`s but Base UI's `NumberField` hard-codes `tabindex="-1"` on them, so
  they are pointer-activated only and never receive keyboard focus. The tab
  sequence through the component is: value input → the next focusable element
  outside the component.
- **Bounds:** a stepper is `disabled` (genuinely inert — it ignores pointer
  activation, not just visually muted) once its direction is exhausted at
  `min`/`max`.
- **Focus visible:** keyboard focus on the value input paints a 3px
  `--ui-focus-primary` ring on the box (the ring is painted by the box, not by
  the input itself).
- **Disabled:** native `disabled` removes the value input from the tab order and
  makes both steppers inert.
- **Contrast:** label / value / border pairs come from the design tokens,
  authored to meet WCAG contrast.
- **WCAG:** 1.3.1 (info/relationships), 2.1.1 (keyboard) — every value change
  the steppers offer is also reachable from the keyboard on the value input
  (Arrow Up/Down, Shift+Arrow, Home/End), so no functionality is pointer-only
  even though the steppers themselves are pointer-activated — 2.4.7 (focus
  visible), 1.4.3 / 1.4.11 (contrast), 4.1.2 (name, role, value).
