---
'@acronis-platform/ui-react': patch
---

Fix `Avatar` rendering at 28px instead of the designed 32px (PLTFRM-92393). The
2px separator stroke was a CSS `border`, drawn inside the 32px border-box, so the
visible circle shrank to 28px. Figma draws the stroke with `strokeAlign: OUTSIDE`,
so it is now an outset `box-shadow` ring that leaves the colored circle at the full
32px without inflating the layout box — keeping the `AvatarGroup` overlap step
(32px − 6px gap) intact.
