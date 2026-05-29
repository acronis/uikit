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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@acronis-platform/shadcn-uikit/react'
import {
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import { getChartColors } from '@/lib/chart-colors'

const radialDataSources = {
  browsers: {
    name: 'Browser Share',
    data: [
      { label: 'Chrome', value: 65, users: 2200 },
      { label: 'Safari', value: 50, users: 1200 },
      { label: 'Firefox', value: 35, users: 800 },
      { label: 'Edge', value: 25, users: 600 },
    ],
    nameKeys: ['label'],
    valueKeys: ['value', 'users'],
  },
  devices: {
    name: 'Device Usage',
    data: [
      { device: 'Desktop', share: 58, sessions: 1800 },
      { device: 'Mobile', share: 32, sessions: 1500 },
      { device: 'Tablet', share: 10, sessions: 400 },
    ],
    nameKeys: ['device'],
    valueKeys: ['share', 'sessions'],
  },
  channels: {
    name: 'Acquisition Channels',
    data: [
      { channel: 'Organic', percent: 42, leads: 320 },
      { channel: 'Paid', percent: 28, leads: 260 },
      { channel: 'Email', percent: 18, leads: 140 },
      { channel: 'Referral', percent: 12, leads: 90 },
    ],
    nameKeys: ['channel'],
    valueKeys: ['percent', 'leads'],
  },
}

export function RadialChartPlayground() {
  const palette = getChartColors(8)
  const [dataSource, setDataSource] = React.useState<keyof typeof radialDataSources>('browsers')
  const currentSource = radialDataSources[dataSource]
  const [nameKey, setNameKey] = React.useState(currentSource.nameKeys[0])
  const [selectedValueKeys, setSelectedValueKeys] = React.useState<string[]>([currentSource.valueKeys[0]])
  const [enabledKeys, setEnabledKeys] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    setNameKey(currentSource.nameKeys[0])
    setSelectedValueKeys([currentSource.valueKeys[0]])
    const allOn: Record<string, boolean> = {}
    currentSource.data.forEach((item) => {
      allOn[String(item[currentSource.nameKeys[0]])] = true
    })
    setEnabledKeys(allOn)
  }, [dataSource, currentSource])

  React.useEffect(() => {
    const allOn: Record<string, boolean> = {}
    currentSource.data.forEach((item) => {
      allOn[String(item[nameKey])] = true
    })
    setEnabledKeys(allOn)
  }, [currentSource, nameKey])

  const visibleData = React.useMemo(() => {
    return currentSource.data.filter((item) => enabledKeys[String(item[nameKey])] !== false)
  }, [currentSource.data, enabledKeys, nameKey])

  const dataWithColors = React.useMemo(
    () =>
      visibleData.map((item) => ({
        ...item,
        name: String(item[nameKey]),
      })),
    [visibleData, nameKey]
  )


  // Chart settings state
  const [showTooltip, setShowTooltip] = React.useState(true)
  const [showLegend, setShowLegend] = React.useState(true)
  const [showPolarGrid, setShowPolarGrid] = React.useState(true)
  const [showBackground, setShowBackground] = React.useState(true)
  
  // Radial-specific settings
  const [cx, setCx] = React.useState(50)
  const [cy, setCy] = React.useState(50)
  const [innerRadius, setInnerRadius] = React.useState(30)
  const [outerRadius, setOuterRadius] = React.useState(110)
  const [startAngle, setStartAngle] = React.useState(90)
  const [endAngle, setEndAngle] = React.useState(-180)
  const [minAngle, setMinAngle] = React.useState(0)
  const [clockWise, setClockWise] = React.useState(false)
  const [cornerRadius, setCornerRadius] = React.useState(10)
  const [barSize, setBarSize] = React.useState(10)
  const [barGap, setBarGap] = React.useState(4)
  const [barCategoryGap, setBarCategoryGap] = React.useState(0)
  const [margin, setMargin] = React.useState({ top: 20, right: 20, bottom: 20, left: 20 })
  const [isAnimationActive, setIsAnimationActive] = React.useState(true)
  const [animationDuration, setAnimationDuration] = React.useState(1500)
  const [animationBegin, setAnimationBegin] = React.useState(0)
  const [animationEasing, setAnimationEasing] = React.useState<'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'>('ease')
  const [showLabels, setShowLabels] = React.useState(false)
  const [labelFormatMode, setLabelFormatMode] = React.useState<'value' | 'name-value'>('value')
  const [labelPosition, setLabelPosition] = React.useState<'inside' | 'outside' | 'insideStart' | 'insideEnd'>('inside')

  const renderStartAngle = clockWise ? endAngle : startAngle
  const renderEndAngle = clockWise ? startAngle : endAngle

  const config = React.useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {}
    selectedValueKeys.forEach((key, idx) => {
      cfg[key] = { label: key, color: palette[idx % palette.length] }
    })
    return cfg
  }, [selectedValueKeys, palette])

  // Generate code preview
  const generateCode = () => {
    const lines = []
    lines.push(`<ChartContainer config={config} className="h-[400px]">`)
    lines.push(`  <RadialBarChart`)
    const enabled = Object.entries(enabledKeys).filter(([, v]) => v !== false).map(([k]) => k)
    if (enabled.length !== currentSource.data.length) {
      lines.unshift(`const filteredData = data.filter((d) => ${JSON.stringify(enabled)}.includes(String(d["${nameKey}"])))`)
      lines.push(`    data={filteredData}`)
    } else {
      lines.push(`    data={data}`)
    }
    lines.push(`    cx="${cx}%"`)
    lines.push(`    cy="${cy}%"`)
    lines.push(`    innerRadius={${innerRadius}}`)
    lines.push(`    outerRadius={${outerRadius}}`)
    lines.push(`    startAngle={${renderStartAngle}}`)
    lines.push(`    endAngle={${renderEndAngle}}`)
    if (margin.top !== 20 || margin.right !== 20 || margin.bottom !== 20 || margin.left !== 20) {
      lines.push(
        `    margin={{ top: ${margin.top}, right: ${margin.right}, bottom: ${margin.bottom}, left: ${margin.left} }}`
      )
    }
    if (barGap !== 4) lines.push(`    barGap={${barGap}}`)
    if (barCategoryGap !== 0) lines.push(`    barCategoryGap={${barCategoryGap}}`)
    if (barSize !== 10) lines.push(`    barSize={${barSize}}`)
    lines.push(`  >`)

    if (showPolarGrid) {
      lines.push(`    <PolarGrid gridType="circle" />`)
    }
    lines.push(`    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />`)
    lines.push(`    <PolarRadiusAxis tick={false} axisLine={false} />`)

    if (showTooltip) {
      lines.push(`    <ChartTooltip content={(props) => <ChartTooltipContent {...props} />} />`)
    }
    if (showLegend) {
      lines.push(`    <ChartLegend content={<ChartLegendContent />} />`)
    }

    selectedValueKeys.forEach((valueKey, idx) => {
      const radialProps = [`dataKey="${valueKey}"`, `fill="${palette[idx % palette.length]}"`]
      if (showBackground) radialProps.push(`background`)
      if (minAngle > 0) radialProps.push(`minAngle={${minAngle}}`)
      if (clockWise) radialProps.push(`clockWise`)
      if (!isAnimationActive) radialProps.push(`isAnimationActive={false}`)
      if (animationBegin !== 0) radialProps.push(`animationBegin={${animationBegin}}`)
      if (animationDuration !== 1500) radialProps.push(`animationDuration={${animationDuration}}`)
      if (animationEasing !== 'ease') radialProps.push(`animationEasing="${animationEasing}"`)
      if (showLabels) {
        if (labelFormatMode === 'name-value') {
          radialProps.push(
            `label={{ position: "${labelPosition}", fill: "currentColor", formatter: (value, entry) => { const p = entry?.payload ?? {}; const label = p["${nameKey}"] ?? p.label ?? p.name ?? entry?.name ?? ''; return \`${'${'}label}: ${'${'}value}\`;} }}`
          )
        } else {
          radialProps.push(`label={{ position: "${labelPosition}", fill: "currentColor" }}`)
        }
      }
      if (cornerRadius > 0) radialProps.push(`cornerRadius={${cornerRadius}}`)

      lines.push(`    <RadialBar ${radialProps.join(' ')} />`)
    })

    lines.push(`  </RadialBarChart>`)
    lines.push(`</ChartContainer>`)
    return lines.join('\n')
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">RadialChart Playground</h2>
        <p className="text-muted-foreground">
          Explore RadialBarChart settings - circular progress rings and gauges
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
              <RadialBarChart
                data={[...dataWithColors]}
                cx={`${cx}%`}
                cy={`${cy}%`}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={renderStartAngle}
                endAngle={renderEndAngle}
                barGap={barGap}
                barCategoryGap={barCategoryGap}
                margin={margin}
                barSize={barSize}
              >
                {showPolarGrid && <PolarGrid gridType="circle" />}
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                {showTooltip && (
                  <ChartTooltip content={(props) => <ChartTooltipContent {...props} />} />
                )}
                {selectedValueKeys.map((valueKey, idx) => (
                  <RadialBar
                    key={valueKey}
                    {...({
                      dataKey: valueKey,
                      fill: palette[idx % palette.length],
                      minAngle,
                      clockWise,
                      isAnimationActive,
                      animationBegin,
                      animationDuration,
                      animationEasing,
                      label: showLabels
                        ? labelFormatMode === 'name-value'
                          ? {
                              position: labelPosition,
                              fill: 'currentColor',
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              formatter: (value: any, entry: any) => {
                                const p = entry?.payload ?? {}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const label = p[nameKey as keyof typeof p] ?? (p as any).label ?? (p as any).name ?? entry?.name ?? ''
                                return `${label}: ${value}`
                              },
                            }
                          : { position: labelPosition, fill: 'currentColor' }
                        : undefined,
                      background: showBackground,
                      cornerRadius,
                    } as React.ComponentProps<typeof RadialBar>)}
                  />
                ))}
              </RadialBarChart>
            </ChartContainer>
            {showLegend && (
              <div className="flex items-center justify-center gap-4 pt-3">
                {selectedValueKeys.map((key, idx) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div
                      className="h-2 w-2 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: palette[idx % palette.length] }}
                    />
                    <span className="text-sm text-muted-foreground">{key}</span>
                  </div>
                ))}
              </div>
            )}
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
                <TabsTrigger value="shape">Shape</TabsTrigger>
                <TabsTrigger value="rings">Rings</TabsTrigger>
                <TabsTrigger value="display">Display</TabsTrigger>
              </TabsList>

              <TabsContent value="data" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Data Source</Label>
                  <Select value={dataSource} onValueChange={(v) => setDataSource(v as keyof typeof radialDataSources)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(radialDataSources).map(([key, src]) => (
                        <SelectItem key={key} value={key}>
                          {src.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Label field (nameKey)</Label>
                  <Select value={nameKey} onValueChange={setNameKey}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentSource.nameKeys.map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Used for ring labels</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Value fields (dataKeys)</Label>
                  <div className="flex flex-wrap gap-2">
                    {currentSource.valueKeys.map((k, idx) => (
                      <button
                        key={k}
                        className={`flex items-center gap-2 rounded border px-3 py-2 text-left transition hover:border-primary ${
                          selectedValueKeys.includes(k) ? 'bg-muted/50 border-primary' : 'opacity-60'
                        }`}
                        onClick={() => {
                          setSelectedValueKeys((prev) => {
                            if (prev.includes(k)) {
                              return prev.length > 1 ? prev.filter((v) => v !== k) : prev
                            }
                            return [...prev, k]
                          })
                        }}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: palette[idx % palette.length] }}
                        />
                        <span className="text-sm font-medium">{k}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Select one or more metrics to compare</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Rings</Label>
                    <p className="text-xs text-muted-foreground">Toggle which rings are shown</p>
                  </div>
                  <button
                    className="text-xs text-primary hover:underline"
                    onClick={() => {
                      const allOn: Record<string, boolean> = {}
                      currentSource.data.forEach((item) => {
                        allOn[String(item[nameKey])] = true
                      })
                      setEnabledKeys(allOn)
                    }}
                  >
                    Enable all
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {currentSource.data.map((item) => {
                    const label = item[nameKey] ?? item[currentSource.nameKeys[0]] ?? 'item'
                    const key = String(label)
                    const checked = enabledKeys[key] !== false
                    return (
                      <button
                        key={key}
                        className={`flex items-center gap-2 rounded border p-2 text-left transition hover:border-primary ${checked ? 'bg-muted/50' : 'opacity-60'}`}
                        onClick={() =>
                          setEnabledKeys((prev) => ({
                            ...prev,
                            [key]: !(prev[key] !== false),
                          }))
                        }
                      >
                        <span className="text-sm font-medium">{key}</span>
                      </button>
                    )
                  })}
                </div>

                <p className="text-xs text-muted-foreground">Data changes update tooltip/legend and ring lengths automatically.</p>
              </TabsContent>

              <TabsContent value="shape" className="space-y-4 pt-4">
                {/* Center Offsets */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Center X (cx)</Label>
                        <p className="text-xs text-muted-foreground">Horizontal center %</p>
                      </div>
                      <Input
                        type="number"
                        value={cx}
                        onChange={(e) => setCx(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                        min={0}
                        max={100}
                        className="w-20 h-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Center Y (cy)</Label>
                        <p className="text-xs text-muted-foreground">Vertical center %</p>
                      </div>
                      <Input
                        type="number"
                        value={cy}
                        onChange={(e) => setCy(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                        min={0}
                        max={100}
                        className="w-20 h-8"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Inner Radius */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Inner Radius</Label>
                      <p className="text-xs text-muted-foreground">Center hole size</p>
                    </div>
                    <Input
                      type="number"
                      value={innerRadius}
                      onChange={(e) => setInnerRadius(Number(e.target.value) || 10)}
                      min={10}
                      max={outerRadius - 20}
                      className="w-20 h-8"
                    />
                  </div>
                </div>

                <Separator />

                {/* Outer Radius */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Outer Radius</Label>
                      <p className="text-xs text-muted-foreground">Overall size</p>
                    </div>
                    <Input
                      type="number"
                      value={outerRadius}
                      onChange={(e) => setOuterRadius(Number(e.target.value) || 50)}
                      min={50}
                      max={150}
                      className="w-20 h-8"
                    />
                  </div>
                </div>

                <Separator />

                {/* Ring Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Ring Size</Label>
                      <p className="text-xs text-muted-foreground">Thickness of rings</p>
                    </div>
                    <Input
                      type="number"
                      value={barSize}
                      onChange={(e) => setBarSize(Number(e.target.value) || 5)}
                      min={5}
                      max={30}
                      className="w-20 h-8"
                    />
                  </div>
                </div>

                <Separator />

                {/* Bar Gap */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Bar Gap</Label>
                      <p className="text-xs text-muted-foreground">Gap between metrics in same category</p>
                    </div>
                    <Input
                      type="number"
                      value={barGap}
                      onChange={(e) => setBarGap(Number(e.target.value) || 0)}
                      min={-20}
                      max={40}
                      className="w-24 h-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Spacing between multiple metric rings within each category. Only visible with 2+ metrics selected.</p>
                </div>

                <Separator />

                {/* Bar Category Gap */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Bar Category Gap</Label>
                      <p className="text-xs text-muted-foreground">Spacing between categories</p>
                    </div>
                    <Input
                      type="number"
                      value={barCategoryGap}
                      onChange={(e) => setBarCategoryGap(Number(e.target.value) || 0)}
                      min={-20}
                      max={40}
                      className="w-24 h-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Spacing between different categories (e.g., Chrome vs Safari).</p>
                </div>

                <Separator />

                {/* Corner Radius */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Corner Radius</Label>
                      <p className="text-xs text-muted-foreground">Rounded ring ends</p>
                    </div>
                    <Input
                      type="number"
                      value={cornerRadius}
                      onChange={(e) => setCornerRadius(Number(e.target.value) || 0)}
                      min={0}
                      max={20}
                      className="w-20 h-8"
                    />
                  </div>
                </div>

                <Separator />

                {/* Start Angle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Start Angle</Label>
                      <p className="text-xs text-muted-foreground">Where rings begin</p>
                    </div>
                    <Input
                      type="number"
                      value={startAngle}
                      onChange={(e) => setStartAngle(Number(e.target.value))}
                      min={-360}
                      max={360}
                      className="w-20 h-8"
                    />
                  </div>
                </div>

                <Separator />

                {/* End Angle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">End Angle</Label>
                      <p className="text-xs text-muted-foreground">Where 100% would be</p>
                    </div>
                    <Input
                      type="number"
                      value={endAngle}
                      onChange={(e) => setEndAngle(Number(e.target.value))}
                      min={-360}
                      max={360}
                      className="w-20 h-8"
                    />
                  </div>
                </div>

                <Separator />

                {/* Min Angle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Min Angle</Label>
                      <p className="text-xs text-muted-foreground">Minimum arc for small values</p>
                    </div>
                    <Input
                      type="number"
                      value={minAngle}
                      onChange={(e) => setMinAngle(Math.max(0, Number(e.target.value) || 0))}
                      min={0}
                      max={180}
                      className="w-20 h-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Avoid vanishing rings by forcing a tiny arc.</p>
                </div>

                <Separator />

                {/* Direction */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Clockwise</Label>
                    <p className="text-xs text-muted-foreground">Flip ring growth direction</p>
                  </div>
                  <Switch checked={clockWise} onCheckedChange={setClockWise} />
                </div>

                <Separator />

                {/* Margins */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Margin (px)</Label>
                      <p className="text-xs text-muted-foreground">Add breathing room around the chart</p>
                    </div>
                    <button
                      className="text-xs text-primary hover:underline"
                      type="button"
                      onClick={() => setMargin({ top: 20, right: 20, bottom: 20, left: 20 })}
                    >
                      Reset
                    </button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                      <div key={side} className="flex items-center justify-between">
                        <p className="text-xs font-medium capitalize">{side}</p>
                        <Input
                          type="number"
                          value={margin[side]}
                          onChange={(e) =>
                            setMargin((prev) => ({ ...prev, [side]: Number(e.target.value) || 0 }))
                          }
                          min={0}
                          max={100}
                          className="w-20 h-8"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Animation */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Animate</Label>
                      <p className="text-xs text-muted-foreground">Enable entry animation</p>
                    </div>
                    <Switch checked={isAnimationActive} onCheckedChange={setIsAnimationActive} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Animation Delay</Label>
                      <p className="text-xs text-muted-foreground">Start offset (ms)</p>
                    </div>
                    <Input
                      type="number"
                      value={animationBegin}
                      onChange={(e) => setAnimationBegin(Math.max(0, Number(e.target.value) || 0))}
                      min={0}
                      max={5000}
                      className="w-24 h-8"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Animation Duration</Label>
                      <p className="text-xs text-muted-foreground">Milliseconds</p>
                    </div>
                    <Input
                      type="number"
                      value={animationDuration}
                      onChange={(e) => setAnimationDuration(Math.max(0, Number(e.target.value) || 0))}
                      min={0}
                      max={5000}
                      className="w-24 h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Animation Easing</Label>
                    <Select value={animationEasing} onValueChange={(v) => setAnimationEasing(v as typeof animationEasing)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ease">ease</SelectItem>
                        <SelectItem value="ease-in">ease-in</SelectItem>
                        <SelectItem value="ease-out">ease-out</SelectItem>
                        <SelectItem value="ease-in-out">ease-in-out</SelectItem>
                        <SelectItem value="linear">linear</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Labels */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Show Labels</Label>
                      <p className="text-xs text-muted-foreground">Render values on rings</p>
                    </div>
                    <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Label Position</Label>
                    <Select value={labelPosition} onValueChange={(v) => setLabelPosition(v as typeof labelPosition)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inside">Inside</SelectItem>
                        <SelectItem value="insideStart">Inside Start</SelectItem>
                        <SelectItem value="insideEnd">Inside End</SelectItem>
                        <SelectItem value="outside">Outside</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Label Content</Label>
                    <Select value={labelFormatMode} onValueChange={(v) => setLabelFormatMode(v as typeof labelFormatMode)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="value">Value only</SelectItem>
                        <SelectItem value="name-value">Name + value</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Name uses the current nameKey field.</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rings" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Ring Size</Label>
                    <p className="text-xs text-muted-foreground">Thickness of rings</p>
                  </div>
                  <Input
                    type="number"
                    value={barSize}
                    onChange={(e) => setBarSize(Number(e.target.value) || 5)}
                    min={5}
                    max={30}
                    className="w-20 h-8"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Corner Radius</Label>
                    <p className="text-xs text-muted-foreground">Rounded ring ends</p>
                  </div>
                  <Input
                    type="number"
                    value={cornerRadius}
                    onChange={(e) => setCornerRadius(Number(e.target.value) || 0)}
                    min={0}
                    max={20}
                    className="w-20 h-8"
                  />
                </div>
              </TabsContent>

              <TabsContent value="display" className="space-y-4 pt-4">
                {/* Show Background */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Background</Label>
                    <p className="text-xs text-muted-foreground">Track behind rings</p>
                  </div>
                  <Switch checked={showBackground} onCheckedChange={setShowBackground} />
                </div>

                <Separator />

                {/* Polar Grid */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Polar Grid</Label>
                    <p className="text-xs text-muted-foreground">Circular grid lines</p>
                  </div>
                  <Switch checked={showPolarGrid} onCheckedChange={setShowPolarGrid} />
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

                <Separator />

                {/* Legend */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Legend</Label>
                    <p className="text-xs text-muted-foreground">{'<ChartLegend />'}</p>
                  </div>
                  <Switch checked={showLegend} onCheckedChange={setShowLegend} />
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Active Metrics</p>
                  {selectedValueKeys.map((key, idx) => (
                    <div key={key} className="flex items-center gap-2 rounded-lg border p-2" style={{ borderLeftColor: palette[idx % palette.length], borderLeftWidth: 4 }}>
                      <span className="text-sm font-medium">{key}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Generated Code */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Code</CardTitle>
          <CardDescription>Copy this code to use your current configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="w-full max-w-full overflow-x-auto rounded-lg bg-muted p-4 text-sm whitespace-pre">
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
        <Card>
          <CardHeader>
            <CardTitle>📊 Data Format</CardTitle>
            <CardDescription>Required fields for RadialBarChart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              <code>{`// Array with label (nameKey), value (dataKey), and optional fill
const data = [
  { label: 'Chrome', value: 65, fill: '#4169e1' },
  { label: 'Safari', value: 50, fill: '#2db89a' },
  { label: 'Firefox', value: 35, fill: '#d946ef' },
]`}</code>
            </pre>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Notes:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>nameKey</strong> is used for legend labels.</li>
                <li><strong>dataKey</strong> is the numeric value mapped to ring length.</li>
                <li>Colors can come from data (<code className="text-xs">fill</code>) or config palette.</li>
                <li>Keep values comparable (0-100 works best for percentages).</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚙️ Configurable Properties</CardTitle>
            <CardDescription>Native props you can tweak</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Shape & Layout</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><code className="text-xs">cx</code> / <code className="text-xs">cy</code> recenter the chart (percent of container).</li>
                <li><code className="text-xs">innerRadius</code> / <code className="text-xs">outerRadius</code> control donut size.</li>
                <li><code className="text-xs">barSize</code> sets ring thickness; <code className="text-xs">cornerRadius</code> rounds ends.</li>
                <li><code className="text-xs">startAngle</code> / <code className="text-xs">endAngle</code> set arc (180→0 for gauge), <code className="text-xs">clockWise</code> flips direction.</li>
                <li><code className="text-xs">minAngle</code> forces a tiny arc so small values stay visible.</li>
                <li><code className="text-xs">animationBegin</code> delays entry (ms); <code className="text-xs">animationDuration</code> + <code className="text-xs">animationEasing</code> control motion.</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Display</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><code className="text-xs">background</code> shows a track behind rings.</li>
                <li><code className="text-xs">PolarGrid</code> adds circular guides; <code className="text-xs">ChartLegend</code> uses the config colors.</li>
                <li><code className="text-xs">ChartTooltip</code> displays name + value for the hovered ring.</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Data hygiene</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Limit to ~5 rings for readability.</li>
                <li>Sort data to emphasize most important rings.</li>
                <li>Use consistent units (all percentages or all absolute values).</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✅ Best Practices</CardTitle>
            <CardDescription>Quick guidance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Keep rings to ~4-6; combine minor categories into “Other”.</li>
              <li>Sort rings by value for clearer hierarchy.</li>
              <li>Use semi-circle arcs (startAngle/endAngle) for gauge-style displays.</li>
              <li>Stick to one unit (all percentages or all counts).</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>💡 When to use</CardTitle>
            <CardDescription>Pick RadialBarChart over other charts when…</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Showing goal/target progress (gauges, KPIs).</li>
              <li>Comparing a handful of metrics in a compact space.</li>
              <li>Needing a circular variant of a small bar chart.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>📐 Understanding nameKey & dataKeys (Multi-Metric)</CardTitle>
          <CardDescription>How data maps to rings and legend with multiple metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium">nameKey (Label)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Purpose:</strong> Category name for each data item</li>
                <li><strong>Type:</strong> String (e.g., browser, device, channel)</li>
                <li><strong>Example:</strong> Chrome, Safari, Firefox</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">dataKeys (Values - Multi-Select)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Purpose:</strong> One or more metrics to display</li>
                <li><strong>Type:</strong> Number (percent, users, sessions)</li>
                <li><strong>Legend:</strong> Shows selected metrics, not categories</li>
                <li><strong>Example:</strong> Select both &quot;value&quot; and &quot;users&quot; to compare</li>
              </ul>
            </div>
          </div>
          <Separator />
          <div className="rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-3 text-xs text-muted-foreground">
            <p><strong className="text-blue-700 dark:text-blue-400">Multi-Metric Mode:</strong> Select 2+ metrics to compare them side-by-side. Each category (Chrome, Safari, etc.) will have multiple rings - one per selected metric. Use <code className="text-xs">barGap</code> to control spacing between metric rings within each category.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>🎛️ Individual vs Global Settings</CardTitle>
          <CardDescription>What&apos;s per-metric vs chart-wide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <p className="font-medium">Per Metric (Multi-Select)</p>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Each selected metric gets its own color from palette.</li>
                <li>Each metric creates a separate RadialBar series.</li>
                <li>Enable/disable categories via Data tab toggles.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <p className="font-medium">Chart-wide</p>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>innerRadius / outerRadius, barSize, cornerRadius.</li>
                <li>startAngle / endAngle, background tracks.</li>
                <li>barGap (between metrics), barCategoryGap (between categories).</li>
                <li>PolarGrid, Tooltip, Legend visibility.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
