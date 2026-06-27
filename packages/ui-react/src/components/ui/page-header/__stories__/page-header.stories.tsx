import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderBreadcrumb,
  PageHeaderDescription,
  PageHeaderRow,
  PageHeaderTitle,
} from '../page-header';

const meta = {
  title: 'UI/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[640px]">
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>Header title</PageHeaderTitle>
          <PageHeaderActions>
            <Button variant="ghost">Export</Button>
            <Button>New report</Button>
          </PageHeaderActions>
        </PageHeaderRow>
      </PageHeader>
    </div>
  ),
};

export const WithBreadcrumbAndDescription: Story = {
  render: () => (
    <div className="w-[640px]">
      <PageHeader>
        <PageHeaderBreadcrumb>Home / Reports</PageHeaderBreadcrumb>
        <PageHeaderRow>
          <PageHeaderTitle>Reports</PageHeaderTitle>
          <PageHeaderActions>
            <Button>New report</Button>
          </PageHeaderActions>
        </PageHeaderRow>
        <PageHeaderDescription>
          All scheduled and on-demand reports for your workloads.
        </PageHeaderDescription>
      </PageHeader>
    </div>
  ),
};
