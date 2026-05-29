import { useState } from 'react'
import {
  SecondaryMenu,
  SecondaryMenuContent,
  SecondaryMenuGroup,
  SecondaryMenuItem,
} from '@acronis-platform/shadcn-uikit/react'
import { ChevronRightIcon } from '@acronis-platform/shadcn-uikit'
export function SecondaryMenuWithRightIcons() {
  const [activeItem, setActiveItem] = useState('nav1')

  return (
    <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
      <SecondaryMenu>
        <SecondaryMenuContent>
          <SecondaryMenuGroup title="Navigation">
            <SecondaryMenuItem
              active={activeItem === 'nav1'}
              onClick={() => setActiveItem('nav1')}
              icon={<ChevronRightIcon className="h-4 w-4" />}
              iconPosition="right"
            >
              General Settings
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'nav2'}
              onClick={() => setActiveItem('nav2')}
              icon={<ChevronRightIcon className="h-4 w-4" />}
              iconPosition="right"
            >
              Privacy & Security
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'nav3'}
              onClick={() => setActiveItem('nav3')}
              icon={<ChevronRightIcon className="h-4 w-4" />}
              iconPosition="right"
            >
              Notifications
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'nav4'}
              onClick={() => setActiveItem('nav4')}
              icon={<ChevronRightIcon className="h-4 w-4" />}
              iconPosition="right"
            >
              Appearance
            </SecondaryMenuItem>
          </SecondaryMenuGroup>
        </SecondaryMenuContent>
      </SecondaryMenu>
    </div>
  )
}
