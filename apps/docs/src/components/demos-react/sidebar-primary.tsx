'use client';

import {
  SidebarPrimary,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimarySection,
} from '@acronis-platform/ui-react';
import {
  BoxIcon,
  CircleHelpIcon,
  UsersIcon,
} from '@acronis-platform/icons-react/stroke-mono';

export function SidebarPrimaryDemo() {
  return (
    <div style={{ height: 360 }}>
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
    </div>
  );
}
