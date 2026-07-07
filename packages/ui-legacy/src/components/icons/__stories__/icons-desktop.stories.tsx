import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "desktop-default-disabled-ill-96",
  "desktop-default-enabled-ill-96",
  "desktop-imac-disabled-ill-96",
  "desktop-imac-enabled-ill-96",
  "desktop-linux-disabled-ill-96",
  "desktop-linux-enabled-ill-96",
  "desktop-vm-disabled-ill-96",
  "desktop-vm-enabled-ill-96",
  "desktop-windows-disabled-ill-96",
  "desktop-windows-enabled-ill-96"
]

const meta = {
  title: 'Icons/Desktop',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  render: () => <IconGrid entries={icons} />,
}
