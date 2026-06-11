import type { Meta, StoryObj } from '@storybook/react-vite';

import { BoltIcon, icons, type IconName } from '../packs/stroke-mono';

/**
 * The `stroke-mono` pack, generated from `@acronis-platform/icons-svg-next`.
 * Icons use `currentColor` (inherit text color) and apply the design size +
 * stroke rules via the `size` prop.
 */
const meta = {
  title: 'Icons/Stroke Mono',
  component: BoltIcon,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof BoltIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <BoltIcon size={16} />
      <BoltIcon size={24} />
      <BoltIcon size={32} />
    </div>
  ),
};

export const InheritsColor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, fontSize: 32 }}>
      <span style={{ color: '#1763cf' }}>
        <BoltIcon size={32} />
      </span>
      <span style={{ color: '#d4380d' }}>
        <BoltIcon size={32} />
      </span>
      <span style={{ color: 'currentColor' }}>
        <BoltIcon size={32} />
      </span>
    </div>
  ),
};

export const Gallery: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: 16,
        maxWidth: 640,
      }}
    >
      {(Object.keys(icons) as IconName[]).map((name) => {
        const Icon = icons[name];
        return (
          <div
            key={name}
            title={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              fontSize: 10,
            }}
          >
            <Icon size={24} />
            <span style={{ color: '#888' }}>{name}</span>
          </div>
        );
      })}
    </div>
  ),
};
