import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "azure-16",
  "azure-24",
  "azure-32",
  "azure-vm-32",
  "azure-vm-running-32"
]

const meta = {
  title: 'Icons/Azure',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Azure: Story = {
  render: () => <IconGrid entries={icons} />,
}
