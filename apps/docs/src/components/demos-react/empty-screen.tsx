'use client';

import {
  AppShellChat,
  AppShellChatContent,
  AppShellChatContentBody,
  AppShellChatContentHeader,
  AppShellChatSidebar,
  Button,
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyHeader,
  EmptyIcon,
  EmptyTitle,
} from '@acronis-platform/ui-react';
import { InboxIcon } from '@acronis-platform/icons-react/stroke-mono';

const nav = ['Dashboard', 'Workloads', 'Protection', 'Reports', 'Settings'];

export function EmptyScreenDemo() {
  return (
    <div className="h-[440px] overflow-hidden rounded-md border border-border">
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
                (i === 1 ? 'bg-white/15 font-medium' : 'opacity-80')
              }
            >
              {item}
            </div>
          ))}
        </AppShellChatSidebar>
        <AppShellChatContent>
          <AppShellChatContentHeader />
          <AppShellChatContentBody className="grid place-items-center">
            <Empty>
              <EmptyHeader>
                <EmptyIcon>
                  <InboxIcon />
                </EmptyIcon>
                <EmptyTitle>No workloads yet</EmptyTitle>
                <EmptyDescription>
                  Add a workload to start protecting your data.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyActions>
                <Button>Add workload</Button>
              </EmptyActions>
            </Empty>
          </AppShellChatContentBody>
        </AppShellChatContent>
      </AppShellChat>
    </div>
  );
}
