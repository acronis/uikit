import type { Meta, StoryObj } from '@storybook/react-vite';

import { BanIcon, icons, type IconName } from '../packs/stroke-mono';

/**
 * The `stroke-mono` pack, generated from `@acronis-platform/design-assets`.
 * Icons use `currentColor` (inherit text color) and apply the design-assets
 * scale + stroke rules via the `size` prop.
 */
const meta = {
  title: 'Icons/Stroke Mono',
  component: BanIcon,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof BanIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <BanIcon size={16} />
      <BanIcon size={24} />
      <BanIcon size={32} />
    </div>
  ),
};

export const InheritsColor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, fontSize: 32 }}>
      <span style={{ color: '#1763cf' }}>
        <BanIcon size={32} />
      </span>
      <span style={{ color: '#d4380d' }}>
        <BanIcon size={32} />
      </span>
      <span style={{ color: 'currentColor' }}>
        <BanIcon size={32} />
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
