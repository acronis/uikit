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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LabelList,
} from 'recharts'
// colors managed via colorPalette constant

// ─── Types ───────────────────────────────────────────────────────────────────

type LegendTypeOption = 'rect' | 'circle' | 'square' | 'diamond' | 'star' | 'triangle' | 'wye' | 'line' | 'none'

interface RadarDataSource {
  name: string
  data: Record<string, string | number>[]
  categoryField: string
  valueFields: string[]
  maxValue: number
}

interface SeriesConfig {
  color?: string
  fillOpacity?: number
  strokeWidth?: number
  stroke?: string
  dot?: boolean
  dotRadius?: number
  activeDot?: boolean
  connectNulls?: boolean
  legendType?: LegendTypeOption
  showLabel?: boolean
}

// ─── Data Sources ────────────────────────────────────────────────────────────

const radarDataSources: Record<string, RadarDataSource> = {
  students: {
    name: 'Student Performance',
    data: [
      { subject: 'Math', Alice: 120, Bob: 110, Carol: 95, fullMark: 150 },
      { subject: 'Chinese', Alice: 98, Bob: 130, Carol: 105, fullMark: 150 },
      { subject: 'English', Alice: 86, Bob: 130, Carol: 140, fullMark: 150 },
      { subject: 'Geography', Alice: 99, Bob: 100, Carol: 88, fullMark: 150 },
      { subject: 'Physics', Alice: 85, Bob: 90, Carol: 120, fullMark: 150 },
      { subject: 'History', Alice: 65, Bob: 85, Carol: 110, fullMark: 150 },
    ],
    categoryField: 'subject',
    valueFields: ['Alice', 'Bob', 'Carol'],
    maxValue: 150,
  },
  skills: {
    name: 'Developer Skills',
    data: [
      { skill: 'Frontend', Senior: 90, Mid: 70, Junior: 40 },
      { skill: 'Backend', Senior: 85, Mid: 75, Junior: 30 },
      { skill: 'DevOps', Senior: 75, Mid: 50, Junior: 15 },
      { skill: 'Design', Senior: 60, Mid: 55, Junior: 45 },
      { skill: 'Testing', Senior: 80, Mid: 65, Junior: 25 },
      { skill: 'Communication', Senior: 90, Mid: 60, Junior: 50 },
      { skill: 'Leadership', Senior: 85, Mid: 40, Junior: 10 },
      { skill: 'Problem Solving', Senior: 95, Mid: 70, Junior: 35 },
    ],
    categoryField: 'skill',
    valueFields: ['Senior', 'Mid', 'Junior'],
    maxValue: 100,
  },
  products: {
    name: 'Product Comparison',
    data: [
      { feature: 'Performance', ProductA: 85, ProductB: 70, ProductC: 92, ProductD: 60 },
      { feature: 'Reliability', ProductA: 90, ProductB: 88, ProductC: 75, ProductD: 80 },
      { feature: 'Usability', ProductA: 70, ProductB: 85, ProductC: 80, ProductD: 95 },
      { feature: 'Security', ProductA: 95, ProductB: 78, ProductC: 82, ProductD: 70 },
      { feature: 'Support', ProductA: 65, ProductB: 90, ProductC: 72, ProductD: 88 },
      { feature: 'Price', ProductA: 50, ProductB: 75, ProductC: 85, ProductD: 92 },
    ],
    categoryField: 'feature',
    valueFields: ['ProductA', 'ProductB', 'ProductC', 'ProductD'],
    maxValue: 100,
  },
}

type DataSourceKey = keyof typeof radarDataSources

// ─── Constants ───────────────────────────────────────────────────────────────

