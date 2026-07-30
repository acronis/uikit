# ChatMenuItem — accessibility

## Semantics

- The root is a native `<button type="button">`, so it is exposed as
  `role="button"` with no extra ARIA.
- The visible `label` is the button's text content, so it is the accessible
  name automatically — no `aria-label` is needed (unlike the icon-only
  `ChatMenuItemCollapsed`).
- `state="active"` sets `aria-current="page"` on the root, marking the
  currently-open chat — the same convention `SidebarPrimary` and
  `SidebarSecondary` use for their current-route item.
- The trailing `extras` cluster (a composed `ChatMenuItemExtras`) is
  presentational content, not interactive — it stays nested safely inside the
  button.

## Keyboard & focus

| Key     | Action                     |
| ------- | -------------------------- |
| `Tab`   | Moves focus onto the row   |
| `Enter` | Activates it (fires click) |
| `Space` | Activates it (fires click) |

- Native button behaviour — no custom key handling.
- The focus indicator is a 3px inset `--ui-focus-primary` ring on
  `:focus-visible` only, so a pointer click does not leave a ring behind.

## Contrast

- Fill (`--ui-chat-menu-item-color-*`), label
  (`--ui-chat-menu-item-label-color`), and glyph
  (`--ui-chat-menu-item-icon-color`) all resolve from the `--ui-chat-*` tier,
  which carries light/dark values, so contrast holds in both themes.
- The `--ui-focus-primary` ring is the kit-wide focus colour, shared with
  every other focusable component.
