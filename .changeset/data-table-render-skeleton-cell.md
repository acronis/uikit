---
'@acronis-platform/ui-react': minor
---

feat(data-table): add a `renderSkeletonCell` prop to customize skeleton cell content

- `renderSkeletonCell({ column, rowIndex })` replaces the content of each skeleton cell while `skeleton` is set. DataTable keeps the row and cell themselves (padding, borders, no hover tint, not focusable). When the prop is unset, the default `Skeleton` bar renders as before.
- Skeleton cells now honor the column's `meta.overflow` mode, matching data cells. This changes nothing unless a column sets `meta.overflow`.
- Loading-more rows (`isLoadingMore`) now also use `renderSkeletonCell` and render one skeleton per column with correct pinning and size styles. The new `loadingMoreRows` prop (default `1`) controls how many loading-more rows appear.
