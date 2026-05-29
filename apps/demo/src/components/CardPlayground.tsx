import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
  Badge,
  Progress,
  Skeleton,
} from '@acronis-platform/shadcn-uikit/react'
import {
  ClockIcon,
  ShoppingCartIcon,
  ShowIcon,
  UsersIcon,
} from '@acronis-platform/shadcn-uikit'
import {
  ActivityIcon,
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  BarChart3Icon,
  DollarSignIcon,
  MinusIcon,
  PercentIcon,
  TargetIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  ZapIcon,
} from '@/components/icons/missing-icons'
// ─── Types ───────────────────────────────────────────────────────────────────

type TrendDirection = 'up' | 'down' | 'neutral'
type ValueFormat = 'number' | 'currency' | 'percent' | 'compact' | 'custom'
type IconPosition = 'left' | 'right'
type IconStyle = 'circle' | 'square' | 'plain'
type ValueSize = 'sm' | 'md' | 'lg' | 'xl'
type ShadowSize = 'none' | 'sm' | 'md' | 'lg' | 'xl'
type BorderAccent = 'none' | 'left' | 'top'
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'info' | 'warning' | 'critical' | 'danger' | 'neutral'
type FooterStyle = 'text' | 'progress' | 'sparkline' | 'comparison'

interface KpiPreset {
  name: string
  title: string
  value: number
  format: ValueFormat
  prefix: string
  suffix: string
  decimals: number
  trendValue: number
  trendDirection: TrendDirection
  comparisonText: string
  icon: string
  iconColor: string
  badgeText: string
  badgeVariant: BadgeVariant
  progressValue: number
  sparklineData: number[]
  description: string
}

// ─── Presets ─────────────────────────────────────────────────────────────────

const kpiPresets: Record<string, KpiPreset> = {
  revenue: {
    name: 'Total Revenue',
    title: 'Total Revenue',
    value: 45231.89,
    format: 'currency',
    prefix: '$',
    suffix: '',
    decimals: 2,
    trendValue: 20.1,
    trendDirection: 'up',
    comparisonText: 'from last month',
    icon: 'DollarSignIcon',
    iconColor: '#16a34a',
    badgeText: 'Live',
    badgeVariant: 'success',
    progressValue: 72,
    sparklineData: [20, 25, 30, 22, 35, 40, 38, 45, 50, 48, 55, 60],
    description: 'Monthly recurring revenue',
  },
  users: {
    name: 'Active Users',
    title: 'Active Users',
    value: 2350,
    format: 'number',
    prefix: '',
    suffix: '',
    decimals: 0,
    trendValue: 12.5,
    trendDirection: 'up',
    comparisonText: 'from last week',
    icon: 'Users',
    iconColor: '#2563eb',
    badgeText: 'Growing',
    badgeVariant: 'info',
    progressValue: 85,
    sparklineData: [100, 120, 115, 130, 145, 160, 155, 170, 180, 200, 210, 235],
    description: 'Daily active users',
  },
  conversion: {
    name: 'Conversion Rate',
    title: 'Conversion Rate',
    value: 3.24,
    format: 'percent',
    prefix: '',
    suffix: '%',
    decimals: 2,
    trendValue: -0.4,
    trendDirection: 'down',
    comparisonText: 'from last month',
    icon: 'TargetIcon',
    iconColor: '#dc2626',
    badgeText: 'Needs attention',
    badgeVariant: 'warning',
    progressValue: 32,
    sparklineData: [4.2, 3.8, 3.9, 3.5, 3.6, 3.4, 3.2, 3.3, 3.1, 3.0, 3.2, 3.24],
    description: 'Visitor to customer rate',
  },
  orders: {
    name: 'Total Orders',
    title: 'Total Orders',
    value: 12543,
    format: 'compact',
    prefix: '',
    suffix: '',
    decimals: 0,
    trendValue: 8.2,
    trendDirection: 'up',
    comparisonText: 'vs previous period',
    icon: 'ShoppingCartIcon',
    iconColor: '#9333ea',
    badgeText: 'On track',
    badgeVariant: 'default',
    progressValue: 68,
    sparklineData: [800, 950, 1100, 980, 1050, 1200, 1150, 1300, 1280, 1350, 1400, 1543],
    description: 'Orders this quarter',
  },
  performance: {
    name: 'System Uptime',
    title: 'System Uptime',
    value: 99.97,
    format: 'custom',
    prefix: '',
    suffix: '%',
    decimals: 2,
    trendValue: 0,
    trendDirection: 'neutral',
    comparisonText: 'last 30 days',
    icon: 'ActivityIcon',
    iconColor: '#0891b2',
    badgeText: 'Healthy',
    badgeVariant: 'success',
    progressValue: 99,
    sparklineData: [99.9, 99.95, 99.99, 99.98, 99.97, 100, 99.99, 99.95, 99.97, 99.98, 99.99, 99.97],
    description: 'Service availability',
  },
  pageViews: {
    name: 'Page Views',
    title: 'Page Views',
    value: 573291,
    format: 'compact',
    prefix: '',
    suffix: '',
    decimals: 0,
    trendValue: 15.3,
    trendDirection: 'up',
    comparisonText: 'from last month',
    icon: 'Eye',
    iconColor: '#ea580c',
    badgeText: 'Trending',
    badgeVariant: 'info',
    progressValue: 54,
    sparklineData: [30000, 35000, 42000, 38000, 45000, 50000, 48000, 52000, 55000, 58000, 61000, 57329],
    description: 'Total page impressions',
  },
}

