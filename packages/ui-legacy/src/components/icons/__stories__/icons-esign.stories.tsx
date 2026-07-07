import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "esign-notarization-16",
  "esign-notarization-32",
  "esign-notarizations-o-16",
  "esign-notarizations-o-24",
  "esign-o-16"
]

const meta = {
  title: 'Icons/Esign',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Esign: Story = {
  render: () => <IconGrid entries={icons} />,
}
