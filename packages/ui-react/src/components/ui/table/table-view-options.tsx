import * as React from 'react';
import { CogIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Button } from '../button';
import { ButtonIcon } from '../button-icon';
import { Checkbox } from '../checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { InputSelectSearch } from '../input-select';

export interface TableColumnVisibility {
  /** Stable column identifier. */
  id: string;
  /** Human-readable label shown in the menu. */
  label: string;
  /** Whether the column is currently hidden. */
  hidden: boolean;
  /** Optional section name used to group related columns in the dropdown. */
  category?: string;
}

export interface TableViewOptionsProps {
  /** The toggleable columns and their current visibility. */
  columns: TableColumnVisibility[];
  /** Invoked with the column id whose visibility was toggled. */
  onToggle: (id: string) => void;
  /** Trigger label. Defaults to `View`. Ignored when `iconOnly`. */
  triggerLabel?: React.ReactNode;
  /**
   * Render the trigger as a cog-only icon button instead of a labelled
   * `Button` — the shape that fits the 48px `TableSettingsCell` column.
   */
  iconOnly?: boolean;
  /** Accessible name of the `iconOnly` trigger. Override to localize. */
  triggerAriaLabel?: string;
  /** Placeholder and accessible name of the column filter. */
  searchPlaceholder?: string;
  /** Label of the action that reveals every column in a category. */
  showAllLabel?: React.ReactNode;
  /** Empty state shown when no column matches the search query. */
  noResultsLabel?: React.ReactNode;
}

interface ColumnGroup {
  category?: string;
  columns: TableColumnVisibility[];
}

function groupColumns(columns: TableColumnVisibility[]): ColumnGroup[] {
  const groups = new Map<string | undefined, TableColumnVisibility[]>();

  columns.forEach((column) => {
    const group = groups.get(column.category);
    if (group) {
      group.push(column);
    } else {
      groups.set(column.category, [column]);
    }
  });

  return Array.from(groups, ([category, groupedColumns]) => ({
    category,
    columns: groupedColumns,
  }));
}

