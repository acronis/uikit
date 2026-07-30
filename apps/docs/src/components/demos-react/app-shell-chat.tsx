'use client';

import { useState } from 'react';
import {
  AppShellChat,
  AppShellChatChat,
  AppShellChatChatBody,
  AppShellChatChatHeader,
  AppShellChatContent,
  AppShellChatContentBody,
  AppShellChatContentHeader,
  AppShellChatSidebar,
  SidebarPrimary,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimarySection,
  TooltipProvider,
} from '@acronis-platform/ui-react';
import {
  BoxIcon,
  CircleHelpIcon,
  ShieldCheckIcon,
  UsersIcon,
} from '@acronis-platform/icons-react/stroke-mono';

export function AppShellChatDemo() {
  // The chat width is CONTROLLED here only so this preview stays inside the
  // docs page. Left uncontrolled (a real full-page shell), the width is live
  // and breakpoint-driven — it would open at 448/512px and swallow the
  // preview box. Drag the panel's left edge to resize; double-click it (or
  // press Home while it's focused) to reset. Dragging all the way to the
  // 48px floor switches the header to its icon-only rail.
  const [chatWidth, setChatWidth] = useState(240);

  return (
    <TooltipProvider delay={0}>
      <div
        className="overflow-hidden rounded-md border border-border"
        style={{ height: 480, width: '100%' }}
      >
        <AppShellChat className="h-full">
          <AppShellChatSidebar>
            {/* Collapsed rail keeps the three columns legible at this size. */}
            <SidebarPrimary aria-label="Primary" defaultExpanded={false}>
              <SidebarPrimaryHeader>
                <BoxIcon size={24} />
              </SidebarPrimaryHeader>
              <SidebarPrimaryContent>
                <SidebarPrimarySection>
                  <SidebarPrimaryMenu>
                    <SidebarPrimaryMenuItem
                      href="#"
                      icon={<ShieldCheckIcon />}
                      selected
                    >
                      Protection
                    </SidebarPrimaryMenuItem>
                    <SidebarPrimaryMenuItem href="#" icon={<BoxIcon />}>
                      Workloads
                    </SidebarPrimaryMenuItem>
                    <SidebarPrimaryMenuItem href="#" icon={<UsersIcon />}>
                      Clients
                    </SidebarPrimaryMenuItem>
                  </SidebarPrimaryMenu>
                </SidebarPrimarySection>
              </SidebarPrimaryContent>
              <SidebarPrimaryFooter>
                <SidebarPrimaryMenu>
                  <SidebarPrimaryMenuItem href="#" icon={<CircleHelpIcon />}>
                    Help
                  </SidebarPrimaryMenuItem>
                </SidebarPrimaryMenu>
              </SidebarPrimaryFooter>
            </SidebarPrimary>
          </AppShellChatSidebar>

          <AppShellChatContent>
            <AppShellChatContentHeader>
              <span className="ui-typography-headings-title text-[var(--ui-text-on-surface-primary)]">
                Protection
              </span>
            </AppShellChatContentHeader>
            <AppShellChatContentBody>
              <div className="flex flex-1 items-center justify-center rounded-lg border border-border bg-background text-sm text-[var(--ui-text-on-surface-secondary)]">
                Page content
              </div>
            </AppShellChatContentBody>
          </AppShellChatContent>

          <AppShellChatChat width={chatWidth} onWidthChange={setChatWidth}>
            <AppShellChatChatHeader label="Acronis AI" />
            <AppShellChatChatBody className="gap-3">
              <div className="rounded-lg bg-[var(--ui-background-surface-secondary)] p-3 text-sm text-[var(--ui-text-on-surface-primary)]">
                Which workloads failed their last backup?
              </div>
              <div className="rounded-lg border border-border p-3 text-sm text-[var(--ui-text-on-surface-secondary)]">
                Two workloads failed overnight. Both are Windows servers in the
                Frankfurt data center.
              </div>
            </AppShellChatChatBody>
          </AppShellChatChat>
        </AppShellChat>
      </div>
    </TooltipProvider>
  );
}
