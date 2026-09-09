import * as React from 'react';
import type { Column } from '@tanstack/react-table';
import {
  ArrowDownIcon,
  ArrowsDownUpIcon,
  ArrowUpIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  column: Column<TData, TValue>;
  title: string;
  /**
   * Builds the accessible label of the sort toggle from the column title.
   * Override to localize.
   */
  sortLabel?: (title: string) => string;
}

// Single-click sortable column header — matches the Table primitive's sortable
// `TableHead`: one click toggles the sort (ascending → descending → unsorted) via
// TanStack's `column.toggleSorting()`. The trailing icon shows the state with the
// same `--ui-table-header-sort-icon-*` tokens — an up arrow (ascending) or down
// arrow (descending) in the active blue, or the muted up/down arrows when
// unsorted. (Column hiding lives behind the settings column's cog trigger —
// `DataTableViewOptions` inside a `TableSettingsCell` — not a per-header menu,
// so sorting is a single click.)
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  sortLabel = (t) => `Sort by ${t}`,
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
      aria-label={sortLabel(title)}
      className={cn(
        // -ms-2 px-2 keeps the label flush at the cell padding while giving the
        // toggle a comfortable click target; the hover/press tint lives on the
        // `<th>` itself (see data-table.tsx), not this inner button, and uses
        // the kit-wide 3px focus ring (Figma stroke/width-3 + radius/radius-4).
        '-ms-2 inline-flex h-8 cursor-pointer select-none items-center gap-[var(--ui-table-header-gap)] rounded-sm px-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] [&_svg]:size-[var(--ui-table-header-sort-icon-size)] [&_svg]:shrink-0',
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
