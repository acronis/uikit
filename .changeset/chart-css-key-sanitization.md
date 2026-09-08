---
'@acronis-platform/ui-react': minor
---

**Charts**: sanitize config keys to valid CSS custom-property names, and export
`toCssKey` as a public utility.

Keys containing ASCII special characters or spaces (e.g. `"My Category"`)
previously produced an invalid `--color-My Category` custom property — the
browser silently discarded it, and every affected chart element rendered black.
All chart components now apply a `toCssKey` sanitizer before emitting or
referencing `--color-<key>`, so spaces and other invalid ASCII characters become
hyphens and runs collapse. Charts with already-CSS-safe keys are unaffected (the
sanitizer is identity for compliant keys). A dev-mode `console.warn` fires when
a key is sanitized, prompting consumers to adopt CSS-safe keys.

Non-ASCII code points (U+0080+) are **preserved**: CSS Syntax Level 3 §4.3.7
classifies them as valid ident-code-points, so localized keys such as `"日本"`,
`"Москва"`, or `"Ελλάδα"` work without sanitization.

`toCssKey` is now exported from the `chart` module's public API so that
consumers can apply the same normalization in consumer-side recharts compositions
(e.g. `<Cell fill={` var(--color-${toCssKey(key)})` }`>`) when using non-CSS-safe keys.
