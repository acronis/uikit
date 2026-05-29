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
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ZAxis,
  ReferenceLine,
  ReferenceArea,
  Brush,
  LabelList,
} from 'recharts'
// colors managed via colorPalette constant

// ─── Types ───────────────────────────────────────────────────────────────────

type ShapeType = 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye'
type LegendTypeOption = 'circle' | 'square' | 'diamond' | 'star' | 'triangle' | 'wye' | 'cross' | 'line' | 'rect' | 'none'

interface ScatterDataSource {
  name: string
  data: Record<string, string | number>[]
  numericFields: string[]
  labelField: string
  groupField?: string
}

// ─── Data Sources ────────────────────────────────────────────────────────────

const scatterDataSources: Record<string, ScatterDataSource> = {
  performance: {
    name: 'Student Performance',
    data: [
      { name: 'Alice', studyHours: 2, score: 55, attendance: 60, group: 'Class A' },
      { name: 'Bob', studyHours: 4, score: 65, attendance: 72, group: 'Class A' },
      { name: 'Carol', studyHours: 6, score: 78, attendance: 85, group: 'Class A' },
      { name: 'Dave', studyHours: 8, score: 92, attendance: 95, group: 'Class A' },
      { name: 'Eve', studyHours: 3, score: 48, attendance: 55, group: 'Class A' },
      { name: 'Frank', studyHours: 7, score: 85, attendance: 90, group: 'Class A' },
      { name: 'Grace', studyHours: 1, score: 70, attendance: 40, group: 'Class B' },
      { name: 'Hank', studyHours: 5, score: 82, attendance: 78, group: 'Class B' },
      { name: 'Ivy', studyHours: 9, score: 95, attendance: 98, group: 'Class B' },
      { name: 'Jack', studyHours: 3, score: 60, attendance: 65, group: 'Class B' },
      { name: 'Kate', studyHours: 6, score: 75, attendance: 82, group: 'Class B' },
      { name: 'Leo', studyHours: 4, score: 58, attendance: 70, group: 'Class B' },
    ],
    numericFields: ['studyHours', 'score', 'attendance'],
    labelField: 'name',
    groupField: 'group',
  },
  products: {
    name: 'Product Analysis',
    data: [
      { product: 'Widget A', price: 29.99, rating: 4.5, sales: 1200, returns: 24, category: 'Electronics' },
      { product: 'Widget B', price: 49.99, rating: 3.8, sales: 800, returns: 48, category: 'Electronics' },
      { product: 'Widget C', price: 19.99, rating: 4.2, sales: 2200, returns: 66, category: 'Home' },
      { product: 'Widget D', price: 99.99, rating: 4.7, sales: 400, returns: 8, category: 'Home' },
      { product: 'Widget E', price: 14.99, rating: 3.5, sales: 3000, returns: 150, category: 'Clothing' },
      { product: 'Widget F', price: 59.99, rating: 4.0, sales: 650, returns: 26, category: 'Clothing' },
      { product: 'Widget G', price: 39.99, rating: 4.8, sales: 1800, returns: 18, category: 'Electronics' },
      { product: 'Widget H', price: 24.99, rating: 3.2, sales: 900, returns: 63, category: 'Home' },
    ],
    numericFields: ['price', 'rating', 'sales', 'returns'],
    labelField: 'product',
    groupField: 'category',
  },
  cities: {
    name: 'City Statistics',
    data: [
      { city: 'New York', population: 8.3, avgIncome: 65, costOfLiving: 85, crimeRate: 62, region: 'East' },
      { city: 'Los Angeles', population: 3.9, avgIncome: 58, costOfLiving: 78, crimeRate: 55, region: 'West' },
      { city: 'Chicago', population: 2.7, avgIncome: 52, costOfLiving: 65, crimeRate: 70, region: 'Central' },
      { city: 'Houston', population: 2.3, avgIncome: 48, costOfLiving: 55, crimeRate: 68, region: 'South' },
      { city: 'Phoenix', population: 1.6, avgIncome: 45, costOfLiving: 50, crimeRate: 52, region: 'West' },
      { city: 'Philadelphia', population: 1.5, avgIncome: 50, costOfLiving: 60, crimeRate: 65, region: 'East' },
      { city: 'San Antonio', population: 1.4, avgIncome: 42, costOfLiving: 45, crimeRate: 48, region: 'South' },
      { city: 'Denver', population: 0.7, avgIncome: 55, costOfLiving: 68, crimeRate: 40, region: 'Central' },
      { city: 'Seattle', population: 0.7, avgIncome: 70, costOfLiving: 82, crimeRate: 45, region: 'West' },
      { city: 'Boston', population: 0.7, avgIncome: 68, costOfLiving: 80, crimeRate: 38, region: 'East' },
    ],
    numericFields: ['population', 'avgIncome', 'costOfLiving', 'crimeRate'],
    labelField: 'city',
    groupField: 'region',
  },
}

type DataSourceKey = keyof typeof scatterDataSources

// ─── Constants ───────────────────────────────────────────────────────────────

const shapeOptions: { value: ShapeType; label: string }[] = [
  { value: 'circle', label: 'Circle' },
  { value: 'cross', label: 'Cross' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'square', label: 'Square' },
  { value: 'star', label: 'Star' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'wye', label: 'Wye' },
]

const legendTypeOptions: { value: LegendTypeOption; label: string }[] = [
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'star', label: 'Star' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'wye', label: 'Wye' },
  { value: 'cross', label: 'Cross' },
  { value: 'line', label: 'Line' },
  { value: 'rect', label: 'Rect' },
  { value: 'none', label: 'None (hide)' },
]

const scatterColorPalette = [
  '#4169e1', '#2db89a', '#d946ef', '#ef5350', '#d4c92a',
  '#38bdf8', '#a57c52', '#7c3aed', '#9ca3af', '#93c5fd',
  '#9bc225', '#ffc107', '#ea3939', '#ff810d', '#408bea',
]

