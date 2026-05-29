import { useState } from 'react'
import {
  SecondaryMenu,
  SecondaryMenuContent,
  SecondaryMenuGroup,
  SecondaryMenuItem,
} from '@acronis-platform/shadcn-uikit/react'
import {
  BellIcon,
  HomeFolderIcon,
  MailIcon,
  SettingsIcon,
  UserIcon,
} from '@acronis-platform/shadcn-uikit'
export function SecondaryMenuWithIcons() {
  const [activeItem, setActiveItem] = useState('home')

  return (
    <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
      <SecondaryMenu>
        <SecondaryMenuContent>
          <SecondaryMenuGroup>
            <SecondaryMenuItem
              active={activeItem === 'home'}
              onClick={() => setActiveItem('home')}
              icon={<HomeFolderIcon className="h-4 w-4" />}
            >
              Home
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'profile'}
              onClick={() => setActiveItem('profile')}
              icon={<UserIcon className="h-4 w-4" />}
            >
              Profile
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'notifications'}
              onClick={() => setActiveItem('notifications')}
              icon={<BellIcon className="h-4 w-4" />}
            >
              Notifications
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'messages'}
              onClick={() => setActiveItem('messages')}
              icon={<MailIcon className="h-4 w-4" />}
            >
              Messages
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'config'}
              onClick={() => setActiveItem('config')}
              icon={<SettingsIcon className="h-4 w-4" />}
            >
              Configuration
            </SecondaryMenuItem>
          </SecondaryMenuGroup>
        </SecondaryMenuContent>
      </SecondaryMenu>
    </div>
  )
}
