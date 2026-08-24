'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import type { LegendPayload } from 'recharts/types/component/DefaultLegendContent';
import {
  NameType,
  Payload,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import type { Props as LegendProps } from 'recharts/types/component/Legend';
import { TooltipContentProps } from 'recharts/types/component/Tooltip';

import { cn } from '@/lib/utils';
import {
  resolveSeriesColor,
  type ChartPalette,
  type ChartSeriesTone,
} from './chart-palette';

// Format: { THEME_NAME: CSS_SELECTOR }. ui-react flips light/dark via the
// `[data-theme]` attribute (the tokens resolve `light-dark()` through
// `color-scheme`), not the legacy `.dark` class — so per-series `theme` colors
// scope their dark value under `[data-theme='dark']`.
const THEMES = { light: '', dark: "[data-theme='dark']" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    /**
     * Which stop of the container's `palette` this series paints with. Left
     * unset, it is assigned from the series' position. See `ChartSeriesTone`.
     */
    tone?: ChartSeriesTone;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

/**
 * Fill in each series' color from `palette`, leaving any series that already
 * states its own `color`/`theme` untouched.
 *
 * Exported for tests and for the widget editor, which needs the same resolved
 * map to detect duplicate colors (`findDuplicateTones`) without re-deriving it.
 */
export function resolveChartColors(
  config: ChartConfig,
  palette: ChartPalette
): ChartConfig {
  // A series that pins its own color doesn't consume a palette stop, so the
  // rest keep walking the palette in order instead of leaving a gap where it
  // sat.
  let index = 0;

  return Object.fromEntries(
    Object.entries(config).map(([key, item]) => {
      if (item.color || item.theme) {
        return [key, item];
      }

      const color = resolveSeriesColor(palette, {
        index: index++,
        tone: item.tone,
      });

      return [key, { ...item, color }];
    })
  );
}

type ChartContextProps = {
  config: ChartConfig;
};

/**
 * How a series is marked in the legend. A filled series reads as a square
 * swatch; a stroke-drawn one (line, area) as the line it paints — dashed when
 * the stroke is. The tooltip always dots its rows instead.
 */
type ChartSeriesMarker = 'swatch' | 'line' | 'dashed';

export type ChartTooltipContentProps = Partial<
  TooltipContentProps<ValueType, NameType>
> & {
  className?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  nameKey?: string;
  labelKey?: string;
  labelFormatter?: (
    label: TooltipContentProps<number, string>['label'],
    payload: TooltipContentProps<number, string>['payload']
  ) => React.ReactNode;
  formatter?: (
    value: number | string,
    name: string,
    item: Payload<number | string, string>,
    index: number,
    payload: ReadonlyArray<Payload<number | string, string>>
  ) => React.ReactNode;
  labelClassName?: string;
  color?: string;
};

export type ChartLegendContentProps = {
  className?: string;
  hideIcon?: boolean;
  verticalAlign?: LegendProps['verticalAlign'];
  payload?: LegendPayload[];
  nameKey?: string;
  /**
   * The series config the entries take their labels and icons from. Defaults to
   * the enclosing `ChartContainer`'s — pass it only to render the legend *outside*
   * the container, which a chart type has to do when the renderer can't lay a
   * legend out inside its plot (see `Treemap`).
   */
  config?: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

export interface ChartContainerProps extends React.ComponentProps<'div'> {
  config: ChartConfig;
  /**
   * The dataviz palette this chart's series are painted from. Each series
   * without its own `color` takes a stop of this palette — automatically from
   * its position, or the one its `tone` names.
   */
  palette?: ChartPalette;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children'];
}

function ChartContainer({
  id,
  className,
  children,
  config,
  palette,
  ...props
}: ChartContainerProps) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;
  // Resolved once and shared with the context, so the tooltip rows and legend
  // markers read the same colors the plot paints with.
  const resolvedConfig = React.useMemo(
    () => (palette ? resolveChartColors(config, palette) : config),
    [config, palette]
  );

  return (
    <ChartContext.Provider value={{ config: resolvedConfig }}>
      <div
        id={id}
        data-slot="chart"
        data-chart={chartId}
        // The `[stroke='#fff']` rules undo recharts' hardcoded white outlines —
        // on pie/radial sectors, line dots and funnel trapezoids. They don't
        // follow the theme, so in dark mode they read as a light hairline around
        // every segment.
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden [&_.recharts-trapezoid[stroke='#fff']]:stroke-transparent",
          // A `<Brush>` traveller is the one `.recharts-layer` that is a real
          // control (`role="slider"`, tabbable, arrow-key driven), so the blanket
          // `outline-hidden` above would leave it with no focus indicator. Restore
          // one — the `:focus-visible` pseudo-class outranks that rule, so this
          // wins regardless of the order Tailwind emits them in. An `outline`
          // rather than the usual `ring`: box-shadow doesn't paint on SVG children.
          '[&_.recharts-brush-traveller:focus-visible]:[outline:3px_solid_var(--ui-focus-primary)] [&_.recharts-brush-traveller:focus-visible]:[outline-offset:1px]',
          // recharts anchors its axis tick text with the *direction-relative*
          // SVG keywords (`text-anchor: start|end`, see `getTickTextAnchor` in
          // `CartesianAxis`), while placing every mark at a computed physical
          // coordinate. Inheriting `direction: rtl` therefore flips only the
          // text: an `end`-anchored Y tick mirrors about its anchor and lands
          // inside the plot (measured: +24px to +39px), rotated ticks shift
          // ~+15px, and a `ReferenceLine` label at the right edge overflows the
          // surface. Pinning the surface keeps the plot's own coordinate system
          // consistent with the geometry recharts computed for it. The chrome
          // that *should* mirror — tooltip and legend — is HTML outside
          // `.recharts-surface`, so it is unaffected.
          //
          // `Treemap` is the exception: its cell labels are HTML in a
          // `<foreignObject>` *inside* the surface, put there precisely so they
          // mirror with the page (see `treemap.tsx`). That is ordinary flow
          // layout, not a computed SVG coordinate, so the pin has to stop at the
          // `<foreignObject>` boundary and hand the page's direction back.
          '[&_.recharts-surface]:[direction:ltr] rtl:[&_.recharts-surface_foreignObject]:[direction:rtl]',
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={resolvedConfig} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  // Rendered as a text child (not dangerouslySetInnerHTML): React sets it via
  // textContent, which the browser does not HTML-parse, so a `</style>` in a
  // config color can't break out of the tag.
  return (
    <style>
      {Object.entries(THEMES)
        .map(
          ([theme, prefix]) => `
            ${prefix} [data-chart=${id}] {
            ${colorConfig
              .map(([key, itemConfig]) => {
                const color =
                  itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
                  itemConfig.color;
                return color ? `  --color-${key}: ${color};` : null;
              })
              .join('\n')}
            }
            `
        )
        .join('\n')}
    </style>
  );
};

/** The marker drawn next to a series' name in the legend. */
function SeriesMarker({
  marker,
  color,
  className,
}: {
  marker: ChartSeriesMarker;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'shrink-0',
        marker === 'swatch'
          ? 'h-2.5 w-2.5 rounded-sm'
          : 'h-[3px] w-4 rounded-full',
        className
      )}
      style={
        marker === 'dashed'
          ? {
              // A dashed stroke can't be drawn with a background color, so the
              // dash pattern is painted as a gradient.
              backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 7px)`,
            }
          : { backgroundColor: color }
      }
    />
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

/** The `content` a caller passes to override the default tooltip (recharts' `Tooltip['content']`). */
export type ChartTooltipContentType = React.ComponentProps<
  typeof ChartTooltip
>['content'];

/**
 * What `getPayloadConfigFromPayload` resolves a payload item to — the lookup can
 * miss, so every consumer has to cope with `undefined`. Derived from the helper
 * rather than restated, so the two can't drift.
 */
type ChartItemConfig = ReturnType<typeof getPayloadConfigFromPayload>;

/** One row of the tooltip's payload, after the `active`/empty guard. */
type ChartTooltipItem = NonNullable<
  ChartTooltipContentProps['payload']
>[number];

/**
 * One tooltip row. Its own three-way branching (caller formatter, config icon,
 * default dot) is what drove the nesting in `ChartTooltipContent`; as a
 * component the map body reads as a single element.
 */
function ChartTooltipRow({
  item,
  index,
  payload,
  itemConfig,
  indicatorColor,
  hideIndicator,
  formatter,
}: {
  item: ChartTooltipItem;
  index: number;
  payload: NonNullable<ChartTooltipContentProps['payload']>;
  itemConfig: ChartItemConfig;
  indicatorColor?: string;
  hideIndicator: boolean;
  formatter: ChartTooltipContentProps['formatter'];
}) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground">
      {formatter && item?.value !== undefined && item.name ? (
        formatter(item.value, item.name, item, index, payload)
      ) : (
        <>
          {itemConfig?.icon ? (
            <itemConfig.icon />
          ) : (
            !hideIndicator && (
              // A row is always dotted, whatever marker the legend
              // gives that series.
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: indicatorColor }}
              />
            )
          )}
          {/*
           * `gap-4` puts a floor under the name/value separation.
           * `justify-between` alone only separates them while the
           * container has free space to distribute — which the tooltip's
           * `min-w-[8rem]` guarantees for a short value and not for a
           * long one (a currency `tickFormatter`, a `labelFormatter`
           * with units, a value plus its share), where the two would
           * otherwise butt up against each other. A minimum, so a row
           * with slack renders as before.
           */}
          <div className="flex flex-1 items-center justify-between gap-4 leading-none">
            <span className="text-muted-foreground">
              {itemConfig?.label || item.name}
            </span>
            {item.value != null && (
              <span className="font-medium tabular-nums text-foreground">
                {item.value.toLocaleString()}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  hideLabel = false,
  hideIndicator = false,
  labelFormatter,
  formatter,
  labelClassName,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value = (() => {
      const v =
        !labelKey && typeof label === 'string'
          ? (config[label as keyof typeof config]?.label ?? label)
          : itemConfig?.label;

      return typeof v === 'string' || typeof v === 'number' ? v : undefined;
    })();

    if (labelFormatter) {
      return (
        <div className={cn('font-medium', labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn('font-medium', labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'grid min-w-[8rem] items-start gap-1.5 rounded-[var(--ui-tooltip-container-border-radius)] border border-border bg-background px-[var(--ui-tooltip-container-padding-x)] py-[var(--ui-tooltip-container-padding-y)] text-xs text-foreground shadow-md',
        className
      )}
    >
      {tooltipLabel}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || 'value'}`;

          return (
            <ChartTooltipRow
              key={key}
              item={item}
              index={index}
              payload={payload}
              itemConfig={getPayloadConfigFromPayload(config, item, key)}
              indicatorColor={color || item.payload.fill || item.color}
              hideIndicator={hideIndicator}
              formatter={formatter}
            />
          );
        })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

/**
 * One legend entry. Split out so the marker it has to derive from the payload
 * sits next to the markup that uses it, instead of above a nested map body.
 */
function ChartLegendEntry({
  item,
  itemConfig,
  hideIcon,
}: {
  item: LegendPayload;
  itemConfig: ChartItemConfig;
  hideIcon: boolean;
}) {
  // recharts types stroke-drawn series (<Line>, <Area>) as `line`; a chart
  // that wants a swatch instead sets the series' `legendType="rect"`.
  const dashArray = (
    item.payload as { strokeDasharray?: string | number } | undefined
  )?.strokeDasharray;
  const marker: ChartSeriesMarker =
    item.type !== 'line' ? 'swatch' : dashArray ? 'dashed' : 'line';

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground'
      )}
    >
      {itemConfig?.icon && !hideIcon ? (
        <itemConfig.icon />
      ) : (
        <SeriesMarker marker={marker} color={item.color} />
      )}
      {/*
       * Falls back to the series key, the way the tooltip row and the
       * treemap's on-cell label both do. `label` is optional on a
       * `ChartConfig` entry, and `getPayloadConfigFromPayload` can miss
       * entirely, so without this an entry renders as a marker with no
       * text — worst on the charts whose legend is the only place a series
       * is named.
       */}
      {itemConfig?.label ?? item.value}
    </div>
  );
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
  config: configFromProps,
}: ChartLegendContentProps) {
  // The context read directly rather than through `useChart()`: a caller that
  // passes its own `config` is rendering the legend outside the container, where
  // the context is absent by design rather than by mistake. Every other caller
  // still gets `useChart()`'s error — the legend has no way to label itself
  // without a config, and failing loudly beats rendering an empty row.
  const contextConfig = React.useContext(ChartContext)?.config;
  const config = configFromProps ?? contextConfig;

  if (!config) {
    throw new Error(
      'ChartLegendContent must be used within a <ChartContainer /> or given a `config` prop'
    );
  }

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        // Wraps rather than overflowing: a legend with many entries (a treemap's
        // one-per-tile, a pie's one-per-slice) is wider than the chart on a narrow
        // surface, and a row that can't wrap paints past the chart's edge. The
        // column gap is unchanged, so a legend that already fits on one row keeps
        // its exact layout.
        'flex flex-wrap items-center justify-start gap-x-4 gap-y-2',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || 'value'}`;

        return (
          <ChartLegendEntry
            key={item.value}
            item={item}
            itemConfig={getPayloadConfigFromPayload(config, item, key)}
            hideIcon={hideIcon}
          />
        );
      })}
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
