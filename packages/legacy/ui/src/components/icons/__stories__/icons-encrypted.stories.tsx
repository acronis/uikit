import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "encrypted-16",
  "encrypted-ab-32",
  "encrypted-mix-32",
  "encrypted-red-16",
  "encrypted-red-32"
]

const meta = {
  title: 'Icons/Encrypted',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Encrypted: Story = {
  render: () => <IconGrid entries={icons} />,
}
