import * as React from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsDownUpIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Composable table primitives ported from `@acronis-platform/shadcn-uikit`'s
// `table` (packages/ui-legacy/src/components/ui/table.tsx) and informed by the
// "pre-release" Table design in the shadcn-uikit Figma (node 2948-2416). Unlike
// Card/Dialog, a `--ui-table-*` token tier already exists, so these parts theme
// directly from it (imported in styles/index.css):
//   • cell   -> --ui-table-global-cell-{border-color,padding-x,padding-y,min-height}
//   • row    -> --ui-table-global-row-color-{idle,hover,active}  (active = selected)
//   • header -> --ui-table-header-{label-color,cell-color-hover,cell-padding-x,gap}
//   • sort   -> --ui-table-header-sort-icon-{color-active,color-inactive,size}
//   • data   -> --ui-table-data-value-color-{idle,disabled}
// The design's row checkboxes, tags, links and the column-settings button are
// consumer composition (use Checkbox / Tag / Link / ButtonIcon in cells). A
// TanStack-backed `DataTable` (sorting/selection logic over these primitives) is
// a planned follow-up, mirroring legacy's separate `data-table`. Reconcile with
// `/figma-component Table <url> --update` once the design is ready for dev.

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(
        'w-full caption-bottom border-collapse text-sm text-[var(--ui-table-data-value-color-idle)]',
        className
      )}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn(className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t border-[color:var(--ui-table-global-cell-border-color)] font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Mark the row as selected — applies the active row token + `data-state`. */
  selected?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, ...props }, ref) => (
    <tr
      ref={ref}
      data-state={selected ? 'selected' : undefined}
      className={cn(
        'border-b border-[color:var(--ui-table-global-cell-border-color)] bg-[var(--ui-table-global-row-color-idle)] transition-colors hover:bg-[var(--ui-table-global-row-color-hover)] data-[state=selected]:bg-[var(--ui-table-global-row-color-active)]',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

type SortDirection = 'asc' | 'desc' | false;

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Render the column as sortable — adds a sort affordance and `aria-sort`. */
  sortable?: boolean;
  /** Current sort direction for this column (`false` = sortable but unsorted). */
  sortDirection?: SortDirection;
  /** Invoked when the user activates a sortable header (click / Enter / Space). */
  onSort?: () => void;
}

function SortIcon({ direction }: { direction: SortDirection }) {
  const size = 'size-[var(--ui-table-header-sort-icon-size)]';
  if (direction === 'asc') {
    return <ArrowUpIcon className={cn(size, 'text-[var(--ui-table-header-sort-icon-color-active)]')} />;
  }
  if (direction === 'desc') {
    return <ArrowDownIcon className={cn(size, 'text-[var(--ui-table-header-sort-icon-color-active)]')} />;
  }
  return <ArrowsDownUpIcon className={cn(size, 'text-[var(--ui-table-header-sort-icon-color-inactive)]')} />;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, sortable, sortDirection = false, onSort, ...props }, ref) => (
    <th
      ref={ref}
      aria-sort={
        sortDirection === 'asc'
          ? 'ascending'
          : sortDirection === 'desc'
            ? 'descending'
            : sortable
              ? 'none'
              : undefined
      }
      className={cn(
        'h-10 px-[var(--ui-table-header-cell-padding-x)] text-left align-middle text-sm font-semibold text-[var(--ui-table-header-label-color)] [&:has([role=checkbox])]:pr-0',
        sortable &&
          'cursor-pointer transition-colors hover:bg-[var(--ui-table-header-cell-color-hover)]',
        className
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className="-mx-1 inline-flex items-center gap-[var(--ui-table-header-gap)] rounded-sm px-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)]"
        >
          {children}
          <SortIcon direction={sortDirection} />
        </button>
      ) : (
        children
      )}
    </th>
  )
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'h-10 px-[var(--ui-table-global-cell-padding-x)] py-[var(--ui-table-global-cell-padding-y)] align-middle text-sm [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
