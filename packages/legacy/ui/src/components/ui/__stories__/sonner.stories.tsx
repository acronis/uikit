import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, waitFor, within } from 'storybook/test';
import { Toaster } from '../sonner';
import { Button } from '../button';
import { toast } from 'sonner';

const meta = {
  title: 'UI/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
    snapshot: { fullPage: true, animationDelay: 400 },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <>
      <Button
        onClick={() =>
          toast('Event has been created', {
            description: 'Monday, January 3rd at 6:00 PM',
          })
        }
      >
        Show Toast
      </Button>
      <Toaster />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Show Toast'));
    await waitFor(() => document.querySelector('[data-sonner-toast]'), {
      timeout: 2000,
    });
  },
};

export const Info: Story = {
  render: () => (
    <>
      <Button
        onClick={() =>
          toast.info('New update available', {
            description: 'Version 2.0.0 is ready to install',
          })
        }
      >
        Show Info
      </Button>
      <Toaster />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Show Info'));
    await waitFor(() => document.querySelector('[data-sonner-toast]'), {
      timeout: 2000,
    });
  },
};

export const Success: Story = {
  render: () => (
    <>
      <Button
        onClick={() =>
          toast.success('Profile saved', {
            description: 'Your changes have been saved successfully',
          })
        }
      >
        Show Success
      </Button>
      <Toaster />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Show Success'));
    await waitFor(() => document.querySelector('[data-sonner-toast]'), {
      timeout: 2000,
    });
  },
};

export const Warning: Story = {
  render: () => (
    <>
      <Button
        onClick={() =>
          toast.warning('Disk space running low', {
            description: 'Less than 10% of storage remaining',
          })
        }
      >
        Show Warning
      </Button>
      <Toaster />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Show Warning'));
    await waitFor(() => document.querySelector('[data-sonner-toast]'), {
      timeout: 2000,
    });
  },
};

export const Error: Story = {
  render: () => (
    <>
      <Button
        onClick={() =>
          toast.error('Failed to delete item', {
            description: 'Please try again or contact support',
          })
        }
      >
        Show Error
      </Button>
      <Toaster />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Show Error'));
    await waitFor(() => document.querySelector('[data-sonner-toast]'), {
      timeout: 2000,
    });
  },
};

export const Loading: Story = {
  render: () => (
    <>
      <Button
        onClick={() =>
          toast.loading('Processing request', {
            description: 'Please wait while we complete the operation',
          })
        }
      >
        Show Loading
      </Button>
      <Toaster />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Show Loading'));
    await waitFor(() => document.querySelector('[data-sonner-toast]'), {
      timeout: 2000,
    });
  },
};

export const WithAction: Story = {
  render: () => (
    <>
      <Button
        onClick={() =>
          toast.info('Event created', {
            description: 'Monday, January 3rd at 6:00 PM',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          })
        }
      >
        Show Toast with Action
      </Button>
      <Toaster />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Show Toast with Action'));
    await waitFor(() => document.querySelector('[data-sonner-toast]'), {
      timeout: 2000,
    });
  },
};

export const MultipleToasts: Story = {
  render: () => (
    <>
      <Button
        onClick={() => {
          toast.info('New update available', {
            description: 'Version 2.0.0 is ready to install',
          });
          toast.success('Profile saved', {
            description: 'Your changes have been saved successfully',
          });
          toast.warning('Disk space running low', {
            description: 'Less than 10% of storage remaining',
          });
          toast.error('Failed to delete item', {
            description: 'Please try again or contact support',
          });
          toast.loading('Processing request', {
            description: 'Please wait while we complete the operation',
          });
        }}
      >
        Show Multiple Toasts
      </Button>
      <Toaster />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Show Multiple Toasts'));
    await waitFor(() => document.querySelector('[data-sonner-toast]'), {
      timeout: 2000,
    });
  },
};
