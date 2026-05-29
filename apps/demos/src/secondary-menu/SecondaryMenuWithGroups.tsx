import { useState } from 'react'
import {
  SecondaryMenu,
  SecondaryMenuContent,
  SecondaryMenuGroup,
  SecondaryMenuItem,
} from '@acronis-platform/shadcn-uikit/react'
import {
  DownloadIcon,
  EditIcon,
  FileTextIcon,
  ImageIcon,
  TrashOIcon,
  UploadIcon,
  VideosIcon,
} from '@acronis-platform/shadcn-uikit'
import { MusicIcon } from '../icons/missing-icons'
export function SecondaryMenuWithGroups() {
  const [activeItem, setActiveItem] = useState('documents')

  return (
    <div className="border rounded-lg overflow-hidden" style={{ height: '500px' }}>
      <SecondaryMenu>
        <SecondaryMenuContent>
          <SecondaryMenuGroup title="Content">
            <SecondaryMenuItem
              active={activeItem === 'documents'}
              onClick={() => setActiveItem('documents')}
              icon={<FileTextIcon className="h-4 w-4" />}
            >
              Documents
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'images'}
              onClick={() => setActiveItem('images')}
              icon={<ImageIcon className="h-4 w-4" />}
            >
              Images
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'videos'}
              onClick={() => setActiveItem('videos')}
              icon={<VideosIcon className="h-4 w-4" />}
            >
              Videos
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'audio'}
              onClick={() => setActiveItem('audio')}
              icon={<MusicIcon className="h-4 w-4" />}
            >
              Audio Files
            </SecondaryMenuItem>
          </SecondaryMenuGroup>

          <SecondaryMenuGroup title="Actions">
            <SecondaryMenuItem
              active={activeItem === 'upload'}
              onClick={() => setActiveItem('upload')}
              icon={<UploadIcon className="h-4 w-4" />}
            >
              Upload
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'download'}
              onClick={() => setActiveItem('download')}
              icon={<DownloadIcon className="h-4 w-4" />}
            >
              Download
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'edit'}
              onClick={() => setActiveItem('edit')}
              icon={<EditIcon className="h-4 w-4" />}
            >
              Edit
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'delete'}
              onClick={() => setActiveItem('delete')}
              icon={<TrashOIcon className="h-4 w-4" />}
            >
              Delete
            </SecondaryMenuItem>
          </SecondaryMenuGroup>
        </SecondaryMenuContent>
      </SecondaryMenu>
    </div>
  )
}
