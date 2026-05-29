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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
} from '@acronis-platform/shadcn-uikit/react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Brush,
  ReferenceLine,
} from 'recharts'
import { getChartColors } from '@/lib/chart-colors'

type CurveType = 'linear' | 'monotone' | 'natural' | 'step' | 'stepBefore' | 'stepAfter'
type BarShapeOption = 'default' | 'rounded' | 'pill' | 'gradient' | 'pattern'

// Simple rounded bar shape (used when barShape = "rounded")
const CustomRoundedBar = (props: { fill?: string; x?: number; y?: number; width?: number; height?: number }) => {
  const { fill, x, y, width, height } = props
  if (width === 0 || height === 0) return null
  const radius = 8
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={radius}
      ry={radius}
      fill={fill}
    />
  )
}

// Pill bar (full capsule corners)
const CustomPillBar = (props: { fill?: string; x?: number; y?: number; width?: number; height?: number }) => {
  const { fill, x, y, width, height } = props
  if (width === 0 || height === 0) return null
  const radius = Math.min(height / 2, 12)
  return <rect x={x} y={y} width={width} height={height} rx={radius} ry={radius} fill={fill} />
}

// Gradient bar (simple vertical gradient using fill as base)
const CustomGradientBar = (props: { fill?: string; x?: number; y?: number; width?: number; height?: number; dataKey?: string }) => {
  const { fill, x, y, width, height, dataKey } = props
  if (width === 0 || height === 0) return null
  const gradId = `grad-${dataKey}-${Math.round(x)}-${Math.round(y)}`
  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={0.95} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.65} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={width} height={height} fill={`url(#${gradId})`} rx={4} ry={4} />
    </g>
  )
}

// Pattern bar (striped pattern to simulate textured/image fill)
const CustomPatternBar = (props: { fill?: string; x?: number; y?: number; width?: number; height?: number; dataKey?: string }) => {
  const { fill, x, y, width, height, dataKey } = props
  if (width === 0 || height === 0) return null
  const patternId = `pat-${dataKey}-${Math.round(x)}-${Math.round(y)}`
  return (
    <g>
      <defs>
        <pattern id={patternId} patternUnits="userSpaceOnUse" width="6" height="6">
          <rect width="6" height="6" fill={fill} opacity={0.75} />
          <path d="M0 6 L6 0" stroke="#ffffff" strokeWidth="1" opacity={0.4} />
          <path d="M-2 6 L6 -2" stroke="#ffffff" strokeWidth="1" opacity={0.4} />
          <path d="M2 8 L8 2" stroke="#ffffff" strokeWidth="1" opacity={0.4} />
        </pattern>
      </defs>
      <rect x={x} y={y} width={width} height={height} fill={`url(#${patternId})`} rx={4} ry={4} />
    </g>
  )
}

// Data Sources with metadata (same structure as LineChart)
const dataSources = {
  sales: {
    name: 'Sales Data',
    data: [
      { month: 'January', quarter: 'Q1', sales: 4000, revenue: 2400, profit: 1600, expenses: 800 },
      { month: 'February', quarter: 'Q1', sales: 3000, revenue: 1398, profit: 1200, expenses: 796 },
      { month: 'March', quarter: 'Q1', sales: 5000, revenue: 9800, profit: 4800, expenses: 1200 },
      { month: 'April', quarter: 'Q2', sales: 2780, revenue: 3908, profit: 1128, expenses: 980 },
      { month: 'May', quarter: 'Q2', sales: 1890, revenue: 4800, profit: 2910, expenses: 650 },
      { month: 'June', quarter: 'Q2', sales: 2390, revenue: 3800, profit: 1410, expenses: 890 },
    ],
    xFields: ['month', 'quarter'],
    yFields: ['sales', 'revenue', 'profit', 'expenses'],
  },
  products: {
    name: 'Product Comparison',
    data: [
      { product: 'Product A', category: 'Electronics', units: 120, revenue: 24000, returns: 5 },
      { product: 'Product B', category: 'Electronics', units: 98, revenue: 19600, returns: 3 },
      { product: 'Product C', category: 'Clothing', units: 156, revenue: 15600, returns: 12 },
      { product: 'Product D', category: 'Clothing', units: 89, revenue: 8900, returns: 4 },
      { product: 'Product E', category: 'Home', units: 72, revenue: 14400, returns: 2 },
    ],
    xFields: ['product', 'category'],
    yFields: ['units', 'revenue', 'returns'],
  },
  yearly: {
    name: 'Yearly Trends (numeric X)',
    data: [
      { year: 2019, revenue: 52000, customers: 1450, growth: 15 },
      { year: 2020, revenue: 48000, customers: 1380, growth: -8 },
      { year: 2021, revenue: 61000, customers: 1720, growth: 27 },
      { year: 2022, revenue: 73000, customers: 2100, growth: 20 },
      { year: 2023, revenue: 89000, customers: 2650, growth: 22 },
      { year: 2024, revenue: 102000, customers: 3200, growth: 15 },
    ],
    xFields: ['year'],
    yFields: ['revenue', 'customers', 'growth'],
  },
}

type DataSourceKey = keyof typeof dataSources

const indicatorTypes = [
  { value: 'dot', label: 'dot - Small square' },
  { value: 'line', label: 'line - Vertical bar' },
  { value: 'dashed', label: 'dashed - Dashed line' },
]

// Palette mirrors LineChart playground colors
const activeBarPalette = [
  '#4169e1', // blue
  '#2db89a', // green
  '#d946ef', // purple
  '#ef5350', // red
  '#d4c92a', // yellow
  '#38bdf8', // turquoise
  '#a57c52', // brown
  '#7c3aed', // violet
  '#9ca3af', // grey
  '#93c5fd', // light blue
  '#9bc225', // success
  '#ffc107', // warning
  '#ea3939', // danger
  '#ff810d', // critical
  '#408bea', // info
]
const barColorPalette = activeBarPalette

