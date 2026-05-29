import type { Meta, StoryObj } from '@storybook/react-vite'
import { SplitLayout, SplitLayoutPanel } from '../split-layout'

const meta = {
  title: 'UI/SplitLayout',
  component: SplitLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof SplitLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <SplitLayout className="h-screen">
      <SplitLayoutPanel className="border-r p-6">
        <h3 className="font-semibold mb-3">Left Panel</h3>
        <p className="text-sm text-muted-foreground">Navigation or list content.</p>
      </SplitLayoutPanel>
      <SplitLayoutPanel className="p-6">
        <h3 className="font-semibold mb-3">Right Panel</h3>
        <p className="text-sm text-muted-foreground">Detail or main content area.</p>
      </SplitLayoutPanel>
    </SplitLayout>
  ),
}

export const Vertical: Story = {
  render: () => (
    <SplitLayout orientation="vertical" className="h-screen">
      <SplitLayoutPanel className="border-b p-6">
        <h3 className="font-semibold mb-3">Top Panel</h3>
        <p className="text-sm text-muted-foreground">Header content or filters.</p>
      </SplitLayoutPanel>
      <SplitLayoutPanel className="p-6">
        <h3 className="font-semibold mb-3">Bottom Panel</h3>
        <p className="text-sm text-muted-foreground">Main content or results.</p>
      </SplitLayoutPanel>
    </SplitLayout>
  ),
}

export const ThreePanels: Story = {
  render: () => (
    <SplitLayout className="h-screen">
      <SplitLayoutPanel className="border-r p-4 max-w-[200px]">
        <h3 className="font-semibold mb-2 text-sm">Navigation</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {['Overview', 'Details', 'Settings', 'Logs'].map((item) => (
            <li key={item} className="rounded px-2 py-1 hover:bg-muted cursor-pointer">{item}</li>
          ))}
        </ul>
      </SplitLayoutPanel>
      <SplitLayoutPanel className="border-r p-4 max-w-[300px]">
        <h3 className="font-semibold mb-2 text-sm">List</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i} className="rounded border p-2">Item {i + 1}</li>
          ))}
        </ul>
      </SplitLayoutPanel>
      <SplitLayoutPanel className="p-4">
        <h3 className="font-semibold mb-2 text-sm">Detail</h3>
        <p className="text-sm text-muted-foreground">Selected item detail content.</p>
      </SplitLayoutPanel>
    </SplitLayout>
  ),
}
