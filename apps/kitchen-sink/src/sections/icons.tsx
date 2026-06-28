import type { ComponentType } from 'react';
import { icons as solidMono } from '@acronis-platform/icons-react/solid-mono';
import { icons as solidMulti } from '@acronis-platform/icons-react/solid-multi';
import { icons as strokeMono } from '@acronis-platform/icons-react/stroke-mono';
import { icons as strokeMulti } from '@acronis-platform/icons-react/stroke-multi';

type IconMap = Record<string, ComponentType<{ size?: number }>>;

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
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
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
            gap: 6,
            padding: 8,
            borderRadius: 6,
            border: '1px solid var(--ui-border-on-surface-border)',
          }}
        >
          <Icon size={24} />
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
