import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "customer-16",
  "customer-24",
  "customer-32",
  "customer-solid-16",
  "customer-solid-24",
  "customer-solid-32"
]

const meta = {
  title: 'Icons/Customer',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Customer: Story = {
  render: () => <IconGrid entries={icons} />,
}
