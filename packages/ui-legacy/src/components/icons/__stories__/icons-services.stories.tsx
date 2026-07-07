import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "services-32",
  "services-nav-24",
  "services-nav-dark-24",
  "services-o-16",
  "services-o-24"
]

const meta = {
  title: 'Icons/Services',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Services: Story = {
  render: () => <IconGrid entries={icons} />,
}
