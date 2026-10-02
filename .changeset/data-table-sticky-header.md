---
'@acronis-platform/ui-react': major
---

**DataTable**: add `stickyHeader` prop — when `true`, the header row sticks to the top of DataTable's scroll container while the user scrolls vertically. Requires a bounded DataTable height (wrap in a `flex flex-col` container with a fixed height). DataTable now always applies `overflow-auto` on its root, making it the horizontal scroll container.

**Table**: removed the inner `overflow-auto` wrapper `<div>` — `DataTable` is now the horizontal scroll container. Standalone `Table` usage (outside `DataTable`) no longer provides its own horizontal scroll; add `overflow-auto` on a wrapping element if you relied on the inner div for scrolling.
