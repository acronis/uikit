import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  PageHeader,
  PageHeaderBreadcrumb,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
} from '../page-header'
import { Button } from '../button'

const meta = {
  title: 'UI/PageHeader',
  component: PageHeader,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderTitle>Dashboard</PageHeaderTitle>
    </PageHeader>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderTitle>Settings</PageHeaderTitle>
      <PageHeaderDescription>Manage your account settings and preferences.</PageHeaderDescription>
    </PageHeader>
  ),
}

export const WithBreadcrumb: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderBreadcrumb>Home / Settings / Security</PageHeaderBreadcrumb>
      <PageHeaderTitle>Security</PageHeaderTitle>
      <PageHeaderDescription>Manage your security settings.</PageHeaderDescription>
    </PageHeader>
  ),
}

export const WithActions: Story = {
  render: () => (
    <PageHeader className="w-[600px]">
      <PageHeaderBreadcrumb>Home / Backups</PageHeaderBreadcrumb>
      <div className="flex items-start justify-between">
        <div>
          <PageHeaderTitle>Backups</PageHeaderTitle>
          <PageHeaderDescription>View and manage your backup policies.</PageHeaderDescription>
        </div>
        <PageHeaderActions>
          <Button variant="outline">Export</Button>
          <Button>Create Backup</Button>
        </PageHeaderActions>
      </div>
    </PageHeader>
  ),
}
