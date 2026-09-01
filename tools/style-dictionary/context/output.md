# Output — the CSS + Tailwind contract

The token build writes into the published `packages/tokens-pd/` package (committed,
not gitignored), grouped into `css/`, `tailwind/`, and `dtcg/` dirs. The CSS
(`tokens-pd/css/`) is partitioned by tier and brand:

- `css/default.css` — semantic tier, default brand (full): every `--ui-*` color +
  dimension custom property (colors in both light and dark), followed by the
  `.ui-typography-*` utility classes and the `.ui-p*`/`.ui-m*`/`.ui-gap*`
  (+ `.ui-mx-auto`) spacing utility classes.
- `css/brand-b.css` — semantic tier, non-default brand: **override-only** (below).
- `css/<component>/default.css` — component tier, default brand (full), one dir per
  component (`button/`, `breadcrumb/`, …).
- `css/<component>/brand-b.css` — component tier, non-default brand: override-only.

Tokens partition into files by `token.path[0]`: the semantic-tier roots —
`colors`, `gradients`, and `typography` — are the semantic tier (root file);
every other root is its own component dir. The semantic roots are **data-driven**:
the build derives them from the top-level keys of `semantics.json` via a shared
`semanticRoots()` helper, not a hardcoded set.

## Theming — `light-dark()` + `color-scheme`

The modern, single-block approach (baseline-supported: Chrome 123+, Safari 17.5+,
Firefox 120+). Every variable lives in `:root, :host`; color values carry both
modes inline and the browser resolves them from `color-scheme`:

```css
:root,
:host {
  --ui-background-surface-primary: light-dark(rgb(255 255 255), rgb(0 0 0));
  --ui-breadcrumb-gap: 4px;
}

[data-theme='light'],
:host([data-theme='light']) {
  color-scheme: light;
}
[data-theme='dark'],
:host([data-theme='dark']) {
  color-scheme: dark;
}
```

`color-scheme` is set **only** by the explicit `[data-theme]` rules above —
there is no unconditional `color-scheme: light dark` shell on `:root` or
`:host`. An unconditional shell was tried and reverted: it let the browser
pick a scheme from the OS preference independent of the shadow host's actual
`[data-theme]` attribute, fighting shadow-DOM theming. Setting `data-theme` on
an ancestor (or `color-scheme` directly) is what activates a given mode for
that subtree; without it, `light-dark()` resolves against the browser's
`color-scheme: normal` default (light). Only the **base** (`acronis`) files
carry this shell; override files are bare `:root, :host {}`.

## Brand model — base + override

Files write a bare `:root` (no brand class). An app picks **one brand**: import the
base then optionally that brand's override file — last import wins. A non-default
brand file contains a declaration only when its value **differs** from `acronis`
or is **new** in that brand (identical tokens are omitted).

## Variable & class names — `--ui-*`

The `name/ui` transform drops a leading `colors` tier segment and prefixes every
token with `ui`:

- `colors.background.surface.primary` → `--ui-background-surface-primary`
- `button._global.radius` → `--ui-button-global-radius` (leading `_` dropped)
- typography composites become a class → `.ui-typography-body-default`

## Value formats

| Token `$type` | Output                                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `color`       | `--ui-…` custom property, `light-dark(<rgb>, <rgb>)` — modern `rgb(r g b)`, or `rgb(r g b / a)` when the color carries opacity (raw decimal alpha) |
| `gradient`    | `--ui-…` custom property, `linear-gradient(<deg>, <rgb> <pos>%, …)` (theme-invariant; angle from the Figma transform)                              |
| `dimension`   | `--ui-…` custom property, `<value><unit>`, e.g. `4px`, `0px`                                                                                       |
| `typography`  | a `.ui-typography-…` class: `font-family`, `font-size` (px), `font-weight`, `line-height` (px), `letter-spacing` (px)                              |

Colors are always wrapped in `light-dark()`, even when both modes resolve to the
same value. Gradients, dimensions, and typography are mode-invariant, so they
appear once with a single value.

## Gap utility classes

