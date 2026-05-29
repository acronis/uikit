import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sidebar, SidebarContent, SidebarProvider } from '../sidebar'

const meta = {
  title: 'UI/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Sidebar>
      <SidebarContent />
    </Sidebar>
  ),
}
