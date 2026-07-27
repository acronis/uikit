# ButtonIconInput — Accessibility

- **Role:** native `<button>`.
- **Accessible name (required):** the control is icon-only, so it MUST be given
  an `aria-label` (or `aria-labelledby`). The icon itself should be
  `aria-hidden`. Without a label the button is unusable to screen readers.
- **Keyboard:** Enter and Space activate (native). `disabled` removes it from
  the tab order.
- **Focus visible:** 3px ring, flush to the edge — `--ui-focus-primary` for the
  `normal` variant, `--ui-focus-error` for `error`.
- **Touch target:** 20×20 is well below the 44×44 guideline — this control is
  meant to sit inside an input's box (e.g. a reveal/clear affordance), not to
  stand alone as a primary touch target.
- **Contrast:** glyph/background pairs come from the design tokens (authored for
  contrast).
- **WCAG:** 2.1.1, 2.4.7, 1.4.11, 4.1.2.
