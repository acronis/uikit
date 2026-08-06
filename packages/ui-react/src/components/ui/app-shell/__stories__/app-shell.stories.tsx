import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BoltIcon,
  BoxIcon,
  BriefcaseIcon,
  BuildingIcon,
  ChartGrowthIcon,
  ChevronsLeftIcon,
  CircleHelpIcon,
  HeadsetIcon,
  InboxIcon,
  LayoutGridIcon,
  MonitorIcon,
  ServerIcon,
  ShieldCheckIcon,
  StarIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import { AcronisIcon } from '@acronis-platform/icons-react/solid-mono';

import {
  PageHeader,
  PageHeaderRow,
  PageHeaderTitle,
} from '../../page-header';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyIcon,
  EmptyTitle,
} from '../../empty';
import {
  SidebarPrimary,
  SidebarPrimaryCollapseTrigger,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimarySection,
} from '../../sidebar-primary';
import {
  SidebarSecondary,
  SidebarSecondaryCollapseTrigger,
  SidebarSecondaryMenuItemExtras,
  SidebarSecondaryContent,
  SidebarSecondaryFooter,
  SidebarSecondaryHeader,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
} from '../../sidebar-secondary';
import {
  AppShell,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellSidebar,
} from '../app-shell';

const meta = {
  title: 'UI/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---- shared slot content (the exact components + values from the Figma) ----

function LogoMark() {
  return (
    <span className="flex items-center gap-2">
      <AcronisIcon aria-hidden="true" />
      <span className="leading-[1.15] group-data-[state=collapsed]/sidebar:hidden">
        <span className="block text-base font-semibold">Acronis</span>
        <span className="block text-sm">Cyber Platform</span>
      </span>
    </span>
  );
}

function PrimaryNav({ expanded }: { expanded?: boolean }) {
  return (
    <SidebarPrimary expanded={expanded} aria-label="Primary">
      <SidebarPrimaryHeader>
        <LogoMark />
      </SidebarPrimaryHeader>
      <SidebarPrimaryContent>
        <SidebarPrimarySection>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="#" icon={<MonitorIcon />} selected>
              Assets
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<ShieldCheckIcon />}>
              Protection management
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<BriefcaseIcon />}>
              Clients
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<HeadsetIcon />}>
              Service desk
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<BoltIcon />}>
              Automation
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<LayoutGridIcon />}>
              Marketplace
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<ChartGrowthIcon />}>
              Partner portal
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<BuildingIcon />}>
              My company
            </SidebarPrimaryMenuItem>
          </SidebarPrimaryMenu>
        </SidebarPrimarySection>
        <SidebarPrimarySection>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="#" icon={<InboxIcon />}>
              My inbox
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<StarIcon />}>
              Favorites
            </SidebarPrimaryMenuItem>
          </SidebarPrimaryMenu>
        </SidebarPrimarySection>
      </SidebarPrimaryContent>
      <SidebarPrimaryFooter>
        <SidebarPrimaryMenu>
          <SidebarPrimaryMenuItem href="#" icon={<CircleHelpIcon />}>
            Help
          </SidebarPrimaryMenuItem>
          <SidebarPrimaryCollapseTrigger icon={<ChevronsLeftIcon />}>
            Collapse menu
          </SidebarPrimaryCollapseTrigger>
        </SidebarPrimaryMenu>
      </SidebarPrimaryFooter>
    </SidebarPrimary>
  );
}

