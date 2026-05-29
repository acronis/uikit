import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "clipboard-24",
  "clipboard-32",
  "clipboard-arrow-24",
  "clipboard-custom-o-32",
  "clipboard-doubt-24",
  "clipboard-import-32",
  "clipboard-import-o-32",
  "clipboard-question-24"
]

const meta = {
  title: 'Icons/Clipboard',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Clipboard: Story = {
  render: () => <IconGrid entries={icons} />,
}
