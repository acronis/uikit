import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "connect-16",
  "connect-24",
  "connect-32",
  "connect-branded-ill-72",
  "connect-failed-24",
  "connect-white-label-ill-72"
]

const meta = {
  title: 'Icons/Connect',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Connect: Story = {
  render: () => <IconGrid entries={icons} />,
}
