import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "vm-arm-32",
  "vm-hyperv-32",
  "vm-hyperv-running-32",
  "vm-replication-plan-ab-32",
  "vm-running-32",
  "vm-template-32",
  "vm-ware-24"
]

const meta = {
  title: 'Icons/Vm',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Vm: Story = {
  render: () => <IconGrid entries={icons} />,
}
