import * as React from 'react';

export type SortDirection = 'asc' | 'desc' | false;

export interface SortState {
  columnId: string;
  direction: 'asc' | 'desc';
}

/**
 * Compares two rows for a column. Ascending order; the hook negates the result
 * for descending. Receives the full rows so a custom comparator has access to
 * every field.
 */
export type SortComparator<TData> = (a: TData, b: TData) => number;

export interface UseSortStateOptions<TData> {
  /** Rows to sort. */
  data: TData[];
  /** Initial sorted column + direction. */
  initialSort?: SortState | null;
  /**
   * Custom per-column comparators keyed by column id. When absent for a column,
   * the default alphanumeric comparator on `getValue(row, columnId)` is used.
   */
  comparators?: Record<string, SortComparator<TData>>;
  /**
   * How to read a column's value from a row for the default comparator.
   * Defaults to `row[columnId]`.
   */
  getValue?: (row: TData, columnId: string) => unknown;
}

export interface UseSortStateResult<TData> {
  /** The rows sorted by the current sort state (unsorted `data` when none). */
  sortedData: TData[];
  /** The current sort, or `null` when unsorted. */
  sort: SortState | null;
  /** Directly set (or clear) the sort. */
  setSort: (sort: SortState | null) => void;
  /** Cycle a column's sort: none → asc → desc → none. */
  toggleSort: (columnId: string) => void;
  /** Direction for a column, shaped for `TableHead`'s `sortDirection` prop. */
  getSortDirection: (columnId: string) => SortDirection;
}

// Natural alphanumeric comparison: numbers numerically, everything else via a
// locale-aware numeric string compare (so "item2" sorts before "item10").
// null/undefined sort first.
function defaultCompareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

/**
 * Headless client-side sort state for the `Table` primitives (no TanStack
 * dependency). Drives `TableHead`'s `sortable`/`sortDirection`/`onSort` props
 * and returns the sorted rows. Default comparator is alphanumeric; pass
 * `comparators` to override per column.
 */
export function useSortState<TData>({
  data,
  initialSort = null,
  comparators,
  getValue = (row, columnId) => (row as Record<string, unknown>)[columnId],
}: UseSortStateOptions<TData>): UseSortStateResult<TData> {
  const [sort, setSort] = React.useState<SortState | null>(initialSort);

  const toggleSort = React.useCallback((columnId: string) => {
    setSort((current) => {
      if (!current || current.columnId !== columnId) {
        return { columnId, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { columnId, direction: 'desc' };
      }
      return null;
    });
  }, []);

  const getSortDirection = React.useCallback(
    (columnId: string): SortDirection =>
      sort && sort.columnId === columnId ? sort.direction : false,
    [sort]
  );

  const sortedData = React.useMemo(() => {
    if (!sort) return data;
    const custom = comparators?.[sort.columnId];
    const compare: SortComparator<TData> =
      custom ??
      ((a, b) =>
        defaultCompareValues(
          getValue(a, sort.columnId),
          getValue(b, sort.columnId)
        ));
    const factor = sort.direction === 'desc' ? -1 : 1;
    // Slice keeps the input array intact; index tiebreak keeps sort stable.
    return data
      .map((row, index) => ({ row, index }))
      .sort((a, b) => {
        const result = compare(a.row, b.row);
        return result !== 0 ? result * factor : a.index - b.index;
      })
      .map((entry) => entry.row);
  }, [data, sort, comparators, getValue]);

  return { sortedData, sort, setSort, toggleSort, getSortDirection };
}
