---
'@acronis-platform/tokens-pd': major
---

Removes the Tailwind preset output (`tailwind/<brand>/tokens.js` +
`tailwind/<brand>/components/<Component>.js`, consumed via `@config`). The
package now ships CSS custom properties only (`css/`, `bundles/`, `dtcg/`).

This was built for external Tailwind-utility consumers of the design tokens,
but no such consumer exists today, and closing the coverage gaps in how
`@acronis-platform/style-dictionary` computed some component tokens for that
output wasn't worth the investment relative to the CSS-only path everything
in this repo already uses.

**Migration**: replace any `@import`/`require` of
`@acronis-platform/tokens-pd/tailwind/...` with the equivalent
`@acronis-platform/tokens-pd/css/...` custom properties — see the package
README's "Consume" section.
