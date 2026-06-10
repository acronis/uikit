import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
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
    <div style={{ display: 'flex', gap: 48 }}>
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="secondary">Top</Button>} />
        <TooltipContent side="top">On top</TooltipContent>
      </Tooltip>
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="secondary">Bottom</Button>} />
        <TooltipContent side="bottom">On bottom</TooltipContent>
      </Tooltip>
    </div>
  ),
};
