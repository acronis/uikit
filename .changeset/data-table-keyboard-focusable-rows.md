---
'@acronis-platform/ui-react': minor
---

`DataTable`: rows are now keyboard-focusable via a roving tabindex — exactly one row is a Tab stop at a time (the rest are `tabIndex={-1}` but still focusable by click), so Tab moves into and out of the row group once instead of skipping it. Arrow Up/Down move focus between rows and clamp at the first/last row. Applies to DataTable's default row-rendering path only (skeleton and empty-state rows, and rows rendered via `renderRow`, are unaffected); composes with `highlightCurrentRow`, `selected`, and pinned/sticky columns.
