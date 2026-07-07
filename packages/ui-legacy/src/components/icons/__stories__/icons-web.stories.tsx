import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "web-d-o-16",
  "web-hosting-server-included-16",
  "web-hosting-server-included-24",
  "web-hosting-server-o-16",
  "web-hosting-server-o-24"
]

const meta = {
  title: 'Icons/Web',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Web: Story = {
  render: () => <IconGrid entries={icons} />,
}
