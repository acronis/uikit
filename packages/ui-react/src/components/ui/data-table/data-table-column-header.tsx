import * as React from 'react';
import type { Column } from '@tanstack/react-table';
import {
  ArrowDownIcon,
  ArrowsDownUpIcon,
  ArrowUpIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  column: Column<TData, TValue>;
  title: string;
}

// Single-click sortable column header — matches the Table primitive's sortable
// `TableHead`: one click toggles the sort (ascending → descending → unsorted) via
// TanStack's `column.toggleSorting()`. The trailing icon shows the state with the
// same `--ui-table-header-sort-icon-*` tokens — an up arrow (ascending) or down
// arrow (descending) in the active blue, or the muted up/down arrows when
// unsorted. (Column hiding lives in the toolbar's `DataTableViewOptions`, not a
// per-header menu, so sorting is a single click.)
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting()}
      aria-label={`Sort by ${title}`}
      className={cn(
        // -ms-2 px-2 keeps the label flush at the cell padding while giving the
        // toggle a comfortable click/hover target.
        '-ms-2 inline-flex h-8 cursor-pointer select-none items-center gap-2 rounded px-2 text-sm font-semibold transition-colors hover:bg-[var(--ui-table-header-cell-color-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] [&_svg]:size-[var(--ui-table-header-sort-icon-size)] [&_svg]:shrink-0',
        className
      )}
      {...props}
    >
      <span>{title}</span>
      {sorted === 'asc' ? (
        <ArrowUpIcon className="text-[var(--ui-table-header-sort-icon-color-active)]" />
      ) : sorted === 'desc' ? (
        <ArrowDownIcon className="text-[var(--ui-table-header-sort-icon-color-active)]" />
      ) : (
        <ArrowsDownUpIcon className="text-[var(--ui-table-header-sort-icon-color-inactive)]" />
      )}
    </button>
  );
}
