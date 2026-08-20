import * as React from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsDownUpIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Composable table primitives, reconciled against the Table design in the
// ui-react Figma (canvas 2948-2416; assembled example 4567-6801, part state
// matrices TableHeaderCell 3427-207 / TableDataCell 4536-97 / TableDataRow
// 4536-699 / TableSettings 3698-497 / TableActions 4536-414 / TableCheckbox
// 3698-746). A `--ui-table-*` token tier already exists, so these parts theme
// directly from it (imported in styles/index.css):
//   • cell     -> --ui-table-global-cell-{padding-x,padding-y,min-height}
//   • row      -> --ui-table-global-row-{border-color,border-width,border-style},
//                 --ui-table-data-row-color-{idle,hover,active}  (active = selected)
//   • head     -> --ui-table-header-{label-color,gap}, --ui-table-header-cell-color-{idle,hover,active}
//   • data     -> --ui-table-data-cell-color-{idle,hover,active}, --ui-table-data-value-color-{idle,disabled}
//   • sort     -> --ui-table-header-sort-icon-{color-active,color-inactive,size}
//   • focus    -> --ui-focus-primary (the kit-wide 3px focus ring, radius/radius-4)
// Per the design, the header/settings/actions cells tint on hover and press at
// the *cell* level (not on an inner control), so the interaction tokens sit on
// the `<th>`/`<td>` and the focus ring is drawn on the cell via `has-[…]`.
//
// The design's cell content (tags, status dots, links) stays consumer
// composition — `--ui-table-global-cell-{tag,icon}-margin-y` and
// --ui-table-data-gap describe that content's own insets, not a part contract,
// so no wrapper part is invented for them here.

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
      'border-t-[length:var(--ui-table-global-row-border-width)] [border-top-style:var(--ui-table-global-row-border-style)] border-[color:var(--ui-table-global-row-border-color)] font-medium [&>tr]:last:border-b-0',
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
        'border-b-[length:var(--ui-table-global-row-border-width)] [border-bottom-style:var(--ui-table-global-row-border-style)] border-[color:var(--ui-table-global-row-border-color)] bg-[var(--ui-table-data-row-color-idle)] transition-colors hover:bg-[var(--ui-table-data-row-color-hover)] data-[state=selected]:bg-[var(--ui-table-data-row-color-active)]',
        // The design documents a keyboard-nav focus state on the row itself
        // (a ring spanning the full row). Rows aren't focusable by default, so
        // this only paints once a consumer makes them focusable (`tabIndex`).
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--ui-focus-primary)]',
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
  /**
   * Allow the header to wrap onto multiple lines (`whitespace-normal`) and drop
   * the fixed row height so the cell grows to fit its content.
   */
  wrap?: boolean;
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
  (
    {
      className,
      children,
      sortable,
      sortDirection = false,
      onSort,
      wrap,
      ...props
    },
    ref
  ) => (
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
        'px-[var(--ui-table-global-cell-padding-x)] py-[var(--ui-table-global-cell-padding-y)] text-start align-middle text-sm font-semibold leading-6 text-[var(--ui-table-header-label-color)] bg-[var(--ui-table-header-cell-color-idle)] [&:has([role=checkbox])]:pe-0',
        wrap
          ? 'whitespace-normal'
          : 'h-[var(--ui-table-global-cell-min-height)]',
        // Per the design, a sortable header tints the whole cell on hover/press
        // and draws the focus ring on the cell, not on the inner control.
        sortable &&
          'cursor-pointer rounded-sm transition-colors hover:bg-[var(--ui-table-header-cell-color-hover)] active:bg-[var(--ui-table-header-cell-color-active)] has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-[var(--ui-focus-primary)]',
        className
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className="flex w-full cursor-pointer items-center gap-[var(--ui-table-header-gap)] text-start outline-none"
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

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /**
   * Allow the cell to wrap onto multiple lines (`whitespace-normal`) and drop
   * the fixed row height so the row grows to fit its content.
   */
  wrap?: boolean;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, wrap, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'px-[var(--ui-table-global-cell-padding-x)] py-[var(--ui-table-global-cell-padding-y)] align-middle text-sm leading-6 bg-[var(--ui-table-data-cell-color-idle)] [&:has([role=checkbox])]:pe-0',
        wrap
          ? 'whitespace-normal'
          : 'h-[var(--ui-table-global-cell-min-height)]',
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

export interface TableSelectCellProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /**
   * Render the select-all cell of the header row (`<th>`) instead of a row's
   * selection cell (`<td>`).
   */
  header?: boolean;
}

