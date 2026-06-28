import type { Meta, StoryObj } from '@storybook/react-vite';

import { DashboardGrid, DashboardLayout } from '../dashboard-layout';

const Widget = ({ title }: { title: string }) => (
  <div className="rounded-lg border border-border bg-background p-4">
    <div className="text-sm font-medium">{title}</div>
    <div className="mt-2 h-16 rounded bg-[var(--ui-background-surface-secondary)]" />
  </div>
);

const meta = {
  title: 'UI/DashboardLayout',
  component: DashboardLayout,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DashboardLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[760px]">
      <DashboardLayout>
        <DashboardGrid cols={3}>
          <Widget title="Protected" />
          <Widget title="Alerts" />
          <Widget title="Storage" />
          <Widget title="Backups" />
          <Widget title="Devices" />
          <Widget title="Users" />
        </DashboardGrid>
      </DashboardLayout>
    </div>
  ),
};
