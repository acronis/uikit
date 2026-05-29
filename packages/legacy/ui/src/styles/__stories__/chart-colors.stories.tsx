import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Themes/Chart Colors',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const CHART_TOKENS = [
  { token: '--av-chart-1', label: 'chart-1' },
  { token: '--av-chart-2', label: 'chart-2' },
  { token: '--av-chart-3', label: 'chart-3' },
  { token: '--av-chart-4', label: 'chart-4' },
  { token: '--av-chart-5', label: 'chart-5' },
  { token: '--av-chart-blue', label: 'chart-blue' },
  { token: '--av-chart-brown', label: 'chart-brown' },
  { token: '--av-chart-critical', label: 'chart-critical' },
  { token: '--av-chart-danger', label: 'chart-danger' },
  { token: '--av-chart-green', label: 'chart-green' },
  { token: '--av-chart-grey', label: 'chart-grey' },
  { token: '--av-chart-info', label: 'chart-info' },
  { token: '--av-chart-light-blue', label: 'chart-light-blue' },
  { token: '--av-chart-neutral', label: 'chart-neutral' },
  { token: '--av-chart-purple', label: 'chart-purple' },
  { token: '--av-chart-red', label: 'chart-red' },
  { token: '--av-chart-success', label: 'chart-success' },
  { token: '--av-chart-transparent', label: 'chart-transparent' },
  { token: '--av-chart-turquoise', label: 'chart-turquoise' },
  { token: '--av-chart-violet', label: 'chart-violet' },
  { token: '--av-chart-warning', label: 'chart-warning' },
  { token: '--av-chart-yellow', label: 'chart-yellow' },
]

function ChartSwatch({ token, label }: { token: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 120 }}>
      <div
        style={{
          width: '100%',
          height: 48,
          borderRadius: 6,
          border: '1px solid hsl(var(--av-border))',
          background: `var(${token})`,
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
    </div>
  )
}

function AllChartColors() {
  const numbered = CHART_TOKENS.filter((t) => /chart-\d/.test(t.token))
  const named = CHART_TOKENS.filter((t) => !/chart-\d/.test(t.token))

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
        Chart Colors
      </h2>

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
          Sequential (chart-1 … chart-5)
        </h3>
        <div style={{ display: 'flex', gap: 16 }}>
          {numbered.map(({ token, label }) => (
            <ChartSwatch key={token} token={token} label={label} />
          ))}
        </div>
      </div>

      <div>
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
          Named
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 16,
          }}
        >
          {named.map(({ token, label }) => (
            <ChartSwatch key={token} token={token} label={label} />
          ))}
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <AllChartColors />,
}
