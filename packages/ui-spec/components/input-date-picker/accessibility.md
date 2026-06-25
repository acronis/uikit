# InputDatePicker — Accessibility

- **Trigger role:** the trigger is a native `<button>` (`role="button"`) with
  `aria-haspopup="dialog"` — it announces that activating it opens a calendar.
- **Label association:** the `label` is a real `<label htmlFor>` tied to the trigger's
  `id` (auto-generated when not supplied), so clicking it focuses the trigger and
  screen readers announce the field name.
- **Required:** `required` sets `aria-required="true"`; the visual `*` is `aria-hidden`.
- **Open state:** while the consumer's calendar is open, pass `open` so the trigger
  reflects `aria-expanded="true"` (and paints the active border).
- **Error:** set `error` (or `aria-invalid`); the message is associated via
  `aria-describedby` and the trigger gets `aria-invalid="true"` + the error border.
- **Keyboard:** the trigger is reachable by Tab and activated by Enter / Space; the
  consumer's calendar owns its own focus management and Escape-to-close.
- **Focus visible:** keyboard focus paints a 3px ring flush to the box —
  `--ui-focus-primary` normally, `--ui-focus-error` in the error state.
- **Disabled:** native `disabled` removes the trigger from the tab order and blocks
  opening; state is not conveyed by color alone (the control is also inert).
- **Value text:** the trigger displays consumer-formatted, human-readable dates (not
  raw ISO) so the announced name is meaningful.
- **Contrast:** label / value / placeholder / border / icon pairs come from the design
  tokens, authored to meet WCAG contrast.
- **WCAG:** 1.3.1, 2.1.1, 2.4.7, 1.4.3 / 1.4.11, 3.3.1 / 3.3.2, 4.1.2.
