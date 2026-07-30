'use client';

import { useState } from 'react';
import {
  ChartGrowthIcon,
  EllipsisIcon,
  LayoutGridIcon,
  MonitorIcon,
  ShieldCheckIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import {
  AppShellChat,
  AppShellChatChat,
  AppShellChatChatBody,
  AppShellChatChatHeader,
  AppShellChatContent,
  AppShellChatContentBody,
  AppShellChatContentHeader,
  AppShellChatSidebar,
  ButtonIcon,
} from '@acronis-platform/ui-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutGridIcon },
  { label: 'Assets', icon: MonitorIcon },
  { label: 'Protection', icon: ShieldCheckIcon },
  { label: 'Reports', icon: ChartGrowthIcon },
];

// The docs preview frame is far narrower than a real app viewport, so this demo
// controls `width` and clamps it to the frame. Left uncontrolled, Chat's
// breakpoint-responsive default (up to 512px) would swallow the whole preview.
const DEMO_CHAT_MAX_WIDTH = 300;

export function AppShellChatDemo() {
  const [chatWidth, setChatWidth] = useState(200);

  return (
    <div
      style={{ height: 380 }}
      className="w-full overflow-hidden rounded-md border border-border"
    >
      <AppShellChat>
        <AppShellChatSidebar>
          <nav
            aria-label="Primary"
            style={{ width: 168 }}
            className="flex flex-col gap-1 bg-[var(--ui-sidebar-primary-global-container-color)] p-3"
          >
            {navItems.map(({ label, icon: Icon }, index) => (
              <span
                key={label}
                className={
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm ' +
                  (index === 0
                    ? 'bg-[var(--ui-sidebar-primary-menu-item-selected-container-color-idle)] font-medium text-[var(--ui-sidebar-primary-menu-item-selected-label-color-idle)]'
                    : 'text-[var(--ui-sidebar-primary-menu-item-unselected-label-color-idle)]')
                }
              >
                <Icon size={16} />
                {label}
              </span>
            ))}
          </nav>
        </AppShellChatSidebar>

        <AppShellChatContent>
          <AppShellChatContentHeader>
            <span className="ui-typography-headings-title text-[var(--ui-text-on-surface-primary)]">
              Dashboard
            </span>
          </AppShellChatContentHeader>
          <AppShellChatContentBody>
            <div className="flex flex-1 items-center justify-center rounded-lg bg-background p-4 text-center text-sm text-[var(--ui-text-on-surface-secondary)]">
              Page content — absorbs every width change from the sidebar and the
              chat panel, and can shrink to zero.
            </div>
          </AppShellChatContentBody>
        </AppShellChatContent>

        <AppShellChatChat
          aria-label="Acronis AI"
          width={chatWidth}
          onWidthChange={(next) =>
            setChatWidth(Math.min(next, DEMO_CHAT_MAX_WIDTH))
          }
        >
          <AppShellChatChatHeader
            label="Acronis AI"
            actions={
              <ButtonIcon aria-label="Chat options">
                <EllipsisIcon size={16} />
              </ButtonIcon>
            }
          />
          <AppShellChatChatBody>
            <p className="text-sm text-[var(--ui-text-on-surface-secondary)]">
              Drag this panel&apos;s inner edge to resize it against the page
              content. Double-click the edge to reset the width; with the edge
              focused, the arrow keys nudge it and Home resets it.
            </p>
          </AppShellChatChatBody>
        </AppShellChatChat>
      </AppShellChat>
    </div>
  );
}
