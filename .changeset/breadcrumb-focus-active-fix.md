---
'@acronis-platform/ui-react': patch
---

Fix `Breadcrumb` link states to match the Figma design: the pressed
(`:active`) state no longer keeps the hover underline, and keyboard focus now
shows a 3px focus-ring (`--ui-focus-primary`) flush to the label with no
underline (previously a 2px offset ring plus an underline).
