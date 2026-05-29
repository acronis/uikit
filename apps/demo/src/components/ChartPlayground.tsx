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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Brush,
  ReferenceLine,
} from 'recharts'

// Data Sources - Complex examples with multiple X options and many Y fields
// Some data includes null values to demonstrate connectNulls feature
const dataSources = {
  sales: {
    name: 'Sales Data (with gaps)',
    data: [
      { month: 'January', quarter: 'Q1 2024', week: 1, sales: 4000, revenue: 2400, profit: 1600, expenses: 800, orders: 120, returns: 8, growth: 12.5 },
      { month: 'February', quarter: 'Q1 2024', week: 5, sales: 3000, revenue: 1398, profit: null, expenses: 796, orders: 98, returns: 5, growth: -25.0 },
      { month: 'March', quarter: 'Q1 2024', week: 9, sales: 5000, revenue: 9800, profit: 4800, expenses: 1200, orders: 156, returns: null, growth: 66.7 },
      { month: 'April', quarter: 'Q2 2024', week: 14, sales: null, revenue: 3908, profit: 1128, expenses: 980, orders: 89, returns: 7, growth: -44.4 },
      { month: 'May', quarter: 'Q2 2024', week: 18, sales: 1890, revenue: null, profit: 2910, expenses: 650, orders: 72, returns: 3, growth: -32.0 },
      { month: 'June', quarter: 'Q2 2024', week: 22, sales: 2390, revenue: 3800, profit: 1410, expenses: 890, orders: 95, returns: 6, growth: null },
      { month: 'July', quarter: 'Q3 2024', week: 27, sales: 3490, revenue: 4300, profit: 810, expenses: 1100, orders: 134, returns: 9, growth: 46.0 },
    ],
    xFields: ['month', 'quarter', 'week'],
    yFields: ['sales', 'revenue', 'profit', 'expenses', 'orders', 'returns', 'growth'],
  },
  analytics: {
    name: 'Website Analytics (long labels)',
    data: [
      { day: 'Monday', date: '2024-01-15', users: 1200, activeUsers: 890, newUsers: 310, sessions: 1580, pageViews: 4500, avgDuration: 245, bounceRate: 35 },
      { day: 'Tuesday', date: '2024-01-16', users: 1500, activeUsers: 1100, newUsers: 400, sessions: 1820, pageViews: 5200, avgDuration: 268, bounceRate: 32 },
      { day: 'Wednesday', date: '2024-01-17', users: 1800, activeUsers: 1350, newUsers: 450, sessions: 2100, pageViews: 6100, avgDuration: 290, bounceRate: 28 },
      { day: 'Thursday', date: '2024-01-18', users: 1400, activeUsers: 980, newUsers: 420, sessions: 1650, pageViews: 4800, avgDuration: 255, bounceRate: 38 },
      { day: 'Friday', date: '2024-01-19', users: 2100, activeUsers: 1680, newUsers: 420, sessions: 2450, pageViews: 7200, avgDuration: 312, bounceRate: 25 },
      { day: 'Saturday', date: '2024-01-20', users: 900, activeUsers: 650, newUsers: 250, sessions: 980, pageViews: 3100, avgDuration: 198, bounceRate: 42 },
      { day: 'Sunday', date: '2024-01-21', users: 750, activeUsers: 520, newUsers: 230, sessions: 820, pageViews: 2800, avgDuration: 175, bounceRate: 45 },
    ],
    xFields: ['day', 'date'],
    yFields: ['users', 'activeUsers', 'newUsers', 'sessions', 'pageViews', 'avgDuration', 'bounceRate'],
  },
  performance: {
    name: 'Server Metrics (timestamps)',
    data: [
      { timestamp: '2024-01-15 00:00', cpu: 45, memory: 62, disk: 34, network: 120, requests: 850, latency: 45 },
      { timestamp: '2024-01-15 04:00', cpu: 32, memory: 58, disk: 33, network: 80, requests: 420, latency: 38 },
      { timestamp: '2024-01-15 08:00', cpu: 78, memory: 75, disk: 38, network: 450, requests: 2800, latency: 62 },
      { timestamp: '2024-01-15 12:00', cpu: 92, memory: 88, disk: 42, network: 680, requests: 4500, latency: 95 },
      { timestamp: '2024-01-15 16:00', cpu: 85, memory: 82, disk: 40, network: 520, requests: 3200, latency: 78 },
      { timestamp: '2024-01-15 20:00', cpu: 65, memory: 70, disk: 36, network: 320, requests: 1800, latency: 52 },
    ],
    xFields: ['timestamp'],
    yFields: ['cpu', 'memory', 'disk', 'network', 'requests', 'latency'],
  },
  yearly: {
    name: 'Yearly Trends (numeric X-axis)',
    data: [
      { year: 2018, revenue: 45000, customers: 1200, products: 85, satisfaction: 72 },
      { year: 2019, revenue: 52000, customers: 1450, products: 92, satisfaction: 75 },
      { year: 2020, revenue: 48000, customers: 1380, products: 88, satisfaction: 68 },
      { year: 2021, revenue: 61000, customers: 1720, products: 105, satisfaction: 78 },
      { year: 2022, revenue: 73000, customers: 2100, products: 124, satisfaction: 82 },
      { year: 2023, revenue: 89000, customers: 2650, products: 148, satisfaction: 85 },
      { year: 2024, revenue: 102000, customers: 3200, products: 172, satisfaction: 88 },
    ],
    xFields: ['year'],
    yFields: ['revenue', 'customers', 'products', 'satisfaction'],
  },
}