const indicatorTypes = [
  { value: 'dot', label: 'dot - Small square' },
  { value: 'line', label: 'line - Vertical bar' },
  { value: 'dashed', label: 'dashed - Dashed line' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function ScatterChartPlayground() {
  // ── Data tab state ──────────────────────────────────────────────────────
  const [dataSource, setDataSource] = React.useState<DataSourceKey>('performance')
  const currentSource = scatterDataSources[dataSource]
  const [xField, setXField] = React.useState(currentSource.numericFields[0])
  const [yField, setYField] = React.useState(currentSource.numericFields[1] ?? currentSource.numericFields[0])
  const [zField, setZField] = React.useState<string | null>(null)
  const [useGrouping, setUseGrouping] = React.useState(!!currentSource.groupField)
  const [enabledSeries, setEnabledSeries] = React.useState<Record<string, boolean>>({})

  // Reset on data source change
  React.useEffect(() => {
    const source = scatterDataSources[dataSource]
    setXField(source.numericFields[0])
    setYField(source.numericFields[1] ?? source.numericFields[0])
    setZField(null)
    setUseGrouping(!!source.groupField)
    if (source.groupField) {
      const allOn: Record<string, boolean> = {}
      const groups = new Set(source.data.map((d) => String(d[source.groupField!])))
      groups.forEach((g) => { allOn[g] = true })
      setEnabledSeries(allOn)
    } else {
      setEnabledSeries({ 'All Data': true })
    }
    setSeriesSettings({})
  }, [dataSource])

  // ── Chart tab state ─────────────────────────────────────────────────────
  const [margin, setMargin] = React.useState({ top: 20, right: 20, bottom: 20, left: 20 })
  const [isAnimationActive, setIsAnimationActive] = React.useState(true)
  const [animationDuration, setAnimationDuration] = React.useState(400)
  const [animationBegin, setAnimationBegin] = React.useState(0)
  const [animationEasing, setAnimationEasing] = React.useState<'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'>('ease')

  // ── Points tab state ────────────────────────────────────────────────────
  const [globalShape, setGlobalShape] = React.useState<ShapeType>('circle')
  const [pointSizeMin, setPointSizeMin] = React.useState(60)
  const [pointSizeMax, setPointSizeMax] = React.useState(400)
  const [globalOpacity, setGlobalOpacity] = React.useState(0.8)
  const [globalFillOpacity, setGlobalFillOpacity] = React.useState(1)
  const [globalStroke, setGlobalStroke] = React.useState('')
  const [globalStrokeWidth, setGlobalStrokeWidth] = React.useState(0)
  const [showLine, setShowLine] = React.useState(false)
  const [lineType, setLineType] = React.useState<'fitting' | 'joint'>('joint')
  const [lineJointType, setLineJointType] = React.useState<'linear' | 'monotone' | 'natural'>('linear')
  const [showLabels, setShowLabels] = React.useState(false)
  const [labelPosition, setLabelPosition] = React.useState<'top' | 'right' | 'bottom' | 'left' | 'insideTop' | 'insideBottom'>('top')
  const [labelDataKey, setLabelDataKey] = React.useState<string>('__y__')
  const [activeShapeEnabled, setActiveShapeEnabled] = React.useState(false)
  const [activeShapeFill, setActiveShapeFill] = React.useState('#ff6b6b')
  const [activeShapeOpacity, setActiveShapeOpacity] = React.useState(1)
  const [legendType, setLegendType] = React.useState<LegendTypeOption>('circle')

  // Per-series settings
  const [seriesSettings, setSeriesSettings] = React.useState<Record<string, {
    color?: string
    shape?: ShapeType
    opacity?: number
    fillOpacity?: number
    stroke?: string
    strokeWidth?: number
    showLine?: boolean
    showLabel?: boolean
    legendType?: LegendTypeOption
  }>>({})

  const updateSeriesSetting = (name: string, key: string, value: unknown) => {
    setSeriesSettings((prev) => ({
      ...prev,
      [name]: { ...prev[name], [key]: value },
    }))
  }

  // ── Axes tab state ─────────────────────────────────────────────────────
  const [showGrid, setShowGrid] = React.useState(true)
  const [gridDashed, setGridDashed] = React.useState(true)
  const [gridHorizontal, setGridHorizontal] = React.useState(true)
  const [gridVertical, setGridVertical] = React.useState(true)

  const [showXAxis, setShowXAxis] = React.useState(true)
  const [xAxisUnit, setXAxisUnit] = React.useState('')
  const [xAxisOrientation, setXAxisOrientation] = React.useState<'bottom' | 'top'>('bottom')
  const [xAxisTickCount, setXAxisTickCount] = React.useState<number | undefined>(undefined)
  const [xAxisAngle, setXAxisAngle] = React.useState(0)
  const [xAxisDomain, setXAxisDomain] = React.useState<'auto' | 'dataMin-dataMax' | 'zero'>('auto')
  const [xAxisFormatter, setXAxisFormatter] = React.useState<'none' | 'compact' | 'fixed1' | 'fixed2'>('none')

  const [showYAxis, setShowYAxis] = React.useState(true)
  const [yAxisUnit, setYAxisUnit] = React.useState('')
  const [yAxisOrientation, setYAxisOrientation] = React.useState<'left' | 'right'>('left')
  const [yAxisTickCount, setYAxisTickCount] = React.useState<number | undefined>(undefined)
  const [yAxisDomain, setYAxisDomain] = React.useState<'auto' | 'dataMin-dataMax' | 'zero'>('auto')
  const [yAxisFormatter, setYAxisFormatter] = React.useState<'none' | 'compact' | 'currency'>('none')

  // ── Display tab state ───────────────────────────────────────────────────
  const [showTooltip, setShowTooltip] = React.useState(true)
  const [tooltipCursor, setTooltipCursor] = React.useState(true)
  const [tooltipIndicator, setTooltipIndicator] = React.useState<'dot' | 'line' | 'dashed'>('dot')
  const [showLegend, setShowLegend] = React.useState(true)
  const [legendPos, setLegendPos] = React.useState<'top' | 'bottom'>('bottom')

  const [showReferenceLineX, setShowReferenceLineX] = React.useState(false)
  const [referenceX, setReferenceX] = React.useState(0)
  const [referenceXLabel, setReferenceXLabel] = React.useState('Threshold')
  const [showReferenceLineY, setShowReferenceLineY] = React.useState(false)
  const [referenceY, setReferenceY] = React.useState(0)
  const [referenceYLabel, setReferenceYLabel] = React.useState('Target')
  const [referenceLineStroke, setReferenceLineStroke] = React.useState('#ef4444')

  const [showReferenceArea, setShowReferenceArea] = React.useState(false)
  const [refAreaX1, setRefAreaX1] = React.useState(0)
  const [refAreaX2, setRefAreaX2] = React.useState(5)
  const [refAreaY1, setRefAreaY1] = React.useState(0)
  const [refAreaY2, setRefAreaY2] = React.useState(80)
  const [refAreaFill, setRefAreaFill] = React.useState('#22c55e')
  const [refAreaOpacity, setRefAreaOpacity] = React.useState(0.1)
  const [refAreaLabel, setRefAreaLabel] = React.useState('Target Zone')

  const [showBrush, setShowBrush] = React.useState(false)
  const [brushHeight, setBrushHeight] = React.useState(24)

  // ── Derived state ───────────────────────────────────────────────────────

  const seriesData = React.useMemo(() => {
    const source = scatterDataSources[dataSource]
    if (useGrouping && source.groupField) {
      const groups = new Map<string, typeof source.data>()
      source.data.forEach((item) => {
        const groupValue = String(item[source.groupField!])
        if (!groups.has(groupValue)) groups.set(groupValue, [])
        groups.get(groupValue)!.push(item)
      })
      return Array.from(groups.entries()).map(([groupName, data]) => ({
        name: groupName,
        data,
      }))
    }
    return [{ name: 'All Data', data: source.data }]
  }, [dataSource, useGrouping])

  const resolvedSeries = React.useMemo(() => {
    return seriesData
      .filter((s) => enabledSeries[s.name] !== false)
      .map((series, index) => {
        const perSeries = seriesSettings[series.name] ?? {}
        return {
          ...series,
          color: perSeries.color ?? scatterColorPalette[index % scatterColorPalette.length],
          shape: (perSeries.shape ?? globalShape) as ShapeType,
          opacity: perSeries.opacity ?? globalOpacity,
          fillOpacity: perSeries.fillOpacity ?? globalFillOpacity,
          stroke: perSeries.stroke ?? globalStroke,
          strokeWidth: perSeries.strokeWidth ?? globalStrokeWidth,
          connectLine: perSeries.showLine ?? showLine,
          showLabel: perSeries.showLabel ?? showLabels,
          seriesLegendType: (perSeries.legendType ?? legendType) as LegendTypeOption,
        }
      })
  }, [seriesData, enabledSeries, seriesSettings, globalShape, globalOpacity, globalFillOpacity, globalStroke, globalStrokeWidth, showLine, showLabels, legendType])

  const config = React.useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {}
    resolvedSeries.forEach((s) => {
      cfg[s.name] = { label: s.name, color: s.color }
    })
    return cfg
  }, [resolvedSeries])

  // Formatter helpers
  const getXAxisFormatter = React.useCallback(() => {
    if (xAxisFormatter === 'compact') return (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))
    if (xAxisFormatter === 'fixed1') return (v: number) => Number(v).toFixed(1)
    if (xAxisFormatter === 'fixed2') return (v: number) => Number(v).toFixed(2)
    return undefined
  }, [xAxisFormatter])

  const getYAxisFormatter = React.useCallback(() => {
    if (yAxisFormatter === 'compact') return (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))
    if (yAxisFormatter === 'currency') return (v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`
    return undefined
  }, [yAxisFormatter])

  const getXAxisDomain = React.useCallback(() => {
    if (xAxisDomain === 'zero') return [0, 'auto'] as [number, string]
    if (xAxisDomain === 'dataMin-dataMax') return ['dataMin', 'dataMax'] as [string, string]
    return undefined
  }, [xAxisDomain])

  const getYAxisDomain = React.useCallback(() => {
    if (yAxisDomain === 'zero') return [0, 'auto'] as [number, string]
    if (yAxisDomain === 'dataMin-dataMax') return ['dataMin', 'dataMax'] as [string, string]
    return undefined
  }, [yAxisDomain])

  // ── Code generation ─────────────────────────────────────────────────────

  const generateCode = () => {
    const lines: string[] = []

    if (useGrouping && currentSource.groupField) {
      lines.push(`// Split data by "${currentSource.groupField}"`)
      resolvedSeries.forEach((s) => {
        lines.push(`const ${s.name.replace(/\s+/g, '')}Data = data.filter(d => d.${currentSource.groupField} === "${s.name}")`)
      })
      lines.push('')
    }

    lines.push(`<ChartContainer config={config} className="h-[400px]">`)
    lines.push(`  <ScatterChart`)
    if (margin.top !== 20 || margin.right !== 20 || margin.bottom !== 20 || margin.left !== 20) {
      lines.push(`    margin={{ top: ${margin.top}, right: ${margin.right}, bottom: ${margin.bottom}, left: ${margin.left} }}`)
    }
    lines.push(`  >`)

    if (showGrid) {
      const gridProps: string[] = []
      if (gridDashed) gridProps.push('strokeDasharray="3 3"')
      if (!gridHorizontal) gridProps.push('horizontal={false}')
      if (!gridVertical) gridProps.push('vertical={false}')
      lines.push(`    <CartesianGrid${gridProps.length ? ' ' + gridProps.join(' ') : ''} />`)
    }

    if (showXAxis) {
      const xProps = [`type="number"`, `dataKey="${xField}"`, `name="${xField}"`]
      if (xAxisUnit) xProps.push(`unit="${xAxisUnit}"`)
      if (xAxisOrientation !== 'bottom') xProps.push(`orientation="${xAxisOrientation}"`)
      if (xAxisTickCount) xProps.push(`tickCount={${xAxisTickCount}}`)
      if (xAxisAngle !== 0) xProps.push(`angle={${xAxisAngle}}`)
      if (xAxisDomain === 'zero') xProps.push(`domain={[0, "auto"]}`)
      else if (xAxisDomain === 'dataMin-dataMax') xProps.push(`domain={["dataMin", "dataMax"]}`)
      if (xAxisFormatter === 'compact') xProps.push(`tickFormatter={(v) => v >= 1000 ? \`\${(v/1000).toFixed(1)}k\` : v}`)
      else if (xAxisFormatter === 'fixed1') xProps.push(`tickFormatter={(v) => v.toFixed(1)}`)
      else if (xAxisFormatter === 'fixed2') xProps.push(`tickFormatter={(v) => v.toFixed(2)}`)
      lines.push(`    <XAxis ${xProps.join(' ')} />`)
    }

    if (showYAxis) {
      const yProps = [`type="number"`, `dataKey="${yField}"`, `name="${yField}"`]
      if (yAxisUnit) yProps.push(`unit="${yAxisUnit}"`)
      if (yAxisOrientation !== 'left') yProps.push(`orientation="${yAxisOrientation}"`)
      if (yAxisTickCount) yProps.push(`tickCount={${yAxisTickCount}}`)
      if (yAxisDomain === 'zero') yProps.push(`domain={[0, "auto"]}`)
      else if (yAxisDomain === 'dataMin-dataMax') yProps.push(`domain={["dataMin", "dataMax"]}`)
      if (yAxisFormatter === 'compact') yProps.push(`tickFormatter={(v) => v >= 1000 ? \`\${(v/1000).toFixed(1)}k\` : v}`)
      else if (yAxisFormatter === 'currency') yProps.push(`tickFormatter={(v) => \`$\${v >= 1000 ? \`\${(v/1000).toFixed(1)}k\` : v}\`}`)
      lines.push(`    <YAxis ${yProps.join(' ')} />`)
    }

    if (zField) {
      lines.push(`    <ZAxis type="number" dataKey="${zField}" range={[${pointSizeMin}, ${pointSizeMax}]} name="${zField}" />`)
    } else {
      lines.push(`    <ZAxis type="number" range={[${pointSizeMin}, ${pointSizeMin}]} />`)
    }

    if (showTooltip) {
      lines.push(`    <ChartTooltip content={<ChartTooltipContent indicator="${tooltipIndicator}" />}${tooltipCursor ? ' cursor={{ strokeDasharray: "3 3" }}' : ' cursor={false}'} />`)
    }
    if (showLegend) {
      const legendProps = legendPos !== 'bottom' ? ` verticalAlign="${legendPos}"` : ''
      lines.push(`    <ChartLegend content={<ChartLegendContent />}${legendProps} />`)
    }

    if (showReferenceLineX) {
      lines.push(`    <ReferenceLine x={${referenceX}} stroke="${referenceLineStroke}" strokeDasharray="3 3" label="${referenceXLabel}" />`)
    }
    if (showReferenceLineY) {
      lines.push(`    <ReferenceLine y={${referenceY}} stroke="${referenceLineStroke}" strokeDasharray="3 3" label="${referenceYLabel}" />`)
    }
    if (showReferenceArea) {
      lines.push(`    <ReferenceArea x1={${refAreaX1}} x2={${refAreaX2}} y1={${refAreaY1}} y2={${refAreaY2}} fill="${refAreaFill}" fillOpacity={${refAreaOpacity}} label="${refAreaLabel}" />`)
    }

    resolvedSeries.forEach((s) => {
      const scatterProps: string[] = [
        `name="${s.name}"`,
        useGrouping ? `data={${s.name.replace(/\s+/g, '')}Data}` : `data={data}`,
        `fill="${s.color}"`,
      ]
      if (s.shape !== 'circle') scatterProps.push(`shape="${s.shape}"`)
      if (s.opacity !== 0.8) scatterProps.push(`opacity={${s.opacity}}`)
      if (s.fillOpacity !== 1) scatterProps.push(`fillOpacity={${s.fillOpacity}}`)
      if (s.stroke) scatterProps.push(`stroke="${s.stroke}"`)
      if (s.strokeWidth > 0) scatterProps.push(`strokeWidth={${s.strokeWidth}}`)
      if (s.connectLine) {
        scatterProps.push(`line`)
        if (lineType !== 'joint') scatterProps.push(`lineType="${lineType}"`)
        if (lineType === 'joint' && lineJointType !== 'linear') scatterProps.push(`lineJointType="${lineJointType}"`)
      }
      if (s.seriesLegendType !== 'circle') scatterProps.push(`legendType="${s.seriesLegendType}"`)
      if (!isAnimationActive) scatterProps.push(`isAnimationActive={false}`)
      if (animationBegin !== 0) scatterProps.push(`animationBegin={${animationBegin}}`)
      if (animationDuration !== 400) scatterProps.push(`animationDuration={${animationDuration}}`)
      if (animationEasing !== 'ease') scatterProps.push(`animationEasing="${animationEasing}"`)
      if (activeShapeEnabled) scatterProps.push(`activeShape={{ fill: "${activeShapeFill}", opacity: ${activeShapeOpacity} }}`)
      if (s.showLabel) {
        const dk = labelDataKey === '__y__' ? yField : labelDataKey === '__x__' ? xField : labelDataKey
        lines.push(`    <Scatter ${scatterProps.join(' ')}>`)
        lines.push(`      <LabelList dataKey="${dk}" position="${labelPosition}" />`)
        lines.push(`    </Scatter>`)
      } else {
        lines.push(`    <Scatter ${scatterProps.join(' ')} />`)
      }
    })

    if (showBrush) {
      lines.push(`    <Brush dataKey="${xField}" height={${brushHeight}} stroke="hsl(var(--muted-foreground))" />`)
    }

    lines.push(`  </ScatterChart>`)
    lines.push(`</ChartContainer>`)
    return lines.join('\n')
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">ScatterChart Playground</h2>
        <p className="text-muted-foreground">
          Explore ScatterChart settings - correlation, clustering, and bubble charts
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
              <ScatterChart margin={margin}>
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
                    type="number"
                    dataKey={xField}
                    name={xField}
                    unit={xAxisUnit || undefined}
                    orientation={xAxisOrientation}
                    tickCount={xAxisTickCount}
                    angle={xAxisAngle}
                    textAnchor={xAxisAngle !== 0 ? 'end' : undefined}
                    height={xAxisAngle !== 0 ? 60 : undefined}
                    domain={getXAxisDomain()}
                    tickFormatter={getXAxisFormatter()}
                  />
                )}
                {showYAxis && (
                  <YAxis
                    type="number"
                    dataKey={yField}
                    name={yField}
                    unit={yAxisUnit || undefined}
                    orientation={yAxisOrientation}
                    tickCount={yAxisTickCount}
                    domain={getYAxisDomain()}
                    tickFormatter={getYAxisFormatter()}
                  />
                )}
                {zField ? (
                  <ZAxis type="number" dataKey={zField} range={[pointSizeMin, pointSizeMax]} name={zField} />
                ) : (
                  <ZAxis type="number" range={[pointSizeMin, pointSizeMin]} />
                )}
                {showTooltip && (
                  <ChartTooltip
                    content={(props) => <ChartTooltipContent {...props} indicator={tooltipIndicator} />}
                    cursor={tooltipCursor ? { strokeDasharray: '3 3' } : false}
                  />
                )}
                {showLegend && <ChartLegend content={<ChartLegendContent />} verticalAlign={legendPos} />}
                {showReferenceLineX && (
                  <ReferenceLine
                    x={referenceX}
                    stroke={referenceLineStroke}
                    strokeDasharray="3 3"
                    label={{ value: referenceXLabel, position: 'insideTopRight', fill: referenceLineStroke }}
                  />
                )}
                {showReferenceLineY && (
                  <ReferenceLine
                    y={referenceY}
                    stroke={referenceLineStroke}
                    strokeDasharray="3 3"
                    label={{ value: referenceYLabel, position: 'insideTopRight', fill: referenceLineStroke }}
                  />
                )}
                {showReferenceArea && (
                  <ReferenceArea
                    x1={refAreaX1}
                    x2={refAreaX2}
                    y1={refAreaY1}
                    y2={refAreaY2}
                    fill={refAreaFill}
                    fillOpacity={refAreaOpacity}
                    label={refAreaLabel}
                  />
                )}
                {resolvedSeries.map((series) => (
                  <Scatter
                    key={series.name}
                    name={series.name}
                    data={series.data}
                    fill={series.color}
                    shape={series.shape}
                    opacity={series.opacity}
                    fillOpacity={series.fillOpacity}
                    stroke={series.stroke || undefined}
                    strokeWidth={series.strokeWidth || undefined}
                    line={series.connectLine ? true : undefined}
                    lineType={series.connectLine ? lineType : undefined}
                    lineJointType={series.connectLine && lineType === 'joint' ? lineJointType : undefined}
                    legendType={series.seriesLegendType}
                    isAnimationActive={isAnimationActive}
                    animationBegin={animationBegin}
                    animationDuration={animationDuration}
                    animationEasing={animationEasing}
                    activeShape={activeShapeEnabled ? { fill: activeShapeFill, opacity: activeShapeOpacity } : undefined}
                  >
                    {series.showLabel && (
                      <LabelList
                        dataKey={labelDataKey === '__y__' ? yField : labelDataKey === '__x__' ? xField : labelDataKey}
                        position={labelPosition}
                        fontSize={11}
                      />
                    )}
                  </Scatter>
                ))}
                {showBrush && (
                  <Brush dataKey={xField} height={brushHeight} stroke="hsl(var(--muted-foreground))" />
                )}
              </ScatterChart>
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
                <TabsTrigger value="points">Points</TabsTrigger>
                <TabsTrigger value="series">Series</TabsTrigger>
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
                      {Object.entries(scatterDataSources).map(([key, src]) => (
                        <SelectItem key={key} value={key}>
                          {src.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">X-Axis Field</Label>
                  <Select value={xField} onValueChange={setXField}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentSource.numericFields.map((k) => (
                        <SelectItem key={k} value={k}>{k}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Horizontal axis (must be numeric)</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Y-Axis Field</Label>
                  <Select value={yField} onValueChange={setYField}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentSource.numericFields.map((k) => (
                        <SelectItem key={k} value={k}>{k}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Vertical axis (must be numeric)</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Z-Axis Field (Bubble Size)</Label>
                  <Select value={zField ?? '__none__'} onValueChange={(v) => setZField(v === '__none__' ? null : v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None (fixed size)</SelectItem>
                      {currentSource.numericFields.map((k) => (
                        <SelectItem key={k} value={k}>{k}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Optional: maps a numeric field to point size</p>
                </div>

                <Separator />

                {currentSource.groupField && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Group by: {currentSource.groupField}</Label>
                        <p className="text-xs text-muted-foreground">Split data into multiple series</p>
                      </div>
                      <Switch checked={useGrouping} onCheckedChange={setUseGrouping} />
                    </div>

                    {useGrouping && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">Series</p>
                            <button
                              className="text-xs text-primary hover:underline"
                              onClick={() => {
                                const allOn: Record<string, boolean> = {}
                                seriesData.forEach((s) => { allOn[s.name] = true })
                                setEnabledSeries(allOn)
                              }}
                            >
                              Enable all
                            </button>
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {seriesData.map((s, idx) => {
                              const checked = enabledSeries[s.name] !== false
                              return (
                                <button
                                  key={s.name}
                                  className={`flex items-center gap-2 rounded border p-2 text-left transition hover:border-primary ${checked ? 'bg-muted/50' : 'opacity-60'}`}
                                  onClick={() =>
                                    setEnabledSeries((prev) => ({
                                      ...prev,
                                      [s.name]: !(prev[s.name] !== false),
                                    }))
                                  }
                                >
                                  <span
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: scatterColorPalette[idx % scatterColorPalette.length] }}
                                  />
                                  <span className="text-sm font-medium">{s.name}</span>
                                  <span className="ml-auto text-xs text-muted-foreground">{s.data.length} pts</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </>
                    )}
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
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Show Cursor</span>
                      <Switch checked={tooltipCursor} onCheckedChange={setTooltipCursor} />
                    </div>
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
                  <>
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
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Legend Icon</span>
                      <Select value={legendType} onValueChange={(v) => setLegendType(v as LegendTypeOption)}>
                        <SelectTrigger className="w-28 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {legendTypeOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Separator />

                {/* Margins */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Margins</Label>
                    <button
                      className="text-xs text-primary hover:underline"
                      onClick={() => setMargin({ top: 20, right: 20, bottom: 20, left: 20 })}
                    >
                      Reset
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                      <div key={side} className="flex items-center gap-2">
                        <span className="w-12 text-xs text-muted-foreground capitalize">{side}</span>
                        <Input
                          type="number"
                          value={margin[side]}
                          onChange={(e) => setMargin((prev) => ({ ...prev, [side]: Number(e.target.value) || 0 }))}
                          className="h-8"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Animation */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Animation</Label>
                    <p className="text-xs text-muted-foreground">Animate point appearance</p>
                  </div>
                  <Switch checked={isAnimationActive} onCheckedChange={setIsAnimationActive} />
                </div>

                {isAnimationActive && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Delay (ms)</span>
                      <Input
                        type="number"
                        value={animationBegin}
                        onChange={(e) => setAnimationBegin(Math.max(0, Number(e.target.value) || 0))}
                        min={0}
                        max={5000}
                        className="w-24 h-8"
                      />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Duration (ms)</span>
                      <Input
                        type="number"
                        value={animationDuration}
                        onChange={(e) => setAnimationDuration(Number(e.target.value) || 400)}
                        min={0}
                        max={5000}
                        className="w-24 h-8"
                      />
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
              </TabsContent>

              {/* ─── Tab: Points ────────────────────────────────────── */}
              <TabsContent value="points" className="space-y-4 pt-4">
                {/* Global Shape */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Point Shape</Label>
                  <Select value={globalShape} onValueChange={(v) => setGlobalShape(v as ShapeType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shapeOptions.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Opacity */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Opacity</Label>
                    <p className="text-xs text-muted-foreground">Overall point transparency</p>
                  </div>
                  <Input
                    type="number"
                    value={globalOpacity}
                    onChange={(e) => setGlobalOpacity(Math.min(1, Math.max(0, Number(e.target.value) || 0)))}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-20 h-8"
                  />
                </div>

                {/* Fill Opacity */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Fill Opacity</Label>
                    <p className="text-xs text-muted-foreground">fillOpacity (0-1)</p>
                  </div>
                  <Input
                    type="number"
                    value={globalFillOpacity}
                    onChange={(e) => setGlobalFillOpacity(Math.min(1, Math.max(0, Number(e.target.value) || 0)))}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-20 h-8"
                  />
                </div>

                <Separator />

                {/* Stroke */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Point Stroke (border)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Color:</span>
                    <input
                      type="color"
                      value={globalStroke || '#000000'}
                      onChange={(e) => setGlobalStroke(e.target.value)}
                      className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                    />
                    <Input
                      type="text"
                      value={globalStroke}
                      onChange={(e) => setGlobalStroke(e.target.value)}
                      placeholder="none"
                      className="w-24 h-8"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Width:</span>
                    <Input
                      type="number"
                      value={globalStrokeWidth}
                      onChange={(e) => setGlobalStrokeWidth(Number(e.target.value) || 0)}
                      min={0}
                      max={6}
                      className="w-20 h-8"
                    />
                  </div>
                </div>

                <Separator />

                {/* Bubble Size */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{zField ? 'Size Range' : 'Fixed Point Size'}</Label>
                  <div className={zField ? 'grid grid-cols-2 gap-2' : ''}>
                    <div className="flex items-center gap-2">
                      {zField && <span className="text-xs text-muted-foreground w-8">Min</span>}
                      <Input
                        type="number"
                        value={pointSizeMin}
                        onChange={(e) => setPointSizeMin(Number(e.target.value) || 20)}
                        min={10}
                        max={500}
                        className="h-8"
                      />
                    </div>
                    {zField && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-8">Max</span>
                        <Input
                          type="number"
                          value={pointSizeMax}
                          onChange={(e) => setPointSizeMax(Number(e.target.value) || 200)}
                          min={10}
                          max={1000}
                          className="h-8"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {zField ? 'ZAxis maps values to point sizes in this range' : 'All points use this fixed size (ZAxis range)'}
                  </p>
                </div>

                <Separator />

                {/* Active Shape */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Active Shape</Label>
                    <p className="text-xs text-muted-foreground">Highlight on hover</p>
                  </div>
                  <Switch checked={activeShapeEnabled} onCheckedChange={setActiveShapeEnabled} />
                </div>

                {activeShapeEnabled && (
                  <div className="space-y-2 pl-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Fill:</span>
                      <input
                        type="color"
                        value={activeShapeFill}
                        onChange={(e) => setActiveShapeFill(e.target.value)}
                        className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                      />
                      <Input
                        type="text"
                        value={activeShapeFill}
                        onChange={(e) => setActiveShapeFill(e.target.value)}
                        className="w-24 h-8"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Opacity:</span>
                      <Input
                        type="number"
                        value={activeShapeOpacity}
                        onChange={(e) => setActiveShapeOpacity(Math.min(1, Math.max(0, Number(e.target.value) || 0)))}
                        min={0}
                        max={1}
                        step={0.1}
                        className="w-20 h-8"
                      />
                    </div>
                  </div>
                )}

                <Separator />

                {/* Line Connection */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Connect Points</Label>
                    <p className="text-xs text-muted-foreground">Draw lines between points</p>
                  </div>
                  <Switch checked={showLine} onCheckedChange={setShowLine} />
                </div>

                {showLine && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Line Type</span>
                      <Select value={lineType} onValueChange={(v) => setLineType(v as 'fitting' | 'joint')}>
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="joint">Joint</SelectItem>
                          <SelectItem value="fitting">Fitting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {lineType === 'joint' && (
                      <div className="flex items-center justify-between pl-4">
                        <span className="text-sm">Curve</span>
                        <Select value={lineJointType} onValueChange={(v) => setLineJointType(v as typeof lineJointType)}>
                          <SelectTrigger className="w-28 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linear">Linear</SelectItem>
                            <SelectItem value="monotone">Monotone</SelectItem>
                            <SelectItem value="natural">Natural</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}

                <Separator />

                {/* Labels */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Labels</Label>
                    <p className="text-xs text-muted-foreground">{'<LabelList />'} on points</p>
                  </div>
                  <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                </div>

                {showLabels && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Label Field</span>
                      <Select value={labelDataKey} onValueChange={setLabelDataKey}>
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__y__">Y value ({yField})</SelectItem>
                          <SelectItem value="__x__">X value ({xField})</SelectItem>
                          {currentSource.numericFields.map((k) => (
                            <SelectItem key={k} value={k}>{k}</SelectItem>
                          ))}
                          <SelectItem value={currentSource.labelField}>{currentSource.labelField} (label)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Position</span>
                      <Select value={labelPosition} onValueChange={(v) => setLabelPosition(v as typeof labelPosition)}>
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="insideTop">Inside Top</SelectItem>
                          <SelectItem value="insideBottom">Inside Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* ─── Tab: Series (per-series overrides) ─────────────── */}
              <TabsContent value="series" className="space-y-4 pt-4">
                <p className="text-xs text-muted-foreground">Customize each series independently: color, shape, opacity, stroke, labels, line.</p>
                {resolvedSeries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No series enabled. Go to Data tab to configure grouping.</p>
                ) : (
                  resolvedSeries.map((series, idx) => (
                    <div
                      key={series.name}
                      className="space-y-3 rounded-lg border p-3"
                      style={{ borderLeftColor: series.color, borderLeftWidth: 4 }}
                    >
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">{series.name}</Label>
                        <span className="text-xs text-muted-foreground">{series.data.length} points</span>
                      </div>

                      {/* Color */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Color</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Custom:</span>
                            <input
                              type="color"
                              value={seriesSettings[series.name]?.color ?? scatterColorPalette[idx % scatterColorPalette.length]}
                              onChange={(e) => updateSeriesSetting(series.name, 'color', e.target.value)}
                              className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                              title="Pick custom color"
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {scatterColorPalette.map((c) => (
                            <button
                              key={c}
                              className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${series.color === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                              style={{ backgroundColor: c }}
                              onClick={() => updateSeriesSetting(series.name, 'color', c)}
                              title={c}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Shape */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Shape (override)</Label>
                        <Select
                          value={seriesSettings[series.name]?.shape ?? '__inherit__'}
                          onValueChange={(v) => updateSeriesSetting(series.name, 'shape', v === '__inherit__' ? undefined : v)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__inherit__">Inherit (Points tab)</SelectItem>
                            {shapeOptions.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Opacity */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Opacity</span>
                        <Input
                          type="number"
                          value={seriesSettings[series.name]?.opacity ?? ''}
                          onChange={(e) => updateSeriesSetting(series.name, 'opacity', e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="inherit"
                          min={0}
                          max={1}
                          step={0.1}
                          className="w-20 h-8"
                        />
                      </div>

                      {/* Fill Opacity */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Fill Opacity</span>
                        <Input
                          type="number"
                          value={seriesSettings[series.name]?.fillOpacity ?? ''}
                          onChange={(e) => updateSeriesSetting(series.name, 'fillOpacity', e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="inherit"
                          min={0}
                          max={1}
                          step={0.1}
                          className="w-20 h-8"
                        />
                      </div>

                      {/* Stroke */}
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Stroke (border)</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={seriesSettings[series.name]?.stroke || '#000000'}
                            onChange={(e) => updateSeriesSetting(series.name, 'stroke', e.target.value)}
                            className="h-6 w-8 cursor-pointer rounded border-0 p-0"
                          />
                          <Input
                            type="text"
                            value={seriesSettings[series.name]?.stroke ?? ''}
                            onChange={(e) => updateSeriesSetting(series.name, 'stroke', e.target.value)}
                            placeholder="inherit"
                            className="w-20 h-8"
                          />
                          <Input
                            type="number"
                            value={seriesSettings[series.name]?.strokeWidth ?? ''}
                            onChange={(e) => updateSeriesSetting(series.name, 'strokeWidth', e.target.value ? Number(e.target.value) : undefined)}
                            placeholder="W"
                            min={0}
                            max={6}
                            className="w-14 h-8"
                          />
                        </div>
                      </div>

                      {/* Line */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Connect Line</span>
                        <Switch
                          checked={seriesSettings[series.name]?.showLine ?? showLine}
                          onCheckedChange={(checked) => updateSeriesSetting(series.name, 'showLine', checked)}
                        />
                      </div>

                      {/* Label */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Label</span>
                        <Switch
                          checked={seriesSettings[series.name]?.showLabel ?? showLabels}
                          onCheckedChange={(checked) => updateSeriesSetting(series.name, 'showLabel', checked)}
                        />
                      </div>

                      {/* Legend Type */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Legend Icon</Label>
                        <Select
                          value={seriesSettings[series.name]?.legendType ?? '__inherit__'}
                          onValueChange={(v) => updateSeriesSetting(series.name, 'legendType', v === '__inherit__' ? undefined : v)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__inherit__">Inherit (Chart tab)</SelectItem>
                            {legendTypeOptions.map((o) => (
                              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))
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
                      <span className="text-sm">Dashed Grid</span>
                      <Switch checked={gridDashed} onCheckedChange={setGridDashed} />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Horizontal Lines</span>
                      <Switch checked={gridHorizontal} onCheckedChange={setGridHorizontal} />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Vertical Lines</span>
                      <Switch checked={gridVertical} onCheckedChange={setGridVertical} />
                    </div>
                  </>
                )}

                <Separator />

                {/* X Axis */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show X Axis</Label>
                    <p className="text-xs text-muted-foreground">type=&quot;number&quot;</p>
                  </div>
                  <Switch checked={showXAxis} onCheckedChange={setShowXAxis} />
                </div>

                {showXAxis && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Unit</span>
                      <Input
                        type="text"
                        value={xAxisUnit}
                        onChange={(e) => setXAxisUnit(e.target.value)}
                        placeholder="e.g. cm"
                        className="w-20 h-8"
                      />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Orientation</span>
                      <Select value={xAxisOrientation} onValueChange={(v) => setXAxisOrientation(v as 'bottom' | 'top')}>
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom">Bottom</SelectItem>
                          <SelectItem value="top">Top</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Tick Count</span>
                      <Input
                        type="number"
                        value={xAxisTickCount ?? ''}
                        onChange={(e) => setXAxisTickCount(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="auto"
                        min={2}
                        max={20}
                        className="w-20 h-8"
                      />
                    </div>
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
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">Domain</Label>
                      <Select value={xAxisDomain} onValueChange={(v) => setXAxisDomain(v as typeof xAxisDomain)}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">auto - Recharts default</SelectItem>
                          <SelectItem value="zero">zero - Start from 0</SelectItem>
                          <SelectItem value="dataMin-dataMax">dataMin-dataMax - Fit to data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">Formatter</Label>
                      <Select value={xAxisFormatter} onValueChange={(v) => setXAxisFormatter(v as typeof xAxisFormatter)}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="compact">Compact (1.2k)</SelectItem>
                          <SelectItem value="fixed1">1 decimal</SelectItem>
                          <SelectItem value="fixed2">2 decimals</SelectItem>
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
                    <p className="text-xs text-muted-foreground">type=&quot;number&quot;</p>
                  </div>
                  <Switch checked={showYAxis} onCheckedChange={setShowYAxis} />
                </div>

                {showYAxis && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Unit</span>
                      <Input
                        type="text"
                        value={yAxisUnit}
                        onChange={(e) => setYAxisUnit(e.target.value)}
                        placeholder="e.g. kg"
                        className="w-20 h-8"
                      />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Orientation</span>
                      <Select value={yAxisOrientation} onValueChange={(v) => setYAxisOrientation(v as 'left' | 'right')}>
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Tick Count</span>
                      <Input
                        type="number"
                        value={yAxisTickCount ?? ''}
                        onChange={(e) => setYAxisTickCount(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="auto"
                        min={2}
                        max={20}
                        className="w-20 h-8"
                      />
                    </div>
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">Domain</Label>
                      <Select value={yAxisDomain} onValueChange={(v) => setYAxisDomain(v as typeof yAxisDomain)}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">auto - Recharts default</SelectItem>
                          <SelectItem value="zero">zero - Start from 0</SelectItem>
                          <SelectItem value="dataMin-dataMax">dataMin-dataMax - Fit to data</SelectItem>
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

                {/* Reference Lines */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Vertical Reference</Label>
                    <p className="text-xs text-muted-foreground">{'<ReferenceLine x={...} />'}</p>
                  </div>
                  <Switch checked={showReferenceLineX} onCheckedChange={setShowReferenceLineX} />
                </div>

                {showReferenceLineX && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">X Value</span>
                      <Input
                        type="number"
                        value={referenceX}
                        onChange={(e) => setReferenceX(Number(e.target.value))}
                        className="w-20 h-8"
                      />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Label</span>
                      <Input
                        type="text"
                        value={referenceXLabel}
                        onChange={(e) => setReferenceXLabel(e.target.value)}
                        className="w-24 h-8"
                      />
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Horizontal Reference</Label>
                    <p className="text-xs text-muted-foreground">{'<ReferenceLine y={...} />'}</p>
                  </div>
                  <Switch checked={showReferenceLineY} onCheckedChange={setShowReferenceLineY} />
                </div>

                {showReferenceLineY && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Y Value</span>
                      <Input
                        type="number"
                        value={referenceY}
                        onChange={(e) => setReferenceY(Number(e.target.value))}
                        className="w-20 h-8"
                      />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Label</span>
                      <Input
                        type="text"
                        value={referenceYLabel}
                        onChange={(e) => setReferenceYLabel(e.target.value)}
                        className="w-24 h-8"
                      />
                    </div>
                  </>
                )}

                {(showReferenceLineX || showReferenceLineY) && (
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-sm">Stroke Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={referenceLineStroke}
                        onChange={(e) => setReferenceLineStroke(e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded border-0 p-0"
                      />
                      <Input
                        type="text"
                        value={referenceLineStroke}
                        onChange={(e) => setReferenceLineStroke(e.target.value)}
                        className="w-24 h-8"
                      />
                    </div>
                  </div>
                )}

                <Separator />

                {/* Reference Area */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Reference Area</Label>
                    <p className="text-xs text-muted-foreground">{'<ReferenceArea />'} zone highlight</p>
                  </div>
                  <Switch checked={showReferenceArea} onCheckedChange={setShowReferenceArea} />
                </div>

                {showReferenceArea && (
                  <div className="space-y-2 pl-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground w-6">x1</span>
                        <Input type="number" value={refAreaX1} onChange={(e) => setRefAreaX1(Number(e.target.value))} className="h-8" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground w-6">x2</span>
                        <Input type="number" value={refAreaX2} onChange={(e) => setRefAreaX2(Number(e.target.value))} className="h-8" />
                      </div>
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
                      <input
                        type="color"
                        value={refAreaFill}
                        onChange={(e) => setRefAreaFill(e.target.value)}
                        className="h-6 w-8 cursor-pointer rounded border-0 p-0"
                      />
                      <Input
                        type="text"
                        value={refAreaFill}
                        onChange={(e) => setRefAreaFill(e.target.value)}
                        className="w-24 h-8"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Opacity:</span>
                      <Input
                        type="number"
                        value={refAreaOpacity}
                        onChange={(e) => setRefAreaOpacity(Math.min(1, Math.max(0, Number(e.target.value) || 0)))}
                        min={0}
                        max={1}
                        step={0.05}
                        className="w-20 h-8"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Label:</span>
                      <Input
                        type="text"
                        value={refAreaLabel}
                        onChange={(e) => setRefAreaLabel(e.target.value)}
                        className="w-32 h-8"
                      />
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
            {currentSource.name} — {currentSource.data.length} records
            {useGrouping && currentSource.groupField && ` grouped by "${currentSource.groupField}" into ${seriesData.length} series`}
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
            <CardDescription>Required data structure for ScatterChart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              <code>{`// Array of objects with numeric X, Y fields
const data = [
  { studyHours: 2, score: 55, group: "A" },
  { studyHours: 8, score: 92, group: "A" },
  { studyHours: 5, score: 82, group: "B" },
]

// Split by group for multi-series
const groupA = data.filter(d => d.group === "A")
const groupB = data.filter(d => d.group === "B")

// ChartConfig for tooltips & legend
const config: ChartConfig = {
  "Class A": { label: "Class A", color: "#4169e1" },
  "Class B": { label: "Class B", color: "#2db89a" },
}`}</code>
            </pre>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>X, Y fields</strong> - Both must be numeric</li>
                <li><strong>Z field (optional)</strong> - Controls point size via ZAxis</li>
                <li><strong>Group field (optional)</strong> - Categorical field to split into series</li>
                <li><strong>Separate arrays</strong> - Each Scatter has its own data array</li>
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
              <p className="font-medium mb-1">Scatter Component</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">shape</code> - circle, square, triangle, diamond, star, wye, cross</li>
                <li><code className="text-xs">fill</code> - Point color</li>
                <li><code className="text-xs">opacity</code> - Point transparency (0-1)</li>
                <li><code className="text-xs">fillOpacity</code> - Fill-only transparency</li>
                <li><code className="text-xs">stroke / strokeWidth</code> - Point border color and width</li>
                <li><code className="text-xs">activeShape</code> - Highlight on hover (fill, opacity)</li>
                <li><code className="text-xs">line</code> - Connect points with line</li>
                <li><code className="text-xs">lineType</code> - fitting (regression) or joint</li>
                <li><code className="text-xs">lineJointType</code> - linear, monotone, natural</li>
                <li><code className="text-xs">legendType</code> - Icon shape in legend</li>
                <li><code className="text-xs">label / LabelList</code> - Data labels on points</li>
                <li><code className="text-xs">isAnimationActive</code> - Enable/disable animation</li>
                <li><code className="text-xs">animationBegin</code> - Delay before animation starts (ms)</li>
                <li><code className="text-xs">animationDuration</code> - Animation duration (ms)</li>
                <li><code className="text-xs">animationEasing</code> - ease, ease-in, ease-out, linear</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Axes (type=&quot;number&quot;)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">XAxis / YAxis</code> - orientation, unit, tickCount, angle, domain, tickFormatter</li>
                <li><code className="text-xs">ZAxis</code> - range for point sizes [min, max]</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Reference Elements</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">ReferenceLine</code> - Threshold/target lines (x or y)</li>
                <li><code className="text-xs">ReferenceArea</code> - Highlighted rectangular zone</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Interactivity</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">Tooltip</code> - indicator (dot, line, dashed), cursor control</li>
                <li><code className="text-xs">Legend</code> - position (top/bottom), icon type per series</li>
                <li><code className="text-xs">Brush</code> - Range selection for zoom/pan on X-axis</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitations</CardTitle>
            <CardDescription>What ScatterChart cannot do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Max ~500 points</strong> - Performance and overlap issues</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No density visualization</strong> - Overlapping points hide data</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No built-in regression</strong> - Trend lines need calculation (lineType=&quot;fitting&quot; is basic)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No jitter</strong> - Overlapping points stack exactly</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No categorical axes</strong> - Both X and Y must be numeric</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Practices & Use Cases</CardTitle>
            <CardDescription>When and how to use ScatterChart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Ideal For:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Correlation between two variables</li>
                <li>Outlier detection</li>
                <li>Cluster visualization</li>
                <li>Bubble charts (with ZAxis)</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Avoid When:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Time series data - Use LineChart</li>
                <li>Categorical X-axis - Use BarChart</li>
                <li>1000+ points - Use specialized viz library</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Tips:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Use different shapes for multiple series</li>
                <li>Add ReferenceLine for thresholds</li>
                <li>Use ReferenceArea to highlight target zones</li>
                <li>Use ZAxis sparingly - bubbles overlap</li>
                <li>Group by a categorical field for comparisons</li>
                <li>Use stroke to add borders for better contrast</li>
                <li>Use activeShape for interactive exploration</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Understanding Cards ────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding X, Y & Z Axes</CardTitle>
          <CardDescription>How each axis maps to visual dimensions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="font-medium">X-Axis (Horizontal)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Type:</strong> Always numeric</li>
                <li><strong>dataKey:</strong> Field for horizontal position</li>
                <li><strong>Orientation:</strong> Top or bottom</li>
                <li><strong>domain:</strong> auto, zero, or dataMin-dataMax</li>
                <li><strong>tickFormatter:</strong> Compact, fixed decimals</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Y-Axis (Vertical)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Type:</strong> Always numeric</li>
                <li><strong>dataKey:</strong> Field for vertical position</li>
                <li><strong>Orientation:</strong> Left or right</li>
                <li><strong>domain:</strong> auto, zero, or dataMin-dataMax</li>
                <li><strong>tickFormatter:</strong> Compact, currency</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Z-Axis (Size)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Optional:</strong> Maps to point size</li>
                <li><strong>range:</strong> [minSize, maxSize] in pixels</li>
                <li><strong>Enables:</strong> Bubble chart mode</li>
              </ul>
            </div>
          </div>
          <Separator />
          <div className="rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-3 text-xs text-muted-foreground">
            <p><strong className="text-blue-700 dark:text-blue-400">Tip:</strong> Unlike BarChart or LineChart, ScatterChart requires both X and Y to be numeric fields. Use the Z-Axis to add a third dimension (bubble size) for richer visualizations.</p>
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
                <li>Color (fill) per series</li>
                <li>Shape override per series</li>
                <li>Opacity and fill opacity per series</li>
                <li>Stroke color and width per series</li>
                <li>Connect line toggle per series</li>
                <li>Label toggle per series</li>
                <li>Legend icon type per series</li>
                <li>Enable/disable series (Data tab)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">+</span>
                <p className="font-medium">Chart-wide</p>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>X/Y/Z field mapping, grouping</li>
                <li>Margins, animation settings (delay, duration, easing)</li>
                <li>Default shape, opacity, fill opacity, stroke</li>
                <li>Point size range (ZAxis)</li>
                <li>Active shape hover effect</li>
                <li>Line connection type and curve</li>
                <li>Label field and position</li>
                <li>Grid, axes (domain, formatter, unit, orientation)</li>
                <li>Tooltip (indicator, cursor), legend (position, icon)</li>
                <li>Reference lines (X/Y), reference area</li>
                <li>Brush for zoom/pan</li>
              </ul>
            </div>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">Per-series settings override the chart-wide defaults. If a per-series value is not set, it inherits from the global setting in the Points/Chart tabs.</p>
        </CardContent>
      </Card>
    </div>
  )
}
