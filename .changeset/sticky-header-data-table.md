---
'@acronis-platform/ui-react': minor
---

`DataTable`: add `stickyHeader` to pin the header row to the top of the table's own scroll
container instead of scrolling away with the body rows. Only visible once THAT SPECIFIC div (the
`overflow-auto` div `Table` renders around the `<table>`) has a bounded height shorter than the
table's content — wrapping `DataTable` in a _separate_ bounded/`overflow-auto` div does not work,
since `position: sticky` resolves against the nearest scroll-container ancestor regardless of
which one actually has a scrollbar; bound the existing div directly instead (e.g.
`[&_.overflow-auto]:max-h-96` on a wrapper) — see the new `StickyHeader` story for the full
pattern. Combines correctly with pinned columns (`meta.pin`): the corner cell, sticky on both
axes, stacks above a merely-pinned cell scrolling past it, and its bottom border — which
`border-collapse` doesn't reliably paint once a cell is `position: sticky` — is drawn as a
`box-shadow` instead, the same technique pinned columns already use for their own edge.
