import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  AppShell,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellSidebar,
} from '../app-shell';

const meta = {
  title: 'UI/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const navItems = ['Dashboard', 'Workloads', 'Protection', 'Reports', 'Settings'];

// A representative shell — the sidebar slot holds a (placeholder) primary nav, the
// header slot a title + action area, and main the page content. In a real app the
// sidebar slot takes SidebarPrimary and the header takes SearchGlobal (see the
// App Shell pattern). Bounded height + min-h-0 so the full-page scaffold fits a VR
// snapshot.
export const Default: Story = {
  render: () => (
    <div className="h-[440px] overflow-hidden border border-border">
      <AppShell className="h-full min-h-0">
        <AppShellSidebar className="w-56 flex-col gap-1 bg-[var(--ui-background-brand-primary)] p-3 text-[var(--ui-glyph-on-brand-primary)]">
          <div className="px-2 pb-3 text-sm font-semibold">Acronis</div>
          {navItems.map((item, i) => (
            <div
              key={item}
              className={
                'rounded-md px-3 py-2 text-sm ' +
                (i === 0 ? 'bg-white/15 font-medium' : 'opacity-80')
              }
            >
              {item}
            </div>
          ))}
        </AppShellSidebar>
        <AppShellBody>
          <AppShellHeader>
            <span className="text-sm font-semibold">Dashboard</span>
            <span className="ml-auto text-sm text-[var(--ui-text-on-surface-secondary)]">
              admin@acronis.com
            </span>
          </AppShellHeader>
          <AppShellMain className="p-6">
            <h1 className="text-lg font-semibold">Current page title</h1>
            <p className="mt-2 text-sm text-[var(--ui-text-on-surface-secondary)]">
              The main content area scrolls independently of the sidebar and header.
            </p>
          </AppShellMain>
        </AppShellBody>
      </AppShell>
    </div>
  ),
};
