import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "laptop-ab-24",
  "laptop-ab-32",
  "laptop-apple-ab-24",
  "laptop-apple-ab-32",
  "laptop-apple-arm-32",
  "laptop-default-disabled-ill-96",
  "laptop-default-enabled-ill-96",
  "laptop-linux-24",
  "laptop-linux-32",
  "laptop-linux-disabled-ill-96",
  "laptop-linux-enabled-ill-96",
  "laptop-mac-book-disabled-ill-96",
  "laptop-mac-book-enabled-ill-96",
  "laptop-vm-disabled-ill-96",
  "laptop-vm-enabled-ill-96",
  "laptop-windows-ab-24",
  "laptop-windows-ab-32",
  "laptop-windows-arm-32",
  "laptop-windows-disabled-ill-96",
  "laptop-windows-enabled-ill-96"
]

const meta = {
  title: 'Icons/Laptop',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Laptop: Story = {
  render: () => <IconGrid entries={icons} />,
}