type PresetKey = keyof typeof kpiPresets

// ─── Constants ───────────────────────────────────────────────────────────────

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  DollarSignIcon,
  UsersIcon,
  ShoppingCartIcon,
  ActivityIcon,
  ZapIcon,
  ShowIcon,
  BarChart3Icon,
  ClockIcon,
  TargetIcon,
  PercentIcon,
};

const iconOptions = Object.keys(iconMap)

const shadowClasses: Record<ShadowSize, string> = {
  none: '',
  sm: 'shadow-xs',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
}

const valueSizeClasses: Record<ValueSize, string> = {
  sm: 'text-xl font-bold',
  md: 'text-2xl font-bold',
  lg: 'text-3xl font-bold',
  xl: 'text-4xl font-bold',
}

const badgeVariants: BadgeVariant[] = [
  'default', 'secondary', 'destructive', 'outline',
  'success', 'info', 'warning', 'critical', 'danger', 'neutral',
]

// ─── Component ───────────────────────────────────────────────────────────────

export function CardPlayground() {
  // ── Preset ──────────────────────────────────────────────────────────────
  const [preset, setPreset] = React.useState<PresetKey>('revenue')
  const currentPreset = kpiPresets[preset]

  // ── KPI Data ────────────────────────────────────────────────────────────
  const [title, setTitle] = React.useState(currentPreset.title)
  const [value, setValue] = React.useState(currentPreset.value)
  const [valueFormat, setValueFormat] = React.useState<ValueFormat>(currentPreset.format)
  const [prefix, setPrefix] = React.useState(currentPreset.prefix)
  const [suffix, setSuffix] = React.useState(currentPreset.suffix)
  const [decimals, setDecimals] = React.useState(currentPreset.decimals)
  const [description, setDescription] = React.useState(currentPreset.description)

  // ── Trend ───────────────────────────────────────────────────────────────
  const [showTrend, setShowTrend] = React.useState(true)
  const [trendValue, setTrendValue] = React.useState(currentPreset.trendValue)
  const [trendDirection, setTrendDirection] = React.useState<TrendDirection>(currentPreset.trendDirection)
  const [comparisonText, setComparisonText] = React.useState(currentPreset.comparisonText)
  const [trendColorAuto, setTrendColorAuto] = React.useState(true)
  const [trendColor, setTrendColor] = React.useState('#16a34a')
  const [trendStyle, setTrendStyle] = React.useState<'icon-text' | 'arrow' | 'badge'>('icon-text')

  // ── Icon ────────────────────────────────────────────────────────────────
  const [showIcon, setShowIcon] = React.useState(true)
  const [selectedIcon, setSelectedIcon] = React.useState(currentPreset.icon)
  const [iconPosition, setIconPosition] = React.useState<IconPosition>('right')
  const [iconStyle, setIconStyle] = React.useState<IconStyle>('circle')
  const [iconColor, setIconColor] = React.useState(currentPreset.iconColor)
  const [iconBgOpacity, setIconBgOpacity] = React.useState(0.1)

  // ── Badge ───────────────────────────────────────────────────────────────
  const [showBadge, setShowBadge] = React.useState(false)
  const [badgeText, setBadgeText] = React.useState(currentPreset.badgeText)
  const [badgeVariant, setBadgeVariant] = React.useState<BadgeVariant>(currentPreset.badgeVariant)

  // ── Footer ──────────────────────────────────────────────────────────────
  const [showFooter, setShowFooter] = React.useState(true)
  const [footerStyle, setFooterStyle] = React.useState<FooterStyle>('text')
  const [footerText, setFooterText] = React.useState('Updated just now')
  const [progressValue, setProgressValue] = React.useState(currentPreset.progressValue)
  const [progressLabel, setProgressLabel] = React.useState('of target')
  const [showComparisonValues, setShowComparisonValues] = React.useState(false)
  const sparklineData = currentPreset.sparklineData

  // ── Card Style ──────────────────────────────────────────────────────────
  const [shadow, setShadow] = React.useState<ShadowSize>('sm')
  const [hoverable, setHoverable] = React.useState(false)
  const [cardWidth, setCardWidth] = React.useState(350)
  const [valueSize, setValueSize] = React.useState<ValueSize>('lg')
  const [borderAccent, setBorderAccent] = React.useState<BorderAccent>('none')
  const [accentColor, setAccentColor] = React.useState(currentPreset.iconColor)
  const [showDescription, setShowDescription] = React.useState(true)
  const [showSkeleton, setShowSkeleton] = React.useState(false)
  const [compactMode, setCompactMode] = React.useState(false)

  // ── Sync preset ─────────────────────────────────────────────────────────
  React.useEffect(() => {
    const p = kpiPresets[preset]
    setTitle(p.title)
    setValue(p.value)
    setValueFormat(p.format)
    setPrefix(p.prefix)
    setSuffix(p.suffix)
    setDecimals(p.decimals)
    setDescription(p.description)
    setTrendValue(p.trendValue)
    setTrendDirection(p.trendDirection)
    setComparisonText(p.comparisonText)
    setSelectedIcon(p.icon)
    setIconColor(p.iconColor)
    setBadgeText(p.badgeText)
    setBadgeVariant(p.badgeVariant)
    setProgressValue(p.progressValue)
    setAccentColor(p.iconColor)
  }, [preset])

  // ── Helpers ─────────────────────────────────────────────────────────────

  const formatValue = (v: number): string => {
    switch (valueFormat) {
      case 'currency': return `${prefix}${v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`
      case 'percent': return `${v.toFixed(decimals)}${suffix || '%'}`
      case 'compact': {
        const formatted = v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(1)}K` : v.toLocaleString()
        return `${prefix}${formatted}${suffix}`
      }
      case 'custom': return `${prefix}${v.toFixed(decimals)}${suffix}`
      default: return `${prefix}${v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`
    }
  }

  const getTrendColorValue = (): string => {
    if (!trendColorAuto) return trendColor
    if (trendDirection === 'up') return '#16a34a'
    if (trendDirection === 'down') return '#dc2626'
    return '#6b7280'
  }

  const getTrendIcon = () => {
    if (trendStyle === 'arrow') {
      if (trendDirection === 'up') return <ArrowUpRightIcon className="h-4 w-4" />
      if (trendDirection === 'down') return <ArrowDownRightIcon className="h-4 w-4" />
      return <MinusIcon className="h-4 w-4" />
    }
    if (trendDirection === 'up') return <TrendingUpIcon className="h-4 w-4" />
    if (trendDirection === 'down') return <TrendingDownIcon className="h-4 w-4" />
    return <MinusIcon className="h-4 w-4" />
  }

  const IconComponent = iconMap[selectedIcon] ?? DollarSignIcon

  const renderSparkline = () => {
    if (!sparklineData.length) return null
    const max = Math.max(...sparklineData)
    const min = Math.min(...sparklineData)
    const range = max - min || 1
    const w = 120
    const h = 32
    const points = sparklineData.map((v, i) => {
      const x = (i / (sparklineData.length - 1)) * w
      const y = h - ((v - min) / range) * h
      return `${x},${y}`
    }).join(' ')
    return (
      <svg width={w} height={h} className="mt-1">
        <polyline
          points={points}
          fill="none"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  // ── Card class builder ──────────────────────────────────────────────────

  const buildCardClasses = (): string => {
    const cls: string[] = [shadowClasses[shadow]]
    if (hoverable) cls.push('cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5')
    if (borderAccent === 'none') cls.push('')
    return cls.filter(Boolean).join(' ')
  }

  const buildCardStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = { width: `${cardWidth}px` }
    if (borderAccent === 'left') {
      style.borderLeftWidth = '4px'
      style.borderLeftColor = accentColor
    }
    if (borderAccent === 'top') {
      style.borderTopWidth = '3px'
      style.borderTopColor = accentColor
    }
    return style
  }

  // ── Code generation ─────────────────────────────────────────────────────

  const generateCode = () => {
    const lines: string[] = []
    const cls = buildCardClasses().trim()
    const clsAttr = cls ? ` className="${cls}"` : ''
    const styleStr = borderAccent !== 'none' ? ` style={{ borderLeft${borderAccent === 'left' ? 'Width: "4px", borderLeftColor' : 'TopWidth: "3px", borderTopColor'}: "${accentColor}" }}` : ''
    lines.push(`<Card${clsAttr}${styleStr}>`)

    const pad = compactMode ? 'p-4' : 'p-6'
    lines.push(`  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ${pad}">`)
    lines.push(`    <div>`)
    lines.push(`      <CardTitle className="text-sm font-medium">${title}</CardTitle>`)
    if (showDescription) {
      lines.push(`      <CardDescription>${description}</CardDescription>`)
    }
    lines.push(`    </div>`)
    if (showIcon) {
      lines.push(`    <div className="rounded-${iconStyle === 'square' ? 'md' : 'full'} p-2" style={{ background: "${iconColor}1a" }}>`)
      lines.push(`      <${selectedIcon} className="h-4 w-4" style={{ color: "${iconColor}" }} />`)
      lines.push(`    </div>`)
    }
    if (showBadge) {
      lines.push(`    <Badge variant="${badgeVariant}">${badgeText}</Badge>`)
    }
    lines.push(`  </CardHeader>`)

    lines.push(`  <CardContent className="${compactMode ? 'px-4 pb-2' : ''}">`)
    lines.push(`    <div className="${valueSizeClasses[valueSize]}">${formatValue(value)}</div>`)
    if (showTrend) {
      lines.push(`    <p className="text-xs flex items-center gap-1 mt-1" style={{ color: "${getTrendColorValue()}" }}>`)
      lines.push(`      <TrendingUpIcon className="h-4 w-4" />`)
      lines.push(`      ${trendValue >= 0 ? '+' : ''}${trendValue}% ${comparisonText}`)
      lines.push(`    </p>`)
    }
    lines.push(`  </CardContent>`)

    if (showFooter) {
      lines.push(`  <CardFooter className="text-xs text-muted-foreground ${compactMode ? 'px-4 pb-4' : ''}">`)
      if (footerStyle === 'progress') {
        lines.push(`    <div className="w-full space-y-1">`)
        lines.push(`      <div className="flex justify-between">`)
        lines.push(`        <span>${progressValue}% ${progressLabel}</span>`)
        lines.push(`      </div>`)
        lines.push(`      <Progress value={${progressValue}} className="h-2" />`)
        lines.push(`    </div>`)
      } else if (footerStyle === 'sparkline') {
        lines.push(`    {/* SVG sparkline */}`)
      } else {
        lines.push(`    ${footerText}`)
      }
      lines.push(`  </CardFooter>`)
    }

    lines.push(`</Card>`)
    return lines.join('\n')
  }

  // ── Render KPI Card ─────────────────────────────────────────────────────

  const renderKpiCard = () => {
    if (showSkeleton) {
      return (
        <Card className={buildCardClasses()} style={buildCardStyle()}>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${compactMode ? 'p-4' : ''}`}>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              {showDescription && <Skeleton className="h-3 w-32" />}
            </div>
            {showIcon && <Skeleton className="h-9 w-9 rounded-full" />}
          </CardHeader>
          <CardContent className={compactMode ? 'px-4 pb-2' : ''}>
            <Skeleton className="h-8 w-32" />
            {showTrend && <Skeleton className="h-3 w-40 mt-2" />}
          </CardContent>
          {showFooter && (
            <CardFooter className={compactMode ? 'px-4 pb-4' : ''}>
              <Skeleton className="h-3 w-24" />
            </CardFooter>
          )}
        </Card>
      )
    }

    const iconEl = showIcon && (
      <div
        className={`flex items-center justify-center p-2 ${iconStyle === 'circle' ? 'rounded-full' : iconStyle === 'square' ? 'rounded-md' : ''}`}
        style={iconStyle !== 'plain' ? { backgroundColor: `${iconColor}${Math.round(iconBgOpacity * 255).toString(16).padStart(2, '0')}` } : undefined}
      >
        {React.createElement(IconComponent as React.ComponentType<any>, { className: "h-4 w-4", style: { color: iconColor } })}
      </div>
    )

    const trendEl = showTrend && (
      <p className="text-xs flex items-center gap-1 mt-1" style={{ color: getTrendColorValue() }}>
        {trendStyle === 'badge' ? (
          <Badge variant={trendDirection === 'up' ? 'success' : trendDirection === 'down' ? 'destructive' : 'secondary'} className="text-[10px] px-1.5 py-0">
            {getTrendIcon()}
            <span className="ml-0.5">{trendValue >= 0 ? '+' : ''}{trendValue}%</span>
          </Badge>
        ) : (
          <>
            {getTrendIcon()}
            <span>{trendValue >= 0 ? '+' : ''}{trendValue}% {comparisonText}</span>
          </>
        )}
      </p>
    )

    return (
      <Card className={buildCardClasses()} style={buildCardStyle()}>
        <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${compactMode ? 'p-4' : ''}`}>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {iconPosition === 'left' && iconEl}
              <div>
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {showDescription && <CardDescription className="text-xs">{description}</CardDescription>}
              </div>
            </div>
          </div>
          {showBadge && <Badge variant={badgeVariant}>{badgeText}</Badge>}
          {iconPosition === 'right' && iconEl}
        </CardHeader>
        <CardContent className={compactMode ? 'px-4 pb-2' : ''}>
          <div className={valueSizeClasses[valueSize]}>{formatValue(value)}</div>
          {trendEl}
        </CardContent>
        {showFooter && (
          <CardFooter className={`text-xs text-muted-foreground ${compactMode ? 'px-4 pb-4' : ''}`}>
            {footerStyle === 'progress' && (
              <div className="w-full space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{progressValue}% {progressLabel}</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
            )}
            {footerStyle === 'sparkline' && (
              <div className="w-full">
                {renderSparkline()}
                <span className="text-xs text-muted-foreground mt-1 block">Last {sparklineData.length} periods</span>
              </div>
            )}
            {footerStyle === 'comparison' && showComparisonValues && (
              <div className="w-full flex justify-between">
                <span>Current: {formatValue(value)}</span>
                <span>Previous: {formatValue(value / (1 + trendValue / 100))}</span>
              </div>
            )}
            {footerStyle === 'comparison' && !showComparisonValues && (
              <span>{footerText}</span>
            )}
            {footerStyle === 'text' && <span>{footerText}</span>}
          </CardFooter>
        )}
      </Card>
    )
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">KPI Card Playground</h2>
        <p className="text-muted-foreground">
          Dashboard KPI widget card - configure every aspect of your key performance indicator
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* ── Live Preview ───────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>Card updates as you change settings</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[400px] bg-muted/30 rounded-lg">
            {renderKpiCard()}
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
                <TabsTrigger value="trend">Trend</TabsTrigger>
                <TabsTrigger value="visual">Visual</TabsTrigger>
                <TabsTrigger value="card">Card</TabsTrigger>
              </TabsList>

              {/* ─── Tab: Data ──────────────────────────────────────── */}
              <TabsContent value="data" className="space-y-4 pt-4">
                {/* Preset */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">KPI Preset</Label>
                  <Select value={preset} onValueChange={(v) => setPreset(v as PresetKey)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(kpiPresets).map(([key, p]) => (
                        <SelectItem key={key} value={key}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Title */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-8" />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Description</Label>
                    <Switch checked={showDescription} onCheckedChange={setShowDescription} />
                  </div>
                  {showDescription && (
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} className="h-8" />
                  )}
                </div>

                <Separator />

                {/* Value */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Value</Label>
                  <Input type="number" value={value} onChange={(e) => setValue(Number(e.target.value) || 0)} className="h-8" />
                </div>

                {/* Format */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Format</Label>
                  <Select value={valueFormat} onValueChange={(v) => setValueFormat(v as ValueFormat)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="number">Number (1,234)</SelectItem>
                      <SelectItem value="currency">Currency ($1,234.56)</SelectItem>
                      <SelectItem value="percent">PercentIcon (12.5%)</SelectItem>
                      <SelectItem value="compact">Compact (1.2K)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Prefix</Label>
                    <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Suffix</Label>
                    <Input value={suffix} onChange={(e) => setSuffix(e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Decimals</Label>
                    <Input type="number" value={decimals} onChange={(e) => setDecimals(Number(e.target.value) || 0)} min={0} max={6} className="h-7 text-xs" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Preview: {formatValue(value)}</p>
              </TabsContent>

              {/* ─── Tab: Trend ─────────────────────────────────────── */}
              <TabsContent value="trend" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Trend</Label>
                    <p className="text-xs text-muted-foreground">Change indicator below value</p>
                  </div>
                  <Switch checked={showTrend} onCheckedChange={setShowTrend} />
                </div>

                {showTrend && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Direction</Label>
                      <Select value={trendDirection} onValueChange={(v) => setTrendDirection(v as TrendDirection)}>
                        <SelectTrigger className="w-28 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="up">Up</SelectItem>
                          <SelectItem value="down">Down</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Value (%)</Label>
                      <Input type="number" value={trendValue} onChange={(e) => setTrendValue(Number(e.target.value) || 0)} step={0.1} className="w-24 h-8" />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm">Comparison Text</Label>
                      <Input value={comparisonText} onChange={(e) => setComparisonText(e.target.value)} className="h-8" />
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <Label className="text-sm">Style</Label>
                      <Select value={trendStyle} onValueChange={(v) => setTrendStyle(v as typeof trendStyle)}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="icon-text">Icon + Text</SelectItem>
                          <SelectItem value="arrow">Arrow Icon</SelectItem>
                          <SelectItem value="badge">Badge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Auto Color</Label>
                        <p className="text-xs text-muted-foreground">Green=up, Red=down, Gray=neutral</p>
                      </div>
                      <Switch checked={trendColorAuto} onCheckedChange={setTrendColorAuto} />
                    </div>
                    {!trendColorAuto && (
                      <div className="flex items-center gap-2 pl-4">
                        <input type="color" value={trendColor} onChange={(e) => setTrendColor(e.target.value)} className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                        <Input type="text" value={trendColor} onChange={(e) => setTrendColor(e.target.value)} className="flex-1 h-8" />
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              {/* ─── Tab: Visual ────────────────────────────────────── */}
              <TabsContent value="visual" className="space-y-4 pt-4">
                {/* Icon */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Icon</Label>
                    <p className="text-xs text-muted-foreground">Decorative metric icon</p>
                  </div>
                  <Switch checked={showIcon} onCheckedChange={setShowIcon} />
                </div>
                {showIcon && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <Label className="text-sm">Icon</Label>
                      <Select value={selectedIcon} onValueChange={setSelectedIcon}>
                        <SelectTrigger className="w-36 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((ic) => (
                            <SelectItem key={ic} value={ic}>{ic}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <Label className="text-sm">Position</Label>
                      <Select value={iconPosition} onValueChange={(v) => setIconPosition(v as IconPosition)}>
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
                      <Label className="text-sm">Style</Label>
                      <Select value={iconStyle} onValueChange={(v) => setIconStyle(v as IconStyle)}>
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="circle">Circle</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="plain">Plain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1 pl-4">
                      <Label className="text-sm">Color</Label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={iconColor} onChange={(e) => setIconColor(e.target.value)} className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                        <Input type="text" value={iconColor} onChange={(e) => setIconColor(e.target.value)} className="flex-1 h-8" />
                      </div>
                    </div>
                    {iconStyle !== 'plain' && (
                      <div className="flex items-center justify-between pl-4">
                        <Label className="text-sm">Bg Opacity ({iconBgOpacity})</Label>
                        <Input type="number" value={iconBgOpacity} onChange={(e) => setIconBgOpacity(Math.min(1, Math.max(0, Number(e.target.value) || 0.1)))} step={0.05} min={0} max={1} className="w-20 h-8" />
                      </div>
                    )}
                  </>
                )}

                <Separator />

                {/* Badge */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Badge</Label>
                    <p className="text-xs text-muted-foreground">Status badge in header</p>
                  </div>
                  <Switch checked={showBadge} onCheckedChange={setShowBadge} />
                </div>
                {showBadge && (
                  <>
                    <div className="space-y-1 pl-4">
                      <Label className="text-sm">Text</Label>
                      <Input value={badgeText} onChange={(e) => setBadgeText(e.target.value)} className="h-8" />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <Label className="text-sm">Variant</Label>
                      <Select value={badgeVariant} onValueChange={(v) => setBadgeVariant(v as BadgeVariant)}>
                        <SelectTrigger className="w-28 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {badgeVariants.map((bv) => (
                            <SelectItem key={bv} value={bv}>{bv}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Separator />

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Footer</Label>
                    <p className="text-xs text-muted-foreground">Bottom section of card</p>
                  </div>
                  <Switch checked={showFooter} onCheckedChange={setShowFooter} />
                </div>
                {showFooter && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <Label className="text-sm">Footer Style</Label>
                      <Select value={footerStyle} onValueChange={(v) => setFooterStyle(v as FooterStyle)}>
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="progress">Progress Bar</SelectItem>
                          <SelectItem value="sparkline">Sparkline</SelectItem>
                          <SelectItem value="comparison">Comparison</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {footerStyle === 'text' && (
                      <div className="space-y-1 pl-4">
                        <Label className="text-sm">Footer Text</Label>
                        <Input value={footerText} onChange={(e) => setFooterText(e.target.value)} className="h-8" />
                      </div>
                    )}
                    {footerStyle === 'progress' && (
                      <>
                        <div className="flex items-center justify-between pl-4">
                          <Label className="text-sm">Progress (%)</Label>
                          <Input type="number" value={progressValue} onChange={(e) => setProgressValue(Math.min(100, Math.max(0, Number(e.target.value) || 0)))} min={0} max={100} className="w-20 h-8" />
                        </div>
                        <div className="space-y-1 pl-4">
                          <Label className="text-sm">Label</Label>
                          <Input value={progressLabel} onChange={(e) => setProgressLabel(e.target.value)} className="h-8" />
                        </div>
                      </>
                    )}
                    {footerStyle === 'comparison' && (
                      <div className="flex items-center justify-between pl-4">
                        <Label className="text-sm">Show Values</Label>
                        <Switch checked={showComparisonValues} onCheckedChange={setShowComparisonValues} />
                      </div>
                    )}
                  </>
                )}

                <Separator />

                {/* Skeleton */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Loading State</Label>
                    <p className="text-xs text-muted-foreground">Show skeleton placeholder</p>
                  </div>
                  <Switch checked={showSkeleton} onCheckedChange={setShowSkeleton} />
                </div>
              </TabsContent>

              {/* ─── Tab: Card ──────────────────────────────────────── */}
              <TabsContent value="card" className="space-y-4 pt-4">
                {/* Width */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Width (px)</Label>
                  <Input type="number" value={cardWidth} onChange={(e) => setCardWidth(Number(e.target.value) || 350)} min={200} max={600} className="w-24 h-8" />
                </div>

                <Separator />

                {/* Value Size */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Value Size</Label>
                    <p className="text-xs text-muted-foreground">Font size of the KPI number</p>
                  </div>
                  <Select value={valueSize} onValueChange={(v) => setValueSize(v as ValueSize)}>
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">SM</SelectItem>
                      <SelectItem value="md">MD</SelectItem>
                      <SelectItem value="lg">LG</SelectItem>
                      <SelectItem value="xl">XL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Compact Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Compact Mode</Label>
                    <p className="text-xs text-muted-foreground">Reduced padding for dense layouts</p>
                  </div>
                  <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                </div>

                <Separator />

                {/* Shadow */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Shadow</Label>
                  <Select value={shadow} onValueChange={(v) => setShadow(v as ShadowSize)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Hover */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Hover Effect</Label>
                    <p className="text-xs text-muted-foreground">Lift and shadow on hover</p>
                  </div>
                  <Switch checked={hoverable} onCheckedChange={setHoverable} />
                </div>

                <Separator />

                {/* Border Accent */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Border Accent</Label>
                  <Select value={borderAccent} onValueChange={(v) => setBorderAccent(v as BorderAccent)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="top">Top</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {borderAccent !== 'none' && (
                  <div className="space-y-1 pl-4">
                    <Label className="text-sm">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                      <Input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="flex-1 h-8" />
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

      {/* ── Documentation ──────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>KPI Card Structure</CardTitle>
            <CardDescription>Composition pattern for dashboard widgets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              <code>{`import {
  Card, CardHeader, CardTitle,
  CardDescription, CardContent, CardFooter,
  Badge, Progress
} from '@acronis-platform/shadcn-uikit/react'
<Card>
  <CardHeader className="flex flex-row items-center
    justify-between space-y-0 pb-2">
    <div>
      <CardTitle className="text-sm font-medium">
        Total Revenue
      </CardTitle>
      <CardDescription>Monthly recurring</CardDescription>
    </div>
    <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">$45,231.89</div>
    <p className="text-xs text-green-600 flex items-center">
      <TrendingUpIcon className="h-4 w-4 mr-1" />
      +20.1% from last month
    </p>
  </CardContent>
  <CardFooter className="text-xs text-muted-foreground">
    Updated just now
  </CardFooter>
</Card>`}</code>
            </pre>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Components Used:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Card</strong> - Container with border, background, and shadow</li>
                <li><strong>CardHeader</strong> - Title + icon row with flex layout</li>
                <li><strong>CardTitle</strong> - Metric name (use text-sm font-medium for KPI)</li>
                <li><strong>CardDescription</strong> - Optional subtitle or context</li>
                <li><strong>CardContent</strong> - Value + trend indicator</li>
                <li><strong>CardFooter</strong> - Timestamp, progress bar, or sparkline</li>
                <li><strong>Badge</strong> - Status indicator (10 variants available)</li>
                <li><strong>Progress</strong> - TargetIcon completion bar</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurable Properties</CardTitle>
            <CardDescription>All settings exposed in this playground</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">KPI Data</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><strong>title</strong> - Metric name displayed in header</li>
                <li><strong>value</strong> - The KPI number</li>
                <li><strong>format</strong> - number / currency / percent / compact / custom</li>
                <li><strong>prefix / suffix</strong> - Characters around the value ($, %, etc.)</li>
                <li><strong>decimals</strong> - Decimal places (0-6)</li>
                <li><strong>description</strong> - Context text below title</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Trend Indicator</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><strong>direction</strong> - up (green) / down (red) / neutral (gray)</li>
                <li><strong>value</strong> - Percentage change</li>
                <li><strong>style</strong> - icon-text / arrow / badge</li>
                <li><strong>comparison text</strong> - &quot;from last month&quot;, etc.</li>
                <li><strong>color</strong> - Auto or custom hex color</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Icon</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><strong>icon</strong> - Lucide icon selection</li>
                <li><strong>position</strong> - Left or right of title</li>
                <li><strong>style</strong> - Circle / square / plain background</li>
                <li><strong>color + opacity</strong> - Icon and background tint</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Footer</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><strong>text</strong> - Simple text like &quot;Updated just now&quot;</li>
                <li><strong>progress</strong> - Bar with % and label</li>
                <li><strong>sparkline</strong> - Mini trend line (SVG)</li>
                <li><strong>comparison</strong> - Current vs previous values</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Styling</CardTitle>
            <CardDescription>Visual customization via className and style</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Shadow</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">shadow-none</code> - Flat appearance</li>
                <li><code className="text-xs">shadow-xs</code> - Subtle (default for KPI)</li>
                <li><code className="text-xs">shadow-md / lg / xl</code> - Elevated appearance</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Border Accent</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">borderLeftWidth: 4px</code> - Left color strip</li>
                <li><code className="text-xs">borderTopWidth: 3px</code> - Top color strip</li>
                <li>Color ties to the metric category or severity</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Interactive States</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">hover:shadow-lg hover:-translate-y-0.5</code> - Lift effect</li>
                <li><code className="text-xs">cursor-pointer transition-all</code> - Clickable appearance</li>
                <li>Loading skeleton via Skeleton component</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Value Size Classes</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><code className="text-xs">text-xl</code> (SM) - Compact dashboards</li>
                <li><code className="text-xs">text-2xl</code> (MD) - Standard</li>
                <li><code className="text-xs">text-3xl</code> (LG) - Default KPI</li>
                <li><code className="text-xs">text-4xl</code> (XL) - Hero metrics</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badge Variants</CardTitle>
            <CardDescription>All 10 built-in variants for status indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-2">
              {badgeVariants.map((bv) => (
                <Badge key={bv} variant={bv}>{bv}</Badge>
              ))}
            </div>
            <Separator />
            <div className="space-y-2 text-muted-foreground">
              <p><strong>default</strong> - Primary brand color, general purpose</p>
              <p><strong>secondary</strong> - Subdued background, less emphasis</p>
              <p><strong>destructive</strong> - Red, errors or critical alerts</p>
              <p><strong>outline</strong> - Border only, minimal visual weight</p>
              <p><strong>success</strong> - Green, positive status</p>
              <p><strong>info</strong> - Blue, informational context</p>
              <p><strong>warning</strong> - Yellow/amber, needs attention</p>
              <p><strong>critical</strong> - Critical severity level</p>
              <p><strong>danger</strong> - Red destructive variant</p>
              <p><strong>neutral</strong> - Gray, inactive or default state</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitations</CardTitle>
            <CardDescription>What KPI cards cannot do out of the box</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No built-in chart integration</strong> - Sparklines require custom SVG or recharts</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No data fetching</strong> - Values must be supplied from external state/API</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No real-time updates</strong> - Need polling, WebSocket, or SSE integration</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No built-in drill-down</strong> - Use onClick + router for detail navigation</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No responsive breakpoints</strong> - Card width is fixed, use grid for responsiveness</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">-</span>
                <span><strong>No animation on value change</strong> - Use framer-motion or CSS transitions</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
            <CardDescription>When and how to use KPI cards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Ideal For:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Executive / admin dashboards (top-of-page metrics)</li>
                <li>SaaS analytics (MRR, MAU, churn, NPS)</li>
                <li>E-commerce (orders, revenue, conversion)</li>
                <li>System monitoring (uptime, latency, error rate)</li>
                <li>Sales pipelines (deals, pipeline value, win rate)</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Layout Tips:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Use 3-4 KPI cards in a row with equal widths</li>
                <li>Pair with grid-cols-2 md:grid-cols-4 for responsive</li>
                <li>Keep titles short (2-3 words max)</li>
                <li>Always include trend direction for context</li>
                <li>Use border accent to group by category</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Design Guidelines:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Value should be the largest / boldest element</li>
                <li>Title should be text-sm font-medium (not default CardTitle size)</li>
                <li>Use consistent icon style across all cards</li>
                <li>Limit badge usage to 1 per card max</li>
                <li>Choose one footer style and use it consistently</li>
                <li>Use compact mode for dense dashboards (&gt;6 cards)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
