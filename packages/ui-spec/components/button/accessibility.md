# Button — Accessibility

- **Role:** native `<button>` (implicit `role="button"`); when composed as a
  link via `render`, it becomes a native `<a>` with link semantics.
- **Accessible name:** from the text content. An **icon-only** button has no
  text, so it MUST be given an `aria-label` (or `aria-labelledby`). For
  icon-only buttons prefer the dedicated `ButtonIcon` component.
- **Keyboard:** Enter and Space activate (native). Tab focuses; a `disabled`
  button is removed from the tab order (native).
- **Focus visible:** keyboard focus shows a 3px ring in `--ui-focus-primary`
  flush to the button edge (no offset), via `:focus-visible` (no ring on pointer
  activation).
- **Contrast:** label/background pairs come from the design tokens, which are
  authored to meet WCAG contrast. State is never conveyed by color alone — the
  disabled state also removes interactivity.
- **WCAG:** 2.1.1 (keyboard), 2.4.7 (focus visible), 1.4.3 / 1.4.11 (contrast),
  4.1.2 (name/role/value).
