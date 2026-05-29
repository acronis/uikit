import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "check-16",
  "check-24",
  "check-32",
  "check-circle-16",
  "check-circle-24",
  "check-circle-32",
  "check-circle-o-16",
  "check-circle-outline-16",
  "check-double-16",
  "check-small-16"
]

const meta = {
  title: 'Icons/Check',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Check: Story = {
  render: () => <IconGrid entries={icons} />,
}
