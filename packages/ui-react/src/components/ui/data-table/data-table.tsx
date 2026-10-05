import {
  type CSSProperties,
  type DragEvent,
  Fragment,
  type KeyboardEvent,
  type MouseEvent,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { Skeleton } from '../skeleton';
import {
  Table,
  TableActionsCell,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSettingsCell,
  type TableOverflow,
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
//     native HTML5 drag-and-drop on the header cells (plain `cursor-grab`/
//     `active:cursor-grabbing` utilities, since there's no dedicated Figma
//     "Draggable" token yet, unlike the resize handle's generated
//     `--ui-resizable-cursor`).

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
     * Column overflow mode. Forwarded to `TableHead` and `TableCell`.
     * Defaults to `'truncate'` when unset — clips to the column's CSS width,
     * keeping all rows at a uniform height. Use a truncation component with a
     * tooltip inside the cell renderer to surface the full value.
     * - `'truncate'` (default) — `overflow-hidden whitespace-nowrap`.
     * - `'wrap'` — `whitespace-normal`; the row grows to fit its content.
     * - `'hidden'` — clips via `max-w-0`; the cell renderer manages its own overflow UI.
     */
    overflow?: TableOverflow;
    /** Label shown for this column in the visibility dropdown. */
    label?: string;
    /** Optional visibility-dropdown category for this column. */
    category?: string;
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

// Default width for the kit-injected selection column (checkbox). Consumers
// override it by setting `size` on their 'select' ColumnDef; the component
// always enforces it strictly (width = minWidth = maxWidth) so it never grows.
const DEFAULT_SELECT_COLUMN_WIDTH = 48;

// TanStack merges its own feature defaults (size: 150, minSize: 20,
// maxSize: MAX_SAFE_INTEGER) into every column's resolved `columnDef` via
// `_getDefaultColumnDef()`. As a result `column.columnDef.size` is never
// `undefined` — checking it tells us nothing about whether the consumer
// explicitly set a size. Instead we compare the live values against the
// known defaults: any deviation means the consumer authored it.
const TANSTACK_DEFAULT_SIZE = 150;
const TANSTACK_DEFAULT_MIN_SIZE = 20;
const TANSTACK_DEFAULT_MAX_SIZE = Number.MAX_SAFE_INTEGER;

// CSS sizing rules per column — each column is evaluated independently:
//
//   size set        → strictly fixed: width = minWidth = maxWidth = size.
//                     minSize/maxSize on the ColumnDef are ignored because
//                     `size` is the definitive width.
//   size not set    → flexible: only minSize/maxSize apply as CSS floors/ceilings.
//                     No CSS `width` is emitted, so table-fixed still treats the
//                     column as "unsized" and gives it a share of the remaining
//                     space — while still honouring the floor/ceiling constraints.
//   resizing on     → all columns get width = minWidth = getSize() so the drag-
//                     handle offset math has a deterministic baseline.
//
// Chrome columns ('select', '__actions') are always strictly fixed.
export function getColumnSizeStyle<TData>(
  column: Column<TData, unknown>,
  enableColumnResizing: boolean
): Pick<CSSProperties, 'width' | 'minWidth' | 'maxWidth'> | undefined {
  if (column.id === 'select') {
    const size =
      column.columnDef.size !== TANSTACK_DEFAULT_SIZE
        ? column.columnDef.size!
        : DEFAULT_SELECT_COLUMN_WIDTH;
    return { width: size, minWidth: size, maxWidth: size };
  }
  if (column.id === '__actions') {
    const size = column.getSize();
    return { width: size, minWidth: size, maxWidth: size };
  }

  if (enableColumnResizing) {
    // Drag math needs every column to have a deterministic CSS width.
    const size = column.getSize();
    return { width: size, minWidth: size };
  }

  const hasExplicitSize = column.columnDef.size !== TANSTACK_DEFAULT_SIZE;
  const hasExplicitMinSize = column.columnDef.minSize !== TANSTACK_DEFAULT_MIN_SIZE;
  const hasExplicitMaxSize = column.columnDef.maxSize !== TANSTACK_DEFAULT_MAX_SIZE;

  if (hasExplicitSize) {
    // size overrides minSize/maxSize — strictly fixed column.
    const size = column.columnDef.size!;
    return { width: size, minWidth: size, maxWidth: size };
  }

  if (hasExplicitMinSize || hasExplicitMaxSize) {
    // Flexible column: no CSS width (stays "unsized" for table-fixed distribution),
    // only floor/ceiling constraints.
    return {
      ...(hasExplicitMinSize && { minWidth: column.columnDef.minSize }),
      ...(hasExplicitMaxSize && { maxWidth: column.columnDef.maxSize }),
    };
  }

  return undefined;
}

function getHeaderStyle<TData>(
  header: Header<TData, unknown>,
  enableColumnResizing: boolean
): CSSProperties | undefined {
  const pin = getPinnedStyle(header.column);
  // Non-leaf cells (group-label spans and placeholders) have no single leaf
  // size — skip width so colSpan layout determines the cell's rendered width.
  const sizeStyle =
    header.subHeaders.length === 0
      ? getColumnSizeStyle(header.column, enableColumnResizing)
      : undefined;
  if (!pin && sizeStyle === undefined) return undefined;
  return { ...pin, ...sizeStyle };
}

export function getCellStyle<TData>(
  cell: Cell<TData, unknown>,
  enableColumnResizing: boolean
): CSSProperties | undefined {
  const pin = getPinnedStyle(cell.column);
  const sizeStyle = getColumnSizeStyle(cell.column, enableColumnResizing);
  if (!pin && sizeStyle === undefined) return undefined;
  return { ...pin, ...sizeStyle };
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

// Controls inside a cell own their own click — a row click/activate handler
// must not also fire for them (e.g. a row-actions trigger, a selection
// checkbox, a link). Mirrors what's natively/ARIA interactive or a Tab stop.
const ROW_INTERACTIVE_DESCENDANT_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  'label',
  '[contenteditable]:not([contenteditable="false"])',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="switch"]',
  '[role="menuitem"]',
  '[role="link"]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function isFromInteractiveDescendant(
  event: MouseEvent<HTMLTableRowElement>,
  { checkSelection = true }: { checkSelection?: boolean } = {}
): boolean {
  const row = event.currentTarget;
  const target = event.target as Node;
  // React synthetic events bubble through portals, so a click inside a menu
  // or popover opened from a cell reaches the row although its DOM node
  // isn't inside it.
  if (!row.contains(target)) return true;
  const element = target instanceof Element ? target : target.parentElement;
  const interactive = element?.closest(ROW_INTERACTIVE_DESCENDANT_SELECTOR);
  // The row itself is a roving Tab stop (`tabIndex={0}`) — only its
  // descendants count, and a match above the row is irrelevant.
  if (interactive && interactive !== row && row.contains(interactive)) {
    return true;
  }
  // A drag-to-select of cell text ends in a click; don't treat it as one.
  // Skipped for double-click: the browser itself selects the word under the
  // pointer on the second press, so a selection is always present by then.
  return checkSelection && !!window.getSelection()?.toString();
}

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
       * instead): `getRowId`, `columnVisibility`, `onColumnVisibilityChange`,
       * `onColumnSizingChange`, `enableColumnResizing`,
       * `enableColumnReordering`, `columnOrder`, `onColumnOrderChange`,
       * `getRowCanExpand`, `rowSelection`, `onRowSelectionChange`,
       * `manualSorting`, `sorting`, `onSortingChange`, `paginationMode`,
       * `onLoadMore`, `loadMoreRootMargin`, `hasNextPage`, `isLoadingMore`.
       * `meta.pin`-driven column pinning is also skipped — pin/unpin the
       * caller's own instance via TanStack's `column.pin()` directly.
       */
      table: TanstackTable<TData>;
    };

