---
'@acronis-platform/ui-react': patch
---

Tabs: a disabled `TabsTrigger` now looks disabled (dimmed, non-interactive). Base UI exposes disabled via `aria-disabled`/`data-disabled` rather than the native attribute, so the `disabled:` variants never matched.
