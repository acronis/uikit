import type { ReactNode } from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `DataTableProps` is generic
// (`<TData, TValue>` with TanStack `ColumnDef` / `Row`), which AutoTypeTable can't
// render cleanly; this companion documents the caller-facing shape. (The runtime
// type lives in data-table.tsx; this file is never bundled.)

/** Props for `DataTable`. */
export interface DataTableProps {
  /** TanStack column definitions — header/cell renderers and accessors. */
  columns: unknown[];
  /** The row data. */
  data: unknown[];
  /** Enables row expansion for rows that return true; pair with `renderExpandedRow`. */
  getRowCanExpand?: (row: unknown) => boolean;
  /** Renders the detail content for an expanded row. */
  renderExpandedRow?: (row: unknown) => ReactNode;
}
