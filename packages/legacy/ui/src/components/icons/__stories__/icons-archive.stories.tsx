import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "archive-16",
  "archive-24",
  "archive-32",
  "archive-o-24",
  "archive-o-32"
]

const meta = {
  title: 'Icons/Archive',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Archive: Story = {
  render: () => <IconGrid entries={icons} />,
}
