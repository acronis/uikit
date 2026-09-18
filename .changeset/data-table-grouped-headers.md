---
'@acronis-platform/ui-react': patch
---

fix(data-table): support grouped/spanning column headers

Grouped column header cells now render with the correct colSpan so group
labels span their sub-columns. TanStack placeholder cells render as empty
`<th>` elements with no visible content. Group-label header cells are purely
structural — sorting, resizing, reordering, tooltips, and the
column-visibility cog are suppressed on them. Cross-group column reordering
is blocked: dragging a
leaf column from one header group over a leaf column in a different group
shows a "none" drop cursor and aborts the drop, preventing malformed
header rows. The column-visibility cog now lists columns nested inside
header groups — previously it listed none at all for a grouped table,
because it read only the top-level (group) columns.
