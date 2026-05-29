# AGENTS.md — `apps/docs`

`@acronis-platform/shadcn-uikit-docs` — the documentation site.
**Private**, not published.

Cross-cutting topics live in `../../context/*.md`. This file documents
only what is specific to this workspace.

## Stack

- **Next.js 15** (`next@15.5.18`) — App Router.
- **[Fumadocs](https://www.fumadocs.dev/)** — `fumadocs-core`,
  `fumadocs-ui`, `fumadocs-mdx`, `fumadocs-typescript`.
- **Base UI** (`@base-ui/react`) and a Radix Dialog for overlays.
- **`next-themes`** for theme toggling.

## Running

```bash
pnpm --filter @acronis-platform/shadcn-uikit-docs dev
```

## Content structure

- `content/docs/` — MDX pages + `meta.json` files controlling sidebar order.
- `content/docs/components/` — one MDX file per UI component (~40 files).
- `src/components/DemoPreview.tsx` — async RSC for live preview + source toggle.
- `src/components/demos/` — ~40 client-wrapper files that re-export from
  `@acronis-platform/shadcn-uikit-demos` and add `'use client'`. Demo
  components use hooks and browser APIs, so they need that directive;
  the shared demos package doesn't add it, so the wrappers do.

## Critical path conventions

These are easy to get wrong because the conventions differ by component:

### `<DemoPreview sourcePath="...">`

`sourcePath` is **relative to the monorepo root**, not the docs app:

```
sourcePath="apps/demos/src/button/ButtonVariants.tsx"
```

`DemoPreview` resolves this via `resolve(process.cwd(), '..', '..', sourcePath)`
because `process.cwd()` is `apps/docs/` at build time.

### `<AutoTypeTable path="...">`

`AutoTypeTable` paths are **relative to `apps/docs/`**:

```
<AutoTypeTable path="../../packages/legacy/ui/src/components/ui/button.tsx" name="ButtonProps" />
```

For compound components or types that `AutoTypeTable` cannot resolve
(re-exported Radix/Base UI types, complex CVA generics), use a
`.docs.ts` companion file alongside the component source:

```
<AutoTypeTable path="../../packages/legacy/ui/src/components/ui/dialog.docs.ts" name="DialogContentProps" />
```

8 `.docs.ts` companions exist today. Only create a new one when
`AutoTypeTable` fails to produce a useful table from the original source.

### `AutoTypeTable` global registration

`AutoTypeTable` is registered as a global MDX component in
`src/app/docs/[[...slug]]/page.tsx`. MDX files do **not** need to
import it.

## Search

The search API at `src/app/api/search/route.ts` uses Fumadocs
`createFromSource` for server-side search over the content index.
**No external search provider** (Algolia, etc.) is configured.

## No tests here

This workspace has no automated test suite (and no `test` / `test:watch` scripts). Documentation is verified by building and visually inspecting at `pnpm dev`.
