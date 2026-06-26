---
'@acronis-platform/ui-react': minor
---

feat(data-table): add striped / bordered / current-row / skeleton flags

Borrow presentational features from the Vue `AvTable` onto `DataTable`:

- `striped` — alternating row backgrounds.
- `bordered` — vertical borders between columns (rows already have horizontal).
- `highlightCurrentRow` — highlight the row the user last clicked.
- `skeleton` (+ `skeletonRows`) — placeholder loading rows.

All reuse the existing `--ui-table-*` tier (current row = the active-row color,
stripes/skeleton = the secondary surface) — no new tokens. Behavioral features
(sorting, filtering, selection, expansion, pagination) already come from TanStack;
selection-driven bulk actions are documented as a new **data-table-bulk-actions**
usage pattern rather than a monolithic feature-flag prop.
