import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Themes/Color Tokens',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

interface SwatchProps {
  token: string
  label?: string
  textColor?: string
}

function Swatch({ token, label, textColor }: SwatchProps) {
  const isChart = token.startsWith('--av-chart-')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 120 }}>
      <div
        style={{
          width: '100%',
          height: 48,
          borderRadius: 6,
          border: '1px solid hsl(var(--av-border))',
          background: isChart ? `var(${token})` : `hsl(var(${token}))`,
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontFamily: 'monospace',
          color: textColor || 'hsl(var(--av-foreground))',
          wordBreak: 'break-all',
        }}
      >
        {label || token}
      </span>
    </div>
  )
}

interface SwatchGroupProps {
  title: string
  tokens: Array<{ token: string; label?: string }>
}

function SwatchGroup({ title, tokens }: SwatchGroupProps) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 12,
          color: 'hsl(var(--av-foreground))',
          borderBottom: '1px solid hsl(var(--av-border))',
          paddingBottom: 8,
        }}
      >
        {title}
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 16,
        }}
      >
        {tokens.map(({ token, label }) => (
          <Swatch key={token} token={token} label={label} />
        ))}
      </div>
    </div>
  )
}

function AllTokens() {
  return (
    <div
      style={{
        padding: 24,
        background: 'hsl(var(--av-background))',
        color: 'hsl(var(--av-foreground))',
        minHeight: '100vh',
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>
        Semantic Color Tokens
      </h2>

      <SwatchGroup
        title="Backgrounds"
        tokens={[
          { token: '--av-background', label: 'background' },
          { token: '--av-elevated', label: 'elevated' },
          { token: '--av-card', label: 'card' },
          { token: '--av-muted', label: 'muted' },
          { token: '--av-primary', label: 'primary' },
          { token: '--av-secondary', label: 'secondary' },
          { token: '--av-accent', label: 'accent' },
          { token: '--av-popover', label: 'popover' },
          { token: '--av-tooltip', label: 'tooltip' },
          { token: '--av-destructive', label: 'destructive' },
        ]}
      />

      <SwatchGroup
        title="Text / Foreground"
        tokens={[
          { token: '--av-foreground', label: 'foreground' },
          { token: '--av-text-primary', label: 'text-primary' },
          { token: '--av-card-foreground', label: 'card-foreground' },
          { token: '--av-popover-foreground', label: 'popover-foreground' },
          { token: '--av-primary-foreground', label: 'primary-foreground' },
          { token: '--av-muted-foreground', label: 'muted-foreground' },
          { token: '--av-secondary-foreground', label: 'secondary-foreground' },
          { token: '--av-tertiary-foreground', label: 'tertiary-foreground' },
          { token: '--av-accent-foreground', label: 'accent-foreground' },
          { token: '--av-brand-foreground', label: 'brand-foreground' },
          { token: '--av-text-inverse', label: 'text-inverse' },
          { token: '--av-destructive-foreground', label: 'destructive-foreground' },
        ]}
      />

      <SwatchGroup
        title="Borders"
        tokens={[
          { token: '--av-border', label: 'border' },
          { token: '--av-separator', label: 'separator' },
          { token: '--av-input', label: 'input' },
          { token: '--av-border-strong', label: 'border-strong' },
          { token: '--av-border-subtle', label: 'border-subtle' },
        ]}
      />

      <SwatchGroup
        title="Interactive"
        tokens={[
          { token: '--av-interactive-default', label: 'interactive-default' },
          { token: '--av-interactive-hover', label: 'interactive-hover' },
          { token: '--av-interactive-active', label: 'interactive-active' },
          { token: '--av-interactive-disabled', label: 'interactive-disabled' },
          { token: '--av-ring', label: 'ring' },
          { token: '--av-focus', label: 'focus' },
        ]}
      />

      <SwatchGroup
        title="Navigation"
        tokens={[
          { token: '--av-nav-bg', label: 'nav-bg' },
          { token: '--av-nav-text', label: 'nav-text' },
          { token: '--av-nav-active', label: 'nav-active' },
        ]}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <AllTokens />,
}
