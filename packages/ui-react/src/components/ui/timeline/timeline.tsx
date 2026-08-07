'use client';

import * as React from 'react';
import { ChevronDownIcon } from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '../avatar';
import { ButtonIcon } from '../button-icon';
import { Card } from '../card';

// A presentational, chronological *tree* of events — an activity feed / audit
// log / status history. Each row is an Avatar marker plus a Card carrying the
// title, an optional tag, the timestamp, a description, and an optional body;
// rows join their parent through an elbow and their next sibling through a
// vertical line. It owns structure, the connector geometry, and collapsing only;
// it never sorts, groups, fetches, or interprets events, and it ships no domain
// event types or icons. Rendered as a semantic ordered list (`<ol>`/`<li>`);
// markers and connectors are decorative. Not a temporal chart — use a Line /
// Area / Composed chart for that.
//
// Nesting is **flat**, mirroring the Figma `Nesting` variant: a consumer renders
// one `Timeline.Item` per entry and declares its `level` (1-3) and whether it
// opens a branch (`branchStart`, Figma's `-First`). Depth is never derived from
// JSX nesting — that keeps a row's connector geometry a pure function of its own
// props. Collapsing *is* handled here, though: in `tree` mode `Timeline` reads its
// children's levels and drops the rows beneath a collapsed one, so a `collapsible`
// row works with no wiring from the consumer (pass `expanded` to control it).
//
// The disclosure control matches the two Figma idioms, and its *scope* differs
// with them: `tree` puts a dedicated button ahead of the marker and treats it as a
// hierarchy control, collapsing the descendant rows; `default` puts a chevron at
// the trailing edge of the card header (Figma's `Action Button`), where it belongs
// to that card and only hides that row's own body.
//
// Connector geometry is reproduced with logical CSS borders rather than Figma's
// two exported 1px SVG strokes (a straight line and a right angle): both are
// design primitives, not iconography, and CSS borders mirror correctly under
// `dir="rtl"` where a baked-in asset cannot.
//
// The design references `components/Timeline/{connectorColor,gap}`, which are
// not "ready for dev" and have no `--ui-timeline-*` tier. Both are pure aliases
// in Figma — identical across all six brand modes — so this consumes the alias
// targets directly: `--ui-border-on-surface-border` (connector) and
// `--ui-gap-16` (gap). Re-point them at `--ui-timeline-*` once that tier ships.

const CONNECTOR_COLOR = 'var(--ui-border-on-surface-border)';
const GAP = 'var(--ui-gap-16)';
/** The Avatar marker's own width — also the elbow's horizontal reach. */
const MARKER = 'var(--ui-avatar-global-avatar-size)';
/** Disclosure button + its gap, present only on a collapsible `tree` row. */
const TOGGLE =
  'calc(var(--ui-button-icon-global-container-height) + var(--ui-gap-8))';

type TimelineVariant = 'default' | 'tree';

const TimelineContext = React.createContext<{ variant: TimelineVariant }>({
  variant: 'default',
});

/**
 * Per-row disclosure state, resolved by the root so it can also drop the
 * collapsed row's descendants. Null when an item renders outside a `Timeline`,
 * in which case the item falls back to its own state.
 */
const TimelineRowContext = React.createContext<{
  expanded: boolean;
  connector: boolean;
  onToggle: () => void;
} | null>(null);

/** A row's identity for the uncontrolled disclosure map. */
const key = (element: React.ReactElement, index: number) =>
  String(element.key ?? index);

