import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import type { Locale } from '../../../../../.storybook/globals';
import { t } from '../../../../../.storybook/i18n';
import {
  Alert,
  AlertActions,
  AlertClose,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertText,
  AlertTitle,
} from '../alert';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'critical', 'danger'],
      description:
        'Severity. Sets the border color, the leading status-line color, and the default status icon.',
      table: {
        type: {
          summary: "'info' | 'success' | 'warning' | 'critical' | 'danger'",
        },
        defaultValue: { summary: 'info' },
        category: 'Appearance',
      },
    },
    children: {
      control: false,
      description:
        'The composed parts — AlertIcon, AlertContent (AlertText + AlertTitle / AlertDescription, optionally AlertActions), AlertClose.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: 'text',
      description: 'Extra classes merged onto the banner root.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
    role: {
      control: 'text',
      description:
        'Defaults to "alert" so assistive tech announces the banner. Use "status" for non-urgent, polite messages.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'alert' },
        category: 'Behavior',
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'info' },
  render: (args) => (
    <Alert {...args}>
      <AlertIcon />
      <AlertContent>
        <AlertText>
          <AlertTitle>Title</AlertTitle>
          <AlertDescription>Description</AlertDescription>
        </AlertText>
      </AlertContent>
      <AlertClose />
    </Alert>
  ),
};

// Every severity, matching the Figma component set: a neutral surface with the
// status carried by the border and the 6px leading status line.
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-4">
      {(['info', 'success', 'warning', 'critical', 'danger'] as const).map(
        (variant) => (
          <Alert key={variant} variant={variant}>
            <AlertIcon />
            <AlertContent>
              <AlertText>
                <AlertTitle>Title</AlertTitle>
                <AlertDescription>Description</AlertDescription>
              </AlertText>
            </AlertContent>
            <AlertClose />
          </Alert>
        )
      )}
    </div>
  ),
};

// hasDescription=false in the Figma: the title's line box plus AlertText's
// padding still matches the icon box, so nothing shifts.
export const TitleOnly: Story = {
  render: () => (
    <Alert variant="success">
      <AlertIcon />
      <AlertContent>
        <AlertText>
          <AlertTitle>Your changes were saved</AlertTitle>
        </AlertText>
      </AlertContent>
      <AlertClose />
    </Alert>
  ),
};

// hasActions=true: the action row sits inside AlertContent, under the text, and
// wraps when it runs out of width.
export const WithActions: Story = {
  render: () => (
    <Alert variant="critical">
      <AlertIcon />
      <AlertContent>
        <AlertText>
          <AlertTitle>Protect non-compliant devices</AlertTitle>
          <AlertDescription>
            For all registered devices, ensure that a protection plan is applied
            and a scan has completed successfully within the last 24 hours.
          </AlertDescription>
        </AlertText>
        <AlertActions>
          <Button variant="secondary">View devices</Button>
          <Button variant="ghost">Dismiss for now</Button>
        </AlertActions>
      </AlertContent>
      <AlertClose />
    </Alert>
  ),
};

// Not every alert is dismissable — omit AlertClose and the row closes up.
export const NotDismissable: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertIcon />
      <AlertContent>
        <AlertText>
          <AlertTitle>Your trial ends in 3 days</AlertTitle>
          <AlertDescription>
            Add a payment method to keep your workloads protected.
          </AlertDescription>
        </AlertText>
      </AlertContent>
    </Alert>
  ),
};

// The status line and the dismiss button follow the writing direction; the
// status icons are direction-agnostic, so they must not mirror.
export const Localized: Story = {
  render: (args, { globals }) => {
    const locale = (globals.locale as Locale) ?? 'en';
    return (
      <Alert {...args} variant="danger">
        <AlertIcon />
        <AlertContent>
          <AlertText>
            <AlertTitle>{t(locale, 'alertTitle')}</AlertTitle>
            <AlertDescription>{t(locale, 'alertDescription')}</AlertDescription>
          </AlertText>
          <AlertActions>
            <Button variant="secondary">{t(locale, 'submit')}</Button>
          </AlertActions>
        </AlertContent>
        <AlertClose ariaLabel={t(locale, 'close')} />
      </Alert>
    );
  },
};
