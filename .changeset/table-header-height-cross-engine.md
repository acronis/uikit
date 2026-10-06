---
'@acronis-platform/ui-react': minor
---

fix(table): replace `height` with `padding + line-height` on all five cell components for cross-engine row-height consistency (CI-43742).

In `border-collapse` tables, Gecko/WebKit add the `<tr>` border to a cell's `height` property, inflating rows to ~49px in Safari/Firefox versus the intended 40px in Chrome. `TableHead`, `TableCell`, `TableSelectCell`, `TableActionsCell`, and `TableSettingsCell` no longer apply `h-[var(--ui-table-global-cell-min-height)]`. Row height now comes from `py` (default 8px) + `leading-6` (24px) = 40px, which is consistent across all engines.

**Migration:** If you override `--ui-table-global-cell-min-height` to change row density (e.g. compact/relaxed modes), that override is no longer applied. Switch to `--ui-table-global-cell-padding-y` instead — the row height becomes `2 × padding-y + 24px`. Examples:

- Compact 32px: `--ui-table-global-cell-padding-y: 4px`
- Default 40px: `--ui-table-global-cell-padding-y: 8px` (unchanged)
- Relaxed 52px: `--ui-table-global-cell-padding-y: 14px`
