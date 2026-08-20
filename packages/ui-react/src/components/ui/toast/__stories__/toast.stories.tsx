import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import { Button } from '../../button';
import type { Locale } from '../../../../../.storybook/globals';
import { t } from '../../../../../.storybook/i18n';
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
  argTypes: {
    timeout: {
      control: 'number',
      description:
        "Default auto-dismiss delay in ms for toasts that don't set their own. `0` keeps a toast until dismissed.",
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '5000' },
        category: 'Behavior',
      },
    },
    limit: {
      control: 'number',
      description:
        'Maximum toasts shown at once; the oldest is dropped past the limit.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '3' },
        category: 'Behavior',
      },
    },
    label: {
      control: 'text',
      description: 'Accessible name for the toast region.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Notifications' },
        category: 'Content',
      },
    },
    closeAriaLabel: {
      control: 'text',
      description: "Accessible name for each toast's dismiss control.",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Close' },
        category: 'Content',
      },
    },
    portalContainer: {
      control: false,
      description:
        'Portal container for the stack. Pass a shadow-root mount for isolated-style previews; otherwise inherited from `PortalContainerProvider`.',
      table: { type: { summary: 'HTMLElement | null' }, category: 'Behavior' },
    },
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="p-8">
      <Button
        onClick={() =>
          toast('Event created', {
            description: 'Monday, January 3rd at 6:00 PM',
          })
        }
      >
        Show toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByText('Show toast'));
  },
};

// Every severity from the Figma component set: a neutral surface with the status
// carried by the border and the 6px leading status line. `limit` is raised so all
// five stay on screen for the snapshot.
export const Variants: Story = {
  render: (args) => (
    <div className="p-8">
      <Button
        onClick={() => {
          toast.info('Update available', {
            description: 'Version 2.0.0 is ready to install.',
          });
          toast.success('Profile saved', {
            description: 'Your changes have been saved.',
          });
          toast.warning('Disk space low', {
            description: 'Less than 10% remaining.',
          });
          toast.critical('Backup incomplete', {
            description: 'Three workloads were skipped.',
          });
          toast.danger('Delete failed', {
            description: 'Please try again or contact support.',
          });
        }}
      >
        Show variants
      </Button>
      <Toaster {...args} limit={5} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByText('Show variants'));
  },
};

// hasActions=true in the Figma: the row sits inside the content column, under the
// text, and wraps when it runs out of width. The first action defaults to the
// secondary button style and the rest to ghost.
export const WithActions: Story = {
  render: (args) => (
    <div className="p-8">
      <Button
        onClick={() =>
          toast.critical('Protect non-compliant devices', {
            description:
              'For all registered devices, ensure that a protection plan is applied.',
            actions: [
              { label: 'View devices', onClick: () => {} },
              { label: 'Dismiss for now', onClick: () => {} },
            ],
          })
        }
      >
        Show toast with actions
      </Button>
      <Toaster {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByText('Show toast with actions')
    );
  },
};

// hasDescription=false: the title's line box plus the text block's padding still
// matches the icon box, so nothing shifts.
export const TitleOnly: Story = {
  render: (args) => (
    <div className="p-8">
      <Button onClick={() => toast.success('Your changes were saved')}>
        Show title-only toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByText('Show title-only toast')
    );
  },
};

// dismissable=false in the Figma: the close control is dropped and the content
// column takes the width back. Swipe-to-dismiss is revoked too, so the toast only
// leaves on its timeout or via `toast.dismiss(id)`.
export const NotDismissable: Story = {
  render: (args) => (
    <div className="p-8">
      <Button
        onClick={() =>
          toast.warning('Maintenance in progress', {
            description: 'This banner clears itself when the job finishes.',
            dismissable: false,
          })
        }
      >
        Show non-dismissable toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByText('Show non-dismissable toast')
    );
  },
};

// No Figma variant for loading: the spinner replaces the status glyph and borrows
// the info chrome, and the toast persists until it is updated or dismissed.
export const Loading: Story = {
  render: (args) => (
    <div className="p-8">
      <Button onClick={() => toast.loading('Restoring backup…')}>
        Show loading toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByText('Show loading toast'));
  },
};

// The stack pins to the inline-end edge and the status line to the leading edge,
// so both follow the writing direction; the status icons are direction-agnostic
// and must not mirror.
export const Localized: Story = {
  render: (args, { globals }) => {
    const locale = (globals.locale as Locale) ?? 'en';
    return (
      <div className="p-8">
        <Button
          onClick={() =>
            toast.danger(t(locale, 'alertTitle'), {
              description: t(locale, 'alertDescription'),
              actions: [{ label: t(locale, 'submit'), onClick: () => {} }],
            })
          }
        >
          {t(locale, 'submit')}
        </Button>
        <Toaster {...args} closeAriaLabel={t(locale, 'close')} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getAllByRole('button')[0]);
  },
};
