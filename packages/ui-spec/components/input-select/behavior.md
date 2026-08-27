# InputSelect — Behavior

## Rendering

**Given** a label
**When** the field renders
**Then** the label appears above the trigger and is auto-associated with it (Base UI
`Select.Label`), so clicking the label focuses the trigger and screen readers announce
the field name.

**Given** `required`
**When** the field renders
**Then** a `*` marker is appended after the label.

**Given** a description and no error
**Then** the helper text shows below the trigger; **given** the trigger is
`aria-invalid` with an error message, the error replaces the description and the
trigger takes the error border.

## Opening / selecting (single)

**Given** the trigger
**When** it is pressed (or Space / Enter / ArrowDown with focus)
**Then** the popup opens (`data-popup-open`, chevron rotates 180°) and emits
`open-change(true)`.

**Given** an open popup
**When** an item is clicked or activated with Enter
**Then** the value updates (emits `value-change`), the selected row tints and shows a
trailing check, the trigger shows the resolved label, and the popup closes.

## Multiple selection

**Given** `multiple`
**When** the popup is open and items are toggled
**Then** each item shows a leading checkbox reflecting its selected state, the row
background stays the unselected color, and the popup **stays open** so several items
can be picked.

## Search / sections / status

**Given** an in-dropdown search row (uncontrolled)
**When** the user types into it
**Then** it drives an internal filter query, and each flat `InputSelectItem`
whose label doesn't match hides itself; tree dropdowns read the query via
`useInputSelectFilter` and filter their own items. Passing `value`/`onChange`
controls the query externally instead. Printable keys are kept from Base UI's
own typeahead while it's focused; Arrow/Home/End/Enter/Escape still bubble so
the user can move from the search box into the filtered list.

**Given** an `InputSelectExpander` row inside a tree dropdown
**When** the user clicks it
**Then** it toggles `aria-expanded` and calls `onToggle` — it is not a
selectable `SelectPrimitive.Item` and never sets the select value.

**Given** a section with a label
**Then** its items render under a heading, divided from the previous section by a top
border.

**Given** a status row (`loading` / `empty` / `error`)
**When** rendered instead of items
**Then** it shows the matching icon and message (and, for `error`, an optional retry
action).

## Popup placement and chrome

**Given** no positioning props on the content
**When** the popup opens
**Then** it is placed against the **trigger**, below it and aligned to its start
edge, and the platform's own collision handling may flip or shift it to keep it in
view. `side` / `align` / `side-offset` / `align-offset` / `collision-avoidance`
each override one part of that; passing `collision-avoidance` with no fallbacks
alongside an explicit `side` pins the popup to that placement even when it
overflows.

**Given** an `anchor` on the content
**When** the popup opens
**Then** it positions itself against **that** element instead of the trigger,
decoupling where the popup appears from where the trigger sits in layout. This is
for the case where the element the user actually operates is not the trigger — an
external button drives the open state and the trigger stays mounted but visually
hidden — so the popup should align with the button, not with the hidden trigger's
position in flow. The trigger still owns the combobox semantics either way (see
`accessibility.md`).

**Given** an external button that drives a controlled `open` and is the popup's
`anchor`
**When** the user presses that button while the popup is open
**Then** the platform reports the press as an **outside press** close before the
button's own activation handler runs, so the consumer must cancel that specific
close (`open-change` with `reason = outside-press` and the event target inside
the button → `cancel()`) for the button to act as a toggle; otherwise the
activation handler reopens the popup and it can never be dismissed from the
button. A press outside both the button and the popup still closes it.

