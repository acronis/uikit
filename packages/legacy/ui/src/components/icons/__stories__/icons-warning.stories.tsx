import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "warning-16",
  "warning-32",
  "warning-circle-16",
  "warning-circle-32",
  "warning-circle-mix-32",
  "warning-mix-32"
]

const meta = {
  title: 'Icons/Warning',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Warning: Story = {
  render: () => <IconGrid entries={icons} />,
}
