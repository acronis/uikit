import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "clients-16",
  "clients-24",
  "clients-32",
  "clients-solid-16",
  "clients-solid-24",
  "clients-solid-32"
]

const meta = {
  title: 'Icons/Clients',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Clients: Story = {
  render: () => <IconGrid entries={icons} />,
}
