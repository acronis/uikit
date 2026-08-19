import * as React from 'react';
import type { Row } from '@tanstack/react-table';
import { ChevronDownIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

interface DataTableExpandTriggerProps<TData>
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The row this trigger toggles. */
  row: Row<TData>;
  /** Accessible name while the row is expanded. Override to localize. */
  collapseLabel?: string;
  /** Accessible name while the row is collapsed. Override to localize. */
  expandLabel?: string;
}

// A chevron toggle button wired to a row's expansion state, meant to live inside
// a column's `cell` render function so the expand affordance sits in a real
// column (like the Vue2 `type="expand"` column) instead of requiring a
// whole-row click. Reads the row's own `getCanExpand`/`getIsExpanded` and calls
// `toggleExpanded()` — the underlying expand state model is unchanged. Renders
// nothing when the row can't expand.
function DataTableExpandTriggerImpl<TData>(
  {
    row,
    collapseLabel = 'Collapse row',
    expandLabel = 'Expand row',
    className,
    ...props
  }: DataTableExpandTriggerProps<TData>,
  ref: React.Ref<HTMLButtonElement>
) {
  if (!row.getCanExpand()) return null;

  const expanded = row.getIsExpanded();

  return (
    <button
      ref={ref}
      type="button"
      onClick={row.getToggleExpandedHandler()}
      aria-label={expanded ? collapseLabel : expandLabel}
      aria-expanded={expanded}
      className={cn(
        // Lives in a data cell, so it tints from the data-cell tokens; the focus
        // ring matches the kit-wide 3px treatment (Figma stroke/width-3).
        'inline-flex size-6 cursor-pointer items-center justify-center rounded-sm text-[var(--ui-table-data-value-color-idle)] transition-colors hover:bg-[var(--ui-table-data-cell-color-hover)] active:bg-[var(--ui-table-data-cell-color-active)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] [&_svg]:size-4 [&_svg]:shrink-0',
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
