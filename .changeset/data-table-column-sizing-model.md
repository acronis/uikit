---
'@acronis-platform/ui-react': major
---

**Breaking:** `getColumnWidth` is removed from `@acronis-platform/ui-react`'s DataTable exports. Replace it with `getColumnSizeStyle`, which returns `Pick<CSSProperties, 'width' | 'minWidth' | 'maxWidth'> | undefined`.

Migration for `renderRow` callers:

```tsx
// Before
style={{ width: getColumnWidth(column, enableColumnResizing) }}
// After
style={{ ...getColumnSizeStyle(column, enableColumnResizing) }}
```

Prefer `getCellStyle(cell, enableColumnResizing)`, which merges pin and size styles in one call.

Column sizing semantics also changed:

- `size` set on a ColumnDef → strictly fixed: `width = minWidth = maxWidth = size`. The column cannot grow or shrink.
- Only `minSize`/`maxSize` set, no `size` → flexible: only floor/ceiling CSS is emitted; `table-fixed` distributes remaining space while still honouring constraints.
- Column resizing enabled → all columns receive `width = minWidth` so the drag-handle math has a deterministic baseline.
- `select` and `__actions` chrome columns are always strictly fixed.

Also: **`DataTable` now always renders `table-layout: fixed` with a `<colgroup>`**, regardless of whether grouped headers are used. This changes how columns without an explicit `size` are laid out — the browser no longer sizes them to their content; it splits the remaining width evenly instead. Existing DataTable layouts that relied on content-driven column widths may reflow. To restore content-driven sizing for a column, remove its `size` and let `minSize`/`maxSize` constrain it, or set an explicit `size`. The bare `Table` primitive is unchanged and does not apply `table-layout: fixed` by default.
