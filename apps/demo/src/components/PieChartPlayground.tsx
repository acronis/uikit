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
import { PieChart, Pie, Cell } from 'recharts'

// Data sources
const pieDataSources = {
  devices: {
    name: 'Devices Share',
    data: [
      { category: 'Desktop', short: 'Desk', value: 600, users: 2200, share: 48, conversions: 420 },
      { category: 'Mobile', short: 'Mob', value: 260, users: 900, share: 28, conversions: 310 },
      { category: 'Tablet', short: 'Tab', value: 90, users: 500, share: 15, conversions: 90 },
      { category: 'Other', short: 'Other', value: 50, users: 120, share: 9, conversions: 35 },
    ],
    nameKeys: ['category', 'short'],
    valueKeys: ['value', 'users', 'share', 'conversions'],
  },
  channels: {
    name: 'Marketing Channels',
    data: [
      { channel: 'Organic', code: 'ORG', spend: 800, leads: 120, ctr: 2.1, roi: 4.2 },
      { channel: 'Paid', code: 'PAD', spend: 400, leads: 340, ctr: 3.8, roi: 2.8 },
      { channel: 'Email', code: 'EML', spend: 200, leads: 90, ctr: 1.6, roi: 5.1 },
      { channel: 'Referral', code: 'REF', spend: 100, leads: 60, ctr: 1.9, roi: 6.3 },
    ],
    nameKeys: ['channel', 'code'],
    valueKeys: ['spend', 'leads', 'ctr', 'roi'],
  },
  regions: {
    name: 'Regional Split',
    data: [
      { region: 'North', abbr: 'N', revenue: 900, customers: 500, population: 1200 },
      { region: 'South', abbr: 'S', revenue: 200, customers: 240, population: 800 },
      { region: 'West', abbr: 'W', revenue: 150, customers: 120, population: 650 },
      { region: 'East', abbr: 'E', revenue: 80, customers: 80, population: 540 },
    ],
    nameKeys: ['region', 'abbr'],
    valueKeys: ['revenue', 'customers', 'population'],
  },
} as const