/**
 * The row-selection cell (design part `TableCheckbox`) — a fixed 32px column
 * holding a label-less `Checkbox`. Only the leading padding is applied, matching
 * the design (16px padding + a 16px box), so the checkbox sits flush against the
 * first data cell.
 */
const TableSelectCell = React.forwardRef<
  HTMLTableCellElement,
  TableSelectCellProps
>(({ className, header, ...props }, ref) => {
  const Comp = header ? 'th' : 'td';
  return (
    <Comp
      ref={ref}
      className={cn(
        'w-8 h-[var(--ui-table-global-cell-min-height)] ps-[var(--ui-table-global-cell-padding-x)] py-[var(--ui-table-global-cell-padding-y)] align-middle',
        header
          ? 'bg-[var(--ui-table-header-cell-color-idle)]'
          : 'bg-[var(--ui-table-data-cell-color-idle)]',
        className
      )}
      {...props}
    />
  );
});
TableSelectCell.displayName = 'TableSelectCell';

export interface TableActionsCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /**
   * Suppress this row's actions because a selection is in play — the cell
   * still reserves its 48px column (so the grid doesn't reflow) but renders no
   * children and no hover/press tint. Per the design, that means any row is
   * selected, including exactly one. Pass `isBulkSelectionActive(table)` (from
   * the data-table part) rather than re-deriving the threshold.
   */
  bulkSelectionActive?: boolean;
}

/**
 * The trailing row-actions cell (design part `TableActions`) — a fixed 48px
 * column, end-aligned, holding the consumer's overflow trigger (e.g. a
 * `ButtonIcon` with `EllipsisIcon` opening a `DropdownMenu`). The cell itself
 * carries the hover/press tint and the focus ring, per the design.
 */
const TableActionsCell = React.forwardRef<
  HTMLTableCellElement,
  TableActionsCellProps
>(({ className, bulkSelectionActive, children, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'w-12 h-[var(--ui-table-global-cell-min-height)] px-[var(--ui-table-global-cell-padding-x)] text-end align-middle bg-[var(--ui-table-data-cell-color-idle)]',
      !bulkSelectionActive &&
        'rounded-sm transition-colors hover:bg-[var(--ui-table-data-cell-color-hover)] active:bg-[var(--ui-table-data-cell-color-active)] has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-[var(--ui-focus-primary)]',
      className
    )}
    {...props}
  >
    {bulkSelectionActive ? null : children}
  </td>
));
TableActionsCell.displayName = 'TableActionsCell';

/**
 * The trailing header cell holding the column-settings trigger (design part
 * `TableSettings`) — a fixed 48px column, end-aligned, holding the consumer's
 * gear trigger (e.g. a `ButtonIcon` with `CogIcon`). Visual states only; what
 * the trigger opens (a column-visibility menu) is the consumer's choice —
 * `TableViewOptions` is the ready-made one.
 */
const TableSettingsCell = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'w-12 h-[var(--ui-table-global-cell-min-height)] px-[var(--ui-table-global-cell-padding-x)] text-end align-middle rounded-sm transition-colors bg-[var(--ui-table-header-cell-color-idle)] hover:bg-[var(--ui-table-header-cell-color-hover)] active:bg-[var(--ui-table-header-cell-color-active)] has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-[var(--ui-focus-primary)]',
      className
    )}
    {...props}
  />
));
TableSettingsCell.displayName = 'TableSettingsCell';

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
  TableSelectCell,
  TableActionsCell,
  TableSettingsCell,
  TableCaption,
};
