import * as React from 'react';
import type { Row } from '@tanstack/react-table';
import { ChevronDownIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

interface DataTableExpandTriggerProps<TData>
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The row this trigger toggles. */
  row: Row<TData>;
}

// A chevron toggle button wired to a row's expansion state, meant to live inside
// a column's `cell` render function so the expand affordance sits in a real
// column (like the Vue2 `type="expand"` column) instead of requiring a
// whole-row click. Reads the row's own `getCanExpand`/`getIsExpanded` and calls
// `toggleExpanded()` — the underlying expand state model is unchanged. Renders
// nothing when the row can't expand.
function DataTableExpandTriggerImpl<TData>(
  { row, className, ...props }: DataTableExpandTriggerProps<TData>,
  ref: React.Ref<HTMLButtonElement>
) {
  if (!row.getCanExpand()) return null;

  const expanded = row.getIsExpanded();

  return (
    <button
      ref={ref}
      type="button"
      onClick={row.getToggleExpandedHandler()}
      aria-label={expanded ? 'Collapse row' : 'Expand row'}
      aria-expanded={expanded}
      className={cn(
        'inline-flex size-6 cursor-pointer items-center justify-center rounded text-[var(--ui-table-data-value-color-idle)] transition-colors hover:bg-[var(--ui-table-header-cell-color-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] [&_svg]:size-4 [&_svg]:shrink-0',
        className
      )}
      {...props}
    >
      <ChevronDownIcon
        className={cn(
          'transition-transform',
          !expanded && 'ltr:-rotate-90 rtl:rotate-90'
        )}
      />
    </button>
  );
}

// `forwardRef` erases the generic; re-cast so callers keep `DataTableExpandTrigger<TData>`.
export const DataTableExpandTrigger = React.forwardRef(
  DataTableExpandTriggerImpl
) as <TData>(
  props: DataTableExpandTriggerProps<TData> & {
    ref?: React.Ref<HTMLButtonElement>;
  }
) => React.ReactElement | null;