function SecondaryNav({ expanded }: { expanded?: boolean }) {
  return (
    <SidebarSecondary expanded={expanded}>
      <SidebarSecondaryHeader label="Protection" />
      <SidebarSecondaryContent>
        <SidebarSecondarySection>
          <SidebarSecondarySectionLabel>Overview</SidebarSecondarySectionLabel>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#" icon={<LayoutGridIcon />} selected>
              Dashboard
            </SidebarSecondaryMenuItem>
            <SidebarSecondaryMenuItem href="#" icon={<ServerIcon />}>
              Devices
            </SidebarSecondaryMenuItem>
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
        <SidebarSecondarySection>
          <SidebarSecondarySectionLabel>
            Configuration
          </SidebarSecondarySectionLabel>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#" icon={<BoxIcon />}>
              Backup
            </SidebarSecondaryMenuItem>
            <SidebarSecondaryMenuItem href="#" icon={<ShieldCheckIcon />}>
              Antivirus
            </SidebarSecondaryMenuItem>
            <SidebarSecondaryMenuItem href="#">
              Vulnerability assessment
            </SidebarSecondaryMenuItem>
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
      </SidebarSecondaryContent>
      <SidebarSecondaryFooter>
        <SidebarSecondaryMenu>
          <SidebarSecondaryCollapseTrigger icon={<ChevronsLeftIcon />} extras={<SidebarSecondaryMenuItemExtras variant="shortcut" shortcut="⌘?" />}>
            Collapse
          </SidebarSecondaryCollapseTrigger>
        </SidebarSecondaryMenu>
      </SidebarSecondaryFooter>
    </SidebarSecondary>
  );
}

function Header() {
  return (
    <AppShellHeader>
      <div className="flex w-full items-center justify-end gap-4">
        <span className="text-sm text-[var(--ui-text-on-surface-secondary)]">
          admin@acronis.com
        </span>
      </div>
    </AppShellHeader>
  );
}

function PageBody({ title = 'Assets' }: { title?: string }) {
  return (
    <AppShellMain className="p-6">
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>{title}</PageHeaderTitle>
        </PageHeaderRow>
      </PageHeader>
      <div className="h-64 rounded-md border border-border bg-[var(--ui-background-surface-secondary)]" />
    </AppShellMain>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  // The shell fills the viewport with no surrounding gap; the sidebar stretches
  // to the full height of the shell (its flex parent) and the main area scrolls.
  return <AppShell className="h-screen">{children}</AppShell>;
}

// ---- states ----

export const Expanded: Story = {
  render: () => (
    <Frame>
      <AppShellSidebar>
        <PrimaryNav />
      </AppShellSidebar>
      <AppShellBody>
        <Header />
        <PageBody />
      </AppShellBody>
    </Frame>
  ),
};

export const Collapsed: Story = {
  name: 'Collapsed primary',
  render: () => (
    <Frame>
      <AppShellSidebar>
        <PrimaryNav expanded={false} />
      </AppShellSidebar>
      <AppShellBody>
        <Header />
        <PageBody />
      </AppShellBody>
    </Frame>
  ),
};

export const WithSecondary: Story = {
  render: () => (
    <Frame>
      <AppShellSidebar>
        <PrimaryNav expanded={false} />
        <SecondaryNav />
      </AppShellSidebar>
      <AppShellBody>
        <Header />
        <PageBody title="Dashboard" />
      </AppShellBody>
    </Frame>
  ),
};

export const SecondaryCollapsed: Story = {
  render: () => (
    <Frame>
      <AppShellSidebar>
        <PrimaryNav expanded={false} />
        <SecondaryNav expanded={false} />
      </AppShellSidebar>
      <AppShellBody>
        <Header />
        <PageBody title="Dashboard" />
      </AppShellBody>
    </Frame>
  ),
};

export const EmptyScreen: Story = {
  render: () => (
    <Frame>
      <AppShellSidebar>
        <PrimaryNav />
      </AppShellSidebar>
      <AppShellBody>
        <Header />
        <AppShellMain className="grid place-items-center p-6">
          <Empty>
            <EmptyHeader>
              <EmptyIcon>
                <InboxIcon />
              </EmptyIcon>
              <EmptyTitle>Nothing here yet</EmptyTitle>
              <EmptyDescription>
                When you add workloads they’ll show up on this page.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </AppShellMain>
      </AppShellBody>
    </Frame>
  ),
};
