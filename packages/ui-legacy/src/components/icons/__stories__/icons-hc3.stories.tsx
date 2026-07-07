import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "hc3-16",
  "hc3-replica-ab-32",
  "hc3-replica-running-ab-32",
  "hc3-vm-ab-24",
  "hc3-vm-ab-32",
  "hc3-vm-running-ab-32"
]

const meta = {
  title: 'Icons/Hc3',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Hc3: Story = {
  render: () => <IconGrid entries={icons} />,
}
