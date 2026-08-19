import * as React from 'react';
import { CogIcon } from '@acronis-platform/icons-react/stroke-mono';

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

export interface TableColumnVisibility {
  /** Stable column identifier. */
  id: string;
  /** Human-readable label shown in the menu. */
  label: string;
  /** Whether the column is currently hidden. */
  hidden: boolean;
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
function TableViewOptions({
  columns,
  onToggle,
  triggerLabel = 'View',
  iconOnly = false,
  triggerAriaLabel = 'Column settings',
}: TableViewOptionsProps) {
  return (
    <DropdownMenu>
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
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuGroup>
          {columns.map((column) => (
            <DropdownMenuItem
              key={column.id}
              role="menuitemcheckbox"
              aria-checked={!column.hidden}
              closeOnClick={false}
              onClick={() => onToggle(column.id)}
              className="items-center"
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
TableViewOptions.displayName = 'TableViewOptions';

export { TableViewOptions };
