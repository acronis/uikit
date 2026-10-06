---
'@acronis-platform/ui-react': minor
---

feat(data-table): `loadingMoreRows` and `loadingMoreLabel` props; loading-more rows now use `renderSkeletonCell`.

- New `loadingMoreRows?: number` prop (default `1`) controls how many skeleton rows render at the bottom of the table while `isLoadingMore` is set. `0` suppresses all loading UI; consumers passing `0` are expected to provide their own indicator.
- New `loadingMoreLabel?: string` prop (default `'Loading more rows…'`) — sr-only text placed in the first cell of the first loading row, readable by screen readers when navigating to that cell. Override to localize.
- Loading-more rows now render one `<Skeleton>` per leaf column via `renderSkeletonCell` (same callback as initial-load skeleton rows, with `rowIndex` 0-based within the loading-more block), with correct pinning and size styles.
- **Behaviour change:** loading-more rows no longer carry `role="status"` or `aria-live="polite"`. Previously, the load start was announced automatically to screen readers. Now the sr-only `loadingMoreLabel` text is readable when navigating to that cell but is not auto-announced. If your app requires an automatic announcement, add your own `aria-live="polite"` region outside the table that you toggle when `isLoadingMore` changes.
