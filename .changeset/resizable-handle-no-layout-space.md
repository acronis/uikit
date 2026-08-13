---
'@acronis-platform/ui-react': patch
---

fix(resizable): stop `ResizableHandle` from taking up layout space

The handle's hit area was an in-flow 9px box, so it pushed the panels it
separates apart and their edges — including their own borders — could never meet.
Those 9px now overlay the panel boundary instead of sitting between them, leaving
adjacent panels flush with a single divider line on the boundary. The hit area,
the divider and hover, drag, focus-ring and cursor behaviour are unchanged.
