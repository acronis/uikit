import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { MailIcon, RotateIcon } from '@/components/icons'

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Button' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Destructive' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
}

export const Link: Story = {
  args: { variant: 'link', children: 'Link' },
}

export const WithIcon: Story = {
  render: () => (
    <Button>
      <MailIcon className="mr-2 h-4 w-4" />
      Login with Email
    </Button>
  ),
}

export const Loading: Story = {
  render: () => (
    <Button disabled>
      <RotateIcon className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  ),
}
