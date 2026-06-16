---
'@acronis-platform/tokens-pd': patch
---

Fix gradient direction: AI gradients now render **left-to-right** (`90deg`)
instead of top-to-bottom (`180deg`). The `gradient/css` transform read the angle
only from a `com.figma.gradientTransform` matrix, which the current token
snapshot omits — so it fell back to an all-zero matrix that resolves to
`atan2(0,-1) = 180deg`, silently flipping every gradient vertical. It now reads
the angle Figma already serializes in `com.figma.cssGradient` when no matrix is
present, defaulting to `90deg` rather than `180deg`. Regenerates
`--ui-gradients-ai-*`, `--ui-button-ai-container-color-*`,
`--ui-tag-ai-container-border-color`, and `--ui-border-on-status-ai-strong`.
