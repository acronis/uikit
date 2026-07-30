---
'@acronis-platform/ui-react': minor
---

Add `TagIcon`: an icon-only tag — a 32px tinted rounded square holding a single
16px glyph, for marking something where a text label would not fit. Ported from
the Figma `TagIcon` component set (node `5144-27622`).

It is a standalone primitive, not a `Tag` wrapper: no label slot, no border, and
it draws its tint from the shared Avatar palette (`--ui-avatar-color-<scheme>` /
`--ui-avatar-label-color-<scheme>`) rather than `Tag`'s `--ui-tag-*` status tier.
Presentational by default (plain `<span>`, no role, no tab stop); pass
`role="img"` + `aria-label` when the glyph is the only carrier of meaning.

Only the `violet` scheme is exposed. The Figma set declares eight `Color`
variants, but `@acronis-platform/tokens-pd` defines five Avatar schemes and has
no `blue`, `gray`, or `green` — those stay blocked on the design team shipping
the tokens rather than being hand-authored.