interface DataTableOwnProps<TData> {
  /**
   * Derives a stable row id from the row data (e.g. `row => row.id`) instead of the default
   * array index — needed whenever `data` can reorder (sort/filter) while a row's own per-row
   * state (selection, a hook keyed by row) should follow the row, not the slot it occupied.
   */
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
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
  /**
   * Called on a single pointer click on a data row. Not called when the click
   * lands on an interactive control inside a cell (button, link, input,
   * checkbox, menu item, …), comes from a portaled element opened from the
   * row, or ends a text selection. The row gets a pointer cursor while this
   * is set. Composes with `highlightCurrentRow` (both run). Silently ignored
   * when `renderRow` is set — the caller owns that row's markup and handlers.
   */
  onRowClick?: (
    row: Row<TData>,
    event: MouseEvent<HTMLTableRowElement>
  ) => void;
  /**
   * Called when a data row is activated: Enter while the row itself is
   * focused (`via: 'keyboard'`; key repeat is ignored) or a double-click on
   * it (`via: 'pointer'`). The same interactive-descendant and portal guards
   * as `onRowClick` apply (Enter only counts when the row itself has focus);
   * the text-selection guard does not, since a double-click selects the word
   * under the pointer by itself. Silently ignored when `renderRow` is set.
   *
   * A double-click dispatches two single clicks first. The first normally
   * fires `onRowClick`; the second usually does not (browsers select a word
   * on the second press, and the text-selection guard suppresses it). Don't
   * wire navigation to `onRowClick` alongside this prop.
   *
   * Space does not activate a row: it's reserved for row selection when
   * `rowSelection` is in use.
   */
  onRowActivate?: (
    row: Row<TData>,
    details: {
      via: 'keyboard' | 'pointer';
      event:
        | KeyboardEvent<HTMLTableRowElement>
        | MouseEvent<HTMLTableRowElement>;
    }
  ) => void;
  /** Render placeholder skeleton rows instead of data (loading state). */
  skeleton?: boolean;
  /** Number of skeleton rows to render when `skeleton` is set. */
  skeletonRows?: number;
  /**
   * Custom content for each skeleton placeholder cell. Called once per visible
   * leaf column in each of the `skeletonRows` rows, only while `skeleton` is
   * set; `rowIndex` is 0-based. Replaces only the cell content — DataTable
   * keeps the `<TableRow>` (no hover tint, not focusable) and `<TableCell>`
   * (padding, borders, the column's `meta.overflow` mode).
   *
   * Unset renders the default `<Skeleton className="my-1 h-4 w-full" />`.
   * Returning `null`/`undefined` leaves the cell empty — there is no fallback,
   * so return the exported `Skeleton` to keep the default for a column. Also
   * called for the kit-injected `__actions` column (absent with
   * `hideActionColumn` or an external `table`) and for a consumer `select`
   * column — branch on `column.id`.
   *
   * Keep the content ~24px tall so the row stays 40px. Decorative only: no
   * text or interactive elements, and `aria-hidden` on anything readable — the
   * kit adds no live region. Also suits an empty view (static placeholder rows
   * under an empty-state overlay). Also called for each infinite-scroll
   * loading-more row (`paginationMode="infinite"` + `isLoadingMore`), with
   * `rowIndex` 0-based within those rows.
   */
  renderSkeletonCell?: (context: {
    column: Column<TData, unknown>;
    rowIndex: number;
  }) => ReactNode;
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
   * `getCellStyle`/`getPinnedStyle`/`getColumnSizeStyle` helpers to match
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
   * renders trailing loading rows. `paginationMode="infinite"` only.
   */
  isLoadingMore?: boolean;
  /**
   * Number of skeleton rows to render at the bottom of the table while
   * `isLoadingMore` is set. Defaults to `1`. Pairs with `renderSkeletonCell`
   * (the same callback is used for both initial-load and load-more rows, with
   * `rowIndex` 0-based within the loading-more block). `paginationMode="infinite"` only.
   */
  loadingMoreRows?: number;
  /**
   * Stick the header row to the top of the scroll container so it stays
   * visible while the user scrolls vertically through the table body.
   * Requires DataTable to have a bounded height — wrap it in a fixed-height
   * `flex flex-col` container (e.g. `<div className="h-96 flex flex-col">`);
   * `max-h` alone does not work.
   */
  stickyHeader?: boolean;
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
  /** Placeholder and accessible name of the column-visibility search field. */
  columnSearchPlaceholder?: string;
  /** Label of the per-category action that reveals every column. */
  showAllColumnsLabel?: ReactNode;
  /** Empty state shown when the column search has no matches. */
  noColumnsFoundLabel?: ReactNode;
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
  getRowId,
  getRowCanExpand,
  renderExpandedRow,
  striped = false,
  bordered = false,
  highlightCurrentRow = false,
  onRowClick,
  onRowActivate,
  skeleton = false,
  skeletonRows = 5,
  renderSkeletonCell,
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
  loadingMoreRows = 1,
  stickyHeader = false,
  hideActionColumn = false,
  renderRowActions,
  rowActionsLabel = 'Row actions',
  columnSettingsLabel,
  columnSearchPlaceholder,
  showAllColumnsLabel,
  noColumnsFoundLabel,
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
  const theadRef = useRef<HTMLTableSectionElement>(null);

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

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
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
  // Whether the caller provided a selection column — detected by the reserved
  // id 'select'. When present, DataTable auto-pins it to the left (same
  // mechanism as __actions on the right) so it stays sticky while the grid
  // scrolls horizontally. Skipped for an external `table` — that instance
  // manages its own pinning state.
  const hasSelectColumn =
    !externalTable && columns.some((col) => col.id === 'select');
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
              minSize: 48,
              maxSize: 48,
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
    getRowId,
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
    initialState:
      hasSelectColumn || showActionColumn
        ? {
            columnPinning: {
              ...(hasSelectColumn && { left: ['select'] }),
              ...(showActionColumn && { right: ['__actions'] }),
            },
          }
        : undefined,
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

