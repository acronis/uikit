---
'@acronis-platform/ui-react': patch
---

fix(resizable): stop `ResizableHandle` from taking up layout space

The handle's hit area was an in-flow 9px box, so it pushed the panels it
separates apart and their edges — including their own borders — could never meet.
The 8px hit area now overlays the panel boundary (4px into each panel) instead of
sitting between them, leaving adjacent panels flush with a single divider line on
the boundary. Hover, drag, focus-ring and cursor behaviour are unchanged.
