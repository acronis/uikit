import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: { variant: 'success', children: 'Success' },
}

export const Info: Story = {
  args: { variant: 'info', children: 'Info' },
}

export const Warning: Story = {
  args: { variant: 'warning', children: 'Warning' },
}

export const Critical: Story = {
  args: { variant: 'critical', children: 'Critical' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Danger' },
}

export const Neutral: Story = {
  args: { variant: 'neutral', children: 'Neutral' },
}

export const AI: Story = {
  args: { variant: 'ai', children: 'Acronis AI' },
}

export const AISolid: Story = {
  args: { variant: 'ai-solid', children: 'Acronis AI (solid)' },
}
