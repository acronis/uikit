# Button — Behavior

## Variants

### Renders the requested visual style

**Given** a Button with `variant` set to one of `default`, `secondary`, `ghost`,
`destructive`, or `ai`
**When** it renders
**Then** background, label, and border resolve from that variant's
`--ui-button-<style>-*` tokens for the current interaction state.

### Defaults to `default` (Primary)

**Given** a Button with no `variant`
**When** it renders
**Then** it uses the `default` (Primary) style.

### AI variant icon is optional

**Given** a Button with `variant="ai"`
**When** it renders
**Then** it renders the consumer-provided children (icon is optional, hidden by
default — the consumer passes an icon explicitly when needed)
**And** its background is the `--ui-button-ai-container-color-*` gradient, which runs
**top-to-bottom** (start color → end color), covering the full button box.

## Interaction states

### Tracks each state from its own token

**Given** any variant
**When** the button is idle, hovered, activated, or disabled
**Then** background, label, and border each resolve from the matching
`*-idle` / `*-hover` / `*-active` / `*-disabled` token — so brand/theme
overrides that differ per state are honored.

### Ghost underlines its label on hover

**Given** a Button with `variant="ghost"` (the link-like variant)
**When** the pointer hovers it
**Then** the label is underlined (`--ui-button-ghost-label-text-decoration-hover`)
**And** the underline is dropped again while the button is pressed (`:active`)
and in every other state — idle, disabled, focus.
Other variants never underline.

### Shows a pointer cursor

**Given** any enabled Button
**When** the pointer is over it
**Then** the cursor is `pointer` (disabled buttons have `pointer-events: none`).

### Disabled uses design tokens, not opacity

**Given** a Button with `disabled`
**When** it renders
**Then** it applies the variant's `*-disabled` tokens (not a blanket opacity)
**And** it does not emit `click`.

## Size

**Given** any Button
**When** it renders
**Then** it has a single size — 32px tall with 12px horizontal padding (the
Figma button has no size variants).

## Content

### Sizes and tints an icon child

**Given** an SVG child
**When** it renders
**Then** the icon is sized to 16px and inherits the label color via
`currentColor`.

## Composition

### Renders as another element

**Given** a `render` prop (React) targeting e.g. an anchor
**When** it renders
**Then** the Button's classes/props merge onto that element instead of a
`<button>` (Base UI `useRender`), so a Button can be a link.
