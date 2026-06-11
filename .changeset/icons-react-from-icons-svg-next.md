---
'@acronis-platform/icons-react': minor
---

Generate icon components from `@acronis-platform/icons-svg-next` instead of
`@acronis-platform/design-assets`. This swaps in the redesigned next-gen icon
set, so the packs grow substantially — `stroke-mono` (395), `solid-mono` (59),
`stroke-multi` (12), `solid-multi` (1) — and the size/stroke rule (sm/md/lg =
16/24/32 with 1.6/2/2.5px stroke) is now a generator constant rather than read
from design-assets manifests. The `size` prop, `currentColor` theming, per-icon
gradient-id namespacing, and per-pack subpath exports are unchanged.

Note: the icon set changed wholesale, so some previously exported names are gone
(e.g. `BanIcon`, `ArrowSquareUpRightIcon`, `AcronisAIcon`) and many new ones are
added. A few names still reflect work-in-progress Figma source (`*-duplicate`,
`agent-qnap--32`) until that source is cleaned up.
