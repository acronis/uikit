import { useState } from 'react'
import {
  SecondaryMenu,
  SecondaryMenuContent,
  SecondaryMenuGroup,
  SecondaryMenuItem,
  SecondaryMenuHeader,
  SecondaryMenuFooter,
} from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

import {
  DownloadIcon,
  FileTextIcon,
  ImageIcon,
  UploadIcon,
} from '@acronis-platform/shadcn-uikit'
export function SecondaryMenuComplete() {
  const [activeItem, setActiveItem] = useState('recent1')

  return (
    <div className="border rounded-lg overflow-hidden" style={{ height: '500px' }}>
      <SecondaryMenu>
        <SecondaryMenuHeader>
          <h3 className="text-sm font-semibold text-[#243143]">File Manager</h3>
        </SecondaryMenuHeader>

        <SecondaryMenuContent>
          <SecondaryMenuGroup title="Recent">
            <SecondaryMenuItem
              active={activeItem === 'recent1'}
              onClick={() => setActiveItem('recent1')}
              icon={<FileTextIcon className="h-4 w-4" />}
            >
              Project Proposal
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'recent2'}
              onClick={() => setActiveItem('recent2')}
              icon={<ImageIcon className="h-4 w-4" />}
            >
              Design Mockups
            </SecondaryMenuItem>
          </SecondaryMenuGroup>

          <SecondaryMenuGroup title="Folders">
            <SecondaryMenuItem
              active={activeItem === 'folder1'}
              onClick={() => setActiveItem('folder1')}
              icon={<FileTextIcon className="h-4 w-4" />}
              iconPosition="left"
            >
              Documents
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'folder2'}
              onClick={() => setActiveItem('folder2')}
              icon={<ImageIcon className="h-4 w-4" />}
            >
              Media
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'folder3'}
              onClick={() => setActiveItem('folder3')}
              icon={<DownloadIcon className="h-4 w-4" />}
            >
              Downloads
            </SecondaryMenuItem>
          </SecondaryMenuGroup>
        </SecondaryMenuContent>

        <SecondaryMenuFooter>
          <Button variant="outline" size="sm" className="w-full">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </SecondaryMenuFooter>
      </SecondaryMenu>
    </div>
  )
}
