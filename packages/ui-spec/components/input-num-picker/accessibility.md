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
  (± `largeStep`), Home/End (to `min`/`max`); both steppers are native
  `<button>`s, reachable by Tab and activated by Enter/Space.
- **Bounds:** a stepper is `disabled` (removed from the tab order, not just
  visually muted) once its direction is exhausted at `min`/`max`.
- **Focus visible:** keyboard focus paints a 3px `--ui-focus-primary` ring
  flush to the box.
- **Disabled:** native `disabled` removes the value input and both steppers
  from the tab order.
- **Contrast:** label / value / border pairs come from the design tokens,
  authored to meet WCAG contrast.
- **WCAG:** 1.3.1 (info/relationships), 2.1.1 (keyboard), 2.4.7 (focus
  visible), 1.4.3 / 1.4.11 (contrast), 4.1.2 (name, role, value).
