# Acronis UI Kit

A pnpm monorepo for the Acronis design system: a React component library, a
design-token pipeline (Figma → JSON → CSS/Tailwind), icon packages,
design-data packages, and supporting apps and tooling.

**Architecture in brief:** `@acronis-platform/ui-react` is built on
[Base UI](https://base-ui.com/) unstyled primitives and themed by
`@acronis-platform/tokens-pd` (`--ui-*` CSS custom properties generated from
`@acronis-platform/design-tokens`). Tailwind CSS is used **internally** to
compile styles — consumers receive fully pre-built CSS and can use any
styling solution in their own project. No Tailwind installation required.

## 📦 Workspaces

The repo is organized into four top-level directories: `context/` (shared docs),
`apps/` (deployed apps, private), `packages/` (published libraries + data), and
`tools/` (private build tooling).

| Path                          | Package                                  | Published | Role                                                                         |
| ----------------------------- | ---------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| `packages/ui-react/`          | `@acronis-platform/ui-react`             | **yes**   | The React component library, built on **Base UI**, themed by `tokens-pd`.    |
| `packages/icons-react/`       | `@acronis-platform/icons-react`          | **yes**   | React icon components generated from `design-assets` (tree-shakeable).       |
| `packages/icons-sprite/`      | `@acronis-platform/icons-sprite`         | **yes**   | Generated SVG sprites built from `icons-svg`.                                |
| `packages/icons-svg/`         | `@acronis-platform/icons-svg`            | no        | Raw SVG icon sources fetched from Figma + manifests (source-only).           |
| `packages/icons-svg-next/`    | `@acronis-platform/icons-svg-next`       | no        | Raw SVG sources for the next-gen icon set (source-only).                     |
| `packages/design-tokens/`     | `@acronis-platform/design-tokens`        | **yes**   | DTCG-2025.10 design tokens (primitives / semantics / components). Data only. |
| `packages/design-assets/`     | `@acronis-platform/design-assets`        | **yes**   | Icon/illustration manifests + bundled binaries. Data only.                   |
| `packages/tokens-pd/`         | `@acronis-platform/tokens-pd`            | **yes**   | Generated per-brand CSS vars, per-component CSS, Tailwind presets, DTCG.     |
| `apps/docs/`                  | `@acronis-platform/uikit-docs`           | no        | Next.js 15 + Fumadocs documentation site.                                    |
| `tools/style-dictionary/`     | `@acronis-platform/style-dictionary`     | no        | Style Dictionary v5 build: `design-tokens` → `tokens-pd` CSS/presets.        |
| `tools/figma-icons-fetcher/`  | `@acronis-platform/figma-icons-fetcher`  | no        | Fetches + SVGO-optimizes icons from Figma into the `icons-svg*` packages.    |
| `tools/figma-token-exporter/` | `@acronis-platform/figma-token-exporter` | no        | Self-hosted Figma plugin + receiver that exports variables/styles to tokens. |

This table covers the workspaces relevant to consuming the kit. It omits the
demo apps, the `ui-spec` spike, and `packages/ui-legacy/`
(`@acronis-platform/shadcn-uikit`) — still published, but in
maintenance/freeze and available only while consumers migrate, per its
[deprecation notice](./packages/ui-legacy/README.md). See
[`AGENTS.md`](./AGENTS.md) for the full workspace map and the per-workspace
`AGENTS.md` files for area-specific conventions.

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x (see [`.nvmrc`](./.nvmrc); CI builds on Node 22)
- pnpm 10.27.0 — pinned via the root `packageManager` field, so
  `corepack enable` picks up the right version automatically

### Installation (development)

```bash
# Clone the repository
git clone https://github.com/acronis/uikit.git
cd uikit

# Install dependencies
pnpm install

# Build all packages
pnpm run build
```

### Exploring Components

- **[Storybook](https://acronis.github.io/uikit/storybook-react/)** — every
  component, all variants, light + dark.
- **[Documentation site](https://acronis.github.io/uikit/docs/)** — usage
  guides, API references, and patterns (Next.js + Fumadocs, `apps/docs`).

Run either locally instead:

```bash
# Storybook for @acronis-platform/ui-react
pnpm --filter @acronis-platform/ui-react storybook

# Documentation site (apps/docs)
pnpm --filter @acronis-platform/uikit-docs dev
```

## 📖 Usage (`@acronis-platform/ui-react`)

### Installation

```bash
pnpm add @acronis-platform/ui-react react react-dom
```

`react` and `react-dom` (`^18.2.0 || ^19.0.0`) are peer dependencies. The theme
layer (`@acronis-platform/tokens-pd`) and icons (`@acronis-platform/icons-react`)
ship as direct dependencies, so no extra install is needed.

### Import Styles

Import the pre-built stylesheet once at your application entry point. It bundles
the `--ui-*` token layer and all component CSS — no Tailwind installation
required:

```typescript
// main.tsx or App.tsx
import '@acronis-platform/ui-react/styles';
```

### Using Components

All components are exported from the package root:

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Input,
  Label,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@acronis-platform/ui-react';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>This is an informational message.</AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button>Submit</Button>
        <Badge variant="secondary">New</Badge>
      </CardFooter>
    </Card>
  );
}
```

> **Aliases:** `Input`/`Search`/`Textarea` are aliases of the full-field
> components `InputText`/`InputSearch`/`InputTextArea`, and `Badge` is an alias
> of the design-system-native `Tag`.

### Available Components

The library covers layout (`AppShell`, `AppShellChat`, `AuthLayout`, `Card`,
`CardFilter`, `Grid`, `Stack`, `Section`, `PageContent`, `PageHeader`,
`Separator`, `ScrollArea`, `Resizable`, `Toolbar`), navigation (`Breadcrumb`,
`Tabs`, `Pagination`, `SidebarPrimary`, `SidebarSecondary`, `SearchGlobal`,
`Link`), forms (`InputText`, `InputSearch`, `InputTextArea`, `InputSelect`,
`InputDatePicker`, `InputPassword`, `InputOTP`, `Combobox`, `Select`,
`Checkbox`, `Radio`, `Switch`, `Slider`, `NumberField`, `Calendar`,
`DateRangePicker`, `Field`, `Form`, `Label`), buttons (`Button`, `ButtonIcon`,
`ButtonMenu`), overlays (`Dialog`, `Sheet`, `Popover`, `Tooltip`,
`DropdownMenu`), feedback (`Alert`, `Tag`/`Badge`, `Chip`, `Progress`,
`ProgressCircle`, `Loading`, `Skeleton`, `Toast`, `Empty`), data display
(`Table`, `DataTable`, `Avatar`, `DescriptionList`, `Accordion`,
`Collapsible`, `Timeline`, `ToggleGroup`), and data visualization (`Chart` and
per-type charts — `AreaChart`, `BarChart`, `LineChart`, `PieChart`,
`ComposedChart`, `RadarChart`, `RadialBarChart`, `ScatterChart`,
`FunnelChart`, `SankeyChart`, `Histogram`, `Treemap` — plus dashboard
readouts `Meter`, `Metric`, `TrendIndicator`, `CategoryBar`,
`WidgetPlaceholder`). See the full export surface in
[`packages/ui-react/src/index.ts`](./packages/ui-react/src/index.ts).

Icons are provided by [`@acronis-platform/icons-react`](./packages/icons-react).

### Package Exports

```typescript
// Main entry — all components + the `cn` utility
import { Button, cn } from '@acronis-platform/ui-react';

// React-only entry
import { Button } from '@acronis-platform/ui-react/react';

// Pre-built CSS (token layer + component styles)
import '@acronis-platform/ui-react/styles';
```

### TypeScript Support

The library is fully typed:

```tsx
import type { ButtonProps, CardProps } from '@acronis-platform/ui-react';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

### Utility Functions

```typescript
import { cn } from '@acronis-platform/ui-react';

// Merge class names
const className = cn(
  'base-class',
  condition && 'conditional-class',
  'another-class'
);
```

## 🎨 Styling & Theming

Tailwind CSS is used **internally** as a build-time tool to compile component
styles. It is **not** part of the public API — the library ships standard,
pre-built CSS, so consumers can use any styling solution (CSS Modules, SCSS,
plain CSS, Tailwind of any version, etc.). No Tailwind installation is
required to consume the kit.

### Tokens

The library is themed entirely by `--ui-*` CSS custom properties from
`@acronis-platform/tokens-pd`, which are generated from
`@acronis-platform/design-tokens` via `@acronis-platform/style-dictionary`. The
token layer ships inside `@acronis-platform/ui-react/styles`; light/dark and
per-brand values are driven by CSS variables (zero JavaScript overhead,
SSR-compatible). Override the `--ui-*` variables to customize.

The token pipeline (and the Figma sync used to refresh it) is documented in the
workspace docs for [`design-tokens`](./packages/design-tokens/AGENTS.md) and
[`tokens-pd`](./packages/tokens-pd/AGENTS.md).

### Fonts

The design tokens use **Inter** as the default family, and the generated CSS
emits a graceful fallback stack (`font-family: Inter, system-ui, sans-serif`).
The library deliberately **does not bundle the font** — loading it is the
consumer's choice, so you control hosting, subsets, and weights.

To render in Inter, self-host it (recommended — no third-party CDN,
GDPR-safe). [`@fontsource/inter`](https://fontsource.org/fonts/inter) (SIL
Open Font License) is the simplest route:

```bash
pnpm add @fontsource/inter
```

```tsx
// Load only the weights you use (the typography scale uses 400/500/600/700).
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@acronis-platform/ui-react/styles';
```

> The static `@fontsource/inter` registers the family as `Inter`, which
> matches the token output. The variable package `@fontsource-variable/inter`
> registers `Inter Variable` instead, so it won't match `font-family: Inter`
> without an extra alias — prefer the static package unless you add that
> mapping yourself.

If you skip this step, text falls back to `system-ui` / the platform
sans-serif.

### Breakpoints

`ui-react` pins its own viewport scale (Tailwind's `sm`/`md` stay at the
stock 640px/768px; `lg`/`xl`/`2xl`/`3xl`/`4xl` are overridden). The kit's own
components already use it; it's exposed two ways so you can match it in your
code and styles:

```ts
import {
  BREAKPOINT_LG, // 1024px
  BREAKPOINT_XL, // 1280px
  BREAKPOINT_2XL, // 1440px
  BREAKPOINT_3XL, // 1680px
  BREAKPOINT_4XL, // 1920px
  getViewportWidth, // SSR-safe window.innerWidth read
} from '@acronis-platform/ui-react';
```

- **JS constants** (above) — for conditional logic in your own code (e.g.
  deciding what to render at a given width).
- **`--ui-breakpoint-lg/xl/2xl/3xl/4xl`** CSS custom properties — for sizing
  an element to match a breakpoint outside a media query (e.g.
  `max-width: var(--ui-breakpoint-lg)`).

> **Building your own styles with Tailwind?** Importing the kit's stylesheet
> does **not** configure your Tailwind build. The published CSS is already
> compiled, so the `@theme` block that registers these breakpoints is gone by
> the time you import it — the values survive only as inert `:root` custom
> properties. Your `lg:`/`xl:` happen to match Tailwind's stock scale, but
> `2xl:` silently compiles to Tailwind's 1536px instead of the kit's 1440px,
> and `3xl:`/`4xl:` don't resolve at all. Redeclare the values above in your
> own `@theme` block to stay in sync.

### Icon Sizing

[`@acronis-platform/icons-react`](./packages/icons-react) components take a
strict `size` prop — the only dimensions design-assets defines for the pack
(today `16 | 24`, default `24`), each with its own hand-tuned artwork and
stroke width:

```tsx
import { BoltIcon } from '@acronis-platform/icons-react/stroke-mono';

<BoltIcon size={16} title="Power" />;
```

To size the box an icon sits in (e.g. a button's icon slot), size that
container with CSS — don't scale the SVG itself.

## 🏗️ Project Structure

```
uikit/
├── apps/                       # Deployed apps (private)
│   └── docs/                   # Next.js + Fumadocs (@acronis-platform/uikit-docs)
├── packages/                   # Published libraries + design data
│   ├── ui-react/               # Base UI library    (@acronis-platform/ui-react)
│   ├── icons-react/            # React icons        (@acronis-platform/icons-react)
│   ├── icons-sprite/           # SVG sprites        (@acronis-platform/icons-sprite)
│   ├── icons-svg/              # Raw SVG sources    (@acronis-platform/icons-svg)
│   ├── icons-svg-next/         # Next-gen SVG sources
│   ├── design-tokens/          # DTCG tokens (data) (@acronis-platform/design-tokens)
│   ├── design-assets/          # Asset manifests    (@acronis-platform/design-assets)
│   └── tokens-pd/              # Generated CSS/Tailwind (@acronis-platform/tokens-pd)
├── tools/                      # Private build tooling
│   ├── style-dictionary/       # design-tokens → tokens-pd CSS/presets
│   ├── figma-icons-fetcher/    # Figma → icons-svg* SVG fetcher
│   └── figma-token-exporter/   # Figma plugin + receiver → token snapshot
├── context/                    # Cross-workspace docs (conventions, commits, releasing)
├── .changeset/                 # Pending changesets (each PR adds one)
├── .github/workflows/          # ci, release, demo-deploy, visual-regression
├── AGENTS.md                   # Full workspace map (for AI agents + humans)
├── package.json                # Workspace root: scripts + shared devDeps
├── pnpm-workspace.yaml         # pnpm workspaces + dependency catalog
└── README.md
```

> Abridged: this tree leaves out the workspaces you don't need in order to
> consume the library — the demo apps, the `ui-spec` spike, the deprecated
> `packages/ui-legacy/`, and some internal tooling. See
> [`AGENTS.md`](./AGENTS.md) for the full map.

## 🛠️ Scripts

All commands run from the repo root unless noted otherwise. Every workspace
exposes the same vocabulary, so `pnpm -r <name>` is reliable.

| Script                                     | What it does                                                |
| ------------------------------------------ | ----------------------------------------------------------- |
| `pnpm -r dev` / `pnpm --filter <name> dev` | Run the dev server / watcher for one or all workspaces      |
| `pnpm -r build`                            | Build every package in topological order (ui → demo/docs)   |
| `pnpm -r test`                             | Run the test suite once across all workspaces               |
| `pnpm -r test:watch`                       | Run tests in watch mode                                     |
| `pnpm -r lint` / `pnpm -r lint:fix`        | ESLint across all workspaces                                |
| `pnpm -r typecheck`                        | `tsc --noEmit` across all workspaces                        |
| `pnpm format` / `pnpm format:check`        | Prettier write / check from the repo root                   |
| `pnpm -r clean`                            | Delete `dist/`, `.next/`, `storybook-static/`, etc.         |
| `pnpm changeset`                           | Add a changeset for a PR that changes a published workspace |

To run a single workspace, prefix with `pnpm --filter <package-name>`:

```bash
pnpm --filter @acronis-platform/uikit-docs dev
pnpm --filter @acronis-platform/ui-react storybook
```

The root also exposes token-pipeline shortcuts: `pnpm sd` (build all Style
Dictionary targets), `pnpm sd:tokens` / `pnpm sd:assets` (subsets), and
`pnpm tokens:sync` (re-emit `design-tokens` then rebuild `tokens-pd`).

## 🚢 Releasing

Releases are driven by [changesets](https://github.com/changesets/changesets).
Every PR that changes a published workspace's released surface should include a
`.changeset/*.md` file describing the bump:

```bash
pnpm changeset
```

On merge to `main`, the **Release** workflow opens (or updates) a single
"Version Packages" PR aggregating all pending changesets. Merging that PR
publishes to **npm** and **GitHub Packages** and creates the corresponding
**GitHub Release**, which in turn triggers the **Demo & Storybook Pages
deploy**. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full flow.

## 🚀 Quick Reference

### Complete Setup Example

```tsx
// main.tsx
import '@acronis-platform/ui-react/styles';

// App.tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@acronis-platform/ui-react';

export function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My App</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## 📚 Documentation

- [`AGENTS.md`](./AGENTS.md) — authoritative workspace map + conventions
- [ui-react package](./packages/ui-react) — the Base UI component library
- [Storybook](https://acronis.github.io/uikit/storybook-react/) — live component gallery
- [Documentation site](https://acronis.github.io/uikit/docs/) — usage guides + API reference (source: [`apps/docs`](./apps/docs))
- [design-tokens](./packages/design-tokens/AGENTS.md) / [tokens-pd](./packages/tokens-pd/AGENTS.md) — token pipeline

## 📝 License

MIT License — Copyright (c) 2026 Acronis International GmbH

See [LICENSE](./LICENSE) for more details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [Base UI](https://base-ui.com/) — unstyled primitives
- [Tailwind CSS](https://tailwindcss.com/) — internal build tool
- [DTCG](https://www.designtokens.org/) — design token format used by `design-tokens`
