import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "minus-16",
  "minus-circle-32",
  "minus-rounded-16",
  "minus-small-16",
  "minus-square-16"
]

const meta = {
  title: 'Icons/Minus',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Minus: Story = {
  render: () => <IconGrid entries={icons} />,
}
