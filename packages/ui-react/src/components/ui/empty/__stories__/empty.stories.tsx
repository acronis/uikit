import type { Meta, StoryObj } from '@storybook/react-vite';
import { InboxIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Button } from '../../button';
import {
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyHeader,
  EmptyIcon,
  EmptyTitle,
} from '../empty';

const meta = {
  title: 'UI/Empty',
  component: Empty,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description:
        'Composed parts — `EmptyIcon`, `EmptyHeader` (with `EmptyTitle` / `EmptyDescription`), `EmptyActions`, `EmptyLinks`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the root.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No data</EmptyTitle>
        <EmptyDescription>There is no data to display.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Empty>
      <EmptyIcon>
        <InboxIcon />
      </EmptyIcon>
      <EmptyHeader>
        <EmptyTitle>No messages</EmptyTitle>
        <EmptyDescription>You don&apos;t have any messages yet.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Empty>
      <EmptyIcon>
        <InboxIcon />
      </EmptyIcon>
      <EmptyHeader>
        <EmptyTitle>No backups found</EmptyTitle>
        <EmptyDescription>
          Create your first backup plan to start protecting this workload.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyActions>
        <Button>Create backup plan</Button>
      </EmptyActions>
    </Empty>
  ),
};
