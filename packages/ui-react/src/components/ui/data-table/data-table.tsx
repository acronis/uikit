import {
  type CSSProperties,
  type DragEvent,
  Fragment,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  type Cell,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnSizingState,
  type ExpandedState,
  type Header,
  type OnChangeFn,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';

import { useIntersectionObserver } from '@/hooks';
import { cn } from '@/lib/utils';
import { ButtonIcon } from '../button-icon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../dropdown-menu';
import {
  Table,
  TableActionsCell,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSettingsCell,
} from '../table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip';
import { isBulkSelectionActive } from './data-table-selection';
import { DataTableViewOptions } from './data-table-view-options';

// Ported from `@acronis-platform/shadcn-uikit`'s `data-table`
// (packages/ui-legacy/src/components/ui/data-table/). A TanStack-react-table v8
// data grid composed over the ui-react Table primitives — sorting, filtering,
// column visibility, row selection, pagination, and optional row expansion. The
// presentational flags (`striped`, `bordered`, `skeleton`, `highlightCurrentRow`)
// are borrowed from the Vue `AvTable`; behavioral features come from TanStack.
// Pair with DataTableToolbar / DataTablePagination / DataTableColumnHeader, which
// take the `table` instance returned to column cells via TanStack context.
// The grid cells/rows/headers are themed by the Table primitives' `--ui-table-*`
// tier; DataTable's own chrome reuses that tier too — the wrapper border matches
// the cell borders (`--ui-table-global-row-border-color`), the empty-state uses
// the muted table-value color, the current row the active-row color, and stripes
// the secondary surface.
//
// Advanced-grid opt-ins built on native TanStack features:
//   • Column resizing  -> `enableColumnResizing` + `columnResizing` state, with a
//     drag handle rendered from `header.getResizeHandler()`.
//   • Sticky columns   -> `ColumnDef.meta.pin: 'left' | 'right'` drives TanStack's
//     native column-pinning API (`column.pin()` / `getStart()` / `getAfter()`),
//     surfaced as `position: sticky` cells with an opaque row-token background.
//   • Column reorder   -> `enableColumnReordering` + `columnOrder` state, with
//     native HTML5 drag-and-drop on the header cells (the grab/grabbing cursors
//     come from `--ui-draggable-cursor[-active]`, the counterpart of the resize
//     handle's `--ui-resizable-cursor`).

// Extend TanStack's per-column `meta` with the flags DataTable reads. Augmenting
// the module keeps `ColumnDef.meta.pin` type-safe at the call site.
declare module '@tanstack/react-table' {
  // Type params must match TanStack's `ColumnMeta<TData, TValue>` arity/names for
  // declaration merging, even though this augmentation doesn't reference them.
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Pin the column to a table edge (sticky while the grid scrolls horizontally). */
    pin?: 'left' | 'right';
    /**
     * Let the column's header + cells wrap onto multiple lines (drops the fixed
     * row height); mirrors the `Table` primitives' `wrap` prop on TableHead/TableCell.
     */
    wrap?: boolean;
  }
}

// Sticky offset + stacking for a pinned column, computed from TanStack's own
// pinning geometry rather than hand-rolled CSS math. A subtle edge shadow (facing
// the scrollable columns) separates the pinned column from content sliding
// underneath it — the opaque background that actually hides that content lives
// in the caller's className (see `headerPinnedBg`/`rowBg` below), not here.
export function getPinnedStyle<TData>(
  column: Column<TData, unknown>
): CSSProperties | undefined {
  const pinned = column.getIsPinned();
  if (!pinned) return undefined;
  return {
    position: 'sticky',
    left: pinned === 'left' ? column.getStart('left') : undefined,
    right: pinned === 'right' ? column.getAfter('right') : undefined,
    zIndex: 1,
    // Derived from the same border token every other table divider uses (not a
    // hardcoded color), so the separator theme-adapts automatically.
    boxShadow:
      pinned === 'left'
        ? '4px 0 4px -4px var(--ui-table-global-row-border-color)'
        : '-4px 0 4px -4px var(--ui-table-global-row-border-color)',
  };
}

// A column's rendered width tracks TanStack's size model once the consumer has
// opted in — either explicitly (a `size` set on the `ColumnDef`) or implicitly
// (column resizing enabled, which needs every column's width to be deterministic
// for the drag math to work). Without either, columns stay in native `<table>`
// auto-layout so `size`'s internal default (TanStack falls back to 150) never
// forces every untouched column to a fixed width.
export function getColumnWidth<TData>(
  column: Column<TData, unknown>,
  enableColumnResizing: boolean
): number | undefined {
  if (enableColumnResizing || column.columnDef.size !== undefined) {
    return column.getSize();
  }
  return undefined;
}

function getHeaderStyle<TData>(
  header: Header<TData, unknown>,
  enableColumnResizing: boolean
): CSSProperties | undefined {
  const pin = getPinnedStyle(header.column);
  const width = getColumnWidth(header.column, enableColumnResizing);
  if (!pin && width === undefined) return undefined;
  return { ...pin, width };
}