type DataSourceKey = keyof typeof dataSources

const curveTypes = [
  { value: 'linear', label: 'linear - Straight lines' },
  { value: 'monotone', label: 'monotone - Smooth (recommended)' },
  { value: 'natural', label: 'natural - Natural cubic spline' },
  { value: 'step', label: 'step - Step at midpoint' },
  { value: 'stepBefore', label: 'stepBefore - Step before point' },
  { value: 'stepAfter', label: 'stepAfter - Step after point' },
  { value: 'basis', label: 'basis - B-spline' },
]

// Tooltip indicator types - shadcn/ui feature, NOT native Recharts
// These control the visual indicator shown next to each item in the tooltip
const indicatorTypes = [
  { value: 'dot', label: 'dot - Small square' },
  { value: 'line', label: 'line - Vertical bar' },
  { value: 'dashed', label: 'dashed - Dashed line' },
]

type CurveType = 'linear' | 'monotone' | 'natural' | 'step' | 'stepBefore' | 'stepAfter' | 'basis'

// Acronis chart color palette - from themes/acronis-default.scss
const colorPalette = [
  { name: '--av-chart-blue', value: '#4169e1' },
  { name: '--av-chart-green', value: '#2db89a' },
  { name: '--av-chart-purple', value: '#d946ef' },
  { name: '--av-chart-red', value: '#ef5350' },
  { name: '--av-chart-yellow', value: '#d4c92a' },
  { name: '--av-chart-turquoise', value: '#38bdf8' },
  { name: '--av-chart-brown', value: '#a57c52' },
  { name: '--av-chart-violet', value: '#7c3aed' },
  { name: '--av-chart-grey', value: '#9ca3af' },
  { name: '--av-chart-light-blue', value: '#93c5fd' },
  { name: '--av-chart-success', value: '#9bc225' },
  { name: '--av-chart-warning', value: '#ffc107' },
  { name: '--av-chart-danger', value: '#ea3939' },
  { name: '--av-chart-critical', value: '#ff810d' },
  { name: '--av-chart-info', value: '#408bea' },
]

// Helper to get default color by index
const getDefaultColor = (index: number) => colorPalette[index % colorPalette.length].value

// Individual line settings type
interface LineSettings {
  color: string
  strokeWidth: number
  dashed: boolean
  curveType: CurveType
  showDots: boolean
  dotSize: number
}