// TanStack-independent show/hide-columns dropdown extracted from
// `DataTableViewOptions`'s UI. Driven by a plain `{ id, label, hidden }[]` +
// `onToggle`, so it pairs with the `Table` primitives; `DataTableViewOptions`
// can later become a thin TanStack adapter over this part.
//
// Each row shows a real `Checkbox` box beside the column name, per the design.
// That box is presentation only (`aria-hidden`, not focusable, click-through):
// the accessible control is the `menuitemcheckbox` row itself, which carries
// `aria-checked` and the click handler.
//
// Although this is behaviorally a menu, its visual design is the multiple-value
// InputSelect dropdown: a filter row, optional named sections with per-section
// "show all" actions, and neutral regular-weight checkbox rows. Keep the Base UI
// Menu semantics while reusing that generated token tier for presentation.
function TableViewOptions({
  columns,
  onToggle,
  triggerLabel = 'View',
  iconOnly = false,
  triggerAriaLabel = 'Column settings',
  searchPlaceholder = 'Search columns',
  showAllLabel = 'Show all',
  noResultsLabel = 'No columns found.',
}: TableViewOptionsProps) {
  const [query, setQuery] = React.useState('');
  const groupIdPrefix = React.useId();
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const groups = React.useMemo(
    () =>
      groupColumns(columns)
        .map((group) => ({
          ...group,
          visibleColumns: normalizedQuery
            ? group.columns.filter((column) =>
                column.label.toLocaleLowerCase().includes(normalizedQuery)
              )
            : group.columns,
        }))
        .filter((group) => group.visibleColumns.length > 0),
    [columns, normalizedQuery]
  );

  return (
    <DropdownMenu onOpenChange={(open) => !open && setQuery('')}>
      <DropdownMenuTrigger
        render={
          iconOnly ? (
            <ButtonIcon aria-label={triggerAriaLabel} />
          ) : (
            <Button variant="secondary" className="h-8 shrink-0 gap-2" />
          )
        }
      >
        <CogIcon />
        {!iconOnly && triggerLabel}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[var(--available-height)] w-[300px] gap-0 rounded-[var(--ui-input-select-dropdown-container-border-radius)] border-[length:var(--ui-input-select-dropdown-container-border-width)] border-[var(--ui-input-select-dropdown-container-border-color)] bg-[var(--ui-input-select-dropdown-container-color)] px-[var(--ui-input-select-dropdown-container-padding-x)] py-[var(--ui-input-select-dropdown-container-padding-y)]"
      >
        <div className="border-b border-[var(--ui-input-select-dropdown-section-container-border-color)]">
          <InputSelectSearch
            aria-label={searchPlaceholder}
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </div>
        {groups.length > 0 ? (
          groups.map((group, groupIndex) => {
            const groupLabelId = group.category
              ? `${groupIdPrefix}-group-${groupIndex}`
              : undefined;
            const showAllLabelId = group.category
              ? `${groupIdPrefix}-show-all-${groupIndex}`
              : undefined;

            return (
              <DropdownMenuGroup
                key={group.category ?? '__uncategorized'}
                aria-labelledby={groupLabelId}
                className={cn(
                  'gap-[var(--ui-input-select-dropdown-section-list-gap)] overflow-visible px-0 py-[var(--ui-input-select-dropdown-section-container-padding-y)]',
                  groupIndex === 0
                    ? '[&:not(:first-child)]:border-t-0'
                    : '[&:not(:first-child)]:border-t-[length:var(--ui-input-select-dropdown-section-container-border-width)] [&:not(:first-child)]:border-[var(--ui-input-select-dropdown-section-container-border-color)]'
                )}
              >
                {group.category && (
                  <div className="flex w-full items-center justify-between px-[var(--ui-input-select-dropdown-section-container-header-padding-x)] py-[var(--ui-input-select-dropdown-section-container-header-padding-y)]">
                    <span
                      id={groupLabelId}
                      className="text-sm font-semibold leading-6 text-[var(--ui-input-select-dropdown-section-label-group-color)]"
                    >
                      {group.category}
                    </span>
                    <Button
                      variant="ghost"
                      className="ms-auto h-6 shrink-0"
                      aria-labelledby={`${showAllLabelId} ${groupLabelId}`}
                      onClick={() => {
                        group.columns
                          .filter((column) => column.hidden)
                          .forEach((column) => onToggle(column.id));
                      }}
                    >
                      <span id={showAllLabelId}>{showAllLabel}</span>
                    </Button>
                  </div>
                )}
                {group.visibleColumns.map((column) => (
                  <DropdownMenuItem
                    key={column.id}
                    role="menuitemcheckbox"
                    aria-checked={!column.hidden}
                    closeOnClick={false}
                    onClick={() => onToggle(column.id)}
                    className="min-h-[var(--ui-input-select-dropdown-item-global-container-height)] items-center gap-[var(--ui-input-select-dropdown-item-global-container-gap)] bg-[var(--ui-input-select-dropdown-item-unselected-container-color-idle)] px-[var(--ui-input-select-dropdown-item-global-container-padding-x)] py-[var(--ui-input-select-dropdown-item-global-container-padding-y)] font-normal text-[var(--ui-input-select-dropdown-item-global-label-color)] data-[highlighted]:bg-[var(--ui-input-select-dropdown-item-unselected-container-color-hover)] data-[highlighted]:active:bg-[var(--ui-input-select-dropdown-item-unselected-container-color-hover)]"
                  >
                    <Checkbox
                      checked={!column.hidden}
                      aria-hidden
                      tabIndex={-1}
                      className="pointer-events-none"
                    />
                    {column.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            );
          })
        ) : (
          <div className="px-[var(--ui-input-select-dropdown-container-status-padding-x)] py-[var(--ui-input-select-dropdown-container-status-padding-y)] text-center text-sm leading-6 text-[var(--ui-input-select-dropdown-item-global-label-color)]">
            {noResultsLabel}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
TableViewOptions.displayName = 'TableViewOptions';

export { TableViewOptions };
