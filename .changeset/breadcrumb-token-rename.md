---
'@acronis-platform/ui-react': patch
---

Fix `Breadcrumb` link colors: wire link/ellipsis text to the renamed
`--ui-breadcrumb-link-label-color-{idle,hover,active}` tokens (previously
referenced the stale `--ui-breadcrumb-link-label-{idle,hover,active}` names,
which no longer exist in `@acronis-platform/tokens-pd`, so links rendered with
no color).
