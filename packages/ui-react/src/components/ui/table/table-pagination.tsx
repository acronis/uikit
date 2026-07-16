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
      ...props
    },
    ref
  ) => {
    const canPrevious = pageIndex > 0;
    const canNext = pageIndex < pageCount - 1;

    const summary =
      selectedRows != null && totalRows != null
        ? `${selectedRows} of ${totalRows} row(s) selected.`
        : totalRows != null
          ? `${totalRows} row(s).`
          : null;

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between px-2', className)}
        {...props}
      >
        <div className="flex-1 text-sm text-muted-foreground">{summary}</div>
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger aria-label="Rows per page" className="h-8 w-[70px]">
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
            {pageCount === 0 ? 'No pages' : `Page ${pageIndex + 1} of ${pageCount}`}
          </div>
          <div className="flex items-center gap-2">
            <ButtonIcon
              variant="secondary"
              aria-label="Go to first page"
              className="hidden lg:inline-flex"
              onClick={() => onPageIndexChange(0)}
              disabled={!canPrevious}
            >
              <ChevronFirstIcon />
            </ButtonIcon>
            <ButtonIcon
              variant="secondary"
              aria-label="Go to previous page"
              onClick={() => onPageIndexChange(pageIndex - 1)}
              disabled={!canPrevious}
            >
              <ChevronLeftIcon />
            </ButtonIcon>
            <ButtonIcon
              variant="secondary"
              aria-label="Go to next page"
              onClick={() => onPageIndexChange(pageIndex + 1)}
              disabled={!canNext}
            >
              <ChevronRightIcon />
            </ButtonIcon>
            <ButtonIcon
              variant="secondary"
              aria-label="Go to last page"
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
