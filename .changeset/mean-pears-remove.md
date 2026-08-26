---
'@acronis-platform/ui-react': major
---

feat(ui-react)!: remove AppShell, AuthLayout, Collapsible and Label

**Breaking.** Four exports are gone from `@acronis-platform/ui-react`:

- `AppShell` / `AppShellSidebar` / `AppShellBody` / `AppShellHeader` /
  `AppShellMain` / `AppShellFooter` — superseded by `AppShellChat`, whose Chat
  slot is optional, so the same scaffold serves an ordinary two-column console
  screen. Migrate: `AppShell` → `AppShellChat`, `AppShellSidebar` →
  `AppShellChatSidebar`, `AppShellBody` → `AppShellChatContent`,
  `AppShellHeader` → `AppShellChatContentHeader`, `AppShellMain` →
  `AppShellChatContentBody`. There is no `AppShellFooter` equivalent. Note
  `AppShellMain` rendered a `<main>` landmark; `AppShellChatContentBody` is a
  plain `<div>`, so wrap it in your own `<main>` if you relied on that.
- `AuthLayout` / `AuthLayoutCard` / `AuthLayoutLogo` / `AuthLayoutFooter` — the
  chrome was product-specific, not a design-system component. Compose it in the
  product from `Card` / `Stack`.
- `Collapsible` / `CollapsibleTrigger` / `CollapsibleContent` — a thin wrapper
  over Base UI's Collapsible with no consumers. Use `AccordionContainer`, or
  Base UI's `Collapsible` directly.
- `Label` (and `LabelProps`) — nothing rendered it. Use `Field`'s label part.
  The `labelClassName` constant `Field` consumes is unchanged.
