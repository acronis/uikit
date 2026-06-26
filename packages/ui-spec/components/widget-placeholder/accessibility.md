# WidgetPlaceholder — accessibility

- The static placeholder is presentational — its parts are plain elements with no
  imposed roles, so its text content is read in document order.
- When `interactive`, the root is focusable (`tabindex=0`) and paints a visible
  focus ring (`--ui-focus-primary`). The whole-card click is a convenience target;
  for a primary action prefer the `WidgetPlaceholderAction` element (or a real
  `Button`/`Link` inside it) so the action has an accessible name and keyboard
  semantics. If you make the whole card the only control, give it an
  `aria-label`/`role="button"` and handle Enter/Space.
- The illustration is decorative; keep meaning in `WidgetPlaceholderText`, not the
  icon alone.

## Contrast

Text uses `--ui-text-on-surface-primary` and the muted image/footer use
`--ui-text-on-surface-secondary`, both over `--ui-background-surface-primary` —
meeting text contrast in light and dark. The icon/action use the brand action
color (`--ui-background-brand-secondary`), which meets contrast against the card.
