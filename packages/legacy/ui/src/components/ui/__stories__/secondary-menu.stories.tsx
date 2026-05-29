import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { SettingsIcon, ShieldIcon, DbIcon, FileTextIcon, BellIcon, UsersIcon, HelpCircleIcon } from '@/components/icons'
import {
  SecondaryMenu,
  SecondaryMenuHeader,
  SecondaryMenuContent,
  SecondaryMenuGroup,
  SecondaryMenuItem,
  SecondaryMenuFooter,
} from '../secondary-menu'

const meta = {
  title: 'UI/SecondaryMenu',
  component: SecondaryMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SecondaryMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as React.ComponentProps<typeof SecondaryMenu>,
  render: () => (
    <SecondaryMenu className="h-[480px]">
      <SecondaryMenuContent>
        <SecondaryMenuGroup>
          <SecondaryMenuItem icon={<ShieldIcon />} active>
            Protection
          </SecondaryMenuItem>
          <SecondaryMenuItem icon={<DbIcon />}>
            Backups
          </SecondaryMenuItem>
          <SecondaryMenuItem icon={<FileTextIcon />}>
            Reports
          </SecondaryMenuItem>
        </SecondaryMenuGroup>
        <SecondaryMenuGroup>
          <SecondaryMenuItem icon={<SettingsIcon />}>
            Settings
          </SecondaryMenuItem>
        </SecondaryMenuGroup>
      </SecondaryMenuContent>
    </SecondaryMenu>
  ),
}

export const WithHeader: Story = {
  args: {} as React.ComponentProps<typeof SecondaryMenu>,
  render: () => (
    <SecondaryMenu className="h-[480px]">
      <SecondaryMenuHeader>
        <span className="font-semibold text-sm">Manage</span>
      </SecondaryMenuHeader>
      <SecondaryMenuContent>
        <SecondaryMenuGroup title="Protection">
          <SecondaryMenuItem icon={<ShieldIcon />} active>
            Overview
          </SecondaryMenuItem>
          <SecondaryMenuItem icon={<DbIcon />}>
            Backup Plans
          </SecondaryMenuItem>
          <SecondaryMenuItem icon={<FileTextIcon />}>
            Activity
          </SecondaryMenuItem>
        </SecondaryMenuGroup>
        <SecondaryMenuGroup title="Account">
          <SecondaryMenuItem icon={<UsersIcon />}>
            Users
          </SecondaryMenuItem>
          <SecondaryMenuItem icon={<BellIcon />}>
            Notifications
          </SecondaryMenuItem>
          <SecondaryMenuItem icon={<SettingsIcon />}>
            Settings
          </SecondaryMenuItem>
        </SecondaryMenuGroup>
      </SecondaryMenuContent>
    </SecondaryMenu>
  ),
}

export const WithFooter: Story = {
  args: {} as React.ComponentProps<typeof SecondaryMenu>,
  render: () => (
    <SecondaryMenu className="h-[480px]">
      <SecondaryMenuContent>
        <SecondaryMenuGroup>
          <SecondaryMenuItem icon={<ShieldIcon />} active>
            Protection
          </SecondaryMenuItem>
          <SecondaryMenuItem icon={<DbIcon />}>
            Backups
          </SecondaryMenuItem>
          <SecondaryMenuItem icon={<FileTextIcon />}>
            Reports
          </SecondaryMenuItem>
          <SecondaryMenuItem icon={<SettingsIcon />}>
            Settings
          </SecondaryMenuItem>
        </SecondaryMenuGroup>
      </SecondaryMenuContent>
      <SecondaryMenuFooter>
        <SecondaryMenuItem icon={<HelpCircleIcon />} className="px-0">
          Help & Support
        </SecondaryMenuItem>
      </SecondaryMenuFooter>
    </SecondaryMenu>
  ),
}

export const WithTags: Story = {
  args: {} as React.ComponentProps<typeof SecondaryMenu>,
  render: () => (
    <SecondaryMenu className="h-[480px]">
      <SecondaryMenuContent>
        <SecondaryMenuGroup title="Features">
          <SecondaryMenuItem icon={<ShieldIcon />} active>
            Protection
          </SecondaryMenuItem>
          <SecondaryMenuItem icon={<DbIcon />} tag="New">
            Backups
          </SecondaryMenuItem>
          <SecondaryMenuItem icon={<FileTextIcon />} tag="Beta">
            Reports
          </SecondaryMenuItem>
          <SecondaryMenuItem icon={<SettingsIcon />} disabled>
            Settings
          </SecondaryMenuItem>
        </SecondaryMenuGroup>
      </SecondaryMenuContent>
    </SecondaryMenu>
  ),
}
