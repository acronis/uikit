import { Tree, TreeNode } from '@acronis-platform/shadcn-uikit/react'

const deepData: TreeNode[] = [
  {
    id: 'level1',
    label: 'Level 1',
    children: [
      {
        id: 'level2',
        label: 'Level 2',
        children: [
          {
            id: 'level3',
            label: 'Level 3',
            children: [
              {
                id: 'level4',
                label: 'Level 4',
                children: [
                  {
                    id: 'level5',
                    label: 'Level 5',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

export function TreeDeepNesting() {
  return <Tree data={deepData} defaultExpanded={['level1', 'level2', 'level3', 'level4']} />
}
