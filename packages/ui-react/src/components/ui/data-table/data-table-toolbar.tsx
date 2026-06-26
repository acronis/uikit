import type { Table } from '@tanstack/react-table';
import { TimesIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Button } from '../button';
import { InputText } from '../input-text';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  /** Column id to wire the search box to (client-side text filter). */
  searchKey?: string;
  searchPlaceholder?: string;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = 'Filter…',
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        {searchKey && (
          <InputText
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 gap-2"
          >
            Reset
            <TimesIcon />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
