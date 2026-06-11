import type { ComponentType } from 'react';
import { icons as solidMono } from '@acronis-platform/icons-react/solid-mono';
import { icons as solidMulti } from '@acronis-platform/icons-react/solid-multi';
import { icons as strokeMono } from '@acronis-platform/icons-react/stroke-mono';
import { icons as strokeMulti } from '@acronis-platform/icons-react/stroke-multi';

type IconMap = Record<string, ComponentType<{ size?: number }>>;

// The supported icon sizes (px) — each icon renders at all three so the
// size/stroke rules baked into icons-react (1.6 / 2 / 2.5px stroke) are visible.
const SIZES = [16, 24, 32] as const;

const PACKS: { name: string; icons: IconMap }[] = [
  { name: 'stroke-mono', icons: strokeMono },
  { name: 'solid-mono', icons: solidMono },
  { name: 'stroke-multi', icons: strokeMulti },
  { name: 'solid-multi', icons: solidMulti },
];

function Gallery({ icons }: { icons: IconMap }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 12,
      }}
    >
      {Object.entries(icons).map(([name, Icon]) => (
        <div
          key={name}
          title={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: 8,
            borderRadius: 6,
            border: '1px solid var(--ui-border-on-surface-border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 8,
              minHeight: 32,
            }}
          >
            {SIZES.map((size) => (
              <Icon key={size} size={size} />
            ))}
          </div>
          <span
            style={{
              fontSize: 9,
              color: 'var(--ui-text-on-surface-secondary)',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function IconsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <p
        style={{
          fontSize: 12,
          color: 'var(--ui-text-on-surface-secondary)',
          margin: 0,
        }}
      >
        Each icon is shown at all three sizes — sm 16px, md 24px, lg 32px —
        applying the per-size stroke weights (1.6 / 2 / 2.5px) baked into
        icons-react.
      </p>
      {PACKS.map((pack) => (
        <div key={pack.name}>
          <h3
            style={{
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              opacity: 0.6,
            }}
          >
            {pack.name}{' '}
            <span style={{ fontWeight: 400 }}>
              ({Object.keys(pack.icons).length})
            </span>
          </h3>
          <Gallery icons={pack.icons} />
        </div>
      ))}
    </div>
  );
}
