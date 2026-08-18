// Figma Code Connect — status: COMPLETE
// The Figma "Table" (canvas 2948-2416) is not a single component set — it's a
// set of composable parts, each its own component set, assembled in the example
// frame 4567-6801. Each part maps to its code counterpart below.
//
// Interaction `state` variants (idle / hover / active / focus) carry no prop:
// they're pure CSS on the cell (see the hover/active/has-[:focus-visible]
// classes in table.tsx), which is why they're absent from the mappings.
// The `empty` state on TableSettings / TableActions / TableCheckbox is a
// loading placeholder — DataTable renders it via its own skeleton rows, not a
// Table prop.
import figma from '@figma/code-connect';
import { CogIcon, EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';

import { ButtonIcon } from '../button-icon';
import { Checkbox } from '../checkbox';
import {
  TableActionsCell,
  TableCell,
  TableHead,
  TableRow,
  TableSelectCell,
  TableSettingsCell,
} from './table';

// TableHeaderCell — the sortable column header. `hasSortIcon` gates the sort
// affordance; `Value` is the label text.
figma.connect(TableHead, 'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3427-207', {
  props: {
    sortable: figma.boolean('hasSortIcon'),
    label: figma.string('Value'),
  },
  example: ({ sortable, label }) => (
    <TableHead sortable={sortable}>{label}</TableHead>
  ),
});

// TableCheckbox — the 32px row-selection cell. Its `variant` describes the
// nested Checkbox's logical state, not the cell itself.
figma.connect(TableSelectCell, 'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3698-746', {
  props: {
    checked: figma.enum('variant', { checked: true }),
    indeterminate: figma.enum('variant', { indeterminate: true }),
  },
  example: ({ checked, indeterminate }) => (
    <TableSelectCell>
      <Checkbox
        checked={checked}
        indeterminate={indeterminate}
        aria-label="Select row"
      />
    </TableSelectCell>
  ),
});

// TableActions — the trailing 48px row-actions cell. The trigger it holds is
// consumer composition (a ButtonIcon opening a DropdownMenu).
figma.connect(TableActionsCell, 'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4536-414', {
  example: () => (
    <TableActionsCell>
      <ButtonIcon aria-label="Row actions">
        <EllipsisIcon />
      </ButtonIcon>
    </TableActionsCell>
  ),
});

// TableSettings — the trailing 48px header cell holding the column-settings
// trigger. What it opens is the consumer's choice; TableViewOptions is the
// ready-made column-visibility menu.
figma.connect(TableSettingsCell, 'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3698-497', {
  example: () => (
    <TableSettingsCell>
      <ButtonIcon aria-label="Column settings">
        <CogIcon />
      </ButtonIcon>
    </TableSettingsCell>
  ),
});

// TableHeaderRow — gates the leading select-all cell and the trailing settings
// cell.
figma.connect(TableRow, 'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3698-538', {
  props: {
    selectCell: figma.boolean('hasCheckbox', {
      true: (
        <TableSelectCell header>
          <Checkbox aria-label="Select all" />
        </TableSelectCell>
      ),
      false: undefined,
    }),
    settingsCell: figma.boolean('hasSettings', {
      true: <TableSettingsCell />,
      false: undefined,
    }),
  },
  example: ({ selectCell, settingsCell }) => (
    <TableRow>
      {selectCell}
      <TableHead sortable>Table header</TableHead>
      {settingsCell}
    </TableRow>
  ),
});

// TableDataRow — gates the leading selection cell and the trailing actions
// cell; `state=selected` maps to the `selected` prop.
figma.connect(TableRow, 'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4536-175', {
  props: {
    selectCell: figma.boolean('hasCheckbox', {
      true: (
        <TableSelectCell>
          <Checkbox aria-label="Select row" />
        </TableSelectCell>
      ),
      false: undefined,
    }),
    actionsCell: figma.boolean('hasActions', {
      true: <TableActionsCell />,
      false: undefined,
    }),
    selected: figma.enum('state', { selected: true }),
  },
  example: ({ selectCell, actionsCell, selected }) => (
    <TableRow selected={selected}>
      {selectCell}
      <TableCell>Simple value</TableCell>
      {actionsCell}
    </TableRow>
  ),
});

// The assembled example frame (4567-6801) is DataTable's canonical connection
// (see `data-table.figma.tsx`) — `DataTable` is the batteries-included recipe
// a designer reaches for first. `Table`'s own granular part connects above
// (TableHead, TableSelectCell, TableActionsCell, TableSettingsCell, TableRow)
// already cover the primitives; a second, unrestricted top-level connect for
// `Table` on the same shared node would leave Dev Mode's snippet order
// undefined between the two components. Consumers who need the hand-composed
// primitives use those part connects, or see `../table` for the full example.
