'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CircleInfoIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Card } from '../card';
import { Skeleton } from '../skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

// A presentational metric / statistic, laid out after the Figma MetricCard node:
// a label row (label + an optional top-right caption) over a value row (an
// optional status-tinted icon badge + the value + unit on the left, an optional
// trend on the right), with optional supporting text below. It owns visual
// hierarchy and layout only — it never computes or formats the value, converts
// units, or decides whether a value is good or bad; the consumer passes
// ready-to-render nodes and a resolved `status`, and composes a `TrendIndicator`
// into the trend slot. `status` tints the icon badge (a subtle cue, not a full
// color fill). No dedicated token tier — colors are semantic `--ui-*` tokens and
// geometry uses the Tailwind scale.
const metricVariants = cva('flex flex-col', {
  variants: {
    size: {
      small: 'gap-1',
      medium: 'gap-1.5',
      large: 'gap-2',
    },
    // Semantic status — drives the icon badge tint (see STATUS_BADGE). Kept as a
    // cva axis so the enum is spec-conformant; the tint is applied on the badge.
    status: {
      neutral: '',
      info: '',
      success: '',
      warning: '',
      danger: '',
      critical: '',
    },
  },
  defaultVariants: {
    size: 'medium',
    status: 'neutral',
  },
});

const LABEL_SIZE = {
  small: 'text-[10px]',
  medium: 'text-[11px]',
  large: 'text-xs',
} as const;

const VALUE_SIZE = {
  small: 'text-2xl',
  medium: 'text-3xl',
  large: 'text-4xl',
} as const;

const UNIT_SIZE = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
} as const;

const SUPPORTING_SIZE = {
  small: 'text-xs',
  medium: 'text-xs',
  large: 'text-sm',
} as const;

const BADGE_SIZE = {
  small: 'size-7',
  medium: 'size-8',
  large: 'size-10',
} as const;

// icons-react icons size themselves from a `size` prop (which also picks the
// designed stroke weight) — CSS can't do that reliably — so the badge icon is
// cloned to the right px for the Metric size.
const BADGE_ICON_PX = {
  small: 14,
  medium: 16,
  large: 20,
} as const;

const SKELETON_SIZE = {
  small: 'h-6 w-16',
  medium: 'h-8 w-20',
  large: 'h-10 w-28',
} as const;

// The badge pairs the status "pressed" background tint with its matching icon
// color (the same pairing the design uses for status icon chips).
const STATUS_BADGE = {
  neutral:
    'bg-[var(--ui-background-status-neutral-pressed)] text-[var(--ui-text-on-status-neutral)]',
  info: 'bg-[var(--ui-background-status-info-pressed)] text-[var(--ui-text-on-status-info)]',
  success:
    'bg-[var(--ui-background-status-success-pressed)] text-[var(--ui-text-on-status-success)]',
  warning:
    'bg-[var(--ui-background-status-warning-pressed)] text-[var(--ui-text-on-status-warning)]',
  danger:
    'bg-[var(--ui-background-status-danger-pressed)] text-[var(--ui-text-on-status-danger)]',
  critical:
    'bg-[var(--ui-background-status-critical-pressed)] text-[var(--ui-text-on-status-critical)]',
} as const;

export interface MetricProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof metricVariants> {
  /** What the value measures — e.g. "Gross margin". Rendered as an uppercase note heading. */
  label: React.ReactNode;
  /**
   * The primary value, already formatted (`73`, `"94%"`, `"$72K"`, `"2.8"`).
   * The kit does not format currency, units, or decimals.
   */
  value: React.ReactNode;
  /** Unit shown next to the value at a smaller, muted size — e.g. `"%"`, `"hours"`. */
  unit?: React.ReactNode;
  /** A top-right caption aligned with the label — e.g. a timeframe `Tag` ("Last 30 days"). */
  caption?: React.ReactNode;
  /** A trend slot on the right of the value — typically a `TrendIndicator`. */
  trend?: React.ReactNode;
  /** Secondary line below the value — e.g. "Target: 99%". */
  supportingText?: React.ReactNode;
  /** A small badge / metadata slot beside the value — e.g. a `Tag`. */
  badge?: React.ReactNode;
  /** Icon rendered in a status-tinted badge before the value. */
  icon?: React.ReactNode;
  /** Contextual hint on an info affordance next to the label (Base UI Tooltip). */
  tooltip?: React.ReactNode;
  /** Accessible name for the info affordance that reveals `tooltip`. */
  tooltipLabel?: string;
  /** Show a skeleton in place of the value, preserving its space. */
  loading?: boolean;
  /** Card body below the header — e.g. a chart, a Separator, an insight line. */
  children?: React.ReactNode;
}

const Metric = React.forwardRef<HTMLDivElement, MetricProps>(
  (
    {
      className,
      label,
      value,
      unit,
      caption,
      trend,
      supportingText,
      badge,
      icon,
      tooltip,
      tooltipLabel = 'More information',
      loading = false,
      size,
      status,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedSize = size ?? 'medium';
    const resolvedStatus = status ?? 'neutral';

    return (
      <Card
        ref={ref}
        data-size={resolvedSize}
        data-status={resolvedStatus}
        className={cn('flex flex-col p-4', className)}
        {...props}
      >
        <div className={cn(metricVariants({ size, status }))}>
        {/* Label row: label (+ optional info) on the left, caption on the right. */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              className={cn(
                'min-w-0 truncate font-bold uppercase leading-none tracking-wide text-muted-foreground',
                LABEL_SIZE[resolvedSize]
              )}
            >
              {label}
            </span>
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

        {/* Value row: badge + value + unit on the left, trend on the right. */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {icon != null && (
              <span
                aria-hidden
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-lg [&_svg]:shrink-0',
                  BADGE_SIZE[resolvedSize],
                  STATUS_BADGE[resolvedStatus]
                )}
              >
                {React.isValidElement(icon)
                  ? React.cloneElement(
                      icon as React.ReactElement<{ size?: number }>,
                      { size: BADGE_ICON_PX[resolvedSize] }
                    )
                  : icon}
              </span>
            )}
            <div className="flex min-w-0 items-baseline gap-1">
              {loading ? (
                <Skeleton className={SKELETON_SIZE[resolvedSize]} />
              ) : (
                <>
                  <span
                    className={cn(
                      'font-bold leading-none tabular-nums text-foreground',
                      VALUE_SIZE[resolvedSize]
                    )}
                  >
                    {value}
                  </span>
                  {unit != null && (
                    <span
                      className={cn(
                        'font-medium text-muted-foreground',
                        UNIT_SIZE[resolvedSize]
                      )}
                    >
                      {unit}
                    </span>
                  )}
                </>
              )}
              {badge != null && <span className="ms-1 self-center">{badge}</span>}
            </div>
          </div>
          {trend != null && <div className="shrink-0">{trend}</div>}
        </div>

        {supportingText != null && (
          <div
            className={cn('text-muted-foreground', SUPPORTING_SIZE[resolvedSize])}
          >
            {supportingText}
          </div>
        )}
        </div>
        {children}
      </Card>
    );
  }
);
Metric.displayName = 'Metric';

export { Metric };
