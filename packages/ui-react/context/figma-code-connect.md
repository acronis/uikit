# Figma Code Connect — `packages/ui-react`

Figma Code Connect links `@acronis-platform/ui-react` components to their
Figma design counterparts. When a designer selects a component in Figma
Dev Mode, they see the real React snippet (importing from
`@acronis-platform/ui-react`) instead of raw CSS/HTML.

## Prerequisites

1. **Figma access token** — generate a personal access token at
   <https://www.figma.com/developers/api#access-tokens> with file-read
   scope, then export it:

   ```bash
   export FIGMA_ACCESS_TOKEN="figd_xxxxxxxxxxxx"
   ```

2. **Dependency** — `@figma/code-connect` is a devDependency of this
   workspace. Run `pnpm install` from the repo root if it isn't installed.

## File structure

Each `.figma.tsx` file is co-located with its component:

```
src/components/ui/button/
├── button.tsx
├── button.figma.tsx   ← Code Connect definition
├── index.ts
├── __tests__/button.test.tsx
└── __stories__/button.stories.tsx
```

`figma.config.json` (workspace root) tells the CLI where these files live
and rewrites local import paths to the published package specifier so the
generated snippet reads `import { Button } from '@acronis-platform/ui-react'`:

```json
{
  "codeConnect": {
    "parser": "react",
    "include": ["src/components/**/*.figma.tsx"],
    "importPaths": { "src/components/ui/*": "@acronis-platform/ui-react" }
  }
}
```

These files are excluded from the library build (`vite.lib.config.ts`
drops `*.figma.tsx` from the `dts` step) and from Vitest, so nothing
ships to npm.

## Status markers

Each `.figma.tsx` carries a status comment in its header:

| Status            | Meaning                                                            |
| ----------------- | ------------------------------------------------------------------ |
| `SKELETON`        | Figma node URL **and** property names both still need completion.  |
| `NEEDS_FIGMA_URL` | Props are mapped correctly; the Figma node URL is a placeholder.   |
| `COMPLETE`        | Fully connected — node URL and all property mappings are verified. |

There is deliberately **no separate status for "no design is expected"**. Two
cases fall outside the table above, and both are recorded in prose rather than
by inventing a marker:

- **Intentionally undesigned primitives** (`field`, `form`, `number-field`,
  `grid`) keep `NEEDS_FIGMA_URL` as the closest available marker, but their
  header comment must state explicitly that no Figma node exists, none is
  expected, and the placeholder is not a TODO. Don't read `NEEDS_FIGMA_URL` on
  these as pending work.
- **No `.figma.tsx` file at all** is the correct state for an inner primitive
  whose design lives on its public wrapper's node — e.g. `input`'s `InputBox`
  is the bare box inside `InputText`, and `InputText` carries the design, the
  spec, and the Code Connect entry. Adding a second connection for the inner
  primitive would point two entries at one Figma node. Note the reason in the
  component's own source comment instead.

A `COMPLETE` status also asserts the node lives in the **shared** ui-react
design-system file. A mapping to a product-specific file (e.g.
`description-list` → the Cyber-Compliance "Service status" list) is not a
design-system connection and must not be marked `COMPLETE`.

## Completing a connection

1. **Get the Figma node URL.** Open the Acronis Design System in Figma,
   select the **component set** (purple diamond holding all variants),
   right-click → **Copy link to selection**, and replace `'FIGMA_NODE_URL'`.
2. **Verify property names.** Open the component's **Properties** panel.
   Names are case-sensitive — adjust the left-hand keys in each
   `figma.enum(...)` / `figma.boolean(...)` to match exactly.
3. **Update the status** comment to `COMPLETE`.
4. **Validate:** `pnpm --filter @acronis-platform/ui-react figma:connect`.

> The Figma MCP server (`get_code_connect_suggestions`,
> `get_code_connect_map`) can suggest the node URL and property mapping
> automatically when you have the design file open.

## Commands

Run from the repo root (or drop `--filter …` when inside the workspace):

```bash
# Validate all .figma.tsx without publishing
pnpm --filter @acronis-platform/ui-react figma:connect

# Publish connections to Figma (requires FIGMA_ACCESS_TOKEN)
pnpm --filter @acronis-platform/ui-react figma:connect:publish

# Remove all published connections
pnpm --filter @acronis-platform/ui-react figma:connect:unpublish
```

## `figma.*` prop helpers

| Helper                        | Purpose                             | Example               |
| ----------------------------- | ----------------------------------- | --------------------- |
| `figma.enum('Prop', mapping)` | Figma variant enum → prop value     | `variant`, `size`     |
| `figma.boolean('Prop')`       | Figma boolean property              | `disabled`, `checked` |
| `figma.string('Prop')`        | Figma text property                 | label text            |
| `figma.instance('Prop')`      | Figma instance-swap → child element | icon slots            |
| `figma.children('Layer')`     | Child layers → JSX children         | composed content      |

The `example` function receives the mapped props and returns the JSX that
Figma renders in Dev Mode.

## Adding a new component

1. Create `<name>.figma.tsx` next to the component's `.tsx` file.
2. Import `figma` from `@figma/code-connect` and the component locally.
3. Call `figma.connect(Component, 'FIGMA_NODE_URL', { props, example })`.
4. Run `pnpm --filter @acronis-platform/ui-react figma:connect` to validate.
5. Run `figma:connect:publish` to make it live.
