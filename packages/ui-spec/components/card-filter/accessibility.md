# CardFilter — Accessibility

- **Role:** `clickable` renders a native `<button>` (implicit `role="button"`);
  `static` / `static-empty` render a presentational `<div>`. The `render` prop can
  swap the element (e.g. a native `<a>` for a link filter).
- **Accessible name:** for the `clickable` variant the name comes from the card's
  text content (label + value). If that is not descriptive enough, pass an explicit
  `aria-label`.
- **Keyboard (clickable):** Enter and Space activate (native button). Tab focuses;
  the static variants are not focusable.
- **Focus visible:** keyboard focus shows a 3px ring in `--ui-focus-primary` flush
  to the card edge (no offset), via `:focus-visible`; suppressed for pointer focus.
- **Static content:** `static` / `static-empty` are presentational; they convey a
  value but are not interactive and are not in the tab order.
- **Contrast:** label / value / surface pairs come from the design tokens, authored
  to meet WCAG contrast. The `static-empty` placeholder uses a muted token.
- **WCAG:** 2.1.1 (keyboard), 2.4.7 (focus visible), 1.4.3 / 1.4.11 (contrast),
  4.1.2 (name/role/value).
