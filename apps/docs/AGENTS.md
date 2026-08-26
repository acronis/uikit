# AGENTS.md — `apps/docs`

`@acronis-platform/uikit-docs` — the documentation site.
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
pnpm --filter @acronis-platform/uikit-docs dev
```

## What this site documents

The site documents **`@acronis-platform/ui-react`** (the Base UI library) and
its ecosystem packages. Layouts and usage patterns are documented as
**Layout** / **Patterns** subsections of the Components page rather than as
their own top-level sections.

## Content structure

- `content/docs/` — MDX pages + `meta.json` files controlling sidebar order.
  Top-level order: `getting-started`, `theming`, `typography`,
  `styling-utilities`, `token-reference`, `components`, `icons`, `packages`,
  `shadow-dom`.
- `content/docs/components/` — one MDX file per **ui-react** component, plus a
  `---Layout---` subsection (app-shell-chat, page-header, page-content, stack,
  grid, section — layout primitives, not one-off pages)
  and a `---Patterns---` subsection (dashboard,
  filter-popover, data-table-bulk-actions, sheet-detail-panel, empty-screen —
  approved multi-component compositions, backed by
  `packages/ui-spec/patterns/<name>/pattern.yaml`). Each page pairs usage +
  code-snippet examples + `<AutoTypeTable>` with a **live `<DemoReact>`**
  preview (shadow-root isolated) — see "ui-react live demos" below.
- `content/docs/packages/` — the published-package inventory (`ui-react`,
  `tokens-pd`, `icons-react`, `design-tokens`, `design-assets`).
- `src/components/demos-react/` — `'use client'` demos for the **ui-react**
  pages, importing straight from `@acronis-platform/ui-react`. One
  `<Name>Demo` per component, rendered through `<DemoReact>` (see below).
  `demos-react/patterns/` holds the pattern demos.
- `src/components/DemoReact.tsx` + `src/components/ShadowDemo.tsx` — the
  ui-react live-preview wrapper: `ShadowDemo` mounts the demo in a **shadow
  root** that adopts ui-react's stylesheet (fetched from `/api/ui-react-css`),
  isolating it from the Fumadocs CSS on the global document.
- `src/components/IconCatalog.tsx` — searchable catalog rendering the
  `@acronis-platform/icons-react` packs (`/icons`).

## ui-react live demos (shadow-root isolated)

ui-react component pages render **live `<DemoReact>` previews**, not just static
code blocks. Demos live in this workspace and import the library directly:

- write a `'use client'` demo in `src/components/demos-react/<name>.tsx` that
  imports directly from `@acronis-platform/ui-react`, and
- render it via `<DemoReact>`, which mounts it inside a **shadow root**
  (`ShadowDemo`) that adopts ui-react's stylesheet from `/api/ui-react-css`.

The shadow boundary keeps ui-react's Tailwind preflight from colliding with the
Fumadocs CSS loaded globally on the docs document. For components with
portaled overlays (Select/Tooltip popups), the demo reads `useShadowMount()` and
passes it as the primitive's `portalContainer` so the popup inherits the shadow's
styles. See `card-filter.tsx` / `input-select.tsx` for the pattern.

> **The demos need ui-react's compiled CSS — `predev`/`prebuild` build it.** The
> `/api/ui-react-css` route serves ui-react's **compiled** `dist/ui-react.css`
> (`node_modules/@acronis-platform/ui-react/dist/ui-react.css`), a **gitignored**
> build artifact. If it's missing, the shadow root adopts no stylesheet and every
> preview shows raw unstyled markup. To prevent that, this workspace's `dev` and
> `build` scripts have `predev`/`prebuild` hooks that run
> `pnpm --filter @acronis-platform/ui-react build` first (pnpm runs `pre*` hooks by
> default), so a fresh `pnpm --filter @acronis-platform/uikit-docs dev` just works.
> The cost is a ~1.5s ui-react rebuild on every dev/build start. (CI is also fine
> independently — `pnpm -r build` builds ui-react topologically.) Because the
> served sheet is Tailwind-compiled from ui-react's own source, a demo may only
> use utility classes that ui-react itself ships — a class used solely in a demo is
> tree-shaken out and no-ops in the preview.

## Critical path conventions

These are easy to get wrong because the conventions differ by component:

### `<AutoTypeTable path="...">`

`AutoTypeTable` paths are **relative to `apps/docs/`**:

```
<AutoTypeTable path="../../packages/ui-react/src/components/ui/button/button.tsx" name="ButtonProps" />
```

For compound components or types that `AutoTypeTable` cannot resolve
(re-exported Base UI types, complex CVA generics, parts with no exported prop
interface), use a `.docs.ts` companion file alongside the component source:

```
<AutoTypeTable path="../../packages/ui-react/src/components/ui/<component>/<component>.docs.ts" name="..." />
```

Only create a new one when
`AutoTypeTable` fails to produce a useful table from the original source — many
ui-react compound parts (e.g. the `InputSelect*` family) extend Base UI props
without their own interface, so they need a companion or should be documented
with usage examples instead.

### `AutoTypeTable` global registration

`AutoTypeTable` is registered as a global MDX component in
`src/app/[...slug]/page.tsx`. MDX files do **not** need to
import it.

### Routing

Docs content is served at the app **root** (`/<slug>`), not under `/docs` —
Fumadocs `source` uses `baseUrl: '/'` and the catch-all lives at
`src/app/[...slug]/`. The marketing landing is `src/app/page.tsx` at `/`. This
keeps URLs single-segment under the deploy basePath (`/uikit/docs/<page>`, not
`/uikit/docs/docs/<page>`). Internal links therefore point at `/<page>` (e.g.
`/components/button`), never `/docs/<page>`.

### Redirects for moved pages

The site is a **static export** deployed to GitHub Pages (see
`.github/workflows/demo-deploy.yml`), so `next.config.mjs`'s `redirects()`
never runs in production — there's no server to serve them from. When a page
moves, add a literal route at the old path with `src/components/LegacyRedirect.tsx`
(client-side `router.replace`), e.g. `src/app/layouts/page.tsx` →
`<LegacyRedirect to="/components" />`. See `src/app/layouts/`, `src/app/patterns/`,
and `src/app/guides/shadow-dom/` for examples from the legacy/guides/layouts/patterns
restructuring. Content that was deleted outright (no replacement) is left to
`not-found.tsx` instead of a fake redirect.

## Search

The search API at `src/app/api/search/route.ts` uses Fumadocs
`createFromSource` for server-side search over the content index.
**No external search provider** (Algolia, etc.) is configured.

## No tests here

This workspace has no automated test suite (and no `test` / `test:watch` scripts). Documentation is verified by building and visually inspecting at `pnpm dev`.
