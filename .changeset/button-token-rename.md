---
'@acronis-platform/ui-react': patch
---

Fix `Button` colors: wire every variant's container fill, label, and icon to the
renamed `--ui-button-*-color-*` tokens (the next-gen token sync added a `-color-`
segment — e.g. `--ui-button-primary-container-idle` → `…-container-color-idle`).
The component still referenced the old names, which no longer exist in
`@acronis-platform/tokens-pd`, so every variant rendered with no fill/text color.
Border, geometry, and padding tokens were already correct and are unchanged.
