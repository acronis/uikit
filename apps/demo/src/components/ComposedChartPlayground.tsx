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
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
  Brush,
  LabelList,
} from 'recharts'
// colors managed via colorPalette constant

// ─── Types ───────────────────────────────────────────────────────────────────

type ChartType = 'line' | 'bar' | 'area' | 'none'
type CurveType = 'linear' | 'monotone' | 'natural' | 'step' | 'stepBefore' | 'stepAfter'

interface DataSource {
  name: string
  data: Record<string, string | number>[]
  xFields: string[]
  yFields: string[]
}

interface SeriesConfig {
  type: ChartType
  color?: string
  // Line-specific
  curveType?: CurveType
  strokeWidth?: number
  strokeDasharray?: string
  dot?: boolean
  activeDot?: boolean
  connectNulls?: boolean
  // Bar-specific
  radius?: number
  stackId?: string
  barSize?: number
  activeBar?: boolean
  background?: boolean
  // Area-specific
  fillOpacity?: number
  areaStackId?: string
  // Shared
  showLabel?: boolean
  labelPosition?: string
  yAxisId?: string
  legendType?: string
  unit?: string
}

// ─── Data Sources ────────────────────────────────────────────────────────────

const dataSources: Record<string, DataSource> = {
  salesMetrics: {
    name: 'Sales Metrics',
    data: [
      { month: 'Jan', sales: 4000, revenue: 2400, profit: 1800, target: 3500, growth: 12 },
      { month: 'Feb', sales: 3000, revenue: 1398, profit: 1200, target: 3500, growth: 8 },
      { month: 'Mar', sales: 2000, revenue: 9800, profit: 2800, target: 3500, growth: 25 },
      { month: 'Apr', sales: 2780, revenue: 3908, profit: 1900, target: 3500, growth: 15 },
      { month: 'May', sales: 1890, revenue: 4800, profit: 2100, target: 3500, growth: 18 },
      { month: 'Jun', sales: 2390, revenue: 3800, profit: 2400, target: 3500, growth: 20 },
      { month: 'Jul', sales: 3490, revenue: 4300, profit: 2600, target: 3500, growth: 22 },
      { month: 'Aug', sales: 4200, revenue: 5100, profit: 3100, target: 3500, growth: 28 },
      { month: 'Sep', sales: 3800, revenue: 4700, profit: 2900, target: 3500, growth: 24 },
      { month: 'Oct', sales: 4100, revenue: 4900, profit: 3000, target: 3500, growth: 26 },
      { month: 'Nov', sales: 4500, revenue: 5400, profit: 3300, target: 3500, growth: 30 },
      { month: 'Dec', sales: 5200, revenue: 6100, profit: 3800, target: 3500, growth: 35 },
    ],
    xFields: ['month'],
    yFields: ['sales', 'revenue', 'profit', 'target', 'growth'],
  },
  webAnalytics: {
    name: 'Web Analytics',
    data: [
      { page: 'Home', visitors: 12000, bounceRate: 35, avgTime: 120, conversions: 450 },
      { page: 'Products', visitors: 8500, bounceRate: 28, avgTime: 180, conversions: 380 },
      { page: 'Pricing', visitors: 6200, bounceRate: 22, avgTime: 240, conversions: 520 },
      { page: 'Blog', visitors: 9800, bounceRate: 42, avgTime: 300, conversions: 150 },
      { page: 'Contact', visitors: 3100, bounceRate: 18, avgTime: 90, conversions: 280 },
      { page: 'About', visitors: 4500, bounceRate: 38, avgTime: 60, conversions: 80 },
      { page: 'Docs', visitors: 7200, bounceRate: 15, avgTime: 420, conversions: 200 },
      { page: 'Support', visitors: 5400, bounceRate: 20, avgTime: 150, conversions: 340 },
    ],
    xFields: ['page'],
    yFields: ['visitors', 'bounceRate', 'avgTime', 'conversions'],
  },
  weather: {
    name: 'Weather Data',
    data: [
      { day: 'Mon', temperature: 22, humidity: 65, rainfall: 0, windSpeed: 12, pressure: 1013 },
      { day: 'Tue', temperature: 24, humidity: 58, rainfall: 0, windSpeed: 8, pressure: 1015 },
      { day: 'Wed', temperature: 19, humidity: 78, rainfall: 12, windSpeed: 20, pressure: 1008 },
      { day: 'Thu', temperature: 17, humidity: 85, rainfall: 25, windSpeed: 25, pressure: 1002 },
      { day: 'Fri', temperature: 21, humidity: 70, rainfall: 5, windSpeed: 15, pressure: 1010 },
      { day: 'Sat', temperature: 26, humidity: 52, rainfall: 0, windSpeed: 10, pressure: 1018 },
      { day: 'Sun', temperature: 28, humidity: 48, rainfall: 0, windSpeed: 6, pressure: 1020 },
    ],
    xFields: ['day'],
    yFields: ['temperature', 'humidity', 'rainfall', 'windSpeed', 'pressure'],
  },
}

type DataSourceKey = keyof typeof dataSources

// ─── Constants ───────────────────────────────────────────────────────────────

const curveTypes: { value: CurveType; label: string }[] = [
  { value: 'linear', label: 'Linear' },
  { value: 'monotone', label: 'Monotone' },
  { value: 'natural', label: 'Natural' },
  { value: 'step', label: 'Step' },
  { value: 'stepBefore', label: 'Step Before' },
  { value: 'stepAfter', label: 'Step After' },
]

const colorPalette = [
  '#4169e1', '#2db89a', '#d946ef', '#ef5350', '#d4c92a',
  '#38bdf8', '#a57c52', '#7c3aed', '#9ca3af', '#93c5fd',
  '#9bc225', '#ffc107', '#ea3939', '#ff810d', '#408bea',
]

const labelPositionOptions = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'insideTop', label: 'Inside Top' },
  { value: 'insideBottom', label: 'Inside Bottom' },
]

const legendTypeOptions = [
  { value: 'line', label: 'Line' },
  { value: 'rect', label: 'Rect' },
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'star', label: 'Star' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'wye', label: 'Wye' },
  { value: 'none', label: 'None (hide)' },
]

