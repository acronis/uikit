'use client';

import { Separator } from '@acronis-platform/ui-react';

export function SeparatorDemo() {
  return (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Workloads</h4>
        <p className="text-sm text-muted-foreground">
          Manage and protect your devices.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <div>Backup</div>
        <Separator orientation="vertical" />
        <div>Recovery</div>
        <Separator orientation="vertical" />
        <div>Reports</div>
      </div>
    </div>
  );
}
