---
'@acronis-platform/ui-react': patch
---

fix(tabs): style a disabled `TabsTrigger`. Base UI exposes disabled via `aria-disabled`/`data-disabled` rather than the native attribute, so the `disabled:` variants never matched.
