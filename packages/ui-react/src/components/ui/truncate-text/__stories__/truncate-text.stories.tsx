import type { Meta, StoryObj } from '@storybook/react-vite';

import { TruncateText } from '../truncate-text';

const meta = {
  title: 'UI/TruncateText',
  component: TruncateText,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    children:
      'Acme Corporation International Holdings & Subsidiaries — Global Compliance Division',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'The text to display. Also used verbatim as the tooltip body when truncated.',
      table: { type: { summary: 'string' } },
    },
    mode: {
      control: 'select',
      options: ['end', 'middle'],
      description:
        "`'end'` (default) — CSS `text-overflow: ellipsis`; `'middle'` — canvas binary-search that preserves both ends, ideal for URLs and hashes.",
      table: {
        type: { summary: "'end' | 'middle'" },
        defaultValue: { summary: "'end'" },
      },
    },
    lines: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description:
        "Max lines before truncating (`'end'` mode only). `1` = single-line ellipsis; `>1` = multi-line clamp.",
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Which side the tooltip opens on.',
      table: {
        type: { summary: "'top' | 'bottom' | 'left' | 'right'" },
        defaultValue: { summary: "'top'" },
      },
    },
    defaultOpen: {
      control: 'boolean',
      description:
        'Force the tooltip open on mount (only when truncated). For stories / visual review.',
      table: { type: { summary: 'boolean' } },
    },
    className: {
      control: 'text',
      description: 'Merged onto the rendered `<span>`.',
      table: { type: { summary: 'string' } },
    },
  },
} satisfies Meta<typeof TruncateText>;

export default meta;
type Story = StoryObj<typeof meta>;

const LONG =
  'Acme Corporation International Holdings & Subsidiaries — Global Compliance Division';

/** End-truncation: the familiar CSS ellipsis. Tooltip appears on hover only when text is clipped. */
export const Default: Story = {
  render: (args) => (
    <div style={{ width: 300 }}>
      <TruncateText {...args} />
    </div>
  ),
};

/** Container is wide enough — text fits, no tooltip. */
export const Fits: Story = {
  args: { children: 'Acme Corp' },
  render: (args) => (
    <div style={{ width: 400 }}>
      <TruncateText {...args} />
    </div>
  ),
};

/** Multi-line clamp: wraps up to 2 lines, then clips with an ellipsis. */
export const MultilineClamped: Story = {
  args: { lines: 2 },
  render: (args) => (
    <div style={{ width: 200 }}>
      <TruncateText {...args}>{LONG}</TruncateText>
    </div>
  ),
};

/** Middle-truncation: preserves start and end — ideal for paths, URLs, and hashes. */
export const MiddleTruncated: Story = {
  args: { mode: 'middle' },
  render: (args) => (
    <div style={{ width: 200 }}>
      <TruncateText {...args}>{LONG}</TruncateText>
    </div>
  ),
};

/** Tooltip forced open — only appears when the text is actually truncated. */
export const TruncatedWithTooltip: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <div style={{ width: 200 }}>
      <TruncateText {...args}>{LONG}</TruncateText>
    </div>
  ),
};
