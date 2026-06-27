import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import { SheetDetails } from '../sheet-details';

const properties = [
  { label: 'Status', value: 'Protected' },
  { label: 'Last backup', value: '5 minutes ago' },
  { label: 'Owner', value: 'ken99@example.com' },
  { label: 'Plan', value: 'Total protection' },
];

const meta = {
  title: 'UI/Sheet/SheetDetails',
  component: SheetDetails,
  parameters: { layout: 'fullscreen', snapshot: { fullPage: true } },
  tags: ['autodocs'],
  args: {
    title: 'Workload details',
    properties,
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      table: { category: 'Appearance' },
    },
    contentState: {
      control: 'inline-radio',
      options: ['content', 'loading', 'empty', 'error'],
      table: { category: 'State' },
    },
  },
} satisfies Meta<typeof SheetDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultOpen: true,
    actions: <Button>Edit</Button>,
  },
};

export const Loading: Story = {
  args: { defaultOpen: true, contentState: 'loading' },
};

export const EmptyState: Story = {
  args: { defaultOpen: true, contentState: 'empty' },
};

export const ErrorState: Story = {
  args: { defaultOpen: true, contentState: 'error' },
};
