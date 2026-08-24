'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import {
  CHART_DEFAULT_PALETTE,
  ChartStyle,
  resolveChartColors,
  type ChartConfig,
  type ChartPalette,
  type ResolvedChartConfig,
} from '../chart';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

// A category bar: a single horizontal bar split into proportional colored
// segments — one part-to-whole across a handful of categories, in one row
// (onboarding stages, certification status, a rating scale). Unlike `Meter`
// (one value per row, stacked into a bar list), all segments share the same bar.
// It's a plain flex composition, not a recharts chart: each segment's width is
// `value / total`, so exact proportions and the count/% legend are direct DOM,
// with no axes/grid to hide. Segment colors come from the `palette` prop, the
// same dataviz palettes the recharts charts use.
//
// Colors are consumed through the same `--color-<key>` bridge the recharts
// charts use: `ChartStyle` emits one custom property per config entry, so a
// `theme: { light, dark }` entry works as well as a flat `color` — reading
// `config[key].color` directly would render a themed config colorless. The
// tooltip is portaled out of the bar's DOM, so its popup carries its own
// `data-chart` scope + `ChartStyle` to keep the bridge resolvable there.

const defaultFormat = (value: number) => value.toLocaleString();

// Track height only — the flex/rounded/overflow chrome is static.
const categoryBarVariants = cva(
  'flex w-full overflow-hidden rounded-full bg-input',
  {
    variants: {
      size: {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface CategoryBarSegment {
  /** Key into `config` for this segment's label + color. */
  key: string;
  /** The segment's value — its width is this over the sum of all values. */
  value: number;
}

/** The resolved segment passed to a custom `tooltipContent` renderer. */
export interface CategoryBarTooltipContext extends CategoryBarSegment {
  /** Resolved `config` label (falls back to the key); may be any `ReactNode`. */
  label: React.ReactNode;
  /** Share of the total as a rounded percentage (0–100). */
  percent: number;
  /**
   * CSS color reference for the segment — the `var(--color-<key>)` bridge, which
   * resolves the palette stop assigned to this segment. Usable anywhere a CSS
   * color is (e.g. a `style` background); not a literal value.
   */
  color: string;
}

export interface CategoryBarProps
  extends
    Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof categoryBarVariants> {
  /** Ordered segments (left → right). Widths are proportional to `value`. */
  data: ReadonlyArray<CategoryBarSegment>;
  /** Maps each segment `key` to a `label` and, optionally, a palette `tone`. */
  config: ChartConfig;
  /**
   * The dataviz palette the segments are painted from. Segments take a stop of
   * it in the palette's defined order, or the one their `tone` names. Defaults
   * to `categorical`.
   */
  palette?: ChartPalette;
  /** Show the legend below the bar (color dot + label + value + %). */
  showLegend?: boolean;
  /** Show a hover tooltip per segment (dot + label + value + %). */
  showTooltip?: boolean;
  /**
   * Custom tooltip content per segment — replaces the default (dot + label +
   * `value · %`) inside the same card. Ignored when `showTooltip` is false.
   */
  tooltipContent?: (segment: CategoryBarTooltipContext) => React.ReactNode;
  /** Format the numeric value (legend + tooltip). Defaults to `toLocaleString()`. */
  valueFormatter?: (value: number) => string;
  /** Render the tooltip for this segment index initially open (VR/testing). */
  defaultOpenIndex?: number;
  /**
   * Accessible summary of the whole bar. Defaults to a `label value` list built
   * from the data; pass a fuller sentence for screen readers if you have one.
   */
  'aria-label'?: string;
}

/**
 * One segment's hover card.
 *
 * It re-declares `data-chart` and re-renders `ChartStyle` because the popup is
 * portaled out of the bar: outside that subtree the `--color-*` bridge the
 * swatch reads has nothing to resolve against.
 */
function CategoryBarSegmentTooltip({
  chartId,
  config,
  color,
  label,
  percent,
  segmentKey,
  value,
  valueFormatter,
  renderContent,
}: {
  chartId: string;
  config: ResolvedChartConfig;
  color: string;
  label: React.ReactNode;
  percent: number;
  segmentKey: string;
  value: number;
  valueFormatter: (value: number) => string;
  // Not named `render`: in this package that name is reserved for Base UI's
  // polymorphic composition prop (see `<TooltipTrigger render={…} />` below).
  renderContent?: (segment: CategoryBarTooltipContext) => React.ReactNode;
}) {
  return (
    <TooltipContent
      data-chart={chartId}
      className={cn(
        'border border-border bg-background text-foreground shadow-md',
        !renderContent && 'flex items-center gap-2'
      )}
    >
      <ChartStyle id={chartId} config={config} />
      {renderContent ? (
        renderContent({ key: segmentKey, value, label, percent, color })
      ) : (
        <>
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="font-semibold">{label}</span>
          <span className="text-muted-foreground tabular-nums">
            {valueFormatter(value)} · {percent}%
          </span>
        </>
      )}
    </TooltipContent>
  );
}

const CategoryBar = React.forwardRef<HTMLDivElement, CategoryBarProps>(
  (
    {
      className,
      data,
      config,
      palette = CHART_DEFAULT_PALETTE,
      size,
      showLegend = false,
      showTooltip = true,
      tooltipContent,
      valueFormatter = defaultFormat,
      defaultOpenIndex,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const uniqueId = React.useId();
    const chartId = `chart-${uniqueId.replace(/:/g, '')}`;
    // Resolved here rather than by a `ChartContainer`: this component paints
    // plain divs, not a recharts plot, so it owns the `--color-*` emission for
    // both the bar and its portaled per-segment tooltip.
    const resolvedConfig = React.useMemo(
      () => resolveChartColors(config, palette),
      [config, palette]
    );

    const total = data.reduce((sum, seg) => sum + seg.value, 0);
    const labelFor = (key: string): React.ReactNode =>
      config[key]?.label ?? key;
    // The aria-label has to be a plain string, so a rich (element) label can't
    // be used there — fall back to the key rather than stringifying it into
    // "[object Object]".
    const labelTextFor = (key: string) => {
      const label = config[key]?.label;
      return typeof label === 'string' || typeof label === 'number'
        ? String(label)
        : key;
    };
    const colorOf = (key: string) => `var(--color-${key})`;
    const pctOf = (value: number) =>
      total > 0 ? Math.round((value / total) * 100) : 0;

    // A locale-neutral fallback: "<label> <value>" pairs. Consumers can pass a
    // fuller `aria-label` sentence.
    const summary =
      ariaLabel ??
      data
        .map((seg) => `${labelTextFor(seg.key)} ${valueFormatter(seg.value)}`)
        .join(', ');

    return (
      <div
        ref={ref}
        data-chart={chartId}
        className={cn('flex w-full flex-col gap-3', className)}
        {...props}
      >
        <ChartStyle id={chartId} config={resolvedConfig} />
        <div
          className={categoryBarVariants({ size })}
          role="img"
          aria-label={summary}
        >
          {data.map((seg, index) => {
            const color = colorOf(seg.key);
            // flex-grow proportional to value with a zero basis → widths are
            // exactly value/total; a zero-value segment collapses.
            const segment = (
              <div
                key={seg.key}
                className="h-full min-w-0"
                style={{ flex: `${seg.value} 0 0%`, backgroundColor: color }}
              />
            );

            if (!showTooltip) return segment;

            return (
              <Tooltip key={seg.key} defaultOpen={index === defaultOpenIndex}>
                <TooltipTrigger render={segment} />
                <CategoryBarSegmentTooltip
                  chartId={chartId}
                  config={resolvedConfig}
                  color={color}
                  label={labelFor(seg.key)}
                  percent={pctOf(seg.value)}
                  segmentKey={seg.key}
                  value={seg.value}
                  valueFormatter={valueFormatter}
                  renderContent={tooltipContent}
                />
              </Tooltip>
            );
          })}
        </div>

        {showLegend && (
          <ul className="flex flex-wrap justify-between gap-x-6 gap-y-3">
            {data.map((seg) => (
              <li key={seg.key} className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-sm leading-none text-muted-foreground">
                  <span
                    className="size-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: colorOf(seg.key) }}
                  />
                  {labelFor(seg.key)}
                </span>
                <span className="flex items-baseline gap-1.5 leading-none tabular-nums">
                  <span className="text-base font-semibold text-foreground">
                    {valueFormatter(seg.value)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {pctOf(seg.value)}%
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
CategoryBar.displayName = 'CategoryBar';

export { CategoryBar, categoryBarVariants };
