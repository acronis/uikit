import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../input'

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
}

export const Disabled: Story = {
  args: { placeholder: 'Disabled input', disabled: true },
}

export const Email: Story = {
  args: { type: 'email', placeholder: 'Email' },
}

export const Password: Story = {
  args: { type: 'password', placeholder: 'Password' },
}
