import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Uncontrolled initial open state of the tooltip popup.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state of the tooltip popup.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the tooltip, preventing it from opening.',
      table: { type: { summary: 'boolean' }, category: 'Behavior' },
    },
    trackCursorAxis: {
      control: 'select',
      options: ['none', 'x', 'y', 'both'],
      description: 'Which axis the popup follows the cursor along.',
      table: { type: { summary: "'none' | 'x' | 'y' | 'both'" }, category: 'Behavior' },
    },
    onOpenChange: {
      control: false,
      description: 'Fires with the new open state when the tooltip opens or closes.',
      table: {
        type: { summary: '(open: boolean, event?: Event) => void' },
        category: 'Events',
      },
    },
    children: {
      control: false,
      description: 'The TooltipTrigger and TooltipContent that compose the tooltip.',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="secondary">Hover me</Button>} />
      <TooltipContent>Helpful hint</TooltipContent>
    </Tooltip>
  ),
};

// `defaultOpen` renders the popup so it's visible in docs and VR snapshots;
// `fullPage` captures the portaled popup, `animationDelay` lets it settle.
export const Open: Story = {
  parameters: { snapshot: { fullPage: true, animationDelay: 400 } },
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger render={<Button variant="secondary">Hover me</Button>} />
      <TooltipContent>Helpful hint</TooltipContent>
    </Tooltip>
  ),
};

export const Sides: Story = {
  parameters: { snapshot: { fullPage: true, animationDelay: 400 } },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, max-content)',
        gap: 48,
      }}
    >
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="secondary">Top</Button>} />
        <TooltipContent side="top">On top</TooltipContent>
      </Tooltip>
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="secondary">Right</Button>} />
        <TooltipContent side="right">On right</TooltipContent>
      </Tooltip>
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="secondary">Bottom</Button>} />
        <TooltipContent side="bottom">On bottom</TooltipContent>
      </Tooltip>
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="secondary">Left</Button>} />
        <TooltipContent side="left">On left</TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const Delayed: Story = {
  render: () => (
    <TooltipProvider delay={500}>
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="secondary">Hover with delay</Button>}
        />
        <TooltipContent>Opens after 500ms</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button variant="secondary" onClick={() => setOpen((value) => !value)}>
          {open ? 'Hide tooltip' : 'Show tooltip'}
        </Button>
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger
            render={<Button variant="secondary">Controlled trigger</Button>}
          />
          <TooltipContent>Controlled tooltip</TooltipContent>
        </Tooltip>
      </div>
    );
  },
};

export const CustomPortalContainer: Story = {
  parameters: { snapshot: { animationDelay: 400 } },
  render: () => {
    const [portalContainer, setPortalContainer] =
      React.useState<HTMLDivElement | null>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Tooltip defaultOpen>
          <TooltipTrigger
            render={
              <Button variant="secondary">Inside custom container</Button>
            }
          />
          <TooltipContent portalContainer={portalContainer}>
            Portaled into the dashed box
          </TooltipContent>
        </Tooltip>
        <div
          ref={setPortalContainer}
          style={{ minHeight: 80, border: '1px dashed currentColor' }}
        />
      </div>
    );
  },
};

export const LightAndDark: Story = {
  parameters: { snapshot: { fullPage: true, animationDelay: 400 } },
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ padding: 24, border: '1px solid currentColor' }}>
        <Tooltip defaultOpen>
          <TooltipTrigger render={<Button variant="secondary">Light</Button>} />
          <TooltipContent>Light theme tooltip</TooltipContent>
        </Tooltip>
      </div>
      <div
        data-theme="dark"
        style={{
          padding: 24,
          border: '1px solid currentColor',
          background: '#111827',
          color: '#f9fafb',
        }}
      >
        <Tooltip defaultOpen>
          <TooltipTrigger render={<Button variant="secondary">Dark</Button>} />
          <TooltipContent>Dark theme tooltip</TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};
