import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AppShell,
  AppShellSidebar,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellFooter,
} from '../app-shell'

const meta = {
  title: 'UI/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <AppShell className="h-screen">
      <AppShellSidebar className="w-56 border-r bg-muted">
        <div className="flex h-16 items-center border-b px-4 font-semibold">Logo</div>
        <nav className="p-2 space-y-1">
          {['Dashboard', 'Backups', 'Devices', 'Reports', 'Settings'].map((item) => (
            <div
              key={item}
              className="rounded-md px-3 py-2 text-sm hover:bg-background cursor-pointer"
            >
              {item}
            </div>
          ))}
        </nav>
      </AppShellSidebar>
      <AppShellBody>
        <AppShellHeader>
          <span className="font-semibold">Dashboard</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted" />
          </div>
        </AppShellHeader>
        <AppShellMain className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="rounded-lg border bg-card p-4 text-sm">
                Widget {i + 1}
              </div>
            ))}
          </div>
        </AppShellMain>
        <AppShellFooter>
          <span className="text-xs text-muted-foreground">© 2025 Acronis</span>
        </AppShellFooter>
      </AppShellBody>
    </AppShell>
  ),
}

export const WithoutSidebar: Story = {
  render: () => (
    <AppShell className="h-screen flex-col">
      <AppShellHeader className="w-full">
        <span className="font-semibold">App Title</span>
      </AppShellHeader>
      <AppShellMain className="p-6">
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          Full-width content area without sidebar.
        </div>
      </AppShellMain>
    </AppShell>
  ),
}
