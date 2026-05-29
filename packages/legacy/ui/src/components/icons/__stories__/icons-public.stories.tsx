import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "public-box-ab-16",
  "public-box-ab-24",
  "public-box-ab-32",
  "public-ips-o-16",
  "public-ips-o-24"
]

const meta = {
  title: 'Icons/Public',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Public: Story = {
  render: () => <IconGrid entries={icons} />,
}
