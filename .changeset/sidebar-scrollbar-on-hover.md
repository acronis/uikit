---
'@acronis-platform/ui-react': patch
---

SidebarPrimary and SidebarSecondary now scroll their section list inside a
`ScrollArea`, so the overlay scrollbar floats over the content and reserves no
gutter — the full-bleed selected row is no longer cropped (on any OS), and the
bar is revealed on hover/scroll instead of always shown.
