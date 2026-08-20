---
'@acronis-platform/ui-react': minor
---

Add `CardSection`: a band of content that stacks inside a `Card`'s body, below
`CardHeader`.

Six variants pick the body shape — `slot` (arbitrary passthrough), `tag` (a
wrapping tag row, with an example row as its default), `list`
(title/description key-value rows), `table-actions` (a table rendered flush so
its rows run edge-to-edge inside the card), and `card-primary` /
`card-secondary` (a nested `Card` on the primary or secondary surface).

`hasHeader` adds the section's own 14px mini-header — distinct from
`CardHeader` — with a title, inline `extras`, and end-aligned `actions`;
`hasHeader` and `title` form a discriminated union, so turning the header on
without a title fails to compile. `hasBottomBorder` adds a divider and matching
bottom padding for stacking several sections in one card body. The root is
polymorphic via the Base UI `render` prop.
