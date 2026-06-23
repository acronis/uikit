import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  BoxIcon,
  BuildingIcon,
  CircleHelpIcon,
  InboxIcon,
  LayoutGridIcon,
  PanelLeftIcon,
  ServerIcon,
  ShoppingCartIcon,
  StarIcon,
  UsersIcon,
} from '@acronis-platform/icons-react/stroke-mono';

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
} from '../sidebar-primary';

const meta = {
  title: 'UI/SidebarPrimary',
  component: SidebarPrimary,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    expanded: {
      control: 'boolean',
      description:
        'Controlled rail-width state. When set, the consumer owns it and the trigger only emits `onExpandedChange`. `data-state="expanded|collapsed"` drives every token switch.',
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
        'Fires with the next expanded value whenever the rail toggles (e.g. via the collapse trigger), in both controlled and uncontrolled modes.',
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
        defaultValue: { summary: "'Primary'" },
        category: 'Behavior',
      },
    },
    children: {
      control: false,
      description:
        'Composed sidebar parts (Header, Content, Section, Menu, Footer, …).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
} satisfies Meta<typeof SidebarPrimary>;

export default meta;
type Story = StoryObj<typeof meta>;

// A stand-in for the consumer-slotted product logo (R7) — the Header just sizes
// whatever img/svg lands inside it.
function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-label="Acronis">
      <path d="M12 2 2 22h20L12 2Zm0 6 5 10H7l5-10Z" />
    </svg>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  // Sidebars fill their container height; give stories a fixed viewport.
  return <div style={{ height: 520, display: 'flex' }}>{children}</div>;
}

export const Default: Story = {
  render: () => (
    <Shell>
      <SidebarPrimary>
        <SidebarPrimaryHeader>
          <LogoMark />
        </SidebarPrimaryHeader>
        <SidebarPrimaryContent>
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem href="#" icon={<BoxIcon />} selected>
                Assets
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<ServerIcon />}>
                Protection management
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<UsersIcon />}>
                Clients
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<LayoutGridIcon />}>
                Automation
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<ShoppingCartIcon />}>
                Marketplace
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
            {/* Uncontrolled rail: the trigger toggles `expanded` via context. */}
            <SidebarPrimaryCollapseTrigger icon={<PanelLeftIcon />}>
              Collapse menu
            </SidebarPrimaryCollapseTrigger>
          </SidebarPrimaryMenu>
        </SidebarPrimaryFooter>
      </SidebarPrimary>
    </Shell>
  ),
};

export const Collapsed: Story = {
  name: 'Collapsed (rail)',
  render: () => (
    <Shell>
      <SidebarPrimary expanded={false}>
        <SidebarPrimaryHeader>
          <LogoMark />
        </SidebarPrimaryHeader>
        <SidebarPrimaryContent>
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem href="#" icon={<BoxIcon />} selected>
                Assets
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<ServerIcon />}>
                Protection management
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
    </Shell>
  ),
};

export const Selected: Story = {
  name: 'Selected vs unselected',
  render: () => (
    <Shell>
      <SidebarPrimary>
        <SidebarPrimaryContent>
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem href="#" icon={<BoxIcon />} selected>
                Selected item
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<ServerIcon />}>
                Unselected item
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<UsersIcon />}>
                Another item
              </SidebarPrimaryMenuItem>
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>
        </SidebarPrimaryContent>
      </SidebarPrimary>
    </Shell>
  ),
};

export const WithExtras: Story = {
  render: () => (
    <Shell>
      <SidebarPrimary>
        <SidebarPrimaryContent>
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem href="#" icon={<StarIcon />}>
                Shortcut
                <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘K" />
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<ShoppingCartIcon />}>
                External link
                <SidebarPrimaryMenuItemExtras variant="externalLink" />
              </SidebarPrimaryMenuItem>
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>
        </SidebarPrimaryContent>
      </SidebarPrimary>
    </Shell>
  ),
};

export const Controlled: Story = {
  name: 'Controlled expand/collapse',
  render: function ControlledRail() {
    const [expanded, setExpanded] = useState(true);
    return (
      <Shell>
        <SidebarPrimary
          expanded={expanded}
          onExpandedChange={setExpanded}
        >
          <SidebarPrimaryHeader>
            <LogoMark />
          </SidebarPrimaryHeader>
          <SidebarPrimaryContent>
            <SidebarPrimarySection>
              <SidebarPrimaryMenu>
                <SidebarPrimaryMenuItem href="#" icon={<BoxIcon />} selected>
                  Assets
                </SidebarPrimaryMenuItem>
                <SidebarPrimaryMenuItem href="#" icon={<ServerIcon />}>
                  Protection management
                </SidebarPrimaryMenuItem>
              </SidebarPrimaryMenu>
            </SidebarPrimarySection>
          </SidebarPrimaryContent>
          <SidebarPrimaryFooter>
            <SidebarPrimaryMenu>
              {/* Controlled: the trigger calls toggleExpanded → onExpandedChange,
                  and this consumer owns the `expanded` state. */}
              <SidebarPrimaryCollapseTrigger icon={<PanelLeftIcon />}>
                Collapse menu
              </SidebarPrimaryCollapseTrigger>
            </SidebarPrimaryMenu>
          </SidebarPrimaryFooter>
        </SidebarPrimary>
      </Shell>
    );
  },
};
