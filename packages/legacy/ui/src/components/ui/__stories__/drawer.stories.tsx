import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../drawer'
import { Button } from '../button'

const meta = {
  title: 'UI/Drawer',
  component: Drawer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Drawer>
      <Button variant="outline" asChild>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
      </Button>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>Drawer description goes here.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p>Drawer content</p>
        </div>
      </DrawerContent>
    </Drawer>
  ),
}

export const Open: Story = {
  render: () => (
    <Drawer>
      <Button variant="outline" asChild>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
      </Button>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>Drawer description goes here.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p>Drawer content</p>
        </div>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open Drawer' });
    await userEvent.click(trigger);
  },
};
