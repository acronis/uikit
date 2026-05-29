import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "kubernetes-16",
  "kubernetes-24",
  "kubernetes-cluster-16",
  "kubernetes-cluster-24",
  "kubernetes-o-16",
  "kubernetes-o-24"
]

const meta = {
  title: 'Icons/Kubernetes',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Kubernetes: Story = {
  render: () => <IconGrid entries={icons} />,
}
