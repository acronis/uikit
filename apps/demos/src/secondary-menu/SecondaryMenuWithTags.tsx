import { useState } from 'react'
import {
  SecondaryMenu,
  SecondaryMenuContent,
  SecondaryMenuGroup,
  SecondaryMenuItem,
} from '@acronis-platform/shadcn-uikit/react'

export function SecondaryMenuWithTags() {
  const [activeItem, setActiveItem] = useState('feature1')

  return (
    <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
      <SecondaryMenu>
        <SecondaryMenuContent>
          <SecondaryMenuGroup title="Features">
            <SecondaryMenuItem
              active={activeItem === 'feature1'}
              onClick={() => setActiveItem('feature1')}
            >
              Dashboard
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'feature2'}
              onClick={() => setActiveItem('feature2')}
              tag="NEW"
            >
              Analytics
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'feature3'}
              onClick={() => setActiveItem('feature3')}
              tag="BETA"
            >
              AI Assistant
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'feature4'}
              onClick={() => setActiveItem('feature4')}
            >
              Reports
            </SecondaryMenuItem>
          </SecondaryMenuGroup>
        </SecondaryMenuContent>
      </SecondaryMenu>
    </div>
  )
}
