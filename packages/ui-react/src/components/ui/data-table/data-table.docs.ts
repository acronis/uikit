import type { ReactNode } from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `DataTableProps` is generic
// (`<TData, TValue>` with TanStack `ColumnDef` / `Row`) and a discriminated union
// (`columns`+`data` XOR `table`), neither of which AutoTypeTable can render
// cleanly; this companion flattens it to the caller-facing shape. (The runtime
// type lives in data-table.tsx; this file is never bundled.)

/** Props for `DataTable`. */
export interface DataTableProps {
  /**
   * TanStack column definitions — header/cell renderers and accessors. Required
   * unless `table` (an externally-built instance) is passed.
   */
  columns?: unknown[];
  /** The row data. Required unless `table` is passed. */
  data?: unknown[];
  /**
   * Render from an externally-built TanStack `table` instance instead of
   * DataTable's own — DataTable then owns no state and renders the caller's
   * instance as-is. Makes `columns`/`data` unnecessary and the following props
   * no-ops (configure the equivalent on the external instance instead):
   * `columnVisibility`, `onColumnVisibilityChange`, `onColumnSizingChange`,
   * `enableColumnResizing`, `enableColumnReordering`, `columnOrder`,
   * `onColumnOrderChange`, `getRowCanExpand`, `manualSorting`, `sorting`,
   * `onSortingChange`, `paginationMode`, `onLoadMore`, `loadMoreRootMargin`,
   * `hasNextPage`, `isLoadingMore`. `meta.pin`-driven column pinning is also
   * skipped — pin/unpin the caller's own instance via TanStack's `column.pin()`.
   */
  table?: unknown;
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
  /**
   * Opt in to interactive column resizing — renders a drag handle at the
   * trailing edge of each resizable header (TanStack's native `columnResizing`).
   */
  enableColumnResizing?: boolean;
  /**
   * Accessible name of a column's resize handle (default `'Resize column'`).
   * `enableColumnResizing` only. Override to localize.
   */
  resizeColumnLabel?: string;
  /** Passthrough for the `columnSizing` state so a consumer can persist widths. */
  onColumnSizingChange?: (updater: unknown) => void;
  /**
   * Opt in to column reordering by dragging a header cell onto another one
   * (native HTML5 drag-and-drop driving TanStack's `columnOrder`). Pinned
   * columns are excluded. Pointer-only — there is no keyboard equivalent yet.
   */
  enableColumnReordering?: boolean;
  /**
   * Controlled column-order state — pass this (with `onColumnOrderChange`) to
   * persist or share the order. Uncontrolled (internal state) when omitted.
   */
  columnOrder?: string[];
  /** Passthrough for the `columnOrder` state; pairs with `columnOrder`. */
  onColumnOrderChange?: (updater: unknown) => void;
  /**
   * Controlled column-visibility state — pass this (with
   * `onColumnVisibilityChange`) to share one visibility state with an external
   * `useReactTable` instance. Uncontrolled (internal state) when omitted.
   */
  columnVisibility?: unknown;
  /** Passthrough for the `columnVisibility` state; pairs with `columnVisibility`. */
  onColumnVisibilityChange?: (updater: unknown) => void;
  /**
   * Controlled row-selection state — pass this (with `onRowSelectionChange`) to
   * share one selection state with an external `useReactTable` instance (e.g. a
   * composed toolbar/bulk-actions bar). Uncontrolled (internal state) when
   * omitted.
   */
  rowSelection?: unknown;
  /** Passthrough for the `rowSelection` state; pairs with `rowSelection`. */
  onRowSelectionChange?: (updater: unknown) => void;
  /**
   * Opt out of client-side sorting — pass already-sorted `data` and drive
   * sorting via `sorting`/`onSortingChange` (e.g. mapped to a server query by
   * the caller).
   */
  manualSorting?: boolean;
  /**
   * Controlled sorting state — pass this (with `onSortingChange`) to drive
   * sorting externally. Uncontrolled (internal state) when omitted.
   */
  sorting?: unknown;
  /** Passthrough for the `sorting` state; pairs with `sorting`. */
  onSortingChange?: (updater: unknown) => void;
  /**
   * Renders a full row, bypassing DataTable's default per-cell `flexRender`
   * path entirely. Use to swap in a custom, independently memoizable row
   * component — the caller owns the row's markup and equality semantics. Reuse
   * the exported `getCellStyle`/`getPinnedStyle`/`getColumnWidth` helpers to
   * match DataTable's default cell styling if desired. Also bypasses
   * `renderExpandedRow` — a row rendered via `renderRow` never gets an
   * expanded-content row appended.
   */
  renderRow?: (row: unknown, rowIndex: number) => ReactNode;
  /**
   * Renders a custom empty state instead of the default "No results." row.
   * Receives `hasFilters` (whether any column filter is currently applied).
   */
  renderEmptyState?: (context: { hasFilters: boolean }) => ReactNode;
  /**
   * Text of the default empty-state row (default `'No results.'`). Ignored when
   * `renderEmptyState` is given. Override to localize.
   */
  emptyLabel?: string;
  /**
   * `'page'` (default) keeps today's client-paginated behavior. `'infinite'`
   * omits the paginated row model — `data` is the full accumulated array the
   * caller appends to on each `onLoadMore` — and renders a sentinel row that
   * calls `onLoadMore` once it scrolls into view.
   */
  paginationMode?: 'page' | 'infinite';
  /**
   * Called when the infinite-scroll sentinel intersects the viewport.
   * `paginationMode="infinite"` only.
   */
  onLoadMore?: () => void;
  /**
   * Expands the sentinel's `IntersectionObserver` root margin (native CSS
   * margin syntax, e.g. `'400px'`). `paginationMode="infinite"` only.
   */
  loadMoreRootMargin?: string;
  /** Whether more rows are available to load. `paginationMode="infinite"` only. */
  hasNextPage?: boolean;
  /**
   * Whether a load is in flight — suppresses further `onLoadMore` calls and
   * renders a trailing loading row. `paginationMode="infinite"` only.
   */
  isLoadingMore?: boolean;
  /**
   * Hide the trailing sticky action column — the column-visibility cog in the
   * header and each row's overflow-actions ellipsis. Shown by default. A
   * no-op when `table` is passed.
   */
  hideActionColumn?: boolean;
  /**
   * Renders the content of a row's overflow-actions menu, opened from the
   * ellipsis trigger in the trailing action column. Omit to render that row
   * without a trigger — the 48px column is still reserved.
   */
  renderRowActions?: (row: unknown) => ReactNode;
  /** Accessible name of a row's overflow-actions trigger. */
  rowActionsLabel?: string;
  /** Accessible name of the action column's column-visibility trigger. */
  columnSettingsLabel?: string;
  /**
   * Copy of the tooltip shown while a header cell is hovered/focused — one
   * `{ label, action }` line per capability that column actually has. Merged
   * over the defaults (`sort`: "Sort column"/"Click", `reorder`: "Reorder
   * column"/"Drag", `resize`: "Resize column"/"Drag border"), so any subset can
   * be overridden to localize; a column with no capability shows no tooltip.
   */
  headerHints?: Partial<
    Record<'sort' | 'reorder' | 'resize', { label: string; action: string }>
  >;
}
