import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "hdd-16",
  "hdd-24",
  "hdd-32",
  "hdd-ill-72",
  "hdd-mix-32",
  "hdd-o-32",
  "hdd-s-o-24",
  "hdd-status-24"
]

const meta = {
  title: 'Icons/Hdd',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Hdd: Story = {
  render: () => <IconGrid entries={icons} />,
}
