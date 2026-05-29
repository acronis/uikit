import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  Label,
  Switch,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@acronis-platform/shadcn-uikit/react'
import {
  FunnelChart,
  Funnel,
  Cell,
  LabelList,
} from 'recharts'
// colors managed via colorPalette constant

// ─── Types ───────────────────────────────────────────────────────────────────

type LabelPosition = 'right' | 'left' | 'inside' | 'outside'
type LabelContent = 'name' | 'value' | 'percent' | 'name-value' | 'name-percent' | 'value-percent'
type LegendTypeOption = 'rect' | 'circle' | 'square' | 'diamond' | 'star' | 'triangle' | 'wye' | 'line' | 'none'

interface FunnelDataSource {
  name: string
  data: { name: string; value: number }[]
  nameKey: string
  valueKey: string
}

interface StageConfig {
  color?: string
  hidden?: boolean
}

// ─── Data Sources ────────────────────────────────────────────────────────────

const funnelDataSources: Record<string, FunnelDataSource> = {
  salesPipeline: {
    name: 'Sales Pipeline',
    data: [
      { name: 'Visitors', value: 5000 },
      { name: 'Leads', value: 3500 },
      { name: 'Qualified', value: 2000 },
      { name: 'Proposals', value: 1200 },
      { name: 'Closed', value: 600 },
    ],
    nameKey: 'name',
    valueKey: 'value',
  },
  userOnboarding: {
    name: 'User Onboarding',
    data: [
      { name: 'Sign Up Page', value: 12000 },
      { name: 'Email Verified', value: 8400 },
      { name: 'Profile Created', value: 6200 },
      { name: 'First Action', value: 4100 },
      { name: 'Subscribed', value: 2300 },
      { name: 'Retained (30d)', value: 1100 },
    ],
    nameKey: 'name',
    valueKey: 'value',
  },
  ecommerce: {
    name: 'E-commerce Checkout',
    data: [
      { name: 'Product View', value: 25000 },
      { name: 'Add to Cart', value: 8500 },
      { name: 'Checkout Start', value: 5200 },
      { name: 'Payment Info', value: 3800 },
      { name: 'Order Placed', value: 2900 },
    ],
    nameKey: 'name',
    valueKey: 'value',
  },
  recruitment: {
    name: 'Recruitment Funnel',
    data: [
      { name: 'Applications', value: 500 },
      { name: 'Screened', value: 200 },
      { name: 'Interviewed', value: 80 },
      { name: 'Offered', value: 25 },
      { name: 'Hired', value: 15 },
    ],
    nameKey: 'name',
    valueKey: 'value',
  },
}

type DataSourceKey = keyof typeof funnelDataSources

// ─── Constants ───────────────────────────────────────────────────────────────

const colorPalette = [
  '#4169e1', '#2db89a', '#d946ef', '#ef5350', '#d4c92a',
  '#38bdf8', '#a57c52', '#7c3aed', '#9ca3af', '#93c5fd',
]

