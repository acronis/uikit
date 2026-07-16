import type { ReactNode } from 'react';
import type { ColumnFiltersState, Table } from '@tanstack/react-table';
import { TimesIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Button } from '../button';
import {
  FilterSearch,
  FilterSearchActions,
  FilterSearchAppliedFilters,
  FilterSearchFilters,
} from '../filter-search';
import { InputSearch } from '../input-search';
import { DataTableViewOptions } from './data-table-view-options';

// Convert between TanStack's `ColumnFiltersState` (an array of `{ id, value }`,
// keyed by column id) and `FilterSearchFilters`'s `Record<string, unknown>`
// (keyed by the same column id). The plain text search filter (`searchKey`) is a
// separate concern and is excluded from the per-column filter record.
function filtersToRecord(
  columnFilters: ColumnFiltersState,
  excludeKey?: string
): Record<string, unknown> {
  return Object.fromEntries(
    columnFilters
      .filter((filter) => filter.id !== excludeKey)
      .map((filter) => [filter.id, filter.value])
  );
}

function recordToFilters(
  record: Record<string, unknown>
): ColumnFiltersState {
  return Object.entries(record).map(([id, value]) => ({ id, value }));
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  /**
   * Rendered as the leading element of the toolbar row, before the search
   * box — e.g. a tenant/scope `Select` (matches the Figma "FilterSearch"
   * anatomy, which places a scope switcher ahead of search).
   */
  leading?: ReactNode;
  /** Column id to wire the search box to (client-side text filter). */
  searchKey?: string;
  searchPlaceholder?: string;
  /**
   * Filter field children rendered inside the `FilterSearchFilters` popover.
   * Wire each field to a column via `useFilterSearchFilters()` keyed by column
   * id. When provided, the toolbar renders the filter popover + an applied-filter
   * chip row below it.
   */
  children?: ReactNode;
  /** Label for the filters trigger button. */
  filtersLabel?: ReactNode;
  /** Format an applied-filter chip's label (defaults to `"<id>: <value>"`). */
  getFilterChipLabel?: (key: string, value: unknown) => ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  leading,
  searchKey,
  searchPlaceholder = 'Filter…',
  children,
  filtersLabel = 'Filters',
  getFilterChipLabel,
}: DataTableToolbarProps<TData>) {
  const columnFilters = table.getState().columnFilters;
  const hasFilterFields = Boolean(children);
  const isFiltered = columnFilters.length > 0;

  const filterRecord = filtersToRecord(columnFilters, searchKey);

  // Commit the per-column filter record back to TanStack, preserving the
  // separate text-search filter (`searchKey`) untouched.
  const handleFiltersChange = (next: Record<string, unknown>) => {
    const searchFilter = searchKey
      ? columnFilters.filter((filter) => filter.id === searchKey)
      : [];
    table.setColumnFilters([...searchFilter, ...recordToFilters(next)]);
  };

  return (
    <div className="flex flex-col gap-3">
      <FilterSearch>
        {leading}
        {searchKey && (
          <InputSearch
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="w-56"
          />
        )}
        {hasFilterFields && (
          <FilterSearchFilters
            value={filterRecord}
            onValueChange={handleFiltersChange}
            label={filtersLabel}
          >
            {children}
          </FilterSearchFilters>
        )}
        {!hasFilterFields && isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 gap-2"
          >
            Reset
            <TimesIcon />
          </Button>
        )}
        <FilterSearchActions>
          <DataTableViewOptions table={table} />
        </FilterSearchActions>
      </FilterSearch>
      {hasFilterFields && (
        <FilterSearchAppliedFilters
          filters={filterRecord}
          onValueChange={handleFiltersChange}
          getFilterChipLabel={getFilterChipLabel}
        />
      )}
    </div>
  );
}
