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
  CHART_DEFAULT_PALETTE,
  CHART_STATUS_TOKENS,
  resolveSeriesColor,
  type ChartPalette,
  type ChartSeriesTone,
} from './chart-palette';

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    /**
     * Which stop of the container's `palette` this series paints with. Left
     * unset, it is assigned from the series' position. See `ChartSeriesTone`.
     *
     * There is deliberately no free-form `color` here: every series colour
     * comes from the chart's palette, so a chart cannot paint a hue the design
     * system does not define. Pick a different palette on `ChartContainer`, or
     * a different stop of it with this.
     */
    tone?: ChartSeriesTone;
  };
};

/**
 * A `ChartConfig` with every series' palette colour filled in. This is what the
 * container puts on the context, so the plot, the tooltip rows and the legend
 * markers all read the same resolved colour.
 */
export type ResolvedChartConfig = {
  [k in string]: ChartConfig[string] & { color: string };
};

/**
 * Resolve each series' colour out of `palette` — in the palette's defined
 * order, honouring any `tone` a series named.
 *
 * Exported for tests and for the widget editor, which needs the same resolved
 * map to detect duplicate colours (`findDuplicateTones`) without re-deriving it.
 */
export function resolveChartColors(
  config: ChartConfig,
  palette: ChartPalette
): ResolvedChartConfig {
  const entries = Object.entries(config);

  // An aliased series (`tone: { sameAs }`) doesn't take a stop of its own — it
  // is the same metric drawn a second way, so it must not consume a colour or
  // shift the series after it along the palette.
  const isAlias = (item: ChartConfig[string]) => Boolean(item.tone?.sameAs);
  let index = 0;
  const resolved: Record<string, ChartConfig[string] & { color: string }> = {};

  for (const [key, item] of entries) {
    if (isAlias(item)) {
      continue;
    }
    resolved[key] = {
      ...item,
      color: resolveSeriesColor(palette, { index: index++, tone: item.tone }),
    };
  }

  // An alias may point at another alias, in any order, so a single pass over
  // the aliases can miss a chain that is fully resolvable. Keep sweeping the
  // pending set until nothing more resolves; what is left is a cycle or a
  // target that isn't in this config at all.
  const pending = new Map<string, string>();
  for (const [key, item] of entries) {
    if (isAlias(item)) {
      pending.set(key, item.tone!.sameAs as string);
    }
  }

  let changed = true;
  while (changed && pending.size > 0) {
    changed = false;
    for (const [key, target] of pending) {
      const targetColor = resolved[target]?.color;
      if (targetColor !== undefined) {
        resolved[key] = { ...config[key], color: targetColor };
        pending.delete(key);
        changed = true;
      }
    }
  }

  for (const [key, target] of pending) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[ui-react] Chart series "${key}" aliases "${target}", which is not a palette-assigned series in this config. Falling back to neutral.`
      );
    }
    resolved[key] = { ...config[key], color: CHART_STATUS_TOKENS.neutral };
  }

  // Rebuilt in the config's own order: the passes above visit non-aliases
  // first, and callers (legend order, `Object.entries` consumers) rely on the
  // order they wrote.
  return Object.fromEntries(entries.map(([key]) => [key, resolved[key]]));
}

type ChartContextProps = {
  config: ResolvedChartConfig;
};

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
  /**
   * The series this chart draws, keyed by data field.
   *
   * Declare exactly what the chart plots. A stop is assigned by an entry's
   * position here, not by which series end up rendered, so an entry for a
   * series the chart doesn't draw still consumes a colour and shifts the ones
   * that follow it. (That is deliberate: a series then keeps its colour when a
   * sibling is toggled off, instead of the whole chart recolouring.)
   */
  config: ChartConfig;
  /**
   * The dataviz palette this chart's series are painted from. Series take a
   * stop of it in the palette's defined order, or the one their `tone` names.
   * Defaults to `categorical` — there is no "no palette" state.
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
  palette = CHART_DEFAULT_PALETTE,
  ...props
}: ChartContainerProps) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;
  // Resolved once and shared with the context, so the tooltip rows and legend
  // markers read the same colors the plot paints with.
  const resolvedConfig = React.useMemo(
    () => resolveChartColors(config, palette),
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

const ChartStyle = ({
  id,
  config,
}: {
  id: string;
  config: ResolvedChartConfig;
}) => {
  const entries = Object.entries(config);

  if (!entries.length) {
    return null;
  }

  // One block, no light/dark split: every colour is now a `--ui-dataviz-*`
  // token, and those are `light-dark()` pairs that follow `color-scheme`
  // themselves. The old per-theme `[data-theme='dark']` duplication existed
  // only for hand-written `theme: { light, dark }` config entries, which the
  // palette replaced.
  //
  // Rendered as a text child (not dangerouslySetInnerHTML): React sets it via
  // textContent, which the browser does not HTML-parse, so a `</style>` in a
  // colour can't break out of the tag.
  return (
    <style>
      {`[data-chart=${id}] {\n${entries
        .map(([key, itemConfig]) => `  --color-${key}: ${itemConfig.color};`)
        .join('\n')}\n}`}
    </style>
  );
};

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
 * One legend entry. Split out so the markup stays flat in `ChartLegendContent`.
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
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground'
      )}
    >
      {itemConfig?.icon && !hideIcon ? (
        <itemConfig.icon />
      ) : (
        <div
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: item.color }}
        />
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
        'flex flex-wrap items-center justify-center gap-x-6 gap-y-2',
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