export function getCellStyle<TData>(
  cell: Cell<TData, unknown>,
  enableColumnResizing: boolean
): CSSProperties | undefined {
  const pin = getPinnedStyle(cell.column);
  const width = getColumnWidth(cell.column, enableColumnResizing);
  if (!pin && width === undefined) return undefined;
  return { ...pin, width };
}

// Matches TanStack's own `defaultColumnSizing` fallback bounds — the same
// range `column.getSize()` already clamps to internally when a column
// doesn't set its own `minSize`/`maxSize`.
const DEFAULT_MIN_COLUMN_SIZE = 20;
const DEFAULT_MAX_COLUMN_SIZE = Number.MAX_SAFE_INTEGER;

/**
 * Computes the next column width for an Arrow-key resize step (Shift = larger
 * step), clamped to `[min, max]` regardless of which bound `currentSize`
 * started outside of. Returns `undefined` for any other key, so the caller
 * knows not to `preventDefault()`/resize.
 */
export function getResizeKeyboardStep(
  key: string,
  currentSize: number,
  { shiftKey, min, max }: { shiftKey: boolean; min: number; max: number }
): number | undefined {
  const step = shiftKey ? 50 : 10;
  if (key === 'ArrowLeft')
    return Math.min(max, Math.max(min, currentSize - step));
  if (key === 'ArrowRight')
    return Math.max(min, Math.min(max, currentSize + step));
  return undefined;
}

/**
 * Moves `from` to `to`'s position in a `columnOrder` array (the drop semantics
 * of the header drag gesture: the dragged column lands where the drop target
 * sits, pushing it aside). Returns `order` unchanged when either id is absent,
 * so a drop on a column that isn't part of the order (e.g. one added while the
 * gesture was in flight) is a no-op rather than a reshuffle.
 */
export function reorderColumn(
  order: string[],
  from: string,
  to: string
): string[] {
  const fromIndex = order.indexOf(from);
  const toIndex = order.indexOf(to);
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return order;
  const next = [...order];
  next.splice(toIndex, 0, next.splice(fromIndex, 1)[0]);
  return next;
}

/** One line of the header hover tooltip: a capability and the gesture for it. */
export interface DataTableHeaderHint {
  /** The capability, rendered in bold (e.g. `Sort column`). */
  label: string;
  /** The gesture that triggers it (e.g. `Click`). */
  action: string;
}

/** Copy of the header hover tooltip, one entry per column capability. */
export interface DataTableHeaderHints {
  sort: DataTableHeaderHint;
  reorder: DataTableHeaderHint;
  resize: DataTableHeaderHint;
}

const DEFAULT_HEADER_HINTS: DataTableHeaderHints = {
  sort: { label: 'Sort column', action: 'Click' },
  reorder: { label: 'Reorder column', action: 'Drag' },
  resize: { label: 'Resize column', action: 'Drag border' },
};

// `columns`/`data` build DataTable's own table instance; `table` renders an
// externally-built one instead. At least one of the two forms is required —
// omitting both would otherwise silently render an empty table — but `table`
// may still be passed alongside `columns`/`data` (e.g. to also drive a
// composed toolbar/pagination from the same instance DataTable renders).
type DataTableDataSourceProps<TData, TValue> =
  | {
      columns: ColumnDef<TData, TValue>[];
      data: TData[];
      /**
       * Also drive an externally-built TanStack `table` instance (e.g. a
       * composed toolbar/pagination) from the same state as this DataTable.
       */
      table?: TanstackTable<TData>;
    }
  | {
      columns?: ColumnDef<TData, TValue>[];
      data?: TData[];
      /**
       * Render from an externally-built TanStack `table` instance instead of
       * DataTable's own — DataTable then owns no state and renders the caller's
       * instance as-is (sorting, filtering, pagination, row models, etc. are all
       * configured on that instance). Makes `columns`/`data` unnecessary (they're
       * only used to build DataTable's own instance) and the following props
       * no-ops (configure the equivalent directly on the external instance
       * instead): `columnVisibility`, `onColumnVisibilityChange`,
       * `onColumnSizingChange`, `enableColumnResizing`,
       * `enableColumnReordering`, `columnOrder`, `onColumnOrderChange`,
       * `getRowCanExpand`,
       * `manualSorting`, `sorting`, `onSortingChange`, `paginationMode`,
       * `onLoadMore`, `loadMoreRootMargin`, `hasNextPage`, `isLoadingMore`.
       * `meta.pin`-driven column pinning is also skipped — pin/unpin the
       * caller's own instance via TanStack's `column.pin()` directly.
       */
      table: TanstackTable<TData>;
    };

