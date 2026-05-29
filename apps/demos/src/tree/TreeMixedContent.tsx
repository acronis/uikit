import { Tree, TreeNode } from '@acronis-platform/shadcn-uikit/react'
import { FolderIcon, ImageIcon, VideosIcon } from '@acronis-platform/shadcn-uikit'
import { MusicIcon } from '../icons/missing-icons'
const mixedData: TreeNode[] = [
  {
    id: 'media',
    label: 'Media Files',
    icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
    children: [
      {
        id: 'videos',
        label: 'Videos',
        icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
        children: [
          {
            id: 'video1',
            label: 'tutorial.mp4',
            icon: <VideosIcon className="h-4 w-4 text-red-500" />,
          },
          {
            id: 'video2',
            label: 'demo.mp4',
            icon: <VideosIcon className="h-4 w-4 text-red-500" />,
          },
        ],
      },
      {
        id: 'audio',
        label: 'Audio',
        icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
        children: [
          {
            id: 'audio1',
            label: 'podcast.mp3',
            icon: <MusicIcon className="h-4 w-4 text-purple-500" />,
          },
        ],
      },
      {
        id: 'images',
        label: 'Images',
        icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
        children: [
          {
            id: 'img1',
            label: 'logo.png',
            icon: <ImageIcon className="h-4 w-4 text-green-500" />,
          },
          {
            id: 'img2',
            label: 'banner.jpg',
            icon: <ImageIcon className="h-4 w-4 text-green-500" />,
          },
        ],
      },
    ],
  },
]

export function TreeMixedContent() {
  return (
    <Tree
      data={mixedData}
      showIcon
      showCheckbox
      defaultExpanded={['media', 'videos', 'images']}
    />
  )
}
