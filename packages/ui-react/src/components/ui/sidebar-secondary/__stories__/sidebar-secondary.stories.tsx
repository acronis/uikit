import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  BoltIcon,
  ChevronsLeftIcon,
  DatabaseIcon,
  LayoutGridIcon,
  PlusIcon,
  CogIcon,
  SquareIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { ButtonIcon } from '../../button-icon';
import { Tag } from '../../tag';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../tooltip';

import {
  SidebarSecondary,
  SidebarSecondaryCollapseTrigger,
  SidebarSecondaryContent,
  SidebarSecondaryFooter,
  SidebarSecondaryHeader,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondaryMenuItemExtras,
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
    resizable: {
      control: 'boolean',
      description:
        'Enable the draggable resize edge on the right border. When `true`, the sidebar can be resized between the expanded-width token and twice that value.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Behavior',
      },
    },
    width: { table: { disable: true } },
    onWidthChange: { table: { disable: true } },
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
    resizeAriaLabel: {
      control: 'text',
      description:
        'Accessible label for the resize edge (`role="separator"`). Consumers should localize this string.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Resize sidebar'" },
        category: 'i18n',
      },
    },
    resizeTooltipExpanded: {
      control: false,
      description:
        'Tooltip content shown when the sidebar is expanded. Pass `null` to hide the tooltip entirely.',
      table: { type: { summary: 'ReactNode' }, category: 'i18n' },
    },
    resizeTooltipCollapsed: {
      control: false,
      description:
        'Tooltip content shown when the sidebar is collapsed. Pass `null` to hide the tooltip entirely.',
      table: { type: { summary: 'ReactNode' }, category: 'i18n' },
    },
    children: {
      control: false,
      description:
        'Composed sidebar parts (Header, Content, Section, Menu, Footer, …).',
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
  render: (args) => (
    <Shell>
      <SidebarSecondary {...args}>
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
              <SidebarSecondaryMenuItem href="#" icon={<DatabaseIcon />}>
                Devices
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
          <SidebarSecondarySection expandable>
            <SidebarSecondarySectionLabel>
              Configuration
            </SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#" icon={<SquareIcon />}>
                Backup
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#" icon={<SquareIcon />}>
                Antivirus
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                icon={<BoltIcon />}
                extras={<SidebarSecondaryMenuItemExtras variant="externalLink" />}
              >
                Add-ons
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            {/* Uncontrolled panel: the trigger toggles `expanded` via context. */}
            <SidebarSecondaryCollapseTrigger icon={<ChevronsLeftIcon />} extras={<SidebarSecondaryMenuItemExtras variant="shortcut" shortcut="⌘?" />}>
              Collapse
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
      <SidebarSecondary defaultExpanded={false}>
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
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#" icon={<CogIcon />}>
              Settings
            </SidebarSecondaryMenuItem>
            <SidebarSecondaryCollapseTrigger icon={<ChevronsLeftIcon />} extras={<SidebarSecondaryMenuItemExtras variant="shortcut" shortcut="⌘?" />}>
              Collapse
            </SidebarSecondaryCollapseTrigger>
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
              <SidebarSecondaryMenuItem href="#" icon={<DatabaseIcon />}>
                Unselected item
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#" icon={<SquareIcon />}>
                Another item
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    </Shell>
  ),
};

export const ExpandableSectionOpenClosed: Story = {
  name: 'Expandable section (open + closed)',
  render: () => (
    <Shell>
      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection expandable>
            <SidebarSecondarySectionLabel>Open section</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#" icon={<SquareIcon />} selected>
                Child one
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#" icon={<SquareIcon />}>
                Child two
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
          <SidebarSecondarySection expandable defaultOpen={false}>
            <SidebarSecondarySectionLabel>Closed section</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#" icon={<DatabaseIcon />}>
                Hidden child
              </SidebarSecondaryMenuItem>
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
              <SidebarSecondaryMenuItem
                href="#"
                icon={<SquareIcon />}
                extras={<SidebarSecondaryMenuItemExtras variant="shortcut" shortcut="⌘F" />}
              >
                Shortcut
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                icon={<BoltIcon />}
                extras={<SidebarSecondaryMenuItemExtras variant="externalLink" />}
              >
                External link
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem
                href="#"
                icon={<DatabaseIcon />}
                extras={
                  <SidebarSecondaryMenuItemExtras
                    variant="tag"
                    tag={<Tag variant="neutral" size="sm">New</Tag>}
                  />
                }
              >
                With tag
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                icon={<LayoutGridIcon />}
                extras={
                  <SidebarSecondaryMenuItemExtras
                    variant="tag-externalLink"
                    tag={<Tag variant="neutral" size="sm">Beta</Tag>}
                  />
                }
              >
                Tag + external link
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
              </SidebarSecondaryMenu>
            </SidebarSecondarySection>
          </SidebarSecondaryContent>
            {/* Controlled: the trigger calls toggleExpanded → onExpandedChange,
              and this consumer owns the `expanded` state. */}
          <SidebarSecondaryFooter>
            <SidebarSecondaryMenu>
              <SidebarSecondaryCollapseTrigger icon={<ChevronsLeftIcon />} extras={<SidebarSecondaryMenuItemExtras variant="shortcut" shortcut="⌘?" />}>
                Collapse
              </SidebarSecondaryCollapseTrigger>
            </SidebarSecondaryMenu>
          </SidebarSecondaryFooter>
        </SidebarSecondary>
      </Shell>
    );
  },
};

