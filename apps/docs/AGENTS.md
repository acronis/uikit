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

## What this site documents

The site is **focused on `@acronis-platform/ui-react`** (the next-gen Base UI
library) and its ecosystem packages. The legacy `@acronis-platform/shadcn-uikit`
library is documented under a deprecated **Legacy** section
(`content/docs/legacy/`).

## Content structure

- `content/docs/` — MDX pages + `meta.json` files controlling sidebar order.
  Top-level order: `index`, `getting-started`, `theming`, `components`, `icons`,
  `packages`, `guides`, `legacy`.
- `content/docs/components/` — one MDX file per **ui-react** component (24).
  These are **API-reference pages**: usage + code-snippet examples +
  `<AutoTypeTable>`. They have **no live `<DemoPreview>`** — see "ui-react has no
  live demos" below.
- `content/docs/packages/` — the ecosystem section (`tokens-pd`, `icons-react`,
  `icons-sprite`, `design-tokens`, `design-assets`).
- `content/docs/legacy/` — the deprecated legacy library: a deprecation
  notice (`index.mdx`), the relocated legacy component pages
  (`legacy/components/`, ~50 files), and the legacy forms guide
  (`legacy/forms.mdx`). These pages **keep their live `<DemoPreview>`** widgets.
- `src/components/DemoPreview.tsx` — async RSC for live preview + source toggle
  (used by the legacy pages only).
- `src/components/demos/` — client-wrapper files that re-export from
  `@acronis-platform/shadcn-uikit-demos` and add `'use client'`. Demo
  components use hooks and browser APIs, so they need that directive;
  the shared demos package doesn't add it, so the wrappers do. **These pull
  from the legacy library** (`shadcn-uikit-demos` → `shadcn-uikit/react`).
- `src/components/IconCatalog.tsx` — searchable catalog rendering the
  `@acronis-platform/icons-react` packs (`/docs/icons`).

## ui-react has no live demos

The shared `@acronis-platform/shadcn-uikit-demos` package imports the **legacy**
package specifier. The alias trick that lets ui-react's Storybook swap the
library at build time **does not work in the Next/RSC docs build** — bundler-
aliasing a `"use client"` component drops it from Next's client manifest, so it
renders as `undefined` (see `packages/ui-react/AGENTS.md`). Therefore ui-react
component pages use **static code blocks**, not `<DemoPreview>`. Add live demos
only if/when a ui-react-backed demos path exists.

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
<AutoTypeTable path="../../packages/ui-react/src/components/ui/button/button.tsx" name="ButtonProps" />
```

(Legacy pages still point at `../../packages/ui-legacy/src/components/ui/<x>.tsx`.)

For compound components or types that `AutoTypeTable` cannot resolve
(re-exported Base UI types, complex CVA generics, parts with no exported prop
interface), use a `.docs.ts` companion file alongside the component source:

```
<AutoTypeTable path="../../packages/ui-react/src/components/ui/<component>/<component>.docs.ts" name="..." />
```

Several `.docs.ts` companions exist in `ui-legacy`. Only create a new one when
`AutoTypeTable` fails to produce a useful table from the original source — many
ui-react compound parts (e.g. the `InputSelect*` family) extend Base UI props
without their own interface, so they need a companion or should be documented
with usage examples instead.

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
