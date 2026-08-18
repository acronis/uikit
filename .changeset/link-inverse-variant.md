---
'@acronis-platform/ui-react': minor
---

Add a `variant` prop to `Link` (`normal` | `inverse`), completing the Figma
`background` axis. `inverse` wires the link's text color to the `--ui-link-inverse-*`
tokens for links over a backdrop, scrim, or dark brand surface; `normal` stays the
default and is unchanged.

The `inverse` surface is text-only and always enabled, matching the design: the Figma set
carries the external-icon layer only on `normal` and has no disabled inverse variant, so
both `external` and `disabled` are ignored there — an inverse link stays navigable,
focusable and hoverable even when `disabled` is passed. Omit the link when it must be
inert on a backdrop.