interface DataTableOwnProps<TData> {
  /** Enables row expansion for rows that return true. Pair with `renderExpandedRow`. */
  getRowCanExpand?: (row: Row<TData>) => boolean;
  /**
   * Renders expanded content for an expanded row. Used together with
   * `getRowCanExpand`.
   */
  renderExpandedRow?: (row: Row<TData>) => ReactNode;
  /** Alternating row backgrounds. */
  striped?: boolean;
  /** Vertical borders between columns (rows already have horizontal borders). */
  bordered?: boolean;
  /** Highlight the row the user last clicked (the "current" row). */
  highlightCurrentRow?: boolean;
  /** Render placeholder skeleton rows instead of data (loading state). */
  skeleton?: boolean;
  /** Number of skeleton rows to render when `skeleton` is set. */
  skeletonRows?: number;
  /**
   * Opt in to interactive column resizing. Renders a drag handle at the trailing
   * edge of each resizable header cell (TanStack's native `columnResizing`).
   */
  enableColumnResizing?: boolean;
  /** Passthrough for the `columnSizing` state so a consumer can persist widths. */
  onColumnSizingChange?: OnChangeFn<ColumnSizingState>;
  /**
   * Opt in to column reordering by dragging a header cell onto another one
   * (native HTML5 drag-and-drop driving TanStack's `columnOrder`). Pinned
   * columns are excluded — they're anchored to a table edge by definition.
   * Pointer-only, matching the design: there is no keyboard equivalent yet.
   */
  enableColumnReordering?: boolean;
  /**
   * Controlled column-order state — pass this (with `onColumnOrderChange`) to
   * persist or share the order. Uncontrolled (internal state) when omitted.
   */
  columnOrder?: ColumnOrderState;
  /** Passthrough for the `columnOrder` state; pairs with `columnOrder`. */
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>;
  /**
   * Controlled column-visibility state — pass this (with
   * `onColumnVisibilityChange`) to share one visibility state with an
   * external `useReactTable` instance (e.g. a composed toolbar). Uncontrolled
   * (internal state) when omitted.
   */
  columnVisibility?: VisibilityState;
  /** Passthrough for the `columnVisibility` state; pairs with `columnVisibility`. */
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  /**
   * Controlled row-selection state — pass this (with `onRowSelectionChange`)
   * to share one selection state with an external `useReactTable` instance
   * (e.g. a composed toolbar/bulk-actions bar). Uncontrolled (internal state)
   * when omitted.
   */
  rowSelection?: RowSelectionState;
  /** Passthrough for the `rowSelection` state; pairs with `rowSelection`. */
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  /**
   * Opt out of client-side sorting — pass already-sorted `data` and drive
   * sorting via `sorting`/`onSortingChange` (e.g. mapped to a server query by
   * the caller). Mapping sort state to a query and refetching stays the
   * caller's job; DataTable only skips its own comparator.
   */
  manualSorting?: boolean;
  /**
   * Controlled sorting state — pass this (with `onSortingChange`) to drive
   * sorting externally. Uncontrolled (internal state) when omitted.
   */
  sorting?: SortingState;
  /** Passthrough for the `sorting` state; pairs with `sorting`. */
  onSortingChange?: OnChangeFn<SortingState>;
  /**
   * Renders a full row, bypassing DataTable's default per-cell `flexRender`
   * path entirely (no `<TableRow>`/cell-styling/pinning of DataTable's own).
   * Use to swap in a custom, independently memoizable row component. The
   * caller owns the row's markup and equality semantics — reuse the exported
   * `getCellStyle`/`getPinnedStyle`/`getColumnWidth` helpers to match
   * DataTable's default cell styling if desired.
   *
   * Also bypasses DataTable's `renderExpandedRow` handling — a row rendered
   * via `renderRow` never gets an expanded-content row appended, even when
   * `getRowCanExpand` returns true for it. Read `row.getIsExpanded()` and
   * render the expanded content yourself if you need both.
   */
  renderRow?: (row: Row<TData>, rowIndex: number) => ReactNode;
  /**
   * Renders a custom empty state instead of the default "No results." row.
   * Receives `hasFilters` (whether any column filter is currently applied) so
   * the caller can distinguish "no data at all" from "no matches" — the
   * actual copy/wording/localization stays the caller's job.
   */
  renderEmptyState?: (context: { hasFilters: boolean }) => ReactNode;
  /**
   * `'page'` (default) keeps today's client-paginated behavior. `'infinite'`
   * omits the paginated row model — `data` is assumed to be the full
   * accumulated array the caller appends to on each `onLoadMore` — and
   * renders a sentinel row that calls `onLoadMore` once it scrolls into view.
   * Does not compose with virtualization; for a large accumulated list, use
   * the `VirtualScrolling` recipe over the raw `Table` primitives instead.
   */
  paginationMode?: 'page' | 'infinite';
  /**
   * Called when the infinite-scroll sentinel intersects the viewport.
   * `paginationMode="infinite"` only. The fetch-more call, cursor/offset
   * tracking, dedup, and accumulating `data` stay the caller's job. Requires
   * at least one row already rendered — an empty table with `data={[]}`
   * cannot use the sentinel to drive its very first fetch; seed the first
   * page yourself (e.g. on mount) and use `onLoadMore` for subsequent pages.
   */
  onLoadMore?: () => void;
  /**
   * Expands the sentinel's `IntersectionObserver` root margin (native CSS
   * margin syntax, e.g. `'400px'`) so `onLoadMore` fires before the sentinel
   * is literally visible — the closer the caller's fetch is to finishing by
   * the time the user actually scrolls there, the less often the trailing
   * loading row is seen. `paginationMode="infinite"` only; no-op when `table`
   * is passed. How far this actually prefetches also depends on page size —
   * a large margin with small pages can trigger several `onLoadMore` calls
   * back-to-back as the user scrolls normally, which is expected.
   */
  loadMoreRootMargin?: string;
  /** Whether more rows are available to load. `paginationMode="infinite"` only. */
  hasNextPage?: boolean;
  /**
   * Accessible name of a column's resize handle. Override to localize.
   * `enableColumnResizing` only.
   */
  resizeColumnLabel?: string;
  /**
   * Text of the default empty-state row. Ignored when `renderEmptyState` is
   * given. Override to localize.
   */
  emptyLabel?: string;
  /**
   * Whether a load is in flight — suppresses further `onLoadMore` calls and
   * renders a trailing loading row. `paginationMode="infinite"` only.
   */
  isLoadingMore?: boolean;
  /**
   * Hide the trailing sticky action column — the column-visibility cog in the
   * header and each row's overflow-actions ellipsis. Shown by default. A
   * no-op when an external `table` is passed (build the column into that
   * instance's own `columns` instead).
   */
  hideActionColumn?: boolean;
  /**
   * Renders the content of a row's overflow-actions menu (e.g. `Edit`/
   * `Delete` items), opened from the ellipsis trigger in the trailing action
   * column. Omit to render that row without a trigger — the 48px column is
   * still reserved. Suppressed (like the trigger itself) while a bulk
   * selection is active, per `TableActionsCell`.
   */
  renderRowActions?: (row: Row<TData>) => ReactNode;
  /** Accessible name of a row's overflow-actions trigger. Override to localize. */
  rowActionsLabel?: string;
  /**
   * Accessible name of the action column's column-visibility trigger.
   * Override to localize.
   */
  columnSettingsLabel?: string;
  /**
   * Copy of the tooltip shown while a header cell is hovered/focused — one
   * line per capability that column actually has (sort/reorder/resize).
   * Override (per capability) to localize; a column with no capability shows
   * no tooltip at all.
   */
  headerHints?: Partial<DataTableHeaderHints>;
}

