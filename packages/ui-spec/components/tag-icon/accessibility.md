# TagIcon — accessibility

## Role and semantics

TagIcon renders a plain `<span>` with **no implicit role** and no tab stop. That
is the correct default: most icon badges sit beside text that already conveys
their meaning, and an unnamed `img` in the accessibility tree is noise.

The component intentionally exposes **no label prop**. The Figma node defines
only a color variant and an icon slot, so labelling is left to the consumer
through the forwarded `<span>` attributes:

| Situation                                                     | Markup                                               |
| ------------------------------------------------------------- | ---------------------------------------------------- |
| Decorative — the meaning is in adjacent visible text          | `<TagIcon icon={…} />` (nothing extra)               |
| Meaningful — the glyph is the only carrier of the information | `<TagIcon role="img" aria-label="Draft" icon={…} />` |

Because the label is consumer-supplied it is localized at the consumer's layer;
the component renders no string of its own.

## Keyboard

None. TagIcon is not focusable and not interactive — it has no tab stop, no
keyboard bindings, and no activation behavior. If a design needs a clickable
icon badge, that is a `ButtonIcon`, not a `TagIcon`.

## Screen reader

- With no role/label: skipped entirely.
- With `role="img"` + `aria-label`: announced once, as an image with that name.
- The glyph itself is an inline `<svg>` from `@acronis-platform/icons-react`; it
  is not independently labelled, so it never double-announces.

## Contrast

The glyph color (`--ui-avatar-label-color-<scheme>`) and the container tint
(`--ui-avatar-color-<scheme>`) are a matched pair per scheme in
`@acronis-platform/design-tokens`, defined for both light and dark via
`light-dark()`. Contrast is therefore a property of the token pair, owned by the
design team, and holds for every brand that overrides the pair consistently.

Non-text contrast (WCAG 1.4.11, 3:1) applies to the glyph when it is meaningful.
Do not restyle the glyph color independently of its container tint — overriding
one side of the pair through `className` can break the ratio.

## Target size

Not applicable — the badge is non-interactive, so the 24px minimum target-size
rule does not apply. The 32px box is a visual dimension from the design, not a
hit area.
