# Button — Behavior

## Variants

### Renders the requested visual style

**Given** a Button with `variant` set to one of `default`, `secondary`, `ghost`,
`destructive`, `ai`, or `inverted`
**When** it renders
**Then** background, label, and border resolve from that variant's
`--ui-button-<style>-*` tokens for the current interaction state.

### Defaults to `default` (Primary)

**Given** a Button with no `variant`
**When** it renders
**Then** it uses the `default` (Primary) style.

### AI variant always leads with the Sparkles icon

**Given** a Button with `variant="ai"`
**When** it renders
**Then** it always renders the `Sparkles` icon before the label (the icon is
intrinsic to the variant — the consumer does not pass it)
**And** its background is the `--ui-background-ai-*` gradient, which runs
**left-to-right** (start color → end color), covering the full button box.

## Interaction states

### Tracks each state from its own token

**Given** any variant
**When** the button is idle, hovered, activated, or disabled
**Then** background, label, and border each resolve from the matching
`*-idle` / `*-hover` / `*-active` / `*-disabled` token — so brand/theme
overrides that differ per state are honored.

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
