# Shadcn UIKit

A monorepo containing 40+ custom UI components built on [shadcn/ui](https://ui.shadcn.com/) principles, with multiple themes, pre-built CSS, and interactive demos.

**Architecture in brief:** Components are built on [Base UI](https://base-ui.com/) (and partially Radix UI) unstyled primitives. Tailwind CSS is used **internally** to compile styles — consumers receive fully pre-built CSS and can use any styling solution in their own project (CSS Modules, SCSS, a design system token layer, plain CSS, etc.). No Tailwind installation required.

## 📦 Packages

### [@acronis-platform/shadcn-uikit](./packages/legacy/ui) (v0.34.0)

The core UI component library. Ships pre-built CSS — consumers do **not** need Tailwind CSS installed.

**Peer dependencies:**

- `react` ^18.2.0 || ^19.0.0
- `react-dom` ^18.2.0 || ^19.0.0
- `tw-animate-css` ^1.4.0

### [@acronis-platform/shadcn-uikit-demo](./apps/demo)

Interactive demo application showcasing all components with multiple themes.

**Features:**

- Component playground
- Live theme switching
- Responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+

### Installation (development)

```bash
# Clone the repository
git clone https://github.com/acronis/shadcn-uikit.git
cd shadcn-uikit

# Install dependencies
pnpm install

# Build all packages
pnpm run build
```

### Running the Demo

```bash
# Start the demo application
cd apps/demo
pnpm run dev
```

The demo will be available at `http://localhost:3000`.

## 📖 Usage

### Installation

```bash
npm install @acronis-platform/shadcn-uikit tw-animate-css
# or
pnpm add @acronis-platform/shadcn-uikit tw-animate-css
# or
yarn add @acronis-platform/shadcn-uikit tw-animate-css
```

> **Note:** `tw-animate-css` is a required peer dependency. It replaces the older `tailwindcss-animate` package.

### Import Styles

Import the main stylesheet in your application entry point. This includes the default theme, base styles, components, and utilities — all pre-built:

```typescript
// main.tsx or App.tsx
import '@acronis-platform/shadcn-uikit/styles';
```

No Tailwind CSS installation is needed. The package ships fully compiled CSS.

### Initialize Theme System (Optional)

For theme switching, dark mode support, and persistence:

```typescript
import { initializeThemeSystem } from '@acronis-platform/shadcn-uikit';

// Initialize on app startup
initializeThemeSystem();
```

### Using Components

All components are exported from the main package:

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
} from '@acronis-platform/shadcn-uikit';

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

### Available Components

The library includes 40+ components:

- **Layout**: Card, Separator, Sidebar, ScrollArea, ResizablePanel
- **Forms**: Input, Textarea, Select, Checkbox, RadioGroup, Switch, Label, Form, PasswordInput
- **Buttons**: Button, ButtonGroup
- **Navigation**: NavigationMenu, Breadcrumb, Tabs, Pagination, SecondaryMenu
- **Overlays**: Dialog, Sheet, Drawer, Popover, Tooltip, AlertDialog
- **Feedback**: Alert, Badge, Chip, Tag, Progress, Spinner, Toast (Sonner)
- **Data Display**: Table, DataTable, Tree, Avatar, Calendar, DatePicker
- **Advanced**: Combobox, Command, Filter, Chart, Empty, Carousel, Collapsible, Accordion
- **Icons**: 1500+ internal icons via `BaseIcon` + auto-generated components

### Package Exports

#### JavaScript

```typescript
// Main entry — all components + utilities
import { Button } from '@acronis-platform/shadcn-uikit';

// React-only entry (same content)
import { Button } from '@acronis-platform/shadcn-uikit/react';

// Individual components (tree-shakeable)
import { Button } from '@acronis-platform/shadcn-uikit/components/Button';

// Tailwind preset (for consumers extending Tailwind — requires Tailwind v4)
import preset from '@acronis-platform/shadcn-uikit/tailwind-preset';
```

#### CSS

```typescript
// Default theme + base + components + utilities (most consumers use this)
import '@acronis-platform/shadcn-uikit/styles';

// Everything including all themes
import '@acronis-platform/shadcn-uikit/styles/full';

// Granular imports
import '@acronis-platform/shadcn-uikit/styles/tokens';      // CSS variables only
import '@acronis-platform/shadcn-uikit/styles/base';         // Reset + base styles
import '@acronis-platform/shadcn-uikit/styles/components';   // Component styles only
import '@acronis-platform/shadcn-uikit/styles/utilities';    // Tailwind utility classes

// Individual themes
import '@acronis-platform/shadcn-uikit/styles/themes/acronis-default';
import '@acronis-platform/shadcn-uikit/styles/themes/acronis-ocean';
import '@acronis-platform/shadcn-uikit/styles/themes/cyber-chat';
import '@acronis-platform/shadcn-uikit/styles/themes/acronis-white-label';
```

### TypeScript Support

The library is fully typed with TypeScript:

```tsx
import type { ButtonProps, CardProps } from '@acronis-platform/shadcn-uikit';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

### Utility Functions

```typescript
import { cn } from '@acronis-platform/shadcn-uikit';

// Merge class names
const className = cn('base-class', condition && 'conditional-class', 'another-class');
```

## ⚡ Tailwind CSS v4 — Notes for Consumers

This package uses **Tailwind CSS v4** as a build-time tool to compile component styles. The output is standard CSS — consumers are free to use any styling solution in their own projects.

### Styling philosophy

Tailwind is **not** part of the public API. The package ships pre-built CSS files. In your application you can use:

- CSS Modules or SCSS files with your own design system tokens
- A dedicated token/theme layer (CSS custom properties)
- Tailwind CSS (any version), Vanilla Extract, styled-components, or any other solution
- Plain CSS

The component styles, themes, and design tokens are all available as standalone CSS imports — no Tailwind processing needed at your end.

### Pre-built CSS consumers (the majority)

**Zero impact.** Import `@acronis-platform/shadcn-uikit/styles` as before. No Tailwind installation needed on your side.

### `tw-animate-css` peer dependency (required)

The `tw-animate-css` package replaces the older `tailwindcss-animate` (from Tailwind v3). Install it alongside the UI kit:

```bash
npm install tw-animate-css
```

If you previously had `tailwindcss-animate` as a dependency only for this UI kit, you can remove it.

### Tailwind preset users (`./tailwind-preset` export)

If you use the `@acronis-platform/shadcn-uikit/tailwind-preset` export in your own Tailwind build, you must upgrade to **Tailwind CSS v4**:

- Install `@tailwindcss/postcss` and `tailwindcss ^4.x`
- Update your PostCSS configuration accordingly
- See the [Tailwind CSS v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) for details

### Existing Tailwind v3 consumers using pre-built CSS

No direct conflict. However, the pre-built CSS uses Tailwind v4's `@layer` cascade layers, which may interact with a v3 Tailwind build if both are present in the same page. **Recommended:** avoid running Tailwind v3 over the pre-built CSS output.

## 🎨 Themes

### Built-in Themes

1. **Acronis Default** — standard Acronis brand colors (included by default)
2. **Acronis Ocean** — alternative blue-focused theme with deeper ocean tones
3. **Cyber Chat** — theme for the Cyber Chat product
4. **Acronis White Label** — white-label theme for partner customization

### Theme Features

- ✅ **Light & Dark modes** — all themes support both modes via CSS variables
- ✅ **CSS-based** — zero JavaScript overhead
- ✅ **Tree-shakeable** — import only themes you use
- ✅ **Customizable** — override CSS variables or create custom themes
- ✅ **SSR-compatible** — works with server-side rendering

### Theme Switching

Switch themes programmatically:

```typescript
import { applyTheme, applyColorMode, toggleColorMode } from '@acronis-platform/shadcn-uikit';

// Switch to ocean theme
applyTheme('acronis-ocean');

// Toggle dark mode
toggleColorMode();

// Or set specific mode
applyColorMode('dark');
applyColorMode('light');
applyColorMode('system'); // Follow system preference
```

#### Shadow DOM / Embedded Containers

When the app renders inside a shadow root (e.g. via module federation), theme classes must also be applied to the inner container element — not just `document.documentElement` — because CSS inside a shadow root uses `:host` selectors that don't inherit from the document.

Pass additional container elements via the `extraRoots` parameter:

```typescript
import { applyTheme, applyNavVariant } from '@acronis-platform/shadcn-uikit';

const innerContainer = document.getElementById('app-container');
applyTheme('acronis-ocean', true, innerContainer ? [innerContainer] : []);

// Same for white-label nav variants
applyNavVariant('ingram-micro', true, innerContainer ? [innerContainer] : []);
```

Both `applyTheme` and `applyNavVariant` accept the same optional parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `theme` / `variant` | `ThemeName` / `WhiteLabelNavVariant` | — | The theme or variant to apply |
| `persist` | `boolean` | `true` | Whether to persist the choice to `localStorage` |
| `extraRoots` | `HTMLElement[]` | `[]` | Additional elements to receive the same theme classes |

### Using Alternative Themes

Import additional theme CSS, then apply:

```typescript
// Import ocean theme
import '@acronis-platform/shadcn-uikit/styles/themes/acronis-ocean';

// Then apply it
import { applyTheme } from '@acronis-platform/shadcn-uikit';
applyTheme('acronis-ocean');
```

### Creating Custom Themes

Create custom themes by copying the template file and customizing colors:

```bash
# See packages/legacy/ui/src/styles/themes/_template.scss for the template
```

See [Theme Documentation](./apps/docs/THEMES.md) for details.

## 🏗️ Project Structure

```
shadcn-uikit/
├── apps/
│   ├── demo/                  # Vite demo app (@acronis-platform/shadcn-uikit-demo)
│   ├── demos/                 # Shared demo components (@acronis-platform/shadcn-uikit-demos)
│   └── docs/                  # Fumadocs documentation site (@acronis-platform/shadcn-uikit-docs)
├── packages/
│   └── legacy/
│       └── ui/                # Published library (@acronis-platform/shadcn-uikit)
│           ├── src/           # React components, hooks, lib, styles, types, utils
│           ├── docker-compose.storybook.yml      # Storybook visual-regression compose
│           ├── Dockerfile.storybook              # ... and its image
│           └── package.json
├── .changeset/                # Pending changesets (each PR adds one)
├── .github/workflows/         # ci.yml, release.yml, demo-deploy.yml, visual-regression.yml
├── .husky/                    # Git hooks (managed by Husky)
├── package.json               # Workspace root: scripts + shared devDeps
├── pnpm-workspace.yaml        # pnpm workspaces + dependency catalog
└── README.md
```

## 🛠️ Scripts

All commands run from the repo root unless noted otherwise. Every workspace
exposes the same vocabulary, so `pnpm -r <name>` is reliable.

| Script | What it does |
|---|---|
| `pnpm -r dev` / `pnpm --filter <name> dev` | Run the dev server / watcher for one or all workspaces |
| `pnpm -r build` | Build every package in topological order (ui → demo/docs) |
| `pnpm -r test` | Run the test suite once across all workspaces |
| `pnpm -r test:watch` | Run tests in watch mode |
| `pnpm -r lint` / `pnpm -r lint:fix` | ESLint across all workspaces |
| `pnpm -r typecheck` | `tsc --noEmit` across all workspaces |
| `pnpm format` / `pnpm format:check` | Prettier write / check from the repo root |
| `pnpm -r clean` | Delete `dist/`, `.next/`, `storybook-static/`, etc. |
| `pnpm changeset` | Add a changeset for a PR that changes the published UI library |

To run a single workspace, prefix with `pnpm --filter <package-name>`:

```bash
pnpm --filter @acronis-platform/shadcn-uikit-docs dev
pnpm --filter @acronis-platform/shadcn-uikit storybook
```

## 🚢 Releasing

Releases are driven by [changesets](https://github.com/changesets/changesets).
Every PR that changes `@acronis-platform/shadcn-uikit` should include a
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
import '@acronis-platform/shadcn-uikit/styles';
import { initializeThemeSystem } from '@acronis-platform/shadcn-uikit';

initializeThemeSystem();

// App.tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@acronis-platform/shadcn-uikit';

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

- [Tree-Shaking & Performance](./apps/docs/TREE_SHAKING.md) — bundle optimization guide
- [Theme System Guide](./apps/docs/THEMES.md) — complete theme usage guide
- [Theme Build Configuration](./apps/docs/THEME_BUILD.md) — build setup details
- [Theme Architecture](./apps/demo/docs/THEME_ARCHITECTURE.md) — token system architecture
- [UI Package Documentation](./packages/legacy/ui/README.md)
- [Demo Package Documentation](./apps/demo/README.md)

## 📝 License

MIT License — Copyright (c) 2026 Acronis International GmbH

See [LICENSE](./LICENSE) for more details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [shadcn/ui](https://ui.shadcn.com/) — the original inspiration
- [Base UI](https://base-ui.com/) — unstyled primitives (primary)
- [Radix UI](https://www.radix-ui.com/) — unstyled primitives (NavigationMenu, Slot)
- [Tailwind CSS](https://tailwindcss.com/) — internal build tool
