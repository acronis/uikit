// Figma Code Connect — status: COMPLETE
// Mapped to the App Shell design (shadcn-uikit file, node 2782-1495).
import figma from '@figma/code-connect';

import {
  AppShell,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellSidebar,
} from './app-shell';

figma.connect(
  AppShell,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2782-1495',
  {
    example: () => (
      <AppShell>
        <AppShellSidebar>{/* SidebarPrimary */}</AppShellSidebar>
        <AppShellBody>
          <AppShellHeader>{/* SearchGlobal + actions */}</AppShellHeader>
          <AppShellMain>{/* page content */}</AppShellMain>
        </AppShellBody>
      </AppShell>
    ),
  }
);
