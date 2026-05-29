import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "clean-16",
  "clean-32",
  "clean-disk-32",
  "clean-drive-ab-32",
  "clean-up-o-16",
  "clean-up-o-24"
]

const meta = {
  title: 'Icons/Clean',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Clean: Story = {
  render: () => <IconGrid entries={icons} />,
}
