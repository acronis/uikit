'use client';

import {
  AppShell,
  AppShellBody,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  AppShellSidebar,
} from '@acronis-platform/ui-react';

const navItems = ['Dashboard', 'Workloads', 'Protection', 'Reports', 'Settings'];

export function AppShellDemo() {
  return (
    <div
      style={{ height: 440 }}
      className="w-full overflow-hidden rounded-md border border-border"
    >
      <AppShell className="h-full min-h-0">
        <AppShellSidebar
          style={{ width: 224 }}
          className="flex-col gap-1 bg-[var(--ui-sidebar-primary-global-container-color)] p-3"
        >
          <div className="px-3 py-2 text-sm font-semibold text-[var(--ui-sidebar-primary-menu-item-selected-label-color-idle)]">
            Acronis
          </div>
          {navItems.map((item, index) => (
            <div
              key={item}
              className={
                'rounded-md px-3 py-2 text-sm ' +
                (index === 0
                  ? 'bg-[var(--ui-sidebar-primary-menu-item-selected-container-color-idle)] font-medium text-[var(--ui-sidebar-primary-menu-item-selected-label-color-idle)]'
                  : 'text-[var(--ui-sidebar-primary-menu-item-unselected-label-color-idle)]')
              }
            >
              {item}
            </div>
          ))}
        </AppShellSidebar>
        <AppShellBody>
          <AppShellHeader>
            <span className="text-sm font-semibold">Acronis Cyber Protect</span>
            <span className="ms-auto text-sm text-[var(--ui-text-on-surface-secondary)]">
              admin@acronis.com
            </span>
          </AppShellHeader>
          <AppShellMain className="p-6">
            <h1 className="text-lg font-semibold">Current page title</h1>
            <p className="mt-2 text-sm text-[var(--ui-text-on-surface-secondary)]">
              The main content area scrolls independently of the sidebar and the
              sticky header.
            </p>
          </AppShellMain>
          <AppShellFooter>
            <span className="text-xs text-[var(--ui-text-on-surface-secondary)]">
              © Acronis International GmbH
            </span>
          </AppShellFooter>
        </AppShellBody>
      </AppShell>
    </div>
  );
}
