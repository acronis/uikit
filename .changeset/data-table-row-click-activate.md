---
'@acronis-platform/ui-react': minor
---

Add `onRowClick` and `onRowActivate` props to `DataTable` for pointer and keyboard row interaction (CI-43741). `onRowClick` fires on single click; `onRowActivate` fires on Enter (keyboard) and double-click (pointer). Neither fires for clicks/keys on interactive controls inside a cell. Both props are ignored when `renderRow` is set.
