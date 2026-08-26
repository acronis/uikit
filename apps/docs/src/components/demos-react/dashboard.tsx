'use client';

import {
  AppShellChat,
  AppShellChatContent,
  AppShellChatContentBody,
  AppShellChatContentHeader,
  AppShellChatSidebar,
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
      {/* No chat panel here — the App Shell's Chat slot is optional, so the
          same scaffold serves an ordinary two-column console screen. */}
      <AppShellChat className="h-full">
        <AppShellChatSidebar className="w-52 flex-col gap-1 bg-[var(--ui-background-brand-primary)] p-3 text-[var(--ui-glyph-on-brand-primary)]">
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
        </AppShellChatSidebar>
        <AppShellChatContent>
          <AppShellChatContentHeader>
            <span className="text-sm font-semibold">Dashboard</span>
          </AppShellChatContentHeader>
          <AppShellChatContentBody>
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
          </AppShellChatContentBody>
        </AppShellChatContent>
      </AppShellChat>
    </div>
  );
}
