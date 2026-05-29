import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from '../textarea'

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Type your message here.' },
}

export const Disabled: Story = {
  args: { placeholder: 'Disabled textarea', disabled: true },
}