  // The drop-target marker is set imperatively on dragover, so it's swept
  // imperatively too — on every exit path of a drag that started in this
  // table (`dragend` and `drop`), the only drags it's ever set for — rather
  // than derived from state. A missed `dragend` (e.g. the source cell
  // unmounted mid-drag) would otherwise leave a stale marker that React state
  // never knew about.
  const endColumnDrag = () => {
    setDraggedColumnId(undefined);
    // Scoped to this table's own <thead>: `document.querySelectorAll` doesn't
    // reach inside shadow roots.
    theadRef.current
      ?.querySelectorAll('[data-reorder-target]')
      .forEach((element) => element.removeAttribute('data-reorder-target'));
  };

  const handleColumnDragOver = (
    event: DragEvent<HTMLTableCellElement>,
    targetColumnId: string
  ) => {
    // Without this the browser rejects the drop and no `onDrop` ever fires.
    event.preventDefault();
    // Only a drag that started in this table is ever swept (foreign drags never
    // reach `endColumnDrag` — no local `dragend`, and `drop` bails early), so
    // marking for a file/text/sibling-table drag would leave it stuck.
    if (draggedColumnId) {
      event.currentTarget.setAttribute('data-reorder-target', '');
    }
    if (!event.dataTransfer) return;
    // Show "no drop" cursor when the source and target belong to different
    // header groups — cross-group reordering is not allowed (it interleaves
    // leaf columns from different groups in columnOrder, which breaks
    // TanStack's header-group rendering and causes label duplication).
    const draggedParentId = draggedColumnId
      ? table.getColumn(draggedColumnId)?.parent?.id
      : undefined;
    const targetParentId = table.getColumn(targetColumnId)?.parent?.id;
    event.dataTransfer.dropEffect =
      draggedParentId === targetParentId ? 'move' : 'none';
  };

