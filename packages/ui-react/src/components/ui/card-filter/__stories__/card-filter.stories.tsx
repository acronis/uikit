import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleInfoIcon } from '@acronis-platform/icons-react/stroke-mono';

import { CardFilter } from '../card-filter';

const meta = {
  title: 'UI/CardFilter',
  component: CardFilter,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['static', 'static-empty', 'clickable'],
      description:
        'Visual style and interactivity — mirrors the Figma CardFilter `variant` property.',
      table: {
        type: { summary: "'static' | 'static-empty' | 'clickable'" },
        defaultValue: { summary: 'static' },
        category: 'Appearance',
      },
    },
    label: {
      control: 'text',
      description: 'Caption shown above the value.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    value: {
      control: 'text',
      description:
        'The prominent value. Ignored for `static-empty` (shows an em-dash).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    icon: {
      control: false,
      description:
        'Optional leading glyph (16px) rendered before the value. Hidden for `static-empty`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying element (e.g. render a clickable card as an `<a>`).',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
  args: {
    label: 'Active filters',
    value: '125',
    icon: <CircleInfoIcon />,
  },
} satisfies Meta<typeof CardFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Clickable: Story = {
  args: { variant: 'clickable' },
};

export const Empty: Story = {
  args: { variant: 'static-empty', label: 'Pending' },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <CardFilter label="Total assets" value="125" icon={<CircleInfoIcon />} />
      <CardFilter variant="static-empty" label="Pending" />
      <CardFilter
        variant="clickable"
        label="Active filters"
        value="3"
        icon={<CircleInfoIcon />}
      />
    </div>
  ),
};

export const WithoutIcon: Story = {
  args: { icon: undefined, label: 'Total assets' },
};
