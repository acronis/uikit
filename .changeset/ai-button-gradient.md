---
'@acronis-platform/design-tokens': patch
'@acronis-platform/tokens-pd': patch
'@acronis-platform/ui-react': patch
---

Fix the AI background gradient to run **left-to-right** (90deg) instead of
top-to-bottom, matching the Figma design. The `background.ai` gradient transform
in design-tokens carried a stale vertical matrix (`[[0,1,0],[-1,0,1]]` → 180deg);
it is now identity (`[[1,0,0],[0,1,0]]` → 90deg), and `tokens-pd` is regenerated.

The AI `Button` variant now always leads with the `Sparkles` icon before its
label, matching the Figma "Ai" button, and sets `bg-origin-border` so the
gradient covers the full button box (previously a 1px sliver of the gradient's
opposite end showed on the left and right border edges).
