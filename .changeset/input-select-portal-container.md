---
'@acronis-platform/ui-react': minor
---

Add an optional `portalContainer` prop to `InputSelectContent` (mirroring
`TooltipContent`). It forwards to the underlying Base UI `Select.Portal`'s
`container`, so the dropdown can be portaled into a scoped root (e.g. a shadow
root) and inherit styles defined there instead of always mounting on
`document.body`.
