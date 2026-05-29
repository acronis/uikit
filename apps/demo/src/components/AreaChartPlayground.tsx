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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Brush,
  ReferenceLine,
  LabelList,
} from 'recharts'
import { getChartColors } from '@/lib/chart-colors'

// Data sources (aligned with Line/Bar)
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
      { month: 'July', quarter: 'Q3', sales: 3490, revenue: 4300, profit: 2100, expenses: 1050 },
      { month: 'August', quarter: 'Q3', sales: 4100, revenue: 5200, profit: 2600, expenses: 1200 },
      { month: 'September', quarter: 'Q3', sales: 2900, revenue: 3600, profit: 1650, expenses: 940 },
      { month: 'October', quarter: 'Q4', sales: 4600, revenue: 6100, profit: 3100, expenses: 1300 },
      { month: 'November', quarter: 'Q4', sales: 5100, revenue: 7200, profit: 3550, expenses: 1500 },
      { month: 'December', quarter: 'Q4', sales: 6200, revenue: 8400, profit: 4200, expenses: 1700 },
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
      { product: 'Product F', category: 'Home', units: 134, revenue: 26800, returns: 6 },
      { product: 'Product G', category: 'Outdoors', units: 65, revenue: 13000, returns: 1 },
      { product: 'Product H', category: 'Outdoors', units: 180, revenue: 36000, returns: 9 },
      { product: 'Product I', category: 'Electronics', units: 210, revenue: 52000, returns: 11 },
    ],
    xFields: ['product', 'category'],
    yFields: ['units', 'revenue', 'returns'],
  },
  yearly: {
    name: 'Yearly Trends (numeric X)',
    data: [
      { year: 2017, revenue: 42000, customers: 1180, growth: 8 },
      { year: 2018, revenue: 48000, customers: 1320, growth: 12 },
      { year: 2019, revenue: 52000, customers: 1450, growth: 15 },
      { year: 2020, revenue: 48000, customers: 1380, growth: -8 },
      { year: 2021, revenue: 61000, customers: 1720, growth: 27 },
      { year: 2022, revenue: 73000, customers: 2100, growth: 20 },
      { year: 2023, revenue: 89000, customers: 2650, growth: 22 },
      { year: 2024, revenue: 102000, customers: 3200, growth: 15 },
      { year: 2025, revenue: 111000, customers: 3520, growth: 9 },
      { year: 2026, revenue: 128000, customers: 4010, growth: 19 },
    ],
    xFields: ['year'],
    yFields: ['revenue', 'customers', 'growth'],
  },
} as const

type DataSourceKey = keyof typeof dataSources

const areaColorPalette = [
  '#4169e1',
  '#2db89a',
  '#d946ef',
  '#ef5350',
  '#d4c92a',
  '#38bdf8',
  '#7c3aed',
  '#9ca3af',
  '#ff810d',
]

const curveTypes = [
  { value: 'linear', label: 'linear - Straight lines' },
  { value: 'monotone', label: 'monotone - Smooth (recommended)' },
  { value: 'natural', label: 'natural - Natural cubic spline' },
  { value: 'step', label: 'step - Step at midpoint' },
  { value: 'stepBefore', label: 'stepBefore - Step before point' },
  { value: 'stepAfter', label: 'stepAfter - Step after point' },
]

const indicatorTypes = [
  { value: 'dot', label: 'dot - Small square' },
  { value: 'line', label: 'line - Vertical bar' },
  { value: 'dashed', label: 'dashed - Dashed line' },
]

type CurveType = 'linear' | 'monotone' | 'natural' | 'step' | 'stepBefore' | 'stepAfter'

