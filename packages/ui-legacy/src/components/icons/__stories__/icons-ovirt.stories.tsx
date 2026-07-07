import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "ovirt-16",
  "ovirt-32",
  "ovirt-vm-ab-24",
  "ovirt-vm-ab-32",
  "ovirt-vm-running-ab-32"
]

const meta = {
  title: 'Icons/Ovirt',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Ovirt: Story = {
  render: () => <IconGrid entries={icons} />,
}
