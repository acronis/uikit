import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea, ScrollBar } from '../scroll-area'
import { Separator } from '../separator'

const meta = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

const tags = Array.from({ length: 50 }, (_, i) => `Tag ${i + 1}`)

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-medium"
          >
            Item {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}

export const WithContent: Story = {
  render: () => (
    <ScrollArea className="h-[350px] w-[300px] rounded-md border p-4">
      <h4 className="mb-4 text-sm font-medium leading-none">Long content</h4>
      {Array.from({ length: 20 }, (_, i) => (
        <p key={i} className="text-sm text-muted-foreground mb-3">
          Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </p>
      ))}
    </ScrollArea>
  ),
}
