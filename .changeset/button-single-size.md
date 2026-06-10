---
'@acronis-platform/ui-react': minor
---

**Button: removed the `size` prop.** The Figma button has a single size, so
`Button` no longer accepts `size` (`sm` / `default` / `lg`) — it always renders
the 32px-tall size (`h-8 px-3`). This is a breaking change for any consumer
passing `size`; drop the prop. `ButtonIcon` is unaffected.
