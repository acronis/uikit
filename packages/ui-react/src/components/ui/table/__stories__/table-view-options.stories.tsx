import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import {
  TableViewOptions,
  type TableColumnVisibility,
} from '../table-view-options';

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
  const [columns, setColumns] = useState<TableColumnVisibility[]>([
    { id: 'name', label: 'Name', hidden: false },
    { id: 'status', label: 'Status', hidden: false },
    { id: 'type', label: 'Type', hidden: true },
    { id: 'updated', label: 'Last updated', hidden: false },
  ]);
  return (
    <div className="flex w-[320px] justify-end">
      <TableViewOptions
        columns={columns}
        onToggle={(id) =>
          setColumns((current) =>
            current.map((column) =>
              column.id === id
                ? { ...column, hidden: !column.hidden }
                : column
            )
          )
        }
      />
    </div>
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
