import type { Meta, StoryObj } from '@storybook/react-vite'
import '../themes/acronis-electric.scss'
import '../themes/acronis-ocean.scss'
import '../themes/acronis-white-label.scss'
import '../themes/cyber-chat.scss'

const meta = {
  title: 'Themes/Layout Schemes',
  parameters: { layout: 'fullscreen', snapshot: { fullPage: true } },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/*  Theme registry                                                     */
/* ------------------------------------------------------------------ */

interface ThemeDef {
  className: string
  label: string
}

const CORE_THEMES: ThemeDef[] = [
  { className: 'theme-acronis-default', label: 'Acronis Default' },
  { className: 'theme-acronis-electric', label: 'Acronis Electric' },
  { className: 'theme-acronis-ocean', label: 'Acronis Ocean' },
  { className: 'theme-cyber-chat', label: 'Cyber Chat' },
]

const WHITE_LABEL_THEMES: ThemeDef[] = [
  { className: 'theme-purple', label: 'Purple' },
  { className: 'theme-brown', label: 'Brown' },
  { className: 'theme-sand', label: 'Sand' },
  { className: 'theme-light-gray', label: 'Light Gray' },
  { className: 'theme-dark-gray', label: 'Dark Gray' },
  { className: 'theme-ingram-micro', label: 'Ingram Micro' },
  { className: 'theme-red-fire-brick', label: 'Red Fire Brick' },
  { className: 'theme-yellow-1c', label: 'Yellow 1C' },
  { className: 'theme-deep-sky-itkontoret', label: 'Deep Sky (ITkontoret)' },
  { className: 'theme-blue-yellow-uss-signal', label: 'Blue Yellow (USS Signal)' },
  { className: 'theme-red-home-pl', label: 'Red (home.pl)' },
  { className: 'theme-orange-tsukaeru-helpox', label: 'Orange (Tsukaeru/Helpox)' },
  { className: 'theme-green-also-choise-df', label: 'Green (Also/Choise/DF)' },
  { className: 'theme-light-blue-hp', label: 'Light Blue (HP)' },
  { className: 'theme-purple-fusion-media', label: 'Purple (Fusion Media)' },
  { className: 'theme-virtual-one', label: 'Virtual One' },
  { className: 'theme-telstra', label: 'Telstra' },
  { className: 'theme-deep-purple', label: 'Deep Purple' },
  { className: 'theme-pinky', label: 'Pinky' },
  { className: 'theme-virtuozzo', label: 'Virtuozzo' },
]

/* ------------------------------------------------------------------ */
/*  Schematic layout                                                   */
/* ------------------------------------------------------------------ */

function LayoutSchematic({ themeClass, dark, label }: { themeClass: string; dark: boolean; label: string }) {
  const cls = dark ? `${themeClass} dark` : themeClass

  return (
    <div
      className={cls}
      style={{
        width: 260,
        height: 180,
        border: '1px solid hsl(var(--av-border))',
        borderRadius: 6,
        overflow: 'hidden',
        background: 'hsl(var(--av-background))',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, sans-serif',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 28,
          background: 'hsl(var(--av-muted))',
          borderBottom: '1px solid hsl(var(--av-border))',
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          gap: 6,
        }}
      >
        {/* Nav-active accent bar in header */}
        <div
          style={{
            width: 32,
            height: 14,
            borderRadius: 3,
            background: 'hsl(var(--av-nav-active))',
          }}
        />
        <div style={{ flex: 1 }} />
        <div
          style={{
            width: 24,
            height: 10,
            borderRadius: 3,
            background: 'hsl(var(--av-primary))',
          }}
        />
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div
          style={{
            width: 52,
            background: 'hsl(var(--av-nav-bg))',
            display: 'flex',
            flexDirection: 'column',
            padding: '6px 4px',
            gap: 4,
          }}
        >
          {/* Active nav item */}
          <div
            style={{
              height: 10,
              borderRadius: 3,
              background: 'hsl(var(--av-nav-active))',
            }}
          />
          {/* Nav items */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 8,
                borderRadius: 2,
                background: 'hsl(var(--av-nav-text))',
                opacity: 0.3,
              }}
            />
          ))}
        </div>

        {/* Main + Aside */}
        <div style={{ flex: 1, display: 'flex', padding: 6, gap: 6 }}>
          {/* Main content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {/* Title text */}
            <div
              style={{
                height: 8,
                width: '70%',
                borderRadius: 2,
                background: 'hsl(var(--av-foreground))',
                opacity: 0.85,
              }}
            />
            {/* Content card */}
            <div
              style={{
                flex: 1,
                borderRadius: 4,
                border: '1px solid hsl(var(--av-border))',
                background: 'hsl(var(--av-card, var(--av-elevated, var(--av-background))))',
                display: 'flex',
                flexDirection: 'column',
                padding: 5,
                gap: 4,
              }}
            >
              {/* Text lines */}
              <div style={{ height: 6, width: '90%', borderRadius: 2, background: 'hsl(var(--av-foreground))', opacity: 0.6 }} />
              <div style={{ height: 6, width: '60%', borderRadius: 2, background: 'hsl(var(--av-muted-foreground))', opacity: 0.5 }} />
              <div style={{ height: 6, width: '75%', borderRadius: 2, background: 'hsl(var(--av-muted-foreground))', opacity: 0.4 }} />
              <div style={{ flex: 1 }} />
              {/* Action row */}
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ height: 10, width: 36, borderRadius: 3, background: 'hsl(var(--av-primary))' }} />
                <div style={{ height: 10, width: 36, borderRadius: 3, border: '1px solid hsl(var(--av-border))', background: 'transparent' }} />
              </div>
            </div>
          </div>

          {/* Aside */}
          <div
            style={{
              width: 60,
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
          >
            {/* Aside card 1 */}
            <div
              style={{
                flex: 1,
                borderRadius: 4,
                background: 'hsl(var(--av-muted))',
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <div style={{ height: 5, width: '80%', borderRadius: 2, background: 'hsl(var(--av-foreground))', opacity: 0.5 }} />
              <div style={{ height: 5, width: '60%', borderRadius: 2, background: 'hsl(var(--av-muted-foreground))', opacity: 0.4 }} />
            </div>
            {/* Aside card 2 */}
            <div
              style={{
                flex: 1,
                borderRadius: 4,
                background: 'hsl(var(--av-muted))',
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <div style={{ height: 5, width: '70%', borderRadius: 2, background: 'hsl(var(--av-foreground))', opacity: 0.5 }} />
              <div style={{ height: 5, width: '50%', borderRadius: 2, background: 'hsl(var(--av-muted-foreground))', opacity: 0.4 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Label bar */}
      <div
        style={{
          height: 18,
          borderTop: '1px solid hsl(var(--av-border))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'hsl(var(--av-muted))',
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontWeight: 600,
            color: 'hsl(var(--av-foreground))',
            letterSpacing: 0.3,
          }}
        >
          {label} — {dark ? 'Dark' : 'Light'}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Theme pair (light + dark)                                          */
/* ------------------------------------------------------------------ */

function ThemePair({ theme }: { theme: ThemeDef }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <LayoutSchematic themeClass={theme.className} dark={false} label={theme.label} />
      <LayoutSchematic themeClass={theme.className} dark={true} label={theme.label} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Grid of themes                                                     */
/* ------------------------------------------------------------------ */

function ThemeGrid({ themes, title }: { themes: ThemeDef[]; title: string }) {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#1a1a1a' }}>
        {title}
      </h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        {themes.map((theme) => (
          <ThemePair key={theme.className} theme={theme} />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Text colors panel                                                  */
/* ------------------------------------------------------------------ */

function TextColorsSample({ themeClass, dark, label }: { themeClass: string; dark: boolean; label: string }) {
  const cls = dark ? `${themeClass} dark` : themeClass
  const tokens = [
    { token: '--av-foreground', name: 'foreground' },
    { token: '--av-text-primary', name: 'text-primary' },
    { token: '--av-muted-foreground', name: 'muted-foreground' },
    { token: '--av-secondary-foreground', name: 'secondary-fg' },
    { token: '--av-tertiary-foreground', name: 'tertiary-fg' },
    { token: '--av-brand-foreground', name: 'brand-fg' },
    { token: '--av-primary-foreground', name: 'primary-fg' },
    { token: '--av-destructive-foreground', name: 'destructive-fg' },
  ]

  return (
    <div
      className={cls}
      style={{
        width: 260,
        borderRadius: 6,
        border: '1px solid hsl(var(--av-border))',
        overflow: 'hidden',
        background: 'hsl(var(--av-background))',
        fontFamily: 'system-ui, sans-serif',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: '6px 10px',
          borderBottom: '1px solid hsl(var(--av-border))',
          background: 'hsl(var(--av-muted))',
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 600, color: 'hsl(var(--av-foreground))' }}>
          {label} — {dark ? 'Dark' : 'Light'}
        </span>
      </div>
      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {tokens.map(({ token, name }) => (
          <div key={token} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                border: '1px solid hsl(var(--av-border))',
                background: `hsl(var(${token}))`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: `hsl(var(${token}))`,
                whiteSpace: 'nowrap',
              }}
            >
              {name}: The quick brown fox
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TextColorsGrid({ themes, title }: { themes: ThemeDef[]; title: string }) {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#1a1a1a' }}>
        {title} — Text Colors
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {themes.map((theme) => (
          <div key={theme.className} style={{ display: 'flex', gap: 12 }}>
            <TextColorsSample themeClass={theme.className} dark={false} label={theme.label} />
            <TextColorsSample themeClass={theme.className} dark={true} label={theme.label} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

export const CoreThemes: Story = {
  render: () => <ThemeGrid themes={CORE_THEMES} title="Core Themes" />,
}

export const CoreThemesTextColors: Story = {
  render: () => <TextColorsGrid themes={CORE_THEMES} title="Core Themes" />,
}

export const WhiteLabelThemes: Story = {
  render: () => <ThemeGrid themes={WHITE_LABEL_THEMES} title="White-Label Themes" />,
}

export const WhiteLabelTextColors: Story = {
  render: () => <TextColorsGrid themes={WHITE_LABEL_THEMES} title="White-Label Themes" />,
}

export const AllThemes: Story = {
  render: () => (
    <div>
      <ThemeGrid themes={CORE_THEMES} title="Core Themes" />
      <div style={{ borderTop: '2px solid #e5e5e5', margin: '0 24px' }} />
      <ThemeGrid themes={WHITE_LABEL_THEMES} title="White-Label Themes" />
    </div>
  ),
}
