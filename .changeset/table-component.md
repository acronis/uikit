---
'@acronis-platform/ui-react': minor
---

Add `Table` (initial version ported from ui-legacy, informed by the pre-release Table design). Composable from native table parts — `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` — with **sortable column headers** (`sortable` + `sortDirection` + `onSort`, with a sort icon and `aria-sort`) and a **selectable** `TableRow` (`selected`). Themed by the existing `--ui-table-*` token tier (now imported in ui-react's styles). Sorting/selection logic stays with the consumer; a TanStack-backed `DataTable` over these primitives is a planned follow-up.
