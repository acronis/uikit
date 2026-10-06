---
'@acronis-platform/ui-react': minor
---

- fix(data-table): on `DataTable`'s own table, an authored `size: 150` (including on the `select` column) is now honoured as a strictly fixed width instead of being treated as unsized. On an external `table` that keeps TanStack's defaults, `150` is still indistinguishable from the default.
- fix(data-table): on an external `table`, an unsized `select` column now renders at TanStack's default size (150px), so its width matches the sticky offset of the next pinned column. The 48px default is injected only by the internal table; set `size: 48` on the `select` column of an external table to keep it narrow. The unsized `select` column also now contributes 150 (not 48) to that table's minimum width.
- feat(data-table): `getColumnSizeStyle` and `getCellStyle` accept an optional trailing defaults argument (a table's `_getDefaultColumnDef()`). `getCellStyle` derives it from the cell's table when omitted.
