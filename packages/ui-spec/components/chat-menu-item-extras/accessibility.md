# ChatMenuItemExtras — accessibility

## Semantics

- The cluster is a presentational inline `<span>` with no role. It is announced
  as its text content, in reading order after the menu item's own label.
- It adds no ARIA of its own — the enclosing menu item owns the accessible name,
  role, and selected state. Because the cluster's text is inside that item, a
  screen reader reads e.g. "History ⌘H" or "Assistant Beta" as one name.
- **Don't rely on the Tag color alone.** The `labelTag` text must carry the
  meaning ("Beta", "New"), since the `info` styling is the only variant available
  here and conveys nothing on its own.

## Keyboard & focus

- Not focusable and not in the tab order — there is nothing to activate. The
  menu item is the single tab stop for the row.
- The `shortcut` variant **documents** a keybinding; it does not register one.
  The application must bind the key itself, and should expose it on the real
  control (e.g. `aria-keyshortcuts` on the menu item) so assistive technology
  reports it as a shortcut rather than as stray text.

## Screen reader

- The shortcut string is rendered as literal glyphs (`⌘H`). Screen readers vary
  in how they voice `⌘`/`⇧`/`⌥`; when a spoken form matters, put the canonical
  binding on the menu item via `aria-keyshortcuts` (e.g. `"Meta+H"`) — this
  component intentionally does not guess a spoken transcription.

## Contrast

- The shortcut color resolves from
  `--ui-sidebar-secondary-menu-item-extras-global-shortcut-color`, which meets
  contrast against the chat surface in both light and dark themes. It is
  deliberately de-emphasized relative to the menu-item label, so it must stay a
  supporting hint — never the only carrier of meaning.
- The `tag` part's contrast is governed by the `Tag` component's own `info`
  token pair (see `components/tag`).