export type DataTableProps<TData, TValue = unknown> = DataTableOwnProps<TData> &
  DataTableDataSourceProps<TData, TValue>;

export function DataTable<TData, TValue = unknown>({
  columns = [],
  data = [],
  table: externalTable,
  getRowCanExpand,
  renderExpandedRow,
  striped = false,
  bordered = false,
  highlightCurrentRow = false,
  skeleton = false,
  skeletonRows = 5,
  enableColumnResizing = false,
  onColumnSizingChange,
  enableColumnReordering = false,
  columnOrder: controlledColumnOrder,
  onColumnOrderChange,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange,
  rowSelection: controlledRowSelection,
  onRowSelectionChange,
  manualSorting = false,
  sorting: controlledSorting,
  onSortingChange,
  renderRow,
  renderEmptyState,
  paginationMode = 'page',
  onLoadMore,
  loadMoreRootMargin,
  hasNextPage = false,
  resizeColumnLabel = 'Resize column',
  emptyLabel = 'No results.',
  isLoadingMore = false,
  hideActionColumn = false,
  renderRowActions,
  rowActionsLabel = 'Row actions',
  columnSettingsLabel,
  headerHints,
}: DataTableProps<TData, TValue>) {
  const resolvedHeaderHints: DataTableHeaderHints = {
    ...DEFAULT_HEADER_HINTS,
    ...headerHints,
  };
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const sorting = controlledSorting ?? internalSorting;
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [internalColumnVisibility, setInternalColumnVisibility] =
    useState<VisibilityState>({});
  const columnVisibility =
    controlledColumnVisibility ?? internalColumnVisibility;
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});
  const rowSelection = controlledRowSelection ?? internalRowSelection;
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [internalColumnOrder, setInternalColumnOrder] =
    useState<ColumnOrderState>([]);
  const columnOrder = controlledColumnOrder ?? internalColumnOrder;
  // The header cell the user is currently dragging, so the source cell can dim
  // while the gesture is in flight.
  const [draggedColumnId, setDraggedColumnId] = useState<string>();
  const [currentRowId, setCurrentRowId] = useState<string>();
  // Roving tabindex over the data rows: exactly one row is a Tab stop at a
  // time (the rest are `tabIndex={-1}`, still focusable programmatically),
  // and Arrow Up/Down move both the DOM focus and which row that is. Clamped
  // against the live row count below rather than reset via an effect, so a
  // filter/page change that shrinks `rows` can't leave it pointing past the
  // end.
  const [focusedRowIndex, setFocusedRowIndex] = useState(0);
  const rowRefs = useRef<Array<HTMLTableRowElement | null>>([]);

  const handleColumnSizingChange: OnChangeFn<ColumnSizingState> = (updater) => {
    setColumnSizing(updater);
    onColumnSizingChange?.(updater);
  };

  const handleColumnOrderChange: OnChangeFn<ColumnOrderState> = (updater) => {
    if (controlledColumnOrder === undefined) {
      setInternalColumnOrder(updater);
    }
    onColumnOrderChange?.(updater);
  };

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (
    updater
  ) => {
    setInternalColumnVisibility(updater);
    onColumnVisibilityChange?.(updater);
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    if (controlledSorting === undefined) {
      setInternalSorting(updater);
    }
    onSortingChange?.(updater);
  };

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (
    updater
  ) => {
    if (controlledRowSelection === undefined) {
      setInternalRowSelection(updater);
    }
    onRowSelectionChange?.(updater);
  };

  // The trailing sticky action column (cog + per-row ellipsis) is a no-op
  // with an external `table` — that instance's own `columns` already decide
  // what renders, DataTable doesn't own its state in that mode (see the
  // `table` prop's tsdoc).
  const showActionColumn = !hideActionColumn && !externalTable;
  // A real `ColumnDef` (rather than chrome bolted onto the render loop) so
  // TanStack's own pinning geometry measures and offsets it like any other
  // pinned column — `header`/`cell` are never read (see the header/body
  // render loops below, which special-case this id), only `size`/`meta.pin`.
  const actionColumns = useMemo<ColumnDef<TData, TValue>[]>(
    () =>
      showActionColumn
        ? [
            {
              id: '__actions',
              size: 48,
              enableSorting: false,
              enableHiding: false,
              meta: { pin: 'right' },
              header: () => null,
              cell: () => null,
            },
          ]
        : [],
    [showActionColumn]
  );
  const tableColumns = useMemo(
    () => [...columns, ...actionColumns],
    [columns, actionColumns]
  );
  // The pinned action cell's own hover (its ellipsis/cog trigger) should be
  // the only thing that tints while it's hovered — not the row underneath it
  // (see `hover:bg-transparent` below). Tracked by id (rather than a boolean)
  // because it's set from the action cell of whichever row is currently under
  // the pointer.
  const [actionHoveredRowId, setActionHoveredRowId] = useState<string>();

  // Built unconditionally — hooks can't be conditionally called — but only
  // feeds the render path below when no external `table` is passed (see
  // `table` below).
  const internalTable = useReactTable({
    data,
    columns: tableColumns,
    enableColumnResizing,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    ...(paginationMode === 'page'
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),
    getRowCanExpand,
    onExpandedChange: setExpanded,
    manualSorting,
    onSortingChange: handleSortingChange,
    ...(manualSorting ? {} : { getSortedRowModel: getSortedRowModel() }),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onRowSelectionChange: handleRowSelectionChange,
    onColumnSizingChange: handleColumnSizingChange,
    onColumnOrderChange: handleColumnOrderChange,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
      columnSizing,
      columnOrder,
    },
  });

  // The caller's instance is the single source of truth when passed — it
  // configures its own row models/state, so DataTable just renders from it.
  const table = externalTable ?? internalTable;
  const isInfiniteScroll = !externalTable && paginationMode === 'infinite';
  // `enableColumnResizing` is documented as a no-op with an external `table`
  // (the caller owns that instance's ColumnSizing state), but ColumnSizing is
  // a built-in TanStack feature present on any instance — reading the raw
  // prop below would still render live resize handles that mutate the
  // caller's own instance. Gate it the same way as `isInfiniteScroll`.
  const resizingEnabled = enableColumnResizing && !externalTable;
  // Same reasoning as `resizingEnabled`: ColumnOrdering is a built-in TanStack
  // feature present on any instance, so reading the raw prop would let the
  // header drag mutate a caller-owned instance DataTable doesn't manage.
  const reorderingEnabled = enableColumnReordering && !externalTable;
  // A resize drag necessarily moves the pointer off the (few-px-wide) resize
  // handle and onto the header cell itself. If that cell is still
  // `draggable`, the browser arms a native HTML5 reorder drag mid-resize —
  // native drag then swallows the mousemove/mouseup TanStack's resize
  // handler relies on, so the cursor flips to the reorder "grab" icon and
  // releasing the mouse doesn't cleanly end the resize. Reading this back
  // from TanStack's own resize state (rather than pointer position) keeps
  // every header cell non-draggable for the *entire* gesture, regardless of
  // where the pointer ends up.
  const isAnyColumnResizing = Boolean(
    table.getState().columnSizingInfo.isResizingColumn
  );
  // The resize handle only shows its `ew-resize` cursor while the pointer is
  // directly over its thin 4px hit area — once a drag starts, fast pointer
  // movement leaves that area and the browser shows whatever cursor the
  // element underneath declares (e.g. a sortable header's `cursor-pointer`).
  // This attribute + the `html[data-ui-column-resizing] *` rule in
  // styles/index.css force `ew-resize` everywhere for the duration of the
  // drag — a plain `<body>` inline cursor loses to a descendant's own
  // `cursor` declaration, so it isn't enough on its own.
  useEffect(() => {
    if (!isAnyColumnResizing) return;
    document.documentElement.setAttribute('data-ui-column-resizing', '');
    return () => {
      document.documentElement.removeAttribute('data-ui-column-resizing');
    };
  }, [isAnyColumnResizing]);
  const sentinelRef = useIntersectionObserver<HTMLTableRowElement>({
    onIntersect: () => onLoadMore?.(),
    disabled: !isInfiniteScroll || !hasNextPage || isLoadingMore,
    rootMargin: loadMoreRootMargin,
  });

  // Arrow-key resize on the drag handle (see `canResize` below). Ignores any
  // modifier besides Shift so it doesn't hijack browser/OS shortcuts bound to
  // Ctrl/Alt/Cmd+Arrow (e.g. back navigation) while the handle has focus.
  const handleResizeKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    header: Header<TData, unknown>
  ) => {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    const nextSize = getResizeKeyboardStep(event.key, header.column.getSize(), {
      shiftKey: event.shiftKey,
      min: header.column.columnDef.minSize ?? DEFAULT_MIN_COLUMN_SIZE,
      max: header.column.columnDef.maxSize ?? DEFAULT_MAX_COLUMN_SIZE,
    });
    if (nextSize === undefined) return;
    event.preventDefault();
    table.setColumnSizing((old) => ({ ...old, [header.column.id]: nextSize }));
  };

  // Native HTML5 drag-and-drop on the header cells. `columnOrder` starts empty
  // (TanStack reads that as "the declared order"), so the first drop seeds it
  // from the live leaf columns before moving anything.
  const handleColumnDragStart = (
    event: DragEvent<HTMLTableCellElement>,
    columnId: string
  ) => {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      // Firefox requires setData() during dragstart to actually initiate a
      // native drag; the value itself is unused (drop reads draggedColumnId).
      event.dataTransfer.setData('text/plain', columnId);
    }
    setDraggedColumnId(columnId);
  };

  const handleColumnDragOver = (event: DragEvent<HTMLTableCellElement>) => {
    // Without this the browser rejects the drop and no `onDrop` ever fires.
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  };

  const handleColumnDrop = (
    event: DragEvent<HTMLTableCellElement>,
    targetColumnId: string
  ) => {
    event.preventDefault();
    if (!draggedColumnId) return;
    const current = table.getState().columnOrder;
    const base = current.length
      ? current
      : table.getAllLeafColumns().map((column) => column.id);
    table.setColumnOrder(reorderColumn(base, draggedColumnId, targetColumnId));
    setDraggedColumnId(undefined);
  };

  // Read each column's `meta.pin` and drive TanStack's native pinning state.
  // Always calls `pin()` (rather than only when truthy) so a column whose
  // `meta.pin` is removed dynamically actually un-pins. Skipped for an
  // external `table` — DataTable owns no state in that mode (see the `table`
  // prop's tsdoc), so the caller's own pinning setup is left alone.
  useEffect(() => {
    if (externalTable) return;
    table.getAllLeafColumns().forEach((column) => {
      column.pin(column.columnDef.meta?.pin ?? false);
    });
  }, [table, columns, externalTable]);

  const rows = table.getRowModel().rows;
  // Derived from the selection state, so it's the same for every row — compute
  // it once instead of per row inside the render loop below.
  const bulkSelectionActive = isBulkSelectionActive(table);
  const activeRowIndex = rows.length
    ? Math.min(focusedRowIndex, rows.length - 1)
    : 0;

  // Mouse/pointer clicks still focus a `tabIndex={-1}` row (browsers allow
  // programmatic/click focus regardless of tabIndex value) — syncing the
  // roving index on focus makes that row the next Tab stop too, matching how
  // users expect the last-interacted row to keep focus.
  const handleRowFocus = (rowIndex: number) => {
    setFocusedRowIndex(rowIndex);
  };

  const handleRowKeyDown = (
    event: KeyboardEvent<HTMLTableRowElement>,
    rowIndex: number
  ) => {
    // Keydown bubbles, so arrow keys from an interactive control inside a cell
    // (number spinner, textarea caret, native select) would otherwise be
    // hijacked to move row focus. Only roam when the row itself is focused.
    if (event.target !== event.currentTarget) return;
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const nextIndex =
      event.key === 'ArrowDown'
        ? Math.min(rowIndex + 1, rows.length - 1)
        : Math.max(rowIndex - 1, 0);
    if (nextIndex === rowIndex) return;
    event.preventDefault();
    setFocusedRowIndex(nextIndex);
    rowRefs.current[nextIndex]?.focus();
  };
  // Vertical borders are opt-in; a trailing border on the last cell would
  // double up with the wrapper, so suppress it.
  const borderedClass = bordered
    ? '[&_th:not(:last-child)]:border-e [&_td:not(:last-child)]:border-e [&_th]:border-[var(--ui-table-global-row-border-color)] [&_td]:border-[var(--ui-table-global-row-border-color)]'
    : undefined;

  // A pinned header/body cell must be opaque so the cells scrolling under it
  // (same row) aren't visible. `--ui-table-data-row-color-idle` is
  // *transparent by design* (an idle row shows the page/card surface through
  // it), so it can't be reused here — pinned idle cells need the actual
  // resolved surface color instead (`--ui-background-surface-primary`, bridged
  // to `bg-background`). Non-idle states (selected/current/striped) already use
  // real opaque tokens and are safe to mirror as-is (see `rowBg` below).
  const headerPinnedBg = 'bg-background';

  return (
    <div
      className={cn(
        'rounded-md border border-[var(--ui-table-global-row-border-color)]',
        borderedClass
      )}
    >
      <Table
        style={
          resizingEnabled ? { width: table.getCenterTotalSize() } : undefined
        }
      >
        {/* One provider for the whole header row so the capability hints share
            a single open/close delay group (Provider renders no DOM, so the
            table markup is unaffected). */}
        <TooltipProvider>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const isPinned = header.column.getIsPinned();
                  const canResize =
                    resizingEnabled && header.column.getCanResize();
                  // A pinned column is anchored to a table edge, so dragging it
                  // out of that edge would contradict its own pinning.
                  const canReorder =
                    reorderingEnabled && !header.isPlaceholder && !isPinned;
                  const canSort =
                    !header.isPlaceholder && header.column.getCanSort();
                  // One tooltip line per capability the column actually has, in
                  // the design's order; a column with none gets no tooltip.
                  const hints = [
                    canSort && resolvedHeaderHints.sort,
                    canReorder && resolvedHeaderHints.reorder,
                    canResize && resolvedHeaderHints.resize,
                  ].filter((hint): hint is DataTableHeaderHint =>
                    Boolean(hint)
                  );
                  if (header.column.id === '__actions') {
                    return (
                      <TableSettingsCell
                        key={header.id}
                        style={getHeaderStyle(header, resizingEnabled)}
                        className={headerPinnedBg}
                      >
                        <DataTableViewOptions
                          table={table}
                          iconOnly
                          triggerAriaLabel={columnSettingsLabel}
                        />
                      </TableSettingsCell>
                    );
                  }
                  const headerCell = (
                    <TableHead
                      wrap={header.column.columnDef.meta?.wrap}
                      style={getHeaderStyle(header, resizingEnabled)}
                      draggable={
                        (canReorder && !isAnyColumnResizing) || undefined
                      }
                      onDragStart={
                        canReorder
                          ? (event) =>
                              handleColumnDragStart(event, header.column.id)
                          : undefined
                      }
                      onDragOver={canReorder ? handleColumnDragOver : undefined}
                      onDrop={
                        canReorder
                          ? (event) =>
                              handleColumnDrop(event, header.column.id)
                          : undefined
                      }
                      onDragEnd={
                        canReorder
                          ? () => setDraggedColumnId(undefined)
                          : undefined
                      }
                      className={cn(
                        canResize && 'relative',
                        // Per the design, a sortable header tints the whole
                        // cell on hover/press, not just the inner sort button.
                        // Suppressed while any column is resizing, since the
                        // pointer drags across neighboring `<th>`s and would
                        // otherwise tint them via native `:hover`.
                        canSort &&
                          !isAnyColumnResizing &&
                          'transition-colors hover:bg-[var(--ui-table-header-cell-color-hover)] active:bg-[var(--ui-table-header-cell-color-active)]',
                        canReorder &&
                          !isAnyColumnResizing &&
                          'cursor-(--ui-draggable-cursor) select-none active:cursor-(--ui-draggable-cursor-active)',
                        canReorder &&
                          draggedColumnId === header.column.id &&
                          'opacity-50',
                        isPinned && headerPinnedBg
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {canResize && (
                        <div
                          role="separator"
                          aria-orientation="vertical"
                          aria-label={resizeColumnLabel}
                          aria-valuenow={header.column.getSize()}
                          aria-valuemin={
                            header.column.columnDef.minSize ??
                            DEFAULT_MIN_COLUMN_SIZE
                          }
                          aria-valuemax={
                            header.column.columnDef.maxSize ??
                            DEFAULT_MAX_COLUMN_SIZE
                          }
                          tabIndex={0}
                          // Keeps a press on the handle from starting the header
                          // cell's reorder drag instead of a resize when both
                          // features are enabled.
                          draggable={false}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onKeyDown={(event) =>
                            handleResizeKeyDown(event, header)
                          }
                          className={cn(
                            'absolute end-0 top-0 h-full w-1 cursor-(--ui-resizable-cursor) touch-none select-none bg-[var(--ui-table-global-row-border-color)] opacity-0 transition-[opacity,background-color] hover:bg-[var(--ui-resizable-border-color-hover)] hover:opacity-100 focus-visible:bg-[var(--ui-resizable-border-color-hover)] focus-visible:opacity-100 focus-visible:outline-[3px] focus-visible:outline-(--ui-focus-primary)',
                            header.column.getIsResizing() &&
                              'bg-[var(--ui-resizable-border-color-active)] opacity-100'
                          )}
                        />
                      )}
                    </TableHead>
                  );
                  if (hints.length === 0) {
                    return <Fragment key={header.id}>{headerCell}</Fragment>;
                  }
                  return (
                    <Tooltip
                      key={header.id}
                      disabled={
                        isAnyColumnResizing || draggedColumnId !== undefined
                      }
                    >
                      {/* The whole header cell is the trigger (not just its sort
                          button), so the hint covers the reorder/resize gestures
                          that live on the cell itself. Disabled mid-drag/resize
                          so the hint doesn't pop up over a neighboring cell
                          while the pointer passes through it. */}
                      <TooltipTrigger render={headerCell} />
                      <TooltipContent className="flex flex-col gap-1">
                        {hints.map((hint) => (
                          <span key={hint.label}>
                            <span className="font-semibold">{hint.label}:</span>{' '}
                            {hint.action}
                          </span>
                        ))}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
        </TooltipProvider>
        <TableBody>
          {skeleton ? (
            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <TableRow
                key={`skeleton-${rowIndex}`}
                className="hover:bg-transparent"
              >
                {table.getVisibleLeafColumns().map((column) => (
                  <TableCell key={column.id}>
                    <div className="h-4 w-full animate-pulse rounded bg-[var(--ui-background-surface-secondary)]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows?.length ? (
            rows.map((row, rowIndex) => {
              if (renderRow) {
                return (
                  <Fragment key={row.id}>{renderRow(row, rowIndex)}</Fragment>
                );
              }
              const isSelected = row.getIsSelected();
              const isCurrent = highlightCurrentRow && currentRowId === row.id;
              // Opaque background applied to pinned cells so sibling cells don't
              // show through while the grid scrolls horizontally. Mirrors the
              // row's own resolved background across selection/current/stripe —
              // the idle case falls back to the real surface color
              // (`bg-background`) since the row's own idle token is transparent
              // by design (see `headerPinnedBg` above).
              // The idle case mirrors the row's own hover tint via `group` (see
              // the row's `group` class below) so the pinned action column
              // doesn't look "stuck" idle while the rest of the row is
              // hovered — the row's native `hover:` can't reach it since it
              // needs its own opaque background (see `headerPinnedBg` above).
              const rowBg =
                isSelected || isCurrent
                  ? 'bg-[var(--ui-table-data-row-color-active)]'
                  : striped && rowIndex % 2 === 1
                    ? 'bg-[var(--ui-background-surface-secondary)]'
                    : 'bg-background group-hover:bg-[var(--ui-table-data-row-color-hover)]';
              // While a selection is in play the action cell renders nothing and
              // carries no tint of its own, so suppressing the row's hover tint
              // for it would leave the pointer over a row that reacts to
              // nothing. Also covers a row hovered just before the selection
              // started, whose id is still in `actionHoveredRowId`.
              const isActionCellHovered =
                !bulkSelectionActive && actionHoveredRowId === row.id;
              return (
                <Fragment key={row.id}>
                  <TableRow
                    ref={(node) => {
                      rowRefs.current[rowIndex] = node;
                    }}
                    tabIndex={rowIndex === activeRowIndex ? 0 : -1}
                    onFocus={() => handleRowFocus(rowIndex)}
                    onKeyDown={(event) => handleRowKeyDown(event, rowIndex)}
                    selected={isSelected}
                    onClick={
                      highlightCurrentRow
                        ? () => setCurrentRowId(row.id)
                        : undefined
                    }
                    className={cn(
                      'group',
                      highlightCurrentRow && 'cursor-pointer',
                      striped &&
                        rowIndex % 2 === 1 &&
                        !isSelected &&
                        !isCurrent &&
                        'bg-[var(--ui-background-surface-secondary)]',
                      isCurrent &&
                        !isSelected &&
                        'bg-[var(--ui-table-data-row-color-active)]',
                      // The action cell's own hover tint (its ellipsis/cog
                      // trigger) should be the only thing that reacts while
                      // it's hovered — not the rest of the row underneath it.
                      isActionCellHovered && 'hover:bg-transparent'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isPinned = cell.column.getIsPinned();
                      if (cell.column.id === '__actions') {
                        return (
                          <TableActionsCell
                            key={cell.id}
                            style={getCellStyle(cell, resizingEnabled)}
                            className={rowBg}
                            bulkSelectionActive={bulkSelectionActive}
                            onMouseEnter={
                              bulkSelectionActive
                                ? undefined
                                : () => setActionHoveredRowId(row.id)
                            }
                            onMouseLeave={
                              bulkSelectionActive
                                ? undefined
                                : () =>
                                    setActionHoveredRowId((id) =>
                                      id === row.id ? undefined : id
                                    )
                            }
                          >
                            {renderRowActions && (
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  render={
                                    <ButtonIcon aria-label={rowActionsLabel} />
                                  }
                                >
                                  <EllipsisIcon />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {renderRowActions(row)}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableActionsCell>
                        );
                      }
                      return (
                        <TableCell
                          key={cell.id}
                          wrap={cell.column.columnDef.meta?.wrap}
                          style={getCellStyle(cell, resizingEnabled)}
                          className={cn(isPinned && rowBg)}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {renderExpandedRow && row.getIsExpanded() && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        className="h-auto py-3"
                        colSpan={row.getVisibleCells().length}
                      >
                        {renderExpandedRow(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })
          ) : renderEmptyState ? (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-24 text-center"
              >
                {renderEmptyState({
                  hasFilters: table.getState().columnFilters.length > 0,
                })}
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-24 text-center text-[var(--ui-table-data-value-color-disabled)]"
              >
                {emptyLabel}
              </TableCell>
            </TableRow>
          )}
          {isInfiniteScroll && !skeleton && rows.length > 0 && hasNextPage && (
            <TableRow
              ref={sentinelRef}
              aria-hidden
              className="hover:bg-transparent"
            >
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-1 p-0"
              />
            </TableRow>
          )}
          {isInfiniteScroll &&
            !skeleton &&
            rows.length > 0 &&
            isLoadingMore && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={table.getVisibleLeafColumns().length}>
                  <div
                    role="status"
                    aria-live="polite"
                    className="h-4 w-full animate-pulse rounded bg-[var(--ui-background-surface-secondary)]"
                  >
                    <span className="sr-only">Loading more rows…</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </div>
  );
}
