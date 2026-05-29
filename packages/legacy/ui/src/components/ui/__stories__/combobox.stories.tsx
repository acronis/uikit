import type { Meta, StoryObj } from '@storybook/react-vite'
import { Combobox } from '../combobox'

const meta = {
  title: 'UI/Combobox',
  component: Combobox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
