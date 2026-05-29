import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Themes/Status Colors',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const STATUS_GROUPS = [
  { name: 'Success', prefix: 'success' },
  { name: 'Info', prefix: 'info' },
  { name: 'Warning', prefix: 'warning' },
  { name: 'Danger', prefix: 'danger' },
  { name: 'Critical', prefix: 'critical' },
  { name: 'Neutral', prefix: 'neutral' },
  { name: 'AI', prefix: 'ai' },
] as const

function StatusRow({ name, prefix }: { name: string; prefix: string }) {
  const tokens = [
    { token: `--av-status-${prefix}`, label: 'base' },
    { token: `--av-status-${prefix}-bg`, label: 'background' },
    { token: `--av-status-${prefix}-text`, label: 'text' },
  ]

  return (
    <div style={{ marginBottom: 24 }}>
      <h3
        style={{
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 8,
          color: 'hsl(var(--av-foreground))',
        }}
      >
        {name}
      </h3>
      <div style={{ display: 'flex', gap: 16 }}>
        {tokens.map(({ token, label }) => (
          <div key={token} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div
              style={{
                width: 140,
                height: 48,
                borderRadius: 6,
                border: '1px solid hsl(var(--av-border))',
                background: `hsl(var(${token}))`,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontFamily: 'monospace',
                color: 'hsl(var(--av-foreground))',
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: 10,
                fontFamily: 'monospace',
                color: 'hsl(var(--av-muted-foreground))',
              }}
            >
              {token}
            </span>
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            style={{
              width: 280,
              height: 48,
              borderRadius: 6,
              background: `hsl(var(--av-status-${prefix}-bg))`,
              color: `hsl(var(--av-status-${prefix}-text))`,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 12,
              fontSize: 13,
              fontWeight: 500,
              border: `1px solid hsl(var(--av-status-${prefix}))`,
            }}
          >
            Sample {name} message
          </div>
          <span
            style={{
              fontSize: 11,
              fontFamily: 'monospace',
              color: 'hsl(var(--av-muted-foreground))',
            }}
          >
            usage preview
          </span>
        </div>
      </div>
    </div>
  )
}

function AllStatuses() {
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
        Status Colors
      </h2>
      {STATUS_GROUPS.map(({ name, prefix }) => (
        <StatusRow key={prefix} name={name} prefix={prefix} />
      ))}
    </div>
  )
}

export const Default: Story = {
  render: () => <AllStatuses />,
}
