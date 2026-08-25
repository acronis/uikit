'use client';

import * as React from 'react';
import { CircleInfoIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Skeleton } from '../skeleton';
import { TrendIndicator } from '../trend-indicator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

// A presentational metric stats strip: a single row with an optional status-info
// icon badge + value + unit on the left and an optional caption on the right, with
// an optional trend row below and a composable body. No Card wrapper, no size or
// status axes — nest it inside ChartWidget or a Card when you need card chrome.
// Colors are semantic `--ui-*` tokens; the badge always uses the info tint per Figma.

const TREND_DIRECTION = {
  up: 'up',
  down: 'down',
  stable: 'flat',
} as const satisfies Record<string, 'up' | 'down' | 'flat'>;

const TREND_SENTIMENT = {
  up: 'positive',
  down: 'negative',
  stable: 'neutral',
} as const satisfies Record<string, 'positive' | 'negative' | 'neutral'>;

export interface MetricProps extends React.ComponentProps<'div'> {
  /**
   * The primary value, already formatted (`73`, `"94%"`, `"$72K"`, `"2.8"`).
   * The kit does not format currency, units, or decimals.
   */
  value: React.ReactNode;
  /** Unit shown next to the value at a smaller, muted size — e.g. `"%"`, `"hours"`. */
  unit?: React.ReactNode;
  /** Caption at the right end of the stats row — e.g. a timeframe `Tag`. */
  caption?: React.ReactNode;
  /**
   * Trend direction — renders a `TrendIndicator` on its own row below the value.
   * Sentiment follows direction: `up` → positive, `down` → negative, `stable` → neutral.
   * Pair with `trendValue` for the change text.
   */
  trend?: 'up' | 'down' | 'stable';
  /** Change text shown next to the trend arrow — e.g. `"20%"`, `"+3"`. Requires `trend`. */
  trendValue?: React.ReactNode;
  /** Secondary line below the trend — e.g. "Target: 99%". */
  supportingText?: React.ReactNode;
  /** A small badge / metadata slot beside the value — e.g. a `Tag`. */
  badge?: React.ReactNode;
  /** Icon rendered in a status-info-tinted badge before the value. */
  icon?: React.ReactNode;
  /** Contextual hint on an info affordance next to the label (Base UI Tooltip). */
  tooltip?: React.ReactNode;
  /** Accessible name for the info affordance that reveals `tooltip`. */
  tooltipLabel?: string;
  /** Show a skeleton in place of the value, preserving its space. */
  loading?: boolean;
  /** Content below the stats strip — e.g. a chart, a `Separator`, an insight line. */
  children?: React.ReactNode;
}

// The status-info-tinted icon chip. The icon is cloned to a fixed 16 px rather
// than sized in CSS because icons-react icons pick their stroke weight from the
// `size` prop — CSS alone can't replicate that.
function MetricIconBadge({ icon }: { icon: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--ui-background-status-info)] text-[var(--ui-glyph-on-surface-neutral-dark)] [&_svg]:shrink-0"
    >
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, {
            size: 16,
          })
        : icon}
    </span>
  );
}

/** The headline number and its unit, sharing one baseline. */
function MetricValue({
  value,
  unit,
}: {
  value: React.ReactNode;
  unit?: React.ReactNode;
}) {
  return (
    <>
      <span className="text-2xl font-semibold leading-8 tabular-nums text-foreground">
        {value}
      </span>
      {unit != null && (
        <span className="text-xs text-muted-foreground">{unit}</span>
      )}
    </>
  );
}

const Metric = React.forwardRef<HTMLDivElement, MetricProps>(
  (
    {
      className,
      value,
      unit,
      caption,
      trend,
      trendValue,
      supportingText,
      badge,
      icon,
      tooltip,
      tooltipLabel = 'More information',
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
        {/* Stats row: icon badge + value + unit on the left, caption on the right. */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {icon != null && <MetricIconBadge icon={icon} />}
            <div className="flex items-baseline gap-1">
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <MetricValue value={value} unit={unit} />
              )}
              {badge != null && (
                <span className="ms-1 self-center">{badge}</span>
              )}
            </div>
            {tooltip != null && (
              <Tooltip>
                <TooltipTrigger
                  aria-label={tooltipLabel}
                  className="inline-flex shrink-0 cursor-default appearance-none border-0 bg-transparent p-0 text-muted-foreground"
                >
                  <CircleInfoIcon size={16} aria-hidden />
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            )}
          </div>
          {caption != null && <div className="shrink-0">{caption}</div>}
        </div>

        {/* Trend row: renders TrendIndicator from the first-class trend prop. */}
        {trend != null && (
          <div>
            <TrendIndicator
              direction={TREND_DIRECTION[trend]}
              sentiment={TREND_SENTIMENT[trend]}
              value={trendValue}
            />
          </div>
        )}

        {supportingText != null && (
          <div className="text-xs text-muted-foreground">{supportingText}</div>
        )}

        {children}
      </div>
    );
  }
);
Metric.displayName = 'Metric';

export { Metric };
