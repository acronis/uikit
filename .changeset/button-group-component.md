---
'@acronis-platform/ui-react': minor
---

Add `ButtonGroup` / `ButtonGroupItem`: a compact cluster of related icon-only
actions sharing one hairline-separated box, matching the Figma `ButtonGroup`
component set. Two container styles (`outlined`, `inlined`) themed by the
`--ui-button-group-*` token tier, which is now imported by the package
stylesheet.

Built on Base UI's Toolbar, so the group follows the WAI-ARIA toolbar pattern:
one Tab stop with arrow-key roving between items. Item position is derived from
the DOM rather than exposed as a prop, so the group stays variadic, and the
separator is an inline-end border so it mirrors under `dir="rtl"`.
