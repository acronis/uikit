---
'@acronis-platform/ui-react': patch
---

Fix `DialogWelcome2` Figma parity: the `single` variant's body-to-action gap
was 24px (a stacked padding + gap) instead of the design's 12px. Also fix the
shared `Dialog`/`DialogContent` popup — it had no viewport edge-inset, so on
a narrow viewport it could touch the screen edges instead of keeping the
Figma-defined 48px minimum margin; this affects every `Dialog` consumer,
including `DialogWelcome2`.
