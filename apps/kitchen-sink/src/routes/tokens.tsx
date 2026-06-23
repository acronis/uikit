import { useState } from 'react';

import { SpecimenPage } from '@/lib/specimen';
import {
  ComponentColors,
  SemanticColors,
  TokensIntro,
} from '@/sections/colors';

type Tab = 'semantic' | 'component';

const TABS: { key: Tab; label: string }[] = [
  { key: 'semantic', label: 'Semantic' },
  { key: 'component', label: 'Component' },
];

export function TokensRoute() {
  const [tab, setTab] = useState<Tab>('semantic');
  return (
    <SpecimenPage title="Tokens" description={<TokensIntro />}>
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: 4,
          borderRadius: 8,
          alignSelf: 'flex-start',
          background: 'var(--ui-background-surface-secondary)',
          border: '1px solid var(--ui-border-on-surface-divider)',
        }}
      >
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: active
                  ? 'var(--ui-text-on-surface-primary)'
                  : 'var(--ui-text-on-surface-secondary)',
                background: active
                  ? 'var(--ui-background-surface-primary)'
                  : 'transparent',
                boxShadow: active
                  ? '0 1px 2px rgba(0,0,0,0.12)'
                  : undefined,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'semantic' ? <SemanticColors /> : <ComponentColors />}
    </SpecimenPage>
  );
}
