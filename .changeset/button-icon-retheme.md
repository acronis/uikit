---
'@acronis-platform/ui-react': patch
---

Re-theme `ButtonIcon` against the next-gen Figma tokens. The component referenced
renamed color tokens (`--ui-button-icon-global-container-idle` →
`…-container-color-idle`, same for the icon color) that no longer existed, so
fills and glyph colors silently fell back to inherited values. Each state is now
wired to its current `--ui-button-icon-global-*` token.

Adds a `variant` prop: `ghost` (borderless, the default — unchanged from the
previous look) and `secondary` (a 1px container border from the
`--ui-button-icon-secondary-container-border-color-*` tokens).
