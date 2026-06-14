---
'@acronis-platform/design-tokens': patch
---

Remove the `context/brand-matrix.md` doc

The file is deleted because it carried information that was untrue, out of
scope for this data-only package, or already owned by another context
file. Per our convention, a package's `context/*` must describe **that
package** precisely; this doc did not.

What was wrong with it:

- **Wrong vocabulary, conflicting with the glossary.** It called the
  `light` / `dark` axis a "Color mode", but `glossary.md` defines that axis
  as **Theme** (and `light` / `dark` as its values). Reusing an established
  term with a different meaning is exactly what the glossary exists to
  prevent.
- **Out-of-scope implementation details.** It referenced the legacy
  `--av-*` CSS custom-property prefix and the `oklch` color space. This
  package ships DTCG token **data** (HSL today); CSS variable names and the
  output color space are decided by the translation tool, not the token
  data.
- **Out-of-scope "Delivery model".** A section described emitted
  stylesheets, override-only files, and `light-dark()` composition — that
  is the translation tool's (`@acronis-platform/style-dictionary` →
  `@acronis-platform/tokens-pd`) responsibility. design-tokens delivers
  data, not CSS.
- **Untrue / unmaintained roadmap content.** The "Brand override surface"
  table (keyed by `--ui-*` output variables) and "The matrix" (a
  speculative list of ~22 legacy brands with partner-company mappings and
  guessed `?` dark-mode columns) were unverified planning material, not
  properties of the token data.
- **Misplaced how-to.** "Adding a brand" instructions belong in
  `CONTRIBUTING.md`, not a reference doc.

The accurate, in-scope idea it contained — the Brand axis is data-driven
and adding a brand is purely additive — is already covered by
`glossary.md`, `manifest.md`, and `token-contract.md`. References to the
deleted file within the design-owned packages (`design-tokens` context and
`style-dictionary` source comments) are updated in the same change.

This is a docs/context-only change: no token data, schema, or `exports`
surface is affected.