export function AreaChartPlayground() {
  const colors = getChartColors(4)

  // Data source state
  const [dataSource, setDataSource] = React.useState<DataSourceKey>('sales')
  const currentSource = dataSources[dataSource]
  const [xAxisField, setXAxisField] = React.useState<string>(currentSource.xFields[0])
  const [enabledYFields, setEnabledYFields] = React.useState<string[]>(currentSource.yFields.slice(0, 3))

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
  const [curveType, setCurveType] = React.useState<CurveType>('monotone')
  const [tooltipIndicator, setTooltipIndicator] = React.useState<'dot' | 'line' | 'dashed'>('dot')
  
  // Area-specific settings
  const [fillOpacity, setFillOpacity] = React.useState(0.4)
  const [strokeWidth, setStrokeWidth] = React.useState(2)
  const [stacked, setStacked] = React.useState(false)
  const [showDots, setShowDots] = React.useState(false)
  const [dotSize, setDotSize] = React.useState(4)
  const [showActiveDot, setShowActiveDot] = React.useState(false)
  const [connectNulls, setConnectNulls] = React.useState(false)
  const [isAnimationActive, setIsAnimationActive] = React.useState(true)
  const [showBrush, setShowBrush] = React.useState(false)
  const [brushHeight, setBrushHeight] = React.useState(30)
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
  const [areaSettings, setAreaSettings] = React.useState<Record<string, {
    color?: string
    fillOpacity?: number
    strokeWidth?: number
    type?: CurveType
    showDot?: boolean
    showActiveDot?: boolean
    dotSize?: number
    showLabel?: boolean
    labelPosition?: 'top' | 'insideTop' | 'insideBottom' | 'insideStart' | 'insideEnd'
  }>>({})

  const config = React.useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {}
    enabledYFields.forEach((field, index) => {
      cfg[field] = {
        label: field.charAt(0).toUpperCase() + field.slice(1),
        color: colors[index % colors.length],
      }
    })
    return cfg
  }, [enabledYFields, colors])

  const getAreaSettings = React.useCallback(
    (field: string, index: number) => {
      const defaults = {
        color: colors[index % colors.length],
        fillOpacity: undefined as number | undefined,
        strokeWidth: undefined as number | undefined,
        type: undefined as CurveType | undefined,
        showDot: undefined as boolean | undefined,
        showActiveDot: undefined as boolean | undefined,
        dotSize: undefined as number | undefined,
        showLabel: undefined as boolean | undefined,
        labelPosition: undefined as ('top' | 'insideTop' | 'insideBottom' | 'insideStart' | 'insideEnd') | undefined,
      }
      return { ...defaults, ...(areaSettings[field] || {}) }
    },
    [areaSettings, colors]
  )

  const updateAreaSetting = (field: string, key: keyof typeof areaSettings[string], value: string | number | boolean | undefined | CurveType | 'top' | 'insideTop' | 'insideBottom' | 'insideStart' | 'insideEnd') => {
    setAreaSettings((prev) => ({
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
    lines.push(`  <AreaChart data={data}>`)
    
    if (showGrid) {
      lines.push(`    <CartesianGrid${gridDashed ? ' strokeDasharray="3 3"' : ''} />`)
    }
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
    if (showTooltip) {
      lines.push(`    <ChartTooltip content={<ChartTooltipContent indicator="${tooltipIndicator}" />} />`)
    }
    if (showLegend) {
      lines.push(`    <ChartLegend content={<ChartLegendContent />} />`)
    }
    
    const stackId = stacked ? ' stackId="1"' : ''
    enabledYFields.forEach((field, index) => {
      const settings = getAreaSettings(field, index)
      const color = settings.color || colors[index % colors.length]
      const fillOp = settings.fillOpacity ?? fillOpacity
      const strokeW = settings.strokeWidth ?? strokeWidth
      const typeVal = settings.type || curveType
      const dotFlag = settings.showDot ?? showDots
      const dotSz = settings.dotSize ?? dotSize
      const activeDotFlag = settings.showActiveDot ?? showActiveDot
      const dotStr = dotFlag ? ` dot={{ r: ${dotSz} }}` : ''
      const activeDotStr = activeDotFlag ? ` activeDot={{ r: ${dotSz + 2} }}` : ''
      const labelEnabled = settings.showLabel ?? false
      const labelPos = settings.labelPosition || 'top'
      const barLine = `    <Area type="${typeVal}" dataKey="${field}" stroke="${color}" fill="${color}" fillOpacity={${fillOp}} strokeWidth={${strokeW}}${stackId}${dotStr}${activeDotStr} connectNulls={${connectNulls}} isAnimationActive={${isAnimationActive}} />`
      if (labelEnabled) {
        lines.push(`    <Area type="${typeVal}" dataKey="${field}" stroke="${color}" fill="${color}" fillOpacity={${fillOp}} strokeWidth={${strokeW}}${stackId}${dotStr}${activeDotStr} connectNulls={${connectNulls}} isAnimationActive={${isAnimationActive}}>`)
        lines.push(`      <LabelList dataKey="${field}" position="${labelPos}" />`)
        lines.push(`    </Area>`)
      } else {
        lines.push(barLine)
      }
    })
    if (showReferenceLine) {
      lines.push(`    <ReferenceLine y={${referenceLineValue}} stroke="${referenceLineStroke}" strokeWidth={2} strokeDasharray="5 5" label={{ value: "${referenceLineLabel}: ${referenceLineValue}", position: "insideTopRight", fill: "${referenceLineStroke}" }} />`)
    }
    if (showBrush) {
      lines.push(`    <Brush dataKey="${xAxisField}" height={${brushHeight}} stroke="hsl(var(--muted-foreground))" />`)
    }
    
    lines.push(`  </AreaChart>`)
    lines.push(`</ChartContainer>`)
    return lines.join('\n')
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">AreaChart Playground</h2>
        <p className="text-muted-foreground">
          Explore AreaChart settings - like LineChart but with filled areas
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
              <AreaChart data={[...currentSource.data]} margin={{ right: 24 }}>
                {showGrid && (
                  <CartesianGrid 
                    strokeDasharray={gridDashed ? "3 3" : undefined} 
                    className="stroke-muted"
                  />
                )}
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
                {showTooltip && (
                  <ChartTooltip 
                    content={(props) => <ChartTooltipContent {...props} indicator={tooltipIndicator} />} 
                  />
                )}
                {showLegend && (
                  <ChartLegend content={<ChartLegendContent />} />
                )}
                {enabledYFields.map((field, index) => (
                  <Area
                    key={field}
                    type={getAreaSettings(field, index).type || curveType}
                    dataKey={field}
                    stroke={getAreaSettings(field, index).color || colors[index % colors.length]}
                    fill={getAreaSettings(field, index).color || colors[index % colors.length]}
                    fillOpacity={getAreaSettings(field, index).fillOpacity ?? fillOpacity}
                    strokeWidth={getAreaSettings(field, index).strokeWidth ?? strokeWidth}
                    stackId={stacked ? "1" : undefined}
                    dot={(getAreaSettings(field, index).showDot ?? showDots) ? { r: (getAreaSettings(field, index).dotSize ?? dotSize) } : false}
                    activeDot={(getAreaSettings(field, index).showActiveDot ?? showActiveDot) ? { r: (getAreaSettings(field, index).dotSize ?? dotSize) + 2 } : false}
                    connectNulls={connectNulls}
                    isAnimationActive={isAnimationActive}
                  >
                    {(getAreaSettings(field, index).showLabel ?? false) && (
                      <LabelList dataKey={field} position={getAreaSettings(field, index).labelPosition || 'top'} fontSize={11} />
                    )}
                  </Area>
                ))}
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
              </AreaChart>
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="area">Area</TabsTrigger>
                <TabsTrigger value="series">Series</TabsTrigger>
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
                  <p className="text-xs text-muted-foreground">Available fields shown below</p>
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
                  <Label className="text-sm font-medium">Y-Axis Fields (Areas)</Label>
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

              <TabsContent value="area" className="space-y-4 pt-4">
                {/* Curve Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Curve Type (type=)</Label>
                  <Select value={curveType} onValueChange={(v) => setCurveType(v as CurveType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {curveTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Fill Opacity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Fill Opacity</Label>
                    <Input
                      type="number"
                      value={fillOpacity}
                      onChange={(e) => setFillOpacity(Number(e.target.value) || 0.1)}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-20 h-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    0 = transparent, 1 = solid
                  </p>
                </div>

                <Separator />

                {/* Stroke Width */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Stroke Width</Label>
                    <Input
                      type="number"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(Number(e.target.value) || 1)}
                      min={0}
                      max={6}
                      className="w-20 h-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Border line thickness (0 = no border)
                  </p>
                </div>

                <Separator />

                {/* Animation */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Animation</Label>
                    <p className="text-xs text-muted-foreground">isAnimationActive</p>
                  </div>
                  <Switch checked={isAnimationActive} onCheckedChange={setIsAnimationActive} />
                </div>

                <Separator />

                {/* Stacked */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Stacked Areas</Label>
                    <p className="text-xs text-muted-foreground">stackId=&quot;1&quot; on all areas</p>
                  </div>
                  <Switch checked={stacked} onCheckedChange={setStacked} />
                </div>

                <Separator />

                {/* Show Dots */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Dots</Label>
                    <p className="text-xs text-muted-foreground">Data point markers</p>
                  </div>
                  <Switch checked={showDots} onCheckedChange={setShowDots} />
                </div>

                {showDots && (
                  <div className="space-y-2 pl-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Dot Size (px)</Label>
                      <Input
                        type="number"
                        value={dotSize}
                        onChange={(e) => setDotSize(Number(e.target.value) || 2)}
                        min={2}
                        max={10}
                        className="w-20 h-8"
                      />
                    </div>
                  </div>
                )}

                <Separator />

                {/* Active Dot */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Active Dot</Label>
                    <p className="text-xs text-muted-foreground">Hover marker size = dot size + 2</p>
                  </div>
                  <Switch checked={showActiveDot} onCheckedChange={setShowActiveDot} />
                </div>

                <Separator />

                {/* Connect Nulls */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Connect Nulls</Label>
                    <p className="text-xs text-muted-foreground">connectNulls on all areas</p>
                  </div>
                  <Switch checked={connectNulls} onCheckedChange={setConnectNulls} />
                </div>

                <Separator />

                {/* Brush */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Brush</Label>
                    <p className="text-xs text-muted-foreground">Zoom/pan on X-axis</p>
                  </div>
                  <Switch checked={showBrush} onCheckedChange={setShowBrush} />
                </div>

                {showBrush && (
                  <div className="space-y-2 pl-4">
                    <Label className="text-sm">Brush Height</Label>
                    <Input
                      type="number"
                      value={brushHeight}
                      onChange={(e) => setBrushHeight(Number(e.target.value) || 24)}
                      min={10}
                      max={120}
                      className="w-24 h-8"
                    />
                  </div>
                )}

                <Separator />

                {/* Reference Line */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Reference Line</Label>
                    <p className="text-xs text-muted-foreground">Threshold/target line</p>
                  </div>
                  <Switch checked={showReferenceLine} onCheckedChange={setShowReferenceLine} />
                </div>

                {showReferenceLine && (
                  <div className="space-y-2 pl-4">
                    <Label className="text-sm">Reference Value</Label>
                    <Input
                      type="number"
                      value={referenceLineValue}
                      onChange={(e) => setReferenceLineValue(Number(e.target.value))}
                      className="w-32 h-8"
                    />
                    <Label className="text-sm">Reference Label</Label>
                    <Input
                      type="text"
                      value={referenceLineLabel}
                      onChange={(e) => setReferenceLineLabel(e.target.value)}
                      className="w-48 h-8"
                    />
                    <Label className="text-sm">Reference Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={referenceLineStroke}
                        onChange={(e) => setReferenceLineStroke(e.target.value)}
                        className="h-8 w-10 rounded border border-border bg-transparent"
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

                {/* Tooltip */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Tooltip</Label>
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
                  <Label className="text-sm font-medium">Show Legend</Label>
                  <Switch checked={showLegend} onCheckedChange={setShowLegend} />
                </div>
              </TabsContent>

              <TabsContent value="series" className="space-y-4 pt-4">
                {enabledYFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No areas enabled. Go to Data tab to select Y-axis fields.</p>
                ) : (
                  <div className="space-y-3">
                    {enabledYFields.map((field, index) => {
                      const settings = getAreaSettings(field, index)
                      return (
                        <div key={field} className="space-y-3 rounded-lg border p-3" style={{ borderLeftColor: settings.color || colors[index % colors.length], borderLeftWidth: 4 }}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{field}</p>
                              <p className="text-xs text-muted-foreground">dataKey=&quot;{field}&quot;</p>
                            </div>
                            <span className="text-xs text-muted-foreground">Per-area overrides</span>
                          </div>

                          {/* Color */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Color</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Custom:</span>
                                <input
                                  type="color"
                                  value={settings.color || colors[index % colors.length]}
                                  onChange={(e) => updateAreaSetting(field, 'color', e.target.value)}
                                  className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                                  title="Pick custom color"
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {areaColorPalette.map((c) => (
                                <button
                                  key={c}
                                  className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${ (settings.color || colors[index % colors.length]) === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                                  style={{ backgroundColor: c }}
                                  onClick={() => updateAreaSetting(field, 'color', c)}
                                  title={c}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Fill Opacity & Stroke Width */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Fill Opacity</Label>
                              <Input
                                type="number"
                                step="0.1"
                                min={0}
                                max={1}
                                value={settings.fillOpacity ?? ''}
                                placeholder={String(fillOpacity)}
                                onChange={(e) => updateAreaSetting(field, 'fillOpacity', e.target.value === '' ? undefined : Number(e.target.value))}
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Stroke Width</Label>
                              <Input
                                type="number"
                                min={0}
                                max={6}
                                value={settings.strokeWidth ?? ''}
                                placeholder={String(strokeWidth)}
                                onChange={(e) => updateAreaSetting(field, 'strokeWidth', e.target.value === '' ? undefined : Number(e.target.value))}
                                className="h-8"
                              />
                            </div>
                          </div>

                          {/* Curve Type */}
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Curve Type (override)</Label>
                            <Select value={settings.type || 'inherit'} onValueChange={(v) => updateAreaSetting(field, 'type', v === 'inherit' ? undefined : (v as CurveType))}>
                              <SelectTrigger className="h-8 w-44">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="inherit">Inherit (global)</SelectItem>
                                <SelectItem value="monotone">monotone</SelectItem>
                                <SelectItem value="linear">linear</SelectItem>
                                <SelectItem value="natural">natural</SelectItem>
                                <SelectItem value="step">step</SelectItem>
                                <SelectItem value="stepBefore">stepBefore</SelectItem>
                                <SelectItem value="stepAfter">stepAfter</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Dots / Active Dot */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs text-muted-foreground">Show Dots</Label>
                                <Switch
                                  checked={settings.showDot ?? showDots}
                                  onCheckedChange={(checked) => updateAreaSetting(field, 'showDot', checked)}
                                />
                              </div>
                              {(settings.showDot ?? showDots) && (
                                <Input
                                  type="number"
                                  min={2}
                                  max={10}
                                  value={settings.dotSize ?? dotSize}
                                  onChange={(e) => updateAreaSetting(field, 'dotSize', Number(e.target.value) || dotSize)}
                                  className="h-8"
                                />
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs text-muted-foreground">Active Dot</Label>
                                <Switch
                                  checked={settings.showActiveDot ?? showActiveDot}
                                  onCheckedChange={(checked) => updateAreaSetting(field, 'showActiveDot', checked)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Labels */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs text-muted-foreground">Labels</Label>
                              <Switch
                                checked={settings.showLabel ?? false}
                                onCheckedChange={(checked) => updateAreaSetting(field, 'showLabel', checked)}
                              />
                            </div>
                            {(settings.showLabel ?? false) && (
                              <Select
                                value={settings.labelPosition || 'top'}
                                onValueChange={(v) => updateAreaSetting(field, 'labelPosition', v as 'top' | 'insideTop' | 'insideBottom' | 'insideStart' | 'insideEnd')}
                              >
                                <SelectTrigger className="h-8 w-44">
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
                            )}
                          </div>
                        </div>
                      )})}
                    <p className="text-xs text-muted-foreground">Each area uses dataKey to map to a field in your data. When stacked, areas are layered.</p>
                  </div>
                )}
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
                    <p className="text-xs text-muted-foreground">{'<XAxis dataKey="month" />'}</p>
                  </div>
                  <Switch checked={showXAxis} onCheckedChange={setShowXAxis} />
                </div>

                {showXAxis && (
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
                    <p className="text-xs text-muted-foreground">{'<YAxis />'}</p>
                  </div>
                  <Switch checked={showYAxis} onCheckedChange={setShowYAxis} />
                </div>

                {showYAxis && (
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
            <CardDescription>Required data structure for AreaChart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              <code>{`// Array of objects with consistent keys
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
                <li><strong>X-axis field</strong> - String, Date, or Number (month, date, year)</li>
                <li><strong>Y-axis fields</strong> - Numeric values for each area</li>
                <li><strong>Consistent keys</strong> - All objects must have same structure</li>
                <li><strong>Stacking</strong> - Use <code className="text-xs">stackId</code> to stack areas</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Configurable Properties */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Configurable Properties</CardTitle>
            <CardDescription>Native Recharts props - what you can customize</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Area Component</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">type</code> - monotone, linear, step, natural</li>
                <li><code className="text-xs">strokeWidth</code> - Border thickness</li>
                <li><code className="text-xs">fillOpacity</code> - Area transparency (0-1)</li>
                <li><code className="text-xs">stackId</code> - Stack areas together</li>
                <li><code className="text-xs">dot / activeDot</code> - Data point markers</li>
                <li><code className="text-xs">connectNulls</code> - Bridge gaps</li>
                <li><code className="text-xs">isAnimationActive</code> - Enable/disable animation</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">AreaChart Container</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">margin</code> - Padding around chart</li>
                <li><code className="text-xs">Brush</code> - Range selection on X-axis</li>
                <li><code className="text-xs">ReferenceLine</code> - Threshold/target line</li>
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
                <li><code className="text-xs">Legend</code> - Position, alignment</li>
                <li><code className="text-xs">Brush</code> - Range selection for zoom</li>
                <li><code className="text-xs">ReferenceLine</code> - Threshold/target lines</li>
              </ul>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Understanding X & Y Axis */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>� Understanding X-Axis & Y-Axis</CardTitle>
          <CardDescription>How data maps to the chart</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium">X-Axis (Categories)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Purpose:</strong> Labels for each data point</li>
                <li><strong>Type:</strong> String, Date, or Number</li>
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
              <p className="font-medium">Y-Axis (Area Values)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Purpose:</strong> Numeric values for each area</li>
                <li><strong>Type:</strong> Numbers required for visible areas</li>
                <li><strong>Selection:</strong> ONE or MORE fields (each becomes an area)</li>
                <li><strong>Example:</strong> &quot;sales&quot;, &quot;revenue&quot;, &quot;profit&quot;</li>
              </ul>
              <pre className="mt-2 rounded bg-muted p-2 text-xs">
{`<Area dataKey=&quot;sales&quot; />
<Area dataKey=&quot;revenue&quot; />`}
              </pre>
              <div className="mt-2 rounded border border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2">
                <p className="text-xs"><strong className="text-amber-700 dark:text-amber-400">⚠️ Strings allowed but...</strong></p>
                <p className="text-xs text-muted-foreground">String fields render as zero-height areas. Use numeric fields for meaningful areas.</p>
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
4000 │  ▓ sales area
     │
2400 │  ▓ revenue area
     │
     └─────────────── X
         "Jan"        (string label)`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Individual vs Global Settings */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>🎛️ Individual Area vs Global Chart Settings</CardTitle>
          <CardDescription>What can be customized per-area vs chart-wide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <p className="font-medium">CAN be set per Area</p>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><code className="text-xs">stroke</code> / <code className="text-xs">fill</code> - Colors</li>
                <li><code className="text-xs">fillOpacity</code> - Transparency</li>
                <li><code className="text-xs">strokeWidth</code> - Outline thickness</li>
                <li><code className="text-xs">type</code> - Curve type</li>
                <li><code className="text-xs">dot</code> / <code className="text-xs">activeDot</code> - Point markers</li>
                <li><code className="text-xs">label</code> / <code className="text-xs">LabelList</code> - Value labels</li>
                <li><code className="text-xs">stackId</code> - Stacking per series</li>
                <li><code className="text-xs">hide</code> - Toggle visibility</li>
              </ul>
              <pre className="mt-2 rounded bg-muted p-2 text-xs">
{`<Area dataKey="sales" fill="#60a5fa" fillOpacity={0.4} />
<Area dataKey="revenue" strokeWidth={3} type="step" />`}
              </pre>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <p className="font-medium">Chart-level ONLY</p>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><code className="text-xs">CartesianGrid</code> - One grid for all</li>
                <li><code className="text-xs">XAxis / YAxis</code> - Shared axes</li>
                <li><code className="text-xs">Tooltip</code> - Single tooltip component</li>
                <li><code className="text-xs">Legend</code> - Single legend</li>
                <li><code className="text-xs">Brush</code> - Single brush</li>
                <li><code className="text-xs">ReferenceLine</code> - Single reference line</li>
                <li><code className="text-xs">margin</code> - Chart padding</li>
                <li><code className="text-xs">width / height</code> - Chart size</li>
              </ul>
              <div className="mt-2 rounded border border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2">
                <p className="text-xs text-muted-foreground">These settings apply to the entire chart. You cannot have different grids or axes per area.</p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-3">
            <p className="font-medium text-blue-700 dark:text-blue-400">💡 Key Insight</p>
            <p className="text-muted-foreground text-xs mt-1">Global settings in the &quot;Area&quot; tab can be overridden individually for each area in the &quot;Series&quot; tab (colors, opacity, stroke, dots, labels). Axes, grid, tooltip, legend, brush, and reference line stay global.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
