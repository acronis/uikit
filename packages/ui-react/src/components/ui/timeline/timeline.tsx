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
// one `Timeline.Item` per entry and declares its `level` (1-3). Depth is never
// derived from JSX nesting — the level sequence *is* the tree. `Timeline` reads
// that sequence and derives the rest: which rows get a disclosure control, which
// rows are dropped when one collapses, and the whole connector geometry — both a
// row's descending line and the elbow joining a branch's first row to its parent
// (Figma's `-First`). `connector` and `branchStart` exist only to override those
// two, and the pair is resolved together so neither half can be drawn alone.
//
// Collapsing is the **variant**, not a per-row flag. `tree` gives every row that
// has descendants a disclosure button ahead of its marker and widens the indent
// step to reserve it; `default` never collapses anything. There is no `collapsible`
// prop, because the two would say the same thing: a tree branch nobody can collapse
// is just `default` with a wider indent.
//
// An expandable *card* is a separate, orthogonal axis — `collapsibleBody` puts a
// chevron at the trailing edge of a row's card header that folds that card's own
// body (Figma's `Action Button`). It is not a variant: it behaves identically in
// `default` and `tree`, and a tree row can carry both controls — the branch one
// drops the rows below, this one folds this card. It lives here only because
// `Card` cannot do it yet; move it there once it can.
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
// Load-bearing invariant: the elbow's vertical lands on the parent's connector
// only while GAP === MARKER / 2 (16 === 32 / 2 today). The elbow is offset from the
// child's indent while the connector is offset from the parent's marker centre, and
// those two coincide at exactly that ratio. If either token moves, every elbow
// detaches — re-derive the elbow's `insetInlineStart` rather than nudging it.
const GAP = 'var(--ui-gap-16)';
/** The Avatar marker's own width — also the elbow's horizontal reach. */
const MARKER = 'var(--ui-avatar-global-avatar-size)';
/** Disclosure button + its gap, present only on a `tree` row with descendants. */
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
  elbow: boolean;
  hasToggle: boolean;
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
   * Whether the list collapses. `default` never does; `tree` gives every row that
   * has descendants a disclosure button ahead of its marker, which hides those
   * descendants, and widens the indent step to reserve it on every row.
   *
   * Unrelated to `Timeline.Item`'s `collapsibleBody`, which folds a single card's
   * own body and works the same under both variants.
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

    // A row has descendants when the row *authored* after it is deeper. Read from
    // the full child list, never the visible one: a collapsed row must keep its
    // disclosure control, or there would be no way to expand it again.
    const levelAt = (index: number) => items[index]?.props.level ?? 1;
    const hasDescendants = (index: number) =>
      index + 1 < items.length && levelAt(index + 1) > levelAt(index);

    // Pass 1 — in `tree` mode only, drop the rows beneath a collapsed one. Rows
    // deeper than a collapsed row are hidden until the level rises back to it; one
    // cursor is enough, since a nested collapse can only ever narrow the range.
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

      // Collapsing is the variant, not a per-row opt-in: `tree` rows that have
      // descendants get the control, `default` rows never do. A tree row without
      // it would be a branch nobody can collapse — which is just `default` with a
      // wider indent — so there is nothing for a `collapsible` prop to decide.
      const hasToggle = resolved === 'tree' && hasDescendants(index);

      if (hasToggle && !expanded) {
        hideBelowLevel = level;
      }

      visible.push({
        element,
        key: key(element, index),
        level,
        expanded,
        isControlled,
        hasToggle,
      });
    });

    // Pass 2 — the connector and the elbow are two halves of one join, so they are
    // resolved together and neither can be drawn without the other.
    //
    // A row draws the elbow when it is deeper than the row above it: that is what
    // "opens a branch" means, and reading it from the sequence keeps a level jump
    // from having to be declared twice. `branchStart` overrides it, like
    // `connector` overrides the descending line.
    const drawsElbow = (index: number) => {
      const row = visible[index];
      if (row == null || row.level <= 1) return false;
      const previous = visible[index - 1];
      return (
        row.element.props.branchStart ??
        (previous != null && row.level > previous.level)
      );
    };

    // A row's connector descends from its own marker to the *next visible* row, so
    // it may only be drawn when it actually lands on something. Otherwise the line
    // dangles in the margin: at the end of the list, at the end of a branch, and
    // (the case that needs the two passes) once a collapse has removed the
    // descendants it used to point at.
    const rows = visible.map((row, index) => {
      const next = visible[index + 1];
      const reachesNextRow =
        next != null &&
        (next.level > row.level
          ? // A deeper row bridges the gap with its own elbow, which starts exactly
            // at this row's marker centre — so the line lands only if that elbow is
            // actually drawn. It normally is, since a level jump derives one; it is
            // not when the consumer refuses it with `branchStart={false}`, and then
            // this line has nothing to meet.
            drawsElbow(index + 1)
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
            elbow: drawsElbow(index),
            hasToggle: row.hasToggle,
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
   * Force the elbow joining this row to its parent's connector on or off (Figma's
   * `Nesting` `-First`). Leave it unset — `Timeline` derives it from the levels,
   * drawing it whenever this row is deeper than the one above it. Ignored at
   * `level={1}`, which has no parent.
   */
  branchStart?: boolean;
  /**
   * Force the connector descending to the next row on or off (Figma
   * `Connecting line`). Leave it unset — `Timeline` derives it from the levels,
   * drawing it only when the next visible row is at this row's depth or deeper.
   */
  connector?: boolean;
  /**
   * Branch disclosure state (controlled). Only meaningful under `variant="tree"`
   * on a row that has descendants — those rows get the control automatically.
   */
  expanded?: boolean;
  /** Initial branch disclosure state when uncontrolled. */
  defaultExpanded?: boolean;
  /** Called with the requested disclosure state whenever the control is activated. */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Accessible name for the branch disclosure control — the one that drops this
   * row's descendant rows. Distinct from `bodyToggleLabel` by default, because a
   * tree row can carry both controls at once.
   */
  toggleLabel?: string;
  /**
   * Give this row's card a chevron at the trailing edge of its header that shows
   * and hides the body (Figma's `Action Button`).
   *
   * Orthogonal to `variant`: it is the *card's* disclosure, not the timeline's, so
   * it works the same in `default` and `tree` and a tree row can have both — the
   * branch control drops the rows below, this one folds this card's own body.
   * (It lives here only until `Card` grows the behaviour itself.)
   */
  collapsibleBody?: boolean;
  /** Card-body disclosure state (controlled). */
  bodyExpanded?: boolean;
  /** Initial card-body disclosure state when uncontrolled. */
  defaultBodyExpanded?: boolean;
  /** Called with the requested card-body disclosure state. */
  onBodyExpandedChange?: (expanded: boolean) => void;
  /**
   * Accessible name for the card-body disclosure control — the one that folds this
   * row's own body. Distinct from `toggleLabel` by default.
   */
  bodyToggleLabel?: string;
  /** Card body, rendered below a divider. */
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
      branchStart,
      connector,
      // Destructured only to keep them off the `<li>`: the root reads them from
      // `element.props`, because it owns the disclosure state for the whole branch.
      expanded: expandedProp,
      defaultExpanded,
      onExpandedChange,
      // The two controls can sit in the same `<li>`, so their default names have to
      // name their own action — a shared generic default would give one row two
      // buttons that are indistinguishable to a screen reader.
      toggleLabel = 'Toggle nested events',
      collapsibleBody = false,
      bodyExpanded: bodyExpandedProp,
      defaultBodyExpanded = true,
      onBodyExpandedChange,
      bodyToggleLabel = 'Toggle event details',
      children,
      ...props
    },
    ref
  ) => {
    const { variant } = React.useContext(TimelineContext);
    const row = React.useContext(TimelineRowContext);

    // The card's own disclosure is entirely local — unlike the branch control, it
    // changes nothing outside this row, so the root has no reason to own it.
    const [localBodyExpanded, setLocalBodyExpanded] =
      React.useState(defaultBodyExpanded);
    const bodyExpanded = bodyExpandedProp ?? localBodyExpanded;
    const handleBodyToggle = () => {
      const next = !bodyExpanded;
      onBodyExpandedChange?.(next);
      if (bodyExpandedProp === undefined) setLocalBodyExpanded(next);
    };

    // All three are resolved by the root: `expanded` and the control depend on the
    // row's descendants, which only the root can see, and it owns the uncontrolled
    // state so it can drop those descendants too. Rendered outside a `Timeline`
    // there is no branch at all, so an item is simply never collapsible.
    const expanded = row?.expanded ?? true;
    const drawConnector = row ? row.connector : (connector ?? false);
    // Likewise derived by the root, which is the only place the row above is
    // visible. Standalone there is no row above, so only the explicit prop can
    // ask for an elbow — and it has nothing to meet, which is the consumer's call.
    const drawElbow = row ? row.elbow : Boolean(branchStart) && level > 1;
    const treeToggle = variant === 'tree' && (row?.hasToggle ?? false);
    // A `tree` leaf drops the disclosure button, so its own marker column is
    // narrower than the indent step — the connector tracks the Avatar, not the step.
    const ownMarker = treeToggle ? `calc(${TOGGLE} + ${MARKER})` : MARKER;

    // Collapsed, the chevron points toward the inline end — so it has to mirror
    // under RTL; logical positioning can't rotate artwork.
    const chevron = (
      open: boolean,
      label: string,
      onClick: () => void
    ) => (
      <ButtonIcon
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={onClick}
        className={cn(
          'shrink-0 transition-transform',
          !open && 'ltr:-rotate-90 rtl:rotate-90'
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
        data-expanded={treeToggle ? expanded : undefined}
        data-body-expanded={collapsibleBody ? bodyExpanded : undefined}
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
          {treeToggle && chevron(expanded, toggleLabel, () => row?.onToggle())}
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

        {/* Content column: a Card header, plus an optional body below a divider. */}
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
            {collapsibleBody &&
              chevron(bodyExpanded, bodyToggleLabel, handleBodyToggle)}
          </div>
          {children != null && (!collapsibleBody || bodyExpanded) && (
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
