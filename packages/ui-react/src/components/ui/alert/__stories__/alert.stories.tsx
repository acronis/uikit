import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CircleCheckIcon,
  CircleInfoIcon,
  CircleWarningIcon,
  SparkleIcon,
  TriangleWarningIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { Button } from '../../button';
import {
  Alert,
  AlertActions,
  AlertContent,
  AlertDescription,
  AlertIcon,
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
      options: [
        'info',
        'success',
        'warning',
        'critical',
        'destructive',
        'ai',
        'neutral',
      ],
      description: 'Status severity — sets the surface, text, and accent colors.',
      table: {
        type: {
          summary:
            "'info' | 'success' | 'warning' | 'critical' | 'destructive' | 'ai' | 'neutral'",
        },
        defaultValue: { summary: 'info' },
        category: 'Appearance',
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertIcon>
        <CircleInfoIcon size={16} />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the CLI.
        </AlertDescription>
      </AlertContent>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[400px]">
      <AlertIcon>
        <CircleWarningIcon size={16} />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </AlertContent>
    </Alert>
  ),
};

// An action at the right edge — AlertContent is flex-1, so AlertActions sits at
// the right; `self-center` centers it vertically against the text block.
export const ActionRightEdge: Story = {
  render: () => (
    <Alert className="w-[560px]">
      <AlertIcon>
        <CircleInfoIcon size={16} />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Protect non-compliant devices</AlertTitle>
        <AlertDescription>
          For all registered devices, ensure that a protection plan is applied and
          a scan has completed successfully within the last 24 hours.
        </AlertDescription>
      </AlertContent>
      <AlertActions className="self-center">
        <Button>View devices</Button>
      </AlertActions>
    </Alert>
  ),
};

// An action under the description — AlertActions sits inside AlertContent.
export const ActionBelow: Story = {
  render: () => (
    <Alert className="w-[420px]">
      <AlertIcon>
        <CircleInfoIcon size={16} />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Protect non-compliant devices</AlertTitle>
        <AlertDescription>
          For all registered devices, ensure that a protection plan is applied and
          a scan has completed within the last 24 hours.
        </AlertDescription>
        <AlertActions className="mt-2">
          <Button>View devices</Button>
          <Button variant="ghost">Dismiss</Button>
        </AlertActions>
      </AlertContent>
    </Alert>
  ),
};

const VARIANTS = [
  { variant: 'info', Icon: CircleInfoIcon, title: 'Information' },
  { variant: 'success', Icon: CircleCheckIcon, title: 'Success' },
  { variant: 'warning', Icon: CircleWarningIcon, title: 'Warning' },
  { variant: 'critical', Icon: TriangleWarningIcon, title: 'Critical' },
  { variant: 'destructive', Icon: CircleWarningIcon, title: 'Error' },
  { variant: 'ai', Icon: SparkleIcon, title: 'AI' },
  { variant: 'neutral', Icon: CircleInfoIcon, title: 'Neutral' },
] as const;

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[400px] flex-col gap-3">
      {VARIANTS.map(({ variant, Icon, title }) => (
        <Alert key={variant} variant={variant}>
          <AlertIcon>
            <Icon size={16} />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>The {variant} status banner.</AlertDescription>
          </AlertContent>
        </Alert>
      ))}
    </div>
  ),
};
