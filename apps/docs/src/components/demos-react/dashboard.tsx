'use client';

import {
  AppShell,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellSidebar,
  Grid,
  PageHeader,
  PageHeaderRow,
  PageHeaderTitle,
} from '@acronis-platform/ui-react';

const nav = ['Dashboard', 'Workloads', 'Protection', 'Reports', 'Settings'];
const widgets = ['Protected', 'Alerts', 'Storage', 'Backups', 'Devices', 'Users'];

const Widget = ({ title }: { title: string }) => (
  <div className="rounded-lg border border-border bg-background p-4">
    <div className="text-sm font-medium">{title}</div>
    <div className="mt-2 h-16 rounded bg-[var(--ui-background-surface-secondary)]" />
  </div>
);

export function DashboardDemo() {
  return (
    <div className="h-[480px] overflow-hidden rounded-md border border-border">
      <AppShell className="h-full min-h-0">
        <AppShellSidebar className="w-52 flex-col gap-1 bg-[var(--ui-background-brand-primary)] p-3 text-[var(--ui-glyph-on-brand-primary)]">
          <div className="px-2 pb-3 text-sm font-semibold">Acronis</div>
          {nav.map((item, i) => (
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
          </AppShellHeader>
          <AppShellMain className="p-6">
            <PageHeader>
              <PageHeaderRow>
                <PageHeaderTitle>Overview</PageHeaderTitle>
              </PageHeaderRow>
            </PageHeader>
            <Grid container cols={3}>
              {widgets.map((w) => (
                <Widget key={w} title={w} />
              ))}
            </Grid>
          </AppShellMain>
        </AppShellBody>
      </AppShell>
    </div>
  );
}
