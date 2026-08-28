---
'@acronis-platform/ui-react': minor
---

**SidebarSecondary**: add a `collapsible` prop (default `true`). When set to
`false`, every user-initiated collapse/expand path is disabled — resize-edge
click, drag past the collapse threshold, keyboard (Arrow keys, Enter/Space,
Home) and the footer `SidebarSecondaryCollapseTrigger`, which renders natively
`disabled` and drops `aria-expanded`. Resizing itself stays fully live: a drag
or Arrow-shrink that would have collapsed the panel now clamps to the minimum
width instead. Footer composition is unaffected. The default preserves current
behavior, so this is backward compatible.