export function PieChartPlayground() {
  const piePalette = React.useMemo(() => ['#3b82f6', '#10b981', '#f97316', '#a855f7', '#0ea5e9', '#ef4444', '#8b5cf6', '#eab308'], [])

  // Chart settings state
  const [showTooltip, setShowTooltip] = React.useState(true)
  const [showLegend, setShowLegend] = React.useState(true)
  const [dataSource, setDataSource] = React.useState<keyof typeof pieDataSources>('devices')
  const [nameKey, setNameKey] = React.useState('category')
  const [valueKey, setValueKey] = React.useState('value')

  // Pie-specific settings
  const [innerRadius, setInnerRadius] = React.useState(0)
  const [outerRadius, setOuterRadius] = React.useState(80)
  const [paddingAngle, setPaddingAngle] = React.useState(0)
  const [cornerRadius, setCornerRadius] = React.useState(0)
  const [startAngle, setStartAngle] = React.useState(0)
  const [endAngle, setEndAngle] = React.useState(360)
  const [showLabels, setShowLabels] = React.useState(false)
  const [labelLine, setLabelLine] = React.useState(true)
  const [enabledSlices, setEnabledSlices] = React.useState<Record<string, boolean>>({})
  const [sliceSettings, setSliceSettings] = React.useState<Record<string, { color?: string; label?: boolean; labelFormat?: 'name-value' | 'name-percent' | 'percent' | 'value' }>>({})
  const [isAnimationActive, setIsAnimationActive] = React.useState(true)
  const [minAngle, setMinAngle] = React.useState(0)
  const [marginTop, setMarginTop] = React.useState(16)
  const [marginRight, setMarginRight] = React.useState(16)
  const [marginBottom, setMarginBottom] = React.useState(16)
  const [marginLeft, setMarginLeft] = React.useState(16)
  const [labelFormat, setLabelFormat] = React.useState<'none' | 'name-value' | 'name-percent' | 'percent' | 'value'>('none')
  const [tooltipFormat, setTooltipFormat] = React.useState<'value' | 'value-percent'>('value')
  const [legendPos, setLegendPos] = React.useState<'top' | 'bottom'>('bottom')
  const currentSource = pieDataSources[dataSource]

  React.useEffect(() => {
    // Reset selectors when source changes
    setNameKey(currentSource.nameKeys[0])
    setValueKey(currentSource.valueKeys[0])
  }, [dataSource, currentSource.nameKeys, currentSource.valueKeys])

  React.useEffect(() => {
    // Ensure slices are enabled when data source or label key changes
    const nextEnabled: Record<string, boolean> = {}
    currentSource.data.forEach((item) => {
      nextEnabled[String(item[nameKey])] = true
    })
    setEnabledSlices(nextEnabled)
  }, [currentSource.data, nameKey])

  const getSliceColor = React.useCallback(
    (key: string, idx: number) => sliceSettings[key]?.color || piePalette[idx % piePalette.length],
    [sliceSettings, piePalette]
  )

  const getSliceLabelSetting = React.useCallback(
    (key: string) => sliceSettings[key] ?? {},
    [sliceSettings]
  )

  const visibleData = React.useMemo(() => {
    const filtered = currentSource.data.filter((item) => enabledSlices[String(item[nameKey])] !== false)
    return filtered.length > 0 ? filtered : currentSource.data
  }, [currentSource.data, enabledSlices, nameKey])

  const config = React.useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {}
    visibleData.forEach((item, idx) => {
      const key = String(item[nameKey])
      cfg[key] = { label: key, color: getSliceColor(key, idx) }
    })
    return cfg
  }, [visibleData, nameKey, getSliceColor])

  const pieKey = `${dataSource}-${nameKey}-${valueKey}`

  const renderLabel = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (entry: { [key: string]: any; name?: any; percent?: number }) => {
      if (!showLabels) return ''
      const key = String(entry[nameKey] ?? entry.name)
      const slice = getSliceLabelSetting(key)
      if (slice.label === false) return ''
      const fmt = slice.labelFormat || (labelFormat === 'none' ? 'name-value' : labelFormat)
      const name = entry[nameKey] ?? entry.name
      const val = entry[valueKey] ?? entry.value
      const percent = entry.percent ? `${(entry.percent * 100).toFixed(1)}%` : ''
      if (fmt === 'name-value') return `${name}: ${val}`
      if (fmt === 'name-percent') return `${name}: ${percent}`
      if (fmt === 'percent') return percent
      if (fmt === 'value') return `${val}`
      return `${name}`
    },
    [getSliceLabelSetting, labelFormat, nameKey, showLabels, valueKey]
  )

  // Generate code preview
  const generateCode = () => {
    const lines = []
    lines.push(`<ChartContainer config={config} className="h-[400px]">`)
    lines.push(`  <PieChart>`)
    const marginLine = `    <PieChart margin={{ top: ${marginTop}, right: ${marginRight}, bottom: ${marginBottom}, left: ${marginLeft} }}>`
    lines[1] = marginLine
    
    if (showTooltip) {
      if (tooltipFormat === 'value-percent') {
        lines.push(
          `    <ChartTooltip content={<ChartTooltipContent formatter={(value, name, item) => [item && item.payload && item.payload.percent ? \`${'${'}(item.payload.percent * 100).toFixed(1)}% (${ '${'}value})\` : value, name]} />} />`
        )
      } else {
        lines.push(`    <ChartTooltip content={<ChartTooltipContent />} />`)
      }
    }
    if (showLegend) {
      lines.push(`    <ChartLegend content={<ChartLegendContent />} wrapperStyle={{ marginBottom: ${legendPos === 'bottom' ? 12 : 0}, marginTop: ${legendPos === 'top' ? 12 : 0} }} />`)
    }
    
    const pieProps = []
    pieProps.push(`data={filteredData}`)
    pieProps.push(`dataKey="${valueKey}"`)
    pieProps.push(`nameKey="${nameKey}"`)
    pieProps.push(`cx="50%"`)
    pieProps.push(`cy="50%"`)
    if (innerRadius > 0) pieProps.push(`innerRadius={${innerRadius}}`)
    pieProps.push(`outerRadius={${outerRadius}}`)
    if (paddingAngle > 0) pieProps.push(`paddingAngle={${paddingAngle}}`)
    if (cornerRadius > 0) pieProps.push(`cornerRadius={${cornerRadius}}`)
    if (startAngle !== 0) pieProps.push(`startAngle={${startAngle}}`)
    if (endAngle !== 360) pieProps.push(`endAngle={${endAngle}}`)
    if (minAngle > 0) pieProps.push(`minAngle={${minAngle}}`)
    if (!isAnimationActive) pieProps.push(`isAnimationActive={false}`)
    if (showLabels) {
      const customSlices = Object.entries(sliceSettings).filter(([, v]) => v.label === false || v.labelFormat)
      if (customSlices.length > 0 || labelFormat !== 'none') {
        const settingsObject = customSlices
          .map(([k, v]) => ` "${k}": {${v.label === false ? ' label: false,' : ''}${v.labelFormat ? ` labelFormat: "${v.labelFormat}"` : ''} }`)
          .join(',')
        lines.unshift(`const sliceLabelSettings = {${settingsObject}}`)
        const fallbackFmt = labelFormat === 'none' ? 'name-value' : labelFormat
        lines.unshift(
          `const formatLabel = (entry) => { const key = String(entry["${nameKey}"] || entry.name); const s = (sliceLabelSettings && sliceLabelSettings[key]) || {}; if (s.label === false) return ''; const fmt = s.labelFormat || "${fallbackFmt}"; const name = entry["${nameKey}"] || entry.name; const val = entry["${valueKey}"] || entry.value; const pct = entry.percent ? (entry.percent * 100).toFixed(1) + "%" : ""; if (fmt === "name-value") return name + ": " + val; if (fmt === "name-percent") return name + ": " + pct; if (fmt === "percent") return pct; if (fmt === "value") return String(val); return String(name); }`
        )
        pieProps.push('label={formatLabel}')
      } else {
        pieProps.push('label')
      }
      if (!labelLine) pieProps.push(`labelLine={false}`)
    }
    // active slice highlight omitted in codegen for simplicity
    
    const enabledKeys = Object.entries(enabledSlices)
      .filter(([, v]) => v !== false)
      .map(([k]) => k)
    if (enabledKeys.length !== currentSource.data.length) {
      lines.unshift(`const filteredData = data.filter((d) => ${JSON.stringify(enabledKeys)}.includes(String(d["${nameKey}"])) )`)
    } else {
      lines.unshift(`const filteredData = data`)
    }

    lines.push(`    <Pie`)
    pieProps.forEach(prop => lines.push(`      ${prop}`))
    lines.push(`    >`)
    const customColorEntries = Object.entries(sliceSettings).filter(([, v]) => v?.color)
    lines.unshift(`const colors = ${JSON.stringify(piePalette)}`)
    if (customColorEntries.length > 0) {
      lines.unshift(`const sliceColors = {${customColorEntries.map(([k, v]) => ` "${k}": "${v?.color}"`).join(',')} }`)
    }
    lines.push(`      {filteredData.map((entry, index) => (`)
    lines.push(
      `        <Cell key={index} fill={${customColorEntries.length > 0 ? 'sliceColors[entry["' + nameKey + '"]] || ' : ''}colors[index % colors.length]} />`
    )
    lines.push(`      ))}`)
    lines.push(`    </Pie>`)
    
    lines.push(`  </PieChart>`)
    lines.push(`</ChartContainer>`)
    return lines.join('\n')
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">PieChart Playground</h2>
        <p className="text-muted-foreground">
          Explore PieChart settings - circular charts for showing proportions
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
              <PieChart margin={{ top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft }}>
                {showTooltip && (
                  <ChartTooltip
                    content={(props) =>
                      tooltipFormat === 'value-percent'
                        ? (
                          <ChartTooltipContent
                            {...props}
                            formatter={(value, name, item) => [
                              item && item.payload && item.payload.percent
                                ? `${(item.payload.percent * 100).toFixed(1)}% (${value})`
                                : value,
                              name,
                            ]}
                          />
                        )
                        : <ChartTooltipContent {...props} />
                    }
                  />
                )}
                {showLegend && (
                  <ChartLegend content={<ChartLegendContent />} wrapperStyle={{ marginBottom: legendPos === 'bottom' ? 12 : 0, marginTop: legendPos === 'top' ? 12 : 0 }} />
                )}
                <Pie
                  key={pieKey}
                  data={[...visibleData]}
                  dataKey={valueKey}
                  nameKey={nameKey}
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  paddingAngle={paddingAngle}
                  cornerRadius={cornerRadius}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  minAngle={minAngle}
                  isAnimationActive={isAnimationActive}
                  label={
                    showLabels
                      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (entry: any) => renderLabel(entry)
                      : false
                  }
                  labelLine={labelLine}
                >
                  {visibleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getSliceColor(String(entry[nameKey]), index)} />
                  ))}
                </Pie>
              </PieChart>
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
                <TabsTrigger value="shape">Shape</TabsTrigger>
                <TabsTrigger value="slices">Slices</TabsTrigger>
                <TabsTrigger value="display">Display</TabsTrigger>
              </TabsList>

              <TabsContent value="data" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Data Source</Label>
                  <Select value={dataSource} onValueChange={(v) => setDataSource(v as keyof typeof pieDataSources)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(pieDataSources).map(([key, src]) => (
                        <SelectItem key={key} value={key}>
                          {src.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="grid gap-3 sm:grid-cols-2">
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
                    <p className="text-xs text-muted-foreground">Used for slice labels and legend names</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Value field (dataKey)</Label>
                    <Select value={valueKey} onValueChange={setValueKey}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currentSource.valueKeys.map((k) => (
                          <SelectItem key={k} value={k}>
                            {k}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Numeric field used for slice size</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">Data changes update tooltip/legend labels and slice sizing automatically.</div>

                <Separator />

                {/* Slice visibility (quick toggle) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Visible Slices</Label>
                      <p className="text-xs text-muted-foreground">Toggle slices on/off without leaving the Data tab</p>
                    </div>
                    <button
                      className="text-xs text-primary hover:underline"
                      onClick={() => {
                        const allOn: Record<string, boolean> = {}
                        currentSource.data.forEach((item) => {
                          allOn[String(item[nameKey])] = true
                        })
                        setEnabledSlices(allOn)
                      }}
                    >
                      Enable all
                    </button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {currentSource.data.map((item, idx) => {
                      const label = String(item[nameKey] ?? item[currentSource.nameKeys[0]] ?? 'slice')
                      const key = label
                      const checked = enabledSlices[key] !== false
                      const valueDisplay = item[valueKey] ?? item[currentSource.valueKeys[0]] ?? ''
                      return (
                        <button
                          key={`data-toggle-${key}`}
                          className={`flex items-center gap-2 rounded border p-2 text-left transition hover:border-primary ${checked ? 'bg-muted/50' : 'opacity-60'}`}
                          onClick={() =>
                            setEnabledSlices((prev) => ({
                              ...prev,
                              [key]: !(prev[key] !== false),
                            }))
                          }
                        >
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: getSliceColor(key, idx) }}
                          />
                          <span className="text-sm font-medium">{key}</span>
                          <span className="ml-auto text-xs text-muted-foreground">{valueDisplay}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

              </TabsContent>

              <TabsContent value="slices" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Slices</Label>
                    <p className="text-xs text-muted-foreground">Toggle which slices are shown</p>
                  </div>
                  <button
                    className="text-xs text-primary hover:underline"
                    onClick={() => {
                      const allOn: Record<string, boolean> = {}
                      currentSource.data.forEach((item) => {
                        allOn[String(item[nameKey])] = true
                      })
                      setEnabledSlices(allOn)
                    }}
                  >
                    Enable all
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {currentSource.data.map((item, idx) => {
                    const label = item[nameKey] ?? item[currentSource.nameKeys[0]] ?? 'slice'
                    const key = String(label)
                    const checked = enabledSlices[key] !== false
                    const valueDisplay = item[valueKey] ?? item[currentSource.valueKeys[0]] ?? ''
                    return (
                      <button
                        key={key}
                        className={`flex items-center gap-2 rounded border p-2 text-left transition hover:border-primary ${checked ? 'bg-muted/50' : 'opacity-60'}`}
                        onClick={() =>
                          setEnabledSlices((prev) => ({
                            ...prev,
                            [key]: !(prev[key] !== false),
                          }))
                        }
                      >
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: getSliceColor(key, idx) }}
                        />
                        <span className="text-sm font-medium">{key}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{valueDisplay}</span>
                      </button>
                    )
                  })}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Colors</p>
                  <div className="space-y-3">
                    {currentSource.data.map((item, idx) => {
                      const label = String(item[nameKey] ?? item[currentSource.nameKeys[0]] ?? 'slice')
                      const currentColor = getSliceColor(label, idx)
                      return (
                        <div key={`${label}-color`} className="rounded-lg border p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{label}</p>
                            <span className="ml-auto h-3 w-3 rounded-full" style={{ backgroundColor: currentColor }} />
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="color"
                              value={currentColor}
                              onChange={(e) => setSliceSettings((prev) => ({ ...prev, [label]: { ...prev[label], color: e.target.value } }))}
                              className="h-8 w-10 rounded border border-border bg-transparent"
                              aria-label={`${label} color`}
                            />
                            <input
                              type="text"
                              value={currentColor}
                              onChange={(e) => setSliceSettings((prev) => ({ ...prev, [label]: { ...prev[label], color: e.target.value } }))}
                              className="h-8 w-28 text-xs"
                            />
                            <div className="flex flex-wrap gap-1">
                              {piePalette.map((c) => (
                                <button
                                  key={c}
                                  className={`h-7 w-7 rounded-full border-2 ${currentColor === c ? 'border-foreground' : 'border-transparent'} hover:scale-105 transition`}
                                  style={{ backgroundColor: c }}
                                  onClick={() => setSliceSettings((prev) => ({ ...prev, [label]: { ...prev[label], color: c } }))}
                                  title={c}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 pt-1">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={getSliceLabelSetting(label).label !== false}
                                onCheckedChange={(checked) =>
                                  setSliceSettings((prev) => ({ ...prev, [label]: { ...prev[label], label: checked } }))
                                }
                              />
                              <span className="text-xs text-muted-foreground">Label</span>
                            </div>
                            <Select
                              value={getSliceLabelSetting(label).labelFormat || 'inherit'}
                              onValueChange={(v) =>
                                setSliceSettings((prev) => ({
                                  ...prev,
                                  [label]: { ...prev[label], labelFormat: v === 'inherit' ? undefined : (v as 'name-value' | 'name-percent' | 'percent' | 'value') },
                                }))
                              }
                            >
                              <SelectTrigger className="h-8 w-40 text-xs">
                                <SelectValue placeholder="Inherit format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="inherit">Inherit format</SelectItem>
                                <SelectItem value="name-value">Name + Value</SelectItem>
                                <SelectItem value="name-percent">Name + %</SelectItem>
                                <SelectItem value="percent">Percent only</SelectItem>
                                <SelectItem value="value">Value only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Toggle slices on/off; legend updates accordingly.</p>
              </TabsContent>

              <TabsContent value="shape" className="space-y-4 pt-4">
                {/* Inner Radius */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Inner Radius</Label>
                      <p className="text-xs text-muted-foreground">
                        {innerRadius > 0 ? 'Donut chart' : 'Pie chart'}
                      </p>
                    </div>
                    <Input
                      type="number"
                      value={innerRadius}
                      onChange={(e) => setInnerRadius(Number(e.target.value) || 0)}
                      min={0}
                      max={outerRadius - 10}
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
                      <p className="text-xs text-muted-foreground">Size of the pie</p>
                    </div>
                    <Input
                      type="number"
                      value={outerRadius}
                      onChange={(e) => setOuterRadius(Number(e.target.value) || 50)}
                      min={30}
                      max={150}
                      className="w-20 h-8"
                    />
                  </div>
                </div>

                <Separator />

                {/* Padding Angle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Padding Angle</Label>
                      <p className="text-xs text-muted-foreground">Gap between slices</p>
                    </div>
                    <Input
                      type="number"
                      value={paddingAngle}
                      onChange={(e) => setPaddingAngle(Number(e.target.value) || 0)}
                      min={0}
                      max={10}
                      className="w-20 h-8"
                    />
                  </div>
                </div>

                <Separator />

                {/* Corner Radius */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Corner Radius</Label>
                      <p className="text-xs text-muted-foreground">Rounded slice corners</p>
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
                      <p className="text-xs text-muted-foreground">Where pie starts (degrees)</p>
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
                      <p className="text-xs text-muted-foreground">Where pie ends (degrees)</p>
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
                      <Label className="text-sm font-medium">Minimum Slice Angle</Label>
                      <p className="text-xs text-muted-foreground">Avoid tiny slivers (degrees)</p>
                    </div>
                    <Input
                      type="number"
                      value={minAngle}
                      onChange={(e) => setMinAngle(Number(e.target.value) || 0)}
                      min={0}
                      max={90}
                      className="w-20 h-8"
                    />
                  </div>
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

                {/* Margin */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Chart Margins</Label>
                  <p className="text-xs text-muted-foreground">Padding around the pie</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" className="h-8" value={marginTop} onChange={(e) => setMarginTop(Number(e.target.value) || 0)} prefix="Top" />
                    <Input type="number" className="h-8" value={marginRight} onChange={(e) => setMarginRight(Number(e.target.value) || 0)} prefix="Right" />
                    <Input type="number" className="h-8" value={marginBottom} onChange={(e) => setMarginBottom(Number(e.target.value) || 0)} prefix="Bottom" />
                    <Input type="number" className="h-8" value={marginLeft} onChange={(e) => setMarginLeft(Number(e.target.value) || 0)} prefix="Left" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="display" className="space-y-4 pt-4">
                {/* Show Labels */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Labels</Label>
                    <p className="text-xs text-muted-foreground">Display value labels on slices</p>
                  </div>
                  <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                </div>

                {showLabels && (
                  <div className="space-y-3 pl-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Label Lines</Label>
                        <p className="text-xs text-muted-foreground">Connector lines to labels</p>
                      </div>
                      <Switch checked={labelLine} onCheckedChange={setLabelLine} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Label Format</Label>
                      <Select value={labelFormat} onValueChange={(v) => setLabelFormat(v as typeof labelFormat)}>
                        <SelectTrigger className="w-56">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Default (Recharts)</SelectItem>
                          <SelectItem value="name-value">Name + Value</SelectItem>
                          <SelectItem value="name-percent">Name + %</SelectItem>
                          <SelectItem value="percent">Percent only</SelectItem>
                          <SelectItem value="value">Value only</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <Label className="text-sm">Tooltip Format</Label>
                    <Select value={tooltipFormat} onValueChange={(v) => setTooltipFormat(v as typeof tooltipFormat)}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="value">Value</SelectItem>
                        <SelectItem value="value-percent">Value + %</SelectItem>
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
                  <div className="space-y-2 pl-4">
                    <Label className="text-sm">Legend Position</Label>
                    <Select value={legendPos} onValueChange={(v) => setLegendPos(v as typeof legendPos)}>
                      <SelectTrigger className="w-40">
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
          <pre className="w-full max-w-full overflow-x-auto rounded-lg bg-muted p-4 text-sm max-h-64 whitespace-pre">
            <code>{JSON.stringify(currentSource.data, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Documentation Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Raw Data */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Data Format</CardTitle>
            <CardDescription>Required data structure for PieChart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              <code>{`// Array of objects with label + numeric fields
const data = [
  { label: 'Desktop', value: 600 },
  { label: 'Mobile', value: 260 },
  { label: 'Tablet', value: 90 },
  { label: 'Other', value: 50 },
]

// Colors via Cell components
{data.map((entry, i) => (
  <Cell key={i} fill={colors[i % colors.length]} />
))}`}</code>
            </pre>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Requirements:</p>
              <ul className="list-disc list-inside text-muted-foreground">
                <li><strong>nameKey</strong> - Label for each slice (string)</li>
                <li><strong>dataKey</strong> - Numeric value for slice size</li>
                <li><strong>Positive values</strong> - Use <code className="text-xs">minAngle</code> to reduce slivers</li>
                <li><strong>Colors</strong> - Provide <code className="text-xs">Cell</code> elements for per-slice colors</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Configurable Props */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Configurable Properties</CardTitle>
            <CardDescription>Native Recharts props - what you can customize</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Pie Component</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">dataKey</code> / <code className="text-xs">nameKey</code> - Slice size & label fields</li>
                <li><code className="text-xs">innerRadius / outerRadius</code> - Donut vs pie size</li>
                <li><code className="text-xs">paddingAngle</code> / <code className="text-xs">cornerRadius</code> - Gaps & rounded edges</li>
                <li><code className="text-xs">startAngle / endAngle</code> - Slice span</li>
                <li><code className="text-xs">minAngle</code> - Prevent tiny slivers</li>
                <li><code className="text-xs">isAnimationActive</code> - Toggle animation</li>
                <li><code className="text-xs">label / labelLine</code> - Show labels & connectors</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">PieChart Container</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">margin</code> - Padding around the chart</li>
                <li><code className="text-xs">Tooltip</code> - Hover details</li>
                <li><code className="text-xs">strokeDasharray</code> - Dashed pattern (&quot;5 5&quot;)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>✅ Best Practices</CardTitle>
            <CardDescription>Quick guidance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Keep slices to 5-8 for readability; combine “Other” if needed</li>
              <li>Use donut (innerRadius &gt; 0) when comparing multiple pies side-by-side</li>
              <li>Leverage <code className="text-xs">minAngle</code> to avoid hairline slices</li>
              <li>Use labels sparingly; tooltips + legend often suffice</li>
            </ul>
          </CardContent>
        </Card>

        {/* When to Use */}
        <Card>
          <CardHeader>
            <CardTitle>💡 When to use</CardTitle>
            <CardDescription>Pick PieChart over other charts when…</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Showing part-to-whole proportions</li>
              <li>Comparing a handful of categories</li>
              <li>Need a compact, at-a-glance distribution</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Understanding Fields */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>📐 Understanding nameKey & dataKey</CardTitle>
          <CardDescription>How data maps to slices and legend</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium">nameKey (Label)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Purpose:</strong> Display name for each slice</li>
                <li><strong>Type:</strong> String (e.g., category, channel, region)</li>
                <li><strong>Legend:</strong> Legend items come from nameKey</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">dataKey (Value)</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Purpose:</strong> Numeric size of each slice</li>
                <li><strong>Type:</strong> Number (counts, revenue, CTR, etc.)</li>
                <li><strong>Example:</strong> <code className="text-xs">value</code>, <code className="text-xs">users</code>, <code className="text-xs">revenue</code>, <code className="text-xs">ctr</code></li>
              </ul>
            </div>
          </div>
          <Separator />
          <div className="rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-3 text-xs text-muted-foreground">
            <p><strong className="text-blue-700 dark:text-blue-400">Tip:</strong> Switch value fields (e.g., revenue vs customers) to see slice proportions change without touching labels.</p>
          </div>
        </CardContent>
      </Card>

      {/* Individual vs Global */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>🎛️ Individual Slice vs Global Chart Settings</CardTitle>
          <CardDescription>What can be customized per-slice vs chart-wide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <p className="font-medium">CAN be set per Slice</p>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><code className="text-xs">fill</code> (Cell color)</li>
                <li><code className="text-xs">dataKey</code>/<code className="text-xs">nameKey</code> selection (via Data tab)</li>
                <li>Enable/disable slices (Slices tab)</li>
                <li>Labels when enabled</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <p className="font-medium">Chart-level ONLY</p>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><code className="text-xs">margin</code></li>
                <li><code className="text-xs">Tooltip</code></li>
                <li><code className="text-xs">Legend</code></li>
                <li><code className="text-xs">paddingAngle</code>, <code className="text-xs">cornerRadius</code></li>
                <li><code className="text-xs">startAngle</code>/<code className="text-xs">endAngle</code>/<code className="text-xs">minAngle</code></li>
                <li><code className="text-xs">isAnimationActive</code></li>
              </ul>
            </div>
          </div>
          <Separator />
          <div className="rounded border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-3 text-xs text-muted-foreground">
            Global settings live in Data/Shape/Display; slice toggles live in Slices. Colors are controlled by Cells; (optional) per-slice color pickers can be added in Slices if needed.
          </div>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>💡 Key Insight</CardTitle>
          <CardDescription>Why PieChart is useful for your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="font-medium">PieChart is ideal for showing part-to-whole relationships and comparing proportions of different categories.</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Use it to display how different categories contribute to a whole.</li>
            <li>Compare the size of different slices to understand the distribution of your data.</li>
            <li>Use the legend to identify the different categories and their corresponding colors.</li>
            <li><strong>Labels:</strong> Turn on <em>Show Labels</em> in Display, then refine per-slice (toggle + format) in Slices; formats include name+value, name+%, % only, value only.</li>
            <li><strong>Tooltip & Legend:</strong> Tooltip can show value or value+%; legend position top/bottom.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
