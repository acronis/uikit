'use client';

import {
  SidebarPrimary,
  SidebarPrimaryCollapseTrigger,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimaryMenuItemExtras,
  SidebarPrimarySection,
  TooltipProvider,
} from '@acronis-platform/ui-react';
import {
  BoxIcon,
  ChevronsLeftIcon,
  CircleHelpIcon,
  HeadsetIcon,
  UsersIcon,
} from '@acronis-platform/icons-react/stroke-mono';

// Interactive on purpose: the collapse trigger exercises the rail's width state,
// and the long "Service desk…" label exercises both tooltip paths — the
// truncation tooltip while expanded, the label tooltip while collapsed.
export function SidebarPrimaryDemo() {
  return (
    <div style={{ height: 360 }}>
      <TooltipProvider>
        <SidebarPrimary aria-label="Primary">
          <SidebarPrimaryHeader>
            <BoxIcon size={24} />
          </SidebarPrimaryHeader>
          <SidebarPrimaryContent>
            <SidebarPrimarySection>
              <SidebarPrimaryMenu>
                <SidebarPrimaryMenuItem href="#" icon={<BoxIcon />} selected>
                  Assets
                </SidebarPrimaryMenuItem>
                <SidebarPrimaryMenuItem href="#" icon={<UsersIcon />}>
                  Clients
                </SidebarPrimaryMenuItem>
                <SidebarPrimaryMenuItem
                  href="#"
                  icon={<HeadsetIcon />}
                  extras={
                    <SidebarPrimaryMenuItemExtras
                      variant="shortcut"
                      shortcut="⌘D"
                    />
                  }
                >
                  Service desk and support tickets
                </SidebarPrimaryMenuItem>
              </SidebarPrimaryMenu>
            </SidebarPrimarySection>
          </SidebarPrimaryContent>
          <SidebarPrimaryFooter>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem href="#" icon={<CircleHelpIcon />}>
                Help
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryCollapseTrigger
                icon={<ChevronsLeftIcon />}
                expandTooltip="Expand menu"
              >
                Collapse menu
              </SidebarPrimaryCollapseTrigger>
            </SidebarPrimaryMenu>
          </SidebarPrimaryFooter>
        </SidebarPrimary>
      </TooltipProvider>
    </div>
  );
}