const indicatorTypes = [
  { value: 'dot', label: 'dot - Small square' },
  { value: 'line', label: 'line - Vertical bar' },
  { value: 'dashed', label: 'dashed - Dashed line' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function ComposedChartPlayground() {
  // ── Data tab state ──────────────────────────────────────────────────────
  const [dataSource, setDataSource] = React.useState<DataSourceKey>('salesMetrics')
  const currentSource = dataSources[dataSource]
  const [xAxisField, setXAxisField] = React.useState(currentSource.xFields[0])
  const [enabledYFields, setEnabledYFields] = React.useState<string[]>(
    currentSource.yFields.slice(0, 3)
  )

  // Reset on data source change
  React.useEffect(() => {
    const source = dataSources[dataSource]
    setXAxisField(source.xFields[0])
    setEnabledYFields(source.yFields.slice(0, 3))
    setSeriesConfigs({})
  }, [dataSource])

  // ── Per-series config ───────────────────────────────────────────────────
  const [seriesConfigs, setSeriesConfigs] = React.useState<Record<string, SeriesConfig>>({})

  const defaultTypeForIndex = (idx: number): ChartType => {
    const cycle: ChartType[] = ['bar', 'line', 'area']
    return cycle[idx % cycle.length]
  }

  const getSeriesConfig = (field: string, idx: number): SeriesConfig => {
    return {
      type: defaultTypeForIndex(idx),
      color: colorPalette[idx % colorPalette.length],
      ...seriesConfigs[field],
    }
  }

  const updateSeriesConfig = (field: string, key: string, value: unknown) => {
    setSeriesConfigs((prev) => ({
      ...prev,
      [field]: { ...prev[field], [key]: value },
    }))
  }

  // ── Chart tab state (global defaults) ───────────────────────────────────
  const [margin, setMargin] = React.useState({ top: 20, right: 20, bottom: 20, left: 20 })
  const [layout, setLayout] = React.useState<'horizontal' | 'vertical'>('horizontal')
  const [barCategoryGap, setBarCategoryGap] = React.useState('10%')
  const [barGap, setBarGap] = React.useState(4)

  // Global Line defaults
  const [globalCurveType, setGlobalCurveType] = React.useState<CurveType>('monotone')
  const [globalStrokeWidth, setGlobalStrokeWidth] = React.useState(2)
  const [globalDot, setGlobalDot] = React.useState(true)
  const [globalActiveDot, setGlobalActiveDot] = React.useState(true)
  const [globalConnectNulls, setGlobalConnectNulls] = React.useState(false)

  // Global Bar defaults
  const [globalBarRadius, setGlobalBarRadius] = React.useState(4)
  const [globalActiveBar, setGlobalActiveBar] = React.useState(false)
  const [globalBarBackground, setGlobalBarBackground] = React.useState(false)

  // Global Area defaults
  const [globalFillOpacity, setGlobalFillOpacity] = React.useState(0.3)

  // Global Labels
  const [globalShowLabels, setGlobalShowLabels] = React.useState(false)
  const [globalLabelPosition, setGlobalLabelPosition] = React.useState('top')

  // Animation
  const [isAnimationActive, setIsAnimationActive] = React.useState(true)
  const [animationDuration, setAnimationDuration] = React.useState(1500)
  const [animationBegin, setAnimationBegin] = React.useState(0)
  const [animationEasing, setAnimationEasing] = React.useState<'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'>('ease')

  // ── Display tab state ───────────────────────────────────────────────────
  const [showTooltip, setShowTooltip] = React.useState(true)
  const [tooltipCursor, setTooltipCursor] = React.useState(true)
  const [tooltipIndicator, setTooltipIndicator] = React.useState<'dot' | 'line' | 'dashed'>('line')
  const [showLegend, setShowLegend] = React.useState(true)
  const [legendPos, setLegendPos] = React.useState<'top' | 'bottom'>('bottom')

  const [showBrush, setShowBrush] = React.useState(false)
  const [brushHeight, setBrushHeight] = React.useState(24)

  // ── Axes tab state ──────────────────────────────────────────────────────
  const [showGrid, setShowGrid] = React.useState(true)
  const [gridDashed, setGridDashed] = React.useState(true)
  const [gridHorizontal, setGridHorizontal] = React.useState(true)
  const [gridVertical, setGridVertical] = React.useState(true)

  const [showXAxis, setShowXAxis] = React.useState(true)
  const [xAxisAngle, setXAxisAngle] = React.useState(0)
  const [xAxisInterval, setXAxisInterval] = React.useState<number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd' | 'equidistantPreserveStart'>('preserveStartEnd')

  const [showYAxis, setShowYAxis] = React.useState(true)
  const [yAxisDomain, setYAxisDomain] = React.useState<'auto' | 'dataMin-dataMax' | 'zero'>('auto')
  const [yAxisFormatter, setYAxisFormatter] = React.useState<'none' | 'compact' | 'currency'>('none')
  const [yAxisOrientation, setYAxisOrientation] = React.useState<'left' | 'right'>('left')

  // Dual Y-Axis
  const [enableDualYAxis, setEnableDualYAxis] = React.useState(false)
  const [dualYAxisDomain, setDualYAxisDomain] = React.useState<'auto' | 'dataMin-dataMax' | 'zero'>('auto')
  const [dualYAxisFormatter, setDualYAxisFormatter] = React.useState<'none' | 'compact' | 'percent'>('none')

  // Reference Lines
  const [showRefLineY, setShowRefLineY] = React.useState(false)
  const [refLineY, setRefLineY] = React.useState(3500)
  const [refLineYLabel, setRefLineYLabel] = React.useState('Target')
  const [refLineYStroke, setRefLineYStroke] = React.useState('#ef4444')

  const [showRefLineX, setShowRefLineX] = React.useState(false)
  const [refLineXValue, setRefLineXValue] = React.useState('')
  const [refLineXLabel, setRefLineXLabel] = React.useState('Marker')

  // Reference Area
  const [showRefArea, setShowRefArea] = React.useState(false)
  const [refAreaY1, setRefAreaY1] = React.useState(2000)
  const [refAreaY2, setRefAreaY2] = React.useState(4000)
  const [refAreaFill, setRefAreaFill] = React.useState('#22c55e')
  const [refAreaOpacity, setRefAreaOpacity] = React.useState(0.1)
  const [refAreaLabel, setRefAreaLabel] = React.useState('Target Zone')

  // ── Derived ─────────────────────────────────────────────────────────────

  const config = React.useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {}
    enabledYFields.forEach((field, idx) => {
      const sc = getSeriesConfig(field, idx)
      cfg[field] = { label: field, color: sc.color ?? colorPalette[idx % colorPalette.length] }
    })
    return cfg
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabledYFields, seriesConfigs])

  const getYAxisDomainValue = React.useCallback((domain: string) => {
    if (domain === 'zero') return [0, 'auto'] as [number, string]
    if (domain === 'dataMin-dataMax') return ['dataMin', 'dataMax'] as [string, string]
    return undefined
  }, [])

  const getFormatterFn = React.useCallback((fmt: string) => {
    if (fmt === 'compact') return (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))
    if (fmt === 'currency') return (v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`
    if (fmt === 'percent') return (v: number) => `${v}%`
    return undefined
  }, [])

  // Determine if any series uses right Y-axis
  const hasRightAxisSeries = React.useMemo(() => {
    return enableDualYAxis && enabledYFields.some((f) => {
      const sc = getSeriesConfig(f, enabledYFields.indexOf(f))
      return sc.yAxisId === 'right'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableDualYAxis, enabledYFields, seriesConfigs])

  // ── Render series helper ────────────────────────────────────────────────

  const renderSeries = (field: string, idx: number) => {
    const sc = getSeriesConfig(field, idx)
    if (sc.type === 'none') return null
    const color = sc.color ?? colorPalette[idx % colorPalette.length]
    const showLabel = sc.showLabel ?? globalShowLabels
    const labelPos = sc.labelPosition ?? globalLabelPosition
    const yAxisIdProp = enableDualYAxis && sc.yAxisId === 'right' ? 'right' : 'left'
    const animProps = {
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing,
    }

    switch (sc.type) {
      case 'line': {
        const curve = sc.curveType ?? globalCurveType
        const sw = sc.strokeWidth ?? globalStrokeWidth
        const dot = sc.dot ?? globalDot
        const activeDot = sc.activeDot ?? globalActiveDot
        const connectNulls = sc.connectNulls ?? globalConnectNulls
        const dash = sc.strokeDasharray
        const lt = sc.legendType ?? 'line'
        return (
          <Line
            key={field}
            type={curve}
            dataKey={field}
            stroke={color}
            strokeWidth={sw}
            strokeDasharray={dash || undefined}
            dot={dot}
            activeDot={activeDot}
            connectNulls={connectNulls}
            yAxisId={enableDualYAxis ? yAxisIdProp : undefined}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            legendType={lt as any}
            unit={sc.unit || undefined}
            {...animProps}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {showLabel && <LabelList dataKey={field} position={labelPos as any} fontSize={11} />}
          </Line>
        )
      }
      case 'bar': {
        const r = sc.radius ?? globalBarRadius
        const activeBarProp = sc.activeBar ?? globalActiveBar
        const bg = sc.background ?? globalBarBackground
        const stackId = sc.stackId || undefined
        const barSize = sc.barSize || undefined
        const lt = sc.legendType ?? 'rect'
        return (
          <Bar
            key={field}
            dataKey={field}
            fill={color}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            radius={[r, r, 0, 0] as any}
            stackId={stackId}
            barSize={barSize}
            activeBar={activeBarProp}
            background={bg ? { fill: 'hsl(var(--muted))' } : undefined}
            yAxisId={enableDualYAxis ? yAxisIdProp : undefined}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            legendType={lt as any}
            unit={sc.unit || undefined}
            {...animProps}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {showLabel && <LabelList dataKey={field} position={labelPos as any} fontSize={11} />}
          </Bar>
        )
      }
      case 'area': {
        const curve = sc.curveType ?? globalCurveType
        const fo = sc.fillOpacity ?? globalFillOpacity
        const dot = sc.dot ?? false
        const activeDot = sc.activeDot ?? globalActiveDot
        const connectNulls = sc.connectNulls ?? globalConnectNulls
        const areaStackId = sc.areaStackId || undefined
        const lt = sc.legendType ?? 'line'
        return (
          <Area
            key={field}
            type={curve}
            dataKey={field}
            stroke={color}
            fill={color}
            fillOpacity={fo}
            dot={dot}
            activeDot={activeDot}
            connectNulls={connectNulls}
            stackId={areaStackId}
            yAxisId={enableDualYAxis ? yAxisIdProp : undefined}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            legendType={lt as any}
            unit={sc.unit || undefined}
            {...animProps}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {showLabel && <LabelList dataKey={field} position={labelPos as any} fontSize={11} />}
          </Area>
        )
      }
      default:
        return null
    }
  }

  // ── Code generation ─────────────────────────────────────────────────────

  const generateCode = () => {
    const lines: string[] = []
    lines.push(`<ChartContainer config={config} className="h-[400px]">`)

    const chartProps: string[] = ['data={data}']
    if (layout !== 'horizontal') chartProps.push(`layout="${layout}"`)
    if (margin.top !== 20 || margin.right !== 20 || margin.bottom !== 20 || margin.left !== 20) {
      chartProps.push(`margin={{ top: ${margin.top}, right: ${margin.right}, bottom: ${margin.bottom}, left: ${margin.left} }}`)
    }
    if (barCategoryGap !== '10%') chartProps.push(`barCategoryGap="${barCategoryGap}"`)
    if (barGap !== 4) chartProps.push(`barGap={${barGap}}`)
    lines.push(`  <ComposedChart ${chartProps.join(' ')}>`)

    if (showGrid) {
      const gp: string[] = []
      if (gridDashed) gp.push('strokeDasharray="3 3"')
      if (!gridHorizontal) gp.push('horizontal={false}')
      if (!gridVertical) gp.push('vertical={false}')
      lines.push(`    <CartesianGrid${gp.length ? ' ' + gp.join(' ') : ''} />`)
    }

    if (showXAxis) {
      const xp: string[] = [`dataKey="${xAxisField}"`]
      if (xAxisAngle !== 0) xp.push(`angle={${xAxisAngle}}`)
      if (typeof xAxisInterval === 'number') xp.push(`interval={${xAxisInterval}}`)
      else if (xAxisInterval !== 'preserveStartEnd') xp.push(`interval="${xAxisInterval}"`)
      lines.push(`    <XAxis ${xp.join(' ')} />`)
    }

    if (showYAxis) {
      const yp: string[] = []
      if (enableDualYAxis) yp.push('yAxisId="left"')
      if (yAxisOrientation !== 'left') yp.push(`orientation="${yAxisOrientation}"`)
      if (yAxisDomain === 'zero') yp.push('domain={[0, "auto"]}')
      else if (yAxisDomain === 'dataMin-dataMax') yp.push('domain={["dataMin", "dataMax"]}')
      if (yAxisFormatter === 'compact') yp.push('tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}')
      else if (yAxisFormatter === 'currency') yp.push('tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`}')
      lines.push(`    <YAxis${yp.length ? ' ' + yp.join(' ') : ''} />`)
    }

    if (enableDualYAxis && hasRightAxisSeries) {
      const dp: string[] = ['yAxisId="right"', 'orientation="right"']
      if (dualYAxisDomain === 'zero') dp.push('domain={[0, "auto"]}')
      else if (dualYAxisDomain === 'dataMin-dataMax') dp.push('domain={["dataMin", "dataMax"]}')
      if (dualYAxisFormatter === 'compact') dp.push('tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}')
      else if (dualYAxisFormatter === 'percent') dp.push('tickFormatter={(v) => `${v}%`}')
      lines.push(`    <YAxis ${dp.join(' ')} />`)
    }

    if (showTooltip) {
      lines.push(`    <ChartTooltip content={<ChartTooltipContent indicator="${tooltipIndicator}" />}${tooltipCursor ? '' : ' cursor={false}'} />`)
    }
    if (showLegend) {
      const lp = legendPos !== 'bottom' ? ` verticalAlign="${legendPos}"` : ''
      lines.push(`    <ChartLegend content={<ChartLegendContent />}${lp} />`)
    }

    if (showRefLineY) {
      lines.push(`    <ReferenceLine${enableDualYAxis ? ' yAxisId="left"' : ''} y={${refLineY}} stroke="${refLineYStroke}" strokeDasharray="3 3" label="${refLineYLabel}" />`)
    }
    if (showRefLineX) {
      lines.push(`    <ReferenceLine x="${refLineXValue}" stroke="${refLineYStroke}" strokeDasharray="3 3" label="${refLineXLabel}" />`)
    }
    if (showRefArea) {
      lines.push(`    <ReferenceArea${enableDualYAxis ? ' yAxisId="left"' : ''} y1={${refAreaY1}} y2={${refAreaY2}} fill="${refAreaFill}" fillOpacity={${refAreaOpacity}} label="${refAreaLabel}" />`)
    }

    // Render Areas first, then Bars, then Lines (z-order best practice)
    const areaFields = enabledYFields.filter((f, i) => getSeriesConfig(f, i).type === 'area')
    const barFields = enabledYFields.filter((f, i) => getSeriesConfig(f, i).type === 'bar')
    const lineFields = enabledYFields.filter((f, i) => getSeriesConfig(f, i).type === 'line')

    const renderFieldCode = (field: string, idx: number) => {
      const sc = getSeriesConfig(field, idx)
      const color = `config.${field}.color`
      const showLabel = sc.showLabel ?? globalShowLabels
      const labelPos = sc.labelPosition ?? globalLabelPosition
      const yAxisIdStr = enableDualYAxis && sc.yAxisId === 'right' ? ' yAxisId="right"' : enableDualYAxis ? ' yAxisId="left"' : ''

      const animStr = !isAnimationActive ? ' isAnimationActive={false}' :
        (animationDuration !== 1500 ? ` animationDuration={${animationDuration}}` : '') +
        (animationBegin !== 0 ? ` animationBegin={${animationBegin}}` : '') +
        (animationEasing !== 'ease' ? ` animationEasing="${animationEasing}"` : '')

      switch (sc.type) {
        case 'area': {
          const curve = sc.curveType ?? globalCurveType
          const fo = sc.fillOpacity ?? globalFillOpacity
          const dot = sc.dot ?? false
          const props: string[] = [
            `type="${curve}"`,
            `dataKey="${field}"`,
            `stroke={${color}}`,
            `fill={${color}}`,
            `fillOpacity={${fo}}`,
          ]
          if (dot) props.push(`dot`)
          if (sc.areaStackId) props.push(`stackId="${sc.areaStackId}"`)
          if (sc.connectNulls ?? globalConnectNulls) props.push('connectNulls')
          if (yAxisIdStr) props.push(yAxisIdStr.trim())
          if (showLabel) {
            lines.push(`    <Area ${props.join(' ')}${animStr}>`)
            lines.push(`      <LabelList dataKey="${field}" position="${labelPos}" />`)
            lines.push(`    </Area>`)
          } else {
            lines.push(`    <Area ${props.join(' ')}${animStr} />`)
          }
          break
        }
        case 'bar': {
          const r = sc.radius ?? globalBarRadius
          const props: string[] = [
            `dataKey="${field}"`,
            `fill={${color}}`,
            `radius={[${r}, ${r}, 0, 0]}`,
          ]
          if (sc.stackId) props.push(`stackId="${sc.stackId}"`)
          if (sc.barSize) props.push(`barSize={${sc.barSize}}`)
          if (sc.activeBar ?? globalActiveBar) props.push('activeBar')
          if (sc.background ?? globalBarBackground) props.push('background={{ fill: "hsl(var(--muted))" }}')
          if (yAxisIdStr) props.push(yAxisIdStr.trim())
          if (showLabel) {
            lines.push(`    <Bar ${props.join(' ')}${animStr}>`)
            lines.push(`      <LabelList dataKey="${field}" position="${labelPos}" />`)
            lines.push(`    </Bar>`)
          } else {
            lines.push(`    <Bar ${props.join(' ')}${animStr} />`)
          }
          break
        }
        case 'line': {
          const curve = sc.curveType ?? globalCurveType
          const sw = sc.strokeWidth ?? globalStrokeWidth
          const dot = sc.dot ?? globalDot
          const props: string[] = [
            `type="${curve}"`,
            `dataKey="${field}"`,
            `stroke={${color}}`,
            `strokeWidth={${sw}}`,
          ]
          if (sc.strokeDasharray) props.push(`strokeDasharray="${sc.strokeDasharray}"`)
          if (!dot) props.push('dot={false}')
          if (sc.connectNulls ?? globalConnectNulls) props.push('connectNulls')
          if (yAxisIdStr) props.push(yAxisIdStr.trim())
          if (showLabel) {
            lines.push(`    <Line ${props.join(' ')}${animStr}>`)
            lines.push(`      <LabelList dataKey="${field}" position="${labelPos}" />`)
            lines.push(`    </Line>`)
          } else {
            lines.push(`    <Line ${props.join(' ')}${animStr} />`)
          }
          break
        }
      }
    }

    areaFields.forEach((f) => renderFieldCode(f, enabledYFields.indexOf(f)))
    barFields.forEach((f) => renderFieldCode(f, enabledYFields.indexOf(f)))
    lineFields.forEach((f) => renderFieldCode(f, enabledYFields.indexOf(f)))

    if (showBrush) {
      lines.push(`    <Brush dataKey="${xAxisField}" height={${brushHeight}} stroke="hsl(var(--muted-foreground))" />`)
    }

    lines.push(`  </ComposedChart>`)
    lines.push(`</ChartContainer>`)
    return lines.join('\n')
  }

  // ── Render ──────────────────────────────────────────────────────────────

  // Sort for z-order: areas first, then bars, then lines
  const sortedFields = React.useMemo(() => {
    const order: Record<ChartType, number> = { area: 0, bar: 1, line: 2, none: 3 }
    return [...enabledYFields].sort((a, b) => {
      const aType = getSeriesConfig(a, enabledYFields.indexOf(a)).type
      const bType = getSeriesConfig(b, enabledYFields.indexOf(b)).type
      return (order[aType] ?? 3) - (order[bType] ?? 3)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabledYFields, seriesConfigs])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">ComposedChart Playground</h2>
        <p className="text-muted-foreground">
          Mix Line, Bar, and Area in one chart - each series independently configurable
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
              <ComposedChart
                data={currentSource.data}
                layout={layout}
                margin={margin}
                barCategoryGap={barCategoryGap}
                barGap={barGap}
              >
                {showGrid && (
                  <CartesianGrid
                    strokeDasharray={gridDashed ? '3 3' : undefined}
                    horizontal={gridHorizontal}
                    vertical={gridVertical}
                    className="stroke-muted"
                  />
                )}
                {showXAxis && (
                  <XAxis
                    dataKey={layout === 'horizontal' ? xAxisField : undefined}
                    type={layout === 'horizontal' ? 'category' : 'number'}
                    angle={xAxisAngle}
                    textAnchor={xAxisAngle !== 0 ? 'end' : undefined}
                    height={xAxisAngle !== 0 ? 60 : undefined}
                    interval={xAxisInterval}
                  />
                )}
                {showYAxis && (
                  <YAxis
                    yAxisId={enableDualYAxis ? 'left' : undefined}
                    dataKey={layout === 'vertical' ? xAxisField : undefined}
                    type={layout === 'vertical' ? 'category' : 'number'}
                    orientation={yAxisOrientation}
                    domain={getYAxisDomainValue(yAxisDomain)}
                    tickFormatter={getFormatterFn(yAxisFormatter)}
                  />
                )}
                {enableDualYAxis && hasRightAxisSeries && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    type="number"
                    domain={getYAxisDomainValue(dualYAxisDomain)}
                    tickFormatter={getFormatterFn(dualYAxisFormatter)}
                  />
                )}
                {showTooltip && (
                  <ChartTooltip
                    content={(props) => <ChartTooltipContent {...props} indicator={tooltipIndicator} />}
                    cursor={tooltipCursor}
                  />
                )}
                {showLegend && <ChartLegend content={<ChartLegendContent />} verticalAlign={legendPos} />}
                {showRefLineY && (
                  <ReferenceLine
                    yAxisId={enableDualYAxis ? 'left' : undefined}
                    y={refLineY}
                    stroke={refLineYStroke}
                    strokeDasharray="3 3"
                    label={{ value: refLineYLabel, position: 'insideTopRight', fill: refLineYStroke }}
                  />
                )}
                {showRefLineX && refLineXValue && (
                  <ReferenceLine
                    x={refLineXValue}
                    stroke={refLineYStroke}
                    strokeDasharray="3 3"
                    label={{ value: refLineXLabel, position: 'insideTopRight', fill: refLineYStroke }}
                  />
                )}
                {showRefArea && (
                  <ReferenceArea
                    yAxisId={enableDualYAxis ? 'left' : undefined}
                    y1={refAreaY1}
                    y2={refAreaY2}
                    fill={refAreaFill}
                    fillOpacity={refAreaOpacity}
                    label={refAreaLabel}
                  />
                )}
                {sortedFields.map((field) => renderSeries(field, enabledYFields.indexOf(field)))}
                {showBrush && (
                  <Brush dataKey={xAxisField} height={brushHeight} stroke="hsl(var(--muted-foreground))" />
                )}
              </ComposedChart>
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
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="series">Series</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="axes">Axes</TabsTrigger>
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
                      {Object.entries(dataSources).map(([key, src]) => (
                        <SelectItem key={key} value={key}>{src.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">X-Axis Field</Label>
                  <Select value={xAxisField} onValueChange={setXAxisField}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentSource.xFields.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Y-Axis Fields (Series)</Label>
                    <button
                      className="text-xs text-primary hover:underline"
                      onClick={() => setEnabledYFields(currentSource.yFields.slice(0, 3))}
                    >
                      Reset
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Each field becomes a Line, Bar, or Area</p>
                  <div className="grid gap-2">
                    {currentSource.yFields.map((field, idx) => {
                      const enabled = enabledYFields.includes(field)
                      const sc = getSeriesConfig(field, idx)
                      const typeLabel = enabled ? sc.type : 'disabled'
                      return (
                        <button
                          key={field}
                          className={`flex items-center gap-2 rounded border p-2 text-left transition hover:border-primary ${enabled ? 'bg-muted/50' : 'opacity-50'}`}
                          onClick={() => {
                            setEnabledYFields((prev) =>
                              prev.includes(field)
                                ? prev.filter((f) => f !== field)
                                : [...prev, field]
                            )
                          }}
                        >
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: enabled ? (sc.color ?? colorPalette[idx % colorPalette.length]) : '#9ca3af' }}
                          />
                          <span className="text-sm font-medium">{field}</span>
                          <span className={`ml-auto text-xs rounded px-1.5 py-0.5 ${
                            typeLabel === 'line' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                            typeLabel === 'bar' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' :
                            typeLabel === 'area' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {typeLabel}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* ─── Tab: Chart ─────────────────────────────────────── */}
              <TabsContent value="chart" className="space-y-4 pt-4">
                {/* Layout */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Layout</Label>
                    <p className="text-xs text-muted-foreground">Horizontal or vertical</p>
                  </div>
                  <Select value={layout} onValueChange={(v) => setLayout(v as 'horizontal' | 'vertical')}>
                    <SelectTrigger className="w-28 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                      <SelectItem value="vertical">Vertical</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Show Cursor</span>
                      <Switch checked={tooltipCursor} onCheckedChange={setTooltipCursor} />
                    </div>
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
                  </>
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
                    <button className="text-xs text-primary hover:underline" onClick={() => setMargin({ top: 20, right: 20, bottom: 20, left: 20 })}>Reset</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                      <div key={side} className="flex items-center gap-2">
                        <span className="w-12 text-xs text-muted-foreground capitalize">{side}</span>
                        <Input
                          type="number"
                          value={margin[side]}
                          onChange={(e) => setMargin((p) => ({ ...p, [side]: Number(e.target.value) || 0 }))}
                          className="h-8"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Bar spacing */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Bar Category Gap</Label>
                    <p className="text-xs text-muted-foreground">Gap between categories</p>
                  </div>
                  <Input type="text" value={barCategoryGap} onChange={(e) => setBarCategoryGap(e.target.value)} className="w-20 h-8" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Bar Gap</Label>
                    <p className="text-xs text-muted-foreground">Gap between bars in group</p>
                  </div>
                  <Input type="number" value={barGap} onChange={(e) => setBarGap(Number(e.target.value))} className="w-20 h-8" />
                </div>

                <Separator />

                {/* Animation */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Animation</Label>
                    <p className="text-xs text-muted-foreground">Animate series appearance</p>
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
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-sm">Height</span>
                    <Input type="number" value={brushHeight} onChange={(e) => setBrushHeight(Number(e.target.value) || 24)} min={10} max={120} className="w-20 h-8" />
                  </div>
                )}
              </TabsContent>

              {/* ─── Tab: Series (per-series) ───────────────────────── */}
              <TabsContent value="series" className="space-y-4 pt-4">
                <p className="text-xs text-muted-foreground">Set chart type and per-series overrides. Order: Areas (back) → Bars → Lines (front).</p>
                {enabledYFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No series enabled. Go to Data tab to select Y-axis fields.</p>
                ) : (
                  enabledYFields.map((field, idx) => {
                    const sc = getSeriesConfig(field, idx)
                    const color = sc.color ?? colorPalette[idx % colorPalette.length]
                    return (
                      <div
                        key={field}
                        className="space-y-3 rounded-lg border p-3"
                        style={{ borderLeftColor: color, borderLeftWidth: 4 }}
                      >
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">{field}</Label>
                          <Select value={sc.type} onValueChange={(v) => updateSeriesConfig(field, 'type', v)}>
                            <SelectTrigger className="w-24 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bar">Bar</SelectItem>
                              <SelectItem value="line">Line</SelectItem>
                              <SelectItem value="area">Area</SelectItem>
                              <SelectItem value="none">Hidden</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {sc.type !== 'none' && (
                          <>
                            {/* Color */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Color</span>
                                <input
                                  type="color"
                                  value={color}
                                  onChange={(e) => updateSeriesConfig(field, 'color', e.target.value)}
                                  className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                                />
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {colorPalette.slice(0, 10).map((c) => (
                                  <button
                                    key={c}
                                    className={`h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => updateSeriesConfig(field, 'color', c)}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Y-Axis assignment (dual axis) */}
                            {enableDualYAxis && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Y-Axis</span>
                                <Select value={sc.yAxisId ?? 'left'} onValueChange={(v) => updateSeriesConfig(field, 'yAxisId', v)}>
                                  <SelectTrigger className="w-20 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="left">Left</SelectItem>
                                    <SelectItem value="right">Right</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {/* Line-specific */}
                            {sc.type === 'line' && (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Curve</span>
                                  <Select value={sc.curveType ?? '__inherit__'} onValueChange={(v) => updateSeriesConfig(field, 'curveType', v === '__inherit__' ? undefined : v)}>
                                    <SelectTrigger className="w-28 h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="__inherit__">Inherit</SelectItem>
                                      {curveTypes.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Stroke Width</span>
                                  <Input type="number" value={sc.strokeWidth ?? ''} onChange={(e) => updateSeriesConfig(field, 'strokeWidth', e.target.value ? Number(e.target.value) : undefined)} placeholder="inherit" min={1} max={8} className="w-20 h-8" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Dash Pattern</span>
                                  <Input type="text" value={sc.strokeDasharray ?? ''} onChange={(e) => updateSeriesConfig(field, 'strokeDasharray', e.target.value || undefined)} placeholder="e.g. 5 5" className="w-24 h-8" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Dots</span>
                                  <Switch checked={sc.dot ?? globalDot} onCheckedChange={(v) => updateSeriesConfig(field, 'dot', v)} />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Connect Nulls</span>
                                  <Switch checked={sc.connectNulls ?? globalConnectNulls} onCheckedChange={(v) => updateSeriesConfig(field, 'connectNulls', v)} />
                                </div>
                              </>
                            )}

                            {/* Bar-specific */}
                            {sc.type === 'bar' && (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Radius</span>
                                  <Input type="number" value={sc.radius ?? ''} onChange={(e) => updateSeriesConfig(field, 'radius', e.target.value ? Number(e.target.value) : undefined)} placeholder="inherit" min={0} max={20} className="w-20 h-8" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Stack ID</span>
                                  <Input type="text" value={sc.stackId ?? ''} onChange={(e) => updateSeriesConfig(field, 'stackId', e.target.value || undefined)} placeholder="none" className="w-20 h-8" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Bar Size</span>
                                  <Input type="number" value={sc.barSize ?? ''} onChange={(e) => updateSeriesConfig(field, 'barSize', e.target.value ? Number(e.target.value) : undefined)} placeholder="auto" min={1} max={100} className="w-20 h-8" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Active Bar</span>
                                  <Switch checked={sc.activeBar ?? globalActiveBar} onCheckedChange={(v) => updateSeriesConfig(field, 'activeBar', v)} />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Background</span>
                                  <Switch checked={sc.background ?? globalBarBackground} onCheckedChange={(v) => updateSeriesConfig(field, 'background', v)} />
                                </div>
                              </>
                            )}

                            {/* Area-specific */}
                            {sc.type === 'area' && (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Curve</span>
                                  <Select value={sc.curveType ?? '__inherit__'} onValueChange={(v) => updateSeriesConfig(field, 'curveType', v === '__inherit__' ? undefined : v)}>
                                    <SelectTrigger className="w-28 h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="__inherit__">Inherit</SelectItem>
                                      {curveTypes.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Fill Opacity</span>
                                  <Input type="number" value={sc.fillOpacity ?? ''} onChange={(e) => updateSeriesConfig(field, 'fillOpacity', e.target.value ? Number(e.target.value) : undefined)} placeholder="inherit" min={0} max={1} step={0.1} className="w-20 h-8" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Stack ID</span>
                                  <Input type="text" value={sc.areaStackId ?? ''} onChange={(e) => updateSeriesConfig(field, 'areaStackId', e.target.value || undefined)} placeholder="none" className="w-20 h-8" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Dots</span>
                                  <Switch checked={sc.dot ?? false} onCheckedChange={(v) => updateSeriesConfig(field, 'dot', v)} />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Connect Nulls</span>
                                  <Switch checked={sc.connectNulls ?? globalConnectNulls} onCheckedChange={(v) => updateSeriesConfig(field, 'connectNulls', v)} />
                                </div>
                              </>
                            )}

                            {/* Shared: Label, LegendType, Unit */}
                            <Separator />
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Label</span>
                              <Switch checked={sc.showLabel ?? globalShowLabels} onCheckedChange={(v) => updateSeriesConfig(field, 'showLabel', v)} />
                            </div>
                            {(sc.showLabel ?? globalShowLabels) && (
                              <div className="flex items-center justify-between pl-2">
                                <span className="text-xs text-muted-foreground">Position</span>
                                <Select value={sc.labelPosition ?? '__inherit__'} onValueChange={(v) => updateSeriesConfig(field, 'labelPosition', v === '__inherit__' ? undefined : v)}>
                                  <SelectTrigger className="w-28 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="__inherit__">Inherit</SelectItem>
                                    {labelPositionOptions.map((o) => (
                                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Legend Icon</span>
                              <Select value={sc.legendType ?? '__inherit__'} onValueChange={(v) => updateSeriesConfig(field, 'legendType', v === '__inherit__' ? undefined : v)}>
                                <SelectTrigger className="w-24 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__inherit__">Inherit</SelectItem>
                                  {legendTypeOptions.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Unit</span>
                              <Input type="text" value={sc.unit ?? ''} onChange={(e) => updateSeriesConfig(field, 'unit', e.target.value || undefined)} placeholder="e.g. kg" className="w-20 h-8" />
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })
                )}
              </TabsContent>

              {/* ─── Tab: Style (global defaults) ───────────────────── */}
              <TabsContent value="style" className="space-y-4 pt-4">
                <p className="text-xs text-muted-foreground">Global defaults. Per-series overrides take precedence.</p>

                {/* Line Defaults */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Line Defaults</Label>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Curve Type</span>
                      <Select value={globalCurveType} onValueChange={(v) => setGlobalCurveType(v as CurveType)}>
                        <SelectTrigger className="w-28 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {curveTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Stroke Width</span>
                      <Input type="number" value={globalStrokeWidth} onChange={(e) => setGlobalStrokeWidth(Number(e.target.value) || 1)} min={1} max={8} className="w-20 h-8" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show Dots</span>
                      <Switch checked={globalDot} onCheckedChange={setGlobalDot} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Dot</span>
                      <Switch checked={globalActiveDot} onCheckedChange={setGlobalActiveDot} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Connect Nulls</span>
                      <Switch checked={globalConnectNulls} onCheckedChange={setGlobalConnectNulls} />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Bar Defaults */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Bar Defaults</Label>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Corner Radius</span>
                      <Input type="number" value={globalBarRadius} onChange={(e) => setGlobalBarRadius(Number(e.target.value) || 0)} min={0} max={20} className="w-20 h-8" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Bar</span>
                      <Switch checked={globalActiveBar} onCheckedChange={setGlobalActiveBar} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Background</span>
                      <Switch checked={globalBarBackground} onCheckedChange={setGlobalBarBackground} />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Area Defaults */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Area Defaults</Label>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fill Opacity</span>
                      <Input type="number" value={globalFillOpacity} onChange={(e) => setGlobalFillOpacity(Number(e.target.value) || 0.1)} min={0} max={1} step={0.1} className="w-20 h-8" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Labels */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Labels</Label>
                    <p className="text-xs text-muted-foreground">{'<LabelList />'} on all series</p>
                  </div>
                  <Switch checked={globalShowLabels} onCheckedChange={setGlobalShowLabels} />
                </div>
                {globalShowLabels && (
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-sm">Position</span>
                    <Select value={globalLabelPosition} onValueChange={setGlobalLabelPosition}>
                      <SelectTrigger className="w-32 h-8">
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
              </TabsContent>

              {/* ─── Tab: Axes ──────────────────────────────────────── */}
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
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Dashed</span>
                      <Switch checked={gridDashed} onCheckedChange={setGridDashed} />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Horizontal</span>
                      <Switch checked={gridHorizontal} onCheckedChange={setGridHorizontal} />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Vertical</span>
                      <Switch checked={gridVertical} onCheckedChange={setGridVertical} />
                    </div>
                  </>
                )}

                <Separator />

                {/* X Axis */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show X Axis</Label>
                    <p className="text-xs text-muted-foreground">Category axis</p>
                  </div>
                  <Switch checked={showXAxis} onCheckedChange={setShowXAxis} />
                </div>
                {showXAxis && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Angle</span>
                      <div className="flex gap-1">
                        {[0, -30, -45, -90].map((a) => (
                          <button
                            key={a}
                            className={`rounded border px-2 py-1 text-xs ${xAxisAngle === a ? 'bg-primary text-primary-foreground' : ''}`}
                            onClick={() => setXAxisAngle(a)}
                          >
                            {a}°
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Interval</span>
                      <Select
                        value={String(xAxisInterval)}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onValueChange={(v) => setXAxisInterval(v === '0' ? 0 : v as any)}
                      >
                        <SelectTrigger className="w-36 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="preserveStartEnd">preserveStartEnd</SelectItem>
                          <SelectItem value="preserveStart">preserveStart</SelectItem>
                          <SelectItem value="preserveEnd">preserveEnd</SelectItem>
                          <SelectItem value="equidistantPreserveStart">equidistant</SelectItem>
                          <SelectItem value="0">0 (show all)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Separator />

                {/* Y Axis (left) */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Y Axis</Label>
                    <p className="text-xs text-muted-foreground">Numeric axis</p>
                  </div>
                  <Switch checked={showYAxis} onCheckedChange={setShowYAxis} />
                </div>
                {showYAxis && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Orientation</span>
                      <Select value={yAxisOrientation} onValueChange={(v) => setYAxisOrientation(v as 'left' | 'right')}>
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">Domain</Label>
                      <Select value={yAxisDomain} onValueChange={(v) => setYAxisDomain(v as typeof yAxisDomain)}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">auto</SelectItem>
                          <SelectItem value="zero">Start from 0</SelectItem>
                          <SelectItem value="dataMin-dataMax">Fit to data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">Formatter</Label>
                      <Select value={yAxisFormatter} onValueChange={(v) => setYAxisFormatter(v as typeof yAxisFormatter)}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="compact">Compact (1.2k)</SelectItem>
                          <SelectItem value="currency">Currency ($1.2k)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Separator />

                {/* Dual Y-Axis */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Dual Y-Axis</Label>
                    <p className="text-xs text-muted-foreground">Add right Y-axis for different scales</p>
                  </div>
                  <Switch checked={enableDualYAxis} onCheckedChange={setEnableDualYAxis} />
                </div>
                {enableDualYAxis && (
                  <>
                    <div className="rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-2 text-xs text-muted-foreground">
                      Assign series to right axis in the Series tab
                    </div>
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">Right Axis Domain</Label>
                      <Select value={dualYAxisDomain} onValueChange={(v) => setDualYAxisDomain(v as typeof dualYAxisDomain)}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">auto</SelectItem>
                          <SelectItem value="zero">Start from 0</SelectItem>
                          <SelectItem value="dataMin-dataMax">Fit to data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">Right Axis Formatter</Label>
                      <Select value={dualYAxisFormatter} onValueChange={(v) => setDualYAxisFormatter(v as typeof dualYAxisFormatter)}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="compact">Compact (1.2k)</SelectItem>
                          <SelectItem value="percent">Percent (35%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Separator />

                {/* Reference Line Y */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Horizontal Reference</Label>
                    <p className="text-xs text-muted-foreground">{'<ReferenceLine y={...} />'}</p>
                  </div>
                  <Switch checked={showRefLineY} onCheckedChange={setShowRefLineY} />
                </div>
                {showRefLineY && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Y Value</span>
                      <Input type="number" value={refLineY} onChange={(e) => setRefLineY(Number(e.target.value))} className="w-20 h-8" />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Label</span>
                      <Input type="text" value={refLineYLabel} onChange={(e) => setRefLineYLabel(e.target.value)} className="w-24 h-8" />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Color</span>
                      <div className="flex items-center gap-2">
                        <input type="color" value={refLineYStroke} onChange={(e) => setRefLineYStroke(e.target.value)} className="h-6 w-8 cursor-pointer rounded border-0 p-0" />
                        <Input type="text" value={refLineYStroke} onChange={(e) => setRefLineYStroke(e.target.value)} className="w-24 h-8" />
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Reference Line X */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Vertical Reference</Label>
                    <p className="text-xs text-muted-foreground">{'<ReferenceLine x="..." />'}</p>
                  </div>
                  <Switch checked={showRefLineX} onCheckedChange={setShowRefLineX} />
                </div>
                {showRefLineX && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">X Value</span>
                      <Input type="text" value={refLineXValue} onChange={(e) => setRefLineXValue(e.target.value)} placeholder={currentSource.xFields[0]} className="w-24 h-8" />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Label</span>
                      <Input type="text" value={refLineXLabel} onChange={(e) => setRefLineXLabel(e.target.value)} className="w-24 h-8" />
                    </div>
                  </>
                )}

                <Separator />

                {/* Reference Area */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Reference Area</Label>
                    <p className="text-xs text-muted-foreground">{'<ReferenceArea />'} zone highlight</p>
                  </div>
                  <Switch checked={showRefArea} onCheckedChange={setShowRefArea} />
                </div>
                {showRefArea && (
                  <div className="space-y-2 pl-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground w-6">y1</span>
                        <Input type="number" value={refAreaY1} onChange={(e) => setRefAreaY1(Number(e.target.value))} className="h-8" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground w-6">y2</span>
                        <Input type="number" value={refAreaY2} onChange={(e) => setRefAreaY2(Number(e.target.value))} className="h-8" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Fill:</span>
                      <input type="color" value={refAreaFill} onChange={(e) => setRefAreaFill(e.target.value)} className="h-6 w-8 cursor-pointer rounded border-0 p-0" />
                      <Input type="text" value={refAreaFill} onChange={(e) => setRefAreaFill(e.target.value)} className="w-24 h-8" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Opacity:</span>
                      <Input type="number" value={refAreaOpacity} onChange={(e) => setRefAreaOpacity(Math.min(1, Math.max(0, Number(e.target.value) || 0)))} min={0} max={1} step={0.05} className="w-20 h-8" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Label:</span>
                      <Input type="text" value={refAreaLabel} onChange={(e) => setRefAreaLabel(e.target.value)} className="w-32 h-8" />
                    </div>
                  </div>
                )}
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
            {currentSource.name} — {currentSource.data.length} records, {enabledYFields.length} series enabled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm max-h-64">
            <code>{JSON.stringify(currentSource.data, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>

      {/* ── Documentation ──────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Data Format</CardTitle>
            <CardDescription>Required data structure for ComposedChart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              <code>{`// Same as Line/Bar/Area - array of objects
const data = [
  { month: 'Jan', sales: 4000, revenue: 2400, target: 3000 },
  { month: 'Feb', sales: 3000, revenue: 1398, target: 3000 },
  { month: 'Mar', sales: 2000, revenue: 9800, target: 3000 },
]

// ChartConfig for tooltips & legend colors
const config: ChartConfig = {
  sales:   { label: "Sales",   color: "#4169e1" },
  revenue: { label: "Revenue", color: "#2db89a" },
  target:  { label: "Target",  color: "#ef5350" },
}`}</code>
            </pre>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Shared X-axis</strong> - All series use same category field</li>
                <li><strong>Multiple Y fields</strong> - One for each Line/Bar/Area</li>
                <li><strong>Compatible scales</strong> - Or use dual Y-axis for different ranges</li>
                <li><strong>Consistent data</strong> - All records should have all fields</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurable Properties</CardTitle>
            <CardDescription>What you can customize per component type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Line Component</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">type</code> - Curve interpolation (linear, monotone, natural, step)</li>
                <li><code className="text-xs">stroke / strokeWidth</code> - Line color and thickness</li>
                <li><code className="text-xs">strokeDasharray</code> - Dashed pattern (e.g. &quot;5 5&quot;)</li>
                <li><code className="text-xs">dot / activeDot</code> - Data point visibility</li>
                <li><code className="text-xs">connectNulls</code> - Bridge gaps in data</li>
                <li><code className="text-xs">label / LabelList</code> - Data labels</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Bar Component</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">radius</code> - Corner rounding [tl, tr, bl, br]</li>
                <li><code className="text-xs">stackId</code> - Stack bars with same ID</li>
                <li><code className="text-xs">barSize</code> - Fixed width in pixels</li>
                <li><code className="text-xs">activeBar</code> - Hover highlight</li>
                <li><code className="text-xs">background</code> - Full-range backdrop</li>
                <li><code className="text-xs">minPointSize</code> - Show zero values</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Area Component</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">type</code> - Curve interpolation</li>
                <li><code className="text-xs">fillOpacity</code> - Fill transparency (0-1)</li>
                <li><code className="text-xs">stackId</code> - Stack areas with same ID</li>
                <li><code className="text-xs">dot / activeDot</code> - Data point visibility</li>
                <li><code className="text-xs">connectNulls</code> - Bridge gaps</li>
                <li><code className="text-xs">baseValue</code> - Baseline reference</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Chart-level</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">layout</code> - horizontal or vertical</li>
                <li><code className="text-xs">barCategoryGap / barGap</code> - Bar spacing</li>
                <li><code className="text-xs">margin</code> - Chart padding</li>
                <li><code className="text-xs">Dual YAxis</code> - Different scales per series</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitations</CardTitle>
            <CardDescription>What ComposedChart cannot do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Visual clutter</strong> - Too many series = confusing chart</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Scale conflicts</strong> - Very different ranges need dual Y-axis</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Z-index issues</strong> - Bars may hide lines (render order matters)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Legend complexity</strong> - Mixed types need clear labeling</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Scatter mixing</strong> - Scatter needs numeric X/Y, incompatible with category axis</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Max ~5 series</strong> - Beyond that readability drops significantly</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Practices & Use Cases</CardTitle>
            <CardDescription>When and how to use ComposedChart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Common Patterns:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Bar (actual values) + Line (target/trend)</li>
                <li>Stacked Bars + Line (total trend)</li>
                <li>Area (volume) + Line (rate) with dual Y-axis</li>
                <li>Bars (categories) + dashed Line (moving average)</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Avoid When:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Single metric type - Use specific chart component</li>
                <li>More than 4-5 total series</li>
                <li>Unrelated metrics on same chart</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Tips:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Render Areas first, then Bars, then Lines (z-order)</li>
                <li>Use dashed Line (strokeDasharray) for targets</li>
                <li>Use dual Y-axis for metrics with different scales</li>
                <li>Stack bars with same stackId for part-of-whole</li>
                <li>Stack areas with same stackId for cumulative view</li>
                <li>Use Brush for long time series data</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Understanding Cards ────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Rendering Order & Z-Index</CardTitle>
          <CardDescription>How ComposedChart layers its children</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="font-medium">Layer 1: Areas (back)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>zIndex:</strong> 100 (default)</li>
                <li>Filled regions drawn first</li>
                <li>Use low fillOpacity to see through</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Layer 2: Bars (middle)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>zIndex:</strong> 300 (default)</li>
                <li>Solid rectangles on top of areas</li>
                <li>Stacked bars share same zIndex</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Layer 3: Lines (front)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>zIndex:</strong> 400 (default)</li>
                <li>Drawn on top of bars and areas</li>
                <li>Dots visible above everything</li>
              </ul>
            </div>
          </div>
          <Separator />
          <div className="rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-3 text-xs text-muted-foreground">
            <p><strong className="text-blue-700 dark:text-blue-400">Tip:</strong> The playground automatically sorts series by type (Area → Bar → Line) for optimal rendering. In your code, place Area components first, then Bar, then Line to avoid visual overlap issues.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dual Y-Axis Setup</CardTitle>
          <CardDescription>How to use different scales for different series</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
            <code>{`// Two YAxis components with different IDs
<YAxis yAxisId="left" orientation="left" />
<YAxis yAxisId="right" orientation="right" />

// Each series references its axis
<Bar dataKey="sales" yAxisId="left" fill="..." />
<Line dataKey="growth" yAxisId="right" stroke="..." />

// ReferenceLine must also specify yAxisId
<ReferenceLine yAxisId="left" y={3500} />`}</code>
          </pre>
          <div className="space-y-2">
            <p className="font-medium">When to use dual Y-axis:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Metrics with very different ranges (e.g. revenue in $1000s + growth in %)</li>
              <li>Comparing absolute values vs rates/percentages</li>
              <li>When one metric would flatten the other on a shared scale</li>
            </ul>
          </div>
          <Separator />
          <div className="rounded border border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-3 text-xs text-muted-foreground">
            <p><strong className="text-amber-700 dark:text-amber-400">Warning:</strong> When using dual Y-axis, every Line, Bar, Area, and ReferenceLine must specify a <code>yAxisId</code>. Missing this prop will cause rendering errors.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Individual vs Global Settings</CardTitle>
          <CardDescription>What&apos;s per-series vs chart-wide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">+</span>
                <p className="font-medium">Per Series (Series tab)</p>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Chart type (Line / Bar / Area / Hidden)</li>
                <li>Color per series</li>
                <li>Y-axis assignment (left/right for dual axis)</li>
                <li>Line: curve, strokeWidth, dasharray, dot, connectNulls</li>
                <li>Bar: radius, stackId, barSize, activeBar, background</li>
                <li>Area: curve, fillOpacity, stackId, dot, connectNulls</li>
                <li>Label toggle and position per series</li>
                <li>Legend icon type per series</li>
                <li>Unit per series (for tooltip)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">+</span>
                <p className="font-medium">Chart-wide (Chart/Style/Axes tabs)</p>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Layout (horizontal/vertical)</li>
                <li>Margins, bar spacing (barCategoryGap, barGap)</li>
                <li>Default Line settings (curve, strokeWidth, dot, activeDot)</li>
                <li>Default Bar settings (radius, activeBar, background)</li>
                <li>Default Area settings (fillOpacity)</li>
                <li>Global labels (showLabels, labelPosition)</li>
                <li>Animation (enabled, duration, delay, easing)</li>
                <li>Tooltip (indicator, cursor), Legend (position)</li>
                <li>Grid, X-axis (angle, interval), Y-axis (domain, formatter)</li>
                <li>Dual Y-axis (domain, formatter for right axis)</li>
                <li>Reference lines (X/Y), Reference area</li>
                <li>Brush for zoom/pan</li>
              </ul>
            </div>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">Per-series settings override the global defaults from the Style tab. If a per-series value is not set, it inherits from the global setting.</p>
        </CardContent>
      </Card>
    </div>
  )
}
