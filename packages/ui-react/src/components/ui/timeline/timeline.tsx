'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// A presentational, chronological list of events — an activity feed / audit log
// / status history. It owns structure, the connector line, markers, and the
// timestamp/title/description hierarchy only; it never sorts, groups, fetches, or
// interprets events, and it ships no domain event types or icons. Rendered as a
// semantic ordered list (`<ol>`/`<li>`); the marker + connector are decorative.
// Compose Tag / Link / Button / Accordion into the slots. Not a temporal chart —
// use a Line / Area / Composed chart for that.

type TimelineSize = 'small' | 'medium';
type TimelineDensity = 'compact' | 'default';

type TimelineContextValue = {
  size: TimelineSize;
  density: TimelineDensity;
};

const TimelineContext = React.createContext<TimelineContextValue>({
  size: 'medium',
  density: 'default',
});

const timelineVariants = cva('flex flex-col', {
  variants: {
    size: {
      small: 'text-xs',
      medium: 'text-sm',
    },
    density: {
      compact: '',
      default: '',
    },
  },
  defaultVariants: {
    size: 'medium',
    density: 'default',
  },
});

export interface TimelineProps
  extends React.ComponentProps<'ol'>,
    VariantProps<typeof timelineVariants> {
  /**
   * `Timeline.Item`s — pass them as direct children (the connector auto-hides on
   * the last one). Grouping/headings aren't supported as intervening children.
   */
  children?: React.ReactNode;
}

const TimelineRoot = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ className, size, density, children, ...props }, ref) => {
    const resolved = React.useMemo(
      () => ({ size: size ?? 'medium', density: density ?? 'default' }),
      [size, density]
    );
    return (
      <TimelineContext.Provider value={resolved}>
        <ol
          ref={ref}
          data-size={resolved.size}
          data-density={resolved.density}
          className={cn(
            timelineVariants({ size, density }),
            // Hide the connector on the last item — nothing follows it.
            '[&>li:last-child_[data-slot=timeline-connector]]:hidden',
            className
          )}
          {...props}
        >
          {children}
        </ol>
      </TimelineContext.Provider>
    );
  }
);
TimelineRoot.displayName = 'Timeline';

export type TimelineStatus =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'critical';

// Marker colors mirror Metric / the design's status chips: a filled dot (or,
// with an icon, a `-pressed` badge) in the status family. Neutral reads as the
// muted foreground.
const STATUS_MARKER: Record<
  TimelineStatus,
  { dot: string; ring: string; ringColor: string; badge: string }
> = {
  neutral: {
    dot: 'bg-[var(--ui-text-on-status-neutral)]',
    ring: 'border-[var(--ui-text-on-status-neutral)]',
    ringColor: 'ring-[var(--ui-text-on-status-neutral)]',
    badge:
      'bg-[var(--ui-background-status-neutral-pressed)] text-[var(--ui-text-on-status-neutral)]',
  },
  info: {
    dot: 'bg-[var(--ui-text-on-status-info)]',
    ring: 'border-[var(--ui-text-on-status-info)]',
    ringColor: 'ring-[var(--ui-text-on-status-info)]',
    badge:
      'bg-[var(--ui-background-status-info-pressed)] text-[var(--ui-text-on-status-info)]',
  },
  success: {
    dot: 'bg-[var(--ui-text-on-status-success)]',
    ring: 'border-[var(--ui-text-on-status-success)]',
    ringColor: 'ring-[var(--ui-text-on-status-success)]',
    badge:
      'bg-[var(--ui-background-status-success-pressed)] text-[var(--ui-text-on-status-success)]',
  },
  warning: {
    dot: 'bg-[var(--ui-text-on-status-warning)]',
    ring: 'border-[var(--ui-text-on-status-warning)]',
    ringColor: 'ring-[var(--ui-text-on-status-warning)]',
    badge:
      'bg-[var(--ui-background-status-warning-pressed)] text-[var(--ui-text-on-status-warning)]',
  },
  danger: {
    dot: 'bg-[var(--ui-text-on-status-danger)]',
    ring: 'border-[var(--ui-text-on-status-danger)]',
    ringColor: 'ring-[var(--ui-text-on-status-danger)]',
    badge:
      'bg-[var(--ui-background-status-danger-pressed)] text-[var(--ui-text-on-status-danger)]',
  },
  critical: {
    dot: 'bg-[var(--ui-text-on-status-critical)]',
    ring: 'border-[var(--ui-text-on-status-critical)]',
    ringColor: 'ring-[var(--ui-text-on-status-critical)]',
    badge:
      'bg-[var(--ui-background-status-critical-pressed)] text-[var(--ui-text-on-status-critical)]',
  },
};

