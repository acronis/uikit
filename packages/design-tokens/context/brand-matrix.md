# Brand matrix

The set of **brands** the token pipeline supports, what each overrides, and how
light/dark is handled. This is the source of truth for issue #174 (E1). The brand
list is **data-driven** — see [Adding a brand](#adding-a-brand).

## Two independent axes

A brand and a color mode are **separate axes**, and the pipeline treats them
differently:

- **Brand** (Acronis, Virtuozzo, …) — the `values` dict on each token in
  `tiers/semantic.json` and `tiers/components.json` is **keyed by brand**. Each
  brand becomes a generated stylesheet (`tokens-pd/css/<brand>.css`).
- **Color mode** (light / dark) — **not** a brand. `tiers/primitives.json` is
  keyed by `light` / `dark`, and the build zips a token's two theme resolutions
  into one `light-dark(<light>, <dark>)` declaration. So **every brand is
  automatically light + dark** in a single stylesheet — there is no separate
  "dark" brand (unlike the legacy Vue themes, which shipped `dark` as its own
  theme).

> Migrating from `ui-legacy`: the legacy `@uikit/ui-kit-themes` shipped ~24
> `[data-theme=…]` SCSS themes (`--av-*`, oklch), most of them **light-only
> accent overrides** layered on a shared `default`, with `dark` as a separate
> theme. Here the same brands become **brand modes** in Figma → `values.<brand>`
> keys → generated `--ui-*` CSS, with light/dark folded into every token.

## Delivery model

`acronis` is the **default brand**: it emits **full** stylesheets (`acronis.css`

- `css/<component>/acronis.css`). Every other brand emits **override-only**
  files — just the tokens whose value differs from `acronis`. Consumers load the
  acronis base, then layer a brand override and flip `color-scheme` / `[data-theme]`:

```
acronis.css            (full base, light + dark)
  + <brand>.css        (override-only: the brand's diff vs acronis)
```

Because non-default brands are a diff, a brand that only restyles its accent
colors produces a tiny file; brands inherit everything they don't override from
the acronis base.

## Brand override surface

Which token groups a brand is expected to override (everything else is inherited
from the acronis base — keep brands small and maintainable):

| Group (semantic)                       | Tokens                                                   | Brand overrides?               |
| -------------------------------------- | -------------------------------------------------------- | ------------------------------ |
| Brand color                            | `--ui-background-brand-*`                                | **yes** (the point of a brand) |
| On-brand foreground                    | `--ui-text-on-*`, `--ui-glyph-on-*`                      | usually                        |
| Focus ring                             | `--ui-focus-*`                                           | usually                        |
| AI gradient                            | `--ui-background-ai-*`                                   | optional                       |
| Per-component brand tiers              | `css/<component>/<brand>.css` (button, chip, switch, …)  | as needed                      |
| Neutral surfaces / status / text scale | `--ui-background-surface-*`, `--ui-*-status-*`, neutrals | rarely (white-label exception) |
| Primitives (palette, scales)           | `tiers/primitives.json`                                  | **never** (brand-agnostic)     |
| Typography, spacing, radii, units      | —                                                        | **never**                      |

Today `brand-b` (the proof-of-pipeline second brand) overrides exactly the first
three groups plus per-component tiers for 11 components — the canonical "accent
brand" surface.

## The matrix

Target brand set = the **legacy Acronis brand set** carried over from
`ui-legacy`, plus **any new brand Figma introduces** (data-driven). Each row is a
Figma **brand mode** → a `values.<brand>` key → a generated `<brand>.css`.

`brand id` is the kebab key used in `values.<brand>` and the CSS filename
(`<brand>.css`).

| Brand id                | Legacy `[data-theme]` | Partner / use     | Role                                                  | Light     | Dark                 |
| ----------------------- | --------------------- | ----------------- | ----------------------------------------------------- | --------- | -------------------- |
| `acronis`               | `acronis` / `default` | Acronis           | **default (full base)**                               | ✓         | ✓                    |
| `blue-yellow`           | `blue-yellow`         | USS Signal        | accent                                                | ✓         | ?                    |
| `brown`                 | `brown`               | —                 | accent                                                | ✓         | ?                    |
| `dark-gray`             | `dark-gray`           | —                 | accent                                                | ✓         | ?                    |
| `deep-purple`           | `deep-purple`         | —                 | accent                                                | ✓         | ?                    |
| `deep-sky`              | `deep-sky`            | ITKontoret        | accent                                                | ✓         | ?                    |
| `green`                 | `green`               | ALSO / Choise     | accent                                                | ✓         | ?                    |
| `ingram`                | `ingram`              | Ingram Micro      | accent                                                | ✓         | ?                    |
| `light-blue`            | `light-blue`          | HP                | accent                                                | ✓         | ?                    |
| `light-gray`            | `light-gray`          | —                 | accent                                                | ✓         | ?                    |
| `orange`                | `orange`              | Tsukaeru / Helpox | accent                                                | ✓         | ?                    |
| `pinky`                 | `pinky`               | —                 | accent                                                | ✓         | ?                    |
| `purple`                | `purple`              | —                 | accent                                                | ✓         | ?                    |
| `purple-fusion`         | `purple-fusion`       | Media             | accent                                                | ✓         | ?                    |
| `red`                   | `red`                 | Home.pl           | accent                                                | ✓         | ?                    |
| `red-brick`             | `red-brick`           | Fire Brick        | accent                                                | ✓         | ?                    |
| `sand`                  | `sand`                | —                 | accent                                                | ✓         | ?                    |
| `telstra`               | `telstra`             | Telstra           | accent                                                | ✓         | ?                    |
| `virtual-one`           | `virtual-one`         | Virtual One       | accent                                                | ✓         | ?                    |
| `virtuozzo`             | `virtuozzo`           | Virtuozzo         | accent / full                                         | ✓         | ✓ (legacy `__new__`) |
| `web`                   | `web`                 | Website           | accent                                                | ✓         | ?                    |
| `yellow`                | `yellow`              | 1C                | accent                                                | ✓         | ?                    |
| —                       | `dark`                | —                 | **color mode, not a brand** (every brand's dark half) | —         | —                    |
| `brand-b`               | —                     | pipeline proof    | accent (placeholder)                                  | ✓         | ✓                    |
| _(any new Figma brand)_ | —                     | —                 | data-driven                                           | per Figma | per Figma            |

That is the **24 legacy themes** (the `ui-legacy` set): 22 brand rows + the
`acronis`/`default` base + the `dark` **mode** (folded into every brand, not its
own brand). `brand-b` is an extra placeholder proving the override pipeline.

### Light / dark per brand

Every brand is light **and** dark via `light-dark()` — **provided its Figma mode
defines dark values**. In `ui-legacy`, only `default`/`acronis` (and the
half-migrated `virtuozzo` under `__new__/`) had a real dark variant; the accent
partner themes were light-only. So the **`Dark` column is `?` pending Figma**:
each brand mode must supply dark values, or it inherits the acronis dark base for
anything it doesn't override (acceptable, but confirm per brand).

## Adding a brand

Fully **data-driven** — no code change in `tools/style-dictionary`:

1. Add the brand as a **mode** in the Figma variable collection and define its
   token values (at minimum the [override surface](#brand-override-surface)).
2. Sync into `@acronis-platform/design-tokens` — the synced `tiers/*.json` gain a
   `values.<brand>` key on the tokens the brand sets.
3. Rebuild `tokens-pd`. `tools/style-dictionary` discovers the brand from the
   union of `values` keys (`discoverBrands()` in `tokens.ts`) and emits
   `css/<brand>.css` (+ per-component overrides) and the Tailwind preset.

A brand mode in Figma is **exhaustive** (every variable has a value per mode), so
each brand resolves as a complete view; the build emits only its diff vs acronis.

## Current state vs target

- **Shipped now:** `acronis` (full) + `brand-b` (override-only placeholder).
- **Target:** the legacy set above, sourced from Figma brand modes.
- **Gap (data, not code):** the 21 legacy accent brands' token values are **not
  yet in Figma / design-tokens**. The pipeline is ready; populating them is a
  Figma-authoring + sync task (do not hand-author token values here — see the
  package `AGENTS.md`).

## Open confirmations (#174)

- Final brand set + exact Figma mode names (the roadmap also names a forward set
  `acronis-default` / `acronis-ocean` / `cyber-chat` / `acronis-white-label` —
  reconcile that with the legacy 22 above).
- Which brands ship a **dark** variant (vs inheriting acronis dark).
- Is `brand-b` kept as a fixture or removed once real brands land?
