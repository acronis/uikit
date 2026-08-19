# Timer — Behavior

## The readout

**Given** a timer
**When** it renders
**Then** the `value` it was given is displayed verbatim inside the readout, with
tabular figures so every digit occupies the same width.

**Given** a running timer whose `value` changes from `12:01:45` to `12:01:46`
**When** the new value renders
**Then** the readout's width is unchanged and nothing to its inline-end shifts,
because the figures are tabular and the box hugs its content rather than
re-measuring per frame.

**Given** a timer
**When** time passes without the caller supplying a new `value`
**Then** the readout does not change. The component owns no clock and starts no
interval — ticking, formatting, pausing, and resetting all belong to the caller,
who also owns whatever the actions operate on.

**Given** a `value` longer than the design's sample (e.g. `128:59:59`)
**When** it renders
**Then** the box grows to fit it. The readout hugs its content plus the
horizontal padding; the Figma frame's 224px width is the measured result of the
sample content, not a fixed width.

## The action cluster

**Given** a timer with one or more actions
**When** it renders
**Then** they appear inline-end of the readout as a single toolbar, in the order
given, separated from the readout by a hairline divider and from each other by
the ButtonGroup's own separators.

**Given** a timer with no actions
**When** it renders
**Then** no toolbar element is rendered at all, and the divider is dropped too —
the readout is the last child, and the divider is its own `:last-child`-reset
inline-end border.

**Given** an action
**When** it is hovered, activated, focused by keyboard, or disabled
**Then** it behaves exactly as a ButtonGroup item does; the timer adds nothing
and overrides nothing. See the ButtonGroup spec.

**Given** the action cluster
**When** it renders
**Then** it is always the `inlined` ButtonGroup style — never `outlined`. The
timer's own box already draws the border and radius an outlined group would
duplicate, and this is how the design instantiates it. It is not configurable.

## Container

**Given** a timer whose trailing action is hovered or focused
**When** the fill or the inset focus ring paints
**Then** it is clipped to the container's radius, so no square corner escapes
the rounded box.

**Given** a timer under `dir="rtl"`
**When** it renders
**Then** the readout sits at the inline start and the actions at the inline end,
mirrored — the divider is an inline-end border, not a right-hand one. The value
itself is not reordered; formatting the time for the locale is the caller's job.
