---
'@acronis-platform/ui-react': minor
---

Add `ScrollArea` (and `ScrollBar`): a scrollable region with a custom overlay
scrollbar built on Base UI's Scroll Area. The bar floats over the content and
reserves no layout space, so full-bleed content is never cropped by a scrollbar
gutter on any OS/browser; it is hidden at rest and revealed on hover/scroll.
Supports `orientation` (`vertical` | `horizontal` | `both`). Initial version
ported from ui-legacy; design reconciliation pending.
