---
'@acronis-platform/ui-react': minor
---

`SidebarSecondary`: add **expandable sections**. `SidebarSecondarySection` gains
an `expandable` prop (plus `open` / `defaultOpen` / `onOpenChange`) that turns the
section into a Base UI Collapsible — the `SidebarSecondarySectionLabel` becomes a
chevron toggle and the `SidebarSecondaryMenu` its collapsible panel. The label
also accepts an `actions` slot (e.g. a ghost `ButtonIcon`, kept outside the toggle)
and an `unreadRollup` badge shown only while the section is collapsed. Item-level
submenus (`SidebarSecondaryMenuSub`) nest inside expandable sections. Static
sections are unchanged.
