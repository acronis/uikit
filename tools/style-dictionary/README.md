# @acronis-platform/style-dictionary

A **private** build tool (not published) that translates
[`@acronis-platform/design-tokens`](../../packages/design-tokens) into per-brand
CSS custom properties, using [Style Dictionary v5](https://styledictionary.com/).
It is the first tool in the repo's `tools/` tier.

## What it produces

Run the build and inspect the gitignored `dist/`:

```bash
pnpm --filter @acronis-platform/style-dictionary build
```

```
dist/
├── tokens/
│   ├── pd-dtcg/                  # stage 1: 100%-DTCG JSON, one file per mode
│   │   ├── primitives-light.json #   (Theme axis)
│   │   ├── primitives-dark.json
│   │   ├── semantic-acronis.json #   (Brand axis; aliases kept, not flattened)
│   │   ├── semantic-brand-b.json
│   │   ├── components-acronis.json
│   │   └── components-brand-b.json
│   └── pd-css/                   # stage 2: per-brand CSS custom properties
│       ├── acronis.css
│       └── brand-b.css
└── assets/                       # design-assets → optimized SVG + React, one dir per deliverable
    ├── pd-concept-pack-svg/      #   <asset>-<size>.svg            + manifest.json
    ├── pd-concept-pack-react/    #   <asset>.tsx + index.ts        + manifest.json
    ├── pd-icons-svg/             #   <style>/<asset>-<size>.svg    + manifest.json   (4 icon packs merged)
    ├── pd-icons-react/           #   <asset>.tsx + index.ts        + manifest.json   (variant = style)
    └── web-illustrations-svg/    #   <asset>-<size>.svg            + manifest.json   (SVG-only)
```

Each deliverable is a self-contained platform directory (`<filter>-<group>-<format>`);
the group manifest is duplicated into each so every dir stands alone.

Each CSS file is a single `:root` block using the modern `light-dark()` +
`color-scheme` pattern, with path-derived variable names (no prefix), `rgb()`
colors, and `px` dimensions, followed by a block of `.typography-*` utility
classes. Only the **semantic** and **component** tiers are emitted — the palette
is a resolution input, not output.

```css
:root {
  color-scheme: light dark;
  --colors-background-surface-primary: light-dark(rgb(255 255 255), rgb(0 0 0));
  --button-global-radius: 4px;
}
[data-theme='light'] {
  color-scheme: light;
}
[data-theme='dark'] {
  color-scheme: dark;
}

.typography-body-default {
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
}
```

## How it works

Two token stages — see [`context/pipeline.md`](context/pipeline.md) for the full
mapping and [`context/output.md`](context/output.md) for the CSS contract:

1. **Normalize** the Acronis tokens (per-mode `values`, `platforms`) into plain
   DTCG JSON, split by mode, filtered to the `PD` platform, with aliases
   preserved. Every `$value` is already native DTCG, so it passes through as-is.
2. **Resolve & format** each brand against both themes, zipping colors into
   `light-dark()` and writing the CSS.

A separate **assets** build (`pd-assets` / `web-assets`) turns
[`@acronis-platform/design-assets`](../../packages/design-assets) packs into
optimized SVG files and React components — see [`context/assets.md`](context/assets.md).
It resolves each pack per the package's `spec.md` (the resolver), then executes
the scale/stroke rules and a currentColor pass on the SVGs (the executor the spec
leaves open), optimizes with SVGO, and generates one React component per asset
(`variant` = style for the merged icons, `size` = the manifest sizes). Mono icons
become `currentColor`; multi-color icons and illustrations keep their exact colors.

## Scripts

| Script                | Does                                                                 |
| --------------------- | -------------------------------------------------------------------- |
| `build`               | all platforms: `pd-dtcg` → `pd-css`, plus `pd-assets` / `web-assets` |
| `clean`               | remove `dist/`                                                       |
| `lint` / `typecheck`  | eslint / `tsc --noEmit`                                              |
| `test` / `test:watch` | `vitest` — resolver (R1–R16), executor, codegen, and SVGO specs      |
| `dev`                 | no-op (run `build`)                                                  |

### Targeted builds

Each output is a platform key, `<filter>-<output>`. `filter` maps to the
`platforms` enum: tokens are `pd` today; assets span `pd` (icons, concept-pack)
and `web` (illustrations). Pass keys to build a subset:

```bash
pnpm build                                       # everything (default)
pnpm build pd-css                                # just pd-css (runs its pd-dtcg dependency first)
pnpm build pd-assets web-assets --pack=icons-stroke-mono   # only that pack's assets
pnpm build -- --filter=web                       # restrict to one filter (web-assets only)
```

The `--pack` selector exists so CI can rebuild only the asset packs that changed
(a pack emits if it belongs to a requested platform key); tokens always build
together. A full asset build (no `--pack`) resets the filter's dist dir.

Requires **Node ≥ 22** (Style Dictionary v5).
