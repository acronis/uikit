---
'@acronis-platform/ui-react': minor
---

Add `Link`: an inline text link (semibold) that underlines on hover, with an optional trailing external-link icon (`external`). Polymorphic via Base UI `useRender` (`render` prop) to render a router link instead of the default `<a>`; `disabled` makes it inert (disabled color, removed from the tab order, no navigation). Themed by the `--ui-link-*` tier (text color / text decoration / external-icon color per state) + a 3px `--ui-focus-primary` focus ring.
