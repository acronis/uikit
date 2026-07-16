---
'@acronis-platform/ui-react': minor
---

Fix several `Table`/`DataTable` bugs and add a controlled column-visibility
API for composing `DataTable` with an external toolbar:

- **`DataTable`**: column pinning now un-pins when `ColumnDef.meta.pin` is
  removed dynamically (previously only pinned, never un-pinned).
- **`DataTable`**: the column-resize handle is now keyboard-operable
  (WCAG 2.1.1) — focusable, `aria-value{now,min,max}`, and Arrow
  Left/Right (Shift = larger step) resize via a new exported
  `getResizeKeyboardStep` helper. Ignores Ctrl/Alt/Meta so it doesn't hijack
  browser/OS shortcuts, and clamps fully to `[minSize, maxSize]` regardless of
  which bound the current size started outside of.
- **`DataTable`**: added a controlled `columnVisibility` /
  `onColumnVisibilityChange` prop pair (mirrors the existing `columnSizing`
  passthrough) so a `DataTable` composed with an external `DataTableToolbar`
  can share one visibility state instead of two independently-owned,
  out-of-sync `useReactTable` instances — fixes the toolbar's "View" menu
  silently no-oping when paired with a self-contained `DataTable`.
- **`DataTable`/`Table`**: `DataTableColumnHeader` and `Table`'s sortable
  header button now show a pointer cursor on the button itself (previously
  missing, or set on an ancestor `<th>` that a native `<button>` doesn't
  inherit cursor from).
- **`DataTable`**: the resize handle's cursor now references the same
  `--ui-resizable-cursor` token the `Resizable` primitive uses, instead of a
  hardcoded `cursor-col-resize`.
- **`DataTableExpandTrigger`**: now shows a pointer cursor, and its
  expand/collapse chevron rotates (`ChevronDownIcon` + `transition-transform`)
  instead of swapping between two icon components, matching
  `SidebarSecondary`'s section-trigger pattern.
- **`use-table-url-state`**: multiple state setters called synchronously in
  one handler (e.g. a filter change that also resets the page) now produce a
  single browser-history entry instead of two.

No breaking changes — every fix above is backward compatible, and
`columnVisibility`/`onColumnVisibilityChange` are optional (uncontrolled
internal state when omitted, same as before).

**Migration (optional)**: if you compose `DataTable` with an external
toolbar and currently work around the visibility bug by manually filtering
the `columns` array you pass to `DataTable` (based on your own external
`columnVisibility` state), you can drop that workaround — pass
`columnVisibility`/`onColumnVisibilityChange` straight through instead:

```diff
- <DataTable columns={visibleColumns} data={rows} />
+ <DataTable
+   columns={allColumns}
+   data={rows}
+   columnVisibility={columnVisibility}
+   onColumnVisibilityChange={setColumnVisibility}
+ />
```

**Heads up**: `DataTableExpandTrigger`'s collapsed state now renders a
rotated `ChevronDownIcon` instead of a separate `ChevronRightIcon` — same
accessible name/behavior, but a different `<svg>` shape when collapsed. If
you maintain your own visual-regression snapshots covering this component,
expect a diff there.
