import * as React from 'react';
import { CogIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Button } from '../button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  /** Trigger label. Defaults to `View`. */
  triggerLabel?: React.ReactNode;
  /** Menu heading. Defaults to `Toggle columns`. */
  menuLabel?: React.ReactNode;
}

// TanStack-independent show/hide-columns dropdown extracted from
// `DataTableViewOptions`'s UI. Driven by a plain `{ id, label, hidden }[]` +
// `onToggle`, so it pairs with the `Table` primitives; `DataTableViewOptions`
// can later become a thin TanStack adapter over this part.
function TableViewOptions({
  columns,
  onToggle,
  triggerLabel = 'View',
  menuLabel = 'Toggle columns',
}: TableViewOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="secondary" className="h-8 shrink-0 gap-2" />}
      >
        <CogIcon />
        {triggerLabel}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={!column.hidden}
            onCheckedChange={() => onToggle(column.id)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
TableViewOptions.displayName = 'TableViewOptions';

export { TableViewOptions };
