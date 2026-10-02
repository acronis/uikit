---
'@acronis-platform/ui-react': minor
---

feat(data-table): add a `renderSkeletonCell` prop to customize skeleton cell content

- `renderSkeletonCell({ column, rowIndex })` replaces the content of each skeleton cell while `skeleton` is set. DataTable keeps the row and cell themselves (padding, borders, no hover tint, not focusable). When the prop is unset, the default `Skeleton` bar renders as before.
- Skeleton cells now honor the column's `meta.overflow` mode, matching data cells. This changes nothing unless a column sets `meta.overflow`.
- The infinite-scroll loading-more row (`isLoadingMore`) is intentionally unaffected; customizing it is a follow-up. Pinning/width styles on skeleton cells also remain a follow-up.
