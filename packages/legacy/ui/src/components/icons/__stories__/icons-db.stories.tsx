import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "db-16",
  "db-24",
  "db-cluster-16",
  "db-cluster-32",
  "db-cluster-active-16",
  "db-cluster-active-32"
]

const meta = {
  title: 'Icons/Db',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Db: Story = {
  render: () => <IconGrid entries={icons} />,
}
