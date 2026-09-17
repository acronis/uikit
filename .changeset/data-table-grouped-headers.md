---
'@acronis-platform/ui-react': patch
---

fix(data-table): support grouped/spanning column headers

Grouped column header cells now render with the correct colSpan so group
labels span their sub-columns. Phantom cells (colSpan 0) are no longer
rendered. Group-label header cells are purely structural — sorting,
resizing, reordering, tooltips, and the column-visibility cog are
suppressed on them. Cross-group column reordering is blocked: dragging a
leaf column from one header group over a leaf column in a different group
shows a "none" drop cursor and aborts the drop, preventing malformed
header rows.
