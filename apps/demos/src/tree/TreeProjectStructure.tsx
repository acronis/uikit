import { Tree, TreeNode } from '@acronis-platform/shadcn-uikit/react'
import { FileTextIcon, FolderIcon } from '@acronis-platform/shadcn-uikit'
import { CodeIcon } from '../icons/missing-icons'
const projectData: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
    children: [
      {
        id: 'components',
        label: 'components',
        icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
        children: [
          {
            id: 'button.tsx',
            label: 'Button.tsx',
            icon: <CodeIcon className="h-4 w-4 text-blue-400" />,
          },
          {
            id: 'input.tsx',
            label: 'Input.tsx',
            icon: <CodeIcon className="h-4 w-4 text-blue-400" />,
          },
        ],
      },
      {
        id: 'utils',
        label: 'utils',
        icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
        children: [
          {
            id: 'helpers.ts',
            label: 'helpers.ts',
            icon: <CodeIcon className="h-4 w-4 text-blue-400" />,
          },
        ],
      },
      {
        id: 'app.tsx',
        label: 'App.tsx',
        icon: <CodeIcon className="h-4 w-4 text-blue-400" />,
      },
    ],
  },
  {
    id: 'public',
    label: 'public',
    icon: <FolderIcon className="h-4 w-4 text-blue-500" />,
    children: [
      {
        id: 'index.html',
        label: 'index.html',
        icon: <FileTextIcon className="h-4 w-4 text-orange-500" />,
      },
    ],
  },
  {
    id: 'package.json',
    label: 'package.json',
    icon: <FileTextIcon className="h-4 w-4 text-green-600" />,
  },
]

export function TreeProjectStructure() {
  return (
    <Tree
      data={projectData}
      showIcon
      defaultExpanded={['src', 'components']}
      onNodeToggle={(id) => console.log('Toggled:', id)}
    />
  )
}
