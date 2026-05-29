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
import { Treemap } from 'recharts'
// colors managed via colorPalette constant

// ─── Types ───────────────────────────────────────────────────────────────────

interface TreemapItem {
  name: string
  children?: TreemapItem[]
  [key: string]: unknown
}

interface TreemapDataSource {
  name: string
  data: TreemapItem[]
  dataKey: string
  nameKey: string
  description: string
}

interface CategoryConfig {
  color?: string
  hidden?: boolean
}

// Content renderer props from recharts TreemapNode
interface ContentProps {
  x: number
  y: number
  width: number
  height: number
  name: string
  depth: number
  index: number
  value: number
  children: unknown[] | null
  parent?: { index: number; name: string }
  root?: { value: number }
  [k: string]: unknown
}

// ─── Data Sources ────────────────────────────────────────────────────────────

const treemapDataSources: Record<string, TreemapDataSource> = {
  techStack: {
    name: 'Tech Stack',
    data: [
      {
        name: 'Frontend',
        children: [
          { name: 'React', size: 3000 },
          { name: 'Vue', size: 2000 },
          { name: 'Angular', size: 1500 },
          { name: 'Svelte', size: 800 },
        ],
      },
      {
        name: 'Backend',
        children: [
          { name: 'Node.js', size: 2500 },
          { name: 'Python', size: 2200 },
          { name: 'Go', size: 1200 },
          { name: 'Rust', size: 600 },
        ],
      },
      {
        name: 'Database',
        children: [
          { name: 'PostgreSQL', size: 1800 },
          { name: 'MongoDB', size: 1400 },
          { name: 'Redis', size: 900 },
        ],
      },
      {
        name: 'DevOps',
        children: [
          { name: 'Docker', size: 1600 },
          { name: 'Kubernetes', size: 1400 },
          { name: 'AWS', size: 1200 },
        ],
      },
    ],
    dataKey: 'size',
    nameKey: 'name',
    description: 'Technology categories with popularity scores',
  },
  diskUsage: {
    name: 'Disk Usage',
    data: [
      {
        name: 'Documents',
        children: [
          { name: 'PDFs', size: 4200 },
          { name: 'Spreadsheets', size: 2800 },
          { name: 'Presentations', size: 1600 },
          { name: 'Text Files', size: 400 },
        ],
      },
      {
        name: 'Media',
        children: [
          { name: 'Photos', size: 8500 },
          { name: 'Videos', size: 12000 },
          { name: 'Music', size: 3200 },
        ],
      },
      {
        name: 'Applications',
        children: [
          { name: 'IDEs', size: 5600 },
          { name: 'Browsers', size: 2100 },
          { name: 'Utilities', size: 800 },
        ],
      },
      {
        name: 'System',
        children: [
          { name: 'OS Files', size: 15000 },
          { name: 'Cache', size: 3400 },
          { name: 'Logs', size: 1200 },
        ],
      },
    ],
    dataKey: 'size',
    nameKey: 'name',
    description: 'File system usage breakdown in MB',
  },
  budget: {
    name: 'Company Budget',
    data: [
      {
        name: 'Engineering',
        children: [
          { name: 'Salaries', size: 45000 },
          { name: 'Tools & Licenses', size: 8000 },
          { name: 'Cloud Infra', size: 12000 },
          { name: 'Training', size: 3000 },
        ],
      },
      {
        name: 'Marketing',
        children: [
          { name: 'Advertising', size: 15000 },
          { name: 'Events', size: 8000 },
          { name: 'Content', size: 5000 },
        ],
      },
      {
        name: 'Sales',
        children: [
          { name: 'Salaries', size: 25000 },
          { name: 'Travel', size: 6000 },
          { name: 'CRM', size: 3000 },
        ],
      },
      {
        name: 'Operations',
        children: [
          { name: 'Office', size: 10000 },
          { name: 'HR', size: 4000 },
          { name: 'Legal', size: 3000 },
        ],
      },
    ],
    dataKey: 'size',
    nameKey: 'name',
    description: 'Annual budget allocation in $K',
  },
  portfolio: {
    name: 'Investment Portfolio',
    data: [
      {
        name: 'Equities',
        children: [
          { name: 'US Large Cap', size: 35000 },
          { name: 'US Small Cap', size: 10000 },
          { name: 'International', size: 15000 },
          { name: 'Emerging Mkts', size: 8000 },
        ],
      },
      {
        name: 'Fixed Income',
        children: [
          { name: 'Gov Bonds', size: 12000 },
          { name: 'Corp Bonds', size: 8000 },
          { name: 'High Yield', size: 4000 },
        ],
      },
      {
        name: 'Alternatives',
        children: [
          { name: 'Real Estate', size: 6000 },
          { name: 'Commodities', size: 3000 },
          { name: 'Crypto', size: 2000 },
        ],
      },
    ],
    dataKey: 'size',
    nameKey: 'name',
    description: 'Portfolio allocation in $K',
  },
}

