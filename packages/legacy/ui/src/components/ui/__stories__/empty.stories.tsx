import type { Meta, StoryObj } from '@storybook/react-vite'
import { Empty, EmptyIcon, EmptyHeader, EmptyTitle, EmptyDescription } from '../empty'
import { MailboxIcon } from '@/components/icons'

const meta = {
  title: 'UI/Empty',
  component: Empty,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No data</EmptyTitle>
        <EmptyDescription>There is no data to display</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Empty>
      <EmptyIcon>
        <MailboxIcon />
      </EmptyIcon>
      <EmptyHeader>
        <EmptyTitle>No messages</EmptyTitle>
        <EmptyDescription>You don&apos;t have any messages yet</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}