// Collapsible sections (Figma "Section" expandable variant). Mirrors the
// "Protection" reference: one open section of items, several collapsed sections,
// and a header-less section ("Chat").
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
              <SidebarSecondaryMenuItem href="#">Runbooks</SidebarSecondaryMenuItem>
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
            <SidebarSecondaryCollapseTrigger icon={<ChevronsLeftIcon />} extras={<SidebarSecondaryMenuItemExtras variant="shortcut" shortcut="⌘?" />}>
              Collapse
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
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <ButtonIcon aria-label="Create dashboard">
                        <PlusIcon />
                      </ButtonIcon>
                    }
                  />
                  <TooltipContent>Create dashboard</TooltipContent>
                </Tooltip>
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
              <SidebarSecondaryMenuItem
                href="#"
                extras={
                  <SidebarSecondaryMenuItemExtras
                    variant="tag"
                    tag={<Tag variant="neutral" size="sm">12</Tag>}
                  />
                }
              >
                Alerts
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem
                href="#"
                extras={
                  <SidebarSecondaryMenuItemExtras
                    variant="tag"
                    tag={<Tag variant="neutral" size="sm">10</Tag>}
                  />
                }
              >
                Activities
              </SidebarSecondaryMenuItem>
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
            <SidebarSecondaryCollapseTrigger icon={<ChevronsLeftIcon />} extras={<SidebarSecondaryMenuItemExtras variant="shortcut" shortcut="⌘?" />}>
              Collapse
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    </Shell>
  ),
};

// ---------------------------------------------------------------------------
// Realistic example: expandable sections with computed rollup counts
// ---------------------------------------------------------------------------

// A real developer would have per-item data and derive the section total.
const devicesData = [
  { label: 'All devices', count: 932 },
  { label: 'Managed devices', count: null },
  { label: 'Discovered devices', count: 56 },
] as const;

const devicesTotal = devicesData.reduce((sum, d) => sum + (d.count ?? 0), 0);

export const RealisticAssets: Story = {
  name: 'Realistic (computed rollup counts)',
  render: () => (
    <Shell height={600}>
      <SidebarSecondary>
        <SidebarSecondaryHeader label="Assets" />
        <SidebarSecondaryContent>
          {/* Devices — expandable, with a rollup tag that shows the section
              total only while the section is collapsed. */}
          <SidebarSecondarySection expandable>
            <SidebarSecondarySectionLabel
              unreadRollup={
                <Tag variant="neutral" size="sm">
                  {devicesTotal}
                </Tag>
              }
            >
              Devices
            </SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              {devicesData.map((item) => (
                <SidebarSecondaryMenuItem
                  key={item.label}
                  href="#"
                  selected={item.label === 'All devices'}
                  extras={
                    item.count != null ? (
                      <SidebarSecondaryMenuItemExtras
                        variant="tag"
                        tag={
                          <Tag variant="neutral" size="sm">
                            {item.count}
                          </Tag>
                        }
                      />
                    ) : undefined
                  }
                >
                  {item.label}
                </SidebarSecondaryMenuItem>
              ))}
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>

          {/* Remaining sections — expandable but without counts */}
          {['Virtualization', 'Public cloud', 'SaaS', 'Network'].map((name) => (
            <SidebarSecondarySection key={name} expandable defaultOpen={false}>
              <SidebarSecondarySectionLabel>{name}</SidebarSecondarySectionLabel>
              <SidebarSecondaryMenu>
                <SidebarSecondaryMenuItem href="#">Overview</SidebarSecondaryMenuItem>
                <SidebarSecondaryMenuItem href="#">Settings</SidebarSecondaryMenuItem>
              </SidebarSecondaryMenu>
            </SidebarSecondarySection>
          ))}
        </SidebarSecondaryContent>
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryCollapseTrigger
              icon={<ChevronsLeftIcon />}
              extras={<SidebarSecondaryMenuItemExtras variant="shortcut" shortcut="⌘?" />}
            >
              Collapse
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    </Shell>
  ),
};

export const Localized: Story = {
  name: 'Localized resize labels (es)',
  render: () => (
    <Shell>
      <SidebarSecondary
        resizeAriaLabel="Redimensionar barra lateral"
        resizeTooltipExpanded={
          <>
            <span className="font-semibold">Redimensionar:</span> Arrastrar
            <br />
            <span className="font-semibold">Colapsar:</span> Clic
            <br />
            <span className="font-semibold">Restablecer:</span> Doble clic
          </>
        }
        resizeTooltipCollapsed={
          <>
            <span className="font-semibold">Redimensionar:</span> Arrastrar
            <br />
            <span className="font-semibold">Expandir:</span> Clic
          </>
        }
      >
        <SidebarSecondaryHeader label="Protección" />
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>
              Descripción general
            </SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#" icon={<LayoutGridIcon />} selected>
                Panel
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#" icon={<DatabaseIcon />}>
                Dispositivos
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryCollapseTrigger icon={<ChevronsLeftIcon />} expandTooltip="Expandir" extras={<SidebarSecondaryMenuItemExtras variant="shortcut" shortcut="⌘?" />}>
              Contraer
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    </Shell>
  ),
};

export const NotResizable: Story = {
  name: 'Not resizable (fixed width)',
  render: () => (
    <Shell height={600}>
      <SidebarSecondary resizable={false}>
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
              <SidebarSecondaryMenuItem href="#" icon={<DatabaseIcon />}>
                Devices
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#" icon={<SquareIcon />}>
                Policies
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
      </Shell>
  ),
};
