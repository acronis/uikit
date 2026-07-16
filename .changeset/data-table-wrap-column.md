---
'@acronis-platform/ui-react': minor
---

Add a `ColumnDef.meta.wrap` flag to `DataTable`. When `true`, the column's
header and cells render with `whitespace-normal` and drop the fixed row height
so long content grows the row instead of being clipped — mirroring the `wrap`
prop the `Table` primitives already expose on `TableHead`/`TableCell`.