**Given** an external button that drives a controlled `open`, with the real
trigger kept mounted but visually hidden (screen-reader-only, not removed)
**When** the popup closes via Escape or by selecting an item
**Then** at the moment the close is reported focus is **still inside the popup
that is about to unmount**, and the platform can move it to **its own trigger** —
which is invisible — only **afterwards**, asynchronously. Neither path reports
the close with focus already on the trigger. So the consumer must (a) mark the
trigger `tab-index = -1` so it is never reached by Tab, and (b) reclaim focus for
their visible external control themselves once the close is committed,
**re-asserted once the platform's own focus-restore attempts have settled**. On
Escape, a gate that recognizes "focus is still inside the closing popup" matches
at the moment of the synchronous reclaim and moves focus to the external control
before the platform's own move happens, so nothing overwrites it afterwards; the
deferred re-assertion then finds the external control already focused and is a
no-op. On item selection, the same synchronous reclaim also lands, but the
platform's async move to the hidden trigger can still happen afterwards and pull
focus back onto it — so the deferred re-assertion is load-bearing on this path,
not a no-op, and reclaims focus a second time once that move has settled. Doing
only one of (a)/(b) is a WCAG 2.4.7 failure: `tab-index = -1` does not block the
platform's programmatic focus call, and the manual reclaim alone leaves an
invisible control in the tab order. The reclaim belongs after the state commit
in the same `open-change` handler, so a close the consumer cancels (see below)
does not move focus.

**Given** the same visually hidden trigger
**When** the popup closes because of an outside press onto **nothing focusable**
(a blank area of the page)
**Then** the platform performs **no** focus restore at all — focus is simply lost
to the document body. The consumer's own reclaim is the only thing that recovers
it, so it must cover this case too, not just the trigger-focused one.

**Given** the same visually hidden trigger
**When** the popup closes because of an outside press onto **another focusable
element** (an input elsewhere on the page)
**Then** focus must end up on **that** element, not on the external button — the
user deliberately focused it and pulling focus back is a bug. The platform
reports this close **once** (reason = outside press), while focus is still inside
the popup, so a gate keyed on "focus is unclaimed" (still inside the closing
popup, on the hidden trigger, or on the document body) **does** match on that
single report and does issue its focus call. The correct end state comes from the
platform's own native focus move to the pressed element happening **after** that
synchronous call and overriding it — not from the gate recognizing and skipping
this case. What the gate does guarantee is that the **deferred** re-assertion
cannot undo that: by the time it runs the pressed element holds focus, which is
not an unclaimed state, so it is a no-op. An unconditional focus return on close
is therefore still wrong — it would fire again after the platform's move and
steal focus back.

**Given** a cancelled close (the consumer called `cancel()` on `open-change`)
**When** the popup therefore stays open
**Then** the in-dropdown search query is **preserved** — a cancelled close does
not silently clear what the user typed. (A consumer that leaves the close
un-cancelled but simply doesn't act on it still gets the query reset; cancelling
is what marks the close as not taking effect.)

**Given** an external button that drives a controlled `open` and closes the
popup directly (its own handler sets `open = false`, so the platform never
reports the transition through `open-change`)
**When** the popup is reopened
**Then** the in-dropdown search query is **empty** — the reset follows the
`open` prop's `true → false` transition as well as `open-change`, so a
button-driven close cannot carry a stale query into the next open.

**Given** `is-popover-styled`
**When** the popup opens
**Then** its container chrome is drawn from the **popover** tokens rather than the
dropdown ones (fill / border / corner radius), the dropdown's static shadow is
dropped, and open/close is animated (fade + zoom, sliding in from the resolved
`side`) instead of appearing instantly. Reach for it when the dropdown is acting
as a floating menu that should read in the same visual language as `Popover` —
a tenant/entity picker opened from a page control, not a plain form field's
option list. It changes only the container chrome and the enter/exit transition:
the popup still sizes to the anchor width, keeps the dropdown's vertical padding,
and every row inside (search, sections, items, status) is unchanged.

## Interaction

**Given** the trigger
**When** the pointer hovers / it receives keyboard focus
**Then** the box border shifts to its hover token and keyboard focus paints a 3px ring —
`--ui-focus-primary` normally, `--ui-focus-error` while `aria-invalid`.

**Given** the field is `disabled`
**Then** the trigger is inert (does not open) and uses the disabled token set.
