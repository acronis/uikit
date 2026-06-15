// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { SidebarPrimaryHeader, SidebarPrimaryContent, SidebarPrimaryFooter, SidebarPrimarySection, SidebarPrimaryMenu, SidebarPrimaryMenuItem, SidebarPrimaryMenuItemExtras } from '../sidebar-primary';
import { BoxIcon, UsersIcon, CircleHelpIcon } from '@acronis-platform/icons-react/stroke-mono';
import { SidebarPrimary } from '../sidebar-primary';

const meta = {
  title: 'UI/SidebarPrimary/All States (generated)',
  component: SidebarPrimary,
} satisfies Meta<typeof SidebarPrimary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <SidebarPrimary aria-label="Primary">
      <SidebarPrimaryHeader>
        <svg width={24} height={24} />
      </SidebarPrimaryHeader>
      <SidebarPrimaryContent>
        <SidebarPrimarySection>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="#" icon={<BoxIcon />} selected>
              Assets
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<UsersIcon />}>
              Clients
              <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘K" />
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
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <SidebarPrimary aria-label="Primary">
      <SidebarPrimaryHeader>
        <svg width={24} height={24} />
      </SidebarPrimaryHeader>
      <SidebarPrimaryContent>
        <SidebarPrimarySection>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="#" icon={<BoxIcon />} selected>
              Assets
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<UsersIcon />}>
              Clients
              <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘K" />
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
    </SidebarPrimary>,
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  render: () => <SidebarPrimary aria-label="Primary">
      <SidebarPrimaryHeader>
        <svg width={24} height={24} />
      </SidebarPrimaryHeader>
      <SidebarPrimaryContent>
        <SidebarPrimarySection>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="#" icon={<BoxIcon />} selected>
              Assets
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<UsersIcon />}>
              Clients
              <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘K" />
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
    </SidebarPrimary>,
};

export const FocusVisible: Story = {
  render: () => <SidebarPrimary aria-label="Primary">
      <SidebarPrimaryHeader>
        <svg width={24} height={24} />
      </SidebarPrimaryHeader>
      <SidebarPrimaryContent>
        <SidebarPrimarySection>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="#" icon={<BoxIcon />} selected>
              Assets
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<UsersIcon />}>
              Clients
              <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘K" />
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
    </SidebarPrimary>,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
