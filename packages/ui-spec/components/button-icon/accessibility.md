# ButtonIcon — Accessibility

- **Role:** native `<button>`.
- **Accessible name (required):** the control is icon-only, so it MUST be given
  an `aria-label` (or `aria-labelledby`). The icon itself should be
  `aria-hidden`. Without a label the button is unusable to screen readers.
- **Keyboard:** Enter and Space activate (native). `disabled` removes it from
  the tab order.
- **Focus visible:** 3px `--ui-focus-primary` ring flush to the edge (no offset)
  via `:focus-visible`.
- **Touch target:** 32×32 is below the 44×44 guideline; place with adequate
  spacing, or extend the hit area with transparent padding where touch is a
  primary input.
- **Contrast:** glyph/background pairs come from the design tokens (authored for
  contrast).
- **WCAG:** 2.1.1, 2.4.7, 1.4.11, 4.1.2.
