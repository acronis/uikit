---
'@acronis-platform/ui-react': minor
---

Move column visibility out of the DataTable toolbar and onto the settings-column
cog, per the Figma design.

- **Breaking-ish:** `DataTableToolbar` no longer renders `DataTableViewOptions`.
  With the `Table` primitives, compose the menu into your own trailing
  settings column instead — put `<TableViewOptions iconOnly />` inside a
  `TableSettingsCell`. `DataTable` consumers don't need to do this by hand:
  its built-in trailing action column (see the built-in-action-column
  changeset) already renders `DataTableViewOptions iconOnly` for you.
- `TableViewOptions`/`DataTableViewOptions` gain `iconOnly` (cog-only trigger
  sized for the 48px settings cell) and `triggerAriaLabel` (default
  `'Column settings'`); `DataTableViewOptions` also forwards `triggerLabel`.
  The default labelled "View" trigger is unchanged.
- `TableViewOptions` menu rows now render a real `Checkbox` box beside the
  column name instead of a trailing checkmark shown only when checked. The
  accessible contract is unchanged: each row is a `menuitemcheckbox` with
  `aria-checked`.
