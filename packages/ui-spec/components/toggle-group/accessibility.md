# ToggleGroup — accessibility

- Built on Base UI's Toggle / ToggleGroup: each toggle is a `<button>` with
  `aria-pressed`, operable with Enter/Space; the group supports arrow-key roving
  focus. Give each toggle an accessible name (`aria-label` for icon-only toggles)
  and the group an `aria-label`.
- Don't rely on the pressed tint alone — for icon-only toggles the `aria-pressed`
  state conveys selection to assistive tech.

## Contrast

Idle is transparent (text/icon use the foreground); hover uses
`--ui-background-surface-hover` and pressed uses `--ui-background-surface-active`,
both meeting contrast against the page in light and dark; the focus ring uses
`--ui-focus-primary`.