export function BarChartPlayground() {
  const colors = getChartColors(3)

  // Data source state
  const [dataSource, setDataSource] = React.useState<DataSourceKey>('sales')
  const currentSource = dataSources[dataSource]
  const [xAxisField, setXAxisField] = React.useState(currentSource.xFields[0])
  const [enabledYFields, setEnabledYFields] = React.useState<string[]>(currentSource.yFields.slice(0, 3))

  // Reset fields when data source changes
  React.useEffect(() => {
    const source = dataSources[dataSource]
    setXAxisField(source.xFields[0])
    setEnabledYFields(source.yFields.slice(0, 3))
  }, [dataSource])

  // Chart settings state
  const [showGrid, setShowGrid] = React.useState(true)
  const [gridDashed, setGridDashed] = React.useState(true)
  const [showXAxis, setShowXAxis] = React.useState(true)
  const [showYAxis, setShowYAxis] = React.useState(true)
  const [showTooltip, setShowTooltip] = React.useState(true)
  const [showLegend, setShowLegend] = React.useState(true)
  const [tooltipIndicator, setTooltipIndicator] = React.useState<'dot' | 'line' | 'dashed'>('dot')
  
  // Bar-specific settings
  const [layout, setLayout] = React.useState<'horizontal' | 'vertical'>('horizontal')
  const [barRadius, setBarRadius] = React.useState(0)
  const [barGap, setBarGap] = React.useState(4)
  const [barCategoryGap, setBarCategoryGap] = React.useState(10)
  const [barSize, setBarSize] = React.useState<number | undefined>(undefined)
  const [maxBarSize, setMaxBarSize] = React.useState<number | undefined>(undefined)
  const [minPointSize, setMinPointSize] = React.useState(0)
  const [showActiveBar, setShowActiveBar] = React.useState(false)
  const [activeBarUseBarColor, setActiveBarUseBarColor] = React.useState(true)
  const [activeBarFill, setActiveBarFill] = React.useState(activeBarPalette[0])
  const [activeBarOpacity, setActiveBarOpacity] = React.useState(0.8)
  const [showBackground, setShowBackground] = React.useState(false)
  const [backgroundFill, setBackgroundFill] = React.useState('hsl(var(--muted))')
  const [showLabels, setShowLabels] = React.useState(false)
  const [labelPosition, setLabelPosition] = React.useState<'top' | 'insideTop' | 'insideBottom' | 'insideStart' | 'insideEnd'>('top')
  const [isAnimationActive, setIsAnimationActive] = React.useState(true)
  const [barShape, setBarShape] = React.useState<BarShapeOption>('default')
  const [showBrush, setShowBrush] = React.useState(false)
  const [brushHeight, setBrushHeight] = React.useState(24)
  const [showReferenceLine, setShowReferenceLine] = React.useState(false)
  const [referenceLineValue, setReferenceLineValue] = React.useState(3000)
  const [referenceLineLabel, setReferenceLineLabel] = React.useState('Target')
  const [referenceLineStroke, setReferenceLineStroke] = React.useState('#ef4444')
  const [xAxisAngle, setXAxisAngle] = React.useState(0)
  const [xAxisInterval, setXAxisInterval] = React.useState<number>(0)
  const [xAxisFormatter, setXAxisFormatter] = React.useState<'none' | 'truncate3' | 'truncate5'>('none')
  const [yAxisTickCount, setYAxisTickCount] = React.useState<number | undefined>(undefined)
  const [yAxisFormatter, setYAxisFormatter] = React.useState<'none' | 'compact' | 'currency'>('none')
  const [yAxisDomain, setYAxisDomain] = React.useState<'auto' | 'dataMin-dataMax' | 'zero'>('auto')
  const [stacked, setStacked] = React.useState(false)
  const [barSettings, setBarSettings] = React.useState<Record<string, {
    color?: string
    background?: string | null
    shape?: BarShapeOption
    showLabel?: boolean
    labelPosition?: 'top' | 'insideTop' | 'insideBottom' | 'insideStart' | 'insideEnd'
  }>>({})

  // Dynamic config based on enabled fields
  const config = React.useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {}
    enabledYFields.forEach((field, index) => {
      cfg[field] = { 
        label: field.charAt(0).toUpperCase() + field.slice(1), 
        color: colors[index % colors.length] 
      }
    })
    return cfg
  }, [enabledYFields, colors])

  const getBarSettings = React.useCallback(
    (field: string, index: number) => {
      const defaults = {
        color: colors[index % colors.length],
        background: undefined as string | null | undefined,
        shape: undefined as BarShapeOption | undefined,
        showLabel: undefined as boolean | undefined,
        labelPosition: undefined as ('top' | 'insideTop' | 'insideBottom' | 'insideStart' | 'insideEnd') | undefined,
      }
      return { ...defaults, ...(barSettings[field] || {}) }
    },
    [barSettings, colors]
  )

  const updateBarSetting = (field: string, key: keyof typeof barSettings[string], value: string | number | boolean | undefined | CurveType | 'rounded' | 'pill' | 'gradient' | 'pattern') => {
    setBarSettings((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] || {}),
        [key]: value,
      },
    }))
  }

  // Generate code preview
  const generateCode = () => {
    const lines = []
    lines.push(`<ChartContainer config={config} className="h-[400px]">`)
    
    const barChartProps = []
    barChartProps.push(`data={data}`)
    if (layout === 'vertical') barChartProps.push(`layout="vertical"`)
    if (barGap !== 4) barChartProps.push(`barGap={${barGap}}`)
    if (barCategoryGap !== 10) barChartProps.push(`barCategoryGap="${barCategoryGap}%"`)
    if (barSize) barChartProps.push(`barSize={${barSize}}`)
    if (maxBarSize) barChartProps.push(`maxBarSize={${maxBarSize}}`)
    
    lines.push(`  <BarChart ${barChartProps.join(' ')}>`)
    
    if (showGrid) {
      lines.push(`    <CartesianGrid${gridDashed ? ' strokeDasharray="3 3"' : ''} />`)
    }
    if (layout === 'horizontal') {
      if (showXAxis) {
        const xProps: string[] = [`dataKey="${xAxisField}"`]
        if (xAxisAngle !== 0) {
          xProps.push(`angle={${xAxisAngle}}`)
          xProps.push(`textAnchor="end"`)
          xProps.push(`height={60}`)
        }
        if (xAxisInterval > 0) xProps.push(`interval={${xAxisInterval}}`)
        if (xAxisFormatter === 'truncate3') xProps.push(`tickFormatter={(v) => String(v).slice(0, 3)}`)
        else if (xAxisFormatter === 'truncate5') xProps.push(`tickFormatter={(v) => String(v).slice(0, 5)}`)
        lines.push(`    <XAxis ${xProps.join(' ')} />`)
      }
      if (showYAxis) {
        const yProps: string[] = []
        if (yAxisDomain === 'zero') yProps.push(`domain={[0, "auto"]}`)
        else if (yAxisDomain === 'dataMin-dataMax') yProps.push(`domain={["dataMin", "dataMax"]}`)
        if (yAxisTickCount) yProps.push(`tickCount={${yAxisTickCount}}`)
        if (yAxisFormatter === 'compact') yProps.push(`tickFormatter={(v) => v >= 1000 ? \`${'${'}(v/1000).toFixed(1)}k\` : v}`)
        else if (yAxisFormatter === 'currency') yProps.push(`tickFormatter={(v) => \`$${'${'}v >= 1000 ? \`${'${'}(v/1000).toFixed(1)}k\` : v}\`}`)
        lines.push(`    <YAxis${yProps.length ? ' ' + yProps.join(' ') : ''} />`)
      }
    } else {
      if (showXAxis) lines.push(`    <XAxis type="number" />`)
      if (showYAxis) lines.push(`    <YAxis dataKey="${xAxisField}" type="category" />`)
    }
    if (showTooltip) {
      lines.push(`    <ChartTooltip content={<ChartTooltipContent indicator="${tooltipIndicator}" />} />`)
    }
    if (showLegend) {
      lines.push(`    <ChartLegend content={<ChartLegendContent />} />`)
    }
    
    enabledYFields.forEach((field, index) => {
      const settings = getBarSettings(field, index)
      const barProps = [`dataKey="${field}"`, `fill="${settings.color}"`]
      if (barRadius > 0) barProps.push(`radius={[${barRadius}, ${barRadius}, 0, 0]}`)
      if (stacked) barProps.push(`stackId="a"`)
      if (minPointSize > 0) barProps.push(`minPointSize={${minPointSize}}`)
      const shapeVal = settings.shape || barShape
      if (shapeVal === 'rounded') barProps.push(`shape={<CustomRoundedBar />}`)
      if (shapeVal === 'pill') barProps.push(`shape={<CustomPillBar />}`)
      if (shapeVal === 'gradient') barProps.push(`shape={<CustomGradientBar dataKey="${field}" />}`)
      if (shapeVal === 'pattern') barProps.push(`shape={<CustomPatternBar dataKey="${field}" />}`)
      if (showActiveBar) {
        const activeFill = activeBarUseBarColor ? settings.color : activeBarFill || ''
        barProps.push(`activeBar={{ fill: '${activeFill}', opacity: ${activeBarOpacity} }}`)
      }
      const bgFill = settings.background ?? (showBackground ? backgroundFill : null)
      if (bgFill) barProps.push(`background={{ fill: '${bgFill}' }}`)
      if (!isAnimationActive) barProps.push(`isAnimationActive={false}`)
      const labelPos = settings.labelPosition || labelPosition
      const labelEnabled = settings.showLabel ?? showLabels
      if (labelEnabled) {
        lines.push(`    <Bar ${barProps.join(' ')}>`)
        lines.push(`      <LabelList dataKey="${field}" position="${labelPos}" />`)
        lines.push(`    </Bar>`)
      } else {
        lines.push(`    <Bar ${barProps.join(' ')} />`)
      }
    })
    if (showReferenceLine) {
      lines.push(`    <ReferenceLine y={${referenceLineValue}} stroke="${referenceLineStroke}" strokeWidth={2} strokeDasharray="5 5" label={{ value: "${referenceLineLabel}: ${referenceLineValue}", position: "insideTopRight", fill: "${referenceLineStroke}" }} />`)
    }
    if (showBrush) {
      lines.push(`    <Brush dataKey="${xAxisField}" height={${brushHeight}} stroke="hsl(var(--muted-foreground))" />`)
    }
    
    lines.push(`  </BarChart>`)
    lines.push(`</ChartContainer>`)
    return lines.join('\n')
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">BarChart Playground</h2>
        <p className="text-muted-foreground">
          Explore BarChart settings - toggle options to see how bars change
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Chart Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>Chart updates as you change settings</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={config} className="h-[400px] w-full">
              <BarChart 
                data={currentSource.data} 
                layout={layout}
                barGap={barGap}
                barCategoryGap={`${barCategoryGap}%`}
                barSize={barSize}
                maxBarSize={maxBarSize}
              >
                {showGrid && (
                  <CartesianGrid 
                    strokeDasharray={gridDashed ? "3 3" : undefined} 
                    className="stroke-muted"
                  />
                )}
                {layout === 'horizontal' ? (
                  <>
                    {showXAxis && (
                      <XAxis
                        dataKey={xAxisField}
                        angle={xAxisAngle}
                        textAnchor={xAxisAngle !== 0 ? "end" : undefined}
                        height={xAxisAngle !== 0 ? 60 : undefined}
                        interval={xAxisInterval || 0}
                        tickFormatter={xAxisFormatter === 'truncate3' ? (v) => String(v).slice(0, 3) : xAxisFormatter === 'truncate5' ? (v) => String(v).slice(0, 5) : undefined}
                      />
                    )}
                    {showYAxis && (
                      <YAxis
                        domain={yAxisDomain === 'zero' ? [0, 'auto'] : yAxisDomain === 'dataMin-dataMax' ? ['dataMin', 'dataMax'] : undefined}
                        tickCount={yAxisTickCount}
                        tickFormatter={
                          yAxisFormatter === 'compact'
                            ? (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)
                            : yAxisFormatter === 'currency'
                            ? (v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`
                            : undefined
                        }
                      />
                    )}
                  </>
                ) : (
                  <>
                    {showXAxis && <XAxis type="number" />}
                    {showYAxis && <YAxis dataKey={xAxisField} type="category" width={80} />}
                  </>
                )}
                {showTooltip && (
                  <ChartTooltip 
                    content={(props) => <ChartTooltipContent {...props} indicator={tooltipIndicator} />} 
                  />
                )}
                {showLegend && (
                  <ChartLegend content={<ChartLegendContent />} />
                )}
                {enabledYFields.map((field, index) => {
                  const settings = getBarSettings(field, index)
                  const shapeVal = settings.shape || barShape
                  const labelPos = settings.labelPosition || labelPosition
                  const labelEnabled = settings.showLabel ?? showLabels
                  const bgFill = settings.background ?? (showBackground ? backgroundFill : undefined)
                  return (
                    <Bar
                      key={field}
                      dataKey={field}
                      fill={settings.color}
                      radius={barRadius > 0 ? [barRadius, barRadius, 0, 0] : undefined}
                      stackId={stacked ? "a" : undefined}
                      minPointSize={minPointSize}
                      activeBar={showActiveBar ? { fill: activeBarUseBarColor ? settings.color : activeBarFill, opacity: activeBarOpacity } : false}
                      background={bgFill ? { fill: bgFill } : undefined}
                      isAnimationActive={isAnimationActive}
                      shape={
                        shapeVal === 'rounded'
                          ? <CustomRoundedBar />
                          : shapeVal === 'pill'
                          ? <CustomPillBar />
                          : shapeVal === 'gradient'
                          ? <CustomGradientBar dataKey={field} />
                          : shapeVal === 'pattern'
                          ? <CustomPatternBar dataKey={field} />
                          : undefined
                      }
                    >
                      {labelEnabled && <LabelList dataKey={field} position={labelPos} fontSize={11} />}
                    </Bar>
                  )
                })}
                {showReferenceLine && (
                  <ReferenceLine
                    y={referenceLineValue}
                    stroke={referenceLineStroke}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{ value: `${referenceLineLabel}: ${referenceLineValue}`, position: 'insideTopRight', fill: referenceLineStroke, fontSize: 12 }}
                  />
                )}
                {showBrush && (
                  <Brush dataKey={xAxisField} height={brushHeight} stroke="hsl(var(--muted-foreground))" />
                )}
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Settings Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Toggle to see what each setting does</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="data" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="bars">Bars</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="axes">Axes</TabsTrigger>
              </TabsList>

              {/* Data Tab */}
              <TabsContent value="data" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Data Source</Label>
                  <Select value={dataSource} onValueChange={(v) => setDataSource(v as DataSourceKey)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(dataSources).map(([key, source]) => (
                        <SelectItem key={key} value={key}>{source.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Available fields shown below
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">X-Axis Field</Label>
                  <Select value={xAxisField} onValueChange={setXAxisField}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentSource.xFields.map((field) => (
                        <SelectItem key={field} value={field}>{field}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Y-Axis Fields (Bars)</Label>
                  <div className="space-y-2">
                    {currentSource.yFields.map((field) => (
                      <div key={field} className="flex items-center justify-between">
                        <span className="text-sm">{field}</span>
                        <Switch
                          checked={enabledYFields.includes(field)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setEnabledYFields([...enabledYFields, field])
                            } else if (enabledYFields.length > 1) {
                              setEnabledYFields(enabledYFields.filter(f => f !== field))
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Bars Tab - per-series settings */}
              <TabsContent value="bars" className="space-y-4 pt-4">
                <p className="text-xs text-muted-foreground">Customize each series independently: color, background, shape, labels.</p>
                {enabledYFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No bars enabled. Go to Data tab to select Y-axis fields.</p>
                ) : (
                  enabledYFields.map((field, index) => {
                    const settings = getBarSettings(field, index)
                    return (
                      <div
                        key={field}
                        className="space-y-3 rounded-lg border p-3"
                        style={{ borderLeftColor: settings.color, borderLeftWidth: 4 }}
                      >
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">{field}</Label>
                          <span className="text-xs text-muted-foreground">dataKey=&quot;{field}&quot;</span>
                        </div>

                        {/* Color */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Color</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Custom:</span>
                              <input
                                type="color"
                                value={settings.color}
                                onChange={(e) => updateBarSetting(field, 'color', e.target.value)}
                                className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                                title="Pick custom color"
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {barColorPalette.map((c) => (
                              <button
                                key={c}
                                className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${settings.color === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: c }}
                                onClick={() => updateBarSetting(field, 'color', c)}
                                title={c}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Background */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Background</span>
                            <Switch
                              checked={Boolean(settings.background ?? showBackground)}
                              onCheckedChange={(checked) =>
                                updateBarSetting(field, 'background', checked ? (settings.background ?? backgroundFill) : null)
                              }
                            />
                          </div>
                          {Boolean(settings.background ?? showBackground) && (
                            <div className="flex items-center gap-2 pl-1">
                              <input
                                type="color"
                                value={settings.background ?? backgroundFill}
                                onChange={(e) => updateBarSetting(field, 'background', e.target.value)}
                                className="h-8 w-10 rounded border border-border bg-transparent"
                                aria-label={`Background color for ${field}`}
                              />
                              <Input
                                type="text"
                                value={settings.background ?? backgroundFill}
                                onChange={(e) => updateBarSetting(field, 'background', e.target.value)}
                                className="w-32 h-8"
                              />
                            </div>
                          )}
                        </div>

                        {/* Shape */}
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Shape (override)</Label>
                          <Select
                            value={settings.shape || 'inherit'}
                            onValueChange={(v) => updateBarSetting(field, 'shape', v === 'inherit' ? undefined : (v as BarShapeOption))}
                          >
                            <SelectTrigger className="w-44 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inherit">Inherit (Chart tab)</SelectItem>
                              <SelectItem value="default">Default rect</SelectItem>
                              <SelectItem value="rounded">Rounded</SelectItem>
                              <SelectItem value="pill">Pill/Capsule</SelectItem>
                              <SelectItem value="gradient">Gradient</SelectItem>
                              <SelectItem value="pattern">Pattern/texture</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Labels */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Label</span>
                            <Switch
                              checked={settings.showLabel ?? showLabels}
                              onCheckedChange={(checked) => updateBarSetting(field, 'showLabel', checked)}
                            />
                          </div>
                          {(settings.showLabel ?? showLabels) && (
                            <div className="flex items-center gap-2 pl-1">
                              <Select
                                value={settings.labelPosition || labelPosition}
                                onValueChange={(v) => updateBarSetting(field, 'labelPosition', v as typeof labelPosition)}
                              >
                                <SelectTrigger className="w-40 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="top">Top</SelectItem>
                                  <SelectItem value="insideTop">Inside Top</SelectItem>
                                  <SelectItem value="insideBottom">Inside Bottom</SelectItem>
                                  <SelectItem value="insideStart">Inside Start</SelectItem>
                                  <SelectItem value="insideEnd">Inside End</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </TabsContent>

              <TabsContent value="chart" className="space-y-4 pt-4">
                {/* Stacked */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Stacked Bars</Label>
                    <p className="text-xs text-muted-foreground">stackId=&quot;a&quot; on all bars</p>
                  </div>
                  <Switch checked={stacked} onCheckedChange={setStacked} />
                </div>

                <Separator />

                {/* Bar Radius */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Bar Radius (rounded)</Label>
                    <Input
                      type="number"
                      value={barRadius}
                      onChange={(e) => setBarRadius(Number(e.target.value) || 0)}
                      min={0}
                      max={20}
                      className="w-20 h-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    radius={'{'}[{barRadius}, {barRadius}, 0, 0]{'}'}
                  </p>
                </div>

                <Separator />

                {/* Bar Gap */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Bar Gap</Label>
                    <Input
                      type="number"
                      value={barGap}
                      onChange={(e) => setBarGap(Number(e.target.value) || 0)}
                      min={0}
                      max={20}
                      className="w-20 h-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Gap between bars in same category
                  </p>
                </div>

                <Separator />

                {/* Bar Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Bar Size (px)</Label>
                    <Input
                      type="number"
                      placeholder="auto"
                      value={barSize ?? ''}
                      onChange={(e) => setBarSize(e.target.value ? Number(e.target.value) : undefined)}
                      min={1}
                      max={100}
                      className="w-20 h-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Fixed width when set; auto when empty</p>
                </div>

                {/* Max Bar Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Max Bar Size (px)</Label>
                    <Input
                      type="number"
                      placeholder="auto"
                      value={maxBarSize ?? ''}
                      onChange={(e) => setMaxBarSize(e.target.value ? Number(e.target.value) : undefined)}
                      min={1}
                      max={200}
                      className="w-20 h-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Limit width/height; auto when empty</p>
                </div>

                {/* Min Point Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Min Point Size</Label>
                    <Input
                      type="number"
                      value={minPointSize}
                      onChange={(e) => setMinPointSize(Number(e.target.value) || 0)}
                      min={0}
                      max={50}
                      className="w-20 h-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Minimum bar height for small/zero values</p>
                </div>

                {/* Active Bar */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Active Bar</Label>
                    <p className="text-xs text-muted-foreground">Highlight bar on hover</p>
                  </div>
                  <Switch checked={showActiveBar} onCheckedChange={setShowActiveBar} />
                </div>

                {showActiveBar && (
                  <div className="space-y-2 pl-4">
                    <Label className="text-sm">Active Bar Opacity</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min={0}
                      max={1}
                      value={activeBarOpacity}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setActiveBarOpacity(Number.isNaN(val) ? 0.8 : Math.max(0, Math.min(1, val)))
                      }}
                      className="w-24"
                    />
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Use Bar Color (default)</Label>
                      <Switch checked={activeBarUseBarColor} onCheckedChange={setActiveBarUseBarColor} />
                    </div>
                    {!activeBarUseBarColor && (
                      <div className="space-y-2">
                        <Label className="text-sm">Active Bar Fill</Label>
                        <div className="flex flex-wrap gap-2">
                          {activeBarPalette.map((c) => (
                            <button
                              key={c}
                              type="button"
                              className={`h-8 w-8 rounded border ${activeBarFill === c ? 'border-foreground ring-2 ring-foreground/50' : 'border-border'}`}
                              style={{ backgroundColor: c }}
                              onClick={() => setActiveBarFill(c)}
                              title={c}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Custom:</span>
                          <input
                            type="color"
                            value={activeBarFill}
                            onChange={(e) => setActiveBarFill(e.target.value)}
                            className="h-9 w-12 rounded border border-border bg-transparent"
                            aria-label="Active bar custom color"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* Labels */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Labels on Bars</Label>
                    <p className="text-xs text-muted-foreground">Show values with LabelList</p>
                  </div>
                  <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                </div>
                {showLabels && (
                  <div className="space-y-2 pl-4">
                    <Label className="text-sm">Label Position</Label>
                    <Select value={labelPosition} onValueChange={(v) => setLabelPosition(v as typeof labelPosition)}>
                      <SelectTrigger className="w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">top</SelectItem>
                        <SelectItem value="insideTop">insideTop</SelectItem>
                        <SelectItem value="insideBottom">insideBottom</SelectItem>
                        <SelectItem value="insideStart">insideStart</SelectItem>
                        <SelectItem value="insideEnd">insideEnd</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                {/* Animation */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Animation</Label>
                    <p className="text-xs text-muted-foreground">isAnimationActive on Bar</p>
                  </div>
                  <Switch checked={isAnimationActive} onCheckedChange={setIsAnimationActive} />
                </div>

                {/* Shape */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Bar Shape</Label>
                    <Select value={barShape} onValueChange={(v) => setBarShape(v as BarShapeOption)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default (rect)</SelectItem>
                        <SelectItem value="rounded">Rounded capsule</SelectItem>
                        <SelectItem value="pill">Pill (full capsule)</SelectItem>
                        <SelectItem value="gradient">Gradient fill</SelectItem>
                        <SelectItem value="pattern">Pattern/texture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">Use Recharts shape prop to customize bar rendering</p>
                </div>

                <Separator />

                {/* Reference Line */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Reference Line</Label>
                    <p className="text-xs text-muted-foreground">Threshold/target marker</p>
                  </div>
                  <Switch checked={showReferenceLine} onCheckedChange={setShowReferenceLine} />
                </div>
                {showReferenceLine && (
                  <div className="space-y-2 pl-4">
                    <Label className="text-sm">Value (y)</Label>
                    <Input
                      type="number"
                      value={referenceLineValue}
                      onChange={(e) => setReferenceLineValue(Number(e.target.value) || 0)}
                      className="w-32 h-8"
                    />
                    <Label className="text-sm">Label</Label>
                    <Input
                      type="text"
                      value={referenceLineLabel}
                      onChange={(e) => setReferenceLineLabel(e.target.value)}
                      className="w-40 h-8"
                    />
                    <Label className="text-sm">Stroke Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={referenceLineStroke}
                        onChange={(e) => setReferenceLineStroke(e.target.value)}
                        className="h-9 w-12 rounded border border-border bg-transparent"
                        aria-label="Reference line color"
                      />
                      <Input
                        type="text"
                        value={referenceLineStroke}
                        onChange={(e) => setReferenceLineStroke(e.target.value)}
                        className="w-32 h-8"
                      />
                    </div>
                  </div>
                )}

                <Separator />

                {/* Brush */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Brush</Label>
                    <p className="text-xs text-muted-foreground">Scroll/select a window along the X-axis</p>
                  </div>
                  <Switch checked={showBrush} onCheckedChange={setShowBrush} />
                </div>
                {showBrush && (
                  <div className="space-y-2 pl-4">
                    <Label className="text-sm">Brush Height</Label>
                    <Input
                      type="number"
                      value={brushHeight}
                      onChange={(e) => setBrushHeight(Number(e.target.value) || 0)}
                      min={12}
                      max={80}
                      className="w-24 h-8"
                    />
                    <p className="text-xs text-muted-foreground">Default 24px height, stroke muted-foreground</p>
                  </div>
                )}

                {/* Background */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Background</Label>
                    <p className="text-xs text-muted-foreground">Fill behind each bar</p>
                  </div>
                  <Switch checked={showBackground} onCheckedChange={setShowBackground} />
                </div>
                {showBackground && (
                  <div className="space-y-2 pl-4">
                    <Label className="text-sm">Background Fill</Label>
                    <div className="flex flex-wrap gap-2">
                      {activeBarPalette.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`h-8 w-8 rounded border ${backgroundFill === c ? 'border-foreground ring-2 ring-foreground/50' : 'border-border'}`}
                          style={{ backgroundColor: c }}
                          onClick={() => setBackgroundFill(c)}
                          title={c}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Custom:</span>
                      <input
                        type="color"
                        value={backgroundFill}
                        onChange={(e) => setBackgroundFill(e.target.value)}
                        className="h-9 w-12 rounded border border-border bg-transparent"
                        aria-label="Bar background custom color"
                      />
                    </div>
                  </div>
                )}

                {/* Category Gap */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Category Gap (%)</Label>
                    <Input
                      type="number"
                      value={barCategoryGap}
                      onChange={(e) => setBarCategoryGap(Number(e.target.value) || 0)}
                      min={0}
                      max={50}
                      className="w-20 h-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Gap between bar groups
                  </p>
                </div>

                </TabsContent>

              <TabsContent value="layout" className="space-y-4 pt-4">
                {/* Layout Direction */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Layout Direction</Label>
                  <Select value={layout} onValueChange={(v) => setLayout(v as 'horizontal' | 'vertical')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="horizontal">horizontal - Vertical bars</SelectItem>
                      <SelectItem value="vertical">vertical - Horizontal bars</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    layout=&quot;horizontal&quot; = bars go up/down<br/>
                    layout=&quot;vertical&quot; = bars go left/right
                  </p>
                </div>

                <Separator />

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
                    <Label className="text-sm">Tooltip Indicator</Label>
                    <Select value={tooltipIndicator} onValueChange={(v) => setTooltipIndicator(v as 'dot' | 'line' | 'dashed')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {indicatorTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
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
              </TabsContent>

              <TabsContent value="axes" className="space-y-4 pt-4">
                {/* Grid */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Grid</Label>
                    <p className="text-xs text-muted-foreground">{'<CartesianGrid />'}</p>
                  </div>
                  <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                </div>

                {showGrid && (
                  <div className="flex items-center justify-between pl-4">
                    <div>
                      <span className="text-sm">Dashed Grid</span>
                      <p className="text-xs text-muted-foreground">strokeDasharray=&quot;3 3&quot;</p>
                    </div>
                    <Switch checked={gridDashed} onCheckedChange={setGridDashed} />
                  </div>
                )}

                <Separator />

                {/* X Axis */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show X Axis</Label>
                    <p className="text-xs text-muted-foreground">
                      {layout === 'horizontal' ? '<XAxis dataKey="month" />' : '<XAxis type="number" />'}
                    </p>
                  </div>
                  <Switch checked={showXAxis} onCheckedChange={setShowXAxis} />
                </div>

                {showXAxis && layout === 'horizontal' && (
                  <>
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">X-Axis Angle</Label>
                      <p className="text-xs text-muted-foreground">Rotate labels to prevent overlap</p>
                      <div className="flex items-center gap-2">
                        {[0, -30, -45, -90].map((angle) => (
                          <button
                            key={angle}
                            className={`h-8 px-3 rounded text-xs ${xAxisAngle === angle ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                            onClick={() => setXAxisAngle(angle)}
                          >
                            {angle}°
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">X-Axis Interval</Label>
                      <p className="text-xs text-muted-foreground">0=all, 1=every 2nd, 2=every 3rd</p>
                      <div className="flex items-center gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <button
                            key={i}
                            className={`h-8 w-8 rounded text-xs ${xAxisInterval === i ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                            onClick={() => setXAxisInterval(i)}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">X-Axis Formatter</Label>
                      <p className="text-xs text-muted-foreground">Shorten labels via tickFormatter</p>
                      <Select value={xAxisFormatter} onValueChange={(v) => setXAxisFormatter(v as 'none' | 'truncate3' | 'truncate5')}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None (as-is)</SelectItem>
                          <SelectItem value="truncate3">Truncate to 3 chars</SelectItem>
                          <SelectItem value="truncate5">Truncate to 5 chars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Separator />

                {/* Y Axis */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Y Axis</Label>
                    <p className="text-xs text-muted-foreground">
                      {layout === 'horizontal' ? '<YAxis />' : '<YAxis dataKey="month" type="category" />'}
                    </p>
                  </div>
                  <Switch checked={showYAxis} onCheckedChange={setShowYAxis} />
                </div>

                {showYAxis && layout === 'horizontal' && (
                  <>
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">Y-Axis Tick Count</Label>
                      <p className="text-xs text-muted-foreground">Number of ticks (auto if empty)</p>
                      <Input
                        type="number"
                        placeholder="auto"
                        value={yAxisTickCount ?? ''}
                        onChange={(e) => setYAxisTickCount(e.target.value ? Number(e.target.value) : undefined)}
                        className="w-24"
                      />
                    </div>
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">Y-Axis Formatter</Label>
                      <p className="text-xs text-muted-foreground">Format values via tickFormatter</p>
                      <Select value={yAxisFormatter} onValueChange={(v) => setYAxisFormatter(v as 'none' | 'compact' | 'currency')}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="compact">Compact (1.2k)</SelectItem>
                          <SelectItem value="currency">Currency ($1.2k)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">Y-Axis Domain</Label>
                      <p className="text-xs text-muted-foreground">Controls Y-axis scale range</p>
                      <Select value={yAxisDomain} onValueChange={(v) => setYAxisDomain(v as 'auto' | 'dataMin-dataMax' | 'zero')}>
                        <SelectTrigger className="w-44">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">auto - Recharts default</SelectItem>
                          <SelectItem value="zero">zero - Start from 0</SelectItem>
                          <SelectItem value="dataMin-dataMax">dataMin-dataMax - Fit to data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Code Preview */}
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

      {/* Raw Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Raw Data</CardTitle>
          <CardDescription>
            {currentSource.name} - {currentSource.data.length} records
            {currentSource.data.some(d => Object.values(d).includes(null)) && (
              <span className="ml-2 text-amber-500">(contains null values)</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm max-h-64">
            <code>{JSON.stringify(currentSource.data, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Documentation Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Data Format */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Data Format</CardTitle>
            <CardDescription>Required data structure for BarChart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              <code>{`// Array of objects - one per category/group
const data = [
  { month: 'Jan', sales: 4000, revenue: 2400 },
  { month: 'Feb', sales: 3000, revenue: 1398 },
  { month: 'Mar', sales: 2000, revenue: 9800 },
]

// ChartConfig for tooltips & legend
const config: ChartConfig = {
  sales: { label: 'Sales', color: 'var(--chart-blue)' },
  revenue: { label: 'Revenue', color: 'var(--chart-green)' },
}`}</code>
            </pre>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Category field</strong> - String for X-axis labels (month, name)</li>
                <li><strong>Value fields</strong> - Numeric for bar heights</li>
                <li><strong>Grouped bars</strong> - Multiple numeric keys = side-by-side bars</li>
                <li><strong>Stacked bars</strong> - Same keys with stackId prop</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Configurable Properties */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Configurable Properties</CardTitle>
            <CardDescription>What you can customize</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Bar Component</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">radius</code> - Corner rounding [top-left, top-right, bottom-right, bottom-left]</li>
                <li><code className="text-xs">stackId</code> - Group bars into stacks</li>
                <li><code className="text-xs">barSize</code> - Fixed bar width in pixels</li>
                <li><code className="text-xs">maxBarSize</code> - Maximum bar width (only applies when <code className="text-xs">barSize</code> is not set)</li>
                <li><code className="text-xs">minPointSize</code> - Minimum bar height for small/zero values</li>
                <li><code className="text-xs">activeBar</code> - Highlight bar on hover (keep bar color or choose custom fill/opacity)</li>
                <li><code className="text-xs">background</code> - Fill behind each bar (use palette or custom)</li>
                <li><code className="text-xs">isAnimationActive</code> - Enable/disable bar entry animation</li>
                <li><code className="text-xs">shape</code> - Custom bar shape. Pass a React element or render function to draw any SVG. Examples: pill/capsule (<code className="text-xs">rx</code> on <code className="text-xs">rect</code>), gradient-filled rect (define <code className="text-xs">defs</code> and reference it), or embed an <code className="text-xs">image</code>. Defaults to Recharts rect.</li>
                <li><code className="text-xs">ReferenceLine</code> - Threshold/target line (configure value, label, stroke)</li>
                <li><code className="text-xs">Brush</code> - Add scrollable/zoomable window along the X-axis (set height/stroke)</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Layout & Spacing</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">layout</code> - &quot;horizontal&quot; (vertical bars) or &quot;vertical&quot; (horizontal bars)</li>
                <li><code className="text-xs">barGap</code> - Gap between bars in same group</li>
                <li><code className="text-xs">barCategoryGap</code> - Gap between bar groups (%)</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Axes</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">XAxis</code> - dataKey, angle, interval, tickFormatter</li>
                <li><code className="text-xs">YAxis</code> - domain, tickCount, tickFormatter</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Interactivity & References</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">Tooltip</code> - Custom content, cursor style</li>
                <li><code className="text-xs">Legend</code> - Position, alignment, onClick</li>
                <li><code className="text-xs">Brush</code> - Range selection for zoom</li>
                <li><code className="text-xs">ReferenceLine</code> - Threshold/target lines</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">Per-bar overrides (color, background, shape, labels) live in the <strong>Bars</strong> tab.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Understanding X & Y Axis */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>📐 Understanding X-Axis & Y-Axis</CardTitle>
          <CardDescription>How data maps to the chart</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium">X-Axis (Categories)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Purpose:</strong> Labels for each group/bar cluster</li>
                <li><strong>Type:</strong> Usually string (month, product) but can be number</li>
                <li><strong>Selection:</strong> Only ONE field at a time</li>
                <li><strong>Example:</strong> &quot;month&quot;, &quot;product&quot;, &quot;year&quot;</li>
              </ul>
              <div className="mt-2 rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-2">
                <p className="text-xs"><strong className="text-blue-700 dark:text-blue-400">💡 interval prop:</strong></p>
                <p className="text-xs text-muted-foreground"><code>interval=0</code> → show all labels</p>
                <p className="text-xs text-muted-foreground"><code>interval=1</code> → show every 2nd label</p>
                <p className="text-xs text-muted-foreground"><code>interval=2</code> → show every 3rd label</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Y-Axis (Bar Values)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Purpose:</strong> Numeric values for each bar/series</li>
                <li><strong>Type:</strong> Numbers required for meaningful bars</li>
                <li><strong>Selection:</strong> ONE or MORE fields (each becomes a bar/series)</li>
                <li><strong>Example:</strong> &quot;sales&quot;, &quot;revenue&quot;, &quot;profit&quot;</li>
              </ul>
              <pre className="mt-2 rounded bg-muted p-2 text-xs">
{`<Bar dataKey=&quot;sales&quot; />
<Bar dataKey=&quot;revenue&quot; />`}
              </pre>
              <div className="mt-2 rounded border border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2">
                <p className="text-xs"><strong className="text-amber-700 dark:text-amber-400">⚠️ Strings allowed but...</strong></p>
                <p className="text-xs text-muted-foreground">String fields render as zero-height bars (NaN). Use numeric fields for visible bars.</p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="font-medium">Visual Example</p>
            <pre className="rounded bg-muted p-3 text-xs font-mono">
{`Data: { month: &quot;Jan&quot;, sales: 4000, revenue: 2400 }

     Y (numbers)
     │
4000 │  █ sales bar
     │
2400 │  █ revenue bar
     │
     └─────────────── X
         &quot;Jan&quot;        (string label)`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Individual vs Global Settings */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>🎛️ Individual Bar vs Global Chart Settings</CardTitle>
          <CardDescription>What can be customized per-bar vs chart-wide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <p className="font-medium">CAN be set per Bar</p>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><code className="text-xs">fill</code> - Bar color</li>
                <li><code className="text-xs">stackId</code> - Stack grouping</li>
                <li><code className="text-xs">minPointSize</code> - Floor for very small values</li>
                <li><code className="text-xs">radius</code> - Corner rounding</li>
                <li><code className="text-xs">label</code> / <code className="text-xs">LabelList</code> - Per-bar labels & positions</li>
                <li><code className="text-xs">background</code> - Per-bar background fill</li>
                <li><code className="text-xs">shape</code> - Custom shape element</li>
                <li><code className="text-xs">hide</code> - Toggle visibility</li>
              </ul>
              <pre className="mt-2 rounded bg-muted p-2 text-xs">
{`// Each bar independent
<Bar dataKey="sales" fill="#60a5fa" />
<Bar dataKey="revenue" fill="#22c55e" radius={8} />`}
              </pre>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <p className="font-medium">Chart-level ONLY</p>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><code className="text-xs">CartesianGrid</code> - One grid for all bars</li>
                <li><code className="text-xs">XAxis / YAxis</code> - Shared axes</li>
                <li><code className="text-xs">Tooltip</code> - Single tooltip component</li>
                <li><code className="text-xs">Legend</code> - Single legend</li>
                <li><code className="text-xs">margins</code> - Chart container padding</li>
                <li><code className="text-xs">width / height</code> - Chart size</li>
              </ul>
              <div className="mt-2 rounded border border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2">
                <p className="text-xs text-muted-foreground">These settings apply to the entire chart. You cannot have different grids or axes per bar series.</p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-3">
            <p className="font-medium text-blue-700 dark:text-blue-400">💡 Key Insight</p>
            <p className="text-muted-foreground text-xs mt-1">Global settings in the &quot;Chart&quot; tab can be overridden individually for each bar/series in the &quot;Bars&quot; tab (colors, backgrounds, shapes, labels). Axes, grid, tooltip, and legend stay global.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
