import { Tree, TreeNode } from '@acronis-platform/shadcn-uikit/react'
import {
  FileIcon,
  FileTextIcon,
  FolderIcon,
  ImageIcon,
} from '@acronis-platform/shadcn-uikit'
import { MusicIcon } from '../icons/missing-icons'
const fileSystemData: TreeNode[] = [
  {
    id: '1',
    label: 'Documents',
    icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
    children: [
      {
        id: '1-1',
        label: 'Work',
        icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
        children: [
          {
            id: '1-1-1',
            label: 'Project.docx',
            icon: <FileTextIcon className="h-4 w-4 text-gray-500" />,
          },
          {
            id: '1-1-2',
            label: 'Report.pdf',
            icon: <FileIcon className="h-4 w-4 text-red-500" />,
          },
        ],
      },
      {
        id: '1-2',
        label: 'Personal',
        icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
        children: [
          {
            id: '1-2-1',
            label: 'Resume.pdf',
            icon: <FileIcon className="h-4 w-4 text-red-500" />,
          },
        ],
      },
    ],
  },
  {
    id: '2',
    label: 'Pictures',
    icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
    children: [
      {
        id: '2-1',
        label: 'Vacation',
        icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
        children: [
          {
            id: '2-1-1',
            label: 'beach.jpg',
            icon: <ImageIcon className="h-4 w-4 text-green-500" />,
          },
          {
            id: '2-1-2',
            label: 'sunset.jpg',
            icon: <ImageIcon className="h-4 w-4 text-green-500" />,
          },
        ],
      },
      {
        id: '2-2',
        label: 'Family',
        icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
        children: [
          {
            id: '2-2-1',
            label: 'portrait.jpg',
            icon: <ImageIcon className="h-4 w-4 text-green-500" />,
          },
        ],
      },
    ],
  },
  {
    id: '3',
    label: 'MusicIcon',
    icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
    children: [
      {
        id: '3-1',
        label: 'Favorites',
        icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
        children: [
          {
            id: '3-1-1',
            label: 'song1.mp3',
            icon: <MusicIcon className="h-4 w-4 text-purple-500" />,
          },
          {
            id: '3-1-2',
            label: 'song2.mp3',
            icon: <MusicIcon className="h-4 w-4 text-purple-500" />,
          },
        ],
      },
    ],
  },
]

export function TreeWithIconsAndCheckboxes() {
  return <Tree data={fileSystemData} showIcon showCheckbox defaultExpanded={['1', '1-1']} />
}
