# AppShell — accessibility

- The slots render semantic landmarks: `<aside>` (sidebar), `<header>` (banner),
  `<main>`, and `<footer>` (contentinfo) — so assistive tech can navigate by
  landmark. Use a single `AppShellMain` per page (one `main` landmark).
- The components dropped into the slots (SidebarPrimary, SearchGlobal) own their
  own keyboard/ARIA behavior.
- Provide a visible, focusable "skip to main content" link before the shell when
  the sidebar nav is long.

## Contrast

The scaffold only paints surfaces and a divider (`--ui-background-surface-primary`
/ `--ui-border-on-surface-border`), which meet contrast in light and dark; slot
content carries its own colors.
