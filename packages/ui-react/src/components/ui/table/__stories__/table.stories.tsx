import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '../../checkbox';
import { Tag } from '../../tag';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description:
        'Composed parts — `TableHeader`/`TableBody`/`TableFooter` with `TableRow`, `TableHead`, `TableCell`, and an optional `TableCaption`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the `<table>`.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table className="w-[520px]">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

// Sortable headers render the sort affordance (inactive ⇅ / active ↑ / active ↓)
// and set `aria-sort`. Wire `onSort` to your own sorting; the direction is fixed
// here for the snapshot.
export const SortableHeaders: Story = {
  render: () => (
    <Table className="w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead sortable sortDirection="asc">
            Name
          </TableHead>
          <TableHead sortable>Created</TableHead>
          <TableHead sortable sortDirection="desc" className="text-right">
            Size
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Backup archive</TableCell>
          <TableCell>26 Jan, 2026</TableCell>
          <TableCell className="text-right">4 567 890</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Disk image</TableCell>
          <TableCell>24 Jan, 2026</TableCell>
          <TableCell className="text-right">1 204 050</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// Selection: a leading checkbox column and a `selected` row (active token).
export const Selectable: Story = {
  render: () => (
    <Table className="w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox aria-label="Select all" />
          </TableHead>
          <TableHead>Workload</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow selected>
          <TableCell>
            <Checkbox defaultChecked aria-label="Select row" />
          </TableCell>
          <TableCell>web-server-01</TableCell>
          <TableCell>
            <Tag>Protected</Tag>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Checkbox aria-label="Select row" />
          </TableCell>
          <TableCell>db-primary</TableCell>
          <TableCell>
            <Tag>Protected</Tag>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
