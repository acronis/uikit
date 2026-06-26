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
  /** Alternating row backgrounds. */
  striped?: boolean;
  /** Vertical borders between columns (rows already have horizontal borders). */
  bordered?: boolean;
  /** Highlight the row the user last clicked (the "current" row). */
  highlightCurrentRow?: boolean;
  /** Render placeholder skeleton rows instead of data (loading state). */
  skeleton?: boolean;
  /** Number of skeleton rows to render when `skeleton` is set (default 5). */
  skeletonRows?: number;
}
