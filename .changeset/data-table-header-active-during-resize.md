---
'@acronis-platform/ui-react': patch
---

fix(data-table): keep header cell active background during column resize

During a column resize, `isAnyColumnResizing` becomes true and the
`canSort && !isAnyColumnResizing` guard in `DataTable` removes the
hover/active Tailwind classes from the `<th>`, so the cell background
disappears for the entire drag. Additionally, non-sortable resizable columns
had no active-state background at all during resize.

The fix sets a `data-resizing` attribute on the column's `<th>` at
pointerdown and removes it at pointerup/pointercancel. `TableHead` applies
`data-[resizing]:bg-[var(--ui-table-header-cell-color-active)]` so the cell
shows its active background throughout the drag, regardless of sort state.
No new token is introduced.