const gradientPalettes: Record<string, { name: string; colors: string[] }> = {
  blue: { name: 'Blue Gradient', colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'] },
  green: { name: 'Green Gradient', colors: ['#166534', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7'] },
  warm: { name: 'Warm (Green→Red)', colors: ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444', '#dc2626'] },
  cool: { name: 'Cool (Blue→Purple)', colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'] },
  rainbow: { name: 'Rainbow', colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'] },
}

const labelPositionOptions: { value: LabelPosition; label: string }[] = [
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
  { value: 'inside', label: 'Inside' },
  { value: 'outside', label: 'Outside' },
]

const labelContentOptions: { value: LabelContent; label: string }[] = [
  { value: 'name', label: 'Name only' },
  { value: 'value', label: 'Value only' },
  { value: 'percent', label: 'Percent only' },
  { value: 'name-value', label: 'Name: Value' },
  { value: 'name-percent', label: 'Name (%)' },
  { value: 'value-percent', label: 'Value (%)' },
]

const legendTypeOptions: { value: LegendTypeOption; label: string }[] = [
  { value: 'rect', label: 'Rect' },
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'star', label: 'Star' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'line', label: 'Line' },
  { value: 'none', label: 'None (hide)' },
]

const indicatorTypes = [
  { value: 'dot', label: 'dot - Small square' },
  { value: 'line', label: 'line - Vertical bar' },
  { value: 'dashed', label: 'dashed - Dashed line' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function FunnelChartPlayground() {
  // ── Data tab state ──────────────────────────────────────────────────────
  const [dataSource, setDataSource] = React.useState<DataSourceKey>('salesPipeline')
  const currentSource = funnelDataSources[dataSource]
  const [stageConfigs, setStageConfigs] = React.useState<Record<string, StageConfig>>({})
  const [colorMode, setColorMode] = React.useState<'palette' | 'gradient'>('palette')
  const [gradientKey, setGradientKey] = React.useState<string>('warm')

  // Reset on data source change
  React.useEffect(() => {
    setStageConfigs({})
  }, [dataSource])

  const updateStageConfig = (stageName: string, key: string, value: unknown) => {
    setStageConfigs((prev) => ({
      ...prev,
      [stageName]: { ...prev[stageName], [key]: value },
    }))
  }

  const getStageColor = (stageName: string, idx: number): string => {
    const override = stageConfigs[stageName]?.color
    if (override) return override
    if (colorMode === 'gradient') {
      const palette = gradientPalettes[gradientKey]?.colors ?? gradientPalettes.warm.colors
      return palette[idx % palette.length]
    }
    return colorPalette[idx % colorPalette.length]
  }

  // ── Funnel tab state ────────────────────────────────────────────────────
  const [reversed, setReversed] = React.useState(false)
  const [lastShapeType, setLastShapeType] = React.useState<'triangle' | 'rectangle'>('triangle')
  const [activeShape, setActiveShape] = React.useState(false)
  const [stroke, setStroke] = React.useState('#fff')
  const [strokeWidth, setStrokeWidth] = React.useState(1)
  const [legendType, setLegendType] = React.useState<LegendTypeOption>('rect')
  const [funnelWidth, setFunnelWidth] = React.useState<number | undefined>(undefined)

  // Labels
  const [showLabels, setShowLabels] = React.useState(true)
  const [labelPosition, setLabelPosition] = React.useState<LabelPosition>('right')
  const [labelContent, setLabelContent] = React.useState<LabelContent>('name')
  const [labelFill, setLabelFill] = React.useState('currentColor')
  const [showValueLabels, setShowValueLabels] = React.useState(false)
  const [valuePosition, setValuePosition] = React.useState<LabelPosition>('inside')

  // Animation
  const [isAnimationActive, setIsAnimationActive] = React.useState(true)
  const [animationDuration, setAnimationDuration] = React.useState(1500)
  const [animationBegin, setAnimationBegin] = React.useState(400)
  const [animationEasing, setAnimationEasing] = React.useState<'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'>('ease')

  // ── Chart tab state ─────────────────────────────────────────────────────
  const [showTooltip, setShowTooltip] = React.useState(true)
  const [tooltipIndicator, setTooltipIndicator] = React.useState<'dot' | 'line' | 'dashed'>('dot')
  const [showLegend, setShowLegend] = React.useState(true)
  const [legendPos, setLegendPos] = React.useState<'top' | 'bottom'>('bottom')
  const [margin, setMargin] = React.useState({ top: 20, right: 80, bottom: 20, left: 20 })

  // ── Derived ─────────────────────────────────────────────────────────────

  const visibleData = React.useMemo(() => {
    return currentSource.data.filter((item) => !stageConfigs[item.name]?.hidden)
  }, [currentSource.data, stageConfigs])

  const totalValue = visibleData.length > 0 ? visibleData[0].value : 1

  const dataWithColors = React.useMemo(() => {
    return visibleData.map((item, idx) => ({
      ...item,
      fill: getStageColor(item.name, idx),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleData, stageConfigs, colorMode, gradientKey])

  const config = React.useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {}
    dataWithColors.forEach((item) => {
      const key = item.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      cfg[key] = { label: item.name, color: item.fill }
    })
    return cfg
  }, [dataWithColors])

  // Label formatter
  const formatLabel = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (entry: any) => {
      const name = entry?.name ?? entry?.payload?.name ?? ''
      const value = entry?.value ?? entry?.payload?.value ?? 0
      const pct = totalValue > 0 ? `${((value / totalValue) * 100).toFixed(1)}%` : '0%'
      switch (labelContent) {
        case 'name': return name
        case 'value': return String(value.toLocaleString())
        case 'percent': return pct
        case 'name-value': return `${name}: ${value.toLocaleString()}`
        case 'name-percent': return `${name} (${pct})`
        case 'value-percent': return `${value.toLocaleString()} (${pct})`
        default: return name
      }
    },
    [labelContent, totalValue],
  )

  // ── Code generation ─────────────────────────────────────────────────────

  const generateCode = () => {
    const lines: string[] = []
    lines.push(`<ChartContainer config={config} className="h-[400px]">`)

    const chartProps: string[] = []
    if (margin.top !== 20 || margin.right !== 80 || margin.bottom !== 20 || margin.left !== 20) {
      chartProps.push(`margin={{ top: ${margin.top}, right: ${margin.right}, bottom: ${margin.bottom}, left: ${margin.left} }}`)
    }
    lines.push(`  <FunnelChart${chartProps.length ? ' ' + chartProps.join(' ') : ''}>`)

    const fp: string[] = ['dataKey="value"', 'data={dataWithColors}']
    if (reversed) fp.push('reversed')
    if (lastShapeType !== 'triangle') fp.push(`lastShapeType="${lastShapeType}"`)
    if (activeShape) fp.push('activeShape={{ fill: "hsl(var(--primary))", opacity: 0.8 }}')
    if (stroke !== '#fff') fp.push(`stroke="${stroke}"`)
    if (strokeWidth !== 1) fp.push(`strokeWidth={${strokeWidth}}`)
    if (legendType !== 'rect') fp.push(`legendType="${legendType}"`)
    if (funnelWidth) fp.push(`width={${funnelWidth}}`)
    if (!isAnimationActive) fp.push('isAnimationActive={false}')
    if (animationBegin !== 400) fp.push(`animationBegin={${animationBegin}}`)
    if (animationDuration !== 1500) fp.push(`animationDuration={${animationDuration}}`)
    if (animationEasing !== 'ease') fp.push(`animationEasing="${animationEasing}"`)

    lines.push(`    <Funnel ${fp.join(' ')}>`)

    if (showLabels) {
      const lp: string[] = [`position="${labelPosition}"`]
      lp.push('dataKey="name"')
      if (labelFill !== 'currentColor') lp.push(`fill="${labelFill}"`)
      if (labelContent !== 'name') lp.push(`formatter={formatLabel}`)
      lp.push('stroke="none"')
      lines.push(`      <LabelList ${lp.join(' ')} />`)
    }
    if (showValueLabels) {
      lines.push(`      <LabelList position="${valuePosition}" dataKey="value" fill="${labelFill}" stroke="none" />`)
    }

    lines.push(`      {data.map((entry, index) => (`)
    lines.push(`        <Cell key={index} fill={entry.fill} />`)
    lines.push(`      ))}`)
    lines.push(`    </Funnel>`)

    if (showTooltip) {
      lines.push(`    <ChartTooltip content={<ChartTooltipContent indicator="${tooltipIndicator}" />} />`)
    }
    if (showLegend) {
      const lp = legendPos !== 'bottom' ? ` verticalAlign="${legendPos}"` : ''
      lines.push(`    <ChartLegend content={<ChartLegendContent />}${lp} />`)
    }

    lines.push(`  </FunnelChart>`)
    lines.push(`</ChartContainer>`)
    return lines.join('\n')
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">FunnelChart Playground</h2>
        <p className="text-muted-foreground">
          Visualize stages in a process - great for sales pipelines, conversion rates, and user journeys
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* ── Live Preview ───────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>Chart updates as you change settings</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={config} className="h-[400px] w-full">
              <FunnelChart margin={margin}>
                <Funnel
                  dataKey="value"
                  data={dataWithColors}
                  isAnimationActive={isAnimationActive}
                  animationBegin={animationBegin}
                  animationDuration={animationDuration}
                  animationEasing={animationEasing}
                  reversed={reversed}
                  lastShapeType={lastShapeType}
                  activeShape={activeShape ? { fill: 'hsl(var(--primary))', opacity: 0.8 } : undefined}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  legendType={legendType}
                  width={funnelWidth}
                >
                  {showLabels && (
                    <LabelList
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      position={labelPosition as any}
                      dataKey="name"
                      fill={labelFill}
                      stroke="none"
                      formatter={labelContent !== 'name' ? formatLabel : undefined}
                    />
                  )}
                  {showValueLabels && (
                    <LabelList
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      position={valuePosition as any}
                      dataKey="value"
                      fill={labelFill}
                      stroke="none"
                    />
                  )}
                  {dataWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Funnel>
                {showTooltip && (
                  <ChartTooltip
                    content={(props) => <ChartTooltipContent {...props} indicator={tooltipIndicator} />}
                  />
                )}
                {showLegend && <ChartLegend content={<ChartLegendContent />} verticalAlign={legendPos} />}
              </FunnelChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* ── Settings Panel ─────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Toggle to see what each setting does</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="data" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="funnel">Funnel</TabsTrigger>
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="stages">Stages</TabsTrigger>
              </TabsList>

              {/* ─── Tab: Data ──────────────────────────────────────── */}
              <TabsContent value="data" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Data Source</Label>
                  <Select value={dataSource} onValueChange={(v) => setDataSource(v as DataSourceKey)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(funnelDataSources).map(([key, src]) => (
                        <SelectItem key={key} value={key}>{src.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Color Mode</Label>
                  <div className="flex gap-2">
                    <button
                      className={`px-3 py-1 text-sm rounded ${colorMode === 'palette' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                      onClick={() => setColorMode('palette')}
                    >
                      Individual
                    </button>
                    <button
                      className={`px-3 py-1 text-sm rounded ${colorMode === 'gradient' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                      onClick={() => setColorMode('gradient')}
                    >
                      Gradient
                    </button>
                  </div>
                </div>

                {colorMode === 'gradient' && (
                  <div className="space-y-2">
                    <Label className="text-sm">Gradient Palette</Label>
                    <Select value={gradientKey} onValueChange={setGradientKey}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(gradientPalettes).map(([key, pal]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {pal.colors.slice(0, 5).map((c, i) => (
                                  <span key={i} className="h-4 w-3" style={{ backgroundColor: c }} />
                                ))}
                              </div>
                              <span>{pal.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Funnel Stages ({visibleData.length} of {currentSource.data.length})</p>
                  {currentSource.data.map((item, idx) => {
                    const hidden = stageConfigs[item.name]?.hidden
                    const color = getStageColor(item.name, idx)
                    const pct = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0'
                    return (
                      <div
                        key={item.name}
                        className={`flex items-center justify-between rounded-lg border p-2 transition ${hidden ? 'opacity-40' : ''}`}
                        style={{ borderLeftColor: hidden ? '#9ca3af' : color, borderLeftWidth: 4 }}
                      >
                        <button
                          className="flex items-center gap-2 text-left"
                          onClick={() => updateStageConfig(item.name, 'hidden', !hidden)}
                        >
                          <span className="text-sm font-medium">{item.name}</span>
                        </button>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{item.value.toLocaleString()}</span>
                          <span className="text-xs">({pct}%)</span>
                        </div>
                      </div>
                    )
                  })}
                  <p className="text-xs text-muted-foreground">Click a stage to hide/show it</p>
                </div>

                <Separator />

                {/* Conversion rates */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Conversion Rates</p>
                  {visibleData.map((item, idx) => {
                    if (idx === 0) return null
                    const prev = visibleData[idx - 1]
                    const rate = prev.value > 0 ? ((item.value / prev.value) * 100).toFixed(1) : '0'
                    return (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{prev.name} → {item.name}</span>
                        <span className="font-medium">{rate}%</span>
                      </div>
                    )
                  })}
                  {visibleData.length > 1 && (
                    <div className="flex items-center justify-between text-sm border-t pt-1">
                      <span className="font-medium">Overall</span>
                      <span className="font-medium">
                        {totalValue > 0
                          ? ((visibleData[visibleData.length - 1].value / totalValue) * 100).toFixed(1)
                          : '0'}%
                      </span>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ─── Tab: Funnel ────────────────────────────────────── */}
              <TabsContent value="funnel" className="space-y-4 pt-4">
                {/* Reversed */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Reversed</Label>
                    <p className="text-xs text-muted-foreground">Flip to pyramid (smallest at top)</p>
                  </div>
                  <Switch checked={reversed} onCheckedChange={setReversed} />
                </div>

                <Separator />

                {/* Last Shape */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Last Shape</Label>
                    <p className="text-xs text-muted-foreground">Bottom segment shape</p>
                  </div>
                  <Select value={lastShapeType} onValueChange={(v) => setLastShapeType(v as 'triangle' | 'rectangle')}>
                    <SelectTrigger className="w-28 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="triangle">Triangle</SelectItem>
                      <SelectItem value="rectangle">Rectangle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Active Shape */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Active Shape</Label>
                    <p className="text-xs text-muted-foreground">Highlight on hover</p>
                  </div>
                  <Switch checked={activeShape} onCheckedChange={setActiveShape} />
                </div>

                <Separator />

                {/* Stroke */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Stroke (border)</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={stroke}
                      onChange={(e) => setStroke(e.target.value)}
                      className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                    />
                    <Input type="text" value={stroke} onChange={(e) => setStroke(e.target.value)} className="flex-1 h-8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Width</span>
                    <Input type="number" value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value) || 0)} min={0} max={5} className="w-20 h-8" />
                  </div>
                </div>

                <Separator />

                {/* Funnel Width */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Fixed Width</Label>
                    <p className="text-xs text-muted-foreground">Override auto width (px)</p>
                  </div>
                  <Input type="number" value={funnelWidth ?? ''} onChange={(e) => setFunnelWidth(e.target.value ? Number(e.target.value) : undefined)} placeholder="auto" min={50} max={500} className="w-20 h-8" />
                </div>

                <Separator />

                {/* Legend Type */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Legend Icon</Label>
                    <p className="text-xs text-muted-foreground">Shape in legend</p>
                  </div>
                  <Select value={legendType} onValueChange={(v) => setLegendType(v as LegendTypeOption)}>
                    <SelectTrigger className="w-24 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {legendTypeOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Labels */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Labels</Label>
                    <p className="text-xs text-muted-foreground">{'<LabelList />'} stage names</p>
                  </div>
                  <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                </div>
                {showLabels && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Position</span>
                      <Select value={labelPosition} onValueChange={(v) => setLabelPosition(v as LabelPosition)}>
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {labelPositionOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Content</span>
                      <Select value={labelContent} onValueChange={(v) => setLabelContent(v as LabelContent)}>
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {labelContentOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1 pl-4">
                      <span className="text-sm">Fill Color</span>
                      <div className="flex items-center gap-2">
                        <input type="color" value={labelFill === 'currentColor' ? '#000000' : labelFill} onChange={(e) => setLabelFill(e.target.value)} className="h-6 w-8 cursor-pointer rounded border-0 p-0" />
                        <Input type="text" value={labelFill} onChange={(e) => setLabelFill(e.target.value)} className="flex-1 h-8" />
                        <button className="text-xs text-primary hover:underline" onClick={() => setLabelFill('currentColor')}>Auto</button>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Value Labels (secondary) */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Value Labels</Label>
                    <p className="text-xs text-muted-foreground">Second label with numeric values</p>
                  </div>
                  <Switch checked={showValueLabels} onCheckedChange={setShowValueLabels} />
                </div>
                {showValueLabels && (
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-sm">Position</span>
                    <Select value={valuePosition} onValueChange={(v) => setValuePosition(v as LabelPosition)}>
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {labelPositionOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                {/* Animation */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Animation</Label>
                    <p className="text-xs text-muted-foreground">Animate on load</p>
                  </div>
                  <Switch checked={isAnimationActive} onCheckedChange={setIsAnimationActive} />
                </div>
                {isAnimationActive && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Delay (ms)</span>
                      <Input type="number" value={animationBegin} onChange={(e) => setAnimationBegin(Math.max(0, Number(e.target.value) || 0))} min={0} max={5000} className="w-24 h-8" />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Duration (ms)</span>
                      <Input type="number" value={animationDuration} onChange={(e) => setAnimationDuration(Number(e.target.value) || 1500)} min={0} max={5000} className="w-24 h-8" />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Easing</span>
                      <Select value={animationEasing} onValueChange={(v) => setAnimationEasing(v as typeof animationEasing)}>
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'].map((e) => (
                            <SelectItem key={e} value={e}>{e}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* ─── Tab: Chart ─────────────────────────────────────── */}
              <TabsContent value="chart" className="space-y-4 pt-4">
                {/* Tooltip */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Tooltip</Label>
                    <p className="text-xs text-muted-foreground">{'<ChartTooltip />'}</p>
                  </div>
                  <Switch checked={showTooltip} onCheckedChange={setShowTooltip} />
                </div>
                {showTooltip && (
                  <div className="space-y-2 pl-4">
                    <Label className="text-sm">Indicator</Label>
                    <Select value={tooltipIndicator} onValueChange={(v) => setTooltipIndicator(v as 'dot' | 'line' | 'dashed')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {indicatorTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                {/* Legend */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Legend</Label>
                    <p className="text-xs text-muted-foreground">{'<ChartLegend />'}</p>
                  </div>
                  <Switch checked={showLegend} onCheckedChange={setShowLegend} />
                </div>
                {showLegend && (
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-sm">Position</span>
                    <Select value={legendPos} onValueChange={(v) => setLegendPos(v as 'top' | 'bottom')}>
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom">Bottom</SelectItem>
                        <SelectItem value="top">Top</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                {/* Margins */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Margins</Label>
                    <button className="text-xs text-primary hover:underline" onClick={() => setMargin({ top: 20, right: 80, bottom: 20, left: 20 })}>Reset</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                      <div key={side} className="flex items-center gap-2">
                        <span className="w-12 text-xs text-muted-foreground capitalize">{side}</span>
                        <Input type="number" value={margin[side]} onChange={(e) => setMargin((p) => ({ ...p, [side]: Number(e.target.value) || 0 }))} className="h-8" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Right margin needs space for labels when position is &quot;right&quot;</p>
                </div>
              </TabsContent>

              {/* ─── Tab: Stages ────────────────────────────────────── */}
              <TabsContent value="stages" className="space-y-4 pt-4">
                <p className="text-xs text-muted-foreground">Customize individual stage colors. Click a color swatch or use the picker.</p>
                {currentSource.data.map((item, idx) => {
                  const hidden = stageConfigs[item.name]?.hidden
                  const color = getStageColor(item.name, idx)
                  const pct = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0'
                  return (
                    <div
                      key={item.name}
                      className={`space-y-2 rounded-lg border p-3 ${hidden ? 'opacity-40' : ''}`}
                      style={{ borderLeftColor: hidden ? '#9ca3af' : color, borderLeftWidth: 4 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">{item.name}</Label>
                          <p className="text-xs text-muted-foreground">{item.value.toLocaleString()} ({pct}%)</p>
                        </div>
                        <Switch checked={!hidden} onCheckedChange={(v) => updateStageConfig(item.name, 'hidden', !v)} />
                      </div>

                      {!hidden && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Color</span>
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => updateStageConfig(item.name, 'color', e.target.value)}
                              className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                            />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {(colorMode === 'gradient' ? (gradientPalettes[gradientKey]?.colors ?? []) : colorPalette).map((c) => (
                              <button
                                key={c}
                                className={`h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: c }}
                                onClick={() => updateStageConfig(item.name, 'color', c)}
                              />
                            ))}
                          </div>
                          <button
                            className="text-xs text-primary hover:underline"
                            onClick={() => updateStageConfig(item.name, 'color', undefined)}
                          >
                            Reset to default
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* ── Generated Code ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Code</CardTitle>
          <CardDescription>Copy this code to use your current configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
            <code>{generateCode()}</code>
          </pre>
        </CardContent>
      </Card>

      {/* ── Raw Data Preview ───────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Raw Data</CardTitle>
          <CardDescription>
            {currentSource.name} — {visibleData.length} stages, overall conversion {totalValue > 0 ? ((visibleData[visibleData.length - 1]?.value ?? 0) / totalValue * 100).toFixed(1) : '0'}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm max-h-64">
            <code>{JSON.stringify(dataWithColors, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>

      {/* ── Documentation ──────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Data Format</CardTitle>
            <CardDescription>Required data structure for FunnelChart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              <code>{`// Array of stages, sorted largest → smallest
const data = [
  { name: 'Visitors',  value: 5000, fill: '#4169e1' },
  { name: 'Leads',     value: 3500, fill: '#2db89a' },
  { name: 'Qualified', value: 2000, fill: '#d946ef' },
  { name: 'Proposals', value: 1200, fill: '#ef5350' },
  { name: 'Closed',    value: 600,  fill: '#d4c92a' },
]

// ChartConfig for tooltips & legend
const config: ChartConfig = {
  visitors:  { label: "Visitors",  color: "#4169e1" },
  leads:     { label: "Leads",     color: "#2db89a" },
  qualified: { label: "Qualified", color: "#d946ef" },
}`}</code>
            </pre>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>name</strong> - Stage label (used by nameKey, default &quot;name&quot;)</li>
                <li><strong>value</strong> - Numeric size (used by dataKey)</li>
                <li><strong>fill</strong> - Color per stage (via Cell components)</li>
                <li><strong>Sorted order</strong> - Largest value first (or use reversed)</li>
                <li><strong>3-7 stages</strong> - Ideal range for readability</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurable Properties</CardTitle>
            <CardDescription>What you can customize</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Funnel Component</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">dataKey</code> - Field for stage size</li>
                <li><code className="text-xs">nameKey</code> - Field for stage name (default &quot;name&quot;)</li>
                <li><code className="text-xs">reversed</code> - Flip to pyramid shape</li>
                <li><code className="text-xs">lastShapeType</code> - triangle or rectangle for bottom</li>
                <li><code className="text-xs">activeShape</code> - Hover highlight effect</li>
                <li><code className="text-xs">stroke / strokeWidth</code> - Border between stages</li>
                <li><code className="text-xs">width</code> - Fixed width override</li>
                <li><code className="text-xs">legendType</code> - Icon shape in legend</li>
                <li><code className="text-xs">hide</code> - Hide without removing data</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Labels</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">LabelList</code> - Stage names / values / percentages</li>
                <li><code className="text-xs">position</code> - right, left, inside, outside</li>
                <li><code className="text-xs">formatter</code> - Custom label content function</li>
                <li><code className="text-xs">fill / stroke</code> - Label text styling</li>
                <li>Multiple LabelLists supported (name + value)</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Animation</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">isAnimationActive</code> - Enable/disable</li>
                <li><code className="text-xs">animationBegin</code> - Delay in ms (default 400)</li>
                <li><code className="text-xs">animationDuration</code> - Duration in ms (default 1500)</li>
                <li><code className="text-xs">animationEasing</code> - Timing function</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Styling</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">Cell</code> - Individual fill color per stage</li>
                <li><code className="text-xs">shape</code> - Custom trapezoid renderer</li>
                <li>Gradient palettes for sequential color schemes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitations</CardTitle>
            <CardDescription>What FunnelChart cannot do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Max 6-7 stages</strong> - More becomes hard to read</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No branching</strong> - Linear sequential stages only</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No time dimension</strong> - Single snapshot, not over time</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Poor for comparison</strong> - Hard to compare two funnels side-by-side</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No built-in conversion rates</strong> - Need custom label formatters</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Area distortion</strong> - Width implies volume but height is uniform</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Practices & Use Cases</CardTitle>
            <CardDescription>When and how to use FunnelChart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Ideal For:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Sales pipeline visualization</li>
                <li>User onboarding / activation flow</li>
                <li>E-commerce checkout conversion</li>
                <li>Recruitment / hiring pipeline</li>
                <li>Marketing conversion (impressions → clicks → leads)</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Avoid When:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Comparing independent values - Use BarChart</li>
                <li>Tracking over time - Use LineChart</li>
                <li>Non-sequential process - Use Sankey or flow diagram</li>
                <li>Part-of-whole without stages - Use PieChart</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Tips:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Sort data largest → smallest (or use reversed)</li>
                <li>Use gradient palettes (green → red) to emphasize drop-off</li>
                <li>Show conversion rates alongside the funnel</li>
                <li>Use right-positioned labels with name + percent format</li>
                <li>Add a second LabelList inside for values</li>
                <li>Use lastShapeType=&quot;rectangle&quot; for flat-bottom funnels</li>
                <li>Increase right margin to 80+ for external labels</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Understanding Cards ────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Funnel Anatomy</CardTitle>
          <CardDescription>How the trapezoid stages are constructed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="font-medium">Trapezoid Shape</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>upperWidth:</strong> Top edge width (from value)</li>
                <li><strong>lowerWidth:</strong> Bottom edge width (from next value)</li>
                <li><strong>height:</strong> Uniform per stage</li>
                <li><strong>Last stage:</strong> Triangle or rectangle</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Data Flow</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Values must decrease (or increase if reversed)</li>
                <li>Width is proportional to value</li>
                <li>Each Cell gets its own fill color</li>
                <li>Stroke separates adjacent stages</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Label Placement</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>right:</strong> Outside, to the right (needs margin)</li>
                <li><strong>left:</strong> Outside, to the left</li>
                <li><strong>inside:</strong> Centered within trapezoid</li>
                <li><strong>outside:</strong> Above/outside the shape</li>
              </ul>
            </div>
          </div>
          <Separator />
          <div className="rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-3 text-xs text-muted-foreground">
            <p><strong className="text-blue-700 dark:text-blue-400">Tip:</strong> You can use multiple <code className="text-xs">LabelList</code> components inside the Funnel to show both stage names (right) and values (inside) simultaneously. Use the formatter prop for custom label content like percentages or conversion rates.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Color Strategies</CardTitle>
          <CardDescription>How to choose effective funnel colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium">Sequential Gradient</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Best for showing progression/drop-off</li>
                <li>Green → Red shows good → lost</li>
                <li>Single hue light → dark shows magnitude</li>
                <li>Use the Gradient color mode in Data tab</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Categorical Colors</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Best when each stage is a distinct concept</li>
                <li>Use high-contrast, accessible colors</li>
                <li>Customize per-stage in Stages tab</li>
                <li>Ensure sufficient contrast for labels inside</li>
              </ul>
            </div>
          </div>
          <Separator />
          <div className="rounded border border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-3 text-xs text-muted-foreground">
            <p><strong className="text-amber-700 dark:text-amber-400">Warning:</strong> When using &quot;inside&quot; label position, ensure the stage fill colors have enough contrast with the label text color. Light fills need dark text and vice versa.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
