---
'@acronis-platform/ui-react': patch
---

fix(data-table): column `size`/`minSize`/`maxSize` values are now respected in grouped-header mode.

DataTable renders a `<colgroup>` with one `<col>` per visible leaf column before the header rows. Previously, `table-layout: fixed` read column widths from the first `<thead>` row — when that row was a group-label row (all cells span multiple columns), browser layout assigned equal widths to every column, ignoring explicit sizes. `<col>` applies universally regardless of header depth, fixing this for all grouped-header layouts. No API change.
