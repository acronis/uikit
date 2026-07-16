import * as React from 'react';

export interface TablePaginationState {
  /** Zero-based page index. */
  pageIndex: number;
  /** Rows per page. */
  pageSize: number;
}

export interface TableSortingState {
  /** Column id. */
  id: string;
  /** `true` for descending. */
  desc: boolean;
}

export interface TableColumnFilterState {
  /** Column id. */
  id: string;
  /** Filter value (string-encoded in the URL). */
  value: string;
}

/**
 * Controlled table state. The three fields mirror TanStack's `PaginationState`,
 * `SortingState`, and `ColumnFiltersState` shapes (filter value narrowed to
 * `string`) so they can wire straight into `onPaginationChange` /
 * `onSortingChange` / `onColumnFiltersChange`.
 */
export interface TableUrlState {
  pagination: TablePaginationState;
  sorting: TableSortingState[];
  columnFilters: TableColumnFilterState[];
}

/** Query-string keys. Namespaced (`tbl_*`) to avoid collisions with Storybook's
 * own `path`/`args`/`globals` params on a shared preview-iframe URL. */
export interface TableUrlParamKeys {
  page: string;
  size: string;
  sort: string;
  filter: string;
}

export const DEFAULT_TABLE_URL_PARAM_KEYS: TableUrlParamKeys = {
  page: 'tbl_page',
  size: 'tbl_size',
  sort: 'tbl_sort',
  filter: 'tbl_filter',
};

export interface UseTableUrlStateOptions {
  /** Default page size; omitted from the URL when the size matches it. */
  defaultPageSize?: number;
  /** Override the namespaced query-string keys. */
  paramKeys?: Partial<TableUrlParamKeys>;
}

export type TableUrlUpdater<T> = T | ((old: T) => T);

export interface UseTableUrlStateResult {
  state: TableUrlState;
  /** Accepts a value or updater — shaped for TanStack's `onPaginationChange`. */
  setPagination: (updater: TableUrlUpdater<TablePaginationState>) => void;
  /** Accepts a value or updater — shaped for TanStack's `onSortingChange`. */
  setSorting: (updater: TableUrlUpdater<TableSortingState[]>) => void;
  /** Accepts a value or updater — shaped for TanStack's `onColumnFiltersChange`. */
  setColumnFilters: (
    updater: TableUrlUpdater<TableColumnFilterState[]>
  ) => void;
}

function applyUpdater<T>(updater: TableUrlUpdater<T>, old: T): T {
  return typeof updater === 'function'
    ? (updater as (old: T) => T)(old)
    : updater;
}

/**
 * Parses table state out of a query string. Pure — safe to reuse for seeding a
 * story or an SSR default. `search` may include or omit the leading `?`.
 *
 * Encoding: `tbl_page` is 1-based; `tbl_sort` is `id:asc|desc` pairs joined by
 * `,`; `tbl_filter` is `id:<encoded-value>` pairs joined by `,` (the value is
 * `encodeURIComponent`-escaped so it may contain `:`/`,`). Column ids must not
 * contain `:` or `,`.
 */
export function parseTableUrlState(
  search: string,
  {
    defaultPageSize = 10,
    paramKeys,
  }: { defaultPageSize?: number; paramKeys?: TableUrlParamKeys } = {}
): TableUrlState {
  const keys = paramKeys ?? DEFAULT_TABLE_URL_PARAM_KEYS;
  const params = new URLSearchParams(search);

  const rawPage = Number(params.get(keys.page));
  const pageIndex =
    Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) - 1 : 0;

  const rawSize = Number(params.get(keys.size));
  const pageSize =
    Number.isFinite(rawSize) && rawSize >= 1 ? Math.floor(rawSize) : defaultPageSize;

  const sortParam = params.get(keys.sort);
  const sortingById = new Map<string, TableSortingState>();
  if (sortParam) {
    for (const pair of sortParam.split(',')) {
      const separator = pair.indexOf(':');
      if (separator === -1) continue;
      const id = pair.slice(0, separator);
      const dir = pair.slice(separator + 1);
      if (!id || (dir !== 'asc' && dir !== 'desc')) continue;
      // Last occurrence wins on a duplicate id — matches URLSearchParams'
      // own semantics for a repeated key.
      sortingById.set(id, { id, desc: dir === 'desc' });
    }
  }
  const sorting: TableSortingState[] = Array.from(sortingById.values());

  const filterParam = params.get(keys.filter);
  const columnFilters: TableColumnFilterState[] = filterParam
    ? filterParam
        .split(',')
        .map((pair) => {
          const separator = pair.indexOf(':');
          if (separator === -1) return null;
          const id = pair.slice(0, separator);
          if (!id) return null;
          try {
            return { id, value: decodeURIComponent(pair.slice(separator + 1)) };
          } catch {
            return null;
          }
        })
        .filter((entry): entry is TableColumnFilterState => entry !== null)
    : [];

  return { pagination: { pageIndex, pageSize }, sorting, columnFilters };
}

