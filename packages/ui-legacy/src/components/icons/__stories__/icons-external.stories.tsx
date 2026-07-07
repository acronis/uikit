import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "external-devices-disabled-ill-96",
  "external-devices-enabled-ill-96",
  "external-drive-16",
  "external-drive-32",
  "external-drive-ill-72",
  "external-link-16"
]

const meta = {
  title: 'Icons/External',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const External: Story = {
  render: () => <IconGrid entries={icons} />,
}
