---
'@acronis-platform/ui-react': patch
---

Fix the cascade (submenu) chevron in `DropdownMenuSubTrigger` sitting too high. The menu item row is `items-start`, so the 16px chevron pinned to the top of the label's 24px line box; it now uses `self-center` to align vertically against the label.