  const handleColumnDrop = (
    event: DragEvent<HTMLTableCellElement>,
    targetColumnId: string
  ) => {
    event.preventDefault();
    if (!draggedColumnId) return;
    // Reject drops that would move a column outside its header group. Allowing
    // cross-group drops interleaves the two groups' leaf columns in columnOrder,
    // which causes TanStack to produce malformed header rows: the group label
    // renders at the wrong position (bug 2) and sometimes duplicates (bug 3).
    //
    // Known limitation: this guard only covers the drag gesture. The same broken
    // state is reachable via the `columnOrder` controlled prop — if the caller
    // passes a `columnOrder` where a group's leaf columns are not contiguous,
    // TanStack will produce duplicate group-label cells with no warning.
    const draggedParentId = table.getColumn(draggedColumnId)?.parent?.id;
    const targetParentId = table.getColumn(targetColumnId)?.parent?.id;
    if (draggedParentId !== targetParentId) {
      endColumnDrag();
      return;
    }
    const current = table.getState().columnOrder;
    const base = current.length
      ? current
      : table.getAllLeafColumns().map((column) => column.id);
    table.setColumnOrder(reorderColumn(base, draggedColumnId, targetColumnId));
    endColumnDrag();
  };

  // Read each column's `meta.pin` and drive TanStack's native pinning state.
  // Always calls `pin()` (rather than only when truthy) so a column whose
  // `meta.pin` is removed dynamically actually un-pins. Skipped for an
  // external `table` — DataTable owns no state in that mode (see the `table`
  // prop's tsdoc), so the caller's own pinning setup is left alone.
  //
  // Known limitation: pinning a leaf column that is nested inside a header
  // group breaks group contiguity. TanStack moves pinned leaves to a separate
  // bucket and reorders columns as [...left, ...center, ...right] before
  // createHeaderGroup runs, separating the pinned leaf from its siblings.
  // The result is a duplicate group-label cell in the header row — the same
  // rendering defect that the drag guard exists to prevent. Do not set
  // `meta.pin` on a leaf column that belongs to a header group.
  useEffect(() => {
    if (externalTable) return;
    table.getAllLeafColumns().forEach((column) => {
      // 'select' is always pinned left and '__actions' always right — the
      // caller can't opt these out via meta.pin. Any other column follows
      // its own meta.pin (or unpins when it has none).
      if (column.id === 'select') {
        column.pin('left');
      } else {
        column.pin(column.columnDef.meta?.pin ?? false);
      }
    });
  }, [table, tableColumns, externalTable]);

