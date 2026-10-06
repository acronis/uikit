---
'@acronis-platform/ui-react': major
---

**Breaking:** Replace `wrap?: boolean` with `overflow?: 'wrap' | 'hidden'` on `TableHead`, `TableCell`, and `ColumnMeta`.

The new `'hidden'` mode adds `max-w-0 overflow-hidden whitespace-nowrap`, clipping the column at its CSS width — give the column a `size` (or enable column resizing), or `max-w-0` collapses it. The kit only clips; the ellipsis and tooltip belong to the cell content. The union is exported as `TableOverflow`.

Migration: replace `wrap={true}` / `meta: { wrap: true }` with `overflow="wrap"` / `meta: { overflow: 'wrap' }`, or simply delete it (unset already wraps by browser default).

Also: `TableOverflow` now includes `'truncate'` (`overflow-hidden whitespace-nowrap`) — clips the cell to its CSS width without forcing `max-w-0`. Unlike `'hidden'`, it does not collapse unsized columns to zero.

DataTable's `meta.overflow` now defaults to `'truncate'` when unset (previously unset meant browser default wrapping). Existing DataTable consumers whose cells relied on wrap-by-default must now explicitly set `meta: { overflow: 'wrap' }`.

Also: the sortable `DataTableColumnHeader` header row is now 40 px (was 48 px) — the fixed `h-8` on the sort button was causing `py + h-8` to exceed the design-spec height.
