---
'@acronis-platform/ui-react': minor
---

**SidebarSecondary**: add a `collapsible` prop (default `true`). When set to
`false`, every user-initiated collapse/expand path is disabled — resize-edge
click, drag past the collapse threshold, keyboard (Arrow keys, Enter/Space,
Home) and the footer `SidebarSecondaryCollapseTrigger`, which renders natively
`disabled` and drops `aria-expanded`. While the panel is expanded, resizing
itself stays fully live: a drag or Arrow-shrink that would have collapsed the
panel now clamps to the minimum width instead. Both resize-edge tooltip defaults
are adjusted when `collapsible={false}` so they never advertise an inert
gesture: the expanded default drops only its "Collapse: Click" line (keeping
"Resize: Drag" and "Reset size: Double click"), and the collapsed default
narrows to the single "Reset size: Double click" line — dragging and clicking a
permanently collapsed rail do nothing, but double-click still resets the width.
An explicit `resizeTooltipExpanded` /
`resizeTooltipCollapsed` value still wins in every state.

Footer composition is unaffected and the `collapsible` default preserves current
behavior. One intentional, spec'd visual change does reach existing code: the
`SidebarSecondaryCollapseTrigger` now renders a `not-allowed` cursor, the
disabled on-surface foreground token, and suppressed hover/active fills whenever
it is disabled — which includes a consumer already passing `disabled` directly
to the trigger, without adopting the new prop. That row was already functionally
inert; it now looks inert too.
