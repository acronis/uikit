import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

import { applyBrand, applyTheme, type Brand, type ColorMode } from '@/lib/tokens';
import { KsNavLink } from '@/lib/nav';
import { COMPONENTS } from '@/components/registry';

const BRANDS: Brand[] = ['acronis', 'deep-sky'];
const MODES: ColorMode[] = ['light', 'dark'];

const SECTIONS: { to: string; label: string }[] = [
  { to: '/tokens', label: 'Tokens' },
  { to: '/typography', label: 'Typography' },
  { to: '/icons', label: 'Icons' },
];

const HEADER_HEIGHT = 56;
const SIDEBAR_WIDTH = 232;

const control: CSSProperties = {
  padding: '6px 10px',
  borderRadius: 6,
  cursor: 'pointer',
  border: '1px solid var(--ui-border-on-surface-border)',
  background: 'var(--ui-background-surface-secondary)',
  color: 'inherit',
  fontSize: 13,
};

function navLinkStyle({ isActive }: { isActive: boolean }): CSSProperties {
  return {
    display: 'block',
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: 13,
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 400,
    color: isActive
      ? 'var(--ui-text-on-surface-primary)'
      : 'var(--ui-text-on-surface-secondary)',
    background: isActive ? 'var(--ui-background-surface-secondary)' : 'transparent',
  };
}

const groupHeading: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--ui-text-on-surface-secondary)',
  margin: '16px 0 4px',
  padding: '0 10px',
};

export function Layout() {
  const [searchParams, setSearchParams] = useSearchParams();

  const brand: Brand = BRANDS.includes(searchParams.get('brand') as Brand)
    ? (searchParams.get('brand') as Brand)
    : 'acronis';
  const mode: ColorMode = MODES.includes(searchParams.get('theme') as ColorMode)
    ? (searchParams.get('theme') as ColorMode)
    : 'light';

  // Light/dark drives `light-dark()` via `color-scheme`; brand layers deep-sky's
  // `:root` overrides on the acronis base. Both persist across routes.
  useEffect(() => {
    applyTheme(mode);
  }, [mode]);
  useEffect(() => {
    applyBrand(brand);
  }, [brand]);

  // Keep brand/theme in the URL so a view is shareable; preserve the rest.
  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next, { replace: true });
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif',
        background: 'var(--ui-background-surface-primary)',
        color: 'var(--ui-text-on-surface-primary)',
      }}
    >
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          height: HEADER_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 20px',
          background: 'var(--ui-background-surface-primary)',
          borderBottom: '1px solid var(--ui-border-on-surface-divider)',
        }}
      >
        <KsNavLink
          to="/"
          style={{ fontWeight: 700, textDecoration: 'none', color: 'inherit' }}
        >
          Acronis UI — Kitchen Sink
        </KsNavLink>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <select
            value={brand}
            onChange={(e) => setParam('brand', e.target.value)}
            aria-label="Brand"
            style={control}
          >
            <option value="acronis">Acronis</option>
            <option value="deep-sky">Deep Sky</option>
          </select>
          <button
            type="button"
            onClick={() => setParam('theme', mode === 'light' ? 'dark' : 'light')}
            style={control}
          >
            {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <aside
          style={{
            position: 'sticky',
            top: HEADER_HEIGHT,
            alignSelf: 'flex-start',
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            overflowY: 'auto',
            padding: '12px 8px 32px',
            borderRight: '1px solid var(--ui-border-on-surface-divider)',
          }}
        >
          <nav>
            <KsNavLink to="/" end style={navLinkStyle}>
              Overview
            </KsNavLink>
            <div style={groupHeading}>Foundations</div>
            {SECTIONS.map((s) => (
              <KsNavLink key={s.to} to={s.to} style={navLinkStyle}>
                {s.label}
              </KsNavLink>
            ))}
            <div style={groupHeading}>Components</div>
            <KsNavLink to="/components" end style={navLinkStyle}>
              All components
            </KsNavLink>
            {COMPONENTS.map((c) => (
              <KsNavLink key={c.slug} to={`/components/${c.slug}`} style={navLinkStyle}>
                {c.name}
              </KsNavLink>
            ))}
          </nav>
        </aside>

        <main
          style={{
            flex: 1,
            minWidth: 0,
            maxWidth: 1080,
            padding: '32px 28px 96px',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
