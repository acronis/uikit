import { useState } from 'react'
import {
  SecondaryMenu,
  SecondaryMenuContent,
  SecondaryMenuGroup,
  SecondaryMenuItem,
} from '@acronis-platform/shadcn-uikit/react'

export function SecondaryMenuBasic() {
  const [activeItem, setActiveItem] = useState('dashboard')

  return (
    <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
      <SecondaryMenu>
        <SecondaryMenuContent>
          <SecondaryMenuGroup>
            <SecondaryMenuItem
              active={activeItem === 'dashboard'}
              onClick={() => setActiveItem('dashboard')}
            >
              Dashboard
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'analytics'}
              onClick={() => setActiveItem('analytics')}
            >
              Analytics
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'reports'}
              onClick={() => setActiveItem('reports')}
            >
              Reports
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'settings'}
              onClick={() => setActiveItem('settings')}
            >
              Settings
            </SecondaryMenuItem>
          </SecondaryMenuGroup>
        </SecondaryMenuContent>
      </SecondaryMenu>
    </div>
  )
}
