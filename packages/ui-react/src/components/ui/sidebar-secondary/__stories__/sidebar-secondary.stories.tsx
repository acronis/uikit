import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  BoxIcon,
  ChevronLeftIcon,
  LayoutGridIcon,
  PlusIcon,
  ServerIcon,
  ShoppingCartIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { ButtonIcon } from '../../button-icon';
import { Tag } from '../../tag';

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
  argTypes: {
    expanded: {
      control: 'boolean',
      description:
        'Controlled panel-width state. When set, the consumer owns it and the trigger only emits `onExpandedChange`. The collapsed rail swaps the section list for the breadcrumb via `data-state`.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    defaultExpanded: {
      control: 'boolean',
      description:
        'Uncontrolled initial expanded state. Ignored when `expanded` is provided.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'State',
      },
    },
    onExpandedChange: {
      control: false,
      description:
        'Fires with the next expanded value whenever the panel toggles (e.g. via the collapse trigger), in both controlled and uncontrolled modes.',
      table: {
        type: { summary: '(expanded: boolean) => void' },
        category: 'Events',
      },
    },
    render: {
      control: false,
      description:
        'Replace the rendered `<nav>` with another element or component (Base UI composition). Accepts a React element or a render function.',
      table: { type: { summary: 'useRender.RenderProp' }, category: 'Composition' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for the navigation landmark.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Section navigation'" },
        category: 'Behavior',
      },
    },
    children: {
      control: false,
      description:
        'Composed sidebar parts (Header, Content, Section, Menu, MenuSub, CollapsedBreadcrumb, Footer, …).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
} satisfies Meta<typeof SidebarSecondary>;

export default meta;
type Story = StoryObj<typeof meta>;

function Shell({
  children,
  height = 520,
}: {
  children: React.ReactNode;
  height?: number;
}) {
  return <div style={{ height, display: 'flex' }}>{children}</div>;
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
            <SidebarSecondaryCollapseTrigger icon={<ChevronLeftIcon />}>
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
                <SidebarSecondaryCollapseTrigger icon={<ChevronLeftIcon />}>
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

// Collapsible sections (Figma "Section" expandable variant). Mirrors the
// "Protection" reference: one open section of items, several collapsed sections,
// a submenu nested inside a section, and a header-less section ("Chat").
export const ExpandableSections: Story = {
  name: 'Expandable sections',
  render: () => (
    <Shell height={680}>
      <SidebarSecondary>
        <SidebarSecondaryHeader label="Protection" />
        <SidebarSecondaryContent>
          <SidebarSecondarySection expandable>
            <SidebarSecondarySectionLabel>Policies</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#" selected>
                Protection
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Remote management</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Monitoring</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Software deployment</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Cloud application backup</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Archiving</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">SIEM forwarding</SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
          <SidebarSecondarySection expandable defaultOpen={false}>
            <SidebarSecondarySectionLabel>Jobs</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#">Active</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">History</SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
          <SidebarSecondarySection expandable defaultOpen={false}>
            <SidebarSecondarySectionLabel>Disaster recovery</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              {/* A submenu (item-level disclosure) nested inside an expandable section. */}
              <SidebarSecondaryMenuSub>
                <SidebarSecondaryMenuSubTrigger>Runbooks</SidebarSecondaryMenuSubTrigger>
                <SidebarSecondaryMenuSubContent>
                  <SidebarSecondaryMenuSubItem href="#">Primary site</SidebarSecondaryMenuSubItem>
                  <SidebarSecondaryMenuSubItem href="#">Secondary site</SidebarSecondaryMenuSubItem>
                </SidebarSecondaryMenuSubContent>
              </SidebarSecondaryMenuSub>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
          <SidebarSecondarySection expandable defaultOpen={false}>
            <SidebarSecondarySectionLabel>Email security</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#">Quarantine</SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
          <SidebarSecondarySection expandable defaultOpen={false}>
            <SidebarSecondarySectionLabel>Infrastructure</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#">Storage</SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
          {/* Header-less section: a plain top-level item. */}
          <SidebarSecondarySection>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#">Chat</SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryCollapseTrigger icon={<ChevronLeftIcon />}>
              Collapse menu
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    </Shell>
  ),
};

// Section header extras (Figma "Intelligence" reference): a `+` action button on
// an open section, and an unread-rollup Tag on a collapsed section.
export const SectionActionsAndRollup: Story = {
  name: 'Section actions + unread rollup',
  render: () => (
    <Shell height={560}>
      <SidebarSecondary>
        <SidebarSecondaryHeader label="Intelligence" />
        <SidebarSecondaryContent>
          <SidebarSecondarySection expandable>
            <SidebarSecondarySectionLabel
              actions={
                <ButtonIcon variant="ghost" aria-label="Add dashboard">
                  <PlusIcon />
                </ButtonIcon>
              }
            >
              Dashboards
            </SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#" selected>
                Overview
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Microsoft 365 licensing</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Security</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">RMM</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Backup</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Usage</SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
          <SidebarSecondarySection expandable defaultOpen={false}>
            <SidebarSecondarySectionLabel
              unreadRollup={
                <Tag variant="neutral" size="sm">
                  22
                </Tag>
              }
            >
              Operations
            </SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#">Alerts</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Activities</SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
          <SidebarSecondarySection>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#">Reports</SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryCollapseTrigger icon={<ChevronLeftIcon />}>
              Collapse menu
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    </Shell>
  ),
};

// The "Assets" reference: grouped, expandable sections of (icon-less) items, with
// count Tags on leaf rows ("832" / "56") and a status Tag ("NEW") — all via the
// `tag` extra. Mirrors the Figma Assets example.
export const Assets: Story = {
  render: () => (
    <Shell height={640}>
      <SidebarSecondary>
        <SidebarSecondaryHeader label="Assets" />
        <SidebarSecondaryContent>
          <SidebarSecondarySection expandable>
            <SidebarSecondarySectionLabel>Devices</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#" selected>
                All devices
                <SidebarSecondaryMenuItemExtras
                  variant="tag"
                  tag={
                    <Tag variant="neutral" size="sm">
                      832
                    </Tag>
                  }
                />
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Managed devices</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">
                Discovered devices
                <SidebarSecondaryMenuItemExtras
                  variant="tag"
                  tag={
                    <Tag variant="neutral" size="sm">
                      56
                    </Tag>
                  }
                />
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
          <SidebarSecondarySection expandable>
            <SidebarSecondarySectionLabel>Virtualization</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#">VMware</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Virtuozzo</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Cyber Frame</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Scale Computing</SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
          <SidebarSecondarySection expandable>
            <SidebarSecondarySectionLabel>Public cloud</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#">Microsoft Azure</SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
          <SidebarSecondarySection expandable>
            <SidebarSecondarySectionLabel>SaaS</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#">Microsoft 365</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Microsoft Entra ID</SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">
                Mail servers
                <SidebarSecondaryMenuItemExtras
                  variant="tag"
                  tag={
                    <Tag variant="success" size="sm">
                      NEW
                    </Tag>
                  }
                />
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#">Google Workspace</SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
          <SidebarSecondarySection expandable>
            <SidebarSecondarySectionLabel>Network</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#">Network Attached Storage</SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryCollapseTrigger icon={<ChevronLeftIcon />}>
              Collapse menu
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    </Shell>
  ),
};