Every numeric `units.gap.*` **primitive** size also emits a full
padding/margin/gap utility grammar, in addition to its `--ui-gap-*` custom
property — for framework-agnostic (non-Tailwind) consumers who can't extend a
Tailwind preset. This is **not** a semantic token: `design-tokens/tiers/*.json`
is Figma-sourced only (there is no `spacing` group in Figma, only `gap`), so
`tokens.ts`'s `resolveGapTokens` reads `units.gap.*` directly — bypassing
`isEmittableToken`'s primitive-root filter — and feeds it into `buildCss`'s
`semantics` slice via dedicated code, the same way `STATIC_GAP_CLASSES` is
special-cased. `gapUtilityClasses` (`hooks/formats/gap-utility-classes.ts`)
derives the `{property}{direction}-{size}` classes Tailwind's own engine would
generate for free once a preset key exists:

| Prefix                  | Property                                                                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p`/`m`                 | `padding`/`margin`                                                                                                                                                                 |
| `px`/`mx`               | `padding-inline`/`margin-inline`                                                                                                                                                   |
| `py`/`my`               | `padding-block`/`margin-block`                                                                                                                                                     |
| `pt`/`mt`, `pb`/`mb`    | `padding-top`/`margin-top`, `padding-bottom`/`margin-bottom`                                                                                                                       |
| `pl`/`ml`, `pr`/`mr`    | `padding-left`/`margin-left`, `padding-right`/`margin-right` (physical — do not mirror under `dir="rtl"`)                                                                          |
| `ps`/`ms`, `pe`/`me`    | `padding-inline-start`/`margin-inline-start`, `padding-inline-end`/`margin-inline-end` (logical — use these instead of `pl`/`pr`/`ml`/`mr` for anything that should mirror in RTL) |
| `gap`, `gap-x`, `gap-y` | `gap`, `column-gap`, `row-gap`                                                                                                                                                     |

Plus one static, non-token-driven class emitted once per build:
`.ui-mx-auto { margin-inline: auto; }`.

## Gradients

Gradient tokens live under the top-level `gradients.*` root of `semantics.json`
(a semantic root, so they emit into the root semantic CSS as `--ui-gradients-*`
custom properties and into the base Tailwind preset's `backgroundImage`). They are
rendered by the `gradient/css` transform (`hooks/transforms/gradient-css.ts`): the
`$value` is a DTCG array of `{ color, position }` stops and the matrix is under
`$extensions.com.figma.gradientTransform`, mapped to a CSS angle via
`atan2(a, -c)`. Each stop color uses the same hsl→rgb conversion as solid colors.

## Tailwind presets

`pd-tailwind` (`tailwind.ts`) emits `tailwind/<brand>.js` (+ `.d.ts`) — a preset
object (`{ theme: { extend: … } }`) consumed via `@config`. Values are
**baked** resolved literals (colors as `light-dark()`, gradients into
`backgroundImage`, typography into `fontSize`/`fontFamily`, dimensions into
`spacing`/`borderRadius`), keyed with the `ui-` prefix — so a preset is
self-contained (no `--ui-*` dependency) and brand selection is build-time. The
shared semantic (`tokens`) preset also gets `gap-<n>` keys merged into its
`spacing` namespace directly from `resolveGapTokens`, independent of the
token-driven `buildThemeExtend` pass above (`units.gap` isn't a normal token
in the resolved stream — see "Gap utility classes").

The color/gradient → Tailwind-namespace routing (which theme namespace a token
lands in — `backgroundColor`, `textColor`, `borderColor`, `fill`, `ringColor`,
`backgroundImage`) is **data-driven**: it is authored in the source tokens as a
root-level `com.acronis.tailwindRoles` extension (in `semantics.json` and
`components.json`) and read at build time by `routeColor` (`tailwind.ts`), rather
than hardcoded role→namespace maps in the tool. The key-shaping is unchanged:
**pure semantic-tier role words are dropped** from the utility key
(`bg-surface-primary`), while **component part words are kept**
(`bg-button-primary-container-idle`); gradients route to `backgroundImage`.
