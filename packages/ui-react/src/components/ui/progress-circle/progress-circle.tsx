'use client';

import * as React from 'react';
import { Progress as ProgressPrimitive } from '@base-ui/react/progress';
import {
  CircleCheckIcon,
  CircleTimesIcon,
  TriangleWarningIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// A circular (radial) progress indicator — an SVG ring whose arc fills with the
// value and whose color tracks the level (danger → critical → warning →
// success). Built from the Cyber-Compliance "Compliance %" design (node
// 2396-186059) and the Vue kit's `AvProgressRadial`. The ring is wrapped in the
// Base UI Progress primitive so it carries the proper `role="progressbar"` +
// `aria-valuenow/min/max`; the visuals are a hand-drawn SVG (Base UI's Track/
// Indicator are linear-only). No `--ui-progress-circle-*` tier — the arc uses the
// shared status colors (`--ui-text-on-status-*`), the track the border token, and
// the center label the surface foreground.

// `brand` is the neutral single-color mode (matches the linear Progress accent);
// the others are score levels. With no `status`, the level is derived from the
// value (like the Vue ProgressRadial).
export type ProgressCircleStatus =
  | 'brand'
  | 'danger'
  | 'critical'
  | 'warning'
  | 'success';

// Size → [diameter px, stroke px, center font class]. The table cell uses the
// smaller sizes; lg suits cards/widgets.
const SIZES = {
  tiny: { d: 16, stroke: 2, font: 'text-[10px] leading-none' },
  sm: { d: 24, stroke: 3, font: 'text-[10px] leading-none' },
  md: { d: 40, stroke: 4, font: 'text-xs font-semibold' },
  lg: { d: 64, stroke: 5, font: 'text-sm font-semibold' },
} as const;

export type ProgressCircleSize = keyof typeof SIZES;

const ARC_COLOR: Record<ProgressCircleStatus, string> = {
  brand: 'stroke-[var(--ui-background-brand-secondary)]',
  danger: 'stroke-[var(--ui-text-on-status-danger)]',
  critical: 'stroke-[var(--ui-text-on-status-critical)]',
  warning: 'stroke-[var(--ui-text-on-status-warning)]',
  success: 'stroke-[var(--ui-text-on-status-success)]',
};

// `brand` has no score icon — only the level statuses do.
const ICON_BY_STATUS: Partial<Record<ProgressCircleStatus, React.ReactNode>> = {
  danger: <CircleTimesIcon className="text-[var(--ui-text-on-status-danger)]" />,
  critical: (
    <TriangleWarningIcon className="text-[var(--ui-text-on-status-critical)]" />
  ),
  warning: (
    <TriangleWarningIcon className="text-[var(--ui-text-on-status-warning)]" />
  ),
  success: (
    <CircleCheckIcon className="text-[var(--ui-text-on-status-success)]" />
  ),
};

// Default value → status thresholds (confirm exact breakpoints with design — the
// Figma shows ~25% danger, 50% critical, 75% warning, 80%+ success).
function statusForFraction(fraction: number): ProgressCircleStatus {
  if (fraction >= 0.8) return 'success';
  if (fraction >= 0.6) return 'warning';
  if (fraction >= 0.4) return 'critical';
  return 'danger';
}

const progressCircleVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center',
  {
    variants: {
      size: { tiny: '', sm: '', md: '', lg: '' },
    },
    defaultVariants: { size: 'sm' },
  }
);

export interface ProgressCircleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof progressCircleVariants> {
  /** Current progress; clamped to `[0, max]`. */
  value?: number;
  /** Value representing full completion. */
  max?: number;
  /** Ring diameter + stroke. Defaults to `sm`. */
  size?: ProgressCircleSize;
  /** Color level for the arc. Omit to derive from `value`/`max` by thresholds. */
  status?: ProgressCircleStatus;
  /** Show the rounded percentage in the center. */
  showValue?: boolean;
  /** Show a status icon in the center (takes priority over `showValue`). */
  showIcon?: boolean;
  /** Custom center content (takes priority over icon/value). */
  children?: React.ReactNode;
}

const ProgressCircle = React.forwardRef<HTMLDivElement, ProgressCircleProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size = 'sm',
      status,
      showValue = false,
      showIcon = false,
      children,
      ...props
    },
    ref
  ) => {
    const { d, stroke, font } = SIZES[size];
    const safeMax = max > 0 ? max : 100;
    const fraction = Math.min(1, Math.max(0, value / safeMax));
    const level = status ?? statusForFraction(fraction);
    const radius = (d - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = d / 2;
    const icon = showIcon ? ICON_BY_STATUS[level] : undefined;
    const centerContent =
      children ?? icon ?? (showValue ? `${Math.round(fraction * 100)}%` : null);

    return (
      <ProgressPrimitive.Root
        ref={ref}
        value={value}
        max={max}
        className={cn(progressCircleVariants({ size }), className)}
        style={{ width: d, height: d }}
        {...props}
      >
        <svg
          width={d}
          height={d}
          viewBox={`0 0 ${d} ${d}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            className="stroke-[var(--ui-border-on-surface-border)]"
            fill="none"
            strokeWidth={stroke}
            cx={center}
            cy={center}
            r={radius}
          />
          <circle
            className={cn(ARC_COLOR[level], 'transition-[stroke-dashoffset]')}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            cx={center}
            cy={center}
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - fraction)}
          />
        </svg>
        {centerContent != null && (
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center text-foreground [&_svg]:size-[60%]',
              font
            )}
          >
            {centerContent}
          </span>
        )}
      </ProgressPrimitive.Root>
    );
  }
);
ProgressCircle.displayName = 'ProgressCircle';

export { ProgressCircle, progressCircleVariants };
