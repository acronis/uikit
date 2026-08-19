import type { Table } from '@tanstack/react-table';
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { ButtonIcon } from '../button-icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  /** Page-size options offered in the rows-per-page select. */
  pageSizeOptions?: number[];
  /** Label of the rows-per-page select (also its accessible name). */
  rowsPerPageLabel?: string;
  /** Accessible name of the first-page control. */
  firstPageLabel?: string;
  /** Accessible name of the previous-page control. */
  previousPageLabel?: string;
  /** Accessible name of the next-page control. */
  nextPageLabel?: string;
  /** Accessible name of the last-page control. */
  lastPageLabel?: string;
  /** Builds the page indicator from the 1-based page number and page count. */
  pageLabel?: (page: number, pageCount: number) => string;
  /** Builds the leading selection summary from the selected and total counts. */
  summaryLabel?: (selectedRows: number, totalRows: number) => string;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  rowsPerPageLabel = 'Rows per page',
  firstPageLabel = 'Go to first page',
  previousPageLabel = 'Go to previous page',
  nextPageLabel = 'Go to next page',
  lastPageLabel = 'Go to last page',
  pageLabel = (page, count) => `Page ${page} of ${count}`,
  summaryLabel = (selected, total) => `${selected} of ${total} row(s) selected.`,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {summaryLabel(
          table.getFilteredSelectedRowModel().rows.length,
          table.getFilteredRowModel().rows.length
        )}
      </div>
      <div className="flex items-center gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{rowsPerPageLabel}</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger aria-label={rowsPerPageLabel} className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {pageLabel(
            table.getState().pagination.pageIndex + 1,
            table.getPageCount()
          )}
        </div>
        <div className="flex items-center gap-2">
          <ButtonIcon
            variant="secondary"
            aria-label={firstPageLabel}
            className="hidden lg:inline-flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronFirstIcon />
          </ButtonIcon>
          <ButtonIcon
            variant="secondary"
            aria-label={previousPageLabel}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
          </ButtonIcon>
          <ButtonIcon
            variant="secondary"
            aria-label={nextPageLabel}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
          </ButtonIcon>
          <ButtonIcon
            variant="secondary"
            aria-label={lastPageLabel}
            className="hidden lg:inline-flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronLastIcon />
          </ButtonIcon>
        </div>
      </div>
    </div>
  );
}