type DataSourceKey = keyof typeof treemapDataSources

// ─── Constants ───────────────────────────────────────────────────────────────

const colorPalette = [
  '#4169e1', '#2db89a', '#d946ef', '#ef5350', '#d4c92a',
  '#38bdf8', '#a57c52', '#7c3aed', '#9ca3af', '#93c5fd',
]

const indicatorTypes = [
  { value: 'dot', label: 'dot - Small square' },
  { value: 'line', label: 'line - Vertical bar' },
  { value: 'dashed', label: 'dashed - Dashed line' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function TreemapChartPlayground() {
  // ── Data tab state ──────────────────────────────────────────────────────
  const [dataSource, setDataSource] = React.useState<DataSourceKey>('techStack')
  const currentSource = treemapDataSources[dataSource]
  const [categoryConfigs, setCategoryConfigs] = React.useState<Record<string, CategoryConfig>>({})

  // Reset on data source change
  React.useEffect(() => {
    setCategoryConfigs({})
  }, [dataSource])

  const updateCategoryConfig = (catName: string, key: string, value: unknown) => {
    setCategoryConfigs((prev) => ({
      ...prev,
      [catName]: { ...prev[catName], [key]: value },
    }))
  }

  const getCategoryColor = (catName: string, idx: number): string => {
    return categoryConfigs[catName]?.color ?? colorPalette[idx % colorPalette.length]
  }

  // ── Treemap tab state ───────────────────────────────────────────────────
  const [treemapType, setTreemapType] = React.useState<'flat' | 'nest'>('flat')
  const [aspectRatio, setAspectRatio] = React.useState(4 / 3)
  const [fill, setFill] = React.useState('#8884d8')
  const [stroke, setStroke] = React.useState('#ffffff')
  const [strokeWidth, setStrokeWidth] = React.useState(2)

  // Content / Labels
  const [showLabels, setShowLabels] = React.useState(true)
  const [labelMinWidth, setLabelMinWidth] = React.useState(50)
  const [labelMinHeight, setLabelMinHeight] = React.useState(30)
  const [labelContent, setLabelContent] = React.useState<'name' | 'value' | 'name-value' | 'percent'>('name')
  const [categoryFontSize, setCategoryFontSize] = React.useState(14)
  const [leafFontSize, setLeafFontSize] = React.useState(11)
  const [labelColor, setLabelColor] = React.useState('#ffffff')

  // Depth styling
  const [leafOpacity, setLeafOpacity] = React.useState(0.7)
  const [showCategoryLabels, setShowCategoryLabels] = React.useState(false)

  // Animation
  const [isAnimationActive, setIsAnimationActive] = React.useState(true)
  const [isUpdateAnimationActive, setIsUpdateAnimationActive] = React.useState(true)
  const [animationDuration, setAnimationDuration] = React.useState(1500)
  const [animationBegin, setAnimationBegin] = React.useState(0)
  const [animationEasing, setAnimationEasing] = React.useState<'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'>('linear')

  // ── Chart tab state ─────────────────────────────────────────────────────
  const [showTooltip, setShowTooltip] = React.useState(true)
  const [tooltipIndicator, setTooltipIndicator] = React.useState<'dot' | 'line' | 'dashed'>('dot')

  // ── Derived ─────────────────────────────────────────────────────────────

  const visibleData = React.useMemo(() => {
    return currentSource.data.filter((cat) => !categoryConfigs[cat.name]?.hidden)
  }, [currentSource.data, categoryConfigs])

  const totalValue = React.useMemo(() => {
    let total = 0
    visibleData.forEach((cat) => {
      cat.children?.forEach((child) => {
        total += (child[currentSource.dataKey] as number) ?? 0
      })
    })
    return total
  }, [visibleData, currentSource.dataKey])

  const config = React.useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {}
    visibleData.forEach((cat, idx) => {
      const key = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      cfg[key] = { label: cat.name, color: getCategoryColor(cat.name, idx) }
    })
    return cfg
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleData, categoryConfigs])

  // ── Custom content renderer ─────────────────────────────────────────────

  const renderContent = React.useCallback(
    (props: ContentProps) => {
      const { x, y, width, height, name, depth, index, value } = props
      const parentIndex = props.parent?.index ?? index
      const catColor = getCategoryColor(
        visibleData[depth === 1 ? index : parentIndex]?.name ?? '',
        depth === 1 ? index : parentIndex,
      )
      const fillOpacity = depth >= 2 ? leafOpacity : 1
      const isCategory = depth === 1
      const canShowLabel = showLabels && width > labelMinWidth && height > labelMinHeight

      const formatLabel = () => {
        const pct = totalValue > 0 ? `${((value / totalValue) * 100).toFixed(1)}%` : '0%'
        switch (labelContent) {
          case 'value': return String((value ?? 0).toLocaleString())
          case 'name-value': return `${name}: ${(value ?? 0).toLocaleString()}`
          case 'percent': return pct
          default: return name
        }
      }

      return (
        <g>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill: catColor,
              fillOpacity,
              stroke,
              strokeWidth,
              strokeOpacity: 1,
            }}
          />
          {canShowLabel && (!isCategory || showCategoryLabels) && (
            <text
              x={x + width / 2}
              y={y + height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={labelColor}
              fontSize={isCategory ? categoryFontSize : leafFontSize}
              fontWeight={isCategory ? 'bold' : 'normal'}
            >
              {formatLabel()}
            </text>
          )}
        </g>
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleData, categoryConfigs, showLabels, labelMinWidth, labelMinHeight, labelContent, categoryFontSize, leafFontSize, labelColor, leafOpacity, showCategoryLabels, stroke, strokeWidth, totalValue],
  )

  // ── Code generation ─────────────────────────────────────────────────────

  const generateCode = () => {
    const lines: string[] = []
    lines.push(`<ChartContainer config={config} className="h-[400px] w-full">`)

    const tp: string[] = ['data={data}', `dataKey="${currentSource.dataKey}"`]
    if (treemapType !== 'flat') tp.push(`type="${treemapType}"`)
    if (aspectRatio !== 4 / 3) tp.push(`aspectRatio={${aspectRatio}}`)
    if (fill !== '#8884d8') tp.push(`fill="${fill}"`)
    if (stroke !== '#ffffff') tp.push(`stroke="${stroke}"`)
    if (!isAnimationActive) tp.push('isAnimationActive={false}')
    if (!isUpdateAnimationActive) tp.push('isUpdateAnimationActive={false}')
    if (animationBegin !== 0) tp.push(`animationBegin={${animationBegin}}`)
    if (animationDuration !== 1500) tp.push(`animationDuration={${animationDuration}}`)
    if (animationEasing !== 'linear') tp.push(`animationEasing="${animationEasing}"`)
    tp.push('content={<CustomizedContent />}')

    lines.push(`  <Treemap ${tp.join(' ')}>`)

    if (showTooltip) {
      lines.push(`    <ChartTooltip content={<ChartTooltipContent indicator="${tooltipIndicator}" />} />`)
    }

    lines.push(`  </Treemap>`)
    lines.push(`</ChartContainer>`)
    return lines.join('\n')
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">TreemapChart Playground</h2>
        <p className="text-muted-foreground">
          Hierarchical data as nested rectangles - great for showing proportions within categories
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
              <Treemap
                data={visibleData}
                dataKey={currentSource.dataKey}
                nameKey={currentSource.nameKey}
                type={treemapType}
                aspectRatio={aspectRatio}
                fill={fill}
                stroke={stroke}
                isAnimationActive={isAnimationActive}
                isUpdateAnimationActive={isUpdateAnimationActive}
                animationBegin={animationBegin}
                animationDuration={animationDuration}
                animationEasing={animationEasing}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                content={renderContent as any}
              >
                {showTooltip && (
                  <ChartTooltip
                    content={(props) => <ChartTooltipContent {...props} indicator={tooltipIndicator} />}
                  />
                )}
              </Treemap>
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
                <TabsTrigger value="treemap">Treemap</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="chart">Chart</TabsTrigger>
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
                      {Object.entries(treemapDataSources).map(([key, src]) => (
                        <SelectItem key={key} value={key}>{src.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{currentSource.description}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Categories ({visibleData.length} of {currentSource.data.length})</p>
                  {currentSource.data.map((cat, idx) => {
                    const hidden = categoryConfigs[cat.name]?.hidden
                    const color = getCategoryColor(cat.name, idx)
                    const catTotal = cat.children?.reduce((sum, c) => sum + ((c[currentSource.dataKey] as number) ?? 0), 0) ?? 0
                    return (
                      <div
                        key={cat.name}
                        className={`rounded-lg border p-3 transition ${hidden ? 'opacity-40' : ''}`}
                        style={{ borderLeftColor: hidden ? '#9ca3af' : color, borderLeftWidth: 4 }}
                      >
                        <div className="flex items-center justify-between">
                          <button className="text-left" onClick={() => updateCategoryConfig(cat.name, 'hidden', !hidden)}>
                            <p className="text-sm font-medium">{cat.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {cat.children?.length ?? 0} items, total: {catTotal.toLocaleString()}
                            </p>
                          </button>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => updateCategoryConfig(cat.name, 'color', e.target.value)}
                              className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
                            />
                          </div>
                        </div>
                        {!hidden && (
                          <div className="mt-2 space-y-1">
                            {cat.children?.map((child) => (
                              <div key={child.name} className="flex justify-between text-xs text-muted-foreground">
                                <span>{child.name}</span>
                                <span>{((child[currentSource.dataKey] as number) ?? 0).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  <p className="text-xs text-muted-foreground">Click a category to hide/show. Use color picker to customize.</p>
                </div>
              </TabsContent>

              {/* ─── Tab: Treemap ───────────────────────────────────── */}
              <TabsContent value="treemap" className="space-y-4 pt-4">
                {/* Type */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <p className="text-xs text-muted-foreground">Flat shows all; Nest allows drill-down</p>
                  </div>
                  <Select value={treemapType} onValueChange={(v) => setTreemapType(v as 'flat' | 'nest')}>
                    <SelectTrigger className="w-24 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="nest">Nest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Aspect Ratio */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Aspect Ratio</Label>
                      <p className="text-xs text-muted-foreground">Preferred rectangle shape ({aspectRatio.toFixed(2)})</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { label: '1:1', value: 1 },
                      { label: '4:3', value: 4 / 3 },
                      { label: '16:9', value: 16 / 9 },
                      { label: '2:1', value: 2 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        className={`px-2 py-1 text-xs rounded ${Math.abs(aspectRatio - preset.value) < 0.01 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                        onClick={() => setAspectRatio(preset.value)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(Math.max(0.1, Number(e.target.value) || 1.33))}
                    step={0.1}
                    min={0.1}
                    max={5}
                    className="h-8"
                  />
                </div>

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
                          {['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'].map((e) => (
                            <SelectItem key={e} value={e}>{e}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Separator />

                {/* Update Animation */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Update Animation</Label>
                    <p className="text-xs text-muted-foreground">Animate when data changes</p>
                  </div>
                  <Switch checked={isUpdateAnimationActive} onCheckedChange={setIsUpdateAnimationActive} />
                </div>
              </TabsContent>

              {/* ─── Tab: Style ─────────────────────────────────────── */}
              <TabsContent value="style" className="space-y-4 pt-4">
                {/* Fill */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Default Fill</Label>
                  <p className="text-xs text-muted-foreground">Fallback color when content renderer is not used</p>
                  <div className="flex items-center gap-2">
                    <input type="color" value={fill} onChange={(e) => setFill(e.target.value)} className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                    <Input type="text" value={fill} onChange={(e) => setFill(e.target.value)} className="flex-1 h-8" />
                  </div>
                </div>

                <Separator />

                {/* Stroke */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Stroke (border)</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={stroke} onChange={(e) => setStroke(e.target.value)} className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                    <Input type="text" value={stroke} onChange={(e) => setStroke(e.target.value)} className="flex-1 h-8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Width</span>
                    <Input type="number" value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value) || 0)} min={0} max={10} className="w-20 h-8" />
                  </div>
                </div>

                <Separator />

                {/* Leaf Opacity */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Leaf Opacity</Label>
                    <p className="text-xs text-muted-foreground">Opacity for child/leaf rectangles ({leafOpacity})</p>
                  </div>
                  <Input type="number" value={leafOpacity} onChange={(e) => setLeafOpacity(Math.min(1, Math.max(0, Number(e.target.value) || 0.7)))} step={0.1} min={0} max={1} className="w-20 h-8" />
                </div>

                <Separator />

                {/* Labels */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Labels</Label>
                    <p className="text-xs text-muted-foreground">Text inside rectangles</p>
                  </div>
                  <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                </div>
                {showLabels && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Content</span>
                      <Select value={labelContent} onValueChange={(v) => setLabelContent(v as typeof labelContent)}>
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name only</SelectItem>
                          <SelectItem value="value">Value only</SelectItem>
                          <SelectItem value="name-value">Name: Value</SelectItem>
                          <SelectItem value="percent">Percent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Min Width (px)</span>
                      <Input type="number" value={labelMinWidth} onChange={(e) => setLabelMinWidth(Number(e.target.value) || 30)} min={10} max={200} className="w-20 h-8" />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Min Height (px)</span>
                      <Input type="number" value={labelMinHeight} onChange={(e) => setLabelMinHeight(Number(e.target.value) || 20)} min={10} max={200} className="w-20 h-8" />
                    </div>
                    <div className="space-y-1 pl-4">
                      <span className="text-sm">Text Color</span>
                      <div className="flex items-center gap-2">
                        <input type="color" value={labelColor} onChange={(e) => setLabelColor(e.target.value)} className="h-6 w-8 cursor-pointer rounded border-0 p-0" />
                        <Input type="text" value={labelColor} onChange={(e) => setLabelColor(e.target.value)} className="flex-1 h-8" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Category Font Size</span>
                      <Input type="number" value={categoryFontSize} onChange={(e) => setCategoryFontSize(Number(e.target.value) || 14)} min={8} max={24} className="w-20 h-8" />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-sm">Leaf Font Size</span>
                      <Input type="number" value={leafFontSize} onChange={(e) => setLeafFontSize(Number(e.target.value) || 11)} min={8} max={24} className="w-20 h-8" />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between pl-4">
                      <div>
                        <span className="text-sm">Category Labels</span>
                        <p className="text-xs text-muted-foreground">Show text on depth-1 (parent) rects</p>
                      </div>
                      <Switch checked={showCategoryLabels} onCheckedChange={setShowCategoryLabels} />
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

                <div className="rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-3 text-xs text-muted-foreground">
                  <p><strong className="text-blue-700 dark:text-blue-400">Note:</strong> Treemap does not support Legend or standard axis components. Color coding is managed via the custom content renderer. Use the Data tab to customize per-category colors.</p>
                </div>
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
            {currentSource.name} — {visibleData.length} categories, total value: {totalValue.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm max-h-64">
            <code>{JSON.stringify(visibleData, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>

      {/* ── Documentation ──────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Data Format</CardTitle>
            <CardDescription>Required data structure for Treemap</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              <code>{`// Hierarchical nested structure
const data = [
  {
    name: 'Frontend',
    children: [
      { name: 'React', size: 3000 },
      { name: 'Vue',   size: 2000 },
    ],
  },
  {
    name: 'Backend',
    children: [
      { name: 'Node.js', size: 2500 },
    ],
  },
]

// ChartConfig for tooltip styling
const config: ChartConfig = {
  frontend: { label: "Frontend", color: "#4169e1" },
  backend:  { label: "Backend",  color: "#2db89a" },
}`}</code>
            </pre>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>name</strong> (or nameKey) - Label for each rectangle</li>
                <li><strong>size/value</strong> (dataKey) - Numeric value for leaf nodes</li>
                <li><strong>children</strong> - Array of nested items (1-2 levels ideal)</li>
                <li><strong>Positive values</strong> - All leaf sizes must be &gt; 0</li>
                <li><strong>Flat data also works</strong> - Array of items without children</li>
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
              <p className="font-medium mb-1">Treemap Component</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">dataKey</code> - Field for rectangle size (default &quot;value&quot;)</li>
                <li><code className="text-xs">nameKey</code> - Field for rectangle label (default &quot;name&quot;)</li>
                <li><code className="text-xs">type</code> - &quot;flat&quot; (all visible) or &quot;nest&quot; (drill-down)</li>
                <li><code className="text-xs">aspectRatio</code> - Preferred shape of rectangles (default 4/3)</li>
                <li><code className="text-xs">fill</code> - Default fill color</li>
                <li><code className="text-xs">stroke</code> - Border color between rectangles</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Content Renderer</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">content</code> - Custom render function for each rectangle</li>
                <li>Receives: x, y, width, height, name, depth, index, value</li>
                <li>Controls: colors, labels, borders, opacity per rectangle</li>
                <li>Depth 1 = category, depth 2 = leaf item</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Nest Mode</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">nestIndexContent</code> - Custom breadcrumb renderer</li>
                <li><code className="text-xs">colorPanel</code> - Color array for nested levels</li>
                <li>Click a category to zoom in, breadcrumb to go back</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Animation</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">isAnimationActive</code> - Enable/disable initial animation</li>
                <li><code className="text-xs">isUpdateAnimationActive</code> - Animate data changes</li>
                <li><code className="text-xs">animationBegin</code> - Delay in ms (default 0)</li>
                <li><code className="text-xs">animationDuration</code> - Duration in ms (default 1500)</li>
                <li><code className="text-xs">animationEasing</code> - Timing function (default &quot;linear&quot;)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitations</CardTitle>
            <CardDescription>What Treemap cannot do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Deep nesting (3+ levels)</strong> - Becomes very hard to read and interact with</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Many small items</strong> - Labels cannot fit, rectangles become invisible</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No built-in legend</strong> - Color coding must be communicated via custom content or documentation</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No comparison over time</strong> - Shows a single snapshot</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Poor exact value comparison</strong> - Area is harder to compare than length (use BarChart)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>Layout instability</strong> - Adding/removing items reshuffles all rectangles</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Practices & Use Cases</CardTitle>
            <CardDescription>When and how to use Treemap</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Ideal For:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Disk / storage usage visualization</li>
                <li>Portfolio allocation breakdown</li>
                <li>Organizational structure by headcount or budget</li>
                <li>Market share by category</li>
                <li>Content categorization (topics, tags)</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Avoid When:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Comparing exact values - Use BarChart</li>
                <li>Showing hierarchy only (no size) - Use Tree/Org chart</li>
                <li>Time series data - Use LineChart</li>
                <li>Part-of-whole without hierarchy - Use PieChart</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Tips:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Use color to indicate categories, not values</li>
                <li>Limit to 2 levels of nesting maximum</li>
                <li>Group small items into an &quot;Other&quot; category</li>
                <li>Set labelMinWidth/Height to avoid tiny unreadable labels</li>
                <li>Use leaf opacity to distinguish parents from children</li>
                <li>Use nest mode for explorable deep hierarchies</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Understanding Cards ────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Treemap Anatomy</CardTitle>
          <CardDescription>How the squarified layout algorithm works</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="font-medium">Squarify Algorithm</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Items are laid out to fill the available space</li>
                <li>Larger values get proportionally larger rectangles</li>
                <li>aspectRatio controls how square-like rectangles are</li>
                <li>Lower ratio = more elongated, higher = more square</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Depth Levels</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Depth 0:</strong> Root container (the chart)</li>
                <li><strong>Depth 1:</strong> Top-level categories</li>
                <li><strong>Depth 2:</strong> Leaf items within categories</li>
                <li>Use opacity/font to distinguish levels</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Custom Content</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>The <code className="text-xs">content</code> prop replaces default rendering</li>
                <li>Receives TreemapNode with all positioning data</li>
                <li>Return SVG elements (rect, text, g)</li>
                <li>Use depth to apply different styles per level</li>
              </ul>
            </div>
          </div>
          <Separator />
          <div className="rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-3 text-xs text-muted-foreground">
            <p><strong className="text-blue-700 dark:text-blue-400">Tip:</strong> The <code className="text-xs">content</code> prop is the most powerful feature of Treemap. It receives the full TreemapNode including x, y, width, height, depth, name, value, and parent reference. Use depth to apply category colors at depth=1 and lighter shades at depth=2.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flat vs Nest Mode</CardTitle>
          <CardDescription>Two rendering approaches for hierarchical data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium">Flat Mode (default)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>All leaf nodes visible at once</li>
                <li>Hierarchy shown via color grouping</li>
                <li>Best for overview / at-a-glance</li>
                <li>Custom content renderer for styling</li>
                <li>No built-in interaction (click, drill-down)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Nest Mode</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Click a parent to zoom into its children</li>
                <li>Breadcrumb navigation to go back up</li>
                <li>Use <code className="text-xs">nestIndexContent</code> for custom breadcrumbs</li>
                <li>Use <code className="text-xs">colorPanel</code> for level-based colors</li>
                <li>Better for deep or large hierarchies</li>
              </ul>
            </div>
          </div>
          <Separator />
          <div className="rounded border border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-3 text-xs text-muted-foreground">
            <p><strong className="text-amber-700 dark:text-amber-400">Note:</strong> In nest mode, the custom content renderer may behave differently. The breadcrumb navigation is built-in but can be customized with <code className="text-xs">nestIndexContent</code>. Test both modes to see which fits your use case.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
