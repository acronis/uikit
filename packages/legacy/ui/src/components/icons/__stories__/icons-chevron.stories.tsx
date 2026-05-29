import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "chevron-big-down-16",
  "chevron-big-left-16",
  "chevron-big-right-16",
  "chevron-big-up-16",
  "chevron-down-16",
  "chevron-left-16",
  "chevron-right-16",
  "chevron-select-16",
  "chevron-up-16",
  "chevron-updown-16"
]

const meta = {
  title: 'Icons/Chevron',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Chevron: Story = {
  render: () => <IconGrid entries={icons} />,
}