/**
 * Serializes table state onto a query string, preserving any foreign params
 * already present in `search` (e.g. Storybook's `path`/`args`/`globals`).
 * Returns the query string without a leading `?` (empty string when no params).
 */
export function serializeTableUrlState(
  state: TableUrlState,
  search: string,
  {
    defaultPageSize = 10,
    paramKeys,
  }: { defaultPageSize?: number; paramKeys?: TableUrlParamKeys } = {}
): string {
  const keys = paramKeys ?? DEFAULT_TABLE_URL_PARAM_KEYS;
  const params = new URLSearchParams(search);

  // Clear our namespaced keys before rewriting so a cleared field drops out.
  for (const key of Object.values(keys)) params.delete(key);

  if (state.pagination.pageIndex > 0) {
    params.set(keys.page, String(state.pagination.pageIndex + 1));
  }
  if (state.pagination.pageSize !== defaultPageSize) {
    params.set(keys.size, String(state.pagination.pageSize));
  }
  if (state.sorting.length > 0) {
    params.set(
      keys.sort,
      state.sorting
        .map((entry) => `${entry.id}:${entry.desc ? 'desc' : 'asc'}`)
        .join(',')
    );
  }
  if (state.columnFilters.length > 0) {
    params.set(
      keys.filter,
      state.columnFilters
        .map((entry) => `${entry.id}:${encodeURIComponent(entry.value)}`)
        .join(',')
    );
  }

  return params.toString();
}

function readCurrentState(
  defaultPageSize: number,
  paramKeys: TableUrlParamKeys
): TableUrlState {
  const search = typeof window !== 'undefined' ? window.location.search : '';
  return parseTableUrlState(search, { defaultPageSize, paramKeys });
}

/**
 * Router-agnostic hook that syncs controlled table state (pagination / sorting
 * / column filters) to and from the URL query string via `history.pushState` +
 * `popstate`. Depends only on `window.location` / `window.history`, so it works
 * with any router (or none). Query keys are namespaced (`tbl_*`) so they never
 * collide with other params on the same URL. Reads initial state from the URL,
 * so a bookmarked link restores the table's view.
 */
export function useTableUrlState(
  options: UseTableUrlStateOptions = {}
): UseTableUrlStateResult {
  const { defaultPageSize = 10 } = options;
  const paramKeys = React.useMemo<TableUrlParamKeys>(
    () => ({ ...DEFAULT_TABLE_URL_PARAM_KEYS, ...options.paramKeys }),
    [options.paramKeys]
  );

  const [state, setState] = React.useState<TableUrlState>(() =>
    readCurrentState(defaultPageSize, paramKeys)
  );

  // Keep a ref of the latest state so `popstate` and the setters can compute
  // the next URL/state without re-subscribing on every change.
  const stateRef = React.useRef(state);
  stateRef.current = state;

  // Coalesce multiple setters called synchronously in the same handler (e.g. a
  // filter change that also resets the page) into a single history entry: the
  // first commit in a tick pushes, later ones in the same tick replace. The
  // flag clears on a microtask so the next distinct user action pushes again.
  const hasPushedThisTickRef = React.useRef(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = () => {
      setState(readCurrentState(defaultPageSize, paramKeys));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [defaultPageSize, paramKeys]);

  const commit = React.useCallback(
    (next: TableUrlState) => {
      // Refresh the ref here, not just in the render body — two setters
      // called synchronously in the same handler (before React re-renders)
      // must see each other's updates, not the pre-batch snapshot.
      stateRef.current = next;
      setState(next);
      if (typeof window === 'undefined') return;
      const query = serializeTableUrlState(next, window.location.search, {
        defaultPageSize,
        paramKeys,
      });
      const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
      if (hasPushedThisTickRef.current) {
        window.history.replaceState(null, '', url);
      } else {
        window.history.pushState(null, '', url);
        hasPushedThisTickRef.current = true;
        queueMicrotask(() => {
          hasPushedThisTickRef.current = false;
        });
      }
    },
    [defaultPageSize, paramKeys]
  );

  const setPagination = React.useCallback(
    (updater: TableUrlUpdater<TablePaginationState>) => {
      commit({
        ...stateRef.current,
        pagination: applyUpdater(updater, stateRef.current.pagination),
      });
    },
    [commit]
  );

  const setSorting = React.useCallback(
    (updater: TableUrlUpdater<TableSortingState[]>) => {
      commit({
        ...stateRef.current,
        sorting: applyUpdater(updater, stateRef.current.sorting),
      });
    },
    [commit]
  );

  const setColumnFilters = React.useCallback(
    (updater: TableUrlUpdater<TableColumnFilterState[]>) => {
      commit({
        ...stateRef.current,
        columnFilters: applyUpdater(updater, stateRef.current.columnFilters),
      });
    },
    [commit]
  );

  return { state, setPagination, setSorting, setColumnFilters };
}