export function ChartPlayground() {
  // Data source selection
  const [dataSource, setDataSource] = React.useState<DataSourceKey>('sales')
  const [xAxisField, setXAxisField] = React.useState('month')
  const [enabledYFields, setEnabledYFields] = React.useState<string[]>(['sales', 'revenue', 'profit'])
  
  // Get current data source
  const currentSource = dataSources[dataSource]
  
  // Individual line settings - keyed by field name
  const [lineSettings, setLineSettings] = React.useState<Record<string, LineSettings>>({})
  
  // Chart settings state (global defaults)
  const [showGrid, setShowGrid] = React.useState(true)
  const [gridDashed, setGridDashed] = React.useState(true)
  const [showXAxis, setShowXAxis] = React.useState(true)
  const [showYAxis, setShowYAxis] = React.useState(true)
  const [showTooltip, setShowTooltip] = React.useState(true)
  const [showLegend, setShowLegend] = React.useState(true)
  const [showBrush, setShowBrush] = React.useState(false)
  const [connectNulls, setConnectNulls] = React.useState(false)
  const [isAnimationActive, setIsAnimationActive] = React.useState(true)
  const [showReferenceLine, setShowReferenceLine] = React.useState(false)
  const [referenceLineValue, setReferenceLineValue] = React.useState(3000)
  const [referenceLineLabel, setReferenceLineLabel] = React.useState('Target')
  const [referenceLineStroke, setReferenceLineStroke] = React.useState('#ef4444')
  const [yAxisDomain, setYAxisDomain] = React.useState<'auto' | 'dataMin-dataMax' | 'zero'>('auto')
  const [showActiveDot, setShowActiveDot] = React.useState(true)
  const [xAxisAngle, setXAxisAngle] = React.useState(0)
  const [xAxisInterval, setXAxisInterval] = React.useState<number>(0)
  const [xAxisFormatter, setXAxisFormatter] = React.useState<'none' | 'truncate3' | 'truncate5'>('none')
  const [yAxisTickCount, setYAxisTickCount] = React.useState<number | undefined>(undefined)
  const [yAxisFormatter, setYAxisFormatter] = React.useState<'none' | 'compact' | 'currency'>('none')
  const [curveType, setCurveType] = React.useState<CurveType>('monotone')
  const [strokeWidth, setStrokeWidth] = React.useState(2)
  const [showDots, setShowDots] = React.useState(true)
  const [dotSize, setDotSize] = React.useState(4)
  const [tooltipIndicator, setTooltipIndicator] = React.useState<'dot' | 'line' | 'dashed'>('dot')
  
  // Get settings for a line - uses individual settings if set, otherwise falls back to global
  const getLineSettings = (field: string, index: number): LineSettings => {
    const individual = lineSettings[field]
    return {
      color: individual?.color ?? getDefaultColor(index),
      strokeWidth: individual?.strokeWidth ?? strokeWidth,
      dashed: individual?.dashed ?? false,
      curveType: individual?.curveType ?? curveType,
      showDots: individual?.showDots ?? showDots,
      dotSize: individual?.dotSize ?? dotSize,
    }
  }
  
  // Update a specific line setting
  const updateLineSetting = (field: string, key: keyof LineSettings, value: LineSettings[keyof LineSettings]) => {
    setLineSettings(prev => ({
      ...prev,
      [field]: {
        ...getLineSettings(field, enabledYFields.indexOf(field)),
        [key]: value,
      }
    }))
  }
  
  // Dynamic config based on enabled fields and their settings
  const config = React.useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {}
    enabledYFields.forEach((field, index) => {
      const settings = getLineSettings(field, index)
      cfg[field] = { 
        label: field.charAt(0).toUpperCase() + field.slice(1), 
        color: settings.color 
      }
    })
    return cfg
  }, [enabledYFields, lineSettings, getLineSettings])

  // Generate code preview
  const generateCode = () => {
    const lines = []
    lines.push(`<ChartContainer config={config} className="h-[400px]">`)
    lines.push(`  <LineChart data={data} margin={{ right: 24 }}>`)
    
    if (showGrid) {
      lines.push(`    <CartesianGrid${gridDashed ? ' strokeDasharray="3 3"' : ''} />`)
    }
    if (showXAxis) {
      const xProps = [`dataKey="${xAxisField}"`]
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
      if (yAxisFormatter === 'compact') yProps.push(`tickFormatter={(v) => v >= 1000 ? \`\${(v/1000).toFixed(1)}k\` : v}`)
      else if (yAxisFormatter === 'currency') yProps.push(`tickFormatter={(v) => \`$\${v >= 1000 ? \`\${(v/1000).toFixed(1)}k\` : v}\`}`)
      lines.push(`    <YAxis${yProps.length ? ' ' + yProps.join(' ') : ''} />`)
    }
    if (showTooltip) {
      lines.push(`    <ChartTooltip content={<ChartTooltipContent indicator="${tooltipIndicator}" />} />`)
    }
    if (showLegend) {
      lines.push(`    <ChartLegend content={<ChartLegendContent />} />`)
    }
    
    enabledYFields.forEach((field, index) => {
      const settings = getLineSettings(field, index)
      const props = [`type="${settings.curveType}"`, `dataKey="${field}"`, `stroke="${settings.color}"`, `strokeWidth={${settings.strokeWidth}}`]
      if (!settings.showDots) props.push(`dot={false}`)
      if (showActiveDot) props.push(`activeDot={{ r: ${settings.dotSize + 2} }}`)
      if (settings.dashed) props.push(`strokeDasharray="5 5"`)
      if (connectNulls) props.push(`connectNulls`)
      if (!isAnimationActive) props.push(`isAnimationActive={false}`)
      lines.push(`    <Line ${props.join(' ')} />`)
    })
    if (showReferenceLine) {
      lines.push(`    <ReferenceLine y={${referenceLineValue}} stroke="${referenceLineStroke}" strokeWidth={2} strokeDasharray="5 5" label={{ value: "${referenceLineLabel}: ${referenceLineValue}", position: "insideTopRight", fill: "${referenceLineStroke}" }} />`)
    }
    if (showBrush) {
      lines.push(`    <Brush dataKey="${xAxisField}" height={30} stroke="hsl(var(--primary))" />`)
    }
    
    lines.push(`  </LineChart>`)
    lines.push(`</ChartContainer>`)
    return lines.join('\n')
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">LineChart Playground</h2>
        <p className="text-muted-foreground">
          Interactively explore LineChart settings - toggle options to see what each does
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
              <LineChart data={currentSource.data} margin={{ right: 24 }}>
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
                    textAnchor={xAxisAngle !== 0 ? 'end' : 'middle'}
                    height={xAxisAngle !== 0 ? 60 : 30}
                    interval={xAxisInterval}
                    tickFormatter={
                      xAxisFormatter === 'truncate3' ? (v) => String(v).slice(0, 3) :
                      xAxisFormatter === 'truncate5' ? (v) => String(v).slice(0, 5) :
                      undefined
                    }
                  />
                )}
                {showYAxis && (
                  <YAxis 
                    domain={
                      yAxisDomain === 'auto' ? undefined : 
                      yAxisDomain === 'zero' ? [0, 'auto'] : 
                      ['dataMin', 'dataMax']
                    }
                    tickCount={yAxisTickCount}
                    tickFormatter={
                      yAxisFormatter === 'compact' ? (v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v :
                      yAxisFormatter === 'currency' ? (v) => `$${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}` :
                      undefined
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
                {enabledYFields.map((field, index) => {
                  const settings = getLineSettings(field, index)
                  return (
                    <Line
                      key={field}
                      type={settings.curveType}
                      dataKey={field}
                      stroke={settings.color}
                      strokeWidth={settings.strokeWidth}
                      dot={settings.showDots ? { r: settings.dotSize } : false}
                      activeDot={showActiveDot ? { r: settings.dotSize + 2 } : false}
                      strokeDasharray={settings.dashed ? "5 5" : undefined}
                      connectNulls={connectNulls}
                      isAnimationActive={isAnimationActive}
                    />
                  )
                })}
                {showReferenceLine && (
                  <ReferenceLine 
                    y={referenceLineValue} 
                    stroke={referenceLineStroke}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{ 
                      value: `${referenceLineLabel}: ${referenceLineValue}`, 
                      position: 'insideTopRight',
                      fill: referenceLineStroke,
                      fontSize: 12
                    }}
                  />
                )}
                {showBrush && (
                  <Brush 
                    dataKey={xAxisField} 
                    height={30} 
                    stroke="hsl(var(--primary))"
                  />
                )}
              </LineChart>
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
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="lines">Lines</TabsTrigger>
                <TabsTrigger value="axes">Axes</TabsTrigger>
              </TabsList>

              {/* DATA TAB */}
              <TabsContent value="data" className="space-y-4 pt-4">
                {/* Data Source */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Data Source</Label>
                  <Select 
                    value={dataSource} 
                    onValueChange={(v) => {
                      const key = v as DataSourceKey
                      setDataSource(key)
                      setXAxisField(dataSources[key].xFields[0])
                      setEnabledYFields(dataSources[key].yFields)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(dataSources).map(([key, source]) => (
                        <SelectItem key={key} value={key}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* X-Axis Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">X-Axis Field</Label>
                  <Select value={xAxisField} onValueChange={setXAxisField}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentSource.xFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Y-Axis Fields */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Y-Axis Fields (Lines)</Label>
                  <div className="space-y-2">
                    {currentSource.yFields.map((field) => (
                      <div key={field} className="flex items-center justify-between">
                        <span className="text-sm">{field}</span>
                        <Switch
                          checked={enabledYFields.includes(field)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setEnabledYFields([...enabledYFields, field])
                            } else {
                              setEnabledYFields(enabledYFields.filter(f => f !== field))
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select which fields to plot as lines
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="chart" className="space-y-4 pt-4">
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
                  <p className="text-xs text-muted-foreground">
                    Controls how the line curves between data points
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
                      min={1}
                      max={6}
                      className="w-20 h-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    strokeWidth={'{'}${strokeWidth}{'}'}
                  </p>
                </div>

                <Separator />

                {/* Show Dots */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Dots</Label>
                    <p className="text-xs text-muted-foreground">dot={'{'}true{'}'} / false</p>
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
                    <p className="text-xs text-muted-foreground">shadcn/ui feature, not native Recharts</p>
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

                {/* Brush - Range selection */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Brush</Label>
                    <p className="text-xs text-muted-foreground">{'<Brush /> - Range selection for zoom'}</p>
                  </div>
                  <Switch checked={showBrush} onCheckedChange={setShowBrush} />
                </div>

                <Separator />

                {/* Connect Nulls */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Connect Nulls</Label>
                    <p className="text-xs text-muted-foreground">Bridge gaps in data (null values)</p>
                  </div>
                  <Switch checked={connectNulls} onCheckedChange={setConnectNulls} />
                </div>

                {/* Animation */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Animation</Label>
                    <p className="text-xs text-muted-foreground">Animate line drawing on load</p>
                  </div>
                  <Switch checked={isAnimationActive} onCheckedChange={setIsAnimationActive} />
                </div>

                {/* Active Dot */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Active Dot</Label>
                    <p className="text-xs text-muted-foreground">&quot;monotone&quot; for smooth curves</p>
                  </div>
                  <Switch checked={showActiveDot} onCheckedChange={setShowActiveDot} />
                </div>

                <Separator />

                {/* Reference Line */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Reference Line</Label>
                    <p className="text-xs text-muted-foreground">{'<ReferenceLine /> - Threshold/target line'}</p>
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
                      className="w-32"
                    />
                    <Label className="text-sm">Reference Label</Label>
                    <Input
                      type="text"
                      value={referenceLineLabel}
                      onChange={(e) => setReferenceLineLabel(e.target.value)}
                      className="w-40"
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
                        className="w-32"
                      />
                    </div>
                  </div>
                )}

                <Separator />

                {/* Y-Axis Domain */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Y-Axis Domain</Label>
                  <p className="text-xs text-muted-foreground">Controls Y-axis scale range</p>
                  <Select value={yAxisDomain} onValueChange={(v) => setYAxisDomain(v as 'auto' | 'dataMin-dataMax' | 'zero')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">auto - Recharts default</SelectItem>
                      <SelectItem value="zero">zero - Start from 0</SelectItem>
                      <SelectItem value="dataMin-dataMax">dataMin-dataMax - Fit to data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="lines" className="space-y-4 pt-4">
                {enabledYFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No lines enabled. Go to Data tab to select Y-axis fields.
                  </p>
                ) : (
                  enabledYFields.map((field, index) => {
                    const settings = getLineSettings(field, index)
                    return (
                      <div 
                        key={field}
                        className="space-y-3 rounded-lg border p-3" 
                        style={{ borderLeftColor: settings.color, borderLeftWidth: 4 }}
                      >
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">{field}</Label>
                          <p className="text-xs text-muted-foreground">dataKey=&quot;{field}&quot;</p>
                        </div>
                        
                        {/* Color selector */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Color</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Custom:</span>
                              <input
                                type="color"
                                value={settings.color}
                                onChange={(e) => updateLineSetting(field, 'color', e.target.value)}
                                className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                                title="Pick custom color"
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {colorPalette.map((color) => (
                              <button
                                key={color.value}
                                className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${settings.color === color.value ? 'border-foreground scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: color.value }}
                                onClick={() => updateLineSetting(field, 'color', color.value)}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {/* Stroke width */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Stroke Width</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5, 6].map((w) => (
                              <button
                                key={w}
                                className={`h-6 w-6 rounded text-xs ${settings.strokeWidth === w ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                                onClick={() => updateLineSetting(field, 'strokeWidth', w)}
                              >
                                {w}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Curve type */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Curve</span>
                          <Select 
                            value={settings.curveType} 
                            onValueChange={(v) => updateLineSetting(field, 'curveType', v as CurveType)}
                          >
                            <SelectTrigger className="w-32 h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monotone">monotone</SelectItem>
                              <SelectItem value="linear">linear</SelectItem>
                              <SelectItem value="step">step</SelectItem>
                              <SelectItem value="natural">natural</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Dashed & Dots toggles */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={settings.dashed} 
                              onCheckedChange={(v) => updateLineSetting(field, 'dashed', v)}
                              className="scale-75"
                            />
                            <span className="text-xs text-muted-foreground">Dashed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={settings.showDots} 
                              onCheckedChange={(v) => updateLineSetting(field, 'showDots', v)}
                              className="scale-75"
                            />
                            <span className="text-xs text-muted-foreground">Dots</span>
                          </div>
                        </div>
                        
                        {/* Dot size - only show when dots enabled */}
                        {settings.showDots && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Dot Size</span>
                            <div className="flex items-center gap-1">
                              {[2, 3, 4, 5, 6].map((s) => (
                                <button
                                  key={s}
                                  className={`h-6 w-6 rounded text-xs ${settings.dotSize === s ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                                  onClick={() => updateLineSetting(field, 'dotSize', s)}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })
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
                    <p className="text-xs text-muted-foreground">{'<XAxis /> - Horizontal axis'}</p>
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
                    <p className="text-xs text-muted-foreground">{'<YAxis /> - Vertical axis'}</p>
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
                    <p className="text-xs text-muted-foreground">tickFormatter=&quot;(value) =&gt; formatted currency&quot;</p>
                    <Select value={yAxisFormatter} onValueChange={(v) => setYAxisFormatter(v as 'none' | 'compact' | 'currency')}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (as-is)</SelectItem>
                        <SelectItem value="compact">Compact (1.5k)</SelectItem>
                        <SelectItem value="currency">Currency ($1.5k)</SelectItem>
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
            <CardDescription>Required data structure for LineChart</CardDescription>
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
                <li><strong>Y-axis fields</strong> - Numeric values for each line</li>
                <li><strong>Consistent keys</strong> - All objects must have same structure</li>
                <li><strong>No null values</strong> - Breaks line (use 0 or connectNulls)</li>
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
              <p className="font-medium mb-1">Line Component</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">type</code> - monotone, linear, step, basis, natural</li>
                <li><code className="text-xs">strokeWidth</code> - Line thickness (1-6px)</li>
                <li><code className="text-xs">strokeDasharray</code> - Dashed pattern (&quot;5 5&quot;)</li>
                <li><code className="text-xs">dot</code> - Show/hide/customize data points</li>
                <li><code className="text-xs">activeDot</code> - Highlight dot on hover</li>
                <li><code className="text-xs">connectNulls</code> - Bridge gaps in data</li>
                <li><code className="text-xs">isAnimationActive</code> - Enable/disable animation</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">X-Axis (Horizontal)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">dataKey</code> - Field to use as labels</li>
                <li><code className="text-xs">angle</code> - Rotate labels (-90 to 90)</li>
                <li><code className="text-xs">interval</code> - Skip labels (0=all, 1=every 2nd)</li>
                <li><code className="text-xs">tickFormatter</code> - Format/shorten label text</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Y-Axis (Vertical)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">domain</code> - Scale range (auto, zero, dataMin-dataMax)</li>
                <li><code className="text-xs">tickCount</code> - Number of ticks to show</li>
                <li><code className="text-xs">tickFormatter</code> - Format values (e.g., &quot;$1k&quot;)</li>
                <li><code className="text-xs">orientation</code> - left or right</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Grid</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">CartesianGrid</code> - Background grid lines</li>
                <li><code className="text-xs">strokeDasharray</code> - Solid or dashed (&quot;3 3&quot;)</li>
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
            </div>
          </CardContent>
        </Card>

        </div>

      {/* Understanding X & Y Axis */}
      <Card>
        <CardHeader>
          <CardTitle>📐 Understanding X-Axis & Y-Axis</CardTitle>
          <CardDescription>How data maps to the chart</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium">X-Axis (Horizontal)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Purpose:</strong> Labels/categories for each data point</li>
                <li><strong>Type:</strong> String, Date, or Number</li>
                <li><strong>Selection:</strong> Only ONE field at a time</li>
                <li><strong>Example:</strong> &quot;month&quot;, &quot;day&quot;, &quot;year&quot;</li>
              </ul>
              <div className="mt-2 rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-2">
                <p className="text-xs"><strong className="text-blue-700 dark:text-blue-400">💡 interval prop:</strong></p>
                <p className="text-xs text-muted-foreground"><code>interval=0</code> → show all labels</p>
                <p className="text-xs text-muted-foreground"><code>interval=1</code> → show every 2nd label</p>
                <p className="text-xs text-muted-foreground"><code>interval=2</code> → show every 3rd label</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Y-Axis (Vertical / Lines)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Purpose:</strong> Values to plot as lines</li>
                <li><strong>Type:</strong> Should be <strong>Numbers</strong></li>
                <li><strong>Selection:</strong> ONE or MORE fields</li>
                <li><strong>Example:</strong> &quot;sales&quot;, &quot;revenue&quot;, &quot;profit&quot;</li>
              </ul>
              <pre className="mt-2 rounded bg-muted p-2 text-xs">
{`<Line dataKey="sales" />
<Line dataKey="revenue" />`}
              </pre>
              <div className="mt-2 rounded border border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2">
                <p className="text-xs"><strong className="text-amber-700 dark:text-amber-400">⚠️ Strings allowed but...</strong></p>
                <p className="text-xs text-muted-foreground">You can select string fields, but they render as NaN (no visible line). Only numbers produce meaningful lines.</p>
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
4000 │  ●─────────── sales line
     │
2400 │     ○──────── revenue line
     │
     └──────────────── X
         &quot;Jan&quot;        (string label)`}
            </pre>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <p className="font-medium">Limits for Y-Axis Lines</p>
            <div className="rounded border border-green-500 bg-green-50 dark:bg-green-950/20 p-3 mb-3">
              <p className="font-medium text-green-700 dark:text-green-400">✓ No Hard Limit</p>
              <p className="text-muted-foreground text-xs">You can add as many Y-axis lines as your data has numeric fields. Recharts will render them all.</p>
            </div>
            <p className="text-xs text-muted-foreground mb-2">However, consider these practical guidelines:</p>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div className="rounded border p-2">
                <p className="font-medium text-foreground">Performance</p>
                <p>~50-100 lines before lag</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium text-foreground">Readability</p>
                <p>5-7 lines recommended</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual vs Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle>🎛️ Individual Line vs Global Chart Settings</CardTitle>
          <CardDescription>What can be customized per-line vs chart-wide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <p className="font-medium">CAN be set per Line</p>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><code className="text-xs">type</code> - Curve type (monotone, linear, step...)</li>
                <li><code className="text-xs">stroke</code> - Line color</li>
                <li><code className="text-xs">strokeWidth</code> - Line thickness</li>
                <li><code className="text-xs">strokeDasharray</code> - Dashed pattern</li>
                <li><code className="text-xs">dot</code> - Show/hide/style dots</li>
                <li><code className="text-xs">activeDot</code> - Hover dot style</li>
                <li><code className="text-xs">connectNulls</code> - Bridge data gaps</li>
                <li><code className="text-xs">hide</code> - Toggle visibility</li>
              </ul>
              <pre className="mt-2 rounded bg-muted p-2 text-xs">
{`// Each line independent
<Line type="monotone" stroke="blue" />
<Line type="linear" stroke="red" />
<Line type="step" strokeDasharray="5 5" />`}
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
                <li><code className="text-xs">Tooltip</code> - One tooltip component</li>
                <li><code className="text-xs">Legend</code> - One legend</li>
                <li><code className="text-xs">margins</code> - Chart container</li>
                <li><code className="text-xs">width / height</code> - Chart size</li>
              </ul>
              <div className="mt-2 rounded border border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2">
                <p className="text-xs text-muted-foreground">These settings apply to the entire chart. You cannot have different grids or axes per line.</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-3">
            <p className="font-medium text-blue-700 dark:text-blue-400">💡 Key Insight</p>
            <p className="text-muted-foreground text-xs mt-1">Global settings in the &quot;Chart&quot; tab can be overridden individually for each line. For example, if you set curve type to &quot;monotone&quot; globally, you can still make one specific line &quot;linear&quot;.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
