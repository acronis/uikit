import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSettingsCell,
} from '../table';
import {
  TableViewOptions,
  type TableColumnVisibility,
} from '../table-view-options';

const demoColumns: TableColumnVisibility[] = [
  { id: 'name', label: 'Name', hidden: false },
  { id: 'status', label: 'Status', hidden: false },
  { id: 'type', label: 'Type', hidden: true },
  { id: 'updated', label: 'Last updated', hidden: false },
];

function toggle(columns: TableColumnVisibility[], id: string) {
  return columns.map((column) =>
    column.id === id ? { ...column, hidden: !column.hidden } : column
  );
}

const meta = {
  title: 'UI/Table/ViewOptions',
  component: TableViewOptions,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: { columns: [], onToggle: () => {} },
} satisfies Meta<typeof TableViewOptions>;

export default meta;
type Story = StoryObj<typeof meta>;

function ViewOptionsDemo() {
  const [columns, setColumns] = useState<TableColumnVisibility[]>(demoColumns);
  return (
    <div className="flex w-[320px] justify-end">
      <TableViewOptions
        columns={columns}
        onToggle={(id) => setColumns((current) => toggle(current, id))}
      />
    </div>
  );
}

function SettingsCellDemo() {
  const [columns, setColumns] = useState<TableColumnVisibility[]>(demoColumns);
  const visible = columns.filter((column) => !column.hidden);
  return (
    <Table className="w-120">
      <TableHeader>
        <TableRow>
          {visible.map((column) => (
            <TableHead key={column.id}>{column.label}</TableHead>
          ))}
          <TableSettingsCell>
            <TableViewOptions
              iconOnly
              columns={columns}
              onToggle={(id) => setColumns((current) => toggle(current, id))}
            />
          </TableSettingsCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          {visible.map((column) => (
            <TableCell key={column.id}>{column.label} value</TableCell>
          ))}
          <TableCell />
        </TableRow>
      </TableBody>
    </Table>
  );
}

// Open the menu so the visual-regression snapshot captures the dropdown of
// checkboxes in both light and dark.
export const Default: Story = {
  render: () => <ViewOptionsDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /View/ }));
  },
};

/**
 * The `iconOnly` trigger — a cog-only icon button sized for the 48px
 * `TableSettingsCell` at the end of the header row, which is where the design
 * puts column visibility.
 */
export const InSettingsCell: Story = {
  render: () => <SettingsCellDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Column settings' })
    );
  },
};
