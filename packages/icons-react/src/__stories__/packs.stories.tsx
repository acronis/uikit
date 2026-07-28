import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { icons as solidMono } from '../packs/solid-mono';
import { icons as strokeMulti } from '../packs/stroke-multi';
import { icons as solidMulti } from '../packs/solid-multi';

const meta = { title: 'Icons/Packs' } satisfies Meta;
export default meta;
type Story = StoryObj;

function Gallery({
  icons,
}: {
  icons: Record<string, ComponentType>;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 16,
        maxWidth: 520,
      }}
    >
      {Object.entries(icons).map(([name, Icon]) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            fontSize: 10,
          }}
        >
          <Icon />
          <span style={{ color: '#888' }}>{name}</span>
        </div>
      ))}
    </div>
  );
}

/** Single-color fill icons — inherit text color via `currentColor`. */
export const SolidMono: Story = {
  render: () => (
    <div style={{ color: '#1763cf' }}>
      <Gallery icons={solidMono} />
    </div>
  ),
};

/** Multi-color stroke icons — authored colors preserved, stroke width from rules. */
export const StrokeMulti: Story = {
  render: () => <Gallery icons={strokeMulti} />,
};

/** Multi-color fill icons (gradients) — authored colors preserved. */
export const SolidMulti: Story = {
  render: () => <Gallery icons={solidMulti} />,
};
