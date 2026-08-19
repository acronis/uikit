import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BinIcon,
  CirclePauseIcon,
  CirclePlayIcon,
  CircleStopIcon,
  PencilIcon,
  PlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { ButtonGroupItem } from '../../button-group';
import { Timer } from '../timer';

const trackingActions = (
  <>
    <ButtonGroupItem aria-label="Pause">
      <CirclePauseIcon size={16} />
    </ButtonGroupItem>
    <ButtonGroupItem aria-label="Rename">
      <PencilIcon size={16} />
    </ButtonGroupItem>
    <ButtonGroupItem aria-label="Add entry">
      <PlusIcon size={16} />
    </ButtonGroupItem>
  </>
);

const meta = {
  title: 'UI/Timer',
  component: Timer,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description:
        'The formatted time to display. The component never ticks or formats — pass an already-formatted value. Rendered with tabular figures so the readout does not jitter as the digits change.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    children: {
      control: false,
      description:
        '`ButtonGroupItem` elements, in visual order. Omit them for a read-only readout — the divider goes with them.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    actionsLabel: {
      control: 'text',
      description:
        "Accessible name for the action cluster's toolbar. Localize it; the default is English.",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Timer actions' },
        category: 'Content',
      },
    },
    className: {
      control: false,
      description: 'Extra classes merged onto the container.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
  args: {
    value: '12:01:45',
    children: trackingActions,
  },
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

// The design's canonical composition: pause / rename / add, exactly as the
// Figma node ships it.
export const Default: Story = {};

// Without actions the toolbar is not rendered at all, and the readout — now the
// last child — drops its divider via `:last-child`.
export const ReadOnly: Story = {
  args: { children: undefined },
};

export const SingleAction: Story = {
  args: {
    actionsLabel: 'Playback',
    children: (
      <ButtonGroupItem aria-label="Resume">
        <CirclePlayIcon size={16} />
      </ButtonGroupItem>
    ),
  },
};

export const WithDisabledAction: Story = {
  args: {
    children: (
      <>
        <ButtonGroupItem aria-label="Pause">
          <CirclePauseIcon size={16} />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Discard" disabled>
          <BinIcon size={16} />
        </ButtonGroupItem>
      </>
    ),
  },
};

// A wide readout, to show that the container hugs its content rather than
// pinning the Figma frame's 224px width.
export const LongValue: Story = {
  args: { value: '128:59:59' },
};

// The clock is the consumer's, not the component's: this story owns the
// interval and hands `Timer` an already-formatted string. It starts paused so
// the story renders deterministically (and so its VR baseline is stable) —
// press Resume in Storybook to watch the tabular figures hold their width.
export const Interactive: Story = {
  args: { actionsLabel: 'Stopwatch' },
  render: (args) => {
    const [seconds, setSeconds] = React.useState(0);
    const [running, setRunning] = React.useState(false);

    React.useEffect(() => {
      if (!running) return;
      const id = setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => clearInterval(id);
    }, [running]);

    const pad = (n: number) => String(n).padStart(2, '0');
    const value = `${pad(Math.floor(seconds / 3600))}:${pad(
      Math.floor((seconds % 3600) / 60)
    )}:${pad(seconds % 60)}`;

    return (
      <Timer {...args} value={value}>
        <ButtonGroupItem
          aria-label={running ? 'Pause' : 'Resume'}
          onClick={() => setRunning((r) => !r)}
        >
          {running ? (
            <CirclePauseIcon size={16} />
          ) : (
            <CirclePlayIcon size={16} />
          )}
        </ButtonGroupItem>
        <ButtonGroupItem
          aria-label="Stop"
          onClick={() => {
            setRunning(false);
            setSeconds(0);
          }}
        >
          <CircleStopIcon size={16} />
        </ButtonGroupItem>
      </Timer>
    );
  },
};
