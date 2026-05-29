import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageContent } from '../page-content'

const meta = {
  title: 'UI/PageContent',
  component: PageContent,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof PageContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex h-screen bg-background">
      <aside className="w-48 bg-muted border-r" />
      <PageContent>
        <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
          Page content renders here with flex-1 and padding.
        </div>
      </PageContent>
    </div>
  ),
}

export const WithHeader: Story = {
  render: () => (
    <div className="flex h-screen flex-col bg-background">
      <header className="h-14 border-b bg-muted" />
      <div className="flex flex-1">
        <aside className="w-48 bg-muted border-r" />
        <PageContent>
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="rounded-md border bg-card p-4 text-sm">Card {i + 1}</div>
            ))}
          </div>
        </PageContent>
      </div>
    </div>
  ),
}
