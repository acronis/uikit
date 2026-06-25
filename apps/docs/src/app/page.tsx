import Link from 'next/link';
import { Inter } from 'next/font/google';
import { HomeLayout } from 'fumadocs-ui/layouts/home';

// Inter is the family the UIKit itself ships with — using it for the marketing
// headings keeps the landing page on-brand and reads as a professional product
// site rather than a futuristic showcase.
const display = Inter({ subsets: ['latin'], weight: ['600', '700', '800'] });

const features = [
  {
    title: 'Base UI Components',
    description:
      'Buttons, inputs, selects, navigation, and more — built on Base UI primitives for production use in enterprise products.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect
          x="2"
          y="2"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="11"
          y="2"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="2"
          y="11"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="11"
          y="11"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    title: 'Acronis Icon Set',
    description:
      'A tree-shakeable icon set from @acronis-platform/icons-react, covering enterprise and product interfaces.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle
          cx="4.5"
          cy="10"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="8.5"
          y="7.5"
          width="5"
          height="5"
          rx="0.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M17 12.5l-2.5-5-2.5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Token-Driven Theming',
    description:
      'Light, dark, and brand themes from generated --ui-* design tokens — switch with a data attribute, no rebuild.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10 2a8 8 0 010 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'TypeScript-first',
    description:
      'Every component is fully typed. IntelliSense, autocomplete, and type safety built in from the ground up.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M3 6l4 4-4 4M10 14h7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Accessible',
    description:
      'Built on Base UI primitives with WAI-ARIA compliance and full keyboard navigation out of the box.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle
          cx="10"
          cy="4"
          r="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M10 6.5v5M7 8.5l-2 4M13 8.5l2 4M7.5 18l2.5-4 2.5 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Zero Configuration',
    description:
      'Import the styles, use the components. No build plugins, no extra setup, no configuration required.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M11 2L5 11h4.5l-.5 7 6-9H10.5L11 2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const stats = [
  { value: '24', label: 'Components' },
  { value: '470+', label: 'Icons' },
  { value: '2', label: 'Brands' },
  { value: '100%', label: 'TypeScript' },
];

const mono: React.CSSProperties = { fontFamily: 'ui-monospace, monospace' };
const muted = 'var(--color-fd-muted-foreground, #64748b)';
const primary = 'var(--color-fd-primary)';

export default function HomePage() {
  return (
    <HomeLayout
      nav={{ title: 'Acronis UIKit', transparentMode: 'top' }}
      githubUrl="https://github.com/acronis/uikit"
      links={[
        { type: 'main', text: 'Documentation', url: '/docs' },
        { type: 'main', text: 'Components', url: '/docs/components' },
        { type: 'main', text: 'Storybook', url: '/storybook-react' },
        // { type: 'main', text: 'Demo', url: '/demo' },
      ]}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center overflow-hidden px-4 text-center"
        style={{ paddingTop: '7rem', paddingBottom: '8rem' }}
      >
        {/* Soft brand tint — subtle, no sci-fi grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 75% 50% at 50% -12%, hsl(213 94% 51% / 0.06), transparent 72%)',
          }}
        />

        {/* Badge */}
        <div
          className="hero-animate hero-animate-1 mb-10 inline-flex items-center gap-2 rounded-full border bg-fd-background/90 backdrop-blur-sm"
          style={{ padding: '0.4rem 1rem' }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: primary }}
          />
          <span
            style={{
              ...mono,
              fontSize: '0.6875rem',
              letterSpacing: '0.05em',
              color: muted,
            }}
          >
            Base UI · Tailwind CSS · Design Tokens
          </span>
        </div>

        {/* Headline */}
        <h1
          className={`${display.className} hero-animate hero-animate-2`}
          style={{
            fontSize: 'clamp(2.75rem, 7vw, 4.5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            maxWidth: '44rem',
          }}
        >
          Acronis <span style={{ color: primary }}>UIKit</span>
        </h1>

        {/* Subheadline */}
        <p
          className="hero-animate hero-animate-3"
          style={{
            maxWidth: '34rem',
            fontSize: '1.125rem',
            lineHeight: 1.75,
            color: muted,
            marginBottom: '3rem',
          }}
        >
          A production-ready component library for building Acronis products —
          accessible, themeable, and fully typed.
        </p>

        {/* CTAs */}
        <div className="hero-animate hero-animate-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/docs/getting-started"
            className="cta-primary inline-flex items-center gap-2 rounded-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              background: primary,
              color: 'var(--color-fd-primary-foreground)',
              height: '2.75rem',
              padding: '0 1.75rem',
              fontSize: '0.9375rem',
            }}
          >
            Get Started
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M6 12l4-4-4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link
            href="/docs/components"
            className="inline-flex items-center gap-2 rounded-lg border font-semibold transition-colors hover:bg-fd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-offset-2"
            style={{
              height: '2.75rem',
              padding: '0 1.75rem',
              fontSize: '0.9375rem',
            }}
          >
            Browse Components
          </Link>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="border-y bg-fd-muted/30">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '56rem',
            margin: '0 auto',
          }}
        >
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className={i < stats.length - 1 ? 'sm:border-r' : ''}
              style={{
                flex: '1 1 140px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '3.5rem 2rem',
              }}
            >
              <span
                className={display.className}
                style={{
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  lineHeight: 1,
                  color: primary,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {value}
              </span>
              <span
                style={{
                  ...mono,
                  fontSize: '0.6875rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: muted,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: '7rem', paddingBottom: '7rem' }}>
        <div
          style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1.5rem' }}
        >
          {/* Header */}
          <div style={{ marginBottom: '4rem' }}>
            <p
              style={{
                ...mono,
                fontSize: '0.6875rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: muted,
                marginBottom: '0.875rem',
              }}
            >
              Capabilities
            </p>
            <h2
              className={display.className}
              style={{
                fontSize: 'clamp(2rem, 5vw, 2.75rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Everything you need.
            </h2>
          </div>

          {/* Editorial list — number / icon+title / description */}
          <div
            style={{ borderTop: '1px solid var(--color-fd-border, #e2e8f0)' }}
          >
            {features.map(({ icon, title, description }, index) => (
              <div
                key={title}
                className="feature-row"
                style={{
                  padding: '1.75rem 0',
                  borderBottom: '1px solid var(--color-fd-border, #e2e8f0)',
                }}
              >
                {/* Index */}
                <span
                  className="feature-row__index"
                  style={{
                    ...mono,
                    fontSize: '0.6875rem',
                    color: muted,
                    opacity: 0.5,
                    paddingTop: '0.1rem',
                    alignSelf: 'start',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Icon + title */}
                <div
                  className="feature-row__title"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                  }}
                >
                  <div
                    style={{
                      width: '2.25rem',
                      height: '2.25rem',
                      borderRadius: '0.5rem',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'hsl(213 94% 51% / 0.1)',
                      color: primary,
                    }}
                  >
                    {icon}
                  </div>
                  <h3
                    style={{
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {title}
                  </h3>
                </div>

                {/* Description */}
                <p
                  className="feature-row__desc"
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    color: muted,
                  }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Start ───────────────────────────────────────────────────── */}
      <section
        className="border-t bg-fd-muted/30"
        style={{ paddingTop: '7rem', paddingBottom: '7rem' }}
      >
        <div
          style={{ maxWidth: '42rem', margin: '0 auto', padding: '0 1.5rem' }}
        >
          <p
            style={{
              ...mono,
              fontSize: '0.6875rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: muted,
              marginBottom: '0.875rem',
              textAlign: 'center',
            }}
          >
            Installation
          </p>
          <h2
            className={display.className}
            style={{
              fontSize: 'clamp(2rem, 5vw, 2.75rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              textAlign: 'center',
              marginBottom: '1rem',
            }}
          >
            Ready in seconds.
          </h2>
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.9375rem',
              color: muted,
              marginBottom: '3.5rem',
              lineHeight: 1.7,
            }}
          >
            Install the package and start building immediately.
          </p>

          {/* Terminal */}
          <div
            className="overflow-hidden rounded-xl border bg-fd-card"
            style={{ marginBottom: '0.75rem' }}
          >
            <div
              className="flex items-center gap-2 border-b bg-fd-muted/40"
              style={{ padding: '0.625rem 1.25rem' }}
            >
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                <span className="block h-2.5 w-2.5 rounded-full bg-fd-border" />
                <span className="block h-2.5 w-2.5 rounded-full bg-fd-border" />
                <span className="block h-2.5 w-2.5 rounded-full bg-fd-border" />
              </div>
              <span style={{ ...mono, fontSize: '0.6875rem', color: muted }}>
                Terminal
              </span>
            </div>
            <pre
              style={{
                ...mono,
                fontSize: '0.8125rem',
                lineHeight: 1.7,
                padding: '1.25rem 1.5rem',
                overflowX: 'auto',
              }}
            >
              <code>
                <span style={{ color: muted, userSelect: 'none' }}>$ </span>
                {'npm install @acronis-platform/ui-react react react-dom'}
              </code>
            </pre>
          </div>

          {/* Code */}
          <div
            className="overflow-hidden rounded-xl border bg-fd-card"
            style={{ marginBottom: '3.5rem' }}
          >
            <div
              className="flex items-center gap-2 border-b bg-fd-muted/40"
              style={{ padding: '0.625rem 1.25rem' }}
            >
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                <span className="block h-2.5 w-2.5 rounded-full bg-fd-border" />
                <span className="block h-2.5 w-2.5 rounded-full bg-fd-border" />
                <span className="block h-2.5 w-2.5 rounded-full bg-fd-border" />
              </div>
              <span style={{ ...mono, fontSize: '0.6875rem', color: muted }}>
                app.tsx
              </span>
            </div>
            <pre
              style={{
                ...mono,
                fontSize: '0.8125rem',
                lineHeight: 1.85,
                padding: '1.5rem',
                overflowX: 'auto',
              }}
            >
              <code>
                <span style={{ color: muted }}>{'import '}</span>
                <span>{"'@acronis-platform/ui-react/styles';\n"}</span>
                <span style={{ color: muted }}>{'import '}</span>
                <span>{'{ Button } '}</span>
                <span style={{ color: muted }}>{'from '}</span>
                <span>{"'@acronis-platform/ui-react';\n\n"}</span>
                <span style={{ color: muted }}>
                  {'export default function '}
                </span>
                <span>{'App() {\n'}</span>
                <span>{'  return '}</span>
                <span style={{ color: primary }}>{'<Button>'}</span>
                <span>{'Hello UIKit'}</span>
                <span style={{ color: primary }}>{'</Button>'}</span>
                <span>{';\n}'}</span>
              </code>
            </pre>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link
              href="/docs/getting-started"
              className="cta-primary inline-flex items-center gap-2 rounded-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background: primary,
                color: 'var(--color-fd-primary-foreground)',
                height: '2.75rem',
                padding: '0 1.75rem',
                fontSize: '0.9375rem',
              }}
            >
              Read the full docs
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 12l4-4-4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className="border-t"
        style={{
          padding: '2rem 1rem',
          textAlign: 'center',
          ...mono,
          fontSize: '0.75rem',
          letterSpacing: '0.04em',
          color: muted,
        }}
      >
        Built by{' '}
        <a
          href="https://www.acronis.com"
          className="underline underline-offset-4 hover:text-fd-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          Acronis
        </a>
        {'  ·  '}
        <a
          href="https://github.com/acronis/uikit"
          className="underline underline-offset-4 hover:text-fd-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </footer>
    </HomeLayout>
  );
}