const timelineVariants = cva('flex flex-col', {
  variants: {
    variant: {
      default: '',
      tree: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface TimelineProps
  extends React.ComponentProps<'ol'>, VariantProps<typeof timelineVariants> {
  /**
   * What a collapsible row's disclosure control is, and where it sits. `default`
   * puts a chevron at the trailing edge of the card header, which hides that row's
   * body; `tree` puts a dedicated button ahead of the marker, which hides the row's
   * descendants and widens the indent step.
   */
  variant?: TimelineVariant;
  /**
   * `Timeline.Item`s — pass them as direct children in visual order (never
   * wrapped in a fragment, or their levels can't be read). Connectors are derived
   * from the levels, so no row ever leaves a dangling line.
   */
  children?: React.ReactNode;
}

const TimelineRoot = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ className, variant, children, ...props }, ref) => {
    const resolved = variant ?? 'default';
    const context = React.useMemo(() => ({ variant: resolved }), [resolved]);
    const [openState, setOpenState] = React.useState<Record<string, boolean>>(
      {}
    );

    const items = React.Children.toArray(children).filter(
      React.isValidElement
    ) as React.ReactElement<TimelineItemProps>[];

    // Pass 1 — in `tree` mode only, drop the rows beneath a collapsed one. Rows
    // deeper than a collapsed row are hidden until the level rises back to it; one
    // cursor is enough, since a nested collapse can only ever narrow the range.
    //
    // The scope of a collapse follows the variant, because the two Figma idioms
    // mean different things: the `tree` button ahead of the marker is a hierarchy
    // control, so it hides the descendant rows; the chevron in a `default` card
    // header belongs to that card, so it only hides that row's own body.
    const visible: {
      element: React.ReactElement<TimelineItemProps>;
      key: string;
      level: number;
      expanded: boolean;
      isControlled: boolean;
      hasToggle: boolean;
    }[] = [];
    let hideBelowLevel: number | null = null;

    items.forEach((element, index) => {
      const level = element.props.level ?? 1;
      if (hideBelowLevel !== null && level > hideBelowLevel) return;
      hideBelowLevel = null;

      const isControlled = element.props.expanded !== undefined;
      const expanded = isControlled
        ? Boolean(element.props.expanded)
        : (openState[key(element, index)] ??
          element.props.defaultExpanded ??
          true);

      if (resolved === 'tree' && element.props.collapsible && !expanded) {
        hideBelowLevel = level;
      }

      visible.push({
        element,
        key: key(element, index),
        level,
        expanded,
        isControlled,
        hasToggle: resolved === 'tree' && Boolean(element.props.collapsible),
      });
    });

    // Pass 2 — a row's connector descends from its own marker to the *next visible*
    // row, so it may only be drawn when it actually lands on something. Otherwise
    // the line dangles in the margin: at the end of the list, at the end of a
    // branch, and (the case that needs the two passes) once a collapse has removed
    // the descendants it used to point at.
    const rows = visible.map((row, index) => {
      const next = visible[index + 1];
      const reachesNextRow =
        next != null &&
        (next.level > row.level
          ? // A deeper row bridges the gap with its own elbow, which starts exactly
            // at this row's marker centre.
            true
          : next.level === row.level &&
            // Same level, but a `tree` row that reserves a disclosure button has a
            // wider marker column than one that doesn't — so their markers sit at
            // different offsets and a vertical line between them can't be straight.
            // Figma only ever shows homogeneous siblings, so skip the line instead
            // of drawing a crooked one.
            next.hasToggle === row.hasToggle);
      return (
        <TimelineRowContext.Provider
          key={row.key}
          value={{
            expanded: row.expanded,
            connector: row.element.props.connector ?? reachesNextRow,
            onToggle: () => {
              const nextExpanded = !row.expanded;
              row.element.props.onExpandedChange?.(nextExpanded);
              if (!row.isControlled) {
                setOpenState((state) => ({
                  ...state,
                  [row.key]: nextExpanded,
                }));
              }
            },
          }}
        >
          {row.element}
        </TimelineRowContext.Provider>
      );
    });

    return (
      <TimelineContext.Provider value={context}>
        <ol
          ref={ref}
          data-variant={resolved}
          style={
            {
              // The indent step is the widest marker column plus the gap: a
              // `tree` row reserves the disclosure button even when a given row
              // is a leaf, so every level lines up.
              '--timeline-step': `calc(${
                resolved === 'tree' ? `${TOGGLE} + ${MARKER}` : MARKER
              } + ${GAP})`,
            } as React.CSSProperties
          }
          className={cn(
            timelineVariants({ variant: resolved }),
            'gap-[var(--ui-gap-16)]',
            className
          )}
          {...props}
        >
          {rows}
        </ol>
      </TimelineContext.Provider>
    );
  }
);
TimelineRoot.displayName = 'Timeline';

export type TimelineLevel = 1 | 2 | 3;

/** The marker Avatar's color scheme (Figma ships the Timeline marker as Blue). */
export type TimelineMarkerColor =
  | 'blue'
  | 'gray'
  | 'green'
  | 'teal'
  | 'violet'
  | 'red'
  | 'yellow'
  | 'orange';

export interface TimelineItemProps extends Omit<
  React.ComponentProps<'li'>,
  'title'
> {
  /** Event title (the primary line in the card header). */
  title: React.ReactNode;
  /** Event time — pass a `<time dateTime>` for an accessible, machine-readable stamp. */
  timestamp?: React.ReactNode;
  /** Slot beside the title, before the timestamp — e.g. a `Tag`. */
  tag?: React.ReactNode;
  /** Optional secondary description under the title. */
  description?: React.ReactNode;
  /** Icon rendered inside the marker Avatar. Takes precedence over `initials`. */
  icon?: React.ReactNode;
  /** Initials rendered inside the marker Avatar when no `icon` is given. */
  initials?: string;
  /** Marker Avatar color scheme. */
  color?: TimelineMarkerColor;
  /** Nesting depth (Figma `Nesting` L1-L3). Drives the indent only. */
  level?: TimelineLevel;
  /**
   * This row opens a branch (Figma's `-First`): draw the elbow joining it to its
   * parent's connector. Ignored at `level={1}`, which has no parent.
   */
  branchStart?: boolean;
  /**
   * Force the connector descending to the next row on or off (Figma
   * `Connecting line`). Leave it unset — `Timeline` derives it from the levels,
   * drawing it only when the next visible row is at this row's depth or deeper.
   */
  connector?: boolean;
  /**
   * Give this row a disclosure control. Under `variant="tree"` it sits ahead of the
   * marker and collapsing hides the descendant rows; otherwise it sits in the card
   * header and collapsing hides only this row's own body.
   */
  collapsible?: boolean;
  /** Disclosure state (controlled). */
  expanded?: boolean;
  /** Initial disclosure state when uncontrolled. */
  defaultExpanded?: boolean;
  /** Called with the requested disclosure state whenever the control is activated. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Accessible name for the disclosure control. */
  toggleLabel?: string;
  /** Card body, revealed below a divider — hidden while the row is collapsed. */
  children?: React.ReactNode;
}

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  (
    {
      className,
      title,
      timestamp,
      tag,
      description,
      icon,
      initials,
      color = 'blue',
      level = 1,
      branchStart = false,
      connector,
      collapsible = false,
      expanded: expandedProp,
      defaultExpanded = true,
      onExpandedChange,
      toggleLabel = 'Toggle event details',
      children,
      ...props
    },
    ref
  ) => {
    const { variant } = React.useContext(TimelineContext);
    const row = React.useContext(TimelineRowContext);
    // Only reached when an item renders outside a `Timeline` — inside one, the
    // root owns the state so it can also drop the collapsed row's descendants.
    const [localExpanded, setLocalExpanded] = React.useState(defaultExpanded);

    const expanded = row ? row.expanded : (expandedProp ?? localExpanded);
    const drawConnector = row ? row.connector : (connector ?? false);

    const handleToggle = () => {
      if (row) {
        row.onToggle();
        return;
      }
      const next = !expanded;
      onExpandedChange?.(next);
      if (expandedProp === undefined) setLocalExpanded(next);
    };

    const treeToggle = variant === 'tree' && collapsible;
    const cardToggle = variant === 'default' && collapsible;
    // A `tree` leaf drops the disclosure button, so its own marker column is
    // narrower than the indent step — the connector tracks the Avatar, not the step.
    const ownMarker = treeToggle ? `calc(${TOGGLE} + ${MARKER})` : MARKER;
    const drawElbow = branchStart && level > 1;
    const showBody = children != null && (!collapsible || expanded);

    const toggleButton = (
      <ButtonIcon
        type="button"
        aria-label={toggleLabel}
        aria-expanded={expanded}
        onClick={handleToggle}
        // Collapsed, the chevron points toward the inline end — so it has to
        // mirror under RTL; logical positioning can't rotate artwork.
        className={cn(
          'shrink-0 transition-transform',
          !expanded && 'ltr:-rotate-90 rtl:rotate-90'
        )}
      >
        <ChevronDownIcon />
      </ButtonIcon>
    );

    return (
      <li
        ref={ref}
        data-level={level}
        data-branch-start={drawElbow || undefined}
        data-expanded={collapsible ? expanded : undefined}
        style={
          {
            '--timeline-indent': `calc(var(--timeline-step) * ${level - 1})`,
            '--timeline-marker': ownMarker,
          } as React.CSSProperties
        }
        className={cn(
          'relative flex items-start gap-[var(--ui-gap-16)]',
          'ps-[var(--timeline-indent)]',
          className
        )}
        {...props}
      >
        {drawConnector && (
          <span
            data-slot="timeline-connector"
            aria-hidden
            // Descends from the marker's lower edge into the row gap, meeting
            // the next row's elbow (or its marker) exactly.
            className="absolute top-[var(--ui-avatar-global-avatar-size)] bottom-[calc(var(--ui-gap-16)*-1)] w-px"
            style={{
              insetInlineStart: `calc(var(--timeline-indent) + var(--timeline-marker) - ${MARKER} / 2)`,
              backgroundColor: CONNECTOR_COLOR,
            }}
          />
        )}
        {drawElbow && (
          <span
            data-slot="timeline-elbow"
            aria-hidden
            // A right angle: down the parent's connector line, then across to
            // this row's marker column. `border-s`/`border-b` mirror in RTL.
            className="absolute top-0 h-[calc(var(--ui-avatar-global-avatar-size)/2)] w-[var(--ui-avatar-global-avatar-size)] border-b border-s"
            style={{
              insetInlineStart: `calc(var(--timeline-indent) - ${MARKER})`,
              borderColor: CONNECTOR_COLOR,
            }}
          />
        )}

        {/* Marker column: the optional tree disclosure button, then the Avatar. */}
        <div className="relative flex shrink-0 items-center gap-[var(--ui-gap-8)]">
          {treeToggle && toggleButton}
          <Avatar
            aria-hidden
            color={color}
            // The Figma Timeline marker carries no stroke, so Avatar's 2px outset
            // ring (which exists to separate overlapping avatars in a group) is
            // switched off here.
            className="[box-shadow:none] [&_svg]:size-[var(--ui-button-icon-global-icon-size)] [&_svg]:shrink-0"
          >
            {icon ??
              (initials ? <AvatarFallback>{initials}</AvatarFallback> : null)}
          </Avatar>
        </div>

        {/* Content column: a Card header, plus an optional revealed body. */}
        <Card className="min-w-0 flex-1 shadow-none">
          <div className="flex min-h-12 items-center gap-[var(--ui-gap-16)] px-4 py-2">
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex h-8 items-center gap-[var(--ui-gap-8)]">
                <span className="truncate text-base font-medium leading-6 text-foreground">
                  {title}
                </span>
                {(tag != null || timestamp != null) && (
                  <div className="flex h-full shrink-0 items-center gap-[var(--ui-gap-8)]">
                    {tag}
                    {timestamp != null && (
                      <span className="whitespace-nowrap text-xs leading-4 text-muted-foreground">
                        {timestamp}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {description != null && (
                <div className="flex items-center pb-1">
                  <span className="truncate text-xs leading-4 text-muted-foreground">
                    {description}
                  </span>
                </div>
              )}
            </div>
            {cardToggle && toggleButton}
          </div>
          {showBody && (
            <div className="border-t border-border py-2">{children}</div>
          )}
        </Card>
      </li>
    );
  }
);
TimelineItem.displayName = 'Timeline.Item';

const Timeline = Object.assign(TimelineRoot, { Item: TimelineItem });

export { Timeline, TimelineItem };
