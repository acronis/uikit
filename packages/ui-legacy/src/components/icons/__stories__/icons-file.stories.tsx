import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "file-16",
  "file-32",
  "file-audio-16",
  "file-audio-32",
  "file-empty-32",
  "file-esigned-32",
  "file-excel-16",
  "file-excel-32",
  "file-image-16",
  "file-image-32",
  "file-notarization-16",
  "file-notarization-32",
  "file-notarization-o-24",
  "file-notarized-16",
  "file-notarized-32",
  "file-onenote-32",
  "file-open-o-32",
  "file-pdf-16",
  "file-pdf-32",
  "file-powerpoint-16",
  "file-powerpoint-32",
  "file-process-32",
  "file-text-16",
  "file-text-32",
  "file-video-16",
  "file-video-32",
  "file-word-16",
  "file-word-32",
  "file-zip-16",
  "file-zip-32"
]

const meta = {
  title: 'Icons/File',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const File: Story = {
  render: () => <IconGrid entries={icons} />,
}