  const rows = table.getRowModel().rows;
  // Derived from the selection state, so it's the same for every row — compute
  // it once instead of per row inside the render loop below.
  const bulkSelectionActive = isBulkSelectionActive(table);
  // When a select column is present its end padding and the first data column's
  // start padding would double up the gap. Strip the first data column's ps so
  // the spacing between the checkbox and the first cell matches the design.
  const firstDataColumnId = hasSelectColumn
    ? table.getVisibleLeafColumns().find((col) => col.id !== 'select')?.id
    : undefined;
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
    row: Row<TData>,
    rowIndex: number
  ) => {
    // Keydown bubbles, so arrow keys from an interactive control inside a cell
    // (number spinner, textarea caret, native select) would otherwise be
    // hijacked to move row focus. Only roam when the row itself is focused.
    // The same guard keeps Enter on a cell's button from activating the row.
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' && onRowActivate && !event.repeat) {
      event.preventDefault();
      onRowActivate(row, { via: 'keyboard', event });
      return;
    }
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

  // CSS custom properties for every header and leaf column, keyed by
  // `--header-{id}-size` and `--col-{id}-size`. Placed on the <table> element
  // so that <col> elements can reference them via `calc(var(...) * 1px)`.
  // Recomputed only when column sizing state actually changes — during a live
  // resize drag only the single <table> style prop updates, not every <th>/<td>.
  const columnSizeVars = useMemo(() => {
    const vars: Record<string, number> = {};
    for (const header of table.getFlatHeaders()) {
      vars[`--header-${header.id}-size`] = header.getSize();
      vars[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return vars;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  // Sum of every visible column's minimum CSS width. Applied as `min-width` on
  // the <table> so the overflow-auto wrapper scrolls once the container is
  // narrower than the columns' combined floor — without this the table is always
  // w-full and individual cell min-widths have no effect on scrolling.
  const tableMinWidth = resizingEnabled
    ? undefined
    : table.getVisibleLeafColumns().reduce<number>((sum, column) => {
        const minWidth = getColumnSizeStyle(column, false)?.minWidth;
        return sum + (typeof minWidth === 'number' ? minWidth : 0);
      }, 0) || undefined;

  return (
    <div
      data-slot="data-table"
      className={cn('overflow-auto', stickyHeader && 'h-full', borderedClass)}
    >
      <Table
        style={
          {
            ...(resizingEnabled
              ? { width: table.getCenterTotalSize() }
              : tableMinWidth
                ? { minWidth: tableMinWidth }
                : undefined),
            ...columnSizeVars,
          } as CSSProperties
        }
      >
        {/* <col> elements address physical leaf columns directly, before any
            <tr> is read. This is required for table-layout:fixed + grouped
            headers: group-span <th> cells cannot define individual column
            widths, but <col> can — so the browser always picks up the right
            sizes regardless of how many header rows exist.
            Only columns with an explicit size get a width on their <col>;
            flexible columns (no size, only minSize/maxSize) are left unsized
            so table-fixed distributes the remaining space to them. */}
        <colgroup>
          {table.getVisibleLeafColumns().map((column) => {
            const sizeStyle = getColumnSizeStyle(column, resizingEnabled);
            return (
              <col
                key={column.id}
                style={
                  sizeStyle?.width !== undefined
                    ? { width: sizeStyle.width }
                    : undefined
                }
              />
            );
          })}
        </colgroup>
        {/* One provider for the whole header row so the capability hints share
            a single open/close delay group (Provider renders no DOM, so the
            table markup is unaffected). */}
        <TooltipProvider>
          <TableHeader
            ref={theadRef}
            className={
              stickyHeader ? 'sticky top-0 z-10 bg-background' : undefined
            }
          >
            {table
              .getHeaderGroups()
              .map((headerGroup, groupIndex, headerGroups) => (
                <TableRow
                  key={headerGroup.id}
                  className={cn(
                    'hover:bg-transparent',
                    groupIndex < headerGroups.length - 1 && 'border-b-0'
                  )}
                >
                  {headerGroup.headers.map((header) => {
                    const isPinned = header.column.getIsPinned();
                    // Non-leaf header cells (group-label spans and TanStack's
                    // structural placeholder cells) are purely presentational —
                    // no sort/reorder/resize/tooltip.
                    const isGroupHeader = header.subHeaders.length > 0;
                    const canResize =
                      !isGroupHeader &&
                      resizingEnabled &&
                      header.column.getCanResize() &&
                      header.column.id !== 'select';
                    // A pinned column is anchored to a table edge, so dragging it
                    // out of that edge would contradict its own pinning.
                    const canReorder =
                      !isGroupHeader &&
                      reorderingEnabled &&
                      !header.isPlaceholder &&
                      !isPinned;
                    const canSort =
                      !isGroupHeader &&
                      !header.isPlaceholder &&
                      header.column.getCanSort();
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
                      if (groupIndex < headerGroups.length - 1) {
                        // Group-header rows carry no cog, but the pinned cell
                        // must still be present so the row scrolls horizontally
                        // in sync with the leaf header row and the body.
                        return (
                          <TableSettingsCell
                            key={header.id}
                            style={getHeaderStyle(header, resizingEnabled)}
                            className={headerPinnedBg}
                          />
                        );
                      }
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
                            searchPlaceholder={columnSearchPlaceholder}
                            showAllLabel={showAllColumnsLabel}
                            noResultsLabel={noColumnsFoundLabel}
                          />
                        </TableSettingsCell>
                      );
                    }
                    const headerCell = (
                      <TableHead
                        colSpan={header.colSpan}
                        overflow={header.column.columnDef.meta?.overflow ?? 'truncate'}
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
                        onDragOver={
                          canReorder
                            ? (event) =>
                                handleColumnDragOver(event, header.column.id)
                            : undefined
                        }
                        onDrop={
                          canReorder
                            ? (event) =>
                                handleColumnDrop(event, header.column.id)
                            : undefined
                        }
                        onDragEnd={canReorder ? endColumnDrag : undefined}
                        className={cn(
                          canResize && 'relative',
                          header.column.id === firstDataColumnId && 'ps-0',
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
                            'cursor-grab select-none active:cursor-grabbing',
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
                            // Capturing the pointer keeps this handle the hit
                            // target (and so its own resize cursor in effect) for
                            // the whole drag, even once the pointer leaves the
                            // 4px hit area. Unlike a document-level cursor
                            // override, this works inside a Shadow DOM host.
                            // Capture releases on pointerup/pointercancel.
                            onPointerDown={(event) => {
                              event.currentTarget.setPointerCapture(
                                event.pointerId
                              );
                              event.currentTarget
                                .closest('th')
                                ?.setAttribute('data-resizing', '');
                            }}
                            onPointerUp={(event) => {
                              event.currentTarget
                                .closest('th')
                                ?.removeAttribute('data-resizing');
                            }}
                            onPointerCancel={(event) => {
                              event.currentTarget
                                .closest('th')
                                ?.removeAttribute('data-resizing');
                            }}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            onKeyDown={(event) =>
                              handleResizeKeyDown(event, header)
                            }
                            className={cn(
                              'absolute end-0 top-0 h-full w-1 cursor-(--ui-resizable-cursor) touch-none select-none bg-[var(--ui-table-global-row-border-color)] opacity-0 transition-[opacity,background-color] hover:bg-[var(--ui-resizable-border-color-hover)] hover:opacity-100 focus-visible:bg-[var(--ui-resizable-border-color-hover)] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--ui-focus-primary)]',
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
                              <span className="font-semibold">
                                {hint.label}:
                              </span>{' '}
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
                {table.getVisibleLeafColumns().map((column) => {
                  const isPinned = column.getIsPinned();
                  return (
                    <TableCell
                      key={column.id}
                      overflow={column.columnDef.meta?.overflow ?? 'truncate'}
                      style={{
                        ...getPinnedStyle(column),
                        ...getColumnSizeStyle(column, resizingEnabled),
                      }}
                      className={cn(
                        isPinned && 'bg-background',
                        column.id === firstDataColumnId && 'ps-0'
                      )}
                    >
                      {renderSkeletonCell ? (
                        renderSkeletonCell({ column, rowIndex })
                      ) : (
                        /* my-1 fills the 24px line box so the row stays 40px —
                           cells have no fixed height, a bare h-4 block gives 32px. */
                        <Skeleton className="my-1 h-4 w-full" />
                      )}
                    </TableCell>
                  );
                })}
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
              // While a selection is in play the action cell renders nothing and
              // carries no tint of its own, so suppressing the row's hover tint
              // for it would leave the pointer over a row that reacts to
              // nothing. Also covers a row hovered just before the selection
              // started, whose id is still in `actionHoveredRowId`.
              const isActionCellHovered =
                !bulkSelectionActive && actionHoveredRowId === row.id;
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
              // When the action cell is hovered, `group-hover:` is stripped so
              // pinned cells don't show hover while the rest of the row is
              // suppressed via `hover:bg-transparent` on the <tr>.
              const rowBg =
                isSelected || isCurrent
                  ? 'bg-[var(--ui-table-data-row-color-active)]'
                  : striped && rowIndex % 2 === 1
                    ? 'bg-[var(--ui-background-surface-secondary)]'
                    : isActionCellHovered
                      ? 'bg-background'
                      : 'bg-background group-hover:bg-[var(--ui-table-data-row-color-hover)]';
              return (
                <Fragment key={row.id}>
                  <TableRow
                    ref={(node) => {
                      rowRefs.current[rowIndex] = node;
                    }}
                    tabIndex={rowIndex === activeRowIndex ? 0 : -1}
                    onFocus={() => handleRowFocus(rowIndex)}
                    onKeyDown={(event) =>
                      handleRowKeyDown(event, row, rowIndex)
                    }
                    selected={isSelected}
                    onClick={
                      highlightCurrentRow || onRowClick
                        ? (event) => {
                            if (highlightCurrentRow) setCurrentRowId(row.id);
                            if (
                              onRowClick &&
                              !isFromInteractiveDescendant(event)
                            ) {
                              onRowClick(row, event);
                            }
                          }
                        : undefined
                    }
                    onDoubleClick={
                      onRowActivate
                        ? (event) => {
                            if (
                              !isFromInteractiveDescendant(event, {
                                checkSelection: false,
                              })
                            ) {
                              onRowActivate(row, { via: 'pointer', event });
                            }
                          }
                        : undefined
                    }
                    className={cn(
                      'group',
                      (highlightCurrentRow || !!onRowClick) && 'cursor-pointer',
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
                                    <ButtonIcon aria-label={rowActionsLabel} className="w-auto" />
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
                          overflow={cell.column.columnDef.meta?.overflow ?? 'truncate'}
                          style={getCellStyle(cell, resizingEnabled)}
                          className={cn(isPinned && rowBg, cell.column.id === firstDataColumnId && 'ps-0')}
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
              className="border-0 hover:bg-transparent"
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
            isLoadingMore &&
            Array.from({ length: loadingMoreRows }).map((_, rowIndex) => (
              <TableRow
                key={`loading-more-${rowIndex}`}
                className="hover:bg-transparent"
                role="status"
                aria-live="polite"
              >
                {table.getVisibleLeafColumns().map((column) => {
                  const isPinned = column.getIsPinned();
                  return (
                    <TableCell
                      key={column.id}
                      overflow={column.columnDef.meta?.overflow ?? 'truncate'}
                      style={{
                        ...getPinnedStyle(column),
                        ...getColumnSizeStyle(column, resizingEnabled),
                      }}
                      className={cn(
                        isPinned && 'bg-background',
                        column.id === firstDataColumnId && 'ps-0'
                      )}
                    >
                      {renderSkeletonCell ? (
                        renderSkeletonCell({ column, rowIndex })
                      ) : (
                        <Skeleton className="my-1 h-4 w-full" />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
