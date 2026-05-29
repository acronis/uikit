import { useState } from 'react'
import {
  SecondaryMenu,
  SecondaryMenuContent,
  SecondaryMenuGroup,
  SecondaryMenuItem,
} from '@acronis-platform/shadcn-uikit/react'
import { FileTextIcon, ImageIcon, VideosIcon } from '@acronis-platform/shadcn-uikit'
import { MusicIcon } from '../icons/missing-icons'
export function SecondaryMenuWithDisabled() {
  const [activeItem, setActiveItem] = useState('opt1')

  return (
    <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
      <SecondaryMenu>
        <SecondaryMenuContent>
          <SecondaryMenuGroup title="Options">
            <SecondaryMenuItem
              active={activeItem === 'opt1'}
              onClick={() => setActiveItem('opt1')}
              icon={<FileTextIcon className="h-4 w-4" />}
            >
              Available Option
            </SecondaryMenuItem>
            <SecondaryMenuItem disabled icon={<ImageIcon className="h-4 w-4" />}>
              Disabled Option
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'opt3'}
              onClick={() => setActiveItem('opt3')}
              icon={<VideosIcon className="h-4 w-4" />}
            >
              Another Available
            </SecondaryMenuItem>
            <SecondaryMenuItem disabled icon={<MusicIcon className="h-4 w-4" />}>
              Coming Soon
            </SecondaryMenuItem>
          </SecondaryMenuGroup>
        </SecondaryMenuContent>
      </SecondaryMenu>
    </div>
  )
}
