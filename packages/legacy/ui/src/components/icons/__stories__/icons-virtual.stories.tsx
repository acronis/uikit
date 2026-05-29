import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "virtual-app-32",
  "virtual-machine-ab-32",
  "virtual-machines-16",
  "virtual-machines-24",
  "virtual-machines-32",
  "virtual-machines-included-16",
  "virtual-machines-included-24",
  "virtual-network-16",
  "virtual-network-24"
]

const meta = {
  title: 'Icons/Virtual',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Virtual: Story = {
  render: () => <IconGrid entries={icons} />,
}
