'use client';

import { DashboardGrid, DashboardLayout } from '@acronis-platform/ui-react';

const Widget = ({ title }: { title: string }) => (
  <div className="rounded-lg border border-border bg-background p-4">
    <div className="text-sm font-medium">{title}</div>
    <div className="mt-2 h-16 rounded bg-[var(--ui-background-surface-secondary)]" />
  </div>
);

export function DashboardLayoutDemo() {
  return (
    <DashboardLayout>
      <DashboardGrid cols={3}>
        {['Protected', 'Alerts', 'Storage', 'Backups', 'Devices', 'Users'].map(
          (t) => (
            <Widget key={t} title={t} />
          )
        )}
      </DashboardGrid>
    </DashboardLayout>
  );
}
