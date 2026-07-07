import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "dot-chart-blue-16",
  "dot-chart-brown-16",
  "dot-chart-critical-16",
  "dot-chart-danger-16",
  "dot-chart-green-16",
  "dot-chart-grey-16",
  "dot-chart-info-16",
  "dot-chart-light-blue-16",
  "dot-chart-neutral-16",
  "dot-chart-purple-16",
  "dot-chart-red-16",
  "dot-chart-success-16",
  "dot-chart-transparent-16",
  "dot-chart-turquoise-16",
  "dot-chart-violet-16",
  "dot-chart-warning-16",
  "dot-chart-yellow-16",
  "dot-critical-16",
  "dot-custom-16",
  "dot-danger-16",
  "dot-info-16",
  "dot-success-16",
  "dot-unknown-16",
  "dot-warning-16"
]

const meta = {
  title: 'Icons/Status Dots',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const StatusDots: Story = {
  render: () => <IconGrid entries={icons} />,
}
