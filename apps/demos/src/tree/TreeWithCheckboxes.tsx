import { Tree, TreeNode } from '@acronis-platform/shadcn-uikit/react'

const organizationData: TreeNode[] = [
  {
    id: 'company',
    label: 'Company',
    children: [
      {
        id: 'engineering',
        label: 'Engineering',
        children: [
          {
            id: 'frontend',
            label: 'Frontend Team',
            children: [
              { id: 'john', label: 'John Doe' },
              { id: 'jane', label: 'Jane Smith' },
            ],
          },
          {
            id: 'backend',
            label: 'Backend Team',
            children: [
              { id: 'bob', label: 'Bob Johnson' },
              { id: 'alice', label: 'Alice Williams' },
            ],
          },
        ],
      },
      {
        id: 'design',
        label: 'Design',
        children: [
          { id: 'sarah', label: 'Sarah Brown' },
          { id: 'mike', label: 'Mike Davis' },
        ],
      },
      {
        id: 'marketing',
        label: 'Marketing',
        children: [
          { id: 'emma', label: 'Emma Wilson' },
          { id: 'david', label: 'David Martinez' },
        ],
      },
    ],
  },
]

export function TreeWithCheckboxes() {
  return (
    <Tree
      data={organizationData}
      showCheckbox
      defaultExpanded={['company', 'engineering']}
      defaultChecked={['john', 'jane']}
    />
  )
}
