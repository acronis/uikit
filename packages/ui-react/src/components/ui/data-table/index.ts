// TanStack types that appear in DataTable's own public prop signatures, so
// consumers can type columns/handlers without a direct @tanstack/react-table
// import. `Table` is re-exported as `TanstackTable` to match the alias used in
// data-table.tsx and to avoid clashing with the `Table` primitive component.
export type {
  Column,
  ColumnDef,
  ColumnOrderState,
  ColumnSizingState,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  Table as TanstackTable,
  VisibilityState,
} from '@tanstack/react-table';
export {
  DataTable,
  type DataTableHeaderHint,
  type DataTableHeaderHints,
  type DataTableProps,
  getCellStyle,
  getPinnedStyle,
  getColumnWidth,
  reorderColumn,
} from './data-table';
export { DataTableBulkActionsBar } from './data-table-bulk-actions-bar';
export { isBulkSelectionActive } from './data-table-selection';
export {
  DataTableColumnHeader,
  type DataTableColumnHeaderProps,
} from './data-table-column-header';
export { DataTableExpandTrigger } from './data-table-expand-trigger';
export { DataTablePagination } from './data-table-pagination';
export { DataTableToolbar } from './data-table-toolbar';
export { DataTableViewOptions } from './data-table-view-options';