const DOT_SIZE = { small: 'size-2', medium: 'size-2.5' } as const;
const BADGE_SIZE = { small: 'size-6', medium: 'size-7' } as const;
const BADGE_ICON_PX = { small: 14, medium: 16 } as const;
const ITEM_PB = { compact: 'pb-4', default: 'pb-6' } as const;

export interface TimelineItemProps
  extends Omit<React.ComponentProps<'li'>, 'title'> {
  /** Event time — pass a `<time dateTime>` for an accessible, machine-readable stamp. */
  timestamp?: React.ReactNode;
  /** Event title (the primary line). */
  title: React.ReactNode;
  /** Optional secondary description. */
  description?: React.ReactNode;
  /** Semantic status — tints the marker (a subtle cue, never large blocks of text). */
  status?: TimelineStatus;
  /** Icon shown in a status-tinted marker badge instead of the plain dot. */
  icon?: React.ReactNode;
  /** Metadata slot under the description — e.g. `Tag`s. */
  metadata?: React.ReactNode;
  /** Actions slot — e.g. a `Link` or `ButtonMenu`. */
  actions?: React.ReactNode;
  /** Emphasize this item as the current one (a ringed marker). */
  current?: boolean;
  /** Dim a non-applicable / inactive item. */
  disabled?: boolean;
  /** Expandable detail composed by the caller — e.g. an `Accordion`. */
  children?: React.ReactNode;
}

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  (
    {
      className,
      timestamp,
      title,
      description,
      status = 'neutral',
      icon,
      metadata,
      actions,
      current = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const { size, density } = React.useContext(TimelineContext);
    const marker = STATUS_MARKER[status];

    return (
      <li
        ref={ref}
        data-status={status}
        data-current={current || undefined}
        data-disabled={disabled || undefined}
        // A disabled item is dimmed *and* announced as disabled; its slotted
        // controls (actions/links) stop taking pointer input — matching the
        // repo's `aria-disabled` + `pointer-events-none` pattern (see link.tsx).
        aria-disabled={disabled || undefined}
        className={cn(
          'flex gap-3',
          disabled && 'opacity-60 pointer-events-none',
          className
        )}
        {...props}
      >
        {/* Marker column: dot / icon badge + the connector line below it. */}
        <div className="flex flex-col items-center">
          {icon != null ? (
            <span
              aria-hidden
              className={cn(
                'flex shrink-0 items-center justify-center rounded-full [&_svg]:shrink-0',
                BADGE_SIZE[size],
                marker.badge,
                // Ring the badge for a `current` item (same emphasis as the dot).
                current &&
                  cn(
                    'ring-2 ring-offset-2 ring-offset-background',
                    marker.ringColor
                  )
              )}
            >
              {React.isValidElement(icon)
                ? React.cloneElement(
                    icon as React.ReactElement<{ size?: number }>,
                    { size: BADGE_ICON_PX[size] }
                  )
                : icon}
            </span>
          ) : (
            <span
              aria-hidden
              className={cn(
                'mt-1 shrink-0 rounded-full',
                DOT_SIZE[size],
                current ? cn('border-2 bg-background', marker.ring) : marker.dot
              )}
            />
          )}
          <span
            data-slot="timeline-connector"
            aria-hidden
            className="mt-1 w-px flex-1 bg-border"
          />
        </div>

        {/* Content column. */}
        <div className={cn('min-w-0 flex-1', ITEM_PB[density])}>
          {timestamp != null && (
            <div className="text-xs leading-tight text-muted-foreground">
              {timestamp}
            </div>
          )}
          <div className="font-medium leading-snug text-foreground">{title}</div>
          {description != null && (
            <div className="mt-0.5 text-muted-foreground">{description}</div>
          )}
          {metadata != null && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {metadata}
            </div>
          )}
          {actions != null && (
            <div className="mt-2 flex flex-wrap items-center gap-2">{actions}</div>
          )}
          {children != null && <div className="mt-2">{children}</div>}
        </div>
      </li>
    );
  }
);
TimelineItem.displayName = 'Timeline.Item';

const Timeline = Object.assign(TimelineRoot, { Item: TimelineItem });

export { Timeline, TimelineItem };
