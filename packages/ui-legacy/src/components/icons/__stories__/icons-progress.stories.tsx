import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "progress-16",
  "progress-32",
  "progress-mix-32",
  "progress-red-mix-32",
  "progress-tray-16"
]

const meta = {
  title: 'Icons/Progress',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Progress: Story = {
  render: () => <IconGrid entries={icons} />,
}
