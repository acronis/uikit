import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "ai-agent-16",
  "ai-agent-24",
  "ai-chat-16",
  "ai-chat-24",
  "ai-chat-32",
  "ai-chat-72",
  "ai-chat-o-16",
  "ai-chat-o-24",
  "ai-chat-o-32",
  "ai-chat-o-72",
  "ai-sparkles-16",
  "ai-sparkles-24",
  "ai-sparkles-32",
  "ai-sparkles-72",
  "ai-sparkles-color-16",
  "ai-sparkles-color-24",
  "ai-sparkles-color-32",
  "ai-sparkles-color-72",
  "ai-sparkles-inverse-color-16",
  "ai-sparkles-inverse-color-24",
  "ai-sparkles-inverse-color-32",
  "ai-sparkles-tag-16",
  "ai-sparkles-tag-color-16",
  "ai-summaries-16",
  "ai-summaries-24",
  "ai-summaries-32",
  "ai-summaries-color-16",
  "ai-summaries-color-24",
  "ai-summaries-color-32",
  "ai-summaries-delete-16",
  "ai-summaries-delete-24"
]

const meta = {
  title: 'Icons/Ai',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Ai: Story = {
  render: () => <IconGrid entries={icons} />,
}
