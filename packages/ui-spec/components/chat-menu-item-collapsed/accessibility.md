# ChatMenuItemCollapsed — accessibility

## Semantics

- The root is a native `<button type="button">`, so it is exposed as
  `role="button"` with no extra ARIA.
- **It is icon-only: there is no text to name it.** The consumer **must** pass
  `aria-label` (or `aria-labelledby`). The component ships no default label — it
  has no way to know what the row stands for, and a baked-in English string
  would be unlocalizable.
- The alert dot is `aria-hidden` — it is a visual accent, not a name or a status
  message. **Fold the alert into the accessible name** (e.g.
  `aria-label="Chats, unread messages"`), or announce it from a live region the
  consumer owns; colour alone is not an accessible signal.
- If the row navigates to a different view, mark the current one with
  `aria-current="page"` from the consumer side.

## Keyboard & focus

| Key     | Action                     |
| ------- | -------------------------- |
| `Tab`   | Moves focus onto the row   |
| `Enter` | Activates it (fires click) |
| `Space` | Activates it (fires click) |

- Native button behaviour — no custom key handling.
- The focus indicator is a 3px inset `--ui-focus-primary` ring on
  `:focus-visible` only, so a pointer click does not leave a ring behind.
- The row is 48×40px. That is below the 44×44 pointer-target guideline in its
  narrow axis; the constraint comes from the collapsed rail's fixed 48px width in
  the design, and the row spans that width edge to edge.

## Contrast

- Fill (`--ui-chat-menu-item-color-*`) and glyph
  (`--ui-chat-menu-item-icon-color`) resolve from the `--ui-chat-*` tier, which
  carries light/dark values, so the glyph keeps its contrast in both themes.
- The idle fill is transparent by design: the glyph is read against the chat
  rail's own surface, which is where that contrast pair is guaranteed.
- The `--ui-focus-primary` ring is the kit-wide focus colour, shared with every
  other focusable component.
