import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "help-16",
  "help-24",
  "help-ab-32",
  "help-circle-16",
  "help-nav-24",
  "help-nav-dark-24"
]

const meta = {
  title: 'Icons/Help',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Help: Story = {
  render: () => <IconGrid entries={icons} />,
}
