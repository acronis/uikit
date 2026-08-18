---
'@acronis-platform/ui-react': minor
---

`DataTable`: the trailing sticky action column (column-visibility cog in the header, per-row overflow ellipsis) is now built in rather than something every consumer had to assemble by hand as an extra `ColumnDef` plus `DataTableViewOptions`/`DropdownMenu` wiring.

- Shown by default. Set `hideActionColumn` to omit it entirely.
- `renderRowActions={(row) => <DropdownMenuGroup>…</DropdownMenuGroup>}` supplies the ellipsis menu's content — the trigger, `DropdownMenu` wrapper, and bulk-selection suppression (`isBulkSelectionActive`) are `DataTable`'s own. Omit it to render the row without a trigger; the 48px column is still reserved.
- `rowActionsLabel` / `columnSettingsLabel` localize the two triggers' accessible names.
- A no-op when an external `table` is passed — build the column into that instance's own `columns` instead, as before.
- The pinned action cell now mirrors the row's hover tint instead of staying visually idle, and hovering the cell's own trigger no longer bleeds a hover tint onto the rest of the row.

**Migration**: a consumer that already built its own trailing `settings`/`id` column with `DataTableViewOptions` (iconOnly) in the header now gets two cog triggers. Drop the hand-rolled column and either rely on the new default, or pass `hideActionColumn` to opt out.
