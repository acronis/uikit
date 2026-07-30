# TagIcon — behavior

TagIcon is a pure function of its props: non-interactive, with no internal state
and no pseudo-states. Every scenario below is a render assertion.

## Rendering the glyph

**Given** a `TagIcon` with an `icon`
**When** it renders
**Then** the glyph is the badge's only child, centered in the 32px box and
constrained to 16px — regardless of the icon's own intrinsic size.

**Given** a `TagIcon` with no `icon`
**When** it renders
**Then** the badge renders as an empty tinted 32px square (no placeholder glyph
is invented).

## Color scheme

**Given** a `TagIcon` with no `color`
**When** it renders
**Then** it uses the `violet` scheme — the container takes
`--ui-avatar-color-violet` and the glyph `--ui-avatar-label-color-violet`.

**Given** a `TagIcon` with `color="violet"`
**When** the active brand or theme redefines `--ui-avatar-color-violet`
**Then** the badge repaints from the token; no value is baked into the component,
so brand overrides and light/dark are honored automatically.

## Not a Tag

**Given** a design that needs a glyph _and_ a text label
**When** a `TagIcon` is reached for
**Then** it is the wrong component — `TagIcon` has no label slot. Use `Tag`,
which owns the status palette (`--ui-tag-*`), a label, an optional leading icon,
and a border. The two do not compose: `TagIcon` is not a `Tag` wrapper and does
not share its tokens.

## Labelling

**Given** a `TagIcon` whose glyph carries meaning not repeated in nearby text
**When** the consumer passes `role="img"` and `aria-label`
**Then** both are forwarded to the root `<span>` and the badge is exposed to
assistive technology with that name.

**Given** a decorative `TagIcon` (its meaning is already in adjacent text)
**When** no role or label is passed
**Then** the badge stays a plain `<span>` with no role, so assistive technology
skips it rather than announcing an unnamed image.

## Layout and direction

**Given** a `TagIcon` inside a `dir="rtl"` subtree
**When** it renders
**Then** it is visually identical to LTR: the box is symmetric (uniform padding,
uniform radius) and the glyph is centered, so there is nothing to mirror. The
component uses no physical directional utilities.
