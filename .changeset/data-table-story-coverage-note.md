---
'@acronis-platform/ui-react': patch
---

`DataTable`: Storybook/VR coverage note — `data-table.stories.tsx` was consolidated from ~20 single-variant exports down to `Default`/`CoreCapabilities`/`CoreCapabilitiesWithPagination`, which together exercise sorting, resizing, reordering, selection, the bulk-actions bar, infinite loading, and row actions in composition. `data-table-recipes.stories.tsx` was deleted outright. Its `ColumnReorder` export is not lost but reshaped: reordering is now exercised through the new built-in `enableColumnReordering` prop in the consolidated stories.

Two coverage gaps result:

- Five still-public props currently have **no dedicated visual regression coverage**: `striped`, `bordered`, `skeleton`, `emptyLabel`, and `expandable` rows.
- The deleted recipes file's other patterns — `TreeMode`, `RowGroups`, `VirtualScrolling`, and `ServerDriven` — now have **no** Storybook/VR coverage in `ui-react` at all. (`WithDateRangeFilter`/`WithDateRangeFilterOpen` are unaffected: equivalent stories, with their committed baselines, still live in `table/__stories__/table-full-demo.stories.tsx`.)

A future change should add targeted stories (+ VR baselines, light/dark) for these before relying on Storybook to catch a visual regression in them.
