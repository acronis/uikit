import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  BoxIcon,
  LayoutGridIcon,
  PanelLeftIcon,
  ServerIcon,
  ShoppingCartIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import {
  SidebarSecondary,
  SidebarSecondaryCollapsedBreadcrumb,
  SidebarSecondaryCollapseTrigger,
  SidebarSecondaryContent,
  SidebarSecondaryFooter,
  SidebarSecondaryHeader,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondaryMenuItemExtras,
  SidebarSecondaryMenuSub,
  SidebarSecondaryMenuSubContent,
  SidebarSecondaryMenuSubItem,
  SidebarSecondaryMenuSubTrigger,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
} from '../sidebar-secondary';

const meta = {
  title: 'UI/SidebarSecondary',
  component: SidebarSecondary,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SidebarSecondary>;

export default meta;
type Story = StoryObj<typeof meta>;

function Shell({ children }: { children: React.ReactNode }) {
  return <div style={{ height: 520, display: 'flex' }}>{children}</div>;
}

export const Default: Story = {
  render: () => (
    <Shell>
      <SidebarSecondary>
        <SidebarSecondaryHeader label="Protection" />
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>
              Overview
            </SidebarSecondarySectionLabel>
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
              <SidebarSecondaryMenuSub defaultOpen>
                <SidebarSecondaryMenuSubTrigger icon={<BoxIcon />}>
                  Policies
                </SidebarSecondaryMenuSubTrigger>
                <SidebarSecondaryMenuSubContent>
                  <SidebarSecondaryMenuSubItem href="#" selected>
                    Backup
                  </SidebarSecondaryMenuSubItem>
                  <SidebarSecondaryMenuSubItem href="#">
                    Antivirus
                  </SidebarSecondaryMenuSubItem>
                </SidebarSecondaryMenuSubContent>
              </SidebarSecondaryMenuSub>
              <SidebarSecondaryMenuItem href="#" icon={<ShoppingCartIcon />}>
                Add-ons
                <SidebarSecondaryMenuItemExtras variant="externalLink" />
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
        <SidebarSecondaryCollapsedBreadcrumb
          parentLabel="Protection"
          currentLabel="Dashboard"
        />
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#">Settings</SidebarSecondaryMenuItem>
            {/* Uncontrolled panel: the trigger toggles `expanded` via context. */}
            <SidebarSecondaryCollapseTrigger icon={<PanelLeftIcon />}>
              Collapse menu
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    </Shell>
  ),
};

export const Collapsed: Story = {
  name: 'Collapsed (breadcrumb rail)',
  render: () => (
    <Shell>
      <SidebarSecondary expanded={false}>
        <SidebarSecondaryHeader label="Protection" />
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#" icon={<LayoutGridIcon />} selected>
                Dashboard
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
        <SidebarSecondaryCollapsedBreadcrumb
          parentLabel="Protection"
          currentLabel="Dashboard"
        />
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#" icon={<ServerIcon />}>
              Settings
            </SidebarSecondaryMenuItem>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    </Shell>
  ),
};

export const Selected: Story = {
  name: 'Selected vs unselected',
  render: () => (
    <Shell>
      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#" icon={<LayoutGridIcon />} selected>
                Selected item
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#" icon={<ServerIcon />}>
                Unselected item
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#" icon={<BoxIcon />}>
                Another item
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    </Shell>
  ),
};

export const Expandable: Story = {
  name: 'Expandable disclosure (open + closed)',
  render: () => (
    <Shell>
      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuSub defaultOpen>
                <SidebarSecondaryMenuSubTrigger icon={<BoxIcon />} selected>
                  Open group
                </SidebarSecondaryMenuSubTrigger>
                <SidebarSecondaryMenuSubContent>
                  <SidebarSecondaryMenuSubItem href="#" selected>
                    Child one
                  </SidebarSecondaryMenuSubItem>
                  <SidebarSecondaryMenuSubItem href="#">
                    Child two
                  </SidebarSecondaryMenuSubItem>
                </SidebarSecondaryMenuSubContent>
              </SidebarSecondaryMenuSub>
              <SidebarSecondaryMenuSub>
                <SidebarSecondaryMenuSubTrigger icon={<ServerIcon />}>
                  Closed group
                </SidebarSecondaryMenuSubTrigger>
                <SidebarSecondaryMenuSubContent>
                  <SidebarSecondaryMenuSubItem href="#">
                    Hidden child
                  </SidebarSecondaryMenuSubItem>
                </SidebarSecondaryMenuSubContent>
              </SidebarSecondaryMenuSub>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    </Shell>
  ),
};

export const WithExtras: Story = {
  render: () => (
    <Shell>
      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#" icon={<BoxIcon />}>
                Shortcut
                <SidebarSecondaryMenuItemExtras variant="shortcut" shortcut="⌘F" />
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#" icon={<ShoppingCartIcon />}>
                External link
                <SidebarSecondaryMenuItemExtras variant="externalLink" />
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    </Shell>
  ),
};

export const Controlled: Story = {
  name: 'Controlled expand/collapse',
  render: function ControlledPanel() {
    const [expanded, setExpanded] = useState(true);
    return (
      <Shell>
        <SidebarSecondary expanded={expanded} onExpandedChange={setExpanded}>
          <SidebarSecondaryHeader label="Protection" />
          <SidebarSecondaryContent>
            <SidebarSecondarySection>
              <SidebarSecondaryMenu>
                <SidebarSecondaryMenuItem href="#" icon={<LayoutGridIcon />} selected>
                  Dashboard
                </SidebarSecondaryMenuItem>
                {/* Controlled: the trigger calls toggleExpanded → onExpandedChange,
                    and this consumer owns the `expanded` state. */}
                <SidebarSecondaryCollapseTrigger icon={<PanelLeftIcon />}>
                  Collapse menu
                </SidebarSecondaryCollapseTrigger>
              </SidebarSecondaryMenu>
            </SidebarSecondarySection>
          </SidebarSecondaryContent>
          <SidebarSecondaryCollapsedBreadcrumb
            parentLabel="Protection"
            currentLabel="Dashboard"
          />
        </SidebarSecondary>
      </Shell>
    );
  },
};
