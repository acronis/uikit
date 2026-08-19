import type { Table } from '@tanstack/react-table';

/**
 * Whether any row is currently selected — the single threshold that decides
 * between per-row actions and bulk actions, per the design (Figma 5916-10470
 * / 5916-10745 / 5916-11716 / 5916-11286 / 5916-11991): a single selected row
 * already switches to the bulk scope (its own row actions hide, and
 * `DataTableBulkActionsBar` enables), same as two or more. `TableActionsCell`
 * takes this as its `bulkSelectionActive` prop, so the threshold doesn't have
 * to be re-derived per consumer.
 */
export function isBulkSelectionActive<TData>(table: Table<TData>): boolean {
  return table.getSelectedRowModel().rows.length > 0;
}
