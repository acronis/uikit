# ChatHeaderExpanded — behavior

Given/When/Then scenarios for the expanded AI-chat panel header.

> The pill tabs (`ChatHeaderExpandedTabs` / `ChatHeaderExpandedTab`) are a
> temporary placeholder for the standalone `SegmentControl` component. Scenarios
> marked **(placeholder)** describe the stand-in's current, deliberately reduced
> behavior and will be superseded by SegmentControl's own spec.

## Rendering

**Scenario: the header renders its band and both regions**

- **Given** a `ChatHeaderExpanded` with a composed tab group as children
- **When** it renders
- **Then** a 64px tall full-width band appears with a 1px bottom hairline and
  16px inline padding
- **And** the tab group sits at the inline-start edge and the action cluster at
  the inline-end edge.

**Scenario: tab content is composed, never configured**

- **Given** a consumer needs two tabs labelled "Acronis AI" and "Tasks"
- **When** they pass `ChatHeaderExpandedTab` children
- **Then** those labels render as given
- **And** there is no `tabs` array prop that would bake labels into the
  component (so the consumer localizes at their own layer).

## Actions

**Scenario: the new-chat action is always present**

- **Given** a default `ChatHeaderExpanded`
- **When** it renders
- **Then** exactly one action button is shown — the new-chat button with a plus
  glyph and the accessible name from `newChatLabel`.

**Scenario: history is opt-in**

- **Given** `hasHistory` is not set
- **Then** no conversation-history button is rendered.

- **Given** `hasHistory` is set
- **Then** a second `secondary` ButtonIcon with a clock/rotation glyph is
  rendered **before** the new-chat button, named by `historyLabel`.

**Scenario: action labels are localizable**

- **Given** `newChatLabel="Neuer Chat"` and `historyLabel="Chatverlauf"`
- **Then** the buttons expose those accessible names instead of the English
  defaults.

**Scenario: actions carry no handler in this version**

- **Given** a consumer wants to open the history drawer on click
- **When** they look for an `onHistory` prop
- **Then** none exists — the prop surface is scoped to the Figma node's own
  properties. Wiring the actions is an open follow-up (see `api.yaml`'s
  `action_wiring` note).

## Tabs (placeholder)

**Scenario: exactly one tab reads as selected**

- **Given** a tab group where one `ChatHeaderExpandedTab` has `active`
- **Then** that tab exposes `aria-selected="true"` and paints the raised fill,
  visible border, and strong label color
- **And** every other tab exposes `aria-selected="false"` with a transparent
  fill and muted label color.

**Scenario: selection is controlled by the consumer**

- **Given** the consumer owns the selected view in their own state
- **When** a tab is clicked
- **Then** its `onClick` fires and the consumer flips `active` themselves
- **And** the component keeps no internal selection state.

**Scenario: idle tabs respond to hover, the selected tab does not**

- **Given** an idle tab
- **When** the pointer hovers it
- **Then** its fill, border, and label move to their own dedicated hover tokens.

- **Given** the selected tab
- **When** the pointer hovers it
- **Then** its appearance does not change (the design defines no hover for the
  selected state).

**Scenario: a counter renders through the shared Tag**

- **Given** a tab with `counter={7}`
- **Then** a `Tag` with the `ai` variant at `sm` size renders after the label
  containing "7".

- **Given** a tab with `counter={0}`
- **Then** the counter still renders — only `null`/`undefined` mean "no counter".

- **Given** a tab with no `counter`
- **Then** no `Tag` is rendered at all.

## Overflow affordance (placeholder)

**Scenario: the affordance is opt-in**

- **Given** `hasScroll` is not set on `ChatHeaderExpandedTabs`
- **Then** no chevron buttons are rendered.

- **Given** `hasScroll` is set
- **Then** two chevron buttons render pinned flush to the group's inline-end
  edge, each separated by a logical inline-start hairline
- **And** each has an overridable accessible name (`scrollBackwardLabel` /
  `scrollForwardLabel`).

**Scenario: the affordance does not scroll yet**

- **Given** the affordance is shown and a chevron is clicked
- **Then** nothing scrolls — the placeholder renders the design's chrome only.
  Overflow detection and scrolling belong to the real SegmentControl.

## Composition

**Scenario: the root element can be swapped**

- **Given** `render={<div />}`
- **Then** the header renders as a `<div>` (no `banner` landmark) while keeping
  all of its classes — useful when the surrounding page already owns the
  landmark.

## Direction

**Scenario: the header mirrors under `dir="rtl"`**

- **Given** an ancestor sets `dir="rtl"`
- **Then** the tab group moves to the right edge and the action cluster to the
  left
- **And** the history button still precedes the new-chat button in reading order
- **And** the overflow affordance pins to the (now left) inline-end edge, its
  separators flip side, and both chevron glyphs mirror.
