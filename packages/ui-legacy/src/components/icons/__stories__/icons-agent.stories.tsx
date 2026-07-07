import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "agent-cyberframe-32",
  "agent-hci-32",
  "agent-hyperv-32",
  "agent-kvm-32",
  "agent-nutanix-32",
  "agent-oracle-32",
  "agent-qnap-16",
  "agent-qnap-32",
  "agent-redhat-32",
  "agent-va-32",
  "agent-xen-32"
]

const meta = {
  title: 'Icons/Agent',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Agent: Story = {
  render: () => <IconGrid entries={icons} />,
}
