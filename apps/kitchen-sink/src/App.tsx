import { useEffect, useState, type ReactNode } from 'react';

import { applyTheme, type ColorMode } from '@/lib/tokens';
import { ColorsSection } from '@/sections/colors';
import { ComponentsSection } from '@/sections/components';
import { IconsSection } from '@/sections/icons';
import { TypographySection } from '@/sections/typography';

const SECTION_MARGIN_BOTTOM = 56;
const SECTION_SCROLL_MARGIN_TOP = 72;
const SECTION_HEADING_FONT_SIZE = 20;
const SECTION_HEADING_MARGIN_BOTTOM = 20;
const SECTION_HEADING_PADDING_BOTTOM = 8;

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      style={{
        marginBottom: SECTION_MARGIN_BOTTOM,
        scrollMarginTop: SECTION_SCROLL_MARGIN_TOP,
      }}
    >
      <h2
        style={{
          fontSize: SECTION_HEADING_FONT_SIZE,
          marginBottom: SECTION_HEADING_MARGIN_BOTTOM,
          paddingBottom: SECTION_HEADING_PADDING_BOTTOM,
          borderBottom: '1px solid var(--ui-border-on-surface-divider)',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

const SECTIONS = [
  { id: 'colors', title: 'Colors & tokens', Component: ColorsSection },
  { id: 'typography', title: 'Typography', Component: TypographySection },
  { id: 'components', title: 'Components', Component: ComponentsSection },
  { id: 'icons', title: 'Icons', Component: IconsSection },
];

const HEADER_PADDING_Y = 12;
const HEADER_PADDING_X = 24;
const MAIN_CONTENT_MAX_WIDTH = 1080;
const MAIN_CONTENT_PADDING_TOP = 32;
const MAIN_CONTENT_PADDING_HORIZONTAL = 24;
const MAIN_CONTENT_PADDING_BOTTOM = 96;

export default function App() {
  const [mode, setMode] = useState<ColorMode>('light');

  // Light/dark drives the tokens' `light-dark()` via `color-scheme`.
  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

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
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: `${HEADER_PADDING_Y}px ${HEADER_PADDING_X}px`,
          background: 'var(--ui-background-surface-primary)',
          borderBottom: '1px solid var(--ui-border-on-surface-divider)',
        }}
      >
        <strong>Acronis UI — Kitchen Sink</strong>
        <nav
          style={{ display: 'flex', gap: 16, marginLeft: 'auto', fontSize: 13 }}
        >
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{ color: 'var(--ui-text-on-surface-link)' }}
            >
              {s.title}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            cursor: 'pointer',
            border: '1px solid var(--ui-border-on-surface-border)',
            background: 'var(--ui-background-surface-secondary)',
            color: 'inherit',
          }}
        >
          {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <main
        style={{
          maxWidth: MAIN_CONTENT_MAX_WIDTH,
          margin: '0 auto',
          padding: `${MAIN_CONTENT_PADDING_TOP}px ${MAIN_CONTENT_PADDING_HORIZONTAL}px ${MAIN_CONTENT_PADDING_BOTTOM}px`,
        }}
      >
        {SECTIONS.map(({ id, title, Component }) => (
          <Section key={id} id={id} title={title}>
            <Component />
          </Section>
        ))}
      </main>
    </div>
  );
}
