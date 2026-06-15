// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { SidebarSecondaryHeader, SidebarSecondaryContent, SidebarSecondaryCollapsedBreadcrumb, SidebarSecondaryFooter, SidebarSecondarySection, SidebarSecondarySectionLabel, SidebarSecondaryMenu, SidebarSecondaryMenuItem, SidebarSecondaryMenuSub, SidebarSecondaryMenuSubTrigger, SidebarSecondaryMenuSubContent, SidebarSecondaryMenuSubItem, SidebarSecondaryMenuItemExtras } from '../sidebar-secondary';
import { LayoutGridIcon, BoxIcon } from '@acronis-platform/icons-react/stroke-mono';
import { SidebarSecondary } from '../sidebar-secondary';

const meta = {
  title: 'UI/SidebarSecondary/All States (generated)',
  component: SidebarSecondary,
} satisfies Meta<typeof SidebarSecondary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <SidebarSecondary aria-label="Section navigation">
      <SidebarSecondaryHeader label="Protection" />
      <SidebarSecondaryContent>
        <SidebarSecondarySection>
          <SidebarSecondarySectionLabel>Overview</SidebarSecondarySectionLabel>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#" icon={<LayoutGridIcon />} selected>
              Dashboard
              <SidebarSecondaryMenuItemExtras variant="externalLink" />
            </SidebarSecondaryMenuItem>
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
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
      </SidebarSecondaryContent>
      <SidebarSecondaryCollapsedBreadcrumb parentLabel="Protection" currentLabel="Dashboard" />
      <SidebarSecondaryFooter>
        <SidebarSecondaryMenu>
          <SidebarSecondaryMenuItem href="#">Settings</SidebarSecondaryMenuItem>
        </SidebarSecondaryMenu>
      </SidebarSecondaryFooter>
    </SidebarSecondary>
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <SidebarSecondary aria-label="Section navigation">
      <SidebarSecondaryHeader label="Protection" />
      <SidebarSecondaryContent>
        <SidebarSecondarySection>
          <SidebarSecondarySectionLabel>Overview</SidebarSecondarySectionLabel>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#" icon={<LayoutGridIcon />} selected>
              Dashboard
              <SidebarSecondaryMenuItemExtras variant="externalLink" />
            </SidebarSecondaryMenuItem>
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
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
      </SidebarSecondaryContent>
      <SidebarSecondaryCollapsedBreadcrumb parentLabel="Protection" currentLabel="Dashboard" />
      <SidebarSecondaryFooter>
        <SidebarSecondaryMenu>
          <SidebarSecondaryMenuItem href="#">Settings</SidebarSecondaryMenuItem>
        </SidebarSecondaryMenu>
      </SidebarSecondaryFooter>
    </SidebarSecondary>,
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  render: () => <SidebarSecondary aria-label="Section navigation">
      <SidebarSecondaryHeader label="Protection" />
      <SidebarSecondaryContent>
        <SidebarSecondarySection>
          <SidebarSecondarySectionLabel>Overview</SidebarSecondarySectionLabel>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#" icon={<LayoutGridIcon />} selected>
              Dashboard
              <SidebarSecondaryMenuItemExtras variant="externalLink" />
            </SidebarSecondaryMenuItem>
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
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
      </SidebarSecondaryContent>
      <SidebarSecondaryCollapsedBreadcrumb parentLabel="Protection" currentLabel="Dashboard" />
      <SidebarSecondaryFooter>
        <SidebarSecondaryMenu>
          <SidebarSecondaryMenuItem href="#">Settings</SidebarSecondaryMenuItem>
        </SidebarSecondaryMenu>
      </SidebarSecondaryFooter>
    </SidebarSecondary>,
};

export const FocusVisible: Story = {
  render: () => <SidebarSecondary aria-label="Section navigation">
      <SidebarSecondaryHeader label="Protection" />
      <SidebarSecondaryContent>
        <SidebarSecondarySection>
          <SidebarSecondarySectionLabel>Overview</SidebarSecondarySectionLabel>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#" icon={<LayoutGridIcon />} selected>
              Dashboard
              <SidebarSecondaryMenuItemExtras variant="externalLink" />
            </SidebarSecondaryMenuItem>
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
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
      </SidebarSecondaryContent>
      <SidebarSecondaryCollapsedBreadcrumb parentLabel="Protection" currentLabel="Dashboard" />
      <SidebarSecondaryFooter>
        <SidebarSecondaryMenu>
          <SidebarSecondaryMenuItem href="#">Settings</SidebarSecondaryMenuItem>
        </SidebarSecondaryMenu>
      </SidebarSecondaryFooter>
    </SidebarSecondary>,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
