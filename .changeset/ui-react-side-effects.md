---
'@acronis-platform/ui-react': patch
---

Declare `"sideEffects": ["**/*.css"]` in package.json. This lets bundlers
tree-shake unused component modules (the JS is side-effect-free) while still
preserving the stylesheet entry (`@acronis-platform/ui-react/styles`), which
must not be dropped. Consumers importing a subset of components now get a
smaller bundle with no configuration.
