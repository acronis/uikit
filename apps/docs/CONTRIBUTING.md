# Contributing to `@acronis-platform/uikit-docs`

This is the Next.js + Fumadocs documentation site. **Private**, not
published, **no changeset needed**.

See [the root CONTRIBUTING.md](../../CONTRIBUTING.md) for the umbrella
process. See [AGENTS.md](AGENTS.md) for technical context — especially
the **ui-react live demos** and **`AutoTypeTable` path conventions**,
which are easy to get wrong.

## What goes here

- New or updated component documentation pages (`content/docs/components/<name>.mdx`),
  including the `---Layout---` and `---Patterns---` subsections.
- Guides, tutorials, and conceptual content under `content/docs/`.
- Updates to the sidebar via `meta.json` files.
- `'use client'` demos in `src/components/demos-react/` for new
  `<DemoReact>` previews.
- Site infrastructure (search, layout, navigation).

## What does NOT go here

- Library source code. That lives in `packages/ui-react`.

## Workflow for a new component doc page

1. **Write a `'use client'` demo** in
   `src/components/demos-react/<component>.tsx` that imports directly
   from `@acronis-platform/ui-react`.
2. **Create the MDX page** at `content/docs/components/<component>.mdx`.
3. **Render the demo through `<DemoReact>`**, which mounts it in a
   shadow root so ui-react's Tailwind styles don't collide with the
   Fumadocs CSS:

   ```mdx
   import { DemoReact } from '@/components/DemoReact';
   import { ButtonDemo } from '@/components/demos-react/button';

   <DemoReact>
     <ButtonDemo />
   </DemoReact>
   ```

4. **Use `<AutoTypeTable>` for prop docs**. Its `path` is **relative to
   `apps/docs/`**:

   ```mdx
   <AutoTypeTable
     path="../../packages/ui-react/src/components/ui/button/button.tsx"
     name="ButtonProps"
   />
   ```

5. **If `AutoTypeTable` can't resolve the types** (compound components,
   re-exported Base UI types, complex CVA generics), create a
   `<component>.docs.ts` companion file alongside the component source
   defining the types with TSDoc, and point `AutoTypeTable` at that
   instead. Only do this when the table from the source is unusable.
6. **Add to the sidebar** via the relevant `meta.json` under
   `content/docs/`.

`AutoTypeTable` is registered as a global MDX component in
`src/app/[...slug]/page.tsx`. **Do not import it** in MDX files.

## Verification

```bash
pnpm --filter @acronis-platform/uikit-docs dev      # local dev
pnpm --filter @acronis-platform/uikit-docs build    # production build
pnpm --filter @acronis-platform/uikit-docs typecheck
pnpm --filter @acronis-platform/uikit-docs lint
```

Visually verify every page you changed at `pnpm dev`.
There is no automated test suite (and no `test` / `test:watch` scripts) in this workspace by design.
Search is server-side via Fumadocs `createFromSource`; no external provider needs configuring.

## No changeset needed

This workspace is in `.changeset/config.json`'s `ignore` list.
