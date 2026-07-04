---
'@acronis-platform/design-tokens': minor
---

Rename the token-source directory `tokens/` to `tiers/`.

The three token files now live under `tiers/` instead of `tokens/`, matching
the "Tier" vocabulary (primitives / semantics / components) used throughout the
package docs and glossary. Nothing about the token data, shape, or values
changed — this is purely the directory name and the paths that point at it.

**BREAKING (subpath exports):** the package `exports` subpaths moved with the
directory. Update any imports:

- `@acronis-platform/design-tokens/tokens/primitives.json` → `@acronis-platform/design-tokens/tiers/primitives.json`
- `@acronis-platform/design-tokens/tokens/semantic.json` → `@acronis-platform/design-tokens/tiers/semantic.json`
- `@acronis-platform/design-tokens/tokens/components.json` → `@acronis-platform/design-tokens/tiers/components.json`

A translation tool that globs the package (e.g. Style Dictionary
`source: ['node_modules/@acronis-platform/design-tokens/tiers/*.json']`) must
point at `tiers/` and match the new path in any file-pattern parser
(`/\/tiers\/.*\.json$/`).

Also updated alongside the rename so the package stays consistent:

- `package.json` — `files` (`tiers/**`), the `exports` map, and the `validate`
  script's `-d` token-file paths.
- `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, and `context/*.md` — every
  reference to the source directory and the worked Style Dictionary example.
- `.tmp/scripts/*.mjs` Figma-sync emitters and `lib/typography-map.mjs` — output
  paths and comments now write/refer to `tiers/` (the `.tmp/figma-tokens/`
  snapshot directory is unaffected).
- `tools/style-dictionary` (private, not published) — `src/tokens.ts` source
  import paths and its `AGENTS.md` build-trigger table.
