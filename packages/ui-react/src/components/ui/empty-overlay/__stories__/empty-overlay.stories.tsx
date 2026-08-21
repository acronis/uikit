import type { Meta, StoryObj } from '@storybook/react-vite';
import { InboxIcon } from '@acronis-platform/icons-react/stroke-mono';

import { EmptyOverlay } from '../empty-overlay';

const meta = {
  title: 'UI/EmptyOverlay',
  component: EmptyOverlay,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
      description: 'Icon rendered in the colored badge (an `icons-react` glyph, 24px).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    title: {
      control: 'text',
      description: 'The empty-state headline.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    description: {
      control: 'text',
      description: 'Supporting copy shown under the title.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    color: {
      control: 'select',
      options: [
        'teal',
        'violet',
        'red',
        'yellow',
        'orange',
        'blue',
        'gray',
        'green',
      ],
      description: 'Icon badge color, from the shared avatar palette.',
      table: {
        type: { summary: 'string' },
        category: 'Appearance',
        defaultValue: { summary: 'green' },
      },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the root.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <InboxIcon />,
    title: 'No object yet',
    description: 'Short description.',
  },
};

export const WithoutIcon: Story = {
  args: {
    title: 'No data to display',
    description: 'There is nothing to show here yet.',
  },
};

export const TitleOnly: Story = {
  args: {
    icon: <InboxIcon />,
    title: 'No messages',
  },
};

export const Colors: Story = {
  args: { title: 'No object yet' },
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {(
        [
          'teal',
          'violet',
          'red',
          'yellow',
          'orange',
          'blue',
          'gray',
          'green',
        ] as const
      ).map((color) => (
        <div key={color} className="h-64 rounded-lg border border-border">
          <EmptyOverlay
            icon={<InboxIcon />}
            title={color}
            description="Short description."
            color={color}
          />
        </div>
      ))}
    </div>
  ),
};
