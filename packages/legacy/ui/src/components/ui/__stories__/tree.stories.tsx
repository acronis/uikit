import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tree } from '../tree'

const meta = {
  title: 'UI/Tree',
  component: Tree,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Tree>

export default meta
type Story = StoryObj<typeof meta>

const treeData = [
  {
    id: '1',
    label: 'Parent 1',
    children: [
      { id: '1-1', label: 'Child 1-1' },
      { id: '1-2', label: 'Child 1-2' },
    ],
  },
  {
    id: '2',
    label: 'Parent 2',
    children: [
      { id: '2-1', label: 'Child 2-1' },
      {
        id: '2-2',
        label: 'Child 2-2',
        children: [{ id: '2-2-1', label: 'Grandchild 2-2-1' }],
      },
    ],
  },
]

export const Default: Story = {
  args: {
    data: treeData,
  },
}
