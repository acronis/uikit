import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from '../date-picker.tsx'

const meta = {
  title: 'UI/DatePicker',
  component: DatePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
