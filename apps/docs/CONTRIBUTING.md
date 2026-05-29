# Contributing to `@acronis-platform/shadcn-uikit-docs`

This is the Next.js + Fumadocs documentation site. **Private**, not
published, **no changeset needed**.

See [the root CONTRIBUTING.md](../../CONTRIBUTING.md) for the umbrella
process. See [AGENTS.md](AGENTS.md) for technical context — especially
the **`DemoPreview` and `AutoTypeTable` path conventions**, which are
easy to get wrong.

## What goes here

- New or updated component documentation pages (`content/docs/components/<name>.mdx`).
- Guides, tutorials, and conceptual content under `content/docs/`.
- Updates to the sidebar via `meta.json` files.
- Client wrappers (`src/components/demos/`) for new demos coming out of
  `apps/demos`.
- Site infrastructure (search, layout, navigation).

## What does NOT go here

- Reusable demo components themselves. Those live in `apps/demos`.
  This workspace only wraps them (with `'use client'`) and references
  them from MDX.
- Library source code. That lives in `packages/legacy/ui`.

## Workflow for a new component doc page

1. **Create the demo** in `apps/demos/src/<component>/<DemoName>.tsx`
   (see [apps/demos/CONTRIBUTING.md](../demos/CONTRIBUTING.md)).
2. **Add a client wrapper** in `src/components/demos/<DemoName>.tsx`:
   ```tsx
   'use client';
   export { DemoName } from '@acronis-platform/shadcn-uikit-demos/<component>';
   ```
3. **Create the MDX page** at `content/docs/components/<component>.mdx`.
4. **Use `<DemoPreview>` to render** with source toggle. Its
   `sourcePath` is **relative to the monorepo root**:
   ```mdx
   <DemoPreview sourcePath="apps/demos/src/button/ButtonVariants.tsx" ... />
   ```
5. **Use `<AutoTypeTable>` for prop docs**. Its `path` is **relative to
   `apps/docs/`**:
   ```mdx
   <AutoTypeTable
     path="../../packages/legacy/ui/src/components/ui/button.tsx"
     name="ButtonProps"
   />
   ```
6. **If `AutoTypeTable` can't resolve the types** (compound components,
   re-exported Radix/Base UI types, complex CVA generics), create a
   `<component>.docs.ts` companion file in the library workspace
   defining the types with TSDoc, and point `AutoTypeTable` at that
   instead. Only do this when the table from the source is unusable —
   8 companions exist today; don't add a 9th unless necessary.
7. **Add to the sidebar** via the relevant `meta.json` under
   `content/docs/`.

`AutoTypeTable` is registered as a global MDX component in
`src/app/docs/[[...slug]]/page.tsx`. **Do not import it** in MDX files.

## Verification

```bash
pnpm --filter @acronis-platform/shadcn-uikit-docs dev      # local dev
pnpm --filter @acronis-platform/shadcn-uikit-docs build    # production build
pnpm --filter @acronis-platform/shadcn-uikit-docs typecheck
pnpm --filter @acronis-platform/shadcn-uikit-docs lint
```

Visually verify every page you changed at `pnpm dev`. There is no automated test suite (and no `test` / `test:watch` scripts) in this workspace by design. Search is server-side via Fumadocs `createFromSource`; no external provider needs configuring.

## No changeset needed

This workspace is in `.changeset/config.json`'s `ignore` list.
