import type { Meta, StoryObj } from '@storybook/react-vite'
import { VisuallyHidden } from '../visually-hidden'
import { Button } from '../button'

const meta = {
  title: 'UI/VisuallyHidden',
  component: VisuallyHidden,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof VisuallyHidden>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        The button below has a visually hidden label for screen readers:
      </p>
      <Button variant="outline" size="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <VisuallyHidden>Toggle menu</VisuallyHidden>
      </Button>
    </div>
  ),
}

export const InHeading: Story = {
  render: () => (
    <div>
      <h2 className="text-lg font-semibold">
        Settings
        <VisuallyHidden> — application settings page</VisuallyHidden>
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        {`Screen readers will announce "Settings — application settings page"`}
      </p>
    </div>
  ),
}
