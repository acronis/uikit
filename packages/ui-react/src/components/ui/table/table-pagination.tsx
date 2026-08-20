import * as React from 'react';
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

import { ButtonIcon } from '../button-icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

export interface TablePaginationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Zero-based index of the current page. */
  pageIndex: number;
  /** Total number of pages. */
  pageCount: number;
  /** Number of rows shown per page. */
  pageSize: number;
  /** Page-size options offered in the rows-per-page select. */
  pageSizeOptions?: number[];
  /** Total number of rows across all pages (drives the summary text). */
  totalRows?: number;
  /** Number of currently selected rows (drives the selection summary text). */
  selectedRows?: number;
  /** Invoked with the next zero-based page index. */
  onPageIndexChange: (pageIndex: number) => void;
  /** Invoked with the next page size. */
  onPageSizeChange: (pageSize: number) => void;
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
  /**
   * Builds the page indicator. Receives the 1-based page number and the total
   * page count; `pageCount === 0` means there are no pages.
   */
  pageLabel?: (page: number, pageCount: number) => string;
  /**
   * Builds the leading row summary. Receives the selected-row count (or
   * `undefined` when selection isn't tracked) and the total row count. Return
   * `null` for no summary.
   */
  summaryLabel?: (
    selectedRows: number | undefined,
    totalRows: number
  ) => string | null;
}

// TanStack-independent twin of `DataTablePagination` — same visual design
// (first/prev/next/last + rows-per-page select + page-count text, no numbered
// button window) driven by plain props so it can pair with the `Table`
// primitives without pulling in `@tanstack/react-table`.
const TablePagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(
  (
    {
      className,
      pageIndex,
      pageCount,
      pageSize,
      pageSizeOptions = [10, 20, 30, 40, 50],
      totalRows,
      selectedRows,
      onPageIndexChange,
      onPageSizeChange,
      rowsPerPageLabel = 'Rows per page',
      firstPageLabel = 'Go to first page',
      previousPageLabel = 'Go to previous page',
      nextPageLabel = 'Go to next page',
      lastPageLabel = 'Go to last page',
      pageLabel = (page, count) =>
        count === 0 ? 'No pages' : `Page ${page} of ${count}`,
      summaryLabel = (selected, total) =>
        selected != null
          ? `${selected} of ${total} row(s) selected.`
          : `${total} row(s).`,
      ...props
    },
    ref
  ) => {
    const canPrevious = pageIndex > 0;
    const canNext = pageIndex < pageCount - 1;

    const summary =
      totalRows != null ? summaryLabel(selectedRows, totalRows) : null;

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between px-2', className)}
        {...props}
      >
        <div className="flex-1 text-sm text-muted-foreground">{summary}</div>
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{rowsPerPageLabel}</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger aria-label={rowsPerPageLabel} className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={`${option}`}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            {pageLabel(pageIndex + 1, pageCount)}
          </div>
          <div className="flex items-center gap-2">
            <ButtonIcon
              variant="secondary"
              aria-label={firstPageLabel}
              className="hidden lg:inline-flex"
              onClick={() => onPageIndexChange(0)}
              disabled={!canPrevious}
            >
              <ChevronFirstIcon />
            </ButtonIcon>
            <ButtonIcon
              variant="secondary"
              aria-label={previousPageLabel}
              onClick={() => onPageIndexChange(pageIndex - 1)}
              disabled={!canPrevious}
            >
              <ChevronLeftIcon />
            </ButtonIcon>
            <ButtonIcon
              variant="secondary"
              aria-label={nextPageLabel}
              onClick={() => onPageIndexChange(pageIndex + 1)}
              disabled={!canNext}
            >
              <ChevronRightIcon />
            </ButtonIcon>
            <ButtonIcon
              variant="secondary"
              aria-label={lastPageLabel}
              className="hidden lg:inline-flex"
              onClick={() => onPageIndexChange(pageCount - 1)}
              disabled={!canNext}
            >
              <ChevronLastIcon />
            </ButtonIcon>
          </div>
        </div>
      </div>
    );
  }
);
TablePagination.displayName = 'TablePagination';

export { TablePagination };
