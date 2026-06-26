import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import { Button } from '../../button';
import { Toaster, toast } from '../toast';

const meta = {
  title: 'UI/Toast',
  component: Toaster,
  parameters: {
    layout: 'fullscreen',
    // Toasts portal to the page corner (outside #storybook-root); capture the
    // whole page and let them settle before screenshotting.
    snapshot: { fullPage: true, animationDelay: 500 },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-8">
      <Button
        onClick={() =>
          toast('Event created', { description: 'Monday, January 3rd at 6:00 PM' })
        }
      >
        Show toast
      </Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByText('Show toast'));
  },
};

export const Variants: Story = {
  render: () => (
    <div className="p-8">
      <Button
        onClick={() => {
          toast.success('Profile saved', {
            description: 'Your changes have been saved.',
          });
          toast.info('Update available', {
            description: 'Version 2.0.0 is ready to install.',
          });
          toast.warning('Disk space low', {
            description: 'Less than 10% remaining.',
          });
          toast.error('Delete failed', {
            description: 'Please try again or contact support.',
          });
        }}
      >
        Show variants
      </Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByText('Show variants'));
  },
};

export const WithAction: Story = {
  render: () => (
    <div className="p-8">
      <Button
        onClick={() =>
          toast.info('Event created', {
            description: 'Monday, January 3rd at 6:00 PM',
            action: { label: 'Undo', onClick: () => {} },
          })
        }
      >
        Show toast with action
      </Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByText('Show toast with action')
    );
  },
};
