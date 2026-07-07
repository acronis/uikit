import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "arrow-circle-down-o-32",
  "arrow-down-32",
  "arrow-down-circled-o-32",
  "arrow-left-16",
  "arrow-left-32",
  "arrow-lower-left-o-24",
  "arrow-right-16",
  "arrow-right-circled-o-24",
  "arrow-sort-down-16",
  "arrow-sort-up-16",
  "arrow-up-32",
  "arrow-upper-right-o-24"
]

const meta = {
  title: 'Icons/Arrow',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Arrow: Story = {
  render: () => <IconGrid entries={icons} />,
}