const colorPalette = [
  '#4169e1', '#2db89a', '#d946ef', '#ef5350', '#d4c92a',
  '#38bdf8', '#a57c52', '#7c3aed', '#9ca3af', '#93c5fd',
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

export function RadarChartPlayground() {
  // ── Data tab state ──────────────────────────────────────────────────────
  const [dataSource, setDataSource] = React.useState<DataSourceKey>('students')
  const currentSource = radarDataSources[dataSource]
  const [enabledSeries, setEnabledSeries] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    const source = radarDataSources[dataSource]
    const allOn: Record<string, boolean> = {}
    source.valueFields.forEach((f) => { allOn[f] = true })
    setEnabledSeries(allOn)
    setSeriesConfigs({})
  }, [dataSource])

  // ── Per-series config ───────────────────────────────────────────────────
  const [seriesConfigs, setSeriesConfigs] = React.useState<Record<string, SeriesConfig>>({})

  const getSeriesConfig = (field: string, idx: number): SeriesConfig & { color: string } => {
    const sc = seriesConfigs[field] ?? {}
    return {
      color: sc.color ?? colorPalette[idx % colorPalette.length],
      fillOpacity: sc.fillOpacity ?? globalFillOpacity,
      strokeWidth: sc.strokeWidth ?? globalStrokeWidth,
      stroke: sc.stroke,
      dot: sc.dot ?? globalDot,
      dotRadius: sc.dotRadius ?? globalDotRadius,
      activeDot: sc.activeDot ?? globalActiveDot,
      connectNulls: sc.connectNulls ?? false,
      legendType: sc.legendType ?? globalLegendType,
      showLabel: sc.showLabel ?? globalShowLabels,
    }
  }

  const updateSeriesConfig = (field: string, key: string, value: unknown) => {
    setSeriesConfigs((prev) => ({
      ...prev,
      [field]: { ...prev[field], [key]: value },
    }))
  }

  // ── Chart tab state ─────────────────────────────────────────────────────
  const [cx, setCx] = React.useState('50%')
  const [cy, setCy] = React.useState('50%')
  const [startAngle, setStartAngle] = React.useState(90)
  const [endAngle, setEndAngle] = React.useState(-270)
  const [innerRadius, setInnerRadius] = React.useState(0)
  const [outerRadius, setOuterRadius] = React.useState('80%')
  const [margin, setMargin] = React.useState({ top: 20, right: 20, bottom: 20, left: 20 })

  // Animation
  const [isAnimationActive, setIsAnimationActive] = React.useState(true)
  const [animationDuration, setAnimationDuration] = React.useState(1500)
  const [animationBegin, setAnimationBegin] = React.useState(0)
  const [animationEasing, setAnimationEasing] = React.useState<'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'>('ease')

  // ── Radar defaults ──────────────────────────────────────────────────────
  const [globalFillOpacity, setGlobalFillOpacity] = React.useState(0.3)
  const [globalStrokeWidth, setGlobalStrokeWidth] = React.useState(2)
  const [globalDot, setGlobalDot] = React.useState(true)
  const [globalDotRadius, setGlobalDotRadius] = React.useState(4)
  const [globalActiveDot, setGlobalActiveDot] = React.useState(true)
  const [globalLegendType, setGlobalLegendType] = React.useState<LegendTypeOption>('rect')
  const [globalShowLabels, setGlobalShowLabels] = React.useState(false)
  const [labelPosition, setLabelPosition] = React.useState<'top' | 'right' | 'bottom' | 'left' | 'insideTop' | 'insideBottom'>('top')

  // ── Display tab state ───────────────────────────────────────────────────
  const [showTooltip, setShowTooltip] = React.useState(true)
  const [tooltipIndicator, setTooltipIndicator] = React.useState<'dot' | 'line' | 'dashed'>('dot')
  const [showLegend, setShowLegend] = React.useState(true)
  const [legendPos, setLegendPos] = React.useState<'top' | 'bottom'>('bottom')

  // ── Grid & Axes tab state ───────────────────────────────────────────────
  // PolarGrid
  const [showPolarGrid, setShowPolarGrid] = React.useState(true)
  const [gridType, setGridType] = React.useState<'polygon' | 'circle'>('polygon')
  const [radialLines, setRadialLines] = React.useState(true)
  const [gridInnerRadius, setGridInnerRadius] = React.useState<number | undefined>(undefined)
  const [gridOuterRadius, setGridOuterRadius] = React.useState<number | undefined>(undefined)

  // PolarAngleAxis
  const [showAngleAxis, setShowAngleAxis] = React.useState(true)
  const [angleAxisOrientation, setAngleAxisOrientation] = React.useState<'inner' | 'outer'>('outer')
  const [angleAxisLine, setAngleAxisLine] = React.useState(true)
  const [angleAxisLineType, setAngleAxisLineType] = React.useState<'polygon' | 'circle'>('polygon')
  const [angleTickLine, setAngleTickLine] = React.useState(true)
  const [angleTickSize, setAngleTickSize] = React.useState(8)

  // PolarRadiusAxis
  const [showRadiusAxis, setShowRadiusAxis] = React.useState(false)
  const [radiusAxisAngle, setRadiusAxisAngle] = React.useState(30)
  const [radiusAxisOrientation, setRadiusAxisOrientation] = React.useState<'left' | 'right' | 'middle'>('right')
  const [radiusAxisDomain, setRadiusAxisDomain] = React.useState<'auto' | 'fixed'>('fixed')
  const [radiusAxisDomainMax, setRadiusAxisDomainMax] = React.useState(currentSource.maxValue)
  const [radiusAxisTickCount, setRadiusAxisTickCount] = React.useState(5)
  const [radiusAxisTick, setRadiusAxisTick] = React.useState(true)
  const [radiusAxisReversed, setRadiusAxisReversed] = React.useState(false)

  // Update domain max on data source change
  React.useEffect(() => {
    setRadiusAxisDomainMax(radarDataSources[dataSource].maxValue)
  }, [dataSource])

  // ── Derived ─────────────────────────────────────────────────────────────

  const activeFields = React.useMemo(() => {
    return currentSource.valueFields.filter((f) => enabledSeries[f] !== false)
  }, [currentSource.valueFields, enabledSeries])

  const config = React.useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {}
    activeFields.forEach((field) => {
      const sc = getSeriesConfig(field, currentSource.valueFields.indexOf(field))
      cfg[field] = { label: field, color: sc.color }
    })
    return cfg
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFields, currentSource.valueFields, seriesConfigs, globalFillOpacity, globalStrokeWidth, globalDot, globalDotRadius, globalActiveDot, globalLegendType])

  // ── Code generation ─────────────────────────────────────────────────────

  const generateCode = () => {
    const lines: string[] = []
    lines.push(`<ChartContainer config={config} className="h-[400px]">`)

    const chartProps: string[] = ['data={data}']
    if (cx !== '50%') chartProps.push(`cx="${cx}"`)
    if (cy !== '50%') chartProps.push(`cy="${cy}"`)
    if (startAngle !== 90) chartProps.push(`startAngle={${startAngle}}`)
    if (endAngle !== -270) chartProps.push(`endAngle={${endAngle}}`)
    if (innerRadius !== 0) chartProps.push(`innerRadius={${innerRadius}}`)
    if (outerRadius !== '80%') chartProps.push(`outerRadius="${outerRadius}"`)
    if (margin.top !== 20 || margin.right !== 20 || margin.bottom !== 20 || margin.left !== 20) {
      chartProps.push(`margin={{ top: ${margin.top}, right: ${margin.right}, bottom: ${margin.bottom}, left: ${margin.left} }}`)
    }
    lines.push(`  <RadarChart ${chartProps.join(' ')}>`)

    if (showPolarGrid) {
      const gp: string[] = []
      if (gridType !== 'polygon') gp.push(`gridType="${gridType}"`)
      if (!radialLines) gp.push('radialLines={false}')
      if (gridInnerRadius != null) gp.push(`innerRadius={${gridInnerRadius}}`)
      if (gridOuterRadius != null) gp.push(`outerRadius={${gridOuterRadius}}`)
      lines.push(`    <PolarGrid${gp.length ? ' ' + gp.join(' ') : ''} />`)
    }

    if (showAngleAxis) {
      const ap: string[] = [`dataKey="${currentSource.categoryField}"`]
      if (angleAxisOrientation !== 'outer') ap.push(`orientation="${angleAxisOrientation}"`)
      if (!angleAxisLine) ap.push('axisLine={false}')
      if (angleAxisLineType !== 'polygon') ap.push(`axisLineType="${angleAxisLineType}"`)
      if (!angleTickLine) ap.push('tickLine={false}')
      if (angleTickSize !== 8) ap.push(`tickSize={${angleTickSize}}`)
      lines.push(`    <PolarAngleAxis ${ap.join(' ')} />`)
    }

    if (showRadiusAxis) {
      const rp: string[] = []
      if (radiusAxisAngle !== 30) rp.push(`angle={${radiusAxisAngle}}`)
      if (radiusAxisOrientation !== 'right') rp.push(`orientation="${radiusAxisOrientation}"`)
      if (radiusAxisDomain === 'fixed') rp.push(`domain={[0, ${radiusAxisDomainMax}]}`)
      if (radiusAxisTickCount !== 5) rp.push(`tickCount={${radiusAxisTickCount}}`)
      if (!radiusAxisTick) rp.push('tick={false}')
      if (radiusAxisReversed) rp.push('reversed')
      lines.push(`    <PolarRadiusAxis${rp.length ? ' ' + rp.join(' ') : ''} />`)
    }

    if (showTooltip) {
      lines.push(`    <ChartTooltip content={<ChartTooltipContent indicator="${tooltipIndicator}" />} />`)
    }
    if (showLegend) {
      const lp = legendPos !== 'bottom' ? ` verticalAlign="${legendPos}"` : ''
      lines.push(`    <ChartLegend content={<ChartLegendContent />}${lp} />`)
    }

    activeFields.forEach((field) => {
      const idx = currentSource.valueFields.indexOf(field)
      const sc = getSeriesConfig(field, idx)
      const rp: string[] = [
        `name="${field}"`,
        `dataKey="${field}"`,
        `stroke="${sc.color}"`,
        `fill="${sc.color}"`,
        `fillOpacity={${sc.fillOpacity}}`,
      ]
      if (sc.strokeWidth !== 2) rp.push(`strokeWidth={${sc.strokeWidth}}`)
      if (sc.stroke && sc.stroke !== sc.color) rp.push(`stroke="${sc.stroke}"`)
      if (sc.dot) rp.push(`dot={{ r: ${sc.dotRadius} }}`)
      if (!sc.activeDot) rp.push('activeDot={false}')
      if (sc.connectNulls) rp.push('connectNulls')
      if (sc.legendType !== 'rect') rp.push(`legendType="${sc.legendType}"`)
      if (!isAnimationActive) rp.push('isAnimationActive={false}')
      if (animationBegin !== 0) rp.push(`animationBegin={${animationBegin}}`)
      if (animationDuration !== 1500) rp.push(`animationDuration={${animationDuration}}`)
      if (animationEasing !== 'ease') rp.push(`animationEasing="${animationEasing}"`)

      if (sc.showLabel) {
        lines.push(`    <Radar ${rp.join(' ')}>`)
        lines.push(`      <LabelList dataKey="${field}" position="${labelPosition}" fontSize={11} />`)
        lines.push(`    </Radar>`)
      } else {
        lines.push(`    <Radar ${rp.join(' ')} />`)
      }
    })

    lines.push(`  </RadarChart>`)
    lines.push(`</ChartContainer>`)
    return lines.join('\n')
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">RadarChart Playground</h2>
        <p className="text-muted-foreground">
          Spider/web charts for comparing multi-dimensional data across categories
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
              <RadarChart
                data={currentSource.data}
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                margin={margin}
              >
                {showPolarGrid && (
                  <PolarGrid
                    gridType={gridType}
                    radialLines={radialLines}
                    innerRadius={gridInnerRadius}
                    outerRadius={gridOuterRadius}
                  />
                )}
                {showAngleAxis && (
                  <PolarAngleAxis
                    dataKey={currentSource.categoryField}
                    orientation={angleAxisOrientation}
                    axisLine={angleAxisLine}
                    axisLineType={angleAxisLineType}
                    tickLine={angleTickLine}
                    tickSize={angleTickSize}
                  />
                )}
                {showRadiusAxis && (
                  <PolarRadiusAxis
                    angle={radiusAxisAngle}
                    orientation={radiusAxisOrientation}
                    domain={radiusAxisDomain === 'fixed' ? [0, radiusAxisDomainMax] : undefined}
                    tickCount={radiusAxisTickCount}
                    tick={radiusAxisTick}
                    reversed={radiusAxisReversed}
                  />
                )}
                {showTooltip && (
                  <ChartTooltip
                    content={(props) => <ChartTooltipContent {...props} indicator={tooltipIndicator} />}
                  />
                )}
                {showLegend && <ChartLegend content={<ChartLegendContent />} verticalAlign={legendPos} />}
                {activeFields.map((field) => {
                  const idx = currentSource.valueFields.indexOf(field)
                  const sc = getSeriesConfig(field, idx)
                  return (
                    <Radar
                      key={field}
                      name={field}
                      dataKey={field}
                      stroke={sc.stroke ?? sc.color}
                      fill={sc.color}
                      fillOpacity={sc.fillOpacity}
                      strokeWidth={sc.strokeWidth}
                      dot={sc.dot ? { r: sc.dotRadius } : false}
                      activeDot={sc.activeDot}
                      connectNulls={sc.connectNulls}
                      legendType={sc.legendType}
                      isAnimationActive={isAnimationActive}
                      animationBegin={animationBegin}
                      animationDuration={animationDuration}
                      animationEasing={animationEasing}
                    >
                      {sc.showLabel && (
                        <LabelList dataKey={field} position={labelPosition} fontSize={11} />
                      )}
                    </Radar>
                  )
                })}
              </RadarChart>
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
                <TabsTrigger value="radar">Radar</TabsTrigger>
                <TabsTrigger value="series">Series</TabsTrigger>
                <TabsTrigger value="grid">Grid</TabsTrigger>
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
                      {Object.entries(radarDataSources).map(([key, src]) => (
                        <SelectItem key={key} value={key}>{src.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Category: <strong>{currentSource.categoryField}</strong> ({currentSource.data.length} dimensions)
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Series (Value Fields)</Label>
                    <button
                      className="text-xs text-primary hover:underline"
                      onClick={() => {
                        const allOn: Record<string, boolean> = {}
                        currentSource.valueFields.forEach((f) => { allOn[f] = true })
                        setEnabledSeries(allOn)
                      }}
                    >
                      Enable all
                    </button>
                  </div>
                  <div className="grid gap-2">
                    {currentSource.valueFields.map((field, idx) => {
                      const enabled = enabledSeries[field] !== false
                      return (
                        <button
                          key={field}
                          className={`flex items-center gap-2 rounded border p-2 text-left transition hover:border-primary ${enabled ? 'bg-muted/50' : 'opacity-50'}`}
                          onClick={() =>
                            setEnabledSeries((prev) => ({
                              ...prev,
                              [field]: !(prev[field] !== false),
                            }))
                          }
                        >
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: enabled ? colorPalette[idx % colorPalette.length] : '#9ca3af' }}
                          />
                          <span className="text-sm font-medium">{field}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Dimensions</p>
                  {currentSource.data.map((item) => (
                    <div key={String(item[currentSource.categoryField])} className="flex items-center justify-between text-sm">
                      <span>{String(item[currentSource.categoryField])}</span>
                      <span className="text-xs text-muted-foreground">max: {currentSource.maxValue}</span>
                    </div>
                  ))}
                </div>
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

                {/* Center & Radius */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Chart Position</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 text-xs text-muted-foreground">cx</span>
                      <Input type="text" value={cx} onChange={(e) => setCx(e.target.value)} placeholder="50%" className="h-8" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8 text-xs text-muted-foreground">cy</span>
                      <Input type="text" value={cy} onChange={(e) => setCy(e.target.value)} placeholder="50%" className="h-8" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Center position (% or px)</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-xs text-muted-foreground">Inner R</span>
                    <Input type="number" value={innerRadius} onChange={(e) => setInnerRadius(Number(e.target.value) || 0)} min={0} className="h-8" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-xs text-muted-foreground">Outer R</span>
                    <Input type="text" value={outerRadius} onChange={(e) => setOuterRadius(e.target.value)} placeholder="80%" className="h-8" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Inner radius &gt; 0 creates a donut-like shape</p>

                <Separator />

                {/* Angles */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Start / End Angle</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-10 text-xs text-muted-foreground">Start</span>
                      <Input type="number" value={startAngle} onChange={(e) => setStartAngle(Number(e.target.value))} className="h-8" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-10 text-xs text-muted-foreground">End</span>
                      <Input type="number" value={endAngle} onChange={(e) => setEndAngle(Number(e.target.value))} className="h-8" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Default: 90 to -270 (full circle, top start)</p>
                  <div className="flex gap-1">
                    <button className="rounded border px-2 py-1 text-xs" onClick={() => { setStartAngle(90); setEndAngle(-270) }}>Full (default)</button>
                    <button className="rounded border px-2 py-1 text-xs" onClick={() => { setStartAngle(90); setEndAngle(90 - 180) }}>Half (top)</button>
                    <button className="rounded border px-2 py-1 text-xs" onClick={() => { setStartAngle(0); setEndAngle(360) }}>CW from right</button>
                  </div>
                </div>

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
                        <Input type="number" value={margin[side]} onChange={(e) => setMargin((p) => ({ ...p, [side]: Number(e.target.value) || 0 }))} className="h-8" />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Animation */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Animation</Label>
                    <p className="text-xs text-muted-foreground">Animate radar appearance</p>
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

              {/* ─── Tab: Radar (global defaults) ───────────────────── */}
              <TabsContent value="radar" className="space-y-4 pt-4">
                <p className="text-xs text-muted-foreground">Global defaults for all Radar series. Override per-series in Series tab.</p>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Fill Opacity</Label>
                    <p className="text-xs text-muted-foreground">0 = outline only, 1 = solid</p>
                  </div>
                  <Input type="number" value={globalFillOpacity} onChange={(e) => setGlobalFillOpacity(Math.min(1, Math.max(0, Number(e.target.value) || 0)))} min={0} max={1} step={0.1} className="w-20 h-8" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Stroke Width</Label>
                    <p className="text-xs text-muted-foreground">Border line thickness</p>
                  </div>
                  <Input type="number" value={globalStrokeWidth} onChange={(e) => setGlobalStrokeWidth(Number(e.target.value) || 1)} min={0} max={8} className="w-20 h-8" />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Dots</Label>
                    <p className="text-xs text-muted-foreground">Data point markers</p>
                  </div>
                  <Switch checked={globalDot} onCheckedChange={setGlobalDot} />
                </div>
                {globalDot && (
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-sm">Dot Radius</span>
                    <Input type="number" value={globalDotRadius} onChange={(e) => setGlobalDotRadius(Number(e.target.value) || 3)} min={1} max={12} className="w-20 h-8" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Active Dot</Label>
                    <p className="text-xs text-muted-foreground">Highlight on hover</p>
                  </div>
                  <Switch checked={globalActiveDot} onCheckedChange={setGlobalActiveDot} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Legend Icon</Label>
                    <p className="text-xs text-muted-foreground">Icon shape in legend</p>
                  </div>
                  <Select value={globalLegendType} onValueChange={(v) => setGlobalLegendType(v as LegendTypeOption)}>
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

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Labels</Label>
                    <p className="text-xs text-muted-foreground">{'<LabelList />'} on data points</p>
                  </div>
                  <Switch checked={globalShowLabels} onCheckedChange={setGlobalShowLabels} />
                </div>
                {globalShowLabels && (
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
                )}
              </TabsContent>

              {/* ─── Tab: Series (per-series) ───────────────────────── */}
              <TabsContent value="series" className="space-y-4 pt-4">
                <p className="text-xs text-muted-foreground">Override defaults for each series independently.</p>
                {activeFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No series enabled. Go to Data tab to select fields.</p>
                ) : (
                  activeFields.map((field) => {
                    const idx = currentSource.valueFields.indexOf(field)
                    const sc = getSeriesConfig(field, idx)
                    return (
                      <div
                        key={field}
                        className="space-y-3 rounded-lg border p-3"
                        style={{ borderLeftColor: sc.color, borderLeftWidth: 4 }}
                      >
                        <Label className="text-sm font-medium">{field}</Label>

                        {/* Color */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Color</span>
                            <input
                              type="color"
                              value={sc.color}
                              onChange={(e) => updateSeriesConfig(field, 'color', e.target.value)}
                              className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                            />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {colorPalette.map((c) => (
                              <button
                                key={c}
                                className={`h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 ${sc.color === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: c }}
                                onClick={() => updateSeriesConfig(field, 'color', c)}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Fill Opacity */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Fill Opacity</span>
                          <Input type="number" value={seriesConfigs[field]?.fillOpacity ?? ''} onChange={(e) => updateSeriesConfig(field, 'fillOpacity', e.target.value ? Number(e.target.value) : undefined)} placeholder="inherit" min={0} max={1} step={0.1} className="w-20 h-8" />
                        </div>

                        {/* Stroke Width */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Stroke Width</span>
                          <Input type="number" value={seriesConfigs[field]?.strokeWidth ?? ''} onChange={(e) => updateSeriesConfig(field, 'strokeWidth', e.target.value ? Number(e.target.value) : undefined)} placeholder="inherit" min={0} max={8} className="w-20 h-8" />
                        </div>

                        {/* Custom Stroke Color */}
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Stroke Color (override)</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={seriesConfigs[field]?.stroke || sc.color}
                              onChange={(e) => updateSeriesConfig(field, 'stroke', e.target.value)}
                              className="h-6 w-8 cursor-pointer rounded border-0 p-0"
                            />
                            <Input type="text" value={seriesConfigs[field]?.stroke ?? ''} onChange={(e) => updateSeriesConfig(field, 'stroke', e.target.value || undefined)} placeholder="same as fill" className="flex-1 h-8" />
                          </div>
                        </div>

                        {/* Dot */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Dots</span>
                          <Switch checked={sc.dot ?? globalDot} onCheckedChange={(v) => updateSeriesConfig(field, 'dot', v)} />
                        </div>
                        {sc.dot && (
                          <div className="flex items-center justify-between pl-2">
                            <span className="text-xs text-muted-foreground">Radius</span>
                            <Input type="number" value={seriesConfigs[field]?.dotRadius ?? ''} onChange={(e) => updateSeriesConfig(field, 'dotRadius', e.target.value ? Number(e.target.value) : undefined)} placeholder="inherit" min={1} max={12} className="w-20 h-8" />
                          </div>
                        )}

                        {/* Active Dot */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Active Dot</span>
                          <Switch checked={sc.activeDot ?? globalActiveDot} onCheckedChange={(v) => updateSeriesConfig(field, 'activeDot', v)} />
                        </div>

                        {/* Connect Nulls */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Connect Nulls</span>
                          <Switch checked={sc.connectNulls ?? false} onCheckedChange={(v) => updateSeriesConfig(field, 'connectNulls', v)} />
                        </div>

                        {/* Label */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Label</span>
                          <Switch checked={sc.showLabel ?? globalShowLabels} onCheckedChange={(v) => updateSeriesConfig(field, 'showLabel', v)} />
                        </div>

                        {/* Legend Type */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Legend Icon</span>
                          <Select value={seriesConfigs[field]?.legendType ?? '__inherit__'} onValueChange={(v) => updateSeriesConfig(field, 'legendType', v === '__inherit__' ? undefined : v)}>
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
                      </div>
                    )
                  })
                )}
              </TabsContent>

              {/* ─── Tab: Grid & Axes ───────────────────────────────── */}
              <TabsContent value="grid" className="space-y-4 pt-4">
                {/* PolarGrid */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Polar Grid</Label>
                    <p className="text-xs text-muted-foreground">{'<PolarGrid />'}</p>
                  </div>
                  <Switch checked={showPolarGrid} onCheckedChange={setShowPolarGrid} />
                </div>
                {showPolarGrid && (
                  <>
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">Grid Type</Label>
                      <div className="flex gap-2">
                        {(['polygon', 'circle'] as const).map((t) => (
                          <button
                            key={t}
                            className={`px-3 py-1 text-sm rounded ${gridType === t ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                            onClick={() => setGridType(t)}
                          >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Radial Lines</span>
                      <Switch checked={radialLines} onCheckedChange={setRadialLines} />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Inner Radius</span>
                      <Input type="number" value={gridInnerRadius ?? ''} onChange={(e) => setGridInnerRadius(e.target.value ? Number(e.target.value) : undefined)} placeholder="auto" min={0} className="w-20 h-8" />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Outer Radius</span>
                      <Input type="number" value={gridOuterRadius ?? ''} onChange={(e) => setGridOuterRadius(e.target.value ? Number(e.target.value) : undefined)} placeholder="auto" min={0} className="w-20 h-8" />
                    </div>
                  </>
                )}

                <Separator />

                {/* PolarAngleAxis */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Angle Axis (labels)</Label>
                    <p className="text-xs text-muted-foreground">{'<PolarAngleAxis />'}</p>
                  </div>
                  <Switch checked={showAngleAxis} onCheckedChange={setShowAngleAxis} />
                </div>
                {showAngleAxis && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Orientation</span>
                      <Select value={angleAxisOrientation} onValueChange={(v) => setAngleAxisOrientation(v as 'inner' | 'outer')}>
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="outer">Outer</SelectItem>
                          <SelectItem value="inner">Inner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Axis Line</span>
                      <Switch checked={angleAxisLine} onCheckedChange={setAngleAxisLine} />
                    </div>
                    {angleAxisLine && (
                      <div className="flex items-center justify-between pl-8">
                        <span className="text-sm">Line Type</span>
                        <Select value={angleAxisLineType} onValueChange={(v) => setAngleAxisLineType(v as 'polygon' | 'circle')}>
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="polygon">Polygon</SelectItem>
                            <SelectItem value="circle">Circle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Tick Line</span>
                      <Switch checked={angleTickLine} onCheckedChange={setAngleTickLine} />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Tick Size</span>
                      <Input type="number" value={angleTickSize} onChange={(e) => setAngleTickSize(Number(e.target.value) || 8)} min={0} max={30} className="w-20 h-8" />
                    </div>
                  </>
                )}

                <Separator />

                {/* PolarRadiusAxis */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Radius Axis (scale)</Label>
                    <p className="text-xs text-muted-foreground">{'<PolarRadiusAxis />'}</p>
                  </div>
                  <Switch checked={showRadiusAxis} onCheckedChange={setShowRadiusAxis} />
                </div>
                {showRadiusAxis && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Angle</span>
                      <Input type="number" value={radiusAxisAngle} onChange={(e) => setRadiusAxisAngle(Number(e.target.value))} className="w-20 h-8" />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Orientation</span>
                      <Select value={radiusAxisOrientation} onValueChange={(v) => setRadiusAxisOrientation(v as 'left' | 'right' | 'middle')}>
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm">Domain</Label>
                      <Select value={radiusAxisDomain} onValueChange={(v) => setRadiusAxisDomain(v as 'auto' | 'fixed')}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">auto</SelectItem>
                          <SelectItem value="fixed">Fixed [0, max]</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {radiusAxisDomain === 'fixed' && (
                      <div className="flex items-center justify-between pl-4">
                        <span className="text-sm">Max Value</span>
                        <Input type="number" value={radiusAxisDomainMax} onChange={(e) => setRadiusAxisDomainMax(Number(e.target.value) || 100)} min={1} className="w-20 h-8" />
                      </div>
                    )}
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Tick Count</span>
                      <Input type="number" value={radiusAxisTickCount} onChange={(e) => setRadiusAxisTickCount(Number(e.target.value) || 5)} min={2} max={20} className="w-20 h-8" />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Show Ticks</span>
                      <Switch checked={radiusAxisTick} onCheckedChange={setRadiusAxisTick} />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Reversed</span>
                      <Switch checked={radiusAxisReversed} onCheckedChange={setRadiusAxisReversed} />
                    </div>
                  </>
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
            {currentSource.name} — {currentSource.data.length} dimensions, {activeFields.length} series
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
            <CardDescription>Required data structure for RadarChart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              <code>{`// Categories with multiple value fields
const data = [
  { subject: 'Math', Alice: 120, Bob: 110, max: 150 },
  { subject: 'English', Alice: 86, Bob: 130, max: 150 },
  { subject: 'Physics', Alice: 85, Bob: 90, max: 150 },
  { subject: 'History', Alice: 65, Bob: 85, max: 150 },
]

// ChartConfig for tooltips & legend
const config: ChartConfig = {
  Alice: { label: "Alice", color: "#4169e1" },
  Bob:   { label: "Bob",   color: "#2db89a" },
}`}</code>
            </pre>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Category field</strong> - Labels around the edge (PolarAngleAxis dataKey)</li>
                <li><strong>Value fields</strong> - One per Radar series</li>
                <li><strong>5-8 categories</strong> - Ideal number for readability</li>
                <li><strong>Same scale</strong> - All values should be comparable</li>
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
              <p className="font-medium mb-1">Radar Component</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">fill / fillOpacity</code> - Area color and transparency</li>
                <li><code className="text-xs">stroke / strokeWidth</code> - Border color and thickness</li>
                <li><code className="text-xs">dot</code> - Data point markers (radius configurable)</li>
                <li><code className="text-xs">activeDot</code> - Highlight on hover</li>
                <li><code className="text-xs">connectNulls</code> - Bridge gaps in data</li>
                <li><code className="text-xs">legendType</code> - Icon shape in legend</li>
                <li><code className="text-xs">label / LabelList</code> - Data labels on points</li>
                <li><code className="text-xs">isAnimationActive</code> - Enable/disable animation</li>
                <li><code className="text-xs">animationBegin / Duration / Easing</code> - Animation timing</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">RadarChart Container</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">cx / cy</code> - Center position (% or px)</li>
                <li><code className="text-xs">innerRadius / outerRadius</code> - Size control</li>
                <li><code className="text-xs">startAngle / endAngle</code> - Rotation and arc</li>
                <li><code className="text-xs">margin</code> - Chart padding</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Polar Elements</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">PolarGrid</code> - gridType (polygon/circle), radialLines, inner/outerRadius</li>
                <li><code className="text-xs">PolarAngleAxis</code> - orientation (inner/outer), axisLine, axisLineType, tickLine, tickSize</li>
                <li><code className="text-xs">PolarRadiusAxis</code> - angle, orientation, domain, tickCount, tick, reversed</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitations</CardTitle>
            <CardDescription>What RadarChart cannot do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Max 3-4 series</strong> - More causes overlap and confusion</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Poor for precise values</strong> - Hard to read exact numbers from radial position</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Area distortion</strong> - Outer categories appear visually larger</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No negative values</strong> - Does not handle values below 0</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Category order matters</strong> - Different orderings change shape perception</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No reference lines</strong> - Cannot add threshold lines like cartesian charts</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Practices & Use Cases</CardTitle>
            <CardDescription>When and how to use RadarChart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Ideal For:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Skill/competency comparisons</li>
                <li>Product feature comparisons</li>
                <li>Performance metrics (balanced scorecard)</li>
                <li>Survey results across dimensions</li>
                <li>Game character stats</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Avoid When:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Precise value comparisons needed - Use BarChart</li>
                <li>Time series data - Use LineChart</li>
                <li>Many categories (10+) - Use BarChart or table</li>
                <li>Very different scales per category</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Tips:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Use fillOpacity 0.2-0.4 for overlapping series</li>
                <li>Order categories logically, not alphabetically</li>
                <li>Include a reference series (e.g. &quot;ideal&quot;) with dashed stroke</li>
                <li>Enable PolarRadiusAxis for value scale context</li>
                <li>Use innerRadius &gt; 0 for a spider-ring style</li>
                <li>Keep the same scale across all dimensions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Understanding Cards ────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Polar Coordinate System</CardTitle>
          <CardDescription>How RadarChart maps data to visual elements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="font-medium">PolarAngleAxis</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Role:</strong> Category labels around the perimeter</li>
                <li><strong>dataKey:</strong> The category field name</li>
                <li><strong>orientation:</strong> inner or outer placement</li>
                <li><strong>axisLine:</strong> Outer polygon/circle border</li>
                <li><strong>axisLineType:</strong> polygon or circle shape</li>
                <li><strong>tickLine:</strong> Small marks at label positions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">PolarRadiusAxis</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Role:</strong> Value scale from center to edge</li>
                <li><strong>angle:</strong> Which direction the axis points</li>
                <li><strong>domain:</strong> Value range [0, max]</li>
                <li><strong>tickCount:</strong> Number of scale divisions</li>
                <li><strong>orientation:</strong> Tick label placement</li>
                <li><strong>reversed:</strong> Flip min/max direction</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">PolarGrid</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Role:</strong> Background grid reference</li>
                <li><strong>gridType:</strong> polygon or circle concentric shapes</li>
                <li><strong>radialLines:</strong> Lines from center to each category</li>
                <li><strong>inner/outerRadius:</strong> Override grid extent</li>
              </ul>
            </div>
          </div>
          <Separator />
          <div className="rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-3 text-xs text-muted-foreground">
            <p><strong className="text-blue-700 dark:text-blue-400">Tip:</strong> The RadarChart defaults to startAngle=90 (top) and endAngle=-270 (full clockwise). Change these to create half-radars or rotate the starting position. Use innerRadius &gt; 0 to create a ring/donut radar effect.</p>
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
                <li>Fill opacity per series</li>
                <li>Stroke color and width per series</li>
                <li>Dot toggle and radius per series</li>
                <li>Active dot per series</li>
                <li>Connect nulls per series</li>
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
                <li>Data source and field selection</li>
                <li>Chart position (cx, cy), radius (inner, outer)</li>
                <li>Start/end angles</li>
                <li>Margins</li>
                <li>Default fill opacity, stroke width, dots, active dot</li>
                <li>Default legend icon type</li>
                <li>Label position</li>
                <li>Animation (enabled, delay, duration, easing)</li>
                <li>Tooltip (indicator), Legend (position)</li>
                <li>PolarGrid (type, radialLines, radius)</li>
                <li>PolarAngleAxis (orientation, axisLine, tickLine, tickSize)</li>
                <li>PolarRadiusAxis (angle, orientation, domain, tickCount, reversed)</li>
              </ul>
            </div>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">Per-series settings override the global defaults from the Radar tab. If a per-series value is not set, it inherits from the global setting.</p>
        </CardContent>
      </Card>
    </div>
  )
}
