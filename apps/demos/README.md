# `@acronis-platform/shadcn-uikit-demos`

Shared **source-only** demo components consumed by `apps/demo` and
`apps/docs` via the pnpm workspace protocol.

## No dev server

This workspace deliberately has no `dev` script. The TSX files under
`src/` are imported directly (uncompiled, no bundling step) by:

- `apps/demo` — through the `resolveAtAlias` Vite plugin that maps
  `@/...` from any importer's tree onto `apps/demos/src/...`. Run
  `pnpm --filter @acronis-platform/shadcn-uikit-demo dev` to iterate on
  a demo with HMR; edits in `apps/demos/src/` reload instantly.
- `apps/docs` — through Fumadocs' `<DemoPreview sourcePath="apps/demos/src/...">`
  RSC, which renders the demo inside the docs site. Run
  `pnpm --filter @acronis-platform/shadcn-uikit-docs dev`.

If you genuinely need a standalone preview environment for this
workspace (e.g. a Storybook-style harness for components that aren't
yet wired into the demo or docs apps), add it as a sibling workspace
rather than retrofitting a `dev` script here — the no-dev contract is
what lets the source stay drop-in consumable.

## Layout

- `src/<feature>/` — one folder per UI feature (button, calendar,
  form, …) exporting demo variants.
- `src/<feature>/index.ts` — the public surface, re-exported by the
  package's `exports` map (`./<feature>`).
- `src/icons/` — icon-related helpers; `missing-icons.tsx` has its own
  named export.

## Scripts

The canonical `build` / `test` / `clean` scripts are no-op stubs (no
artefact to produce, no tests live here). `lint`, `lint:fix`, and
`typecheck` are real. Run them from this directory or with the
workspace filter:

```bash
pnpm --filter @acronis-platform/shadcn-uikit-demos typecheck
pnpm --filter @acronis-platform/shadcn-uikit-demos lint
```
